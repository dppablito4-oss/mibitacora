import { useState, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { QrCode, Upload, Download, RefreshCw, X } from 'lucide-react';

export default function QRGeneratorApp({ uiState }) {
  const [url, setUrl] = useState('');
  const [color, setColor] = useState('#008bad');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [logoFile, setLogoFile] = useState(null);

  const [qrCode] = useState(() => new QRCodeStyling({
    width: 220,
    height: 220,
    type: "svg",
    margin: 10,
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 4,
      imageSize: 0.4,
      hideBackgroundDots: true
    }
  }));

  const qrRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (generated && qrRef.current) {
      qrRef.current.innerHTML = ''; // Clean previous
      qrCode.append(qrRef.current);
    }
  }, [generated, qrCode]);

  useEffect(() => {
    qrCode.update({
      data: url || ' ',
      dotsOptions: {
        color: color,
        type: "rounded"
      },
      cornersSquareOptions: {
        color: color,
        type: "extra-rounded"
      },
      image: logoFile ? URL.createObjectURL(logoFile) : undefined,
    });
  }, [qrCode, url, color, logoFile]);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
    }, 600); // Rápido pero con efecto visual
  };

  const handleDownload = () => {
    qrCode.download({ name: 'qr-alpha', extension: 'png' });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setLogoFile(file);
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
              <div 
                className="w-full border-2 border-dashed border-zinc-700 hover:border-cyan-500/50 rounded-lg p-4 bg-[#121214] flex flex-col items-center justify-center cursor-pointer transition-colors group relative"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handleLogoUpload} 
                  className="hidden" 
                />
                {logoFile ? (
                  <div className="flex flex-col items-center">
                    <img src={URL.createObjectURL(logoFile)} alt="Logo Preview" className="h-10 object-contain mb-2 rounded" />
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); setLogoFile(null); }} 
                      className="absolute top-2 right-2 text-zinc-500 hover:text-red-400 bg-zinc-800 rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                    <span className="text-[10px] text-cyan-400 truncate w-32 text-center">{logoFile.name}</span>
                  </div>
                ) : (
                  <>
                    <Upload size={20} className="text-zinc-500 group-hover:text-cyan-400 mb-2" />
                    <span className="text-[10px] text-zinc-500 text-center">Haz clic aquí para subir<br/>o cambia la imagen</span>
                  </>
                )}
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
          <div className="bg-white rounded-xl p-2 shadow-lg flex items-center justify-center min-w-[236px] min-h-[236px]">
            {/* Contenedor del QR Real */}
            <div ref={qrRef} className="[&>svg]:w-full [&>svg]:h-auto"></div>
          </div>
          <p className="text-emerald-400 text-xs font-semibold text-center">¡QR Generado con éxito!</p>
          <div className="flex gap-2 w-full">
            <button
              onClick={() => setGenerated(false)}
              className="flex-1 py-2 border border-zinc-600 hover:bg-zinc-700 rounded-lg transition-colors text-xs font-semibold"
            >
              Editar
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 py-2 bg-[#006c31] hover:bg-emerald-600 text-white rounded-lg transition-colors text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/20"
            >
              <Download size={14} /> Descargar
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-zinc-700/50 text-center">
        <p className="text-[10px] text-zinc-400 leading-relaxed">
          Para más estilos, patrones y alta resolución, puedes<br/>
          <a href="#/qr" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold underline underline-offset-2">
            editarlo en la herramienta completa aquí.
          </a>
        </p>
      </div>
    </div>
  );
}
