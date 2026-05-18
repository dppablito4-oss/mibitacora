import { ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '../data/siteData';
import { useScrollAnimation, scrollAnimClass } from '../lib/useScrollAnimation';

export default function Projects() {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section id="proyectos" className="relative py-24">
      <div ref={ref} className={`relative mx-auto max-w-6xl px-6 ${scrollAnimClass(isVisible, 'up')}`}>
        {/* Section header */}
        <div className="mb-14">
          <span className="mb-2 inline-block font-mono text-xs font-medium uppercase tracking-widest text-accent-400">
            Portfolio
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Proyectos
          </h2>
          <p className="mt-3 max-w-md text-zinc-500">
            Desarrollos propios que reflejan mi enfoque en diseño y tecnología.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {PROJECTS.map((project, idx) => (
            <a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-7 transition-all duration-400 hover:border-zinc-700 hover:bg-zinc-900/80 ${
                idx === 0 ? 'sm:col-span-2' : ''
              }`}
            >
              {/* Content */}
              <div className="relative">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-zinc-100 transition-colors duration-200 group-hover:text-white">
                      {project.title}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-500 transition-colors duration-200 group-hover:text-zinc-400">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-500 transition-all duration-300 group-hover:border-zinc-700 group-hover:bg-zinc-800 group-hover:text-zinc-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    <ArrowUpRight size={16} />
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-zinc-800/60 px-2.5 py-1 text-xs font-medium text-zinc-500 transition-colors duration-200 group-hover:bg-zinc-800 group-hover:text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Accent line */}
                <div
                  className="absolute -bottom-7 left-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full"
                  style={{ backgroundColor: project.accent }}
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
