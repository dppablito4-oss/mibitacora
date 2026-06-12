import { motion } from 'framer-motion';
import { Radar, Mail } from 'lucide-react';

export default function ContactoSection({ profile }) {
  return (
    <section id="contacto" className="relative py-24 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-tesseract-500/[0.04] rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-tesseract-800/[0.06] rounded-full filter blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"
      >
        <h2 className="text-glow mb-4 text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">
          Establecer Enlace
        </h2>
        <div className="mx-auto mb-6 h-1 w-24 bg-tesseract-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
        <p className="mx-auto mb-10 max-w-xl text-lg font-light text-slate-400">
          ¿Tienes un proyecto en mente o necesitas una solución digital?
          Transmite tus requerimientos por cualquiera de estos canales.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={`https://wa.me/${profile.whatsapp || '51918165428'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-xl border border-tesseract-500 bg-tesseract-500/10 px-8 py-4 text-base font-bold uppercase tracking-wider text-tesseract-300 shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all hover:bg-tesseract-500 hover:text-white hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
          >
            <Radar className="transition-transform group-hover:scale-110" size={20} />
            WhatsApp
          </a>

          <a
            href={`mailto:${profile.email || 'pabloclsa87@gmail.com'}`}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-800/50 px-8 py-4 text-base font-bold uppercase tracking-wider text-slate-300 transition-all hover:border-tesseract-500/50 hover:bg-slate-800 hover:text-white"
          >
            <Mail className="transition-transform group-hover:scale-110" size={20} />
            Email
          </a>
        </div>
      </motion.div>
    </section>
  );
}
