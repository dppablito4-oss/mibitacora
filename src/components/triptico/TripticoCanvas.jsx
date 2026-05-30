import { useRef } from 'react';
import CanvasElement from './CanvasElement';
import UnsplashBadge from './UnsplashBadge';

export default function TripticoCanvas({ 
  activePage, 
  selectedElId, 
  onSelectEl, 
  onUpdateEl, 
  onDeleteEl,
  canEdit = true
}) {
  const canvasRef = useRef(null);

  if (!activePage) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="text-[10px] text-zinc-500 font-mono mb-2 flex items-center gap-2 shrink-0">
        <span>A4 HORIZONTAL (297x210mm)</span>
        <span className="text-zinc-700">·</span>
        <span>{activePage.id === 'page-front' ? 'LADO EXTERIOR' : 'LADO INTERIOR'}</span>
      </div>

      <div
        className="relative overflow-hidden bg-white shadow-2xl focus:outline-none shrink-0"
        ref={canvasRef}
        onClick={() => onSelectEl(null)}
        tabIndex={-1}
        style={{
          aspectRatio: '297 / 210', // A4 Landscape ratio
          height: '100%',
          maxHeight: 'calc(100% - 30px)',
          maxWidth: '100%',
          backgroundImage: activePage.bgImage ? `url(${activePage.bgImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: activePage.bgColor || '#ffffff',
          containerType: 'inline-size',
        }}
      >
        {/* Líneas guía para los dobleces del tríptico (cada 33.33%) */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: '33.33%',
          width: '1px', borderLeft: '1px dashed rgba(0,0,0,0.2)', zIndex: 1, pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: '66.66%',
          width: '1px', borderLeft: '1px dashed rgba(0,0,0,0.2)', zIndex: 1, pointerEvents: 'none'
        }} />

        {/* Márgenes de seguridad (opcional, ayuda visual) */}
        <div style={{
          position: 'absolute', inset: '1.5%', // ~5mm margin
          border: '1px solid rgba(0,100,255,0.1)', zIndex: 1, pointerEvents: 'none', borderRadius: '4px'
        }} />

        {activePage.unsplashCredit && <UnsplashBadge credit={activePage.unsplashCredit} />}

        {/* Elements */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3 }} id={`triptico-export-area-${activePage.id}`}>
          {(activePage.elements || []).map(el =>
            canEdit ? (
              <CanvasElement
                key={el.id}
                el={el}
                isSelected={selectedElId === el.id}
                onSelect={onSelectEl}
                onUpdate={onUpdateEl}
                onDelete={onDeleteEl}
                containerRef={canvasRef}
              />
            ) : (
              <div key={el.id} style={{
                position: 'absolute',
                left: `${el.x}%`, top: `${el.y}%`,
                width: `${el.w}%`, height: `${el.h}%`,
                pointerEvents: 'none',
              }}>
                 {/* Here we would need a pure static renderer if we ever do preview-only */}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
