import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Megaphone, 
  Sparkles, 
  Rocket, 
  Code2, 
  ArrowRight, 
  MessageCircle, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Layers, 
  Zap,
  ExternalLink
} from 'lucide-react';
import { useSiteConfig } from '../../lib/useSiteConfig';

export default function HeroSection(props) {
  // Consumir directamente la configuración de Supabase desde el contexto
  const siteConfig = useSiteConfig();

  const profile = props.profile || siteConfig.profile || {};
  const avatarUrl = props.avatarUrl || siteConfig.avatarUrl;
  const aviso = props.aviso || siteConfig.aviso || { activo: false };
  const hobbies = props.hobbies || siteConfig.hobbies || [];
  const theme = props.theme || siteConfig.theme || {};
  const projects = props.projects || siteConfig.projects || [];
  const modules = props.modules || siteConfig.modules || [];
  const services = props.services || siteConfig.services || [];

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX - window.innerWidth / 2) * 0.04,
        y: (e.clientY - window.innerHeight / 2) * 0.04,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Color dinámico de acento desde la configuración de Supabase (o fallback tesseract cyan)
  const accentColor = theme.accent_color || '#06b6d4';
  const glowColor = theme.glow_color || 'rgba(6, 182, 212, 0.25)';

  const activeModulesCount = modules.filter(m => m.active !== false).length;

  return (
    <>
      {/* Aviso Banner - Supabase Driven */}
      {aviso.activo && aviso.texto && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-6xl px-4 mt-2 mb-4 relative z-20"
        >
          <div 
            className={`rounded-2xl border px-4 py-3 text-sm flex items-center gap-3 backdrop-blur-md shadow-lg ${
              aviso.tipo === 'warning' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
              aviso.tipo === 'promo' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
              aviso.tipo === 'urgent' ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' :
              'bg-tesseract-500/10 text-tesseract-300 border-tesseract-500/30'
            }`}
            style={{
              borderColor: aviso.tipo ? undefined : `${accentColor}40`,
            }}
          >
            <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 shrink-0 animate-pulse">
              <Megaphone size={16} className="shrink-0" />
            </div>
            <span className="flex-1 font-medium tracking-wide">{aviso.texto}</span>
            {aviso.link && (
              <a 
                href={aviso.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all shrink-0"
              >
                <span>Ver más</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </motion.div>
      )}

      {/* Hero Section Principal */}
      <section 
        id="inicio" 
        className="relative flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-16 md:py-24 overflow-hidden bg-transparent space-grid"
      >
        {/* Fondo orbital exclusivo con blur & radial glow dinámico según Supabase accent */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: "url('/fondoimage.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center 70%",
            backgroundRepeat: "no-repeat"
          }}
        />

        {/* Ambient Radial Glow personalizado por Supabase Theme */}
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none z-0 opacity-25"
          style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
        />

        {/* Capas de sombras y gradientes para alta legibilidad del contenido */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-dark/75 to-dark/40 z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/50 to-dark z-0 pointer-events-none" />

        {/* Nave Vectorial Flotante Interactiva (Plasma Trail) */}
        <motion.div
          className="absolute right-[10%] bottom-[18%] pointer-events-none z-0 hidden lg:block"
          animate={{
            x: mousePos.x * 0.8,
            y: [mousePos.y * 0.8, mousePos.y * 0.8 - 25, mousePos.y * 0.8],
            rotate: [0, 1.5, -1.5, 0],
          }}
          transition={{
            y: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 8.5, repeat: Infinity, ease: "easeInOut" },
            x: { type: "spring", stiffness: 60, damping: 18 },
          }}
        >
          <div className="relative group">
            <div 
              className="absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse"
              style={{ background: accentColor }}
            />
            <svg viewBox="0 0 100 100" className="w-64 h-64 text-tesseract-500/20 drop-shadow-[0_0_35px_rgba(6,182,212,0.25)] transform -rotate-45">
              <path d="M50 85 L50 130" stroke="url(#plasma-glow-hero)" strokeWidth="7" strokeLinecap="round" className="animate-pulse" />
              <path d="M50 8 L68 55 L55 58 L50 82 L45 58 L32 55 Z" fill="currentColor" />
              <path d="M32 55 L10 75 L28 78 L32 60 Z" fill="currentColor" opacity="0.8" />
              <path d="M68 55 L90 75 L72 78 L68 60 Z" fill="currentColor" opacity="0.8" />
              <path d="M50 20 L54 48 L46 48 Z" fill={accentColor} opacity="0.7" />
              <circle cx="50" cy="82" r="4" fill={accentColor} className="animate-ping" />
              <circle cx="50" cy="82" r="2.5" fill="#ffffff" />
              
              <defs>
                <linearGradient id="plasma-glow-hero" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>

        {/* Contenido Principal Grid */}
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 lg:flex-row lg:items-center">
          
          {/* Lado Izquierdo: Textos, Badges & CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1 text-center lg:text-left"
          >
            {/* Status Pill Badge */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-tesseract-500/40 bg-tesseract-500/10 px-4 py-1.5 text-xs font-mono font-medium uppercase tracking-widest text-tesseract-300 shadow-[0_0_15px_rgba(6,182,212,0.25)] backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <ShieldCheck size={14} className="text-tesseract-400" />
              <span>PROTOCOL ALPHA • {profile.subdomain || 'PABLITODP'} • ONLINE</span>
            </div>

            {/* Title / Name Header */}
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white uppercase sm:text-5xl md:text-6xl lg:text-7xl">
              Hola, soy <br />
              <span 
                className="text-glow bg-gradient-to-r from-tesseract-300 via-tesseract-400 to-blue-500 bg-clip-text text-transparent"
                style={{
                  filter: `drop-shadow(0 0 25px ${glowColor})`
                }}
              >
                {profile.name?.split(' ').slice(0, 3).join(' ') || 'Samuel Y. Pablo'}
              </span>
            </h1>

            {/* Tagline / Subtitle */}
            <p className="mx-auto mb-3 max-w-2xl text-xl font-medium text-slate-200 lg:mx-0">
              {profile.tagline || 'Desarrollador Web & Digital Creator'}
            </p>

            {/* Bio Description */}
            <p className="mx-auto mb-6 max-w-2xl text-base font-light text-slate-400 lg:mx-0 md:text-lg leading-relaxed">
              {profile.bio || 'Construyo interfaces de alta tecnología, soluciones web interactivas e integro servicios digitales precisos.'}
            </p>

            {/* Tech Stack / Location Badge Strip */}
            <div className="mx-auto mb-8 flex flex-wrap justify-center gap-2 lg:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-dark/60 px-3 py-1 text-xs font-mono text-slate-300 backdrop-blur-sm">
                <Cpu size={13} className="text-tesseract-400" /> React 19
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-dark/60 px-3 py-1 text-xs font-mono text-slate-300 backdrop-blur-sm">
                <Zap size={13} className="text-tesseract-400" /> Supabase
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-dark/60 px-3 py-1 text-xs font-mono text-slate-300 backdrop-blur-sm">
                <Sparkles size={13} className="text-tesseract-400" /> IA & DeepSeek
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-dark/60 px-3 py-1 text-xs font-mono text-slate-300 backdrop-blur-sm">
                <Globe size={13} className="text-tesseract-400" /> HUANUCO • PERU
              </span>
            </div>

            {/* Action Buttons (CTAs) */}
            <div className="flex flex-wrap justify-center gap-4 lg:justify-start mb-10">
              <a 
                href="#modulos" 
                onClick={(e) => scrollToSection(e, 'modulos')} 
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl border border-tesseract-400/80 bg-tesseract-500/20 px-8 py-3.5 font-bold uppercase tracking-wider text-tesseract-200 transition-all hover:bg-tesseract-500 hover:text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] active:scale-95"
              >
                <Rocket size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <span>Explorar Módulos</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>

              <a 
                href="#proyectos" 
                onClick={(e) => scrollToSection(e, 'proyectos')} 
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/60 px-7 py-3.5 font-bold uppercase tracking-wider text-slate-300 transition-all hover:border-tesseract-500/50 hover:bg-slate-800/80 hover:text-white backdrop-blur-md active:scale-95"
              >
                <Code2 size={18} className="text-slate-400" />
                <span>Ver Proyectos</span>
              </a>

              {/* WhatsApp Quick Action Button */}
              {profile.whatsapp && (
                <a 
                  href={`https://wa.me/${profile.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  title="Contactar por WhatsApp"
                >
                  <MessageCircle size={20} />
                </a>
              )}
            </div>

            {/* Quick Metrics / Stats Bar from Supabase */}
            <div className="grid grid-cols-3 gap-3 border-t border-slate-800/80 pt-6">
              <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 text-center backdrop-blur-sm hover:border-tesseract-500/30 transition-colors">
                <div className="text-xl md:text-2xl font-extrabold text-tesseract-300 font-mono">
                  {activeModulesCount > 0 ? activeModulesCount : '5+'}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mt-0.5">
                  Módulos IA & Tools
                </div>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 text-center backdrop-blur-sm hover:border-tesseract-500/30 transition-colors">
                <div className="text-xl md:text-2xl font-extrabold text-tesseract-300 font-mono">
                  {projects.length > 0 ? projects.length : '2+'}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mt-0.5">
                  Proyectos Activos
                </div>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 text-center backdrop-blur-sm hover:border-tesseract-500/30 transition-colors">
                <div className="text-xl md:text-2xl font-extrabold text-tesseract-300 font-mono">
                  {services.length > 0 ? services.length : '4+'}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mt-0.5">
                  Servicios Digitales
                </div>
              </div>
            </div>

          </motion.div>

          {/* Lado Derecho: Avatar Holográfico Interactivo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-1 justify-center py-6 lg:justify-end lg:py-0"
          >
            <div className="relative group">
              {/* Outer Pulsing Aura Ring */}
              <div 
                className="absolute -inset-4 rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-700 animate-pulse"
                style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
              />

              {/* Rotating Hologram Orbital Ring 1 */}
              <div 
                className="absolute -inset-3 rounded-full border border-tesseract-500/30 animate-[spin_16s_linear_infinite] pointer-events-none"
                style={{ borderTopColor: accentColor }}
              />

              {/* Rotating Hologram Orbital Ring 2 (reverse direction) */}
              <div 
                className="absolute -inset-6 rounded-full border border-dashed border-tesseract-400/20 animate-[spin_24s_linear_infinite_reverse] pointer-events-none"
              />

              {/* Main Avatar Container */}
              <div 
                className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-84 md:h-84 rounded-full border-4 border-tesseract-500/40 p-2.5 bg-dark/80 backdrop-blur-xl shadow-[0_0_40px_rgba(6,182,212,0.35)] transition-transform duration-500 group-hover:scale-[1.02] overflow-hidden"
              >
                <div className="w-full h-full rounded-full overflow-hidden relative bg-slate-950 flex items-center justify-center">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={profile.name || 'Avatar Samuel'} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-tesseract-900/50 via-dark to-slate-950 p-4">
                      <span className="text-7xl md:text-8xl font-extralight text-tesseract-300/70 select-none drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                        {profile.name?.[0] || 'P'}
                      </span>
                      <span className="text-xs font-mono text-tesseract-400/80 mt-2 tracking-widest">
                        {profile.subdomain || 'SP'}
                      </span>
                    </div>
                  )}
                  {/* Holographic Overlay Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-tesseract-500/20 via-transparent to-blue-500/20 mix-blend-overlay pointer-events-none" />
                </div>

                {/* Floating Micro Badge on Avatar */}
                <div className="absolute bottom-3 right-3 rounded-full bg-dark/90 border border-tesseract-400/60 px-3 py-1 text-[10px] font-mono font-semibold text-tesseract-300 shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>AGENTE ACTIVE</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
}

