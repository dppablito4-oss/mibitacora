import { useState, useRef, useEffect } from 'react';
import useTripticoState from '../hooks/useTripticoState';
import TripticoCanvas from '../components/triptico/TripticoCanvas';
import { getColDisplayLabel } from '../utils/tripticoHelpers';
import TripticoInspector from '../components/triptico/TripticoInspector';
import AiGeneratorPanel from '../components/triptico/AiGeneratorPanel';
// Se elimina importación estática para usar dinámica y evitar errores de ESM en Vite
import { Download, LayoutTemplate, RotateCcw } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import logger from '../utils/logger';

export default function TripticoMakerPage() {
  const state = useTripticoState();
  const { showToast } = useToast();
  const {
    pages, activePageId, setActivePageId,
    activePage,
    selectedColIndex, setSelectedColIndex,
    selectedBlockId, setSelectedBlockId,
    selectedBlock,
    updateBlock, updateBlockStyle,
    addBlock, deleteBlock, moveBlock,
    updateColumn, updatePage,
    loadFromJson, resetToDefaults,
  } = state;

  const [exporting, setExporting] = useState(false);
  const [zoom, setZoom] = useState(1);
  const mainRef = useRef(null);

  // Wheel listener for Ctrl + Mouse Wheel Zoom
  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const zoomStep = 0.05;
        let newZoom = e.deltaY < 0 
          ? zoom + zoomStep 
          : zoom - zoomStep;
        newZoom = Math.max(0.4, Math.min(newZoom, 3.0));
        setZoom(Number(newZoom.toFixed(2)));
      }
    };

    mainEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      mainEl.removeEventListener('wheel', handleWheel);
    };
  }, [zoom]);

  // Lock body scroll while in the editor page
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleExportPDF = async () => {
    setExporting(true);
    // Deselect elements to hide outlines during print
    setSelectedColIndex(null);
    setSelectedBlockId(null);
    
    try {
      const { toPng } = await import('html-to-image');
      const { jsPDF } = await import('jspdf');

      // Front page
      setActivePageId('page-front');
      await new Promise(r => setTimeout(r, 600)); // Esperar que renderice
      const frontDom = document.querySelector('[data-triptico-page="page-front"]');
      if (!frontDom) throw new Error('Página frontal no encontrada en el DOM');
      
      // Ocultar artefactos de edición
      const hideNodesFront = frontDom.querySelectorAll('[data-export-hide]');
      hideNodesFront.forEach(n => { n.dataset.origDisplay = n.style.display; n.style.display = 'none'; });
      const colsFront = frontDom.querySelectorAll('[data-col]');
      colsFront.forEach(c => { c.dataset.origOutline = c.style.outline; c.style.outline = 'none'; });

      // Generar imagen frontal
      const frontDataUrl = await toPng(frontDom, { quality: 1, pixelRatio: 2 });

      // Restaurar artefactos de edición
      hideNodesFront.forEach(n => { n.style.display = n.dataset.origDisplay || ''; });
      colsFront.forEach(c => { c.style.outline = c.dataset.origOutline || ''; });
      
      // Back page
      setActivePageId('page-back');
      await new Promise(r => setTimeout(r, 600));
      const backDom = document.querySelector('[data-triptico-page="page-back"]');
      if (!backDom) throw new Error('Página trasera no encontrada en el DOM');

      // Ocultar artefactos de edición
      const hideNodesBack = backDom.querySelectorAll('[data-export-hide]');
      hideNodesBack.forEach(n => { n.dataset.origDisplay = n.style.display; n.style.display = 'none'; });
      const colsBack = backDom.querySelectorAll('[data-col]');
      colsBack.forEach(c => { c.dataset.origOutline = c.style.outline; c.style.outline = 'none'; });
      
      // Generar imagen trasera
      const backDataUrl = await toPng(backDom, { quality: 1, pixelRatio: 2 });

      // Restaurar
      hideNodesBack.forEach(n => { n.style.display = n.dataset.origDisplay || ''; });
      colsBack.forEach(c => { c.style.outline = c.dataset.origOutline || ''; });

      // Generar PDF
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      pdf.addImage(frontDataUrl, 'PNG', 0, 0, 297, 210);
      pdf.addPage();
      pdf.addImage(backDataUrl, 'PNG', 0, 0, 297, 210);
      
      pdf.save('mi-triptico.pdf');
    } catch (err) {
      logger.error('Error exporting PDF:', err);
      showToast('Error exportando a PDF: ' + err.message, 'error');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="h-screen pt-20 bg-black text-white flex flex-col font-sans print:bg-white print:pt-0 overflow-hidden print:h-auto print:overflow-visible">
      {/* HEADER */}
      <header className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-4 shrink-0 print:hidden">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.location.hash = '#/'}
            className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span className="text-xs font-bold uppercase tracking-wider">Volver</span>
          </button>
          <div className="w-px h-6 bg-zinc-800"></div>
          <div className="flex items-center gap-2">
            <LayoutTemplate className="text-cyan-400" />
            <h1 className="font-bold text-sm tracking-widest uppercase hidden sm:block">Tríptico Maker</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetToDefaults}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-1.5 px-3 rounded text-xs flex items-center gap-1.5 transition-all"
          >
            <RotateCcw size={12} /> Nuevo
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-1.5 px-4 rounded text-xs flex items-center gap-2 transition-all"
          >
            {exporting ? 'Generando PDF...' : <><Download size={14} /> Exportar a PDF</>}
          </button>
        </div>
      </header>

      {/* WORKSPACE */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden print:hidden">

        {/* LEFT PANEL */}
        <aside className="w-full lg:w-64 bg-zinc-950 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col shrink-0 overflow-y-auto lg:max-h-none max-h-48">
          <AiGeneratorPanel onApply={loadFromJson} />

          <div className="p-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Páginas</h3>
            <div className="space-y-2">
              <button
                onClick={() => { setActivePageId('page-front'); setSelectedColIndex(null); setSelectedBlockId(null); }}
                className={`w-full text-left px-3 py-2 rounded text-xs font-bold transition-colors ${activePageId === 'page-front' ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-800/50' : 'text-zinc-400 hover:bg-zinc-900'}`}
              >
                1. Exterior (Anverso)
              </button>
              <button
                onClick={() => { setActivePageId('page-back'); setSelectedColIndex(null); setSelectedBlockId(null); }}
                className={`w-full text-left px-3 py-2 rounded text-xs font-bold transition-colors ${activePageId === 'page-back' ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-800/50' : 'text-zinc-400 hover:bg-zinc-900'}`}
              >
                2. Interior (Reverso)
              </button>
            </div>

            {/* Column quick nav */}
            {activePage && (
              <div className="mt-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Columnas</h3>
                <div className="space-y-1">
                  {activePage.columns.map((col, i) => (
                    <button
                      key={col.id}
                      onClick={() => { setSelectedColIndex(i); setSelectedBlockId(null); }}
                      className={`w-full text-left px-3 py-1.5 rounded text-[11px] transition-colors ${selectedColIndex === i ? 'bg-cyan-900/30 text-cyan-400' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'}`}
                    >
                      {getColDisplayLabel(activePageId === 'page-front', i, col.label)}
                      <span className="text-zinc-600 ml-1">({col.blocks?.length || 0} bloques)</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        <main ref={mainRef} className="flex-1 bg-zinc-900 overflow-auto">
          <div className="p-4 lg:p-8 min-h-full flex flex-col items-center justify-center">
            <TripticoCanvas
              activePage={activePage}
              selectedColIndex={selectedColIndex}
              selectedBlockId={selectedBlockId}
              onSelectCol={setSelectedColIndex}
              onSelectBlock={setSelectedBlockId}
              zoom={zoom}
              onResetZoom={() => setZoom(1)}
              exporting={exporting}
            />
          </div>
        </main>

        {/* RIGHT PANEL */}
        <aside className="w-full lg:w-72 bg-zinc-950 border-t lg:border-t-0 lg:border-l border-zinc-800 flex flex-col shrink-0 overflow-y-auto max-h-[40vh] lg:max-h-none">
          <TripticoInspector
            activePage={activePage}
            selectedColIndex={selectedColIndex}
            selectedBlock={selectedBlock}
            onUpdateBlock={updateBlock}
            onUpdateBlockStyle={updateBlockStyle}
            onDeleteBlock={deleteBlock}
            onMoveBlock={moveBlock}
            onAddBlock={addBlock}
            onUpdateColumn={updateColumn}
            onUpdatePage={updatePage}
          />
        </aside>
      </div>

      {/* PRINT LAYOUT (Only visible when printing) */}
      <div className="hidden print:block w-full">
        {pages.map((page, i) => (
          <div 
            key={page.id} 
            className="mx-auto" 
            style={{ 
              width: '297mm', 
              height: '210mm', 
              pageBreakAfter: i === pages.length - 1 ? 'auto' : 'always',
              pageBreakInside: 'avoid'
            }}
          >
            <TripticoCanvas
              activePage={page}
              selectedColIndex={null}
              selectedBlockId={null}
              onSelectCol={() => {}}
              onSelectBlock={() => {}}
              zoom={1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
