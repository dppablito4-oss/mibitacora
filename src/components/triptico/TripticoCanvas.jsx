import { useRef } from 'react';

export const getColDisplayLabel = (isFront, colIdx, customLabel) => {
  const cleanLabel = customLabel ? String(customLabel).trim() : '';
  const defaultsFront = ['Contraportada', 'Dorso', 'Portada'];
  const defaultsBack = ['Panel 1', 'Panel 2', 'Panel 3', 'Introducción', 'Desarrollo', 'Soluciones', 'Conclusión'];
  
  const isDefault = !cleanLabel || 
                    defaultsFront.includes(cleanLabel) || 
                    defaultsBack.includes(cleanLabel);
                    
  if (isFront) {
    if (colIdx === 0) return isDefault ? 'Bloque 5 (Contraportada)' : `Bloque 5 (${cleanLabel})`;
    if (colIdx === 1) return isDefault ? 'Bloque 6 (Dorso / Anexos)' : `Bloque 6 (${cleanLabel})`;
    if (colIdx === 2) return isDefault ? 'Bloque 1 (Portada)' : `Bloque 1 (${cleanLabel})`;
  } else {
    if (colIdx === 0) return isDefault ? 'Bloque 2 (Presentación)' : `Bloque 2 (${cleanLabel})`;
    if (colIdx === 1) return isDefault ? 'Bloque 3 (Desarrollo)' : `Bloque 3 (${cleanLabel})`;
    if (colIdx === 2) return isDefault ? 'Bloque 4 (Desarrollo / Conclusión)' : `Bloque 4 (${cleanLabel})`;
  }
  return cleanLabel;
};

/**
 * TripticoCanvas — Renders a proper triptych: A4 landscape, 3 equal columns.
 * Each column renders its blocks (heading, subheading, paragraph, image, list, divider).
 */
export default function TripticoCanvas({
  activePage,
  selectedColIndex,
  selectedBlockId,
  onSelectCol,
  onSelectBlock,
}) {
  const canvasRef = useRef(null);

  if (!activePage) return null;

  const columns = activePage.columns || [];
  const isFront = activePage.id === 'page-front';

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="text-[10px] text-zinc-500 font-mono mb-2 flex items-center gap-2 shrink-0">
        <span>A4 HORIZONTAL (297x210mm)</span>
        <span className="text-zinc-700">·</span>
        <span>{isFront ? 'LADO EXTERIOR (ANVERSO)' : 'LADO INTERIOR (REVERSO)'}</span>
      </div>

      <div
        ref={canvasRef}
        data-triptico-page={activePage.id}
        className="relative overflow-hidden bg-white shadow-2xl shrink-0"
        onClick={() => { onSelectCol(null); onSelectBlock(null); }}
        style={{
          aspectRatio: '297 / 210',
          width: '100%',
          minHeight: '400px',
          backgroundImage: activePage.bgImage ? `url(${activePage.bgImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: activePage.bgColor || '#ffffff',
          containerType: 'inline-size',
        }}
      >
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
          {columns.map((col, colIdx) => {
            const isColSelected = selectedColIndex === colIdx;

            return (
              <div
                key={col.id || colIdx}
                data-col={colIdx}
                onClick={(e) => { e.stopPropagation(); onSelectCol(colIdx); onSelectBlock(null); }}
                style={{
                  flex: '1 1 0%',
                  borderRight: colIdx < 2 ? '1px dashed rgba(0,0,0,0.15)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '4% 5%',
                  position: 'relative',
                  cursor: 'pointer',
                  outline: isColSelected ? '2px solid #22d3ee' : 'none',
                  outlineOffset: '-2px',
                  backgroundColor: col.bgColor || 'transparent',
                  transition: 'outline-color 0.15s ease',
                  overflow: 'hidden',
                }}
              >
                {/* Column label */}
                <div data-export-hide="true" style={{
                  position: 'absolute', top: '1.5%', left: '50%', transform: 'translateX(-50%)',
                  fontSize: '0.55cqw', color: isColSelected ? '#22d3ee' : 'rgba(0,0,0,0.2)',
                  fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em',
                  fontWeight: 'bold', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 5,
                }}>
                  {getColDisplayLabel(isFront, colIdx, col.label)}
                </div>

                {/* Render blocks */}
                {(col.blocks || []).map((block) => (
                  <BlockRenderer
                    key={block.id}
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onSelect={(e) => {
                      e.stopPropagation();
                      onSelectCol(colIdx);
                      onSelectBlock(block.id);
                    }}
                  />
                ))}

                {/* Empty state */}
                {(!col.blocks || col.blocks.length === 0) && (
                  <div style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(0,0,0,0.12)', fontSize: '0.8cqw', textAlign: 'center',
                  }}>
                    Columna vacía
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Block Renderer ──────────────────────────────────────────────────────────────
function BlockRenderer({ block, isSelected, onSelect }) {
  const s = block.style || {};

  const selectedOutline = isSelected
    ? { outline: '1.5px solid rgba(34,211,238,0.7)', outlineOffset: '1px', borderRadius: '2px' }
    : {};

  switch (block.type) {
    case 'heading':
      return (
        <div onClick={onSelect} style={{ cursor: 'pointer', ...selectedOutline }}>
          <h3 style={{
            fontSize: `${((s.fontSize || 22) / 16).toFixed(3)}cqw`,
            fontWeight: s.fontWeight || '700',
            color: s.color || '#000000',
            textAlign: s.textAlign || 'left',
            margin: '0 0 0.4cqw 0',
            lineHeight: 1.2,
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
          }}>
            {block.text || 'Título'}
          </h3>
        </div>
      );

    case 'subheading':
      return (
        <div onClick={onSelect} style={{ cursor: 'pointer', ...selectedOutline }}>
          <h4 style={{
            fontSize: `${((s.fontSize || 16) / 16).toFixed(3)}cqw`,
            fontWeight: s.fontWeight || '600',
            color: s.color || '#1a1a1a',
            textAlign: s.textAlign || 'left',
            margin: '0.5cqw 0 0.3cqw 0',
            lineHeight: 1.25,
            wordBreak: 'break-word',
          }}>
            {block.text || 'Subtítulo'}
          </h4>
        </div>
      );

    case 'paragraph':
      return (
        <div onClick={onSelect} style={{ cursor: 'pointer', ...selectedOutline }}>
          <p style={{
            fontSize: `${((s.fontSize || 12) / 16).toFixed(3)}cqw`,
            color: s.color || '#333333',
            textAlign: s.textAlign || 'left',
            lineHeight: s.lineHeight || 1.5,
            margin: '0 0 0.4cqw 0',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {block.text || ''}
          </p>
        </div>
      );

    case 'image':
      return (
        <div onClick={onSelect} style={{
          cursor: 'pointer', margin: '0.3cqw 0',
          ...selectedOutline,
        }}>
          {block.src ? (
            <img
              src={block.src}
              alt={block.alt || ''}
              draggable={false}
              style={{
                width: '100%',
                height: `${((s.height || 120) / 16).toFixed(1)}cqw`,
                objectFit: s.objectFit || 'cover',
                borderRadius: `${((s.borderRadius || 4) / 16).toFixed(2)}cqw`,
                display: 'block',
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: `${((s.height || 120) / 16).toFixed(1)}cqw`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1.5px dashed rgba(0,0,0,0.15)',
              borderRadius: `${((s.borderRadius || 4) / 16).toFixed(2)}cqw`,
              color: 'rgba(0,0,0,0.25)', fontSize: '0.75cqw',
            }}>
              🖼️ Imagen (sin URL)
            </div>
          )}
        </div>
      );

    case 'list':
      return (
        <div onClick={onSelect} style={{
          cursor: 'pointer', margin: '0.2cqw 0 0.5cqw 0',
          ...selectedOutline,
        }}>
          <ul style={{
            listStyle: 'none', padding: 0, margin: 0,
          }}>
            {(block.items || []).map((item, i) => (
              <li key={i} style={{
                fontSize: `${((s.fontSize || 12) / 16).toFixed(3)}cqw`,
                color: s.color || '#333333',
                lineHeight: 1.6,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.3cqw',
              }}>
                <span style={{
                  color: s.markerColor || '#22d3ee',
                  fontWeight: '700',
                  flexShrink: 0,
                  fontSize: `${((s.fontSize || 12) / 16).toFixed(3)}cqw`,
                }}>
                  {s.marker || '•'}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'divider':
      return (
        <div onClick={onSelect} style={{
          cursor: 'pointer',
          margin: `${((s.marginY || 8) / 16).toFixed(2)}cqw 0`,
          ...selectedOutline,
        }}>
          <hr style={{
            border: 'none',
            borderTop: `${s.thickness || 1}px solid ${s.color || '#cccccc'}`,
            margin: 0,
          }} />
        </div>
      );

    default:
      return null;
  }
}
