import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Manejo de la petición OPTIONS para CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { cotizacion_id, prompt, system } = await req.json();

    if (!cotizacion_id || !prompt) {
      return new Response(
        JSON.stringify({ error: "Faltan parámetros requeridos: cotizacion_id o prompt" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Inicializar cliente Supabase con el Service Role Key
    // IMPORTANTE: Se usa service_role para tener permisos de insertar el mensaje del asistente
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const apiKey = Deno.env.get("DEEPSEEK_API_KEY");
    if (!apiKey) {
      throw new Error("DEEPSEEK_API_KEY no está configurada");
    }

    // Obtener historial de la base de datos (últimos 10 mensajes de esta cotización)
    const { data: historial, error: historyError } = await supabaseClient
      .from('mensajes_chat')
      .select('enviado_por, mensaje')
      .eq('cotizacion_id', cotizacion_id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (historyError) throw historyError;

    // Formatear historial para DeepSeek (API compatible con OpenAI)
    const formattedHistory = (historial || []).reverse().map(msg => ({
      role: msg.enviado_por === 'cliente' ? 'user' : 'assistant',
      content: msg.mensaje
    }));

    // Construir mensajes para la API
    const messages = [
      { role: "system", content: system || "Eres P.A.B.L.O., el asistente virtual táctico de la bitácora de Pablo DP." },
      ...formattedHistory
    ];

    console.log("Enviando petición a DeepSeek para cotizacion_id:", cotizacion_id);

    // Llamada a la API de DeepSeek-V3
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat", // DeepSeek-V3
        messages: messages,
        temperature: 0.7,
        max_tokens: 1500
      })
    });

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
