import { motion } from 'framer-motion';

export default function ArsenalSection({ skills }) {
  const allSkills = skills.flatMap(s => s.items);

  // Dividir en 2 filas para la marquee dual
  const mid = Math.ceil(allSkills.length / 2);
  const row1 = allSkills.slice(0, mid);
  const row2 = allSkills.slice(mid);

  // Duplicar para efecto infinito seamless
  const row1Doubled = [...row1, ...row1];
  const row2Doubled = [...row2, ...row2];

  return (
    <section id="arsenal" className="relative py-20 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-glow mb-4 text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">Arsenal Tecnológico</h2>
          <div className="mx-auto h-1 w-24 bg-tesseract-300 shadow-[0_0_10px_rgba(103,232,249,0.8)]"></div>
        </motion.div>
      </div>

      {/* Marquee Row 1 — moves left */}
      <div className="mb-4 overflow-hidden mask-fade-edges">
        <div className="marquee-track" style={{ '--marquee-duration': '35s' }}>
          {row1Doubled.map((skill, i) => (
            <span
              key={`r1-${i}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 mx-2 text-sm font-medium text-slate-400 hover:text-tesseract-300 transition-colors duration-200 select-none whitespace-nowrap"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-tesseract-500/50" />
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Marquee Row 2 — moves right (reversed) */}
      <div className="overflow-hidden mask-fade-edges">
        <div className="marquee-track marquee-reverse" style={{ '--marquee-duration': '40s' }}>
          {row2Doubled.map((skill, i) => (
            <span
              key={`r2-${i}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 mx-2 text-sm font-medium text-slate-500 hover:text-tesseract-300 transition-colors duration-200 select-none whitespace-nowrap"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-tesseract-700/50" />
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
