import React, { useState } from 'react';
import { Calculator, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MathSolverApp({ uiState }) {
  const [equation, setEquation] = useState('');
  const [loading, setLoading] = useState(false);
  const [solved, setSolved] = useState(false);

  const handleSolve = (e) => {
    e.preventDefault();
    if (!equation) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSolved(true);
    }, 2000);
  };

  return (
    <div className="mt-3 p-4 rounded-xl border border-blue-900/40 bg-[#2a2b2f] text-sm text-zinc-300 w-full shadow-inner relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
      
      <div className="flex items-center justify-between mb-4 border-b border-zinc-700/50 pb-2">
        <div className="flex items-center gap-2 text-blue-400 font-semibold">
          <Calculator size={18} />
          <span>A.L.P.H.A. Math Engine</span>
        </div>
        <Link to="/math" className="text-[10px] text-zinc-500 hover:text-blue-400 flex items-center transition-colors uppercase tracking-wider font-bold">
          Ver Modo Completo <ChevronRight size={12} />
        </Link>
      </div>

      {!solved ? (
        <form onSubmit={handleSolve} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-zinc-400 uppercase tracking-wide">Ecuación o Problema</label>
            <input
              type="text"
              placeholder="Ej. 2x + 5 = 15"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              className="w-full bg-[#121214] border border-zinc-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all font-mono"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !equation}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <><Sparkles size={16} /> Resolver Paso a Paso</>}
          </button>
        </form>
      ) : (
        <div className="flex flex-col py-2 space-y-4">
          <div className="bg-[#121214] rounded-lg p-4 border border-zinc-700 font-mono text-xs">
            <p className="text-zinc-500 mb-2">Análisis A.L.P.H.A.:</p>
            <p className="text-white mb-1">Ecuación: <span className="text-blue-400">{equation}</span></p>
            <p className="text-zinc-400">1. Restar 5 a ambos lados: 2x = 10</p>
            <p className="text-zinc-400">2. Dividir entre 2: x = 5</p>
            <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center gap-2">
              <span className="text-emerald-400 font-bold">Resultado: x = 5</span>
            </div>
          </div>
          <button
            onClick={() => { setSolved(false); setEquation(''); }}
            className="w-full py-2 border border-zinc-600 hover:bg-zinc-700 rounded-lg transition-colors text-xs font-semibold"
          >
            Nueva Ecuación
          </button>
        </div>
      )}
    </div>
  );
}
