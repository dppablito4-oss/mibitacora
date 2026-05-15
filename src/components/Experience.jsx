import { Briefcase } from 'lucide-react';
import { EXPERIENCE } from '../data/siteData';

export default function Experience() {
  return (
    <section id="experiencia" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-14">
          <span className="mb-2 inline-block font-mono text-xs font-medium uppercase tracking-widest text-accent-400">
            Trayectoria
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Experiencia
          </h2>
          <p className="mt-3 max-w-md text-zinc-500">
            Mi recorrido profesional en el desarrollo de software.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-accent-500/30 via-zinc-800 to-transparent" />

          <div className="flex flex-col gap-10">
            {EXPERIENCE.map((exp, idx) => (
              <div key={idx} className="group relative flex gap-6">
                {/* Timeline dot */}
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 transition-all duration-300 group-hover:border-accent-500/30 group-hover:bg-accent-600/10">
                  <Briefcase
                    size={16}
                    className="text-zinc-500 transition-colors duration-300 group-hover:text-accent-400"
                  />
                </div>

                {/* Content */}
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 transition-all duration-300 group-hover:border-zinc-700/60 group-hover:bg-zinc-900/70 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-base font-semibold text-zinc-100">
                      {exp.role}
                    </h3>
                    <span className="font-mono text-xs text-zinc-600">
                      {exp.period}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-500">
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
