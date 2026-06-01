import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export default function ProyectosSection({ projects }) {
  return (
    <section id="proyectos" className="relative border-t border-tesseract-500/10 bg-card/40 py-20">
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
          {projects.map((project, i) => (
            <motion.div 
              key={project.title} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group block relative border border-tesseract-500/20 bg-dark p-8 transition-all hover:border-tesseract-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]`}
            >
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
