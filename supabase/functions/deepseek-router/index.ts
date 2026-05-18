// supabase/functions/deepseek-router/index.ts
// Supabase Edge Function — Proxy seguro para la API de DeepSeek
// Deploy: supabase functions deploy deepseek-router
// Secret: supabase secrets set DEEPSEEK_API_KEY=sk-your-key

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

const ALLOWED_ORIGINS = [
  "https://space.sypablitodp.site",
  "https://dppablito4-oss.github.io",
  "http://localhost:5173",
  "http://localhost:4173",
];

const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
};

interface RequestBody {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  system?: string;
}

Deno.serve(async (req: Request) => {
  // ── Preflight CORS ────────────────────────────────────────
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  // ── Solo POST ─────────────────────────────────────────────
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Método no permitido. Usa POST." }),
      { status: 405, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
    );
  }

  try {
    // ── Obtener API Key de los secrets ──────────────────────
    const apiKey = Deno.env.get("DEEPSEEK_API_KEY");
    if (!apiKey) {
      throw new Error(
        "DEEPSEEK_API_KEY no configurada. Ejecuta: supabase secrets set DEEPSEEK_API_KEY=sk-xxx"
      );
    }

    // ── Parsear body ────────────────────────────────────────
    const body: RequestBody = await req.json();

    if (!body.prompt || typeof body.prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "El campo 'prompt' es requerido y debe ser un string." }),
        { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    // ── Construir payload para DeepSeek ─────────────────────
    const payload = {
      model: body.model || "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            body.system ||
            "Eres un asistente inteligente y conciso. Responde en español a menos que se indique lo contrario.",
        },
        {
          role: "user",
          content: body.prompt,
        },
      ],
      temperature: body.temperature ?? 0.6,
      max_tokens: body.max_tokens ?? 2048,
      stream: false,
    };

    // ── Petición a DeepSeek ─────────────────────────────────
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[DeepSeek Error] ${response.status}: ${errorText}`);
      return new Response(
        JSON.stringify({
          error: "Error en la API de DeepSeek",
          status: response.status,
          detail: errorText,
        }),
        { status: response.status, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    // ── Extraer respuesta limpia ────────────────────────────
    const reply = data.choices?.[0]?.message?.content || "";
    const usage = data.usage || {};

    return new Response(
      JSON.stringify({
        reply,
        model: data.model,
        usage: {
          prompt_tokens: usage.prompt_tokens,
          completion_tokens: usage.completion_tokens,
          total_tokens: usage.total_tokens,
        },
      }),
      {
        status: 200,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[deepseek-router]", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Error interno del servidor",
      }),
      { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
    );
  }
});
