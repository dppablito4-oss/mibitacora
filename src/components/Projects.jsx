import { ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '../data/siteData';
import { useScrollAnimation, scrollAnimClass } from '../lib/useScrollAnimation';
import { trackCTA } from '../lib/analytics';

export default function Projects() {
  const { ref, isVisible } = useScrollAnimation();
  return (
<<<<<<< HEAD
    <section id="proyectos" className="relative py-24">
      <div className="relative mx-auto max-w-5xl px-6">
        {/* Section header */}
        <div className="reveal mb-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-accent-500/60" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-400">
              Portfolio
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Proyectos
          </h2>
          <p className="mt-3 max-w-md text-[15px] text-zinc-600">
            Desarrollos propios que reflejan mi enfoque en diseño y tecnología.
          </p>
        </div>

        {/* Project Grid — Bento layout */}
=======
    <section id="proyectos" className="relative py-28">
      <div className="section-divider mx-auto max-w-5xl mb-28" />
      <div ref={ref} className={`relative mx-auto max-w-5xl px-6 ${scrollAnimClass(isVisible, 'up')}`}>
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/25 mb-3">Trabajo</p>
          <h2 className="text-3xl font-bold tracking-tight text-gradient sm:text-4xl">
            Proyectos seleccionados
          </h2>
        </div>

>>>>>>> f1c96d7c0faadf24344cfb05982bef174dc10819
        <div className="grid gap-3 sm:grid-cols-2">
          {PROJECTS.map((project, idx) => (
            <a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
<<<<<<< HEAD
              className={`reveal reveal-delay-${Math.min(idx + 1, 4)} group relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/30 transition-all duration-500 hover:border-zinc-700/80 hover:bg-zinc-900/50 border-glow ${
                idx === 0 ? 'sm:col-span-2' : ''
              }`}
            >
              {/* Colored accent gradient on hover */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(ellipse at top left, ${project.accent}08, transparent 60%)`
                }}
              />

              <div className="relative p-7 sm:p-8">
                {/* Top row: title + arrow */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Project accent dot + title */}
                    <div className="mb-3 flex items-center gap-2.5">
                      <div
                        className="h-2 w-2 rounded-full transition-all duration-300 group-hover:shadow-lg"
                        style={{
                          backgroundColor: project.accent,
                          boxShadow: 'none'
                        }}
                        onMouseEnter={(e) => e.target.style.boxShadow = `0 0 12px ${project.accent}40`}
                        onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                      />
                      <h3 className="text-lg font-bold tracking-tight text-zinc-200 transition-colors duration-200 group-hover:text-white">
                        {project.title}
                      </h3>
                    </div>
                    <p className="max-w-xl text-[14px] leading-relaxed text-zinc-600 transition-colors duration-300 group-hover:text-zinc-500">
                      {project.description}
                    </p>
                  </div>

                  {/* Arrow button */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-800/60 bg-zinc-900/60 text-zinc-600 transition-all duration-400 group-hover:border-zinc-700 group-hover:bg-zinc-800 group-hover:text-zinc-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    <ArrowUpRight size={15} />
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-zinc-800/40 px-2.5 py-1 text-[11px] font-medium text-zinc-600 transition-colors duration-300 group-hover:bg-zinc-800/60 group-hover:text-zinc-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Accent line animation */}
                <div className="absolute bottom-0 left-0 right-0 h-px">
                  <div
                    className="h-full w-0 transition-all duration-700 ease-out group-hover:w-full"
                    style={{
                      background: `linear-gradient(90deg, ${project.accent}00, ${project.accent}60, ${project.accent}00)`
                    }}
                  />
                </div>
=======
              onClick={() => trackCTA(project.title, project.url)}
              className={`card glow-border group p-8 ${idx === 0 ? 'sm:col-span-2' : ''}`}
            >
              <div className="relative">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/30 group-hover:text-white/45 transition-colors">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/6 bg-white/3 text-white/25 transition-all duration-300 group-hover:text-white/70 group-hover:border-white/12 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    <ArrowUpRight size={14} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>

                {/* Accent line */}
                <div
                  className="absolute -bottom-8 left-0 h-px w-0 transition-all duration-700 group-hover:w-full"
                  style={{ background: `linear-gradient(90deg, ${project.accent}40, transparent)` }}
                />
>>>>>>> f1c96d7c0faadf24344cfb05982bef174dc10819
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Bottom section divider */}
      <div className="mx-auto mt-24 max-w-5xl px-6">
        <div className="section-line" />
      </div>
    </section>
  );
}
