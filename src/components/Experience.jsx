import { Briefcase } from 'lucide-react';
import { EXPERIENCE } from '../data/siteData';
import { useScrollAnimation, scrollAnimClass } from '../lib/useScrollAnimation';

export default function Experience() {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section id="experiencia" className="relative py-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section header */}
        <div className="reveal mb-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-accent-500/60" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-400">
              Trayectoria
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Experiencia
          </h2>
          <p className="mt-3 max-w-md text-[15px] text-zinc-600">
            Mi recorrido profesional en el desarrollo de software.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line — gradient */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-accent-500/40 via-zinc-800/60 to-transparent" />

          <div className="flex flex-col gap-8">
            {EXPERIENCE.map((exp, idx) => (
              <div
                key={idx}
                className={`reveal reveal-delay-${Math.min(idx + 1, 4)} group relative flex gap-6`}
              >
                {/* Timeline node */}
                <div className="relative z-10 mt-1">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800/60 bg-zinc-900/80 transition-all duration-400 group-hover:border-accent-500/30 group-hover:bg-accent-600/10 group-hover:shadow-lg group-hover:shadow-accent-500/5">
                    <Briefcase
                      size={15}
                      strokeWidth={1.8}
                      className="text-zinc-600 transition-colors duration-400 group-hover:text-accent-400"
                    />
                  </div>
                </div>

                {/* Content card */}
                <div className="flex-1 rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6 transition-all duration-400 group-hover:border-zinc-700/80 group-hover:bg-zinc-900/50 border-glow">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-[15px] font-semibold tracking-tight text-zinc-200 transition-colors duration-300 group-hover:text-zinc-100">
                      {exp.role}
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-zinc-800/40 px-2.5 py-0.5 font-mono text-[11px] font-medium text-zinc-600">
                      {exp.period}
                    </span>
                  </div>
                  <p className="mt-3 text-[14px] leading-relaxed text-zinc-600">
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
