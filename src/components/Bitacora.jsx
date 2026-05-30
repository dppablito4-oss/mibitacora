import { useState, useEffect } from 'react';
import { getBitacora } from '../config/supabaseClient';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import { useScrollAnimation, scrollAnimClass } from '../lib/useScrollAnimation';

const CAT_ACCENT = {
  general: 'text-white/40',
  dev: 'text-accent-400/70',
  personal: 'text-emerald-400/70',
  proyecto: 'text-violet-400/70',
};

export default function Bitacora() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { ref, isVisible } = useScrollAnimation();

  const loadEntries = async () => {
    try {
      const data = await getBitacora(50);
      setEntries(data || []);
    } catch (err) { console.error('Error loading bitácora:', err); }
    finally { setLoading(false); }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadEntries(); }, []);

  const filtered = filter === 'all' ? entries : entries.filter(e => e.categoria === filter);
  const formatDate = (d) => new Date(d).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <section id="bitacora" className="relative py-28">
      <div className="section-divider mx-auto max-w-5xl mb-28" />
      <div ref={ref} className={`mx-auto max-w-5xl px-6 ${scrollAnimClass(isVisible, 'up')}`}>
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/25 mb-3">Blog</p>
          <h2 className="text-3xl font-bold tracking-tight text-gradient sm:text-4xl">
            Bitácora
          </h2>
          <p className="mt-3 text-sm text-white/25 max-w-md">
            Reflexiones, aprendizajes y notas sobre desarrollo, proyectos y vida.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10 flex flex-wrap gap-1.5">
          {['all', 'dev', 'personal', 'proyecto', 'general'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                filter === cat
                  ? 'bg-white/8 text-white/80 border border-white/10'
                  : 'text-white/25 border border-transparent hover:text-white/50'
              }`}
            >
              {cat === 'all' ? 'Todas' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-accent-400/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-accent-400/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-accent-400/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-4xl mb-4">📝</span>
            <p className="text-sm text-white/20">Las entradas aparecerán aquí cuando se publiquen.</p>
          </div>
        )}

        {/* Entries */}
        {!loading && filtered.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((entry, idx) => (
              <article
                key={entry.id}
                className={`card glow-border group p-7 ${idx === 0 ? 'sm:col-span-2' : ''}`}
              >
                <div className="flex items-center gap-3 text-xs mb-4">
                  <span className={`font-medium ${CAT_ACCENT[entry.categoria] || CAT_ACCENT.general}`}>
                    {entry.categoria}
                  </span>
                  <span className="text-white/15">·</span>
                  <span className="flex items-center gap-1 text-white/15">
                    <Calendar size={11} />
                    {formatDate(entry.created_at)}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white/85 group-hover:text-white transition-colors mb-2">
                  {entry.titulo}
                </h3>
                <p className="text-sm leading-relaxed text-white/25 line-clamp-3 group-hover:text-white/40 transition-colors">
                  {entry.contenido}
                </p>

                {entry.tags?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {entry.tags.map(tag => (
                      <span key={tag} className="tag"><Tag size={9} className="inline mr-1" />{tag}</span>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex items-center gap-1.5 text-xs text-accent-400/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  Leer más <ArrowRight size={11} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
