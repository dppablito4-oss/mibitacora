import { Terminal, ShieldCheck, Cpu, Radar, ExternalLink, Briefcase } from 'lucide-react';
import { PROFILE, SKILLS, PROJECTS, SERVICES } from '../data/siteData';

export default function HomePage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section id="inicio" className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-20 md:py-32">
        <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 md:flex-row">
          <div className="flex-1 text-center md:text-left animate-fade-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-sm border border-tesseract-500/50 bg-tesseract-500/10 px-4 py-1.5 text-sm font-medium uppercase tracking-widest text-tesseract-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <div className="h-2 w-2 animate-pulse rounded-full bg-tesseract-300"></div>
              Agente Nivel 7 Autorizado
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white uppercase md:text-6xl lg:text-7xl">
              Hola, soy <br />
              <span className="text-glow bg-gradient-to-r from-tesseract-300 via-tesseract-500 to-blue-600 bg-clip-text text-transparent">Samuel Y. Pablo</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg font-light text-slate-400 md:mx-0 md:text-xl">
              {PROFILE.bio}
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:justify-start">
              <a href="#proyectos" className="flex items-center gap-2 border border-tesseract-500 bg-transparent px-8 py-3.5 font-bold uppercase tracking-wider text-tesseract-300 transition-all hover:bg-tesseract-500 hover:text-white shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                Acceder Datos <span className="text-xl">›</span>
              </a>
            </div>
          </div>
          
          {/* Foto de perfil (Selfie / Informal) */}
          <div className="flex flex-1 justify-center py-10 md:justify-end md:py-0 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-tesseract-500/30 p-2 shadow-[0_0_30px_rgba(6,182,212,0.3)] group overflow-hidden">
              <div className="w-full h-full rounded-full overflow-hidden relative bg-dark">
                {/* Reemplaza el src con la ruta de tu foto real, por ejemplo: /mi-foto.jpg */}
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop" 
                  alt="Samuel Y. Pablo Claudio" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-tesseract-500/10 mix-blend-overlay pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expediente Section */}
      <section id="expediente" className="relative border-y border-tesseract-500/10 bg-card/40 py-20">
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-tesseract-500/50 to-transparent"></div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="reveal mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-glow mb-4 text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">Expediente Clasificado</h2>
            <div className="mx-auto mb-8 h-1 w-24 bg-tesseract-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
            
            {/* Personal Data Grid */}
            <div className="mx-auto max-w-2xl bg-dark/80 border border-tesseract-500/30 p-6 shadow-[0_0_20px_rgba(6,182,212,0.1)] text-left mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-b border-slate-800 pb-2">
                  <span className="block text-xs text-tesseract-500 uppercase tracking-widest font-bold mb-1">Nombre Clave</span>
                  <span className="text-slate-200 font-mono text-sm">{PROFILE.name}</span>
                </div>
                <div className="border-b border-slate-800 pb-2">
                  <span className="block text-xs text-tesseract-500 uppercase tracking-widest font-bold mb-1">Especialidad</span>
                  <span className="text-slate-200 font-mono text-sm">{PROFILE.tagline}</span>
                </div>
                <div className="border-b md:border-b-0 border-slate-800 pb-2 md:pb-0">
                  <span className="block text-xs text-tesseract-500 uppercase tracking-widest font-bold mb-1">Fecha de Nacimiento</span>
                  <span className="text-slate-200 font-mono text-sm">{PROFILE.birth}</span>
                </div>
                <div>
                  <span className="block text-xs text-tesseract-500 uppercase tracking-widest font-bold mb-1">Sexo</span>
                  <span className="text-slate-200 font-mono text-sm">{PROFILE.gender}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { icon: Terminal, title: 'Frontend Core', desc: 'Arquitectura de interfaces reactivas y sistemas de componentes para misiones de alta prioridad.', color: 'tesseract-500', rgb: '6,182,212' },
              { icon: ShieldCheck, title: 'Seguridad UI', desc: 'Implementación de diseños blindados y responsivos, a prueba de fallos en cualquier dispositivo de campo.', color: 'blue-500', rgb: '59,130,246' },
              { icon: Cpu, title: 'Optimización', desc: 'Calibración de rendimiento y gestión de estado para asegurar una respuesta táctica en milisegundos.', color: 'tesseract-700', rgb: '8,145,178' }
            ].map((item, i) => (
              <div key={item.title} className={`reveal reveal-delay-${i + 1} group relative overflow-hidden border border-${item.color}/20 bg-dark/80 p-8 transition-all hover:border-${item.color} hover:shadow-[0_0_20px_rgba(${item.rgb},0.15)]`}>
                <div className={`absolute right-0 top-0 h-16 w-16 rounded-bl-full bg-${item.color}/5`}></div>
                <div className={`mb-6 flex h-12 w-12 items-center justify-center border border-${item.color}/30 bg-${item.color}/10 text-${item.color === 'blue-500' ? 'blue-400' : 'tesseract-300'} shadow-[0_0_10px_rgba(${item.rgb},0.2)] transition-all group-hover:scale-110 group-hover:bg-${item.color} group-hover:text-white`}>
                  <item.icon size={24} />
                </div>
                <h3 className="mb-3 text-xl font-bold uppercase tracking-wider text-white">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Arsenal Section */}
      <section id="arsenal" className="relative py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="reveal mb-16 text-center">
            <h2 className="text-glow mb-4 text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">Arsenal Tecnológico</h2>
            <div className="mx-auto h-1 w-24 bg-tesseract-300 shadow-[0_0_10px_rgba(103,232,249,0.8)]"></div>
          </div>

          <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-4">
            {SKILLS.flatMap(s => s.items).map((skill, i) => (
              <div key={skill} className={`reveal reveal-delay-${(i % 3) + 1} group relative flex cursor-default items-center gap-3 overflow-hidden border border-tesseract-500/30 bg-dark px-6 py-3 transition-all hover:border-tesseract-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]`}>
                <div className="absolute inset-0 -translate-x-full bg-tesseract-500/5 transition-transform duration-300 group-hover:translate-x-0"></div>
                <Terminal className="relative z-10 text-tesseract-500" size={20} />
                <span className="relative z-10 font-medium tracking-wide text-slate-300">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proyectos Section */}
      <section id="proyectos" className="relative border-t border-tesseract-500/10 bg-card/40 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="reveal mb-16 text-center">
            <h2 className="text-glow mb-4 text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">Operaciones Base</h2>
            <div className="mx-auto mb-6 h-1 w-24 bg-tesseract-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
            <p className="text-lg font-light text-slate-400 max-w-2xl mx-auto">
              Plataformas e infraestructuras web activas bajo mi jurisdicción.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PROJECTS.map((project, i) => (
              <div key={project.title} className={`reveal reveal-delay-${i + 1} group block relative border border-tesseract-500/20 bg-dark p-8 transition-all hover:border-tesseract-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]`}>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white tracking-wide uppercase">{project.title}</h3>
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-tesseract-500/10 text-tesseract-400 rounded hover:bg-tesseract-500 hover:text-white transition-colors">
                    <ExternalLink size={20} />
                  </a>
                </div>
                <p className="mb-6 text-slate-400">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map(tag => (
                    <span key={tag} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2 py-1 uppercase tracking-wider font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center text-tesseract-500 text-sm font-mono tracking-widest break-all">
                  <span className="w-2 h-2 bg-tesseract-500 rounded-full animate-pulse mr-2 shrink-0"></span>
                  {project.url.replace('https://', '')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios Personales Section */}
      <section id="servicios" className="relative py-20 bg-dark">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="reveal mb-16 text-center">
            <h2 className="text-glow mb-4 text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">Servicios Tácticos</h2>
            <div className="mx-auto mb-6 h-1 w-24 bg-tesseract-300 shadow-[0_0_10px_rgba(103,232,249,0.8)]"></div>
            <p className="text-lg font-light text-slate-400 max-w-2xl mx-auto">
              Operaciones y formatos especializados a disposición.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, i) => (
              <div key={service.title} className={`reveal reveal-delay-${(i % 4) + 1} border border-slate-800 bg-card/60 p-6 hover:border-tesseract-400/50 transition-colors`}>
                <Briefcase className="text-tesseract-400 mb-4" size={28} />
                <h3 className="text-lg font-bold text-white mb-2 leading-snug">{service.title}</h3>
                <p className="text-sm text-slate-400">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="relative border-t border-tesseract-500/20 bg-card/40 py-20">
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-tesseract-500/50 to-transparent"></div>
        <div className="space-grid absolute inset-0 z-0 opacity-10"></div>
        
        <div className="reveal relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-glow mb-6 text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">Establecer Enlace</h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg font-light text-slate-400">
            Frecuencias abiertas. Transmita sus requerimientos de servicios o consultas de desarrollo.
          </p>
          <a href={`mailto:${PROFILE.email}`} className="group inline-flex items-center gap-3 border border-tesseract-500 bg-tesseract-500/10 px-8 py-4 text-lg font-bold uppercase tracking-wider text-tesseract-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:bg-tesseract-500 hover:text-white hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]">
            <Radar className="transition-transform group-hover:animate-spin" size={24} /> Iniciar Transmisión
          </a>
        </div>
      </section>
    </div>
  );
}
