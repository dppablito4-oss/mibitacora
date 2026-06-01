import { useState } from 'react';
import { LayoutTemplate, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TripticoMakerApp() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!topic) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
    }, 2500);
  };

  return (
    <div className="mt-3 p-4 rounded-xl border border-fuchsia-900/40 bg-[#2a2b2f] text-sm text-zinc-300 w-full shadow-inner relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-600 to-purple-600"></div>
      
      <div className="flex items-center justify-between mb-4 border-b border-zinc-700/50 pb-2">
        <div className="flex items-center gap-2 text-fuchsia-400 font-semibold">
          <LayoutTemplate size={18} />
          <span>A.L.P.H.A. Trípticos</span>
        </div>
        <Link to="/tripticos" className="text-[10px] text-zinc-500 hover:text-fuchsia-400 flex items-center transition-colors uppercase tracking-wider font-bold">
          Studio Pro <ChevronRight size={12} />
        </Link>
      </div>

      {!generated ? (
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-zinc-400 uppercase tracking-wide">Tema del Tríptico</label>
            <input
              type="text"
              placeholder="Ej. El Sistema Solar, La Revolución Francesa..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-[#121214] border border-zinc-700 rounded-lg p-2.5 text-white focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/50 outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !topic}
            className="w-full py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <><Sparkles size={16} /> Generar Estructura</>}
          </button>
        </form>
      ) : (
        <div className="flex flex-col py-2 space-y-3">
          <div className="bg-[#121214] rounded-lg p-3 border border-zinc-700 text-xs">
            <h4 className="text-white font-bold mb-2">Estructura Sugerida: {topic}</h4>
            <div className="grid grid-cols-2 gap-2 text-zinc-400">
              <div className="bg-[#1a1b1e] p-2 rounded border border-zinc-800">
                <span className="text-fuchsia-400 font-semibold block mb-1">Exterior</span>
                <ul className="list-disc pl-3 space-y-1">
                  <li>Portada (Logo + Título)</li>
                  <li>Contraportada (Contacto)</li>
                  <li>Solapa (Resumen/Intro)</li>
                </ul>
              </div>
              <div className="bg-[#1a1b1e] p-2 rounded border border-zinc-800">
                <span className="text-fuchsia-400 font-semibold block mb-1">Interior</span>
                <ul className="list-disc pl-3 space-y-1">
                  <li>Historia / Origen</li>
                  <li>Características Clave</li>
                  <li>Conclusiones / Datos</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
             <button
              onClick={() => { setGenerated(false); setTopic(''); }}
              className="flex-1 py-2 border border-zinc-600 hover:bg-zinc-700 rounded-lg transition-colors text-xs font-semibold"
            >
              Cambiar Tema
            </button>
            <Link to={`/tripticos?topic=${encodeURIComponent(topic)}`} className="flex-1 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg transition-colors text-xs font-semibold flex items-center justify-center">
              Ir a Editar PDF
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
