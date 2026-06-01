import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

export default function ArsenalSection({ skills }) {
  return (
    <section id="arsenal" className="relative py-20 bg-dark">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-glow mb-4 text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">Arsenal Tecnológico</h2>
          <div className="mx-auto h-1 w-24 bg-tesseract-300 shadow-[0_0_10px_rgba(103,232,249,0.8)]"></div>
        </motion.div>

        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-4">
          {skills.flatMap(s => s.items).map((skill, i) => (
            <motion.div 
              key={skill} 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 10) * 0.05 }}
              className={`group relative flex cursor-default items-center gap-3 overflow-hidden border border-tesseract-500/30 bg-dark px-6 py-3 transition-all hover:border-tesseract-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]`}
            >
              <div className="absolute inset-0 -translate-x-full bg-tesseract-500/5 transition-transform duration-300 group-hover:translate-x-0"></div>
              <Terminal className="relative z-10 text-tesseract-500" size={20} />
              <span className="relative z-10 font-medium tracking-wide text-slate-300">{skill}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
