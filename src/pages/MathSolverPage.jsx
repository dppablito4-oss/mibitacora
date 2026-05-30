import React, { useState, useRef, useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { solveQuadraticSteps, solveCubicSteps, solveQuarticSteps } from '../utils/mathSolver';
import { Calculator, ChevronRight, AlertTriangle } from 'lucide-react';

const Latex = ({ text }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (containerRef.current) {
      katex.render(text, containerRef.current, {
        displayMode: true,
        throwOnError: false,
        strict: false
      });
    }
  }, [text]);

  return <div ref={containerRef} className="overflow-x-auto text-lg text-white my-2" />;
};

export default function MathSolverPage() {
  const [degree, setDegree] = useState(2);
  const [coeffs, setCoeffs] = useState({ a: 2, b: 8, c: -10, d: 0, e: 0 });
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    setError('');
    setSteps([]);
    const { a, b, c, d, e } = coeffs;

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      setError('Por favor, ingresa coeficientes válidos.');
      return;
    }
    if (Number(a) === 0) {
      setError('El coeficiente principal "a" no puede ser cero.');
      return;
    }

    let resultSteps = [];
    if (degree === 2) {
      resultSteps = solveQuadraticSteps(Number(a), Number(b), Number(c));
    } else if (degree === 3) {
      if (isNaN(d)) return setError('Coeficiente d inválido.');
      resultSteps = solveCubicSteps(Number(a), Number(b), Number(c), Number(d));
    } else if (degree === 4) {
      if (isNaN(d) || isNaN(e)) return setError('Coeficientes d o e inválidos.');
      resultSteps = solveQuarticSteps(Number(a), Number(b), Number(c), Number(d), Number(e));
    }
    
    setSteps(resultSteps);
  };

  const renderInput = (key, label) => (
    <div key={key}>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 text-center">{label}</label>
      <input 
        type="number" 
        value={coeffs[key]} 
        onChange={e => setCoeffs({...coeffs, [key]: parseFloat(e.target.value)})}
        className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-3 text-center font-mono text-white text-lg transition-all outline-none"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <header className="text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Calculator size={14} /> APUNTES DE MATEMÁTICAS PRO
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-purple-400">
            Calculadora de Polinomios
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
            Resolución paso a paso con rigor matemático. Explora el método de completado de cuadrados, Cardano y Ferrari para polinomios de hasta grado 4.
          </p>
        </header>

        <section className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex justify-center mb-8">
            <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800 inline-flex gap-2">
              {[2, 3, 4].map(deg => (
                <button
                  key={deg}
                  onClick={() => { setDegree(deg); setSteps([]); setError(''); }}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${degree === deg ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                  Grado {deg}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 max-w-2xl mx-auto mb-8">
            {renderInput('a', 'Coef a')}
            {renderInput('b', 'Coef b')}
            {renderInput('c', 'Coef c')}
            {degree >= 3 && renderInput('d', 'Coef d')}
            {degree >= 4 && renderInput('e', 'Coef e')}
          </div>

          <div className="text-center">
            <button 
              onClick={handleCalculate}
              className="px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/20 active:scale-95 transition-all flex items-center gap-2 mx-auto"
            >
              Resolver Paso a Paso <ChevronRight size={18} />
            </button>
          </div>

          {error && (
            <div className="mt-6 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl p-4 text-sm text-center flex items-center justify-center gap-2">
              <AlertTriangle size={16} /> {error}
            </div>
          )}
        </section>

        {steps.length > 0 && (
          <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-10 space-y-8 shadow-2xl relative">
            <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-4">Desarrollo Riguroso</h2>
            <div className="space-y-10">
              {steps.map((step, idx) => (
                <div key={idx} className="relative pl-6 md:pl-8 border-l-2 border-slate-800">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                  <h3 className="text-lg font-bold text-purple-400">{step.title}</h3>
                  {step.text && <p className="text-slate-300 mt-2 text-sm leading-relaxed">{step.text}</p>}
                  {step.latex && (
                    <div className="mt-4 bg-slate-950/60 p-4 md:p-6 rounded-2xl border border-slate-800/80 shadow-inner">
                      <Latex text={step.latex} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
