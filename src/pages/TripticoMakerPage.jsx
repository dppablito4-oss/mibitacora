import { useState } from 'react';
import useTripticoState from '../hooks/useTripticoState';
import TripticoCanvas from '../components/triptico/TripticoCanvas';
import TripticoInspector from '../components/triptico/TripticoInspector';
import AiGeneratorPanel from '../components/triptico/AiGeneratorPanel';
import html2pdf from 'html2pdf.js';
import { Download, LayoutTemplate, RotateCcw } from 'lucide-react';

export default function TripticoMakerPage() {
  const state = useTripticoState();
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

  const handleExportPDF = async () => {
    setExporting(true);
    // Deselect everything for clean export
    setSelectedColIndex(null);
    setSelectedBlockId(null);

    try {
      const element = document.createElement('div');

      // Front page
      setActivePageId('page-front');
      await new Promise(r => setTimeout(r, 500));
      const frontDom = document.querySelector('[data-triptico-page="page-front"]');
      if (frontDom) {
        const clone = frontDom.cloneNode(true);
        clone.style.width = '297mm';
        clone.style.height = '210mm';
        clone.style.position = 'relative';
        clone.style.overflow = 'hidden';
        // Clean up editor artifacts
        clone.querySelectorAll('[data-export-hide]').forEach(el => el.remove());
        clone.querySelectorAll('[data-col]').forEach(c => { c.style.outline = 'none'; c.style.cursor = 'default'; });
        element.appendChild(clone);
      }

      const pageBreak = document.createElement('div');
      pageBreak.classList.add('html2pdf__page-break');
      element.appendChild(pageBreak);

      // Back page
      setActivePageId('page-back');
      await new Promise(r => setTimeout(r, 500));
      const backDom = document.querySelector('[data-triptico-page="page-back"]');
      if (backDom) {
        const clone = backDom.cloneNode(true);
        clone.style.width = '297mm';
        clone.style.height = '210mm';
        clone.style.position = 'relative';
        clone.style.overflow = 'hidden';
        clone.querySelectorAll('[data-export-hide]').forEach(el => el.remove());
        clone.querySelectorAll('[data-col]').forEach(c => { c.style.outline = 'none'; c.style.cursor = 'default'; });
        element.appendChild(clone);
      }

      const opt = {
        margin: 0,
        filename: 'mi-triptico.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('Error exporting PDF:', err);
      alert('Error exportando a PDF');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {/* HEADER */}
      <header className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-4 shrink-0">
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
            {exporting ? 'Generando PDF...' : <><Download size={14} /> Exportar PDF</>}
          </button>
        </div>
      </header>

      {/* WORKSPACE */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

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
                      {col.label || `Columna ${i + 1}`}
                      <span className="text-zinc-600 ml-1">({col.blocks?.length || 0} bloques)</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 bg-zinc-900 overflow-y-auto">
          <div className="p-4 lg:p-8 min-h-full flex flex-col items-center">
            <TripticoCanvas
              activePage={activePage}
              selectedColIndex={selectedColIndex}
              selectedBlockId={selectedBlockId}
              onSelectCol={setSelectedColIndex}
              onSelectBlock={setSelectedBlockId}
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
    </div>
  );
}
