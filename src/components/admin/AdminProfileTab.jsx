import { useState, useRef } from 'react';
import { updateSiteConfig, uploadAvatar } from '../../config/supabaseClient';
import { Camera, Save, Check, Link as LinkIcon, User, Mail, Calendar, Type, FileText } from 'lucide-react';

export default function AdminProfileTab({ config, onSaved }) {
  const [profile, setProfile] = useState(config?.profile || {});
  const [avatarUrl, setAvatarUrl] = useState(config?.avatarUrl || '');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

  const updateField = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const updateLink = (key, value) => {
    setProfile(prev => ({
      ...prev,
      links: { ...(prev.links || {}), [key]: value },
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let newAvatarUrl = avatarUrl;

      // Subir avatar si hay uno nuevo
      if (avatarFile) {
        newAvatarUrl = await uploadAvatar(avatarFile);
        setAvatarUrl(newAvatarUrl);
        setAvatarFile(null);
        setAvatarPreview(null);
      }

      await updateSiteConfig({
        profile,
        avatar_url: newAvatarUrl || null,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      if (onSaved) onSaved();
    } catch (err) {
      alert('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 px-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-accent-500/60 focus:outline-none focus:ring-1 focus:ring-accent-500/30 transition-all";

  return (
    <div className="space-y-8">
      {/* Success banner */}
      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-xs text-emerald-400 animate-fade-in">
          <Check size={14} /> Perfil guardado correctamente. Los cambios son visibles en el sitio.
        </div>
      )}

      {/* Avatar Section */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <h3 className="text-sm font-bold text-zinc-300 mb-4 flex items-center gap-2">
          <Camera size={16} className="text-accent-400" /> Foto de Perfil
        </h3>
        <div className="flex items-center gap-6">
          <div
            onClick={() => fileRef.current?.click()}
            className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-zinc-700 hover:border-accent-500/60 cursor-pointer transition-colors group"
          >
            {(avatarPreview || avatarUrl) ? (
              <img
                src={avatarPreview || avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                <span className="text-3xl text-zinc-600 font-light">{profile.name?.[0] || 'P'}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={20} className="text-white" />
            </div>
          </div>
          <div>
            <button
              onClick={() => fileRef.current?.click()}
              className="text-sm text-accent-400 hover:text-accent-300 transition-colors"
            >
              Cambiar foto
            </button>
            <p className="text-[11px] text-zinc-600 mt-1">JPG, PNG o WebP. Max 5MB.</p>
            {avatarPreview && (
              <p className="text-[11px] text-amber-400 mt-1">⚡ Nueva foto lista — guarda para aplicar</p>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Profile Fields */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
        <h3 className="text-sm font-bold text-zinc-300 mb-2 flex items-center gap-2">
          <User size={16} className="text-accent-400" /> Datos Personales
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">Nombre completo</label>
            <input value={profile.name || ''} onChange={e => updateField('name', e.target.value)} placeholder="Tu nombre" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">Alias / Subdomain</label>
            <input value={profile.subdomain || ''} onChange={e => updateField('subdomain', e.target.value)} placeholder="PABLITODP" className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-2">Tagline / Especialidad</label>
          <input value={profile.tagline || ''} onChange={e => updateField('tagline', e.target.value)} placeholder="Desarrollador Web..." className={inputClass} />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-2">Bio</label>
          <textarea value={profile.bio || ''} onChange={e => updateField('bio', e.target.value)} placeholder="Cuéntale al mundo quién eres..." rows={3} className={`${inputClass} resize-none`} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">Email</label>
            <input value={profile.email || ''} onChange={e => updateField('email', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">Fecha de nacimiento</label>
            <input value={profile.birth || ''} onChange={e => updateField('birth', e.target.value)} placeholder="19-11-2004" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">Género</label>
            <input value={profile.gender || ''} onChange={e => updateField('gender', e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
        <h3 className="text-sm font-bold text-zinc-300 mb-2 flex items-center gap-2">
          <LinkIcon size={16} className="text-accent-400" /> Enlaces
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">GitHub</label>
            <input value={profile.links?.github || ''} onChange={e => updateLink('github', e.target.value)} placeholder="https://github.com/..." className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">Email link</label>
            <input value={profile.links?.email || ''} onChange={e => updateLink('email', e.target.value)} placeholder="mailto:tu@email.com" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">Expo / Portfolio</label>
            <input value={profile.links?.expo || ''} onChange={e => updateLink('expo', e.target.value)} placeholder="https://..." className={inputClass} />
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-accent-600 px-8 py-3 text-sm font-semibold text-white hover:bg-accent-500 disabled:opacity-40 transition-all"
        >
          <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Perfil'}
        </button>
      </div>
    </div>
  );
}
