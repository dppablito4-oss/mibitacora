import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, QrCode, Image as ImageIcon, Copy, Check } from 'lucide-react';

export default function QRGeneratorPage() {
  const [url, setUrl] = useState('https://space.sypablitodp.site');
  const [logo, setLogo] = useState(null);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    // Configura canvas de mayor resolución para la descarga
    canvas.width = 1000;
    canvas.height = 1000;
    
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `pablito-qr-${Date.now()}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center">
      <div className="w-full max-w-4xl px-4 animate-fade-up">
        <div className="mb-8 text-center">
          <h1 className="text-glow text-4xl font-bold uppercase tracking-widest text-white mb-2 flex items-center justify-center gap-3">
            <QrCode className="text-tesseract-500" size={36} />
            Generador QR
          </h1>
          <div className="mx-auto h-1 w-24 bg-tesseract-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] mb-4"></div>
          <p className="text-slate-400">Crea códigos QR infinitos con logos incrustados. 100% local, sin tracking ni suscripciones.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Controles */}
          <div className="bg-card border border-tesseract-500/20 p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="mb-6">
              <label className="block text-sm font-bold uppercase tracking-wider text-tesseract-300 mb-2">
                URL o Texto
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-dark border border-slate-700 focus:border-tesseract-500 rounded p-3 text-slate-200 outline-none transition-colors"
                  placeholder="https://tupagina.com"
                />
                <button 
                  onClick={handleCopyUrl}
                  className="px-4 border border-slate-700 bg-dark hover:border-tesseract-500 text-slate-300 hover:text-tesseract-400 transition-colors flex items-center justify-center rounded"
                  title="Copiar texto"
                >
                  {copied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold uppercase tracking-wider text-tesseract-300 mb-2">
                Logotipo Central (Opcional)
              </label>
              <div className="border-2 border-dashed border-tesseract-500/30 bg-tesseract-500/5 hover:bg-tesseract-500/10 transition-colors p-6 flex flex-col items-center justify-center text-center cursor-pointer relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <ImageIcon size={32} className="text-tesseract-500 mb-2" />
                <span className="text-slate-300 font-medium">Haz clic o arrastra tu logo</span>
                <span className="text-xs text-slate-500 mt-1">Formatos: PNG, JPG, SVG</span>
              </div>
              {logo && (
                <div className="mt-3 flex items-center justify-between bg-dark p-2 border border-slate-700 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded flex items-center justify-center overflow-hidden">
                      <img src={logo} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                    </div>
                    <span className="text-sm text-slate-300">Logo cargado</span>
                  </div>
                  <button 
                    onClick={() => setLogo(null)}
                    className="text-red-400 hover:text-red-300 text-sm px-2"
                  >
                    Quitar
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-tesseract-500/10 border border-tesseract-500/20 p-4 rounded text-sm text-tesseract-100 mt-auto">
              <p className="flex items-start gap-2">
                <Check className="text-tesseract-500 shrink-0 mt-0.5" size={16} />
                Alta resolución nativa lista para impresión y publicidad corporativa.
              </p>
            </div>
          </div>

          {/* Vista Previa */}
          <div className="flex flex-col items-center justify-center p-8 bg-dark border border-slate-800 relative">
            <div className="absolute inset-0 space-grid opacity-20 pointer-events-none"></div>
            
            <div 
              className="bg-white p-6 rounded-xl shadow-[0_0_40px_rgba(6,182,212,0.15)] relative z-10 transition-transform hover:scale-105 duration-300"
              ref={qrRef}
            >
              <QRCodeSVG
                value={url || 'https://space.sypablitodp.site'}
                size={280}
                bgColor={"#ffffff"}
                fgColor={"#0a0f25"}
                level={"H"} // Alta corrección de errores para soportar el logo
                includeMargin={false}
                imageSettings={logo ? {
                  src: logo,
                  x: undefined,
                  y: undefined,
                  height: 64,
                  width: 64,
                  excavate: true, // Recorta el espacio para el logo
                } : undefined}
              />
            </div>
            
            <button 
              onClick={handleDownload}
              className="mt-8 flex items-center justify-center gap-3 bg-tesseract-500 hover:bg-tesseract-400 text-white font-bold uppercase tracking-wider px-8 py-4 rounded shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all z-10 w-full max-w-[280px]"
            >
              <Download size={20} />
              Descargar PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
