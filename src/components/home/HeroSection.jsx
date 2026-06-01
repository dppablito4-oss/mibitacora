import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';

export default function HeroSection({ profile, avatarUrl, aviso }) {
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
          className={`mx-auto max-w-6xl px-4 mt-2`}
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
      <section id="inicio" className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-20 md:py-32">
        <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 md:flex-row">
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
            <p className="mx-auto mb-8 max-w-2xl text-lg font-light text-slate-400 md:mx-0 md:text-xl">
              {profile.bio}
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:justify-start">
              <a href="#proyectos" onClick={(e) => scrollToSection(e, 'proyectos')} className="flex items-center gap-2 border border-tesseract-500 bg-transparent px-8 py-3.5 font-bold uppercase tracking-wider text-tesseract-300 transition-all hover:bg-tesseract-500 hover:text-white shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                Acceder Datos <span className="text-xl">›</span>
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
