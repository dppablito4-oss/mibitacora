import { useState } from 'react';
import { supabase } from '../../config/supabaseClient';
import { useToast } from '../../context/ToastContext';
import logger from '../../utils/logger';
import { 
  Sparkles, Loader2, Copy, CheckCircle, UploadCloud, 
  FileText, Trash2, ChevronDown, ChevronUp 
} from 'lucide-react';

// Carga dinámica de PDF.js desde CDN para extraer texto de PDFs locales
const loadPdfjs = () => {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };
    script.onerror = () => reject(new Error('No se pudo cargar la biblioteca PDF.js'));
    document.head.appendChild(script);
  });
};

const extractTextFromPdf = async (file) => {
  const pdfjsLib = await loadPdfjs();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    text += strings.join(' ') + '\n';
  }
  return text;
};

const extractTextFromTxt = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('No se pudo leer el archivo de texto'));
    reader.readAsText(file);
  });
};

export default function AiGeneratorPanel({ onApply }) {
  const { showToast } = useToast();
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [generationsLeft, setGenerationsLeft] = useState(() => {
    const saved = localStorage.getItem('triptico_ai_uses');
    if (saved) return parseInt(saved);
    localStorage.setItem('triptico_ai_uses', '2');
    return 2;
  });
  const [copied, setCopied] = useState(false);
  const [manualJson, setManualJson] = useState('');

  // Estados de Configuración Avanzada
  const [showConfig, setShowConfig] = useState(false);
  const [useFormalCover, setUseFormalCover] = useState(true);
  const [coverData, setCoverData] = useState({
    institution: '',
    student: '',
    teacher: '',
    gradeSection: '',
    year: new Date().getFullYear().toString()
  });
  const [includeIntro, setIncludeIntro] = useState(true);
  const [block6Mode, setBlock6Mode] = useState('contenido'); // 'contenido', 'anexos', 'datos_curiosos'

  // Estados de Archivo
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [fileLoading, setFileLoading] = useState(false);

  const PROMPT_TEMPLATE = (topic) => {
    const coverInstruction = useFormalCover
      ? `
- Bloque 1 (Portada / Carátula): DEBE ser una carátula escolar formal. Agrega exactamente los siguientes bloques y textos en el Bloque 1:
  1. Un bloque de tipo "heading" con el nombre de la institución: "${coverData.institution || 'Institución Educativa'}" (style: {"fontSize": 14, "color": "#333333", "textAlign": "center"})
  2. Un bloque de tipo "divider" (style: {"color": "#22d3ee", "thickness": 1, "marginY": 6})
  3. Un bloque de tipo "heading" con el título del tema principal: "${topic}" (style: {"fontSize": 24, "color": "#000000", "fontWeight": "900", "textAlign": "center"})
  4. Un bloque de tipo "image" representativo de la portada (deja un link general de Unsplash sobre el tema)
  5. Un bloque de tipo "paragraph" con los datos del estudiante, profesor, grado y año en formato de carátula escolar:
     "Estudiante: ${coverData.student || 'Nombre del Estudiante'}\\nDocente: ${coverData.teacher || 'Nombre del Docente'}\\nGrado: ${coverData.gradeSection || 'Grado y Sección'}\\nAño: ${coverData.year || '2026'}" (style: {"fontSize": 10, "color": "#444444", "textAlign": "center", "lineHeight": 1.6})
`
      : `
- Bloque 1 (Portada / Carátula): Crea una portada atractiva e informativa para el tema "${topic}" con un título principal llamativo, un subtítulo descriptivo, una imagen representativa y un divisor.
`;

    const introInstruction = includeIntro
      ? `
- Bloque 2 (Presentación / Introducción): Debe redactarse una presentación o introducción al tema del tríptico, explicando de forma clara su propósito y relevancia, acompañada de un párrafo descriptivo y opcionalmente un divisor decorativo.
`
      : `
- Bloque 2 (Presentación / Introducción): NO incluyas una introducción formal. Comienza directamente con el desarrollo o primer subtema importante del tema para aprovechar al máximo el espacio de la hoja.
`;

    const block6Instruction = block6Mode === 'anexos'
      ? `
- Bloque 6 (Dorso / Anexos): Este bloque debe ser una sección dedicada a ANEXOS y evidencias visuales. Agrega bloques de tipo "image" con URLs reales de Unsplash sobre el tema, y textos descriptivos breves como pie de foto para cada imagen. Es una galería visual de evidencias del experimento o proyecto.
`
      : block6Mode === 'datos_curiosos'
      ? `
- Bloque 6 (Dorso / Datos Curiosos): Este bloque debe contener datos interesantes, preguntas de reflexión o un glosario/términos clave sobre el tema. Agrega un encabezado de "Dato Curioso" o "Sabías que..." y listas o párrafos explicativos rápidos y dinámicos.
`
      : `
- Bloque 6 (Dorso / Contenido): Este bloque debe actuar como la continuación del tema de los bloques anteriores (continuación del desarrollo o conclusión secundaria), agregando información descriptiva detallada sobre "${topic}".
`;

    const sourceTextInstruction = extractedText
      ? `
REGLA CRÍTICA DE CONTENIDO: El usuario ha proporcionado un documento fuente con información y apuntes. Extrae la información REAL, datos exactos y conceptos directamente de este texto para rellenar los bloques del tríptico:
"""
${extractedText.substring(0, 15000)}
"""
`
      : '';

    return `Genera el contenido en español para un TRÍPTICO escolar sobre el tema: "${topic}".

Un tríptico es una hoja A4 horizontal dividida en 3 columnas iguales por cara. La numeración física y lógica de las columnas es la siguiente:
- LADO EXTERIOR (anverso): Bloque 5 (Contraportada) | Bloque 6 (Dorso) | Bloque 1 (Portada)
- LADO INTERIOR (reverso): Bloque 2 (Presentación) | Bloque 3 (Desarrollo) | Bloque 4 (Desarrollo/Conclusión)

Estructura de las páginas del JSON:
1. "page-front" (Exterior): Contiene las columnas correspondientes al Bloque 5 (Contraportada), Bloque 6 (Dorso) y Bloque 1 (Portada) en ese orden exacto de columnas.
2. "page-back" (Interior): Contiene las columnas correspondientes al Bloque 2 (Presentación), Bloque 3 (Desarrollo) y Bloque 4 (Desarrollo/Conclusión) en ese orden exacto de columnas.

Cada columna tiene un array de BLOQUES de contenido. Los tipos de bloque válidos son:
- heading: título grande (fontSize 18-32)
- subheading: subtítulo (fontSize 14-18)  
- paragraph: párrafo de texto (fontSize 10-14)
- image: imagen con URL de Unsplash (src: "https://images.unsplash.com/photo-XXXXX?w=400&h=300&fit=crop")
- list: lista con items array y marker (•, →, ✓, ★)
- divider: línea separadora decorativa

${coverInstruction}
${introInstruction}
${block6Instruction}
${sourceTextInstruction}

REGLAS GENERALES:
1. Completa todo el tríptico con textos detallados e informativos sobre "${topic}". Evita textos de relleno o placeholders.
2. En el Bloque 5 (Contraportada / Referencias), incluye bibliografía y fuentes reales sobre el tema en formato APA o enlaces educativos útiles.
3. Para cada columna, usa variedad de bloques (heading + divider + paragraph + list, etc.).
4. Devuelve SOLO un objeto JSON válido con la siguiente estructura y sin explicaciones adicionales:
{
  "pages": [
    {
      "id": "page-front",
      "bgColor": "#ffffff",
      "columns": [
        { "label": "Contraportada", "blocks": [...] },
        { "label": "Dorso", "blocks": [...] },
        { "label": "Portada", "blocks": [...] }
      ]
    },
    {
      "id": "page-back",
      "bgColor": "#ffffff",
      "columns": [
        { "label": "Presentación", "blocks": [...] },
        { "label": "Desarrollo", "blocks": [...] },
        { "label": "Conclusión", "blocks": [...] }
      ]
    }
  ]
}`;
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFileLoading(true);
    try {
      let text = '';
      if (selectedFile.name.endsWith('.pdf')) {
        text = await extractTextFromPdf(selectedFile);
      } else if (selectedFile.name.endsWith('.txt')) {
        text = await extractTextFromTxt(selectedFile);
      } else {
        showToast('Formato no soportado. Sube un archivo PDF o TXT.', 'warning');
        setFileLoading(false);
        return;
      }
      
      setFile(selectedFile);
      setExtractedText(text);
      
      // Auto-rellenar tema si no hay nada escrito
      if (!topic.trim()) {
        const cleanName = selectedFile.name.replace(/\.[^/.]+$/, "").replace(/_-/g, " ");
        setTopic(cleanName);
      }
    } catch (err) {
      logger.error(err);
      showToast('Error al leer el archivo: ' + err.message, 'error');
    } finally {
      setFileLoading(false);
    }
  };

  const generateWithDeepSeek = async () => {
    if (!topic.trim() || generationsLeft <= 0) return;
    setLoading(true);

    try {
      // Garantizar que exista una sesión activa (anónima o de usuario) para evitar error 401 JWT en la Edge Function
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        const { error: signInError } = await supabase.auth.signInAnonymously();
        if (signInError) throw signInError;
      }

      const { data, error } = await supabase.functions.invoke('deepseek-router', {
        body: {
          cotizacion_id: 0,
          prompt: PROMPT_TEMPLATE(topic),
          system: "Eres un generador estricto de JSON para trípticos escolares. Devuelve solo JSON válido, sin explicaciones."
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
      logger.error('Error generando tríptico:', err);
      showToast('Error al generar con IA: ' + (err.message || err), 'error');
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
      showToast('JSON Inválido. Asegúrate de copiarlo correctamente.', 'error');
    }
  };

  return (
    <div className="p-4 bg-zinc-900 border-b border-zinc-800">
      <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Sparkles size={14} className="text-cyan-400" />
        Generador IA
      </h3>

      <div className="space-y-4">
        {/* TEMA */}
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

        {/* CARGA DE ARCHIVO */}
        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
          <label className="block text-[10px] text-zinc-500 mb-1.5 font-bold uppercase">Apuntes o PDF del Proyecto</label>
          {file ? (
            <div className="flex items-center justify-between bg-zinc-900/60 p-2 rounded border border-cyan-900/30">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText size={16} className="text-cyan-400 shrink-0" />
                <span className="text-xs text-zinc-200 truncate font-mono">{file.name}</span>
              </div>
              <button 
                onClick={() => { setFile(null); setExtractedText(''); }}
                className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                title="Eliminar archivo"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border border-dashed border-zinc-800 hover:border-cyan-500/50 rounded p-4 text-center cursor-pointer transition-all hover:bg-zinc-900/30">
              <UploadCloud size={20} className="text-zinc-500 mb-1.5" />
              <span className="text-[11px] text-zinc-400 font-semibold">Subir PDF o archivo TXT</span>
              <span className="text-[9px] text-zinc-600 mt-0.5">La IA extraerá la información real</span>
              <input 
                type="file" 
                accept=".pdf,.txt" 
                onChange={handleFileChange}
                disabled={fileLoading}
                className="hidden" 
              />
            </label>
          )}
          {fileLoading && (
            <div className="flex items-center gap-1.5 text-[9px] text-cyan-400 font-mono mt-1.5">
              <Loader2 size={10} className="animate-spin" />
              <span>Procesando archivo...</span>
            </div>
          )}
          {!fileLoading && extractedText && (
            <div className="text-[9px] text-emerald-400 font-mono mt-1.5 flex items-center gap-1">
              <CheckCircle size={10} />
              <span>Texto extraído ({extractedText.length} caracteres)</span>
            </div>
          )}
        </div>

        {/* AJUSTES ESTRUCTURA */}
        <div>
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center justify-between w-full p-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-900/50 rounded transition-colors text-left text-xs font-bold text-zinc-400"
          >
            <span>Ajustes de Estructura</span>
            {showConfig ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showConfig && (
            <div className="mt-3 p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-3">
              {/* Opción Carátula */}
              <div className="space-y-2 border-b border-zinc-900/60 pb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useFormalCover}
                    onChange={e => setUseFormalCover(e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-700 text-cyan-600 focus:ring-cyan-500 h-3.5 w-3.5"
                  />
                  <span className="text-[11px] text-zinc-300 font-bold uppercase">Carátula Escolar (Bloque 1)</span>
                </label>

                {useFormalCover && (
                  <div className="space-y-2 pl-5">
                    <input
                      type="text"
                      placeholder="Colegio / Institución"
                      value={coverData.institution}
                      onChange={e => setCoverData({ ...coverData, institution: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded p-1.5 text-xs text-white placeholder:text-zinc-600"
                    />
                    <input
                      type="text"
                      placeholder="Nombre del Estudiante"
                      value={coverData.student}
                      onChange={e => setCoverData({ ...coverData, student: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded p-1.5 text-xs text-white placeholder:text-zinc-600"
                    />
                    <input
                      type="text"
                      placeholder="Docente / Profesor"
                      value={coverData.teacher}
                      onChange={e => setCoverData({ ...coverData, teacher: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded p-1.5 text-xs text-white placeholder:text-zinc-600"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Grado y Sección"
                        value={coverData.gradeSection}
                        onChange={e => setCoverData({ ...coverData, gradeSection: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 rounded p-1.5 text-xs text-white placeholder:text-zinc-600"
                      />
                      <input
                        type="text"
                        placeholder="Año escolar"
                        value={coverData.year}
                        onChange={e => setCoverData({ ...coverData, year: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 rounded p-1.5 text-xs text-white placeholder:text-zinc-600"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Opción Presentación */}
              <div className="space-y-1 border-b border-zinc-900/60 pb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeIntro}
                    onChange={e => setIncludeIntro(e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-700 text-cyan-600 focus:ring-cyan-500 h-3.5 w-3.5"
                  />
                  <span className="text-[11px] text-zinc-300 font-bold uppercase">Incluir Presentación (Bloque 2)</span>
                </label>
                <p className="text-[9px] text-zinc-500 pl-5 leading-normal">
                  Reserva el Bloque 2 para una introducción y justificación del tema.
                </p>
              </div>

              {/* Opción Modo Bloque 6 */}
              <div className="space-y-1">
                <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Modo del Bloque 6 (Dorso)</label>
                <select
                  value={block6Mode}
                  onChange={e => setBlock6Mode(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white p-1.5 rounded"
                >
                  <option value="contenido">Modo Contenido (Seguir desarrollo)</option>
                  <option value="anexos">Modo Anexos (Galería visual/fotos)</option>
                  <option value="datos_curiosos">Modo Datos Curiosos / Preguntas</option>
                </select>
                <p className="text-[9px] text-zinc-500 leading-normal pt-1">
                  Define el tipo de contenido secundario que se imprimirá en el reverso plegado.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ACCIÓN DE GENERAR */}
        {generationsLeft > 0 ? (
          <div className="mb-4">
            <button
              onClick={generateWithDeepSeek}
              disabled={loading || !topic.trim()}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-cyan-600/10 cursor-pointer"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <><Sparkles size={13} /> Generar Automáticamente</>}
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

        {/* MODO MANUAL */}
        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
          <p className="text-[11px] text-zinc-300 font-bold mb-2">Alternativa: Usar IA Externa</p>
          <p className="text-[10px] text-zinc-400 mb-3 leading-relaxed">
            Si hay problemas de conexión o excediste el límite, copia el prompt, pégalo en ChatGPT o Claude, y pega el JSON resultante abajo.
          </p>
          <button
            onClick={handleCopyPrompt}
            disabled={!topic.trim()}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2 px-4 rounded text-xs flex items-center justify-center gap-2 transition-colors mb-3 cursor-pointer"
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
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded text-xs transition-colors cursor-pointer"
          >
            Importar Diseño JSON
          </button>
        </div>
      </div>
    </div>
  );
}
