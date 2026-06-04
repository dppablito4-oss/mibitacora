import { useRef, useState, useEffect } from 'react';
import { getColDisplayLabel } from '../../utils/tripticoHelpers';

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
  zoom = 1,
  onResetZoom,
  exporting = false,
}) {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(1000);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!activePage) return null;

  const columns = activePage.columns || [];
  const isFront = activePage.id === 'page-front';

  const canvasWidth = 1122;
  const canvasHeight = 794;
  const padding = 32;
  const availableWidth = Math.max(containerWidth - padding, 400);
  const baseScale = Math.min(availableWidth / canvasWidth, 1);
  const finalScale = exporting ? 1 : (baseScale * zoom);

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center justify-center overflow-visible select-none">
      <div className="text-[10px] text-zinc-500 font-mono mb-2 flex items-center gap-2 shrink-0 select-none print:hidden">
        <span>A4 HORIZONTAL (297x210mm)</span>
        <span className="text-zinc-700">·</span>
        <span>{isFront ? 'LADO EXTERIOR (ANVERSO)' : 'LADO INTERIOR (REVERSO)'}</span>
        {zoom !== 1 && (
          <>
            <span className="text-zinc-700">·</span>
            <span className="text-cyan-400 font-bold">{Math.round(zoom * 100)}% Zoom</span>
            <button 
              onClick={() => onResetZoom && onResetZoom()}
              className="text-[9px] text-zinc-500 hover:text-zinc-300 ml-1 underline cursor-pointer"
            >
              Restablecer
            </button>
          </>
        )}
      </div>

      <div 
        style={{
          width: `${canvasWidth * finalScale}px`,
          height: `${canvasHeight * finalScale}px`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflow: 'visible',
          transition: exporting ? 'none' : 'width 0.1s ease-out, height 0.1s ease-out',
        }}
        className="relative shrink-0 print:m-0"
      >
        <div
          data-triptico-page={activePage.id}
          className="relative overflow-hidden bg-white shadow-2xl shrink-0"
          onClick={() => { onSelectCol(null); onSelectBlock(null); }}
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            transform: `scale(${finalScale})`,
            transformOrigin: 'top center',
            backgroundImage: activePage.bgImage ? `url(${activePage.bgImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: activePage.bgColor || '#ffffff',
            containerType: 'inline-size',
            position: 'absolute',
            top: 0,
            left: '50%',
            marginLeft: `-${canvasWidth / 2}px`,
            transition: exporting ? 'none' : 'transform 0.1s ease-out',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', width: '100%', height: '100%', boxSizing: 'border-box' }}>
            {columns.map((col, colIdx) => {
              const isColSelected = selectedColIndex === colIdx;
              const colPadding = col.padding !== undefined ? col.padding : '4% 5%';

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
                    padding: colPadding,
                    position: 'relative',
                    cursor: 'pointer',
                    outline: isColSelected ? '2px solid #22d3ee' : 'none',
                    outlineOffset: '-2px',
                    backgroundColor: col.bgColor || 'transparent',
                    transition: 'outline-color 0.15s ease',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
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
                    colPadding={colPadding}
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
    </div>
  );
}

// ── Block Renderer ──────────────────────────────────────────────────────────────
function BlockRenderer({ block, isSelected, onSelect, colPadding }) {
  const s = block.style || {};

  const selectedOutline = isSelected
    ? { outline: '1.5px solid rgba(34,211,238,0.7)', outlineOffset: '1px', borderRadius: '2px' }
    : {};

  // Parse horizontal padding from colPadding (e.g. "4% 5%")
  const getHorizontalPadding = (paddingStr) => {
    if (!paddingStr) return '0%';
    const parts = String(paddingStr).trim().split(/\s+/);
    if (parts.length > 1) {
      return parts[1];
    }
    return parts[0];
  };

  const horizontalPadding = getHorizontalPadding(colPadding);

  // Layout styles based on selected settings
  const layoutStyle = {
    ...(s.fullWidth ? {
      marginLeft: `calc(-1 * ${horizontalPadding})`,
      marginRight: `calc(-1 * ${horizontalPadding})`,
      width: `calc(100% + 2 * ${horizontalPadding})`,
      maxWidth: 'none',
      boxSizing: 'border-box',
    } : {}),
    ...(s.fillHeight ? {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
    } : {}),
  };

  switch (block.type) {
    case 'heading':
      return (
        <div onClick={onSelect} style={{ cursor: 'pointer', ...selectedOutline, ...layoutStyle }}>
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
        <div onClick={onSelect} style={{ cursor: 'pointer', ...selectedOutline, ...layoutStyle }}>
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
        <div onClick={onSelect} style={{ cursor: 'pointer', ...selectedOutline, ...layoutStyle }}>
          <p style={{
            fontSize: `${((s.fontSize || 12) / 16).toFixed(3)}cqw`,
            color: s.color || '#333333',
            textAlign: s.textAlign || 'left',
            lineHeight: s.lineHeight || 1.5,
            margin: '0 0 0.4cqw 0',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            ...(s.fillHeight ? { flexGrow: 1, height: '100%' } : {}),
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
          ...layoutStyle,
        }}>
          {block.src ? (
            <img
              src={block.src}
              alt={block.alt || ''}
              draggable={false}
              style={{
                width: '100%',
                height: s.fillHeight ? '100%' : `${((s.height || 120) / 16).toFixed(1)}cqw`,
                objectFit: s.objectFit || 'cover',
                borderRadius: s.fullWidth ? '0px' : `${((s.borderRadius || 4) / 16).toFixed(2)}cqw`,
                display: 'block',
                ...(s.fillHeight ? { flexGrow: 1 } : {}),
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: s.fillHeight ? '100%' : `${((s.height || 120) / 16).toFixed(1)}cqw`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1.5px dashed rgba(0,0,0,0.15)',
              borderRadius: s.fullWidth ? '0px' : `${((s.borderRadius || 4) / 16).toFixed(2)}cqw`,
              color: 'rgba(0,0,0,0.25)', fontSize: '0.75cqw',
              ...(s.fillHeight ? { flexGrow: 1 } : {}),
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
          ...layoutStyle,
        }}>
          <ul style={{
            listStyle: 'none', padding: 0, margin: 0,
            ...(s.fillHeight ? { flexGrow: 1, height: '100%' } : {}),
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
          ...layoutStyle,
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
