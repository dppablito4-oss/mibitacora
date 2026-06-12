import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';

export default function HeroSection({ profile, avatarUrl, aviso }) {
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

  return (
    <>
      {/* Aviso Banner */}
      {aviso.activo && aviso.texto && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-6xl px-4 mt-2"
        >
          <div className={`rounded-xl border px-4 py-3 text-sm flex items-center gap-3 ${
            aviso.tipo === 'warning' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' :
            aviso.tipo === 'promo' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' :
            aviso.tipo === 'urgent' ? 'bg-red-500/10 text-red-300 border-red-500/20' :
            'bg-tesseract-500/10 text-tesseract-300 border-tesseract-500/20'
          }`}>
            <Megaphone size={16} className="shrink-0" />
            <span className="flex-1">{aviso.texto}</span>
            {aviso.link && (
              <a href={aviso.link} target="_blank" rel="noopener noreferrer" className="text-xs underline shrink-0 opacity-75 hover:opacity-100">
                Ver más →
              </a>
            )}
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section 
        id="inicio" 
        className="relative flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-20 md:py-32 overflow-hidden bg-transparent"
      >
        {/* Fondo exclusivo de la Tierra para la primera sección */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: "url('/fondoimage.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center 70%",
            backgroundRepeat: "no-repeat"
          }}
        />

        {/* Capa de sombra/transparencia lateral (estilo grafiplotvasquez.lat) para alta legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-dark/45 to-transparent z-0 pointer-events-none" />

        {/* Desvanecimiento inferior para transición suave a fondo2.svg */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/40 to-dark z-0 pointer-events-none" />

        {/* Nave Espacial Vectorial Flotante (Cyan Plasma Trail) */}
        <motion.div
          className="absolute right-[15%] bottom-[20%] pointer-events-none z-0 hidden lg:block"
          animate={{
            x: mousePos.x * 0.7,
            y: [mousePos.y * 0.7, mousePos.y * 0.7 - 20, mousePos.y * 0.7],
            rotate: [0, 1, -1, 0],
          }}
          transition={{
            y: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            },
            rotate: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            },
            x: { type: "spring", stiffness: 60, damping: 18 },
          }}
        >
          <svg viewBox="0 0 100 100" className="w-56 h-56 text-tesseract-500/10 drop-shadow-[0_0_25px_rgba(6,182,212,0.15)] transform -rotate-45">
            {/* Plasma Engine Trail */}
            <path d="M50 85 L50 125" stroke="url(#plasma-glow)" strokeWidth="6" strokeLinecap="round" className="animate-pulse" />
            {/* Fighter Jet Silhouette */}
            <path d="M50 8 L68 55 L55 58 L50 82 L45 58 L32 55 Z" fill="currentColor" />
            {/* Left Wing */}
            <path d="M32 55 L10 75 L28 78 L32 60 Z" fill="currentColor" opacity="0.8" />
            {/* Right Wing */}
            <path d="M68 55 L90 75 L72 78 L68 60 Z" fill="currentColor" opacity="0.8" />
            {/* Cockpit Canopy */}
            <path d="M50 20 L54 48 L46 48 Z" fill="rgba(6,182,212,0.6)" />
            {/* Engine Core */}
            <circle cx="50" cy="82" r="3.5" fill="#06b6d4" className="animate-ping" />
            <circle cx="50" cy="82" r="2.5" fill="#ffffff" />
            
            <defs>
              <linearGradient id="plasma-glow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 md:flex-row">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center md:text-left"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-sm border border-tesseract-500/50 bg-tesseract-500/10 px-4 py-1.5 text-sm font-medium uppercase tracking-widest text-tesseract-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <div className="h-2 w-2 animate-pulse rounded-full bg-tesseract-300"></div>
              Agente Nivel 7 Autorizado
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white uppercase md:text-6xl lg:text-7xl">
              Hola, soy <br />
              <span className="text-glow bg-gradient-to-r from-tesseract-300 via-tesseract-500 to-blue-600 bg-clip-text text-transparent">
                {profile.name?.split(' ').slice(0, 3).join(' ') || 'Samuel Y. Pablo'}
              </span>
            </h1>
            <p className="mx-auto mb-4 max-w-2xl text-lg font-light text-slate-400 md:mx-0 md:text-xl">
              {profile.bio}
            </p>
            <p className="mx-auto mb-8 max-w-2xl text-sm font-mono text-slate-600 md:mx-0 tracking-wider">
              React · Supabase · IA · HUANUCO - PERU
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:justify-start">
              <a href="#modulos" onClick={(e) => scrollToSection(e, 'modulos')} className="flex items-center gap-2 rounded-xl border border-tesseract-500 bg-tesseract-500/10 px-8 py-3.5 font-bold uppercase tracking-wider text-tesseract-300 transition-all hover:bg-tesseract-500 hover:text-white shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                Explorar Módulos <span className="text-xl">›</span>
              </a>
              <a href="#proyectos" onClick={(e) => scrollToSection(e, 'proyectos')} className="flex items-center gap-2 rounded-xl border border-slate-700 bg-transparent px-8 py-3.5 font-bold uppercase tracking-wider text-slate-400 transition-all hover:border-tesseract-500/50 hover:text-white">
                Ver Proyectos
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-1 justify-center py-10 md:justify-end md:py-0"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-tesseract-500/30 p-2 shadow-[0_0_30px_rgba(6,182,212,0.3)] group overflow-hidden">
              <div className="w-full h-full rounded-full overflow-hidden relative bg-dark">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={profile.name || 'Avatar'} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-tesseract-900/40 to-dark">
                    <span className="text-7xl md:text-8xl font-extralight text-tesseract-300/60 select-none">
                      {profile.name?.[0] || 'P'}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-tesseract-500/10 mix-blend-overlay pointer-events-none"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
