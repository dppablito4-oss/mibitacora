import { motion } from 'framer-motion';
import { Radar } from 'lucide-react';

export default function ContactoSection({ profile }) {
  return (
    <section id="contacto" className="relative border-t border-tesseract-500/20 bg-card/40 py-20">
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-tesseract-500/50 to-transparent"></div>
      <div className="space-grid absolute inset-0 z-0 opacity-10"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
      >
        <h2 className="text-glow mb-6 text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">Establecer Enlace</h2>
        <p className="mx-auto mb-10 max-w-2xl text-lg font-light text-slate-400">
          Frecuencias abiertas. Transmita sus requerimientos de servicios o consultas de desarrollo.
        </p>
        <a href={`https://wa.me/${profile.whatsapp || '51918165428'}`} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 border border-tesseract-500 bg-tesseract-500/10 px-8 py-4 text-lg font-bold uppercase tracking-wider text-tesseract-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:bg-tesseract-500 hover:text-white hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]">
          <Radar className="transition-transform group-hover:animate-spin" size={24} /> Contactar por WhatsApp
        </a>
      </motion.div>
    </section>
  );
}
