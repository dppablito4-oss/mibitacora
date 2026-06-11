import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// CORS — solo dominios autorizados
const ALLOWED_ORIGINS = [
  "https://sypablitodp.site",
  "https://www.sypablitodp.site",
  "http://localhost:5173",
  "http://localhost:4173",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  // Manejo de la petición OPTIONS para CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { cotizacion_id, prompt, system } = await req.json();

    if (cotizacion_id === undefined || !prompt) {
      return new Response(
        JSON.stringify({ error: "Faltan parámetros requeridos: cotizacion_id o prompt" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (prompt.length > 4000) {
      return new Response(
        JSON.stringify({ error: "El prompt excede la longitud máxima permitida de 4000 caracteres." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    let user = null;

    // Solo exigimos autenticación si no es una petición pública (cotizacion_id !== 0)
    if (cotizacion_id !== 0) {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: "No autorizado. Token de sesión ausente." }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
        );
      }

      const supabaseClientAuth = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        { global: { headers: { Authorization: authHeader } } }
      );
      
      const { data: authData, error: authError } = await supabaseClientAuth.auth.getUser();
      if (authError || !authData.user) {
        return new Response(
          JSON.stringify({ error: "Token de sesión inválido o expirado." }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
        );
      }
      user = authData.user;
    }

    // Inicializar cliente Supabase con el Service Role Key
    // IMPORTANTE: Se usa service_role para tener permisos de insertar el mensaje del asistente
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Rate Limiting Check para mitigar abuso
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    const isAnonymous = cotizacion_id === 0 || !user;
    const maxRequests = isAnonymous ? 10 : 60; // 10 peticiones para anónimos, 60 para autenticados
    const windowMinutes = 60; // Ventana de 1 hora

    const { data: allowed, error: limitError } = await supabaseClient.rpc('check_rate_limit', {
      p_ip: clientIp,
      p_user_id: user?.id || null,
      p_action: 'deepseek_chat',
      p_max_requests: maxRequests,
      p_window_minutes: windowMinutes
    });

    if (limitError) {
      console.error("Error al verificar rate-limit:", limitError);
      // Failsafe: dejamos pasar la petición si falla el rate-limit en la DB
    } else if (allowed === false) {
      return new Response(
        JSON.stringify({ error: "Límite de solicitudes de chat excedido. Por favor intenta más tarde." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 429 }
      );
    }

    // Verificar que el usuario sea el dueño de la cotización o un admin
    if (cotizacion_id !== 0 && user) {
      const { data: quote, error: quoteError } = await supabaseClient
        .from('cotizaciones')
        .select('cliente_id')
        .eq('id', cotizacion_id)
        .single();
        
      if (quoteError || !quote) {
        return new Response(
          JSON.stringify({ error: "Cotización no encontrada o error de acceso." }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
        );
      }
      
      // Si no es el dueño, verificar si es admin consultando la tabla profiles
      if (quote.cliente_id !== user.id) {
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        const isAdmin = profile?.role === 'admin' || profile?.role === 'superadmin';
        if (!isAdmin) {
          return new Response(
            JSON.stringify({ error: "Acceso denegado. No eres el propietario de esta cotización." }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
          );
        }
      }
    }

    const apiKey = Deno.env.get("DEEPSEEK_API_KEY");
    if (!apiKey) {
      throw new Error("DEEPSEEK_API_KEY no está configurada");
    }

    let formattedHistory = [];
    
    if (cotizacion_id !== 0) {
      // Obtener historial de la base de datos (últimos 10 mensajes de esta cotización)
      const { data: historial, error: historyError } = await supabaseClient
        .from('mensajes_chat')
        .select('enviado_por, mensaje')
        .eq('cotizacion_id', cotizacion_id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (historyError) throw historyError;

      // Formatear historial para DeepSeek (API compatible con OpenAI)
      formattedHistory = (historial || []).reverse().map(msg => ({
        role: msg.enviado_por === 'cliente' ? 'user' : 'assistant',
        content: msg.mensaje
      }));
    }

    // Asegurar que el modelo siempre tenga reglas para responder en JSON
    const defaultJsonInstruction = `\nREGLA CRÍTICA: Responde SIEMPRE con un objeto JSON válido con la propiedad "message" (y "intent", "tool_name", "action", "ui_state" si aplica). Ejemplo: {"message": "Hola"}`;
    const safeSystemPrompt = system ? system : "Eres P.A.B.L.O., el asistente virtual táctico de la bitácora de Pablo DP.";
    const finalSystemPrompt = safeSystemPrompt.includes("JSON") ? safeSystemPrompt : safeSystemPrompt + defaultJsonInstruction;

    // Construir mensajes para la API
    const messages = [
      { role: "system", content: finalSystemPrompt },
      ...formattedHistory
    ];
    
    if (cotizacion_id === 0) {
      messages.push({ role: "user", content: prompt });
    }

    console.log("Enviando petición a DeepSeek para cotizacion_id:", cotizacion_id);

    // Timeout control (45 seconds) to prevent 504 Edge Function hangs
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    let response;
    try {
      // Llamada a la API de DeepSeek-V3
      response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "deepseek-chat", // DeepSeek-V3
          messages: messages,
          temperature: 0.7,
          max_tokens: 2048,
          response_format: { type: 'json_object' }
        })
      });
    } catch (fetchErr) {
      if (fetchErr.name === 'AbortError') {
        throw new Error("Timeout: La API de DeepSeek tardó demasiado en responder.");
      }
      throw fetchErr;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API Error:", errorText);
      throw new Error(`DeepSeek API devolvió error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const assistantReply = data.choices?.[0]?.message?.content;

    if (!assistantReply) {
      throw new Error("Respuesta inválida de la API de DeepSeek");
    }

    // Interceptar herramientas del sistema en el Edge Function
    try {
      const parsedReply = JSON.parse(assistantReply);
      if (user && parsedReply.tool_name === 'save_note' && parsedReply.ui_state?.note_content) {
        const { error: noteError } = await supabaseClient
          .from('alpha_notes')
          .insert({
            user_id: user.id,
            note_content: parsedReply.ui_state.note_content
          });
        
        if (noteError) {
          console.error("Error guardando nota de A.L.P.H.A.:", noteError);
        } else {
          console.log("Nota guardada en DB exitosamente:", parsedReply.ui_state.note_content);
        }
      }
    } catch (e) {
      // Si no es JSON o falla, lo ignoramos y seguimos
    }

    if (cotizacion_id !== 0) {
      // Insertar la respuesta del asistente en la tabla mensajes_chat
      const { error: insertError } = await supabaseClient
        .from('mensajes_chat')
        .insert({
          cotizacion_id,
          enviado_por: 'asistente_ai',
          mensaje: assistantReply
        });

      if (insertError) {
        console.error("Error guardando respuesta en Supabase:", insertError);
        throw insertError;
      }
    }

    // Devolver la respuesta al cliente
    return new Response(
      JSON.stringify({ success: true, reply: assistantReply }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error en Edge Function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
