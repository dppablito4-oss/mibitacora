import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import { Sparkles, Loader2, Copy, CheckCircle } from 'lucide-react';

export default function AiGeneratorPanel({ onApply }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [generationsLeft, setGenerationsLeft] = useState(2);
  const [copied, setCopied] = useState(false);
  const [manualJson, setManualJson] = useState('');

  // Cargar usos restantes del LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('triptico_ai_uses');
    if (saved) {
      setGenerationsLeft(parseInt(saved));
    } else {
      localStorage.setItem('triptico_ai_uses', '2');
    }
  }, []);

  const generateWithDeepSeek = async () => {
    if (!topic.trim() || generationsLeft <= 0) return;
    setLoading(true);

    try {
      const promptText = `Genera el contenido para un tríptico sobre el tema: "${topic}".
Debes devolver ÚNICAMENTE un objeto JSON válido con la siguiente estructura estricta, sin markdown, sin explicaciones, solo el JSON:
{
  "pages": [
    {
      "id": "page-front",
      "bgColor": "#ffffff",
      "elements": [
        {"type": "text", "content": "TÍTULO DEL TEMA", "x": 68, "y": 20, "w": 30, "h": 20, "style": {"fontSize": 48, "color": "#000000", "fontWeight": "900", "textAlign": "center"}},
        {"type": "text", "content": "PORTADA", "x": 68, "y": 10, "w": 30, "h": 5, "style": {"fontSize": 14, "color": "#666666", "textAlign": "center"}},
        {"type": "text", "content": "Resumen corto que va en la contraportada (centro).", "x": 35, "y": 30, "w": 30, "h": 40, "style": {"fontSize": 16, "color": "#333333"}}
      ]
    },
    {
      "id": "page-back",
      "bgColor": "#f8fafc",
      "elements": [
        {"type": "text", "content": "Presentación", "x": 2, "y": 10, "w": 30, "h": 5, "style": {"fontSize": 24, "color": "#000000", "fontWeight": "700"}},
        {"type": "text", "content": "Texto de presentación detallado aquí...", "x": 2, "y": 20, "w": 30, "h": 60, "style": {"fontSize": 14, "color": "#444444"}},
        {"type": "text", "content": "Subtema 1", "x": 35, "y": 10, "w": 30, "h": 5, "style": {"fontSize": 24, "color": "#000000", "fontWeight": "700"}},
        {"type": "text", "content": "Contenido del subtema 1...", "x": 35, "y": 20, "w": 30, "h": 60, "style": {"fontSize": 14, "color": "#444444"}},
        {"type": "text", "content": "Conclusión", "x": 68, "y": 10, "w": 30, "h": 5, "style": {"fontSize": 24, "color": "#000000", "fontWeight": "700"}},
        {"type": "text", "content": "Texto de conclusión...", "x": 68, "y": 20, "w": 30, "h": 60, "style": {"fontSize": 14, "color": "#444444"}}
      ]
    }
  ]
}

Asegúrate de llenar los textos con información real y coherente sobre el tema indicado. Puedes ajustar las coordenadas "y" o "h" si el texto es muy largo.`;

      const { data, error } = await supabase.functions.invoke('deepseek-router', {
        body: {
          cotizacion_id: 0, // Bypass
          prompt: promptText,
          system: "Eres un generador estricto de JSON. Devuelve solo el JSON válido."
        }
      });

      if (error) throw error;

      // Intentar parsear
      let jsonStr = data.reply;
      // Limpiar markdown si la IA fue terca
      if (jsonStr.includes('```json')) {
        jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
      }
      
      const parsed = JSON.parse(jsonStr);
      onApply(parsed);

      // Descontar uso
      const left = generationsLeft - 1;
      setGenerationsLeft(left);
      localStorage.setItem('triptico_ai_uses', left.toString());

    } catch (err) {
      console.error('Error generando tríptico:', err);
      alert('Error al generar con IA. Intenta con la opción manual.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = () => {
    const prompt = `Actúa como un diseñador de trípticos. Genera el contenido para un tríptico sobre el tema: "${topic}".
Debes devolver ÚNICAMENTE un objeto JSON válido con la siguiente estructura estricta, sin markdown, sin explicaciones:
{ "pages": [ { "id": "page-front", "bgColor": "#ffffff", "elements": [ {"type": "text", "content": "PORTADA", "x": 68, "y": 10, "w": 30, "h": 20, "style": {"fontSize": 48}} ] }, { "id": "page-back", "bgColor": "#f8fafc", "elements": [ {"type": "text", "content": "CONTENIDO", "x": 5, "y": 10, "w": 30, "h": 80, "style": {"fontSize": 14}} ] } ] }
Rellena con datos reales. Mantén las "x" en 2, 35 y 68 para respetar las 3 columnas.`;
    
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyManualJson = () => {
    try {
      const parsed = JSON.parse(manualJson);
      onApply(parsed);
      setManualJson('');
    } catch (e) {
      alert('JSON Inválido. Asegúrate de copiarlo correctamente.');
    }
  };

  return (
    <div className="p-4 bg-zinc-900 border-b border-zinc-800">
      <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Sparkles size={14} className="text-cyan-400" />
        Generador IA
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] text-zinc-500 mb-1 font-bold">TEMA DEL TRÍPTICO</label>
          <input 
            type="text" 
            placeholder="Ej. El Calentamiento Global"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white"
          />
        </div>

        {generationsLeft > 0 ? (
          <div>
            <button
              onClick={generateWithDeepSeek}
              disabled={loading || !topic.trim()}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded text-sm flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Generar Automáticamente'}
            </button>
            <p className="text-[10px] text-zinc-500 text-center mt-2">
              Te quedan {generationsLeft} generaciones gratuitas hoy.
            </p>
          </div>
        ) : (
          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
            <p className="text-[10px] text-amber-400 font-bold mb-2">¡Límite gratuito alcanzado!</p>
            <p className="text-[10px] text-zinc-400 mb-3">
              Copia el prompt, pégalo en ChatGPT o Claude, y pega el JSON resultante abajo.
            </p>
            <button
              onClick={handleCopyPrompt}
              disabled={!topic.trim()}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2 px-4 rounded text-xs flex items-center justify-center gap-2 transition-colors mb-3"
            >
              {copied ? <CheckCircle size={14} className="text-green-400"/> : <Copy size={14} />}
              {copied ? '¡Copiado!' : 'Copiar Prompt para IA Externa'}
            </button>

            <textarea
              value={manualJson}
              onChange={e => setManualJson(e.target.value)}
              placeholder='Pega el JSON aquí...'
              className="w-full h-24 bg-black border border-zinc-800 rounded p-2 text-[10px] font-mono text-zinc-400 mb-2 resize-none"
            />
            <button
              onClick={applyManualJson}
              disabled={!manualJson.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded text-xs transition-colors"
            >
              Aplicar Diseño
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
