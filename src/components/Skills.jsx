import * as Icons from 'lucide-react';
import { SKILLS } from '../data/siteData';
import { useScrollAnimation, scrollAnimClass } from '../lib/useScrollAnimation';

export default function Skills() {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section id="skills" className="relative py-28">
      <div className="section-divider mx-auto max-w-5xl mb-28" />
      <div ref={ref} className={`mx-auto max-w-5xl px-6 ${scrollAnimClass(isVisible, 'up')}`}>
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/25 mb-3">Stack</p>
          <h2 className="text-3xl font-bold tracking-tight text-gradient sm:text-4xl">
            Herramientas que uso
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SKILLS.map((skill, idx) => {
            const IconComponent = Icons[skill.icon] || Icons.Code2;
            return (
              <div
                key={skill.category}
                className="card glow-border p-6"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/8 text-accent-400/70">
                    <IconComponent size={18} />
                  </div>
                  <h3 className="text-sm font-semibold text-white/80">
                    {skill.category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skill.items.map((item) => (
                    <span key={item} className="tag">{item}</span>
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
