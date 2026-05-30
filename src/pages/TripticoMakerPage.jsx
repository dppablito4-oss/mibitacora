import React, { useState } from 'react';
import useTripticoState from '../hooks/useTripticoState';
import TripticoCanvas from '../components/triptico/TripticoCanvas';
import TripticoInspector from '../components/triptico/TripticoInspector';
import AiGeneratorPanel from '../components/triptico/AiGeneratorPanel';
import html2pdf from 'html2pdf.js';
import { Download, Plus, LayoutTemplate } from 'lucide-react';

export default function TripticoMakerPage() {
  const state = useTripticoState();
  const {
    pages, activePageId, setActivePageId,
    selectedEl, updateElement, deleteElement, addElement, duplicateElement,
    loadFromJson
  } = state;

  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    setExporting(true);
    // Para exportar un tríptico (que son 2 hojas), podríamos exportar primero la hoja A,
    // y luego la hoja B, pero html2pdf maneja elementos por ID.
    // La forma más limpia es hacer un contenedor temporal con ambos lados.
    
    const element = document.createElement('div');
    
    // Clonar el DOM del lado Frontal
    setActivePageId('page-front');
    await new Promise(r => setTimeout(r, 300)); // Esperar render
    const frontDom = document.getElementById('triptico-export-area-page-front');
    if (frontDom) {
      const frontClone = frontDom.cloneNode(true);
      // Forzar fondo
      frontClone.style.backgroundColor = pages[0].bgColor || '#fff';
      if (pages[0].bgImage) {
        frontClone.style.backgroundImage = `url(${pages[0].bgImage})`;
        frontClone.style.backgroundSize = 'cover';
      }
      frontClone.style.width = '297mm';
      frontClone.style.height = '210mm';
      frontClone.style.position = 'relative';
      frontClone.style.overflow = 'hidden';
      element.appendChild(frontClone);
    }

    // Un page break
    const pageBreak = document.createElement('div');
    pageBreak.classList.add('html2pdf__page-break');
    element.appendChild(pageBreak);

    // Clonar el DOM del lado Interior
    setActivePageId('page-back');
    await new Promise(r => setTimeout(r, 300));
    const backDom = document.getElementById('triptico-export-area-page-back');
    if (backDom) {
      const backClone = backDom.cloneNode(true);
      backClone.style.backgroundColor = pages[1].bgColor || '#fff';
      if (pages[1].bgImage) {
        backClone.style.backgroundImage = `url(${pages[1].bgImage})`;
        backClone.style.backgroundSize = 'cover';
      }
      backClone.style.width = '297mm';
      backClone.style.height = '210mm';
      backClone.style.position = 'relative';
      backClone.style.overflow = 'hidden';
      element.appendChild(backClone);
    }

    const opt = {
      margin:       0,
      filename:     'mi-triptico.pdf',
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      setExporting(false);
    }).catch(err => {
      console.error(err);
      setExporting(false);
      alert('Error exportando a PDF');
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      
      {/* HEADER */}
      <header className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="text-cyan-400" />
          <h1 className="font-bold text-sm tracking-widest uppercase">Tríptico Maker Pro</h1>
        </div>
        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-1.5 px-4 rounded text-xs flex items-center gap-2 transition-all"
        >
          {exporting ? 'Generando PDF...' : <><Download size={14} /> Exportar A4</>}
        </button>
      </header>

      {/* WORKSPACE */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT PANEL */}
        <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col shrink-0 overflow-y-auto">
          <AiGeneratorPanel onApply={loadFromJson} />

          <div className="p-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Páginas</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setActivePageId('page-front')}
                className={`w-full text-left px-3 py-2 rounded text-xs font-bold transition-colors ${activePageId === 'page-front' ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-800/50' : 'text-zinc-400 hover:bg-zinc-900'}`}
              >
                1. Exterior (Portada)
              </button>
              <button 
                onClick={() => setActivePageId('page-back')}
                className={`w-full text-left px-3 py-2 rounded text-xs font-bold transition-colors ${activePageId === 'page-back' ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-800/50' : 'text-zinc-400 hover:bg-zinc-900'}`}
              >
                2. Interior (Contenido)
              </button>
            </div>
          </div>
        </aside>

        {/* CENTER CANVAS */}
        <main className="flex-1 bg-zinc-900 overflow-y-auto flex flex-col">
          {/* Toolbar central */}
          <div className="h-12 bg-zinc-950 border-b border-zinc-800 flex items-center justify-center gap-2 shrink-0">
            <button onClick={() => addElement('text')} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 transition-colors">
              <Plus size={14} /> Texto
            </button>
            <button onClick={() => addElement('image')} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 transition-colors">
              <Plus size={14} /> Imagen
            </button>
            <button onClick={() => addElement('comparison')} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 transition-colors">
              <Plus size={14} /> Tabla Comparativa
            </button>
            <button onClick={() => addElement('bento')} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 transition-colors">
              <Plus size={14} /> Grilla Bento
            </button>
          </div>
          
          <div className="flex-1 p-8 flex items-center justify-center relative">
            <TripticoCanvas
              activePage={state.activePage}
              selectedElId={state.selectedElId}
              onSelectEl={state.setSelectedElId}
              onUpdateEl={updateElement}
              onDeleteEl={deleteElement}
            />
          </div>
        </main>

        {/* RIGHT PANEL (Inspector) */}
        <aside className="w-72 bg-zinc-950 border-l border-zinc-800 flex flex-col shrink-0 overflow-y-auto">
          <TripticoInspector 
            el={selectedEl} 
            onUpdate={(changes) => updateElement(selectedEl.id, changes)}
            onDuplicate={duplicateElement}
            onDelete={deleteElement}
          />
        </aside>

      </div>
    </div>
  );
}
