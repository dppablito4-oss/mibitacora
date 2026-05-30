import React from 'react';
import { Type, Image as ImageIcon, Layout, Box, Trash2, Copy } from 'lucide-react';

export default function TripticoInspector({ el, onUpdate, onDuplicate, onDelete }) {
  if (!el) {
    return (
      <div className="p-8 text-center text-zinc-500 text-sm">
        <Box className="mx-auto mb-3 opacity-20" size={32} />
        Selecciona un elemento para editar sus propiedades
      </div>
    );
  }

  const s = el.style || {};
  const isText = el.type === 'text';
  const isImage = el.type === 'image';

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
          {isText && <Type size={14} />}
          {isImage && <ImageIcon size={14} />}
          {el.type}
        </h3>
        <div className="flex items-center gap-1">
          <button onClick={() => onDuplicate()} className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded" title="Duplicar">
            <Copy size={14} />
          </button>
          <button onClick={() => onDelete(el.id)} className="p-1.5 hover:bg-red-900/30 text-zinc-400 hover:text-red-400 rounded" title="Eliminar">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {isText && (
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] text-zinc-500 mb-1 uppercase font-bold">Tamaño de Fuente</label>
            <input 
              type="range" min="10" max="120" 
              value={s.fontSize || 24} 
              onChange={e => onUpdate({ style: { ...s, fontSize: Number(e.target.value) } })}
              className="w-full accent-cyan-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-zinc-500 mb-1 uppercase font-bold">Color Texto</label>
              <input 
                type="color" 
                value={s.color || '#000000'} 
                onChange={e => onUpdate({ style: { ...s, color: e.target.value } })}
                className="w-full h-8 rounded bg-zinc-900 border border-zinc-700 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 mb-1 uppercase font-bold">Alineación</label>
              <select 
                value={s.textAlign || 'left'}
                onChange={e => onUpdate({ style: { ...s, textAlign: e.target.value } })}
                className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-1.5 rounded"
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
                <option value="justify">Justificado</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-zinc-500 mb-1 uppercase font-bold">Grosor (Peso)</label>
            <select 
              value={s.fontWeight || '400'}
              onChange={e => onUpdate({ style: { ...s, fontWeight: e.target.value } })}
              className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-1.5 rounded"
            >
              <option value="300">Light</option>
              <option value="400">Regular</option>
              <option value="700">Bold</option>
              <option value="900">Black</option>
            </select>
          </div>
        </div>
      )}

      {isImage && (
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] text-zinc-500 mb-1 uppercase font-bold">URL de la Imagen</label>
            <input 
              type="text" 
              placeholder="https://..."
              value={el.src || ''} 
              onChange={e => onUpdate({ src: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-500 mb-1 uppercase font-bold">Bordes Redondeados</label>
            <input 
              type="range" min="0" max="100" 
              value={s.borderRadius || 0} 
              onChange={e => onUpdate({ style: { ...s, borderRadius: Number(e.target.value) } })}
              className="w-full accent-cyan-500"
            />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-500 mb-1 uppercase font-bold">Ajuste (Object Fit)</label>
            <select 
              value={s.objectFit || 'cover'}
              onChange={e => onUpdate({ style: { ...s, objectFit: e.target.value } })}
              className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-1.5 rounded"
            >
              <option value="cover">Recortar (Cover)</option>
              <option value="contain">Contener (Contain)</option>
              <option value="fill">Estirar (Fill)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
