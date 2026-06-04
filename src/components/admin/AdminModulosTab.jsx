import { useState } from 'react';
import { updateSiteConfig } from '../../config/supabaseClient';
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  Check,
  GripVertical,
  Layers,
  Sparkles,
  QrCode,
  Calculator,
  LayoutTemplate,
  ScanLine,
  Gamepad2,
  FileText,
  Settings,
  GraduationCap,
  BookOpen,
  FileSignature,
  Briefcase,
  Globe,
  Wrench,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';

const ICON_OPTIONS = [
  { value: 'ScanLine', label: 'Escáner QR', icon: ScanLine },
  { value: 'QrCode', label: 'Código QR', icon: QrCode },
  { value: 'Calculator', label: 'Calculadora / Math', icon: Calculator },
  { value: 'LayoutTemplate', label: 'Plantilla / Tríptico', icon: LayoutTemplate },
  { value: 'Gamepad2', label: 'Gamepad / Juego', icon: Gamepad2 },
  { value: 'FileText', label: 'Documento / Tesis', icon: FileText },
  { value: 'GraduationCap', label: 'Gorra Académica / Tesis', icon: GraduationCap },
  { value: 'BookOpen', label: 'Libro Abierto / Monografía', icon: BookOpen },
  { value: 'FileSignature', label: 'Firma / CV', icon: FileSignature },
  { value: 'Briefcase', label: 'Maletín / Trabajo', icon: Briefcase },
  { value: 'Globe', label: 'Globo / Red', icon: Globe },
  { value: 'Wrench', label: 'Herramienta / Wrench', icon: Wrench },
  { value: 'Sparkles', label: 'Brillo / IA', icon: Sparkles },
  { value: 'Settings', label: 'Engranaje / Config', icon: Settings },
  { value: 'Layers', label: 'Capas / Módulos', icon: Layers },
];

const COLOR_OPTIONS = [
  { value: 'rose', label: 'Rosado Neón', bg: 'bg-rose-600', text: 'text-rose-400', border: 'border-rose-500/50' },
  { value: 'red', label: 'Rojo Carmesí', bg: 'bg-red-600', text: 'text-red-400', border: 'border-red-500/50' },
  { value: 'amber', label: 'Ámbar Eléctrico', bg: 'bg-amber-600', text: 'text-amber-400', border: 'border-amber-500/50' },
  { value: 'blue', label: 'Azul Tesseract', bg: 'bg-cyan-600', text: 'text-cyan-400', border: 'border-cyan-500/50' },
  { value: 'emerald', label: 'Esmeralda Ácido', bg: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-500/50' },
  { value: 'purple', label: 'Púrpura Quantum', bg: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-500/50' },
];

const ICON_MAP = {
  QrCode, Calculator, LayoutTemplate, ScanLine, Gamepad2, FileText, Layers, Settings, Sparkles, GraduationCap, BookOpen, FileSignature, Briefcase, Globe, Wrench
};

export default function AdminModulosTab({ config, onSaved }) {
  const [modules, setModules] = useState(config?.modules || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('Layers');
  const [isFlashy, setIsFlashy] = useState(false);
  const [flashyText, setFlashyText] = useState('NOVEDAD');
  const [flashyColor, setFlashyColor] = useState('rose');
  const [active, setActive] = useState(true);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setUrl('');
    setIcon('Layers');
    setIsFlashy(false);
    setFlashyText('NOVEDAD');
    setFlashyColor('rose');
    setActive(true);
  };

  const handleAddOrEdit = () => {
    if (!title.trim() || !description.trim() || !url.trim()) return;

    const moduleData = {
      id: editingId || `module-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      url: url.trim(),
      icon,
      isFlashy,
      flashyText: isFlashy ? (flashyText.trim() || 'NOVEDAD') : '',
      flashyColor,
      active
    };

    if (editingId) {
      setModules(prev => prev.map(m => m.id === editingId ? moduleData : m));
    } else {
      setModules(prev => [...prev, moduleData]);
    }
    resetForm();
  };

  const handleEditClick = (mod) => {
    setEditingId(mod.id);
    setTitle(mod.title);
    setDescription(mod.description);
    setUrl(mod.url);
    setIcon(mod.icon || 'Layers');
    setIsFlashy(!!mod.isFlashy);
    setFlashyText(mod.flashyText || 'NOVEDAD');
    setFlashyColor(mod.flashyColor || 'rose');
    setActive(mod.active !== false);
  };

  const removeModule = (id) => {
    setModules(prev => prev.filter(m => m.id !== id));
    if (editingId === id) resetForm();
  };

  const toggleActive = (id) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, active: m.active === false ? true : false } : m));
  };

  const moveModule = (index, direction) => {
    const newArr = [...modules];
    const target = index + direction;
    if (target < 0 || target >= newArr.length) return;
    [newArr[index], newArr[target]] = [newArr[target], newArr[index]];
    setModules(newArr);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSiteConfig({ modules });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      if (onSaved) onSaved();
    } catch (err) {
      alert('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const getIconComponent = (iconName) => {
    const Component = ICON_MAP[iconName];
    return Component ? <Component size={20} className="text-zinc-400" /> : <HelpCircle size={20} className="text-zinc-400" />;
  };

  const inputClass = "w-full rounded-xl border border-zinc-700 bg-zinc-950 py-2.5 px-3.5 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-accent-500/60 focus:outline-none focus:ring-1 focus:ring-accent-500/30 transition-all";

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-xs text-emerald-400 animate-fade-in">
          <Check size={14} /> Módulos guardados correctamente.
        </div>
      )}

      {/* Formulario Agregar/Editar */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <h3 className="text-sm font-bold text-zinc-300 mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Plus size={16} className="text-accent-400" />
            {editingId ? 'Editar Módulo' : 'Agregar Módulo'}
          </span>
          {editingId && (
            <button onClick={resetForm} className="text-xs text-zinc-500 hover:text-zinc-300">
              Cancelar Edición
            </button>
          )}
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-[11px] text-zinc-500 mb-1">Título del Módulo</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ej: Formateo de Tesis APA"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-[11px] text-zinc-500 mb-1">Ruta / Enlace URL</label>
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="Ej: /tesis o https://..."
                className={inputClass}
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-[11px] text-zinc-500 mb-1">Icono Lucide</label>
              <select
                value={icon}
                onChange={e => setIcon(e.target.value)}
                className={`${inputClass} bg-zinc-950`}
              >
                {ICON_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-zinc-500 mb-1">Descripción</label>
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Ej: Estructuración y formato completo de tesis escolares y pre-universitarias..."
              className={inputClass}
            />
          </div>

          <div className="border-t border-zinc-800/80 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6">
              {/* Toggle Habilitado */}
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={e => setActive(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-950 text-accent-500 focus:ring-accent-500/20"
                />
                <span className="text-xs text-zinc-300 font-medium">Habilitar Módulo</span>
              </label>

              {/* Toggle Novedad / Llamativo */}
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFlashy}
                  onChange={e => setIsFlashy(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-950 text-rose-500 focus:ring-rose-500/20"
                />
                <span className="text-xs text-zinc-300 font-medium flex items-center gap-1">
                  Destacar con color llamativo (badge/novedad)
                </span>
              </label>
            </div>

            {/* Configuración de Novedad (solo si isFlashy es true) */}
            {isFlashy && (
              <div className="flex items-center gap-3 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800 animate-fade-in shrink-0">
                <div>
                  <label className="block text-[9px] text-zinc-500 mb-0.5 uppercase tracking-wider">Texto Badge</label>
                  <input
                    value={flashyText}
                    onChange={e => setFlashyText(e.target.value)}
                    placeholder="NOVEDAD"
                    className="rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 w-28 focus:outline-none focus:border-rose-500/50"
                    maxLength={12}
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-zinc-500 mb-0.5 uppercase tracking-wider">Color Estilo</label>
                  <select
                    value={flashyColor}
                    onChange={e => setFlashyColor(e.target.value)}
                    className="rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:border-rose-500/50"
                  >
                    {COLOR_OPTIONS.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleAddOrEdit}
              disabled={!title.trim() || !description.trim() || !url.trim()}
              className="flex items-center gap-2 rounded-xl bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-500 disabled:opacity-40 transition-all cursor-pointer"
            >
              {editingId ? <Check size={14} /> : <Plus size={14} />}
              {editingId ? 'Confirmar Edición' : 'Agregar Módulo'}
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Módulos */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <h3 className="text-sm font-bold text-zinc-300 mb-4 flex items-center gap-2">
          <Layers size={16} className="text-accent-400" /> Módulos Registrados ({modules.length})
        </h3>

        {modules.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl block mb-3">🧩</span>
            <p className="text-sm text-zinc-600">Aún no hay módulos creados. ¡Agrega el primero!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {modules.map((mod, idx) => {
              const flashyInfo = COLOR_OPTIONS.find(c => c.value === mod.flashyColor) || COLOR_OPTIONS[0];

              return (
                <div
                  key={mod.id || idx}
                  className={`flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border px-5 py-4 transition-all relative group bg-zinc-950/60 ${
                    mod.active === false
                      ? 'border-zinc-900 opacity-60'
                      : mod.isFlashy
                      ? `${flashyInfo.border} shadow-[0_0_10px_rgba(244,63,94,0.05)]`
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {/* Manija de Orden */}
                  <div className="flex sm:flex-col gap-1 items-center shrink-0">
                    <button
                      onClick={() => moveModule(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 rounded text-zinc-600 hover:text-zinc-300 disabled:opacity-20 transition-colors"
                      title="Subir"
                    >
                      <span className="sr-only">Subir</span>
                      <GripVertical size={16} />
                    </button>
                    <button
                      onClick={() => moveModule(idx, 1)}
                      disabled={idx === modules.length - 1}
                      className="p-1 rounded text-zinc-600 hover:text-zinc-300 disabled:opacity-20 transition-colors"
                      title="Bajar"
                    >
                      <span className="sr-only">Bajar</span>
                    </button>
                  </div>

                  {/* Icono */}
                  <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 shrink-0 self-start sm:self-center">
                    {getIconComponent(mod.icon)}
                  </div>

                  {/* Detalles */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-zinc-200 truncate">{mod.title}</h4>
                      <span className="text-[10px] text-zinc-500 font-mono select-all bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800/80">
                        {mod.url}
                      </span>
                      {mod.isFlashy && (
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-white ${flashyInfo.bg} shadow-md`}>
                          {mod.flashyText || 'NOVEDAD'}
                        </span>
                      )}
                      {mod.active === false && (
                        <span className="text-[9px] font-semibold bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full uppercase">
                          Oculto
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 font-light line-clamp-2">{mod.description}</p>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center justify-end gap-1.5 pt-2 sm:pt-0 border-t border-zinc-900 sm:border-0 shrink-0">
                    <button
                      onClick={() => toggleActive(mod.id)}
                      title={mod.active === false ? 'Habilitar / Mostrar' : 'Deshabilitar / Ocultar'}
                      className="p-2 rounded-lg text-zinc-600 hover:text-accent-400 hover:bg-zinc-900 transition-colors"
                    >
                      {mod.active === false ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      onClick={() => handleEditClick(mod)}
                      title="Editar"
                      className="p-2 rounded-lg text-zinc-600 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => removeModule(mod.id)}
                      title="Eliminar"
                      className="p-2 rounded-lg text-zinc-700 hover:text-red-400 hover:bg-zinc-900 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Botón de Guardado Global */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-accent-600 px-8 py-3 text-sm font-semibold text-white hover:bg-accent-500 disabled:opacity-40 transition-all cursor-pointer"
        >
          <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Módulos'}
        </button>
      </div>
    </div>
  );
}
