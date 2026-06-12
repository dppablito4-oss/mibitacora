import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { 
  Briefcase, 
  FileText, 
  ExternalLink, 
  ImageIcon,
  Lock,
  ChevronRight,
  Send,
  Edit,
  Palette,
  GraduationCap,
  UserCheck,
  CheckCircle,
  Eye
} from 'lucide-react';
import { evidencias } from '../../data/evidencias';
import BeforeAfterSlider from './BeforeAfterSlider';
import DecryptionModal from './DecryptionModal';

// ── Mapeo servicio → categoría de evidencia ──────────────
function getServiceCategory(title) {
  const t = title.toLowerCase();
  if (t.includes('apa') || t.includes('tesis')) return 'academico';
  if (t.includes('monografía') || t.includes('monografia')) return 'monografia';
  if (t.includes('gráfico') || t.includes('grafico') || t.includes('diseño') || t.includes('tríptico') || t.includes('triptico') || t.includes('presentación') || t.includes('presentacion')) return 'grafico';
  if (t.includes('curriculum') || t.includes('cv') || t.includes('hoja de vida')) return 'identidades';
  return 'otros';
}

// ── Ícono por categoría ──────────────────────────────────
function getCategoryIcon(category) {
  switch (category) {
    case 'academico': return GraduationCap;
    case 'monografia': return FileText;
    case 'grafico': return Palette;
    case 'identidades': return UserCheck;
    default: return Briefcase;
  }
}

// ── Colores de acento por categoría ──────────────────────
const CATEGORY_ACCENTS = {
  academico: { gradient: '', dot: 'bg-amber-400', text: 'text-amber-400', border: 'border-amber-500/20' },
  monografia: { gradient: '', dot: 'bg-violet-400', text: 'text-violet-400', border: 'border-violet-500/20' },
  grafico: { gradient: '', dot: 'bg-rose-400', text: 'text-rose-400', border: 'border-rose-500/20' },
  identidades: { gradient: '', dot: 'bg-emerald-400', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  otros: { gradient: '', dot: 'bg-tesseract-400', text: 'text-tesseract-400', border: 'border-tesseract-500/20' }
};

// ══════════════════════════════════════════════════════════
//  Mockup Interactivo de Monografía (APA 7)
// ══════════════════════════════════════════════════════════
function MonografiaMockup({ accent }) {
  const [activeOutline, setActiveOutline] = useState(0);
  const outlineItems = [
    'I. Introducción',
    'II. Marco Teórico',
    'III. Metodología',
    'IV. Resultados',
    'V. Referencias'
  ];

  return (
    <div className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden border ${accent.border} bg-zinc-950/80 shadow-2xl flex flex-col group`}>
      {/* Top Window Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/40 border-b border-white/[0.05] shrink-0">
        <div className="flex gap-1.5 items-center">
          <span className="w-2 h-2 rounded-full bg-red-500/80" />
          <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
          <span className="w-2 h-2 rounded-full bg-green-500/80" />
        </div>
        <div className="text-[10px] font-mono text-slate-500 tracking-wider flex items-center gap-1.5">
          <FileText size={10} className="text-violet-400" />
          monografia_final_apa7.docx
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-wider">
            Turnitin: 2%
          </span>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Outline Sidebar */}
        <div className="w-1/3 bg-zinc-900/20 border-r border-white/[0.05] p-3 hidden sm:flex flex-col gap-1 shrink-0 justify-center">
          <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest font-bold mb-2">Estructura APA</span>
          {outlineItems.map((item, i) => (
            <button
              key={item}
              type="button"
              onMouseEnter={() => setActiveOutline(i)}
              className={`text-[10px] text-left px-2 py-1 rounded transition-all duration-300 font-mono ${
                activeOutline === i 
                  ? 'bg-violet-500/10 text-violet-400 border-l-2 border-violet-500 font-semibold'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Paper Sheet Area */}
        <div className="flex-1 bg-zinc-900/10 p-3 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 via-transparent to-transparent pointer-events-none" />
          
          {/* Simulated Sheet */}
          <div className="w-[85%] sm:w-[80%] aspect-[1/1.3] bg-white text-zinc-950 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-sm flex flex-col relative select-none transform transition-transform duration-300 group-hover:scale-[1.02] border border-slate-200">
            {/* Running head / Page number */}
            <div className="flex justify-between items-center text-[7px] text-slate-400 font-mono uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">
              <span>IA y Rendimiento Académico</span>
              <span>Pág. 1</span>
            </div>

            {/* Document Title */}
            <div className="text-center font-bold text-[8px] sm:text-[9px] text-zinc-900 mb-3 leading-snug">
              Impacto de la Inteligencia Artificial en la Redacción Científica y Académica
            </div>

            {/* Paragraph Line placeholders with real mini text style */}
            <div className="space-y-2">
              <p className="text-[6px] sm:text-[7px] text-slate-700 leading-relaxed text-justify indent-3">
                En el presente trabajo se analiza el rol de las herramientas generativas en la educación contemporánea. A medida que los algoritmos evolucionan, surge la necesidad de regular su uso bajo pautas éticas estruturadas.
              </p>
              <p className="text-[6px] sm:text-[7px] text-slate-700 leading-relaxed text-justify indent-3">
                Según argumenta <span className="bg-violet-100 text-violet-700 font-semibold rounded px-0.5">Vásquez (2025)</span>, la adopción crítica de asistentes virtuales optimiza hasta un 40% el tiempo de formateo formal sin comprometer el rigor intelectual de los autores.
              </p>
            </div>

            {/* APA Annotations on hover */}
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/95 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex-col gap-2 rounded-sm text-center">
              <span className="text-[10px] font-mono font-bold text-violet-400 uppercase tracking-widest">Garantía Académica</span>
              <p className="text-[9px] text-slate-300 max-w-[140px] leading-snug">Estructura normalizada en base a rúbricas universitarias.</p>
              <div className="flex flex-wrap gap-1 justify-center mt-1">
                <span className="text-[7px] font-mono bg-white/10 px-1 py-0.5 rounded text-slate-200 border border-white/5">APA 7ma</span>
                <span className="text-[7px] font-mono bg-white/10 px-1 py-0.5 rounded text-slate-200 border border-white/5">Citas Ref</span>
                <span className="text-[7px] font-mono bg-white/10 px-1 py-0.5 rounded text-slate-200 border border-white/5">Turnitin OK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  Slide individual de servicio
// ══════════════════════════════════════════════════════════
function ServiceSlide({ service, index, total, category, accent, isReversed, onDecrypt }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.25, once: false });
  const Icon = getCategoryIcon(category);

  return (
    <div
      ref={ref}
      className="relative min-h-[75vh] md:min-h-[65vh] py-12 md:py-16 flex items-center overflow-hidden border-t border-white/[0.04]"
    >
      {/* Background gradient per-slide */}
      {accent.gradient && <div className={`absolute inset-0 bg-gradient-to-br ${accent.gradient} pointer-events-none`} />}
      
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
        
        {/* Número de slide */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center gap-3"
        >
          <span className={`font-mono text-sm font-bold ${accent.text} tracking-wider`}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-current to-transparent opacity-40" />
          <span className="font-mono text-xs text-slate-600 tracking-wider">
            / {String(total).padStart(2, '0')}
          </span>
        </motion.div>
 
        {/* Layout principal: split en PC, stack en móvil */}
        <div className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-10 md:gap-16 items-center`}>
          
          {/* ── Columna de Texto ── */}
          <motion.div
            initial={{ opacity: 0, x: isReversed ? 35 : -35 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isReversed ? 35 : -35 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-1 space-y-5 min-w-0"
          >
            {/* Badge de categoría */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${accent.border} bg-white/[0.03] text-xs font-mono font-bold tracking-widest uppercase ${accent.text}`}>
              <Icon size={12} />
              {category === 'academico' ? 'ACADÉMICO' : 
               category === 'monografia' ? 'INVESTIGACIÓN' :
               category === 'grafico' ? 'DISEÑO GRÁFICO' :
               category === 'identidades' ? 'IDENTIDAD PROFESIONAL' :
               'SERVICIO'}
            </div>

            {/* Título del servicio */}
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight uppercase">
              {service.title}
            </h3>

            {/* Descripción */}
            <p className="text-base text-slate-400 font-light leading-relaxed max-w-xl">
              {service.description}
            </p>

            {/* Detalles bullet (si hay evidencia académica) */}
            {category === 'academico' && evidencias.academico[0]?.detalles && (
              <div className="space-y-2 bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                <h4 className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider">Especificaciones:</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  {evidencias.academico[0].detalles.slice(0, 3).map((det, i) => (
                    <li key={i} className="flex gap-2.5 items-start">
                      <ChevronRight size={14} className={`${accent.text} shrink-0 mt-0.5`} />
                      <span>{det}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-wrap gap-3 pt-2">
              {/* Botón principal: WhatsApp */}
              <a
                href={`https://wa.me/51918165428?text=Hola%20Pablo,%20estoy%20interesado%20en%20el%20servicio%20de%20${encodeURIComponent(service.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent-500/10 border border-accent-500/30 text-accent-300 text-sm font-bold uppercase tracking-wider transition-all hover:bg-accent-500 hover:text-white hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]"
              >
                <Send size={14} />
                Cotizar
              </a>

              {/* Botones secundarios según categoría */}
              {category === 'academico' && (
                <button
                  onClick={onDecrypt}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-300 text-sm font-bold uppercase tracking-wider transition-all hover:border-slate-700 hover:text-white cursor-pointer"
                >
                  <Lock size={14} />
                  Ver Monografía
                </button>
              )}

              {category === 'monografia' && (
                <button
                  onClick={onDecrypt}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-300 text-sm font-bold uppercase tracking-wider transition-all hover:border-slate-700 hover:text-white cursor-pointer"
                >
                  <Lock size={14} />
                  Ver Ejemplo PDF
                </button>
              )}

              {category === 'grafico' && (
                <>
                  <a
                    href="https://grafiplotvasquez.lat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-300 text-sm font-bold uppercase tracking-wider transition-all hover:border-slate-700 hover:text-white"
                  >
                    <ExternalLink size={14} />
                    Imprimir
                  </a>
                  <Link
                    to="/tripticos"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-300 text-sm font-bold uppercase tracking-wider transition-all hover:border-slate-700 hover:text-white"
                  >
                    <Edit size={14} />
                    Crear con IA
                  </Link>
                </>
              )}

              {category === 'identidades' && (
                <Link
                  to="/qr"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-300 text-sm font-bold uppercase tracking-wider transition-all hover:border-slate-700 hover:text-white"
                >
                  <Edit size={14} />
                  Generar QR de CV
                </Link>
              )}
            </div>
          </motion.div>

          {/* ── Columna Visual ── */}
          <motion.div
            initial={{ opacity: 0, x: isReversed ? -35 : 35, scale: 0.96 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: isReversed ? -35 : 35, scale: 0.96 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex-1 w-full min-w-0"
          >
            <SlideVisual service={service} category={category} accent={accent} />
          </motion.div>
        </div>

        {/* Progress dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-2 mt-10 md:mt-12"
        >
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index 
                  ? `w-8 ${accent.dot} shadow-[0_0_8px_rgba(255,255,255,0.4)]`
                  : 'w-1.5 bg-slate-800'
              }`}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  Visual por categoría
// ══════════════════════════════════════════════════════════
function SlideVisual({ service, category, accent }) {
  // 1. Si hay imágenes de antes/después en Base de Datos -> Cargar slider
  if (service?.antes_image_url && service?.despues_image_url) {
    return (
      <BeforeAfterSlider
        antes={service.antes_image_url}
        despues={service.despues_image_url}
      />
    );
  }

  // 2. Si hay imagen principal cargada en Base de Datos -> Mostrar captura fija
  if (service?.image_url) {
    return (
      <div className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden border ${accent.border} bg-dark/80 shadow-2xl`}>
        <img 
          src={service.image_url} 
          alt={service.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-block text-[9px] font-mono text-slate-300 bg-dark/70 backdrop-blur px-2.5 py-0.5 rounded border border-white/5 uppercase tracking-wider">
            Evidencia del Servicio
          </span>
        </div>
      </div>
    );
  }

  // 3. Fallbacks predeterminados por categoría si no hay datos subidos
  if (category === 'academico' && evidencias.academico[0]) {
    return (
      <BeforeAfterSlider
        antes={evidencias.academico[0].antes}
        despues={evidencias.academico[0].despues}
      />
    );
  }

  if (category === 'monografia') {
    return <MonografiaMockup accent={accent} />;
  }

  if (category === 'grafico' && evidencias.grafico[0]) {
    const item = evidencias.grafico[0];
    return (
      <div className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden border ${accent.border} bg-dark/80 shadow-2xl`}>
        <img 
          src={item.mockup} 
          alt={item.titulo} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs font-mono text-rose-400 uppercase tracking-wider mb-1">{item.mision}</p>
          <p className="text-sm font-bold text-white">{item.titulo}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {item.etiquetas.map(tag => (
              <span key={tag} className="text-[10px] font-mono text-slate-400 bg-dark/60 backdrop-blur-sm px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (category === 'identidades' && evidencias.identidades[0]) {
    const item = evidencias.identidades[0];
    return (
      <div className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden border ${accent.border} bg-dark/80 shadow-2xl`}>
        <img 
          src={item.preview} 
          alt={item.nombre} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">{item.tipo}</p>
          <p className="text-sm font-bold text-white">{item.nombre}</p>
          <span className="inline-block text-[10px] font-mono text-slate-400 bg-dark/60 backdrop-blur-sm px-2 py-0.5 rounded mt-2">
            {item.formato}
          </span>
        </div>
      </div>
    );
  }

  // Fallback final: servicio genérico sin evidencia visual
  return (
    <div className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden border ${accent.border} bg-dark/80 shadow-2xl flex flex-col items-center justify-center gap-4`}>
      {accent.gradient && <div className={`absolute inset-0 bg-gradient-to-br ${accent.gradient} pointer-events-none`} />}
      <Briefcase size={64} className="text-tesseract-500/30" />
      <p className="text-sm font-mono text-slate-600 uppercase tracking-wider">Evidencia en Construcción</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  Componente Principal
// ══════════════════════════════════════════════════════════
export default function ServiciosSection({ services }) {
  const [isDecryptOpen, setIsDecryptOpen] = useState(false);

  const servicesList = (services && services.length > 0) ? services : [
    { title: 'Formateo APA 7ma Edición', description: 'Ajuste riguroso de presentaciones, tesis y documentos bajo la normativa APA actual.' },
    { title: 'Creación de Monografías', description: 'Redacción y estructura profesional de monografías para nivel secundario y preuniversitario.' },
    { title: 'Material Gráfico', description: 'Diseño de trípticos, dípticos y material publicitario escolar o de negocios.' },
    { title: 'Curriculum Vitae (CV)', description: 'Diseño y redacción de CVs de alto impacto, modernos y optimizados para entrevistas.' }
  ];

  return (
    <section id="servicios" className="relative overflow-hidden">
      
      {/* Cabecera del showcase — sticky brevemente */}
      <div className="relative py-20 flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 text-center px-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-500/20 bg-accent-500/5 text-accent-400 text-xs font-mono font-bold tracking-widest uppercase mb-4">
            <Briefcase size={12} />
            DIRECCIÓN DE OPERACIONES Y FORMATOS
          </div>
          <h2 className="text-glow mb-4 text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">
            Repositorio de Evidencias
          </h2>
          <div className="mx-auto mb-6 h-1 w-28 bg-accent-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]"></div>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-light">
            Desplázate para explorar cada servicio con demostraciones en vivo.
          </p>
        </motion.div>
      </div>

      {/* Slides de servicios */}
      <div className="border-b border-white/[0.04]">
        {servicesList.map((service, i) => {
          const category = getServiceCategory(service.title);
          const accent = CATEGORY_ACCENTS[category] || CATEGORY_ACCENTS.otros;
          const isReversed = i % 2 !== 0;

          return (
            <ServiceSlide
              key={service.title}
              service={service}
              index={i}
              total={servicesList.length}
              category={category}
              accent={accent}
              isReversed={isReversed}
              onDecrypt={() => setIsDecryptOpen(true)}
            />
          );
        })}
      </div>

      {/* Modal de Desencriptado */}
      <DecryptionModal
        isOpen={isDecryptOpen}
        onClose={() => setIsDecryptOpen(false)}
        pdfUrl="/expediente-linguistico.pdf"
      />
    </section>
  );
}
