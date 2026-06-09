import { useState, useEffect, useRef } from 'react';
import { X, Lock, ShieldCheck } from 'lucide-react';
import { audioEffects } from '../../utils/audioEffects';

export default function DecryptionModal({ isOpen, onClose, pdfUrl }) {
  const [status, setStatus] = useState('decrypting'); // 'decrypting', 'ready'
  const [progress, setProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const logsRef = useRef(null);

  const steps = [
    { log: '> INICIANDO SECUENCIA DE ACCESO SECRETO...', progress: 15 },
    { log: '> ESTABLECIENDO CANAL SEGURO SSL...', progress: 30 },
    { log: '> ACCEDIENDO A REPOSITORIO DE EVIDENCIAS...', progress: 48 },
    { log: '> DESENCRIPTANDO VECTORES LINGÜÍSTICOS (MORFEMAS)...', progress: 70 },
    { log: '> AUTENTICANDO FIRMA DE AGENTE NIVEL 7...', progress: 85 },
    { log: '> ACCESO PERMITIDO. MOSTRANDO EXPEDIENTE ENCRIPTADO.', progress: 100 }
  ];

  useEffect(() => {
    if (!isOpen) return;

    // Reiniciar estados al abrir el modal
    setStatus('decrypting');
    setProgress(0);
    setTerminalLogs([]);
    audioEffects.playClick(); // Sonido al abrir

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        const currentStep = steps[stepIndex];
        setTerminalLogs((prev) => [...prev, currentStep.log]);
        setProgress(currentStep.progress);
        audioEffects.playHover(); // Sonido de escritura/tictac

        if (currentStep.progress === 100) {
          clearInterval(interval);
          setTimeout(() => {
            setStatus('ready');
            audioEffects.playSuccess(); // Sonido de éxito al abrir documento
          }, 600);
        }
        stepIndex++;
      }
    }, 400);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Auto-scroll de terminal logs
  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      {/* Caja del Modal */}
      <div className="relative w-full max-w-4xl h-[85vh] bg-zinc-950 border border-accent-500/20 rounded-2xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.1)]">
        
        {/* Cabecera Táctica del Terminal */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <span className="text-xs font-mono font-bold text-accent-400 ml-2 tracking-widest uppercase">
              Terminal: Decrypt-Expediente-v3.2.0
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="flex-1 flex flex-col overflow-hidden bg-black p-6 font-mono relative">
          {status === 'decrypting' ? (
            /* --- PANTALLA DE DESENCRIPTADO --- */
            <div className="flex-1 flex flex-col justify-between">
              
              {/* Logs del Terminal */}
              <div 
                ref={logsRef}
                className="flex-1 overflow-y-auto space-y-2 text-sm text-green-400/90 leading-relaxed pr-2"
              >
                {terminalLogs.map((log, index) => (
                  <div key={index} className="animate-fade-in">
                    {log}
                  </div>
                ))}
              </div>

              {/* Barra de Progreso Neon */}
              <div className="border-t border-zinc-900 pt-6 mt-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-accent-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Lock size={12} className="animate-pulse" />
                    DESENCRIPTANDO ARCHIVO...
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div 
                    className="h-full bg-gradient-to-r from-accent-600 to-accent-400 transition-all duration-300 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

            </div>
          ) : (
            /* --- VISOR DE PDF SEGURO --- */
            <div className="flex-1 flex flex-col h-full overflow-hidden select-none">
              
              {/* Barra Superior del Visor */}
              <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs">
                <ShieldCheck size={14} />
                <span>EXPEDIENTE VERIFICADO. CLIC DERECHO Y COPIADO DESHABILITADOS POR PROTOCOLO DE SEGURIDAD.</span>
              </div>

              {/* iframe Embebido con capa de seguridad */}
              <div 
                className="flex-1 w-full relative rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden"
                onContextMenu={(e) => e.preventDefault()} // Deshabilitar click derecho
              >
                <iframe
                  src={`${pdfUrl}#toolbar=0&navpanes=0`} // Ocultar barra de herramientas nativa
                  title="Visor PDF Seguro"
                  className="w-full h-full border-none select-none pointer-events-auto"
                  style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                  }}
                />
                
                {/* Capa superpuesta invisible para prevenir drag-and-drop e interacciones no deseadas */}
                <div className="absolute inset-0 bg-transparent pointer-events-none" />
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
