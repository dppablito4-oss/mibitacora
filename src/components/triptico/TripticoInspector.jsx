import {
  Image as ImageIcon, FileImage, Trash2, RotateCcw, Palette,
  ChevronUp, ChevronDown, List, Minus, Heading1, Heading2, AlignLeft,
} from 'lucide-react';
import { getColDisplayLabel } from './TripticoCanvas';

/**
 * TripticoInspector — Edit properties of the selected block within a column.
 */
export default function TripticoInspector({
  activePage,
  selectedColIndex,
  selectedBlock,
  onUpdateBlock,
  onUpdateBlockStyle,
  onDeleteBlock,
  onMoveBlock,
  onAddBlock,
  onUpdateColumn,
  onUpdatePage,
}) {
  // ── No selection ──
  if (selectedColIndex === null || !activePage) {
    return (
      <div className="p-4 space-y-4">
        <div className="p-6 text-center text-zinc-500 text-xs">
          <FileImage className="mx-auto mb-3 opacity-20" size={28} />
          Selecciona una columna para editar
        </div>
        {activePage && <PageSettings activePage={activePage} onUpdatePage={onUpdatePage} />}
      </div>
    );
  }

  const col = activePage.columns[selectedColIndex];
  if (!col) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Column header */}
      <div className="p-3 border-b border-zinc-800 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            {getColDisplayLabel(activePage.id === 'page-front', selectedColIndex, col.label)}
          </h3>
        </div>
        {/* Add block buttons */}
        <div className="flex flex-wrap gap-1">
          <AddBtn icon={<Heading1 size={11} />} label="Título" onClick={() => onAddBlock(selectedColIndex, 'heading')} />
          <AddBtn icon={<Heading2 size={11} />} label="Subtítulo" onClick={() => onAddBlock(selectedColIndex, 'subheading')} />
          <AddBtn icon={<AlignLeft size={11} />} label="Texto" onClick={() => onAddBlock(selectedColIndex, 'paragraph')} />
          <AddBtn icon={<ImageIcon size={11} />} label="Imagen" onClick={() => onAddBlock(selectedColIndex, 'image')} />
          <AddBtn icon={<List size={11} />} label="Lista" onClick={() => onAddBlock(selectedColIndex, 'list')} />
          <AddBtn icon={<Minus size={11} />} label="Línea" onClick={() => onAddBlock(selectedColIndex, 'divider')} />
        </div>
      </div>

      {/* Block editor */}
      <div className="flex-1 overflow-y-auto p-3">
        {selectedBlock ? (
          <BlockEditor
            block={selectedBlock}
            colIndex={selectedColIndex}
            onUpdateBlock={onUpdateBlock}
            onUpdateBlockStyle={onUpdateBlockStyle}
            onDeleteBlock={onDeleteBlock}
            onMoveBlock={onMoveBlock}
          />
        ) : (
          <div className="text-center text-zinc-600 text-[11px] mt-8">
            Haz clic en un bloque del canvas para editarlo,<br/>
            o usa los botones de arriba para agregar contenido.
          </div>
        )}
      </div>

      {/* Column settings */}
      <div className="p-3 border-t border-zinc-800 shrink-0 space-y-3">
        {/* Margins selector */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-zinc-500 font-bold uppercase">Márgenes (Padding)</span>
          <select
            value={col.padding !== undefined ? col.padding : '4% 5%'}
            onChange={e => onUpdateColumn(selectedColIndex, { padding: e.target.value })}
            className="bg-zinc-900 border border-zinc-700 text-xs text-white p-1 rounded cursor-pointer"
          >
            <option value="4% 5%">Normal</option>
            <option value="2% 3%">Compacto</option>
            <option value="1% 1%">Mínimo</option>
            <option value="0">Lleno (Sin márgenes)</option>
          </select>
        </div>

        {/* Background color */}
        <div className="flex items-center gap-2">
          <Palette size={12} className="text-zinc-500" />
          <span className="text-[10px] text-zinc-500 font-bold uppercase">Fondo columna</span>
          <input
            type="color"
            value={col.bgColor || '#ffffff'}
            onChange={e => onUpdateColumn(selectedColIndex, { bgColor: e.target.value })}
            className="w-7 h-5 rounded bg-zinc-900 border border-zinc-700 cursor-pointer ml-auto"
          />
          <button
            onClick={() => onUpdateColumn(selectedColIndex, { bgColor: '' })}
            className="text-[9px] text-zinc-600 hover:text-zinc-400"
          >
            <RotateCcw size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Add block button ──
function AddBtn({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors border border-zinc-800"
    >
      {icon} {label}
    </button>
  );
}

// ── Block Editor (different forms per block type) ──
function BlockEditor({ block, colIndex, onUpdateBlock, onUpdateBlockStyle, onDeleteBlock, onMoveBlock }) {
  const s = block.style || {};
  const update = (changes) => onUpdateBlock(colIndex, block.id, changes);
  const updateStyle = (changes) => onUpdateBlockStyle(colIndex, block.id, changes);

  const typeLabels = {
    heading: 'Título', subheading: 'Subtítulo', paragraph: 'Párrafo',
    image: 'Imagen', list: 'Lista', divider: 'Línea separadora',
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
          {typeLabels[block.type] || block.type}
        </span>
        <div className="flex items-center gap-0.5">
          <button onClick={() => onMoveBlock(colIndex, block.id, -1)}
            className="p-1 hover:bg-zinc-800 text-zinc-500 hover:text-white rounded" title="Subir">
            <ChevronUp size={13} />
          </button>
          <button onClick={() => onMoveBlock(colIndex, block.id, 1)}
            className="p-1 hover:bg-zinc-800 text-zinc-500 hover:text-white rounded" title="Bajar">
            <ChevronDown size={13} />
          </button>
          <button onClick={() => onDeleteBlock(colIndex, block.id)}
            className="p-1 hover:bg-red-900/30 text-zinc-500 hover:text-red-400 rounded" title="Eliminar">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* ── Text blocks (heading, subheading, paragraph) ── */}
      {(block.type === 'heading' || block.type === 'subheading' || block.type === 'paragraph') && (
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] text-zinc-500 mb-1 font-bold">Texto</label>
            {block.type === 'paragraph' ? (
              <textarea
                value={block.text || ''}
                onChange={e => update({ text: e.target.value })}
                rows={5}
                className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-2 rounded resize-none leading-relaxed"
              />
            ) : (
              <input
                type="text"
                value={block.text || ''}
                onChange={e => update({ text: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 text-sm text-white p-2 rounded"
              />
            )}
          </div>
          <div>
            <label className="block text-[10px] text-zinc-500 mb-1 font-bold">Tamaño</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={block.type === 'paragraph' ? 8 : 12}
                max={block.type === 'heading' ? 48 : 30}
                value={s.fontSize || (block.type === 'heading' ? 22 : block.type === 'subheading' ? 16 : 12)}
                onChange={e => updateStyle({ fontSize: Number(e.target.value) })}
                className="flex-1 accent-cyan-500"
              />
              <span className="text-[10px] text-zinc-400 w-6 text-right">{s.fontSize || 12}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-zinc-500 mb-1 font-bold">Color</label>
              <input type="color" value={s.color || '#000000'}
                onChange={e => updateStyle({ color: e.target.value })}
                className="w-full h-7 rounded bg-zinc-900 border border-zinc-700 cursor-pointer" />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 mb-1 font-bold">Alineación</label>
              <select value={s.textAlign || 'left'}
                onChange={e => updateStyle({ textAlign: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-1.5 rounded">
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
                <option value="justify">Justificado</option>
              </select>
            </div>
          </div>
          {(block.type === 'heading' || block.type === 'subheading') && (
            <div>
              <label className="block text-[10px] text-zinc-500 mb-1 font-bold">Peso</label>
              <select value={s.fontWeight || '700'}
                onChange={e => updateStyle({ fontWeight: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-1.5 rounded">
                <option value="400">Regular</option>
                <option value="600">Semibold</option>
                <option value="700">Bold</option>
                <option value="900">Black</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* ── Image block ── */}
      {block.type === 'image' && (
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] text-zinc-500 mb-1 font-bold">URL de Imagen</label>
            <input type="text" value={block.src || ''} placeholder="https://..."
              onChange={e => update({ src: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-2 rounded" />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-500 mb-1 font-bold">Altura (px ref)</label>
            <input type="range" min={40} max={300} value={s.height || 120}
              onChange={e => updateStyle({ height: Number(e.target.value) })}
              className="w-full accent-cyan-500" />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-500 mb-1 font-bold">Bordes redondeados</label>
            <input type="range" min={0} max={50} value={s.borderRadius || 4}
              onChange={e => updateStyle({ borderRadius: Number(e.target.value) })}
              className="w-full accent-cyan-500" />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-500 mb-1 font-bold">Ajuste</label>
            <select value={s.objectFit || 'cover'}
              onChange={e => updateStyle({ objectFit: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-1.5 rounded">
              <option value="cover">Recortar (Cover)</option>
              <option value="contain">Contener</option>
              <option value="fill">Estirar</option>
            </select>
          </div>
        </div>
      )}

      {/* ── List block ── */}
      {block.type === 'list' && (
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] text-zinc-500 mb-1 font-bold">Elementos (uno por línea)</label>
            <textarea
              value={(block.items || []).join('\n')}
              onChange={e => update({ items: e.target.value.split('\n') })}
              rows={5}
              className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-2 rounded resize-none leading-relaxed"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-zinc-500 mb-1 font-bold">Marcador</label>
              <select value={s.marker || '•'}
                onChange={e => updateStyle({ marker: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-1.5 rounded">
                <option value="•">• Punto</option>
                <option value="→">→ Flecha</option>
                <option value="✓">✓ Check</option>
                <option value="★">★ Estrella</option>
                <option value="▸">▸ Triángulo</option>
                <option value="—">— Guión</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 mb-1 font-bold">Color marcador</label>
              <input type="color" value={s.markerColor || '#22d3ee'}
                onChange={e => updateStyle({ markerColor: e.target.value })}
                className="w-full h-7 rounded bg-zinc-900 border border-zinc-700 cursor-pointer" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-zinc-500 mb-1 font-bold">Tamaño texto</label>
            <input type="range" min={8} max={20} value={s.fontSize || 12}
              onChange={e => updateStyle({ fontSize: Number(e.target.value) })}
              className="w-full accent-cyan-500" />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-500 mb-1 font-bold">Color texto</label>
            <input type="color" value={s.color || '#333333'}
              onChange={e => updateStyle({ color: e.target.value })}
              className="w-full h-7 rounded bg-zinc-900 border border-zinc-700 cursor-pointer" />
          </div>
        </div>
      )}

      {/* ── Divider block ── */}
      {block.type === 'divider' && (
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] text-zinc-500 mb-1 font-bold">Color</label>
            <input type="color" value={s.color || '#cccccc'}
              onChange={e => updateStyle({ color: e.target.value })}
              className="w-full h-7 rounded bg-zinc-900 border border-zinc-700 cursor-pointer" />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-500 mb-1 font-bold">Grosor</label>
            <input type="range" min={1} max={5} value={s.thickness || 1}
              onChange={e => updateStyle({ thickness: Number(e.target.value) })}
              className="w-full accent-cyan-500" />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-500 mb-1 font-bold">Espaciado vertical</label>
            <input type="range" min={2} max={20} value={s.marginY || 8}
              onChange={e => updateStyle({ marginY: Number(e.target.value) })}
              className="w-full accent-cyan-500" />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page-level settings ──
function PageSettings({ activePage, onUpdatePage }) {
  return (
    <div className="border-t border-zinc-800 pt-3">
      <h4 className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-3 flex items-center gap-1.5">
        <Palette size={11} /> Fondo de Página
      </h4>
      <div className="space-y-3">
        <div>
          <label className="block text-[10px] text-zinc-500 mb-1 font-bold">Color</label>
          <input type="color" value={activePage.bgColor || '#ffffff'}
            onChange={e => onUpdatePage({ bgColor: e.target.value })}
            className="w-full h-7 rounded bg-zinc-900 border border-zinc-700 cursor-pointer" />
        </div>
        <div>
          <label className="block text-[10px] text-zinc-500 mb-1 font-bold">Imagen (URL)</label>
          <input type="text" placeholder="https://..." value={activePage.bgImage || ''}
            onChange={e => onUpdatePage({ bgImage: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-2 rounded" />
        </div>
      </div>
    </div>
  );
}
