import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Terminal, 
  FileText, 
  FileDown, 
  ExternalLink, 
  Image as ImageIcon,
  Lock,
  ChevronRight,
  Send
} from 'lucide-react';
import { evidencias } from '../../data/evidencias';
import BeforeAfterSlider from './BeforeAfterSlider';
import DecryptionModal from './DecryptionModal';

export default function ServiciosSection({ services }) {
  const [activeTab, setActiveTab] = useState('academico'); // 'academico', 'grafico', 'identidades', 'otros'
  const [graficoFilter, setGraficoFilter] = useState('Todos'); // 'Todos', 'Bautizos', 'Cumpleaños'
  const [isDecryptOpen, setIsDecryptOpen] = useState(false);

  // Mapear categorías a etiquetas cortas para filtrar
  const filterMisiones = ['Todos', 'Bautizos', 'Cumpleaños'];

  const getFilteredGraficos = () => {
    if (graficoFilter === 'Todos') return evidencias.grafico;
    return evidencias.grafico.filter(g => g.mision.toLowerCase().includes(graficoFilter.toLowerCase()));
  };

  return (
    <section id="servicios" className="relative py-24 bg-dark overflow-hidden">
      
      {/* Elementos Estéticos del Fondo (S.H.I.E.L.D. Grid) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent-500/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent-500/3 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabecera del Dossier */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-500/20 bg-accent-500/5 text-accent-400 text-xs font-mono font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
            <Briefcase size={12} />
            DIRECCIÓN DE OPERACIONES Y FORMATOS
          </div>
          <h2 className="text-glow mb-4 text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">
            Repositorio de Evidencias
          </h2>
          <div className="mx-auto mb-6 h-1 w-28 bg-accent-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]"></div>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-light">
            Catálogo clasificado de material académico estandarizado, diseño gráfico vectorial y modelos de identidad civil.
          </p>
        </motion.div>

        {/* Pestañas Tácticas (Menú de Comandos) */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 border-b border-zinc-800/80 pb-6">
          <button
            onClick={() => setActiveTab('academico')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'academico'
                ? 'border-accent-500/50 bg-accent-500/10 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
            }`}
          >
            <Terminal size={14} className={activeTab === 'academico' ? 'text-accent-400' : ''} />
            <span>&gt; Evidencia_Aca (APA 7)</span>
          </button>

          <button
            onClick={() => setActiveTab('grafico')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'grafico'
                ? 'border-accent-500/50 bg-accent-500/10 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
            }`}
          >
            <ImageIcon size={14} className={activeTab === 'grafico' ? 'text-accent-400' : ''} />
            <span>&gt; Evidencia_Gra (Diseño)</span>
          </button>

          <button
            onClick={() => setActiveTab('identidades')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'identidades'
                ? 'border-accent-500/50 bg-accent-500/10 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
            }`}
          >
            <FileText size={14} className={activeTab === 'identidades' ? 'text-accent-400' : ''} />
            <span>&gt; Evidencia_CV (Identidades)</span>
          </button>

          {services && services.length > 0 && (
            <button
              onClick={() => setActiveTab('otros')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'otros'
                  ? 'border-accent-500/50 bg-accent-500/10 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <Briefcase size={14} className={activeTab === 'otros' ? 'text-accent-400' : ''} />
              <span>&gt; Solicitudes (CMS)</span>
            </button>
          )}
        </div>

        {/* Contenido Dinámico de la Pestaña Activa */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* ── TABS: ACADÉMICO (APA 7) ── */}
            {activeTab === 'academico' && (
              <motion.div
                key="academico"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Comparador Slider */}
                <div className="lg:col-span-6 w-full">
                  <BeforeAfterSlider 
                    antes={evidencias.academico[0].antes} 
                    despues={evidencias.academico[0].despues} 
                  />
                </div>

                {/* Panel de Información del Expediente */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold text-accent-400 bg-accent-500/10 border border-accent-500/20 px-2.5 py-1 rounded">
                      PROTOCOLO APA 7MA EDICIÓN
                    </span>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      {evidencias.academico[0].titulo}
                    </h3>
                    <p className="text-sm font-semibold text-zinc-400">
                      Foco: {evidencias.academico[0].foco}
                    </p>
                  </div>

                  {/* Detalles Formateados */}
                  <div className="space-y-3 bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5">
                    <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">Detalles de Normalización:</h4>
                    <ul className="space-y-2 text-sm text-zinc-300">
                      {evidencias.academico[0].detalles.map((det, index) => (
                        <li key={index} className="flex gap-2.5 items-start">
                          <ChevronRight size={16} className="text-accent-500 shrink-0 mt-0.5" />
                          <span>{det}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Botón Holograma para Descargar Expediente */}
                  <button
                    onClick={() => setIsDecryptOpen(true)}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-accent-600 hover:bg-accent-500 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition duration-200 border border-accent-500 shadow-lg shadow-accent-500/10 cursor-pointer group"
                  >
                    <Lock size={14} className="group-hover:scale-110 transition-transform" />
                    <span>Descargar Expediente Lingüístico</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── TABS: GRÁFICO (CATÁLOGO DE MISIONES) ── */}
            {activeTab === 'grafico' && (
              <motion.div
                key="grafico"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                {/* Sub-Filtros de Comando */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider mr-2">Filtro Misión:</span>
                  {filterMisiones.map(mision => (
                    <button
                      key={mision}
                      onClick={() => setGraficoFilter(mision)}
                      className={`px-3 py-1.5 rounded-lg border font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                        graficoFilter === mision
                          ? 'border-accent-500/40 bg-accent-500/10 text-accent-400'
                          : 'border-zinc-800 bg-zinc-950/20 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                      }`}
                    >
                      &gt; cmd.filter({mision.toLowerCase()})
                    </button>
                  ))}
                </div>

                {/* Grid de Diseños */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {getFilteredGraficos().map((item) => (
                    <div 
                      key={item.id} 
                      className="border border-zinc-800/80 bg-zinc-900/20 rounded-2xl overflow-hidden hover:border-accent-500/30 transition-all flex flex-col group"
                    >
                      {/* Imagen Mockup */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950 border-b border-zinc-800/80">
                        <img 
                          src={item.mockup} 
                          alt={item.titulo} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                        />
                        <div className="absolute left-4 top-4 bg-zinc-900/90 text-accent-400 font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border border-accent-500/30">
                          {item.mision}
                        </div>
                      </div>

                      {/* Info de Tarjeta */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-white leading-tight">
                            {item.titulo}
                          </h3>
                          <p className="text-sm text-zinc-400 font-light">
                            {item.detalles}
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {item.etiquetas.map(tag => (
                              <span key={tag} className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Botones de Operación */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <a
                            href={`https://wa.me/51918165428?text=Hola%20Pablo,%20quiero%20cotizar%20el%20dise%C3%B1o%20gr%C3%A1fico%20con%20ID:%20${item.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold uppercase tracking-wider text-[10px] rounded-xl transition duration-200 border border-zinc-800 hover:border-zinc-700 text-center"
                          >
                            <Send size={12} className="text-accent-400" />
                            <span>Cotizar Diseño</span>
                          </a>

                          <a
                            href="https://grafiplotvasquez.lat"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-accent-500/5 hover:bg-accent-500/10 text-accent-400 font-bold uppercase tracking-wider text-[10px] rounded-xl transition duration-200 border border-accent-500/20 hover:border-accent-500/40 text-center"
                          >
                            <ExternalLink size={12} />
                            <span>Imprimir (Grafiplot)</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── TABS: CURRÍCULUMS (IDENTIDADES) ── */}
            {activeTab === 'identidades' && (
              <motion.div
                key="identidades"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {evidencias.identidades.map((item) => (
                    <div 
                      key={item.id}
                      className="border border-zinc-800/80 bg-zinc-900/20 rounded-2xl overflow-hidden hover:border-accent-500/30 transition-all flex flex-col group"
                    >
                      {/* Vista Previa de Imagen */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950 border-b border-zinc-800/80">
                        <img 
                          src={item.preview} 
                          alt={item.nombre} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                        />
                        <div className="absolute left-4 top-4 bg-zinc-900/90 text-accent-400 font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border border-accent-500/30">
                          {item.tipo}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-white leading-tight">
                            {item.nombre}
                          </h3>
                          <p className="text-sm text-zinc-400 font-light">
                            {item.detalles}
                          </p>
                          <span className="inline-block text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                            Formato: {item.formato}
                          </span>
                        </div>

                        {/* CTA */}
                        <a
                          href={`https://wa.me/51918165428?text=Hola%20Pablo,%20quiero%20solicitar%20el%20servicio%20de%20curr%C3%ADculum%20vitae%20con%20modelo:%20${item.nombre}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-600 hover:bg-accent-500 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition duration-200 border border-accent-500 shadow-lg shadow-accent-500/10 cursor-pointer"
                        >
                          <Send size={12} />
                          <span>Solicitar Plantilla Personalizada</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Banner de Expansión Fase 2 */}
                <div className="relative border border-accent-500/20 bg-accent-500/5 rounded-2xl p-6 overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-accent-500/5 rounded-full filter blur-xl pointer-events-none" />
                  <div className="space-y-1">
                    <span className="inline-block bg-accent-500/20 text-accent-400 text-[9px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded border border-accent-500/30">
                      FASE 2 DE OPERACIÓN: HOSTING DE CV WEB
                    </span>
                    <h4 className="text-sm font-bold text-white">¿Quieres tu propia URL interactiva?</h4>
                    <p className="text-xs text-zinc-400 max-w-xl font-light">
                      Próximamente podrás cotizar tu CV en formato web y hostearlo bajo el subdominio de agentes: <span className="font-mono text-accent-400">space.sypablitodp.site/agente/tu-nombre</span>.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TABS: OTROS (CMS DB SERVICES) ── */}
            {activeTab === 'otros' && services && services.length > 0 && (
              <motion.div
                key="otros"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {services.map((service, i) => (
                  <div 
                    key={service.title} 
                    className="border border-zinc-800 bg-zinc-900/10 p-6 rounded-2xl hover:border-accent-500/30 transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-accent-500/5 border border-accent-500/20 text-accent-400 flex items-center justify-center mb-4 group-hover:bg-accent-500/10 transition-colors">
                        <Briefcase size={20} />
                      </div>
                      <h3 className="text-base font-bold text-white mb-2 leading-snug">{service.title}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed font-light">{service.description}</p>
                    </div>

                    <a
                      href={`https://wa.me/51918165428?text=Hola%20Pablo,%20estoy%20interesado%20en%20el%20servicio%20de%20${encodeURIComponent(service.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-accent-400 hover:text-accent-300 transition-colors pt-2"
                    >
                      <span>Coordinar Servicio</span>
                      <ChevronRight size={12} />
                    </a>
                  </div>
                ))}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* Modal de Desencriptado Hacker */}
      <DecryptionModal
        isOpen={isDecryptOpen}
        onClose={() => setIsDecryptOpen(false)}
        pdfUrl="/expediente-linguistico.pdf"
      />

    </section>
  );
}
