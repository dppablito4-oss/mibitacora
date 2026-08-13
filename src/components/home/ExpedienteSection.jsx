import { motion } from 'framer-motion';
import { User } from 'lucide-react';

export default function ExpedienteSection({ profile, hobbies }) {
  return (
    <section id="expediente" className="relative py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-tesseract-500/20 bg-tesseract-500/5 text-tesseract-400 text-xs font-mono font-bold tracking-widest uppercase mb-4">
            <User size={12} />
            DOSSIER PERSONAL
          </div>
          <h2 className="text-glow mb-4 text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">
            Sobre Mí
          </h2>
          <div className="mx-auto mb-8 h-1 w-24 bg-tesseract-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
        </motion.div>

        {/* Bio fluida — sin tablas ni cuadrículas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center space-y-6"
        >
          <p className="text-lg text-slate-300 leading-relaxed font-light">
            {profile.bio || (
              <>
                Soy <span className="font-semibold text-white">{profile.name}</span>, 
                especializado en <span className="text-tesseract-300 font-medium">{profile.tagline}</span>.
                Construyo interfaces de alta tecnología y ofrezco soluciones digitales precisas, 
                usando el código como motor para resolver necesidades del día a día.
              </>
            )}
          </p>

          {/* Datos clave en línea — sin tabla */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400 font-mono">
            <span>📍 Perú</span>
            <span className="hidden sm:inline text-slate-700">·</span>
            <span>🎂 {profile.birth}</span>
            <span className="hidden sm:inline text-slate-700">·</span>
            <span>💼 Freelance</span>
          </div>
        </motion.div>

        {/* Hobbies como badges inline ligeros */}
        {hobbies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <p className="text-center text-xs font-mono text-slate-600 uppercase tracking-widest mb-4">
              Intereses
            </p>
            <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-2">
              {hobbies.map((hobby, i) => (
                <span
                  key={hobby.id || i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 text-sm text-slate-400 select-none"
                >
                  <span>{hobby.emoji}</span>
                  <span>{hobby.name}</span>
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
