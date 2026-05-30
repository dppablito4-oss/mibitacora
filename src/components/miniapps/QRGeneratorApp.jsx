import React, { useState } from 'react';
import { QrCode, Upload, Download, RefreshCw } from 'lucide-react';

export default function QRGeneratorApp({ uiState }) {
  const [url, setUrl] = useState('');
  const [color, setColor] = useState('#008bad');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    // Simular generación de QR
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
    }, 1500);
  };

  return (
    <div className="mt-3 p-4 rounded-xl border border-cyan-900/40 bg-[#2a2b2f] text-sm text-zinc-300 w-full shadow-inner relative overflow-hidden">
      {/* Accent border top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 to-emerald-600"></div>
      
      <div className="flex items-center gap-2 mb-4 text-cyan-400 font-semibold border-b border-zinc-700/50 pb-2">
        <QrCode size={18} />
        <span>A.L.P.H.A. QR Studio</span>
      </div>

      {!generated ? (
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-zinc-400 uppercase tracking-wide">Enlace / URL</label>
            <input
              type="text"
              placeholder="https://ejemplo.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-[#121214] border border-zinc-700 rounded-lg p-2.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1.5 text-zinc-400 uppercase tracking-wide">Color Hex</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded bg-[#121214] border border-zinc-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full bg-[#121214] border border-zinc-700 rounded-lg p-2.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none uppercase font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {uiState?.show_uploader !== false && (
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-zinc-400 uppercase tracking-wide">Logotipo Central (Opcional)</label>
              <div className="w-full border-2 border-dashed border-zinc-700 hover:border-cyan-500/50 rounded-lg p-4 bg-[#121214] flex flex-col items-center justify-center cursor-pointer transition-colors group">
                <Upload size={20} className="text-zinc-500 group-hover:text-cyan-400 mb-2" />
                <span className="text-xs text-zinc-500 text-center">Arrastra tu logo aquí<br/>o haz clic para subir</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !url}
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : 'Generar QR Automático'}
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          <div className="w-32 h-32 bg-white rounded-lg p-2 shadow-lg flex items-center justify-center">
            {/* Placeholder del QR */}
            <QrCode size={100} color={color} />
          </div>
          <p className="text-emerald-400 text-xs font-semibold text-center">¡QR Generado con éxito!</p>
          <div className="flex gap-2 w-full">
            <button
              onClick={() => setGenerated(false)}
              className="flex-1 py-2 border border-zinc-600 hover:bg-zinc-700 rounded-lg transition-colors text-xs font-semibold"
            >
              Nuevo
            </button>
            <button
              className="flex-1 py-2 bg-[#006c31] hover:bg-emerald-600 text-white rounded-lg transition-colors text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/20"
            >
              <Download size={14} /> Descargar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
