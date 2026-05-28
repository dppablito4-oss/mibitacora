import { Terminal, ShieldCheck, Cpu, Radar } from 'lucide-react';
import { PROFILE, SKILLS, PROJECTS } from '../data/siteData';

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
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white uppercase md:text-7xl">
              Iniciando <br />
              <span className="text-glow bg-gradient-to-r from-tesseract-300 via-tesseract-500 to-blue-600 bg-clip-text text-transparent">Secuencia</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg font-light text-slate-400 md:mx-0 md:text-xl">
              Especialista en desarrollo web táctico. Construyendo interfaces con tecnología avanzada para misiones críticas en el ciberespacio.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:justify-start">
              <a href="#proyectos" className="flex items-center gap-2 border border-tesseract-500 bg-transparent px-8 py-3.5 font-bold uppercase tracking-wider text-tesseract-300 transition-all hover:bg-tesseract-500 hover:text-white shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                Acceder Datos <span className="text-xl">›</span>
              </a>
              <div className="flex gap-4">
                <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="border border-tesseract-500/30 bg-card p-3.5 text-slate-300 transition-all hover:border-tesseract-300 hover:text-tesseract-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                </a>
                <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="border border-tesseract-500/30 bg-card p-3.5 text-slate-300 transition-all hover:border-tesseract-300 hover:text-tesseract-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Tesseract 3D Cube */}
          <div className="flex flex-1 justify-center py-10 md:justify-end md:py-0 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="scene">
              <div className="cube">
                <div className="cube__face cube__face--front"></div>
                <div className="cube__face cube__face--back"></div>
                <div className="cube__face cube__face--right"></div>
                <div className="cube__face cube__face--left"></div>
                <div className="cube__face cube__face--top"></div>
                <div className="cube__face cube__face--bottom"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expediente Section */}
      <section id="expediente" className="relative border-y border-tesseract-500/10 bg-card/40 py-20">
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-tesseract-500/50 to-transparent"></div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="reveal mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-glow mb-4 text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">Expediente Clasificado</h2>
            <div className="mx-auto mb-6 h-1 w-24 bg-tesseract-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
            <p className="text-lg font-light text-slate-400">
              Ingeniero de software con experiencia en el despliegue de infraestructuras frontend robustas. Especializado en transformar energía bruta en herramientas de alto rendimiento.
            </p>
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

      {/* Contact Section */}
      <section id="contacto" className="relative border-t border-tesseract-500/20 bg-card/40 py-20">
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-tesseract-500/50 to-transparent"></div>
        <div className="space-grid absolute inset-0 z-0 opacity-10"></div>
        
        <div className="reveal relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-glow mb-6 text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">Establecer Enlace</h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg font-light text-slate-400">
            Frecuencias abiertas. Buscando nuevos aliados para desarrollar tecnología de nivel vengador. Transmita sus coordenadas o propuestas tácticas.
          </p>
          <a href={`mailto:${PROFILE.email}`} className="group inline-flex items-center gap-3 border border-tesseract-500 bg-tesseract-500/10 px-8 py-4 text-lg font-bold uppercase tracking-wider text-tesseract-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:bg-tesseract-500 hover:text-white hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]">
            <Radar className="transition-transform group-hover:animate-spin" size={24} /> Iniciar Transmisión
          </a>
        </div>
      </section>
    </div>
  );
}
