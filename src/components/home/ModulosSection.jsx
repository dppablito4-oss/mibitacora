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
  HelpCircle,
  ArrowRight
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
    border: 'border-rose-500/30',
    hoverBorder: 'hover:border-rose-400',
    gradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
    text: 'text-rose-400',
    badge: 'bg-rose-500/90 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)]',
    glow: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]'
  },
  red: {
    border: 'border-red-500/30',
    hoverBorder: 'hover:border-red-400',
    gradient: 'from-red-500/10 via-red-500/5 to-transparent',
    text: 'text-red-400',
    badge: 'bg-red-500/90 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)]',
    glow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]'
  },
  amber: {
    border: 'border-amber-500/30',
    hoverBorder: 'hover:border-amber-400',
    gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    text: 'text-amber-400',
    badge: 'bg-amber-500/90 text-white shadow-[0_0_12px_rgba(245,158,11,0.5)]',
    glow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]'
  },
  blue: {
    border: 'border-cyan-500/30',
    hoverBorder: 'hover:border-cyan-400',
    gradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
    text: 'text-cyan-400',
    badge: 'bg-cyan-500/90 text-white shadow-[0_0_12px_rgba(6,182,212,0.5)]',
    glow: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]'
  },
  emerald: {
    border: 'border-emerald-500/30',
    hoverBorder: 'hover:border-emerald-400',
    gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/90 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]',
    glow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]'
  },
  purple: {
    border: 'border-purple-500/30',
    hoverBorder: 'hover:border-purple-400',
    gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
    text: 'text-purple-400',
    badge: 'bg-purple-500/90 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]',
    glow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]'
  }
};

const DEFAULT_STYLE = {
  border: 'border-slate-800/60',
  hoverBorder: 'hover:border-tesseract-500/60',
  gradient: 'from-tesseract-500/5 via-transparent to-transparent',
  text: 'text-tesseract-400',
  badge: '',
  glow: 'hover:shadow-[0_0_25px_rgba(6,182,212,0.1)]'
};

export default function ModulosSection() {
  const { modules } = useSiteConfig();

  const activeModules = (modules || []).filter(m => m.active !== false);

  return (
    <section id="modulos" className="relative py-24">
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

        {/* Bento Grid — módulos flashy ocupan 2 columnas */}
        <div className="bento-grid">
          {activeModules.map((mod, i) => {
            const IconComponent = ICON_MAP[mod.icon] || HelpCircle;
            const style = mod.isFlashy ? (FLASHY_COLORS[mod.flashyColor] || FLASHY_COLORS.rose) : DEFAULT_STYLE;
            const isExternal = mod.url?.startsWith('http://') || mod.url?.startsWith('https://');
            const isWide = mod.isFlashy;

            const cardContent = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.08, 0.4) }}
                className={`group relative overflow-hidden rounded-2xl border ${style.border} ${style.hoverBorder} ${style.glow} bg-dark/80 backdrop-blur-sm transition-all duration-300 h-full ${isWide ? 'flex flex-col sm:flex-row items-stretch' : ''}`}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} pointer-events-none`} />

                {/* Badge */}
                {mod.isFlashy && mod.flashyText && (
                  <div className={`absolute top-3 right-3 ${style.badge} text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase z-10`}>
                    {mod.flashyText}
                  </div>
                )}

                {/* Content */}
                <div className={`relative z-[1] p-6 flex flex-col justify-between h-full ${isWide ? 'flex-1' : ''}`}>
                  <div>
                    <IconComponent className={`${style.text} mb-4 transition-transform group-hover:scale-110 duration-300`} size={isWide ? 36 : 28} />
                    <h3 className={`font-bold text-white mb-2 ${isWide ? 'text-xl' : 'text-lg'}`}>{mod.title}</h3>
                    <p className="text-sm text-slate-400 font-light leading-relaxed">{mod.description}</p>
                  </div>

                  {/* Action hint */}
                  <div className={`mt-4 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider ${style.text} opacity-60 group-hover:opacity-100 transition-opacity`}>
                    <span>Abrir</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );

            return isExternal ? (
              <a
                key={mod.id}
                href={mod.url}
                target="_blank"
                rel="noopener noreferrer"
                className={isWide ? 'bento-wide' : ''}
              >
                {cardContent}
              </a>
            ) : (
              <Link
                key={mod.id}
                to={mod.url}
                className={isWide ? 'bento-wide' : ''}
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
