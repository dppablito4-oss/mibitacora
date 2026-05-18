import { useState, useEffect } from 'react';
import { getBitacora } from '../config/supabaseClient';
import { Calendar, Tag, ArrowRight } from 'lucide-react';

const CATEGORY_COLORS = {
  general: 'bg-zinc-700/60 text-zinc-400',
  dev: 'bg-accent-600/15 text-accent-400',
  personal: 'bg-emerald-600/15 text-emerald-400',
  proyecto: 'bg-violet-600/15 text-violet-400',
};

export default function Bitacora() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await getBitacora(50);
      setEntries(data || []);
    } catch (err) {
      console.error('Error loading bitácora:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'all' ? entries : entries.filter(e => e.categoria === filter);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <section id="bitacora" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-14">
          <span className="mb-2 inline-block font-mono text-xs font-medium uppercase tracking-widest text-accent-400">
            Blog
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Bitácora
          </h2>
          <p className="mt-3 max-w-md text-zinc-500">
            Reflexiones, aprendizajes y notas sobre desarrollo, proyectos y vida.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {['all', 'dev', 'personal', 'proyecto', 'general'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                filter === cat
                  ? 'bg-accent-600 text-white'
                  : 'bg-zinc-800/60 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
              }`}
            >
              {cat === 'all' ? 'Todas' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800/60 flex items-center justify-center mb-4">
              <span className="text-3xl">📝</span>
            </div>
            <h3 className="text-lg font-semibold text-zinc-300 mb-2">Sin entradas aún</h3>
            <p className="text-sm text-zinc-600 max-w-sm">
              Las entradas de la bitácora aparecerán aquí cuando se publiquen.
            </p>
          </div>
        )}

        {/* Entries Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((entry, idx) => (
              <article
                key={entry.id}
                className={`group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-7 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80 ${
                  idx === 0 ? 'sm:col-span-2' : ''
                }`}
              >
                {/* Meta */}
                <div className="mb-4 flex items-center gap-3 text-xs">
                  <span className={`rounded-full px-2.5 py-0.5 font-semibold ${CATEGORY_COLORS[entry.categoria] || CATEGORY_COLORS.general}`}>
                    {entry.categoria}
                  </span>
                  <span className="flex items-center gap-1 text-zinc-600">
                    <Calendar size={12} />
                    {formatDate(entry.created_at)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold tracking-tight text-zinc-100 transition-colors group-hover:text-white mb-3">
                  {entry.titulo}
                </h3>

                {/* Content preview */}
                <p className="text-sm leading-relaxed text-zinc-500 transition-colors group-hover:text-zinc-400 line-clamp-3">
                  {entry.contenido}
                </p>

                {/* Tags */}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {entry.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 rounded-lg bg-zinc-800/60 px-2.5 py-1 text-xs font-medium text-zinc-500">
                        <Tag size={10} />{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Read more indicator */}
                <div className="mt-5 flex items-center gap-1.5 text-xs text-accent-400 opacity-0 transition-opacity group-hover:opacity-100">
                  Leer más <ArrowRight size={12} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
