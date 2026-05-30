import { useState } from 'react';
import { updateSiteConfig } from '../../config/supabaseClient';
import { Megaphone, Save, Check, Eye, EyeOff, Link as LinkIcon, Type } from 'lucide-react';

const TIPOS = [
  { value: 'info', label: 'Info', color: 'bg-accent-500/15 text-accent-400 border-accent-500/30' },
  { value: 'warning', label: 'Aviso', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  { value: 'promo', label: 'Promo', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { value: 'urgent', label: 'Urgente', color: 'bg-red-500/15 text-red-400 border-red-500/30' },
];

export default function AdminAvisosTab({ config, onSaved }) {
  const [aviso, setAviso] = useState(config?.aviso || {
    activo: false,
    texto: '',
    link: '',
    tipo: 'info',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateField = (key, value) => {
    setAviso(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSiteConfig({ aviso });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      if (onSaved) onSaved();
    } catch (err) {
      alert('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const currentTipo = TIPOS.find(t => t.value === aviso.tipo) || TIPOS[0];
  const inputClass = "w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 px-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-accent-500/60 focus:outline-none focus:ring-1 focus:ring-accent-500/30 transition-all";

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-xs text-emerald-400 animate-fade-in">
          <Check size={14} /> Aviso guardado correctamente.
        </div>
      )}

      {/* Preview */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <h3 className="text-sm font-bold text-zinc-300 mb-4 flex items-center gap-2">
          <Eye size={16} className="text-accent-400" /> Vista Previa
        </h3>

        {aviso.activo && aviso.texto ? (
          <div className={`rounded-xl border px-4 py-3 text-sm flex items-center gap-3 ${currentTipo.color}`}>
            <Megaphone size={16} className="shrink-0" />
            <span className="flex-1">{aviso.texto}</span>
            {aviso.link && (
              <a href={aviso.link} className="text-xs underline shrink-0 opacity-75 hover:opacity-100" target="_blank" rel="noopener noreferrer">
                Ver más →
              </a>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-6 text-center">
            <p className="text-xs text-zinc-600">
              {aviso.activo ? 'Escribe un texto para ver la preview' : 'El aviso está desactivado'}
            </p>
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
        <h3 className="text-sm font-bold text-zinc-300 mb-2 flex items-center gap-2">
          <Megaphone size={16} className="text-accent-400" /> Configurar Aviso
        </h3>

        {/* Toggle active */}
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3">
          <div className="flex items-center gap-3">
            {aviso.activo ? (
              <Eye size={16} className="text-emerald-400" />
            ) : (
              <EyeOff size={16} className="text-zinc-600" />
            )}
            <div>
              <p className="text-sm text-zinc-200 font-medium">
                {aviso.activo ? 'Aviso activo' : 'Aviso desactivado'}
              </p>
              <p className="text-[11px] text-zinc-600">
                {aviso.activo ? 'Visible en la parte superior de tu sitio' : 'No se muestra en el sitio'}
              </p>
            </div>
          </div>
          <button
            onClick={() => updateField('activo', !aviso.activo)}
            className={`relative w-12 h-7 rounded-full transition-colors ${aviso.activo ? 'bg-accent-600' : 'bg-zinc-700'}`}
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${aviso.activo ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-2">Tipo de aviso</label>
          <div className="flex flex-wrap gap-2">
            {TIPOS.map(tipo => (
              <button
                key={tipo.value}
                onClick={() => updateField('tipo', tipo.value)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  aviso.tipo === tipo.value ? tipo.color : 'border-zinc-800 text-zinc-600 hover:border-zinc-700'
                }`}
              >
                {tipo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Texto */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-2">Texto del aviso</label>
          <input
            value={aviso.texto}
            onChange={e => updateField('texto', e.target.value)}
            placeholder="Ej: 🚀 Nuevo proyecto disponible — Pablito Expo v2.0"
            className={inputClass}
            maxLength={200}
          />
          <p className="text-[11px] text-zinc-700 mt-1 text-right">{aviso.texto.length}/200</p>
        </div>

        {/* Link */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-2">Enlace (opcional)</label>
          <input
            value={aviso.link}
            onChange={e => updateField('link', e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-accent-600 px-8 py-3 text-sm font-semibold text-white hover:bg-accent-500 disabled:opacity-40 transition-all"
        >
          <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Aviso'}
        </button>
      </div>
    </div>
  );
}
