import { useState } from 'react';

export default function BeforeAfterSlider({ antes, despues }) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950/60 shadow-2xl select-none group">
      {/* Imagen base: Después (Normalizado) */}
      <img
        src={despues}
        alt="Después (Normalizado)"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Etiqueta después */}
      <div className="absolute right-4 top-4 z-10 bg-emerald-500/90 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md border border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)] pointer-events-none">
        Después: Normado
      </div>

      {/* Imagen superpuesta: Antes (Borrador) */}
      <img
        src={antes}
        alt="Antes (Borrador)"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      />

      {/* Etiqueta antes */}
      <div className="absolute left-4 top-4 z-10 bg-red-500/90 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md border border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.3)] pointer-events-none">
        Antes: Borrador
      </div>

      {/* Línea divisoria vertical */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-accent-500 z-20 pointer-events-none shadow-[0_0_8px_rgba(6,182,212,0.8)]"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Mango del Slider */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-zinc-900 border-2 border-accent-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] z-20 group-hover:scale-110 transition-transform duration-200">
          <div className="flex gap-0.5 text-accent-400 text-xs font-mono font-bold select-none pointer-events-none">
            <span>&lt;</span>
            <span>&gt;</span>
          </div>
        </div>
      </div>

      {/* Controlador invisible tipo rango que cubre todo el contenedor */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
      />
    </div>
  );
}
