import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSiteConfig } from '../../lib/useSiteConfig';
import {
  QrCode,
  Calculator,
  LayoutTemplate,
  ScanLine,
  Gamepad2,
  FileText,
  Layers,
  Settings,
  Sparkles,
  GraduationCap,
  BookOpen,
  FileSignature,
  Briefcase,
  Globe,
  Wrench,
  HelpCircle
} from 'lucide-react';

const ICON_MAP = {
  QrCode,
  Calculator,
  LayoutTemplate,
  ScanLine,
  Gamepad2,
  FileText,
  Layers,
  Settings,
  Sparkles,
  GraduationCap,
  BookOpen,
  FileSignature,
  Briefcase,
  Globe,
  Wrench
};

const FLASHY_COLORS = {
  rose: {
    border: 'border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]',
    hoverBorder: 'hover:border-rose-500 hover:shadow-[0_0_25px_rgba(244,63,94,0.4)]',
    glow: 'bg-rose-500/5',
    text: 'text-rose-400',
    badge: 'bg-rose-600 shadow-[0_0_10px_rgba(244,63,94,0.6)]'
  },
  red: {
    border: 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]',
    hoverBorder: 'hover:border-red-500 hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]',
    glow: 'bg-red-500/5',
    text: 'text-red-400',
    badge: 'bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.6)]'
  },
  amber: {
    border: 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]',
    hoverBorder: 'hover:border-amber-500 hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]',
    glow: 'bg-amber-500/5',
    text: 'text-amber-400',
    badge: 'bg-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.6)]'
  },
  blue: {
    border: 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]',
    hoverBorder: 'hover:border-cyan-500 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]',
    glow: 'bg-cyan-500/5',
    text: 'text-cyan-400',
    badge: 'bg-cyan-600 shadow-[0_0_10px_rgba(6,182,212,0.6)]'
  },
  emerald: {
    border: 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    hoverBorder: 'hover:border-emerald-500 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]',
    glow: 'bg-emerald-500/5',
    text: 'text-emerald-400',
    badge: 'bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.6)]'
  },
  purple: {
    border: 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
    hoverBorder: 'hover:border-purple-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]',
    glow: 'bg-purple-500/5',
    text: 'text-purple-400',
    badge: 'bg-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.6)]'
  }
};

const DEFAULT_STYLE = {
  border: 'border-slate-800',
  hoverBorder: 'hover:border-tesseract-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
  glow: 'bg-tesseract-500/5',
  text: 'text-tesseract-400'
};

export default function ModulosSection() {
  const { modules } = useSiteConfig();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const activeModules = (modules || []).filter(m => m.active !== false);

  return (
    <section id="modulos" className="relative py-20 border-t border-tesseract-500/10 bg-card/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-glow mb-4 text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">Módulos</h2>
          <div className="mx-auto h-1 w-24 bg-tesseract-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
          <p className="mt-4 text-lg font-light text-slate-400 max-w-2xl mx-auto">
            Herramientas especializadas integradas en el sistema para operaciones de campo.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-center"
        >
          {activeModules.map((mod) => {
            const IconComponent = ICON_MAP[mod.icon] || HelpCircle;
            const style = mod.isFlashy ? (FLASHY_COLORS[mod.flashyColor] || FLASHY_COLORS.rose) : DEFAULT_STYLE;
            const isExternal = mod.url?.startsWith('http://') || mod.url?.startsWith('https://');

            const cardContent = (
              <>
                {/* Flashy overlay and pulsing glow */}
                <div className={`absolute inset-0 ${style.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Floating badge for news/flashy modules */}
                {mod.isFlashy && mod.flashyText && (
                  <div className={`absolute -top-1 left-4 ${style.badge} text-white text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded-full uppercase animate-pulse z-10`}>
                    {mod.flashyText}
                  </div>
                )}

                <IconComponent className={`${style.text} mb-4 transition-transform group-hover:scale-110 duration-300`} size={32} />
                <h3 className="text-lg font-bold text-white mb-2">{mod.title}</h3>
                <p className="text-sm text-slate-400 font-light leading-relaxed">{mod.description}</p>
              </>
            );

            const cardClasses = `group block p-6 transition-all duration-300 rounded-xl relative overflow-hidden bg-dark h-full border ${style.border} ${style.hoverBorder}`;

            return (
              <motion.div key={mod.id} variants={itemVariants}>
                {isExternal ? (
                  <a href={mod.url} target="_blank" rel="noopener noreferrer" className={cardClasses}>
                    {cardContent}
                  </a>
                ) : (
                  <Link to={mod.url} className={cardClasses}>
                    {cardContent}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
