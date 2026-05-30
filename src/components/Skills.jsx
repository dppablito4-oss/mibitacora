import { Monitor, Server, Brain, GitBranch, Code2 } from 'lucide-react';
import { SKILLS } from '../data/siteData';


const ICON_MAP = { Monitor, Server, Brain, GitBranch, Code2 };

export default function Skills() {
  return (
    <section id="skills" className="relative py-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section header */}
        <div className="reveal mb-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-accent-500/60" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-400">
              Tech Stack
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Habilidades
          </h2>
          <p className="mt-3 max-w-md text-[15px] text-zinc-600">
            Las herramientas y tecnologías con las que construyo a diario.
          </p>
        </div>

        {/* Skills grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SKILLS.map((skill, idx) => {
            const IconComponent = ICON_MAP[skill.icon] || Code2;
            return (
              <div
                key={skill.category}
                className={`reveal reveal-delay-${idx + 1} group relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6 transition-all duration-400 hover:border-zinc-700/80 hover:bg-zinc-900/60 border-glow`}
              >
                {/* Hover gradient background */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-500/[0.03] to-violet-500/[0.03] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/60 text-zinc-400 transition-all duration-400 group-hover:bg-accent-600/15 group-hover:text-accent-400">
                      <IconComponent size={18} strokeWidth={1.8} />
                    </div>
                    <h3 className="text-sm font-semibold tracking-tight text-zinc-300 transition-colors duration-300 group-hover:text-zinc-100">
                      {skill.category}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-lg bg-zinc-800/40 px-2.5 py-1 text-[11px] font-medium text-zinc-500 transition-all duration-300 group-hover:bg-zinc-800/70 group-hover:text-zinc-400"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom section divider */}
      <div className="mx-auto mt-24 max-w-5xl px-6">
        <div className="section-line" />
      </div>
    </section>
  );
}
