import { ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '../data/siteData';
import { useScrollAnimation, scrollAnimClass } from '../lib/useScrollAnimation';
import { trackCTA } from '../lib/analytics';

export default function Projects() {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section id="proyectos" className="relative py-28">
      <div className="section-divider mx-auto max-w-5xl mb-28" />
      <div ref={ref} className={`relative mx-auto max-w-5xl px-6 ${scrollAnimClass(isVisible, 'up')}`}>
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/25 mb-3">Trabajo</p>
          <h2 className="text-3xl font-bold tracking-tight text-gradient sm:text-4xl">
            Proyectos seleccionados
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {PROJECTS.map((project, idx) => (
            <a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
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
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
