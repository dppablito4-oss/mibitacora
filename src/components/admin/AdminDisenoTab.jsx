import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { updateSiteConfig } from '../../config/supabaseClient';
import { ArrowUp, ArrowDown, Eye, EyeOff, Save, Palette, RefreshCw } from 'lucide-react';

const PRESET_THEMES = [
  {
    name: 'Tesseract Cyan (Defecto)',
    mode: 'dark',
    bg_color: '#030712',
    card_color: '#0a0f25',
    accent_color: '#06b6d4',
  },
  {
    name: 'Obsidian Crimson (Táctico)',
    mode: 'dark',
    bg_color: '#090505',
    card_color: '#150a0a',
    accent_color: '#ef4444',
  },
  {
    name: 'Cyber Amber (Retro-Future)',
    mode: 'dark',
    bg_color: '#0a0903',
    card_color: '#161407',
    accent_color: '#f59e0b',
  },
  {
    name: 'Mint Emerald (Limpio)',
    mode: 'dark',
    bg_color: '#020904',
    card_color: '#051308',
    accent_color: '#10b981',
  },
  {
    name: 'Royal Pastel (Modo Claro)',
    mode: 'light',
    bg_color: '#f8fafc',
    card_color: '#ffffff',
    accent_color: '#4f46e5',
  }
];

const SECTION_LABELS = {
  expediente: 'Expediente Clasificado (Perfil y Hobbies)',
  modules: 'Módulos (Mini-apps: Escáner, QRs, Math, etc.)',
  arsenal: 'Arsenal Tecnológico (Habilidades/Skills)',
  proyectos: 'Operaciones Base (Proyectos)',
  servicios: 'Servicios',
  contacto: 'Contacto'
};

export default function AdminDisenoTab({ config, onSaved }) {
  const { showToast } = useToast();
  
  // Inicializar estados
  const [sectionOrder, setSectionOrder] = useState(() => {
    return config?.section_order || ['expediente', 'modules', 'arsenal', 'proyectos', 'servicios', 'contacto'];
  });
  
  // Mapeo de secciones activas/visibles
  // Si no está en el orden, está oculta
  const [visibleSections, setVisibleSections] = useState(() => {
    const defaultVisible = {
      expediente: true,
      modules: true,
      arsenal: true,
      proyectos: true,
      servicios: true,
      contacto: true
    };
    if (config?.section_order) {
      Object.keys(defaultVisible).forEach(key => {
        defaultVisible[key] = config.section_order.includes(key);
      });
    }
    return defaultVisible;
  });

  const [themeMode, setThemeMode] = useState(config?.theme?.mode || 'dark');
  const [bgColor, setBgColor] = useState(config?.theme?.bg_color || '#030712');
  const [cardColor, setCardColor] = useState(config?.theme?.card_color || '#0a0f25');
  const [accentColor, setAccentColor] = useState(config?.theme?.accent_color || '#06b6d4');
  const [particlesEnabled, setParticlesEnabled] = useState(config?.theme?.particles !== false);
  const [cursorType, setCursorType] = useState(config?.theme?.cursor_type || 'arc');
  const [soundEnabled, setSoundEnabled] = useState(config?.theme?.sound_enabled !== false);
  const [saving, setSaving] = useState(false);

  // Mover sección arriba
  const moveUp = (index) => {
    if (index === 0) return;
    const newOrder = [...sectionOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[index - 1];
    newOrder[index - 1] = temp;
    setSectionOrder(newOrder);
  };

  // Mover sección abajo
  const moveDown = (index) => {
    if (index === sectionOrder.length - 1) return;
    const newOrder = [...sectionOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[index + 1];
    newOrder[index + 1] = temp;
    setSectionOrder(newOrder);
  };

  // Alternar visibilidad de la sección
  const toggleVisibility = (sectionId) => {
    setVisibleSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Aplicar tema de preset
  const applyPreset = (preset) => {
    setThemeMode(preset.mode);
    setBgColor(preset.bg_color);
    setCardColor(preset.card_color);
    setAccentColor(preset.accent_color);
    if (preset.cursor_type) setCursorType(preset.cursor_type);
    showToast(`Preset "${preset.name}" seleccionado`, 'info');
  };

  // Guardar configuración completa de diseño
  const handleSaveDesign = async () => {
    setSaving(true);
    try {
      const finalSectionOrder = sectionOrder.filter(id => visibleSections[id]);
      
      const themePayload = {
        mode: themeMode,
        bg_color: bgColor,
        card_color: cardColor,
        accent_color: accentColor,
        particles: particlesEnabled,
        cursor_type: cursorType,
        sound_enabled: soundEnabled
      };

      await updateSiteConfig({
        section_order: finalSectionOrder,
        theme: themePayload
      });

      showToast('Configuración de diseño guardada con éxito', 'success');
      if (onSaved) await onSaved();
    } catch (err) {
      showToast('Error al guardar diseño: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-zinc-300">
      
      {/* ── SECCIÓN: ORDEN DE LA PÁGINA ── */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <span>🔀</span> Orden y Visibilidad de Secciones
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Modifica el orden de aparición de los módulos en tu página de inicio utilizando las flechas, u ocúltalos del menú principal.
          </p>
        </div>

        <div className="space-y-3 max-w-2xl">
          {sectionOrder.map((sectionId, index) => {
            const isVisible = visibleSections[sectionId];
            return (
              <div 
                key={sectionId} 
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isVisible 
                    ? 'border-zinc-800 bg-zinc-950/60' 
                    : 'border-zinc-800/40 bg-zinc-950/20 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-zinc-600 bg-zinc-900 px-2.5 py-1 rounded-md">
                    #{index + 1}
                  </span>
                  <span className={`text-sm font-semibold ${isVisible ? 'text-zinc-200' : 'text-zinc-500 line-through'}`}>
                    {SECTION_LABELS[sectionId] || sectionId}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleVisibility(sectionId)}
                    title={isVisible ? 'Ocultar Sección' : 'Mostrar Sección'}
                    className={`p-2 rounded-lg border transition-colors ${
                      isVisible 
                        ? 'border-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-zinc-900' 
                        : 'border-zinc-800/50 text-zinc-600 hover:text-emerald-400 hover:bg-zinc-900'
                    }`}
                  >
                    {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button 
                    onClick={() => moveUp(index)} 
                    disabled={index === 0}
                    className="p-2 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 disabled:opacity-20 disabled:hover:bg-transparent"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button 
                    onClick={() => moveDown(index)} 
                    disabled={index === sectionOrder.length - 1}
                    className="p-2 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 disabled:opacity-20 disabled:hover:bg-transparent"
                  >
                    <ArrowDown size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECCIÓN: TEMA DE COLORES ── */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Palette size={20} className="text-accent-400" />
            Personalización de Colores y Estilo
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Ajusta los colores principales de tu sitio. Los cambios se aplicarán dinámicamente usando variables CSS.
          </p>
        </div>

        {/* Presets */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Presets Temáticos</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {PRESET_THEMES.map(preset => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="flex flex-col text-left p-3 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-accent-500/50 hover:bg-zinc-900/30 transition-all group"
              >
                <span className="text-xs font-semibold text-zinc-200 group-hover:text-accent-400 transition-colors mb-2">
                  {preset.name}
                </span>
                <div className="flex gap-1.5 mt-auto">
                  <span className="w-4 h-4 rounded-full border border-zinc-800" style={{ backgroundColor: preset.bg_color }} title="Fondo" />
                  <span className="w-4 h-4 rounded-full border border-zinc-800" style={{ backgroundColor: preset.card_color }} title="Tarjeta" />
                  <span className="w-4 h-4 rounded-full border border-zinc-800" style={{ backgroundColor: preset.accent_color }} title="Acento" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Color Customization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-zinc-800/60">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Color de Fondo (Oscuro/Claro)</label>
            <div className="flex items-center gap-3">
              <input 
                type="color" 
                value={bgColor} 
                onChange={e => setBgColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-zinc-700 bg-transparent cursor-pointer"
              />
              <input 
                type="text" 
                value={bgColor} 
                onChange={e => setBgColor(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-300 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Color de Tarjetas</label>
            <div className="flex items-center gap-3">
              <input 
                type="color" 
                value={cardColor} 
                onChange={e => setCardColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-zinc-700 bg-transparent cursor-pointer"
              />
              <input 
                type="text" 
                value={cardColor} 
                onChange={e => setCardColor(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-300 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Color de Acento (Neon)</label>
            <div className="flex items-center gap-3">
              <input 
                type="color" 
                value={accentColor} 
                onChange={e => setAccentColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-zinc-700 bg-transparent cursor-pointer"
              />
              <input 
                type="text" 
                value={accentColor} 
                onChange={e => setAccentColor(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-300 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Toggles y Personalizaciones Adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-800/60">
          <div className="space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Efectos Especiales</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={themeMode === 'light'} 
                  onChange={e => setThemeMode(e.target.checked ? 'light' : 'dark')}
                  className="w-4.5 h-4.5 rounded border-zinc-800 bg-zinc-950 text-accent-500 focus:ring-0"
                />
                <span className="text-sm font-medium">Activar Modo Claro</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={particlesEnabled} 
                  onChange={e => setParticlesEnabled(e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-zinc-800 bg-zinc-950 text-accent-500 focus:ring-0"
                />
                <span className="text-sm font-medium">Fondo de Estrellas Interactivas (Canvas)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={soundEnabled} 
                  onChange={e => setSoundEnabled(e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-zinc-800 bg-zinc-950 text-accent-500 focus:ring-0"
                />
                <span className="text-sm font-medium">Sonidos de Interfaz (Marvel/S.H.I.E.L.D.)</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Cursor de la Web (Estilo Marvel)</label>
            <select 
              value={cursorType} 
              onChange={e => setCursorType(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 px-4 text-sm text-zinc-200 focus:border-accent-500/60 focus:outline-none focus:ring-1 focus:ring-accent-500/30 transition-all"
            >
              <option value="none">Cursor por Defecto (Sistema)</option>
              <option value="arc">Reactor Arc (Iron Man)</option>
              <option value="shield">Retícula HUD (S.H.I.E.L.D.)</option>
              <option value="mjolnir">Mjolnir (Thor's Hammer)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Guardar cambios */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSaveDesign}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-accent-600 hover:bg-accent-500 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition duration-200 border border-accent-500 shadow-lg shadow-accent-500/10 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
          {saving ? 'Guardando...' : 'Guardar Configuración de Diseño'}
        </button>
      </div>

    </div>
  );
}
