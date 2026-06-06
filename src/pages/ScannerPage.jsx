/* global cv */
import { useEffect } from 'react';
import { Upload, X, Check, Image as ImageIcon, FileText, Layout, RotateCcw, Copy, Trash2, Download } from 'lucide-react';
import logger from '../utils/logger';

export default function ScannerPage() {
  useEffect(() => {
    // Simple script loader (callback-based, like the standalone site)
    const loadScript = (src, onLoad) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        if (onLoad) onLoad();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      if (onLoad) script.onload = onLoad;
      document.body.appendChild(script);
    };

    // ── STEP 1: Define the OpenCV ready callback FIRST (before any script loads) ──
    // This exactly mirrors the standalone site's pattern
    window.onOpenCvReady = () => {
      logger.log('[Scanner] OpenCV Ready');
      if (window.App && window.App.onOpenCvReady) {
        window.App.onOpenCvReady();
      } else {
        window._opencvReady = true;
      }
    };

    // ── STEP 2: Load PDF.js and JSZip (small, fast) ──
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    });
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

    // ── STEP 3: Import app.js and init IMMEDIATELY (don't wait for OpenCV!) ──
    // This makes tabs, buttons, and file uploads work right away.
    // OpenCV loads in the background — user can upload files while it downloads.
    import('../lib/leans/app.js').then((module) => {
      window.App = module.default || window.App;

      if (window.App && window.App.init) {
        window.App.init();
      }

      // If OpenCV already loaded before app init, notify it
      if (window._opencvReady || (typeof cv !== 'undefined' && cv.Mat)) {
        window.App.onOpenCvReady();
      }
    });

    // ── STEP 4: Load OpenCV.js in the background (8.5MB, takes time) ──
    // Exactly like the standalone: <script async src="opencv.js" onload="onOpenCvReady()">
    loadScript('https://docs.opencv.org/4.10.0/opencv.js', () => {
      logger.log('[Scanner] OpenCV script downloaded');
      window.onOpenCvReady();
    });

    return () => {
      // Cleanup globals para evitar estado zombie al navegar fuera
      delete window.onOpenCvReady;
      delete window._opencvReady;
      if (window.App?.destroy) window.App.destroy();
      delete window.App;
    };
  }, []);

  return (
    <div className="min-h-screen pt-20 flex flex-col">
      {/* Tesseract Header for Scanner */}
      <div className="bg-dark/80 border-b border-tesseract-500/20 px-4 py-3 flex items-center justify-between z-10 backdrop-blur-md">
        <h2 className="text-xl font-bold uppercase tracking-wider text-white">Escáner <span className="text-tesseract-500">Documental</span></h2>
      </div>

      {/* Tabs Bar */}
      <nav id="tabs-bar" className="bg-card border-b border-tesseract-500/10 flex overflow-x-auto no-scrollbar items-center px-2 py-1 gap-2 z-10">
        <div id="tabs-list" className="flex gap-2"></div>
        <button id="btn-add-tab" className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded bg-tesseract-500/10 text-tesseract-300 hover:bg-tesseract-500/20 text-sm font-medium border border-tesseract-500/30 transition-colors">
          <span className="text-lg leading-none">+</span> Nuevo Documento
        </button>
      </nav>

      {/* Main Workspace */}
      <main id="app-main" className="flex-1 relative overflow-hidden flex flex-col">

        {/* STATE 1: Upload Zone */}
        <section id="upload-zone" className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-dark">
          <div className="scanner-upload-zone flex flex-col items-center justify-center w-full max-w-2xl h-80 rounded-2xl bg-card/50 cursor-pointer">
            <Upload size={48} className="text-tesseract-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Sube tu documento</h2>
            <p className="text-slate-400 mb-6 text-center">Arrastra una imagen aquí o usa el botón</p>
            <button id="btn-select-file" className="bg-tesseract-500 hover:bg-tesseract-600 text-white px-6 py-3 rounded font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
              <ImageIcon size={20} /> Seleccionar archivo
            </button>
            <input type="file" accept="image/*,application/pdf" capture="environment" multiple id="file-input" className="hidden" />
          </div>
        </section>

        {/* STATE 2: Editor Zone */}
        <section id="editor-zone" className="hidden absolute inset-0 flex flex-col md:flex-row bg-dark">
          {/* Canvas Area */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4 bg-black/50">
            <div id="canvas-wrapper" className="relative inline-flex items-center justify-center max-w-full max-h-full">
              <canvas id="canvasInput" className="max-w-full max-h-full block"></canvas>
              <canvas id="canvasOverlay" className="absolute top-0 left-0 w-full h-full touch-none"></canvas>
            </div>
          </div>
          
          {/* Editor Controls */}
          <aside className="w-full md:w-80 bg-card border-t md:border-t-0 md:border-l border-tesseract-500/20 flex flex-col p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] md:shadow-none z-20 shrink-0">
            <div className="bg-tesseract-500/10 border border-tesseract-500/30 rounded p-3 mb-4 flex items-start gap-3">
              <Layout className="text-tesseract-400 shrink-0 mt-0.5" size={18} />
              <span className="text-sm text-tesseract-100">Arrastra los puntos azules para ajustar las esquinas del documento.</span>
            </div>
            
            <div className="mt-auto grid grid-cols-2 gap-3" id="editor-controls">
              <button id="btn-cancel" className="flex items-center justify-center gap-2 px-4 py-3 rounded border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium transition-colors">
                <X size={18} /> Cancelar
              </button>
              <button id="btn-scan" className="flex items-center justify-center gap-2 px-4 py-3 rounded bg-tesseract-500 text-white hover:bg-tesseract-600 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
                <Check size={18} /> Escanear
              </button>
            </div>
          </aside>
        </section>

        {/* STATE 3: Result Zone */}
        <section id="result-zone" className="hidden absolute inset-0 flex flex-col md:flex-row bg-dark">
          {/* Canvas Area */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4 bg-black/50">
            <div className="relative max-w-full max-h-full shadow-[0_0_30px_rgba(0,0,0,0.8)]">
              <canvas id="canvasOutput" className="max-w-full max-h-[70vh] md:max-h-[85vh] object-contain"></canvas>
            </div>
          </div>

          {/* Result Sidebar */}
          <aside className="w-full md:w-80 bg-card border-t md:border-t-0 md:border-l border-tesseract-500/20 flex flex-col shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-20 shrink-0 h-auto md:h-full max-h-[50vh] md:max-h-none overflow-y-auto">
            <div className="p-4 border-b border-tesseract-500/10 flex justify-between items-center bg-dark/50">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold uppercase tracking-wider">
                <Check size={16} /> Listo
              </div>
              <span id="page-counter" className="text-sm font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">1 / 1</span>
            </div>

            {/* Thumbnails strip */}
            <div id="pages-strip" className="hidden border-b border-tesseract-500/10 bg-dark p-2 overflow-x-auto">
              <div id="pages-strip-list" className="flex gap-2"></div>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-tesseract-500/10">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Filtros</h3>
              <div id="filter-selector" className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
                <button className="filter-btn active shrink-0 px-3 py-1.5 rounded border border-slate-700 bg-slate-800 text-sm text-slate-300" data-filter="color" id="filter-color">Color</button>
                <button className="filter-btn shrink-0 px-3 py-1.5 rounded border border-slate-700 bg-slate-800 text-sm text-slate-300" data-filter="document" id="filter-document">Documento</button>
                <button className="filter-btn shrink-0 px-3 py-1.5 rounded border border-slate-700 bg-slate-800 text-sm text-slate-300" data-filter="whiteboard" id="filter-whiteboard">Pizarra</button>
                <button className="filter-btn shrink-0 px-3 py-1.5 rounded border border-slate-700 bg-slate-800 text-sm text-slate-300" data-filter="gray" id="filter-gray">Grises</button>
                <button className="filter-btn shrink-0 px-3 py-1.5 rounded border border-slate-700 bg-slate-800 text-sm text-slate-300" data-filter="highcontrast" id="filter-highcontrast">Contraste</button>
              </div>
            </div>

            {/* Controls */}
            <div id="result-controls" className="p-4 grid grid-cols-2 gap-3 mt-auto">
              <button id="btn-readjust" className="flex items-center justify-center gap-2 px-3 py-2 rounded border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm transition-colors">
                <RotateCcw size={16} /> Re-ajustar
              </button>
              <button id="btn-apply-all" className="flex items-center justify-center gap-2 px-3 py-2 rounded border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm transition-colors">
                <Copy size={16} /> Aplicar a todas
              </button>
              <button id="btn-add-page" className="flex items-center justify-center gap-2 px-3 py-2 rounded border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm transition-colors">
                <FileText size={16} /> + Página
              </button>
              <button id="btn-delete-page" className="flex items-center justify-center gap-2 px-3 py-2 rounded border border-red-900/50 bg-red-900/20 text-red-400 hover:bg-red-900/40 text-sm transition-colors">
                <Trash2 size={16} /> Eliminar
              </button>
              
              <div className="col-span-2 grid grid-cols-2 gap-3 mt-2">
                <button id="btn-download" className="flex items-center justify-center gap-2 px-3 py-3 rounded bg-tesseract-700 text-white hover:bg-tesseract-600 font-bold transition-colors">
                  <ImageIcon size={18} /> Imágenes
                </button>
                <button id="btn-download-pdf" className="flex items-center justify-center gap-2 px-3 py-3 rounded bg-tesseract-500 text-white hover:bg-tesseract-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
                  <Download size={18} /> PDF
                </button>
              </div>
            </div>
          </aside>
        </section>

      </main>

      {/* Loader Overlay (Non-blocking) */}
      <div id="opencv-loader" className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-tesseract-900/90 border border-tesseract-500/30 text-white px-5 py-3 rounded-lg backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-opacity duration-500">
        <div className="w-5 h-5 border-2 border-tesseract-500/30 border-t-tesseract-500 rounded-full animate-spin"></div>
        <div className="text-sm font-medium tracking-wide">Cargando motor de visión...</div>
      </div>

      {/* Toasts */}
      <div id="toast-container" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2"></div>
    </div>
  );
}
