import { useState } from 'react';
import { Calculator, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const parseAndSolve = (eqStr) => {
  // Normalize: remove spaces, convert to lowercase
  const eq = eqStr.replace(/\s+/g, '').toLowerCase();

  // Regex to match Ax + B = C or Ax - B = C
  const regexFull = /^([+-]?\d*(?:\.\d+)?)([a-z])([+-])(\d*(?:\.\d+)?)=(-?\d*(?:\.\d+)?)$/;
  
  // Regex to match Ax = C (without constant term B)
  const regexSimple = /^([+-]?\d*(?:\.\d+)?)([a-z])=(-?\d*(?:\.\d+)?)$/;

  let match = eq.match(regexFull);
  if (match) {
    let rawA = match[1];
    const variable = match[2];
    const op = match[3];
    let rawB = match[4];
    let rawC = match[5];

    let a = rawA === '' || rawA === '+' ? 1 : rawA === '-' ? -1 : parseFloat(rawA);
    let b = parseFloat(rawB);
    let c = parseFloat(rawC);

    if (isNaN(a) || isNaN(b) || isNaN(c)) return null;

    let signedB = op === '-' ? -b : b;

    const steps = [];
    const varTerm = `${a === 1 ? '' : a === -1 ? '-' : a}${variable}`;
    steps.push(`1. Mover constante restando de ambos lados:`);
    steps.push(`   ${varTerm} = ${c} - (${signedB >= 0 ? '+' : ''}${signedB})`);
    
    const cMinusB = c - signedB;
    steps.push(`   ${varTerm} = ${cMinusB}`);

    if (a === 0) {
      if (cMinusB === 0) {
        steps.push(`2. Coeficiente es 0:`);
        return { steps, result: `Infinitas soluciones` };
      } else {
        steps.push(`2. Coeficiente es 0 pero constante no:`);
        return { steps, result: `Sin solución` };
      }
    }

    const resultVal = cMinusB / a;
    const roundedRes = Number(resultVal.toFixed(4));
    steps.push(`2. Dividir entre coeficiente ${a}:`);
    steps.push(`   ${variable} = ${cMinusB} / ${a}`);
    
    return {
      steps,
      result: `${variable} = ${roundedRes}`
    };
  }

  match = eq.match(regexSimple);
  if (match) {
    let rawA = match[1];
    const variable = match[2];
    let rawC = match[3];

    let a = rawA === '' || rawA === '+' ? 1 : rawA === '-' ? -1 : parseFloat(rawA);
    let c = parseFloat(rawC);

    if (isNaN(a) || isNaN(c)) return null;

    const steps = [];
    
    if (a === 0) {
      if (c === 0) {
        steps.push(`1. Coeficiente es 0:`);
        return { steps, result: `Infinitas soluciones` };
      } else {
        steps.push(`1. Coeficiente es 0 pero constante no:`);
        return { steps, result: `Sin solución` };
      }
    }

    const resultVal = c / a;
    const roundedRes = Number(resultVal.toFixed(4));
    steps.push(`1. Dividir entre coeficiente ${a}:`);
    steps.push(`   ${variable} = ${c} / ${a}`);

    return {
      steps,
      result: `${variable} = ${roundedRes}`
    };
  }

  // Arithmetic expression evaluator
  const cleanArithmetic = eq.replace(/=/g, '');
  if (/^[0-9+\-*/().\s]+$/.test(cleanArithmetic)) {
    try {
      const resultVal = new Function(`return (${cleanArithmetic})`)();
      if (typeof resultVal === 'number' && !isNaN(resultVal)) {
        return {
          steps: [
            `Expresión: ${cleanArithmetic}`,
            `1. Evaluar operaciones aritméticas`
          ],
          result: `${Number(resultVal.toFixed(4))}`
        };
      }
    } catch {
      // Ignore and fallback
    }
  }

  return null;
};

export default function MathSolverApp() {
  const [equation, setEquation] = useState('');
  const [loading, setLoading] = useState(false);
  const [solved, setSolved] = useState(false);
  const [solution, setSolution] = useState(null);

  const handleSolve = (e) => {
    e.preventDefault();
    if (!equation.trim()) return;
    setLoading(true);
    
    const res = parseAndSolve(equation);
    setSolution(res);

    setTimeout(() => {
      setLoading(false);
      setSolved(true);
    }, 1200);
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
              placeholder="Ej. 2x + 5 = 15 o (10+5)/3"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              className="w-full bg-[#121214] border border-zinc-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all font-mono"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !equation.trim()}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <><Sparkles size={16} /> Resolver Paso a Paso</>}
          </button>
        </form>
      ) : (
        <div className="flex flex-col py-2 space-y-4">
          <div className="bg-[#121214] rounded-lg p-4 border border-zinc-700 font-mono text-xs">
            <p className="text-zinc-500 mb-2">Análisis A.L.P.H.A.:</p>
            {solution ? (
              <>
                <p className="text-white mb-2">Problema: <span className="text-blue-400">{equation}</span></p>
                {solution.steps.map((step, idx) => (
                  <p key={idx} className="text-zinc-400 mt-1">{step}</p>
                ))}
                <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">Resultado: {solution.result}</span>
                </div>
              </>
            ) : (
              <>
                <p className="text-white mb-2">Problema: <span className="text-blue-400">{equation}</span></p>
                <p className="text-amber-400">Esta ecuación es compleja para el modo simplificado.</p>
                <p className="text-zinc-400 mt-2">Usa el botón "Ver Modo Completo" superior para resolver polinomios y ecuaciones complejas.</p>
              </>
            )}
          </div>
          <button
            onClick={() => { setSolved(false); setEquation(''); setSolution(null); }}
            className="w-full py-2 border border-zinc-600 hover:bg-zinc-700 rounded-lg transition-colors text-xs font-semibold"
          >
            Nueva Ecuación
          </button>
        </div>
      )}
    </div>
  );
}
