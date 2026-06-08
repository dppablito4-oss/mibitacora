import { useState } from 'react';
import { ExternalLink, Camera, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScannerPage() {
  const [loading, setLoading] = useState(true);
  const [showTip, setShowTip] = useState(true);

  const handleOpenExternal = () => {
    window.open('https://leans.sypablitodp.site', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="h-screen pt-20 flex flex-col bg-[#030712] overflow-hidden">
      {/* Sub-header / Top control bar */}
      <div className="bg-[#0b1329]/80 border-b border-tesseract-500/20 px-6 py-3 flex flex-wrap items-center justify-between gap-4 z-10 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-tesseract-500/10 rounded-lg border border-tesseract-500/30 text-tesseract-400">
            <Camera size={20} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2">
              Escáner P.A.B.L.O. <span className="text-tesseract-400 text-xs font-semibold px-2 py-0.5 bg-tesseract-500/10 rounded border border-tesseract-500/20">Leans</span>
            </h2>
            <p className="text-xs text-slate-400">Motor de visión artificial para digitalización de documentos</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenExternal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-tesseract-500/10 text-tesseract-300 hover:bg-tesseract-500/20 text-sm font-semibold border border-tesseract-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] cursor-pointer"
          >
            <ExternalLink size={16} />
            Abrir en pestaña externa
          </button>
        </div>
      </div>

      {/* Tip Banner */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-amber-950/20 border-b border-amber-500/20 px-6 py-2.5 flex items-center justify-between text-amber-200/90 text-xs shrink-0 z-10"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-400 shrink-0" />
              <span>
                <strong>Tip de Acceso:</strong> Si tu navegador restringe la cámara dentro de la bitácora, presiona "Abrir en pestaña externa".
              </span>
            </div>
            <button
              onClick={() => setShowTip(false)}
              className="text-amber-400 hover:text-amber-200 font-bold ml-4 px-1 cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container / Iframe Area */}
      <div className="flex-1 relative overflow-hidden bg-black/40">
        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#030712] gap-4"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-tesseract-500/20 border-t-tesseract-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera size={24} className="text-tesseract-400" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold text-white tracking-wider">Cargando Escáner Inteligente</h3>
                <p className="text-xs text-slate-400 mt-1">Conectando con leans.sypablitodp.site...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <iframe
          src="https://leans.sypablitodp.site"
          title="Pablito Leans"
          className="w-full h-full border-0"
          allow="camera"
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
}
