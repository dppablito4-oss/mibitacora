import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Terminal, 
  FileText, 
  ExternalLink, 
  ImageIcon,
  Lock,
  ChevronRight,
  ArrowLeft,
  Send,
  Edit
} from 'lucide-react';
import { evidencias } from '../../data/evidencias';
import BeforeAfterSlider from './BeforeAfterSlider';
import DecryptionModal from './DecryptionModal';

export default function ServiciosSection({ services }) {
  const [selectedCategory, setSelectedCategory] = useState(null); // null, 'academico', 'grafico', 'identidades'
  const [graficoFilter, setGraficoFilter] = useState('Todos'); // 'Todos', 'Bautizos', 'Cumpleaños'
  const [isDecryptOpen, setIsDecryptOpen] = useState(false);

  const filterMisiones = ['Todos', 'Bautizos', 'Cumpleaños'];

  const getFilteredGraficos = () => {
    if (graficoFilter === 'Todos') return evidencias.grafico;
    return evidencias.grafico.filter(g => g.mision.toLowerCase().includes(graficoFilter.toLowerCase()));
  };

  // Determinar dinámicamente la categoría de un servicio para enrutarlo a su evidencia interactiva
  const getServiceCategory = (title) => {
    const t = title.toLowerCase();
    if (t.includes('apa') || t.includes('monografía') || t.includes('tesis')) return 'academico';
    if (t.includes('gráfico') || t.includes('diseño') || t.includes('tríptico')) return 'grafico';
    if (t.includes('curriculum') || t.includes('cv') || t.includes('hoja de vida')) return 'identidades';
    return 'otros';
  };

  // Lista unificada: Si Supabase trae datos, los usamos; si no, cargamos los por defecto.
  const servicesList = (services && services.length > 0) ? services : [
    { title: 'Formateo APA 7ma Edición', description: 'Ajuste riguroso de presentaciones, tesis y documentos bajo la normativa APA actual.' },
    { title: 'Creación de Monografías', description: 'Redacción y estructura profesional de monografías para nivel secundario y preuniversitario.' },
    { title: 'Material Gráfico', description: 'Diseño de trípticos, dípticos y material publicitario escolar o de negocios.' },
    { title: 'Curriculum Vitae (CV)', description: 'Diseño y redacción de CVs de alto impacto, modernos y optimizados para entrevistas.' }
  ];

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
          className="mb-12 text-center"
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
            Catálogo unificado de evidencias tácticas. Selecciona una tarjeta para ver demostraciones en vivo.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedCategory === null ? (
            /* ─── VISTA 1: PORTADA UNIFICADA DE SERVICIOS (Imagen 1 corregida sin duplicados) ─── */
            <motion.div
              key="main-grid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {servicesList.map((service, i) => {
                const category = getServiceCategory(service.title);
                return (
                  <div 
                    key={service.title}
                    onClick={() => {
                      if (category !== 'otros') {
                        setSelectedCategory(category);
                      } else {
                        // Si es otro servicio genérico del CMS, abrir WhatsApp directamente
                        window.open(`https://wa.me/51918165428?text=Hola%20Pablo,%20estoy%20interesado%20en%20el%20servicio%20de%20${encodeURIComponent(service.title)}`, '_blank');
                      }
                    }}
                    className="border border-zinc-800 bg-zinc-900/10 p-6 rounded-2xl hover:border-accent-500/40 hover:bg-accent-500/5 transition-all flex flex-col justify-between space-y-4 group cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_25px_rgba(6,182,212,0.08)]"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-accent-500/5 border border-accent-500/20 text-accent-400 flex items-center justify-center mb-4 group-hover:bg-accent-500/20 group-hover:text-white transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                        <Briefcase size={20} />
                      </div>
                      <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-accent-400 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed font-light">
                        {service.description}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-accent-400 group-hover:text-white transition-colors pt-2">
                      <span>{category !== 'otros' ? 'Ver Evidencias' : 'Coordinar Misión'}</span>
                      <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            /* ─── VISTA 2: PANEL DE DETALLE DE EVIDENCIAS INTERACTIVAS ─── */
            <motion.div
              key="evidence-detail"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Barra de Navegación del Panel de Detalle */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
                {/* Botón de Regresar */}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all text-xs font-mono cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>&lt; Volver a Servicios</span>
                </button>

                {/* Sub-Pestañas para cambiar entre categorías dentro del detalle */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedCategory('academico')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                      selectedCategory === 'academico'
                        ? 'border-accent-500/40 bg-accent-500/10 text-white shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                        : 'border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <Terminal size={12} />
                    <span>APA 7</span>
                  </button>

                  <button
                    onClick={() => setSelectedCategory('grafico')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                      selectedCategory === 'grafico'
                        ? 'border-accent-500/40 bg-accent-500/10 text-white shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                        : 'border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <Briefcase size={12} />
                    <span>Diseño</span>
                  </button>

                  <button
                    onClick={() => setSelectedCategory('identidades')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                      selectedCategory === 'identidades'
                        ? 'border-accent-500/40 bg-accent-500/10 text-white shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                        : 'border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <FileText size={12} />
                    <span>CVs</span>
                  </button>
                </div>
              </div>

              {/* ── SUBPANEL: ACADÉMICO (APA 7) ── */}
              {selectedCategory === 'academico' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
                  <div className="lg:col-span-6 w-full">
                    <BeforeAfterSlider 
                      antes={evidencias.academico[0].antes} 
                      despues={evidencias.academico[0].despues} 
                    />
                  </div>

                  <div className="lg:col-span-6 space-y-6">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono font-bold text-accent-400 bg-accent-500/10 border border-accent-500/20 px-2.5 py-1 rounded">
                        EVIDENCIA ACADÉMICA / APA 7
                      </span>
                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        {evidencias.academico[0].titulo}
                      </h3>
                      <p className="text-sm font-semibold text-zinc-400">
                        Foco: {evidencias.academico[0].foco}
                      </p>
                    </div>

                    <div className="space-y-3 bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5">
                      <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">Detalles de la Estandarización:</h4>
                      <ul className="space-y-2 text-sm text-zinc-300">
                        {evidencias.academico[0].detalles.map((det, index) => (
                          <li key={index} className="flex gap-2.5 items-start">
                            <ChevronRight size={16} className="text-accent-500 shrink-0 mt-0.5" />
                            <span>{det}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Botones de Acción: Descarga y Edición */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        onClick={() => setIsDecryptOpen(true)}
                        className="flex items-center justify-center gap-2.5 px-5 py-4 bg-accent-600 hover:bg-accent-500 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition duration-200 border border-accent-500 shadow-lg shadow-accent-500/10 cursor-pointer group"
                      >
                        <Lock size={14} className="group-hover:scale-110 transition-transform" />
                        <span>Ver Monografía</span>
                      </button>

                      <Link
                        to="/tripticos"
                        className="flex items-center justify-center gap-2.5 px-5 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition duration-200 border border-zinc-800 hover:border-zinc-700 cursor-pointer group"
                      >
                        <Edit size={14} className="text-accent-400 group-hover:scale-110 transition-transform" />
                        <span>Formatear mi Tesis</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* ── SUBPANEL: GRÁFICO (DISEÑO) ── */}
              {selectedCategory === 'grafico' && (
                <div className="space-y-8 animate-fade-in">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {getFilteredGraficos().map((item) => (
                      <div 
                        key={item.id} 
                        className="border border-zinc-800/80 bg-zinc-900/20 rounded-2xl overflow-hidden hover:border-accent-500/30 transition-all flex flex-col group"
                      >
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

                          <div className="flex flex-col gap-3 pt-2">
                            {/* Fila superior de botones principales */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                            {/* Botón de edición rápida con IA */}
                            <Link
                              to="/tripticos"
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-600 hover:bg-accent-500 text-white font-bold uppercase tracking-wider text-[10px] rounded-xl transition duration-200 border border-accent-500 shadow-md group"
                            >
                              <Edit size={12} className="group-hover:scale-110 transition-transform" />
                              <span>Diseñar mi propio Tríptico (IA)</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── SUBPANEL: CURRÍCULUMS (IDENTIDADES) ── */}
              {selectedCategory === 'identidades' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {evidencias.identidades.map((item) => (
                      <div 
                        key={item.id}
                        className="border border-zinc-800/80 bg-zinc-900/20 rounded-2xl overflow-hidden hover:border-accent-500/30 transition-all flex flex-col group"
                      >
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

                          <div className="flex flex-col gap-3 pt-2">
                            <a
                              href={`https://wa.me/51918165428?text=Hola%20Pablo,%20quiero%20solicitar%20el%20servicio%20de%20curr%C3%ADculum%20vitae%20con%20modelo:%20${item.nombre}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-600 hover:bg-accent-500 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition duration-200 border border-accent-500 shadow-lg shadow-accent-500/10 cursor-pointer"
                            >
                              <Send size={12} />
                              <span>Solicitar Currículum</span>
                            </a>

                            <Link
                              to="/qr"
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition duration-200 border border-zinc-800 hover:border-zinc-700 cursor-pointer group"
                            >
                              <Edit size={12} className="text-accent-400 group-hover:scale-110 transition-transform" />
                              <span>Generar QR de mi CV</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

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
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

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
