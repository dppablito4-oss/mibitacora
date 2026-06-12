import { motion } from 'framer-motion';
import { ExternalLink, Globe } from 'lucide-react';

export default function ProyectosSection({ projects }) {
  // Colores de acento para los gradientes de preview
  const ACCENT_STYLES = [
    { gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent', dot: 'bg-cyan-400', ring: 'ring-cyan-500/20' },
    { gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent', dot: 'bg-emerald-400', ring: 'ring-emerald-500/20' },
    { gradient: 'from-purple-500/20 via-violet-500/10 to-transparent', dot: 'bg-purple-400', ring: 'ring-purple-500/20' },
    { gradient: 'from-amber-500/20 via-orange-500/10 to-transparent', dot: 'bg-amber-400', ring: 'ring-amber-500/20' },
  ];

  return (
    <section id="proyectos" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-glow mb-4 text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">Operaciones Base</h2>
          <div className="mx-auto mb-6 h-1 w-24 bg-tesseract-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
          <p className="text-lg font-light text-slate-400 max-w-2xl mx-auto">
            Plataformas e infraestructuras web activas bajo mi jurisdicción.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, i) => {
            const accent = ACCENT_STYLES[i % ACCENT_STYLES.length];
            return (
              <motion.a
                key={project.title}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group block relative border border-slate-800/60 bg-dark rounded-2xl overflow-hidden transition-all duration-300 hover:border-tesseract-500/40 hover:shadow-[0_0_40px_rgba(6,182,212,0.1)]"
              >
                {/* Gradient Preview Header */}
                <div className={`relative h-32 sm:h-40 bg-gradient-to-br ${accent.gradient} flex items-center justify-center overflow-hidden`}>
                  {/* Floating mesh dots decoration */}
                  <div className="absolute inset-0">
                    <div className="absolute top-4 left-8 w-20 h-20 rounded-full bg-white/[0.03] blur-xl" />
                    <div className="absolute bottom-4 right-12 w-32 h-32 rounded-full bg-white/[0.02] blur-2xl" />
                  </div>
                  {/* Domain chip */}
                  <div className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-dark/60 backdrop-blur-sm border border-white/10">
                    <Globe size={14} className="text-tesseract-400" />
                    <span className="text-sm font-mono text-slate-300 tracking-wide">
                      {project.url.replace('https://', '')}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide uppercase group-hover:text-tesseract-300 transition-colors">
                      {project.title}
                    </h3>
                    <div className="shrink-0 p-2 rounded-lg bg-tesseract-500/10 text-tesseract-400 group-hover:bg-tesseract-500 group-hover:text-white transition-all">
                      <ExternalLink size={18} className="group-hover:rotate-12 transition-transform" />
                    </div>
                  </div>

                  <p className="text-slate-400 mb-6 font-light leading-relaxed">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="bg-slate-800/80 text-slate-400 text-xs px-2.5 py-1 rounded-lg uppercase tracking-wider font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Live indicator */}
                  <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs font-mono text-tesseract-500/80">
                    <span className={`w-2 h-2 ${accent.dot} rounded-full animate-pulse`} />
                    <span className="tracking-wider">ONLINE · OPERATIVO</span>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
