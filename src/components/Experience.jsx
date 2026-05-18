import { EXPERIENCE } from '../data/siteData';
import { useScrollAnimation, scrollAnimClass } from '../lib/useScrollAnimation';

export default function Experience() {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section id="experiencia" className="relative py-28">
      <div className="section-divider mx-auto max-w-5xl mb-28" />
      <div ref={ref} className={`mx-auto max-w-5xl px-6 ${scrollAnimClass(isVisible, 'up')}`}>
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/25 mb-3">Trayectoria</p>
          <h2 className="text-3xl font-bold tracking-tight text-gradient sm:text-4xl">
            Experiencia
          </h2>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[7px] top-3 bottom-3 w-px bg-gradient-to-b from-accent-500/20 via-white/4 to-transparent" />

          <div className="flex flex-col gap-8">
            {EXPERIENCE.map((exp, idx) => (
              <div key={idx} className="group relative flex gap-6 pl-1">
                {/* Dot */}
                <div className="relative z-10 mt-1.5 flex h-[14px] w-[14px] shrink-0 items-center justify-center">
                  <div className="h-[6px] w-[6px] rounded-full bg-white/15 transition-colors duration-300 group-hover:bg-accent-400/60" />
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-[15px] font-semibold text-white/80 group-hover:text-white/95 transition-colors">
                      {exp.role}
                    </h3>
                    <span className="font-mono text-xs text-white/20">
                      {exp.period}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/25 group-hover:text-white/40 transition-colors">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
