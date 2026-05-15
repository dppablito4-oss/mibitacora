import * as Icons from 'lucide-react';
import { SKILLS } from '../data/siteData';

export default function Skills() {
  return (
    <section id="skills" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-14">
          <span className="mb-2 inline-block font-mono text-xs font-medium uppercase tracking-widest text-accent-400">
            Tech Stack
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Habilidades
          </h2>
          <p className="mt-3 max-w-md text-zinc-500">
            Las herramientas y tecnologías con las que construyo a diario.
          </p>
        </div>

        {/* Skills grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SKILLS.map((skill, idx) => {
            const IconComponent = Icons[skill.icon] || Icons.Code2;
            return (
              <div
                key={skill.category}
                className="group rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 transition-all duration-300 hover:border-zinc-700/60 hover:bg-zinc-900/70 hover:shadow-lg hover:shadow-black/10"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-600/10 text-accent-400 transition-colors duration-300 group-hover:bg-accent-600/20">
                    <IconComponent size={20} />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-200">
                    {skill.category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg bg-zinc-800/60 px-2.5 py-1 text-xs font-medium text-zinc-400 transition-colors duration-200 group-hover:bg-zinc-800 group-hover:text-zinc-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
