import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

export default function ServiciosSection({ services }) {
  return (
    <section id="servicios" className="relative py-20 bg-dark">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-glow mb-4 text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">Servicios</h2>
          <div className="mx-auto mb-6 h-1 w-24 bg-tesseract-300 shadow-[0_0_10px_rgba(103,232,249,0.8)]"></div>
          <p className="text-lg font-light text-slate-400 max-w-2xl mx-auto">
            Operaciones y formatos especializados a disposición.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div 
              key={service.title} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.1 }}
              className={`border border-slate-800 bg-card/60 p-6 hover:border-tesseract-400/50 transition-colors`}
            >
              <Briefcase className="text-tesseract-400 mb-4" size={28} />
              <h3 className="text-lg font-bold text-white mb-2 leading-snug">{service.title}</h3>
              <p className="text-sm text-slate-400">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
