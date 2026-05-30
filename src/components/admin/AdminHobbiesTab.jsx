import { useState } from 'react';
import { updateSiteConfig } from '../../config/supabaseClient';
import { Heart, Plus, Trash2, Save, Check, GripVertical } from 'lucide-react';

export default function AdminHobbiesTab({ config, onSaved }) {
  const [hobbies, setHobbies] = useState(config?.hobbies || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // New hobby form
  const [newEmoji, setNewEmoji] = useState('🎮');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const addHobby = () => {
    if (!newName.trim()) return;
    setHobbies(prev => [...prev, {
      id: Date.now().toString(),
      emoji: newEmoji || '⭐',
      name: newName.trim(),
      description: newDesc.trim(),
    }]);
    setNewEmoji('🎮');
    setNewName('');
    setNewDesc('');
  };

  const removeHobby = (id) => {
    setHobbies(prev => prev.filter(h => h.id !== id));
  };

  const moveHobby = (index, direction) => {
    const newArr = [...hobbies];
    const target = index + direction;
    if (target < 0 || target >= newArr.length) return;
    [newArr[index], newArr[target]] = [newArr[target], newArr[index]];
    setHobbies(newArr);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSiteConfig({ hobbies });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      if (onSaved) onSaved();
    } catch (err) {
      alert('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-zinc-700 bg-zinc-950 py-2.5 px-3.5 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-accent-500/60 focus:outline-none focus:ring-1 focus:ring-accent-500/30 transition-all";

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-xs text-emerald-400 animate-fade-in">
          <Check size={14} /> Hobbies guardados correctamente.
        </div>
      )}

      {/* Add new hobby */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <h3 className="text-sm font-bold text-zinc-300 mb-4 flex items-center gap-2">
          <Plus size={16} className="text-accent-400" /> Agregar Hobby
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-20">
            <label className="block text-[11px] text-zinc-600 mb-1">Emoji</label>
            <input
              value={newEmoji}
              onChange={e => setNewEmoji(e.target.value)}
              className={`${inputClass} text-center text-lg`}
              maxLength={4}
            />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] text-zinc-600 mb-1">Nombre</label>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Ej: Gaming, Música, Fotografía..."
              className={inputClass}
            />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] text-zinc-600 mb-1">Descripción (opcional)</label>
            <input
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="Breve descripción..."
              className={inputClass}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={addHobby}
              disabled={!newName.trim()}
              className="flex items-center gap-2 rounded-xl bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-500 disabled:opacity-40 transition-all whitespace-nowrap"
            >
              <Plus size={14} /> Agregar
            </button>
          </div>
        </div>
      </div>

      {/* Hobbies List */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <h3 className="text-sm font-bold text-zinc-300 mb-4 flex items-center gap-2">
          <Heart size={16} className="text-accent-400" /> Mis Hobbies ({hobbies.length})
        </h3>

        {hobbies.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl block mb-3">🎯</span>
            <p className="text-sm text-zinc-600">Aún no hay hobbies. ¡Agrega el primero!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {hobbies.map((hobby, idx) => (
              <div
                key={hobby.id || idx}
                className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 hover:border-zinc-700 transition-colors group"
              >
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveHobby(idx, -1)}
                    disabled={idx === 0}
                    className="text-zinc-700 hover:text-zinc-400 disabled:opacity-20 transition-colors"
                  >
                    <GripVertical size={12} />
                  </button>
                </div>

                <span className="text-xl w-8 text-center shrink-0">{hobby.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{hobby.name}</p>
                  {hobby.description && (
                    <p className="text-[11px] text-zinc-600 truncate">{hobby.description}</p>
                  )}
                </div>

                <button
                  onClick={() => removeHobby(hobby.id || idx)}
                  className="p-1.5 rounded-lg text-zinc-700 hover:text-red-400 hover:bg-zinc-800 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-accent-600 px-8 py-3 text-sm font-semibold text-white hover:bg-accent-500 disabled:opacity-40 transition-all"
        >
          <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Hobbies'}
        </button>
      </div>
    </div>
  );
}
