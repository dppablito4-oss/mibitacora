import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import { Sparkles, Loader2, Copy, CheckCircle } from 'lucide-react';

export default function AiGeneratorPanel({ onApply }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [generationsLeft, setGenerationsLeft] = useState(2);
  const [copied, setCopied] = useState(false);
  const [manualJson, setManualJson] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('triptico_ai_uses');
    if (saved) {
      setGenerationsLeft(parseInt(saved));
    } else {
      localStorage.setItem('triptico_ai_uses', '2');
    }
  }, []);

  const PROMPT_TEMPLATE = (topic) => `Genera el contenido para un TRÍPTICO escolar sobre: "${topic}".

Un tríptico es una hoja A4 horizontal dividida en 3 columnas iguales, con 2 caras:
- EXTERIOR (anverso): Contraportada | Dorso | Portada  
- INTERIOR (reverso): Panel 1 (Introducción) | Panel 2 (Desarrollo) | Panel 3 (Conclusión)

Cada columna tiene BLOQUES de contenido. Los tipos de bloque son:
- heading: título grande (fontSize 18-32)
- subheading: subtítulo (fontSize 14-18)  
- paragraph: párrafo de texto (fontSize 11-14)
- image: imagen con URL de Unsplash (src: "https://images.unsplash.com/photo-XXXXX?w=400&h=300&fit=crop")
- list: lista con items array y marker (•, →, ✓, ★)
- divider: línea separadora decorativa

Devuelve SOLO un JSON válido con esta estructura (sin markdown, sin explicaciones):
{
  "pages": [
    {
      "id": "page-front",
      "bgColor": "#ffffff",
      "columns": [
        {
          "label": "Contraportada",
          "blocks": [
            {"type": "heading", "text": "Referencias", "style": {"fontSize": 18, "color": "#000", "fontWeight": "700", "textAlign": "center"}},
            {"type": "divider", "style": {"color": "#22d3ee", "thickness": 2, "marginY": 6}},
            {"type": "paragraph", "text": "Fuentes y bibliografía...", "style": {"fontSize": 11, "color": "#555", "textAlign": "center"}}
          ]
        },
        {
          "label": "Dorso",
          "blocks": [
            {"type": "image", "src": "https://images.unsplash.com/photo-RELEVANTE?w=400&h=300&fit=crop", "style": {"height": 100, "borderRadius": 8}},
            {"type": "paragraph", "text": "Dato curioso o resumen visual", "style": {"fontSize": 11, "color": "#666", "textAlign": "center"}}
          ]
        },
        {
          "label": "Portada",
          "blocks": [
            {"type": "heading", "text": "TÍTULO", "style": {"fontSize": 30, "color": "#000", "fontWeight": "900", "textAlign": "center"}},
            {"type": "divider", "style": {"color": "#22d3ee", "thickness": 3, "marginY": 8}},
            {"type": "paragraph", "text": "Subtítulo descriptivo", "style": {"fontSize": 14, "color": "#555", "textAlign": "center"}},
            {"type": "image", "src": "URL_IMAGEN_PORTADA", "style": {"height": 100, "borderRadius": 8}}
          ]
        }
      ]
    },
    {
      "id": "page-back",
      "bgColor": "#ffffff",
      "columns": [
        {
          "label": "Introducción",
          "blocks": [
            {"type": "heading", "text": "¿Qué es?", "style": {"fontSize": 22, "color": "#000", "fontWeight": "700"}},
            {"type": "divider", "style": {"color": "#22d3ee", "thickness": 2, "marginY": 6}},
            {"type": "paragraph", "text": "Definición completa...", "style": {"fontSize": 12, "color": "#333"}},
            {"type": "subheading", "text": "Datos clave", "style": {"fontSize": 14, "color": "#1a1a1a", "fontWeight": "600"}},
            {"type": "list", "items": ["Dato 1", "Dato 2", "Dato 3"], "style": {"fontSize": 11, "color": "#444", "marker": "•"}}
          ]
        },
        {
          "label": "Desarrollo",
          "blocks": [
            {"type": "heading", "text": "Causas", "style": {"fontSize": 22, "color": "#000", "fontWeight": "700"}},
            {"type": "divider", "style": {"color": "#22d3ee", "thickness": 2, "marginY": 6}},
            {"type": "paragraph", "text": "Explicación detallada...", "style": {"fontSize": 12, "color": "#333"}},
            {"type": "list", "items": ["Causa 1", "Causa 2", "Causa 3"], "style": {"fontSize": 11, "color": "#444", "marker": "→"}}
          ]
        },
        {
          "label": "Conclusión",
          "blocks": [
            {"type": "heading", "text": "Soluciones", "style": {"fontSize": 22, "color": "#000", "fontWeight": "700"}},
            {"type": "divider", "style": {"color": "#22d3ee", "thickness": 2, "marginY": 6}},
            {"type": "paragraph", "text": "Propuestas concretas...", "style": {"fontSize": 12, "color": "#333"}},
            {"type": "subheading", "text": "¿Qué podemos hacer?", "style": {"fontSize": 14, "fontWeight": "600"}},
            {"type": "list", "items": ["Acción 1", "Acción 2", "Acción 3"], "style": {"fontSize": 11, "color": "#444", "marker": "✓"}}
          ]
        }
      ]
    }
  ]
}

REGLAS IMPORTANTES:
1. Llena TODO con información REAL y detallada sobre "${topic}".
2. Usa VARIOS tipos de bloque por columna (heading + divider + paragraph + subheading + list + image).
3. Para imágenes usa URLs reales de Unsplash relacionadas al tema.
4. Los textos deben ser informativos, como un tríptico escolar real impreso.
5. Devuelve SOLO el JSON, nada más.`;

  const generateWithDeepSeek = async () => {
    if (!topic.trim() || generationsLeft <= 0) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('deepseek-router', {
        body: {
          cotizacion_id: 0,
          prompt: PROMPT_TEMPLATE(topic),
          system: "Eres un generador estricto de JSON para trípticos escolares. Devuelve solo JSON válido, sin markdown, sin explicaciones."
        }
      });

      if (error) throw error;

      let jsonStr = data.reply;
      if (jsonStr.includes('```json')) {
        jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
      } else if (jsonStr.includes('```')) {
        jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
      }

      const parsed = JSON.parse(jsonStr);
      onApply(parsed);

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
    navigator.clipboard.writeText(PROMPT_TEMPLATE(topic));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyManualJson = () => {
    try {
      const parsed = JSON.parse(manualJson);
      onApply(parsed);
      setManualJson('');
    } catch {
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
          <div className="mb-4">
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
          <div className="mb-4 text-center">
            <p className="text-[10px] text-amber-400 font-bold">¡Límite gratuito alcanzado!</p>
            <p className="text-[10px] text-zinc-400">Usa la opción manual abajo.</p>
          </div>
        )}

        {/* SIEMPRE MOSTRAR LA OPCIÓN MANUAL */}
        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
          <p className="text-[11px] text-zinc-300 font-bold mb-2">Alternativa: Usar IA Externa</p>
          <p className="text-[10px] text-zinc-400 mb-3 leading-relaxed">
            Si hay problemas de conexión o excediste el límite, copia el prompt, pégalo en ChatGPT o Claude, y pega el JSON resultante abajo.
          </p>
          <button
            onClick={handleCopyPrompt}
            disabled={!topic.trim()}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2 px-4 rounded text-xs flex items-center justify-center gap-2 transition-colors mb-3"
          >
            {copied ? <CheckCircle size={14} className="text-green-400"/> : <Copy size={14} />}
            {copied ? '¡Copiado!' : 'Copiar Prompt para IA'}
          </button>

          <textarea
            value={manualJson}
            onChange={e => setManualJson(e.target.value)}
            placeholder='Pega el JSON aquí...'
            className="w-full h-24 bg-black border border-zinc-800 rounded p-2 text-[10px] font-mono text-zinc-400 mb-2 resize-none focus:border-cyan-800 focus:outline-none"
          />
          <button
            onClick={applyManualJson}
            disabled={!manualJson.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded text-xs transition-colors"
          >
            Importar Diseño JSON
          </button>
        </div>
      </div>
    </div>
  );
}
