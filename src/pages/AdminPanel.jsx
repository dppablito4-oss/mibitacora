import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, insertBitacora, getBitacora } from '../config/supabaseClient';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit3, Eye, EyeOff, LogOut, Sparkles, ArrowLeft, Save } from 'lucide-react';

export default function AdminPanel() {
  const { user, signOut } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [categoria, setCategoria] = useState('general');
  const [tags, setTags] = useState('');
  const [publicado, setPublicado] = useState(false);

  useEffect(() => { loadEntries(); }, []);

  const loadEntries = async () => {
    setLoading(true);
    try {
      // Admin gets ALL entries (published + drafts)
      const { data, error } = await supabase
        .from('bitacora')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setEntries(data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setTitulo(''); setContenido(''); setCategoria('general'); setTags(''); setPublicado(false); setEditingId(null);
  };

  const handleNew = () => { resetForm(); setShowEditor(true); };

  const handleEdit = (entry) => {
    setTitulo(entry.titulo);
    setContenido(entry.contenido);
    setCategoria(entry.categoria);
    setTags(entry.tags?.join(', ') || '');
    setPublicado(entry.publicado);
    setEditingId(entry.id);
    setShowEditor(true);
  };

  const handleSave = async () => {
    if (!titulo.trim() || !contenido.trim()) return;
    setSaving(true);
    try {
      const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      const payload = { titulo, contenido, categoria, tags: tagsArray, publicado };

      if (editingId) {
        const { error } = await supabase.from('bitacora').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        await insertBitacora({ titulo, contenido, categoria });
        // Update tags and publicado separately since insertBitacora only handles basics
        if (tagsArray.length || publicado) {
          const { data } = await supabase.from('bitacora').select('id').order('created_at', { ascending: false }).limit(1).single();
          if (data) await supabase.from('bitacora').update({ tags: tagsArray, publicado }).eq('id', data.id);
        }
      }
      setShowEditor(false);
      resetForm();
      await loadEntries();
    } catch (err) { alert('Error: ' + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta entrada?')) return;
    await supabase.from('bitacora').delete().eq('id', id);
    await loadEntries();
  };

  const togglePublished = async (entry) => {
    await supabase.from('bitacora').update({ publicado: !entry.publicado }).eq('id', entry.id);
    await loadEntries();
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Admin Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors text-sm">
              <ArrowLeft size={16} /> Volver
            </Link>
            <div className="h-4 w-px bg-zinc-800" />
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-accent-400" />
              <span className="text-sm font-bold text-zinc-200">Admin</span>
              <span className="text-[10px] bg-accent-600/15 text-accent-400 px-2 py-0.5 rounded-full font-semibold">Bitácora</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-600">{user?.email}</span>
            <button onClick={signOut} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors">
              <LogOut size={14} /> Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Editor */}
        {showEditor ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-zinc-100">{editingId ? 'Editar Entrada' : 'Nueva Entrada'}</h2>
              <button onClick={() => { setShowEditor(false); resetForm(); }} className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm">Cancelar</button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">Título</label>
                <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título de la entrada..." className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 px-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-accent-500/60 focus:outline-none focus:ring-1 focus:ring-accent-500/30 transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2">Categoría</label>
                  <select value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 px-4 text-sm text-zinc-200 focus:border-accent-500/60 focus:outline-none transition-all">
                    <option value="general">General</option>
                    <option value="dev">Dev</option>
                    <option value="personal">Personal</option>
                    <option value="proyecto">Proyecto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2">Tags (separados por coma)</label>
                  <input value={tags} onChange={e => setTags(e.target.value)} placeholder="react, supabase, ia" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 px-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-accent-500/60 focus:outline-none focus:ring-1 focus:ring-accent-500/30 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">Contenido (Markdown)</label>
                <textarea value={contenido} onChange={e => setContenido(e.target.value)} placeholder="Escribe el contenido de la entrada..." rows={12} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 px-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-accent-500/60 focus:outline-none focus:ring-1 focus:ring-accent-500/30 transition-all resize-none font-mono" />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={publicado} onChange={e => setPublicado(e.target.checked)} className="rounded border-zinc-600 bg-zinc-800 text-accent-500" />
                  <span className="text-sm text-zinc-400">Publicar inmediatamente</span>
                </label>

                <button onClick={handleSave} disabled={saving || !titulo.trim() || !contenido.trim()} className="flex items-center gap-2 rounded-xl bg-accent-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-500 disabled:opacity-40 transition-all">
                  <Save size={16} /> {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Actions Bar */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-zinc-100">Entradas ({entries.length})</h2>
              <button onClick={handleNew} className="flex items-center gap-2 rounded-xl bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-500 transition-all">
                <Plus size={16} /> Nueva Entrada
              </button>
            </div>

            {/* Entries Table */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-zinc-600 text-sm">No hay entradas. ¡Crea la primera!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map(entry => (
                  <div key={entry.id} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 px-6 py-4 hover:border-zinc-700 transition-colors">
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-zinc-200 truncate">{entry.titulo}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${entry.publicado ? 'bg-emerald-600/15 text-emerald-400' : 'bg-zinc-700/60 text-zinc-500'}`}>
                          {entry.publicado ? 'Publicado' : 'Borrador'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-zinc-600">
                        <span>{entry.categoria}</span>
                        <span>·</span>
                        <span>{formatDate(entry.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => togglePublished(entry)} title={entry.publicado ? 'Despublicar' : 'Publicar'} className="p-2 rounded-lg text-zinc-600 hover:text-accent-400 hover:bg-zinc-800 transition-colors">
                        {entry.publicado ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={() => handleEdit(entry)} className="p-2 rounded-lg text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"><Edit3 size={14} /></button>
                      <button onClick={() => handleDelete(entry.id)} className="p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-zinc-800 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
