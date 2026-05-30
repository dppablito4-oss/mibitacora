import React, { useState, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { QrCode, Download, Image as ImageIcon } from 'lucide-react';

export default function QrGeneratorPage() {
  const [qrCode] = useState(new QRCodeStyling({
    width: 420,
    height: 420,
    type: "svg",
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 6
    }
  }));

  const qrRef = useRef(null);

  // States
  const [payloadType, setPayloadType] = useState('url');
  const [text, setText] = useState('https://sypablitodp.site');
  const [waNumber, setWaNumber] = useState('');
  const [waMessage, setWaMessage] = useState('');
  
  const [dotsShape, setDotsShape] = useState('rounded');
  const [cornersShape, setCornersShape] = useState('extra-rounded');
  const [dotsColor, setDotsColor] = useState('#38ff9c');
  const [bgColor, setBgColor] = useState('#000000');
  const [transparent, setTransparent] = useState(false);
  
  const [size, setSize] = useState(420);
  const [errorLevel, setErrorLevel] = useState('M');
  const [fileName, setFileName] = useState('qr-pablito');
  
  const [logoFile, setLogoFile] = useState(null);
  const [logoSize, setLogoSize] = useState(0.4);
  const [logoMargin, setLogoMargin] = useState(6);

  useEffect(() => {
    if (qrRef.current) {
      qrCode.append(qrRef.current);
    }
  }, [qrCode, qrRef]);

  useEffect(() => {
    let data = text;
    if (payloadType === 'whatsapp') {
      const cleanNum = waNumber.replace(/\D/g, '');
      const encodedMsg = encodeURIComponent(waMessage);
      data = `https://wa.me/${cleanNum}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
    }

    qrCode.update({
      width: size,
      height: size,
      data: data || ' ',
      margin: 10,
      qrOptions: {
        errorCorrectionLevel: errorLevel
      },
      dotsOptions: {
        color: dotsColor,
        type: dotsShape
      },
      backgroundOptions: {
        color: transparent ? 'transparent' : bgColor,
      },
      cornersSquareOptions: {
        color: dotsColor,
        type: cornersShape
      },
      image: logoFile ? URL.createObjectURL(logoFile) : undefined,
      imageOptions: {
        crossOrigin: "anonymous",
        margin: logoMargin,
        imageSize: logoSize,
        hideBackgroundDots: true
      }
    });
  }, [
    qrCode, payloadType, text, waNumber, waMessage, 
    dotsShape, cornersShape, dotsColor, bgColor, transparent,
    size, errorLevel, logoFile, logoSize, logoMargin
  ]);

  const onDownload = (ext) => {
    qrCode.download({
      name: fileName || 'qr',
      extension: ext
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setLogoFile(file);
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-20 px-6 font-sans text-slate-200 selection:bg-emerald-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <p className="text-emerald-400 font-bold text-xs uppercase tracking-[0.18em] mb-3">QR Studio</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Generador de QR Táctico</h1>
            <p className="text-slate-400 max-w-xl text-sm md:text-base leading-relaxed">
              Crea códigos QR ultra-personalizados para links, textos o mensajes de WhatsApp. Ajusta formas, colores y añade tu logotipo.
            </p>
          </div>
          <div className="px-6 py-3 rounded-full bg-emerald-500 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            PNG / SVG
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* FORMULARIO CONTROLES */}
          <div className="lg:col-span-8 bg-[#050505] border border-slate-900 rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl">
            
            {/* 1. Contenido */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><QrCode size={18} className="text-emerald-500"/> Contenido</h2>
              <div className="grid gap-4">
                <div className="bg-[#0b0b0b] border border-slate-900 rounded-2xl p-4 flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Tipo de QR</label>
                  <select 
                    value={payloadType} 
                    onChange={e => setPayloadType(e.target.value)}
                    className="bg-black border border-slate-800 rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
                  >
                    <option value="url">Enlace / URL</option>
                    <option value="text">Texto Libre</option>
                    <option value="whatsapp">Mensaje WhatsApp</option>
                  </select>
                </div>

                {payloadType !== 'whatsapp' ? (
                  <div className="bg-[#0b0b0b] border border-slate-900 rounded-2xl p-4 flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Destino</label>
                    <textarea 
                      value={text} 
                      onChange={e => setText(e.target.value)} 
                      rows={3} 
                      className="bg-black border border-slate-800 rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-emerald-500 resize-none"
                      placeholder="https://..."
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#0b0b0b] border border-slate-900 rounded-2xl p-4 flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Número (con código país)</label>
                      <input 
                        type="tel" 
                        value={waNumber} 
                        onChange={e => setWaNumber(e.target.value)} 
                        className="bg-black border border-slate-800 rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-emerald-500"
                        placeholder="51999999999"
                      />
                    </div>
                    <div className="bg-[#0b0b0b] border border-slate-900 rounded-2xl p-4 flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Mensaje (opcional)</label>
                      <textarea 
                        value={waMessage} 
                        onChange={e => setWaMessage(e.target.value)} 
                        rows={2}
                        className="bg-black border border-slate-800 rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-emerald-500 resize-none"
                        placeholder="Hola Pablo, quiero una cotización..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

            <hr className="border-slate-900" />

            {/* 2. Estilo Visual */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white">Estética</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-[#0b0b0b] border border-slate-900 rounded-2xl p-4 flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Forma de Puntos</label>
                  <select value={dotsShape} onChange={e => setDotsShape(e.target.value)} className="bg-black border border-slate-800 rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-emerald-500">
                    <option value="dots">Puntos circulares</option>
                    <option value="rounded">Redondeado suave</option>
                    <option value="classy">Elegante (Classy)</option>
                    <option value="classy-rounded">Elegante redondeado</option>
                    <option value="square">Cuadrados clásicos</option>
                    <option value="extra-rounded">Extra redondeado</option>
                  </select>
                </div>

                <div className="bg-[#0b0b0b] border border-slate-900 rounded-2xl p-4 flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Esquinas</label>
                  <select value={cornersShape} onChange={e => setCornersShape(e.target.value)} className="bg-black border border-slate-800 rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-emerald-500">
                    <option value="square">Cuadrado</option>
                    <option value="dot">Punto circular</option>
                    <option value="extra-rounded">Extra redondeado</option>
                  </select>
                </div>

                <div className="bg-[#0b0b0b] border border-slate-900 rounded-2xl p-4 flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Color Principal</label>
                  <input type="color" value={dotsColor} onChange={e => setDotsColor(e.target.value)} className="w-full h-12 bg-black border border-slate-800 rounded-xl cursor-pointer p-1" />
                </div>

                <div className="bg-[#0b0b0b] border border-slate-900 rounded-2xl p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 uppercase">Color Fondo</label>
                    <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                      <input type="checkbox" checked={transparent} onChange={e => setTransparent(e.target.checked)} className="accent-emerald-500" /> Transparente
                    </label>
                  </div>
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} disabled={transparent} className={`w-full h-12 bg-black border border-slate-800 rounded-xl p-1 ${transparent ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`} />
                </div>
              </div>
            </section>

            <hr className="border-slate-900" />

            {/* 3. Logo e Imagen */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><ImageIcon size={18} className="text-emerald-500"/> Logotipo Central</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-[#0b0b0b] border border-slate-900 rounded-2xl p-4 flex flex-col gap-2 justify-center">
                  <label className="text-xs font-bold text-slate-500 uppercase">Subir Logo</label>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20 transition-colors cursor-pointer" />
                </div>

                <div className="bg-[#0b0b0b] border border-slate-900 rounded-2xl p-4 flex flex-col gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <label className="text-xs font-bold text-slate-500 uppercase">Tamaño Logo</label>
                      <span className="text-xs text-emerald-400 font-mono">{Math.round(logoSize*100)}%</span>
                    </div>
                    <input type="range" min="0" max="0.5" step="0.05" value={logoSize} onChange={e => setLogoSize(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <label className="text-xs font-bold text-slate-500 uppercase">Margen Blanco</label>
                      <span className="text-xs text-emerald-400 font-mono">{logoMargin}px</span>
                    </div>
                    <input type="range" min="0" max="20" step="1" value={logoMargin} onChange={e => setLogoMargin(parseInt(e.target.value))} className="w-full accent-emerald-500" />
                  </div>
                </div>

              </div>
            </section>

          </div>

          {/* PREVIEW Y DESCARGA (Fijo en desktop) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            
            <div className="bg-[#050505] border border-slate-900 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 w-full text-left">Vista Previa Realtime</h3>
              
              {/* Contenedor del QR */}
              <div 
                className="bg-[#0b0b0b] p-4 rounded-3xl border border-slate-900/50 shadow-inner overflow-hidden flex items-center justify-center w-full min-h-[300px]"
                style={{
                  background: transparent ? 'repeating-conic-gradient(#111 0% 25%, #050505 0% 50%) 50% / 20px 20px' : bgColor
                }}
              >
                <div ref={qrRef} className="max-w-[260px] [&>svg]:w-full [&>svg]:h-auto [&>canvas]:w-full [&>canvas]:h-auto" />
              </div>

              <div className="w-full mt-8 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nombre archivo descarga</label>
                  <input type="text" value={fileName} onChange={e => setFileName(e.target.value)} className="w-full bg-black border border-slate-800 rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-emerald-500" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => onDownload('png')} className="py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_4px_14px_rgba(16,185,129,0.2)]">
                    <Download size={16} /> PNG
                  </button>
                  <button onClick={() => onDownload('svg')} className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                    <Download size={16} /> SVG
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
