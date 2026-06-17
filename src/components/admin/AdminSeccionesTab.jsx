import { useState, useEffect, useCallback } from 'react';
import { supabase, uploadServiceImage } from '../../config/supabaseClient';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Edit3, Save, RefreshCw, EyeOff, FolderGit, LayoutGrid, Image as ImageIcon } from 'lucide-react';
import ConfirmDialog from '../ConfirmDialog';

export default function AdminSeccionesTab({ onSaved }) {
  const { showToast } = useToast();
  const [subTab, setSubTab] = useState('proyectos'); // 'proyectos' o 'servicios'
  const [loading, setLoading] = useState(false);

  // Estados de Proyectos
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [pTitle, setPTitle] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pTags, setPTags] = useState('');
  const [pUrl, setPUrl] = useState('');
  const [pColor, setPColor] = useState('from-tesseract-500/20 to-blue-500/20');
  const [pAccent, setPAccent] = useState('#06b6d4');
  const [pOrder, setPOrder] = useState(0);
  const [pVisible, setPVisible] = useState(true);

  // Estados de Servicios
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [sTitle, setSTitle] = useState('');
  const [sDesc, setSDesc] = useState('');
  const [sOrder, setSOrder] = useState(0);
  const [sVisible, setSVisible] = useState(true);
  const [sImageUrl, setSImageUrl] = useState('');
  const [sAntesUrl, setSAntesUrl] = useState('');
  const [sDespuesUrl, setSDespuesUrl] = useState('');

  // Files and Previews de Servicios
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [antesFile, setAntesFile] = useState(null);
  const [antesPreview, setAntesPreview] = useState(null);
  const [despuesFile, setDespuesFile] = useState(null);
  const [despuesPreview, setDespuesPreview] = useState(null);

  // ConfirmDialog states
  const [deletingProjectId, setDeletingProjectId] = useState(null);
  const [deletingServiceId, setDeletingServiceId] = useState(null);

  // Cargar proyectos
  const loadProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('proyectos')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      showToast('Error cargando proyectos: ' + err.message, 'error');
    }
  }, [showToast]);

  // Cargar servicios
  const loadServices = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('servicios')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      showToast('Error cargando servicios: ' + err.message, 'error');
    }
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProjects();
    loadServices();
  }, [loadProjects, loadServices]);

  // Resetear formularios
  const resetProjectForm = () => {
    setEditingProject(null);
    setPTitle('');
    setPDesc('');
    setPTags('');
    setPUrl('');
    setPColor('from-tesseract-500/20 to-blue-500/20');
    setPAccent('#06b6d4');
    setPOrder(projects.length + 1);
    setPVisible(true);
  };

  const resetServiceForm = () => {
    setEditingService(null);
    setSTitle('');
    setSDesc('');
    setSOrder(services.length + 1);
    setSVisible(true);
    setSImageUrl('');
    setSAntesUrl('');
    setSDespuesUrl('');
    setImageFile(null);
    setImagePreview(null);
    setAntesFile(null);
    setAntesPreview(null);
    setDespuesFile(null);
    setDespuesPreview(null);
  };

  // Guardar Proyecto
  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!pTitle.trim() || !pDesc.trim()) return;
    setLoading(true);

    const tagsArray = pTags.split(',').map(t => t.trim()).filter(Boolean);
    const payload = {
      title: pTitle.trim(),
      description: pDesc.trim(),
      tags: tagsArray,
      url: pUrl.trim(),
      color: pColor,
      accent: pAccent,
      order_index: parseInt(pOrder) || 0,
      is_visible: pVisible
    };

    try {
      if (editingProject) {
        const { error } = await supabase
          .from('proyectos')
          .update(payload)
          .eq('id', editingProject.id);
        if (error) throw error;
        showToast('Proyecto actualizado', 'success');
      } else {
        const { error } = await supabase
          .from('proyectos')
          .insert([payload]);
        if (error) throw error;
        showToast('Proyecto creado', 'success');
      }
      resetProjectForm();
      await loadProjects();
      if (onSaved) await onSaved();
    } catch (err) {
      showToast('Error al guardar proyecto: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Guardar Servicio
  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!sTitle.trim() || !sDesc.trim()) return;
    setLoading(true);

    try {
      let finalImageUrl = sImageUrl;
      let finalAntesUrl = sAntesUrl;
      let finalDespuesUrl = sDespuesUrl;

      // Subir imágenes si existen nuevos archivos
      if (imageFile) {
        finalImageUrl = await uploadServiceImage(imageFile);
      }
      if (antesFile) {
        finalAntesUrl = await uploadServiceImage(antesFile);
      }
      if (despuesFile) {
        finalDespuesUrl = await uploadServiceImage(despuesFile);
      }

      const payload = {
        title: sTitle.trim(),
        description: sDesc.trim(),
        order_index: parseInt(sOrder) || 0,
        is_visible: sVisible,
        image_url: finalImageUrl || null,
        antes_image_url: finalAntesUrl || null,
        despues_image_url: finalDespuesUrl || null
      };

      if (editingService) {
        const { error } = await supabase
          .from('servicios')
          .update(payload)
          .eq('id', editingService.id);
        if (error) throw error;
        showToast('Servicio actualizado', 'success');
      } else {
        const { error } = await supabase
          .from('servicios')
          .insert([payload]);
        if (error) throw error;
        showToast('Servicio creado', 'success');
      }
      resetServiceForm();
      await loadServices();
      if (onSaved) await onSaved();
    } catch (err) {
      showToast('Error al guardar servicio: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar Proyecto
  const confirmDeleteProject = async () => {
    const id = deletingProjectId;
    setDeletingProjectId(null);
    try {
      const { error } = await supabase.from('proyectos').delete().eq('id', id);
      if (error) throw error;
      showToast('Proyecto eliminado', 'success');
      await loadProjects();
      if (onSaved) await onSaved();
    } catch (err) {
      showToast('Error al eliminar: ' + err.message, 'error');
    }
  };

  // Eliminar Servicio
  const confirmDeleteService = async () => {
    const id = deletingServiceId;
    setDeletingServiceId(null);
    try {
      const { error } = await supabase.from('servicios').delete().eq('id', id);
      if (error) throw error;
      showToast('Servicio eliminado', 'success');
      await loadServices();
      if (onSaved) await onSaved();
    } catch (err) {
      showToast('Error al eliminar: ' + err.message, 'error');
    }
  };

  const startEditProject = (proj) => {
    setEditingProject(proj);
    setPTitle(proj.title);
    setPDesc(proj.description);
    setPTags(proj.tags?.join(', ') || '');
    setPUrl(proj.url || '');
    setPColor(proj.color || 'from-tesseract-500/20 to-blue-500/20');
    setPAccent(proj.accent || '#06b6d4');
    setPOrder(proj.order_index);
    setPVisible(proj.is_visible);
  };

  const startEditService = (serv) => {
    setEditingService(serv);
    setSTitle(serv.title);
    setSDesc(serv.description);
    setSOrder(serv.order_index);
    setSVisible(serv.is_visible);
    setSImageUrl(serv.image_url || '');
    setSAntesUrl(serv.antes_image_url || '');
    setSDespuesUrl(serv.despues_image_url || '');
    // Resetear archivos cargados al editar uno nuevo
    setImageFile(null);
    setImagePreview(null);
    setAntesFile(null);
    setAntesPreview(null);
    setDespuesFile(null);
    setDespuesPreview(null);
  };

  const inputClass = "w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 px-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-accent-500/60 focus:outline-none focus:ring-1 focus:ring-accent-500/30 transition-all";

  return (
    <div className="space-y-6 animate-fade-in text-zinc-300">
      
      {/* Selector de Sub-pestañas */}
      <div className="flex border-b border-zinc-800/80 mb-6">
        <button
          onClick={() => setSubTab('proyectos')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
            subTab === 'proyectos'
              ? 'border-accent-500 text-accent-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FolderGit size={16} /> Proyectos
        </button>
        <button
          onClick={() => setSubTab('servicios')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
            subTab === 'servicios'
              ? 'border-accent-500 text-accent-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <LayoutGrid size={16} /> Servicios
        </button>
      </div>

      {subTab === 'proyectos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Formulario Proyecto */}
          <div className="lg:col-span-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Plus size={18} className="text-accent-400" />
              {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </h2>
            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Título del Proyecto</label>
                <input required value={pTitle} onChange={e => setPTitle(e.target.value)} placeholder="Ej. Pablito Expo" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Descripción</label>
                <textarea required value={pDesc} onChange={e => setPDesc(e.target.value)} rows={3} placeholder="Explica qué hace este proyecto..." className={`${inputClass} resize-none`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Tags (separados por coma)</label>
                  <input value={pTags} onChange={e => setPTags(e.target.value)} placeholder="React, Canvas, IA" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Enlace / URL</label>
                  <input value={pUrl} onChange={e => setPUrl(e.target.value)} placeholder="https://..." className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Color de Acento Hex</label>
                  <div className="flex gap-2">
                    <input type="color" value={pAccent} onChange={e => setPAccent(e.target.value)} className="w-10 h-10 rounded-lg border border-zinc-700 bg-transparent cursor-pointer" />
                    <input value={pAccent} onChange={e => setPAccent(e.target.value)} placeholder="#06b6d4" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Orden</label>
                  <input type="number" value={pOrder} onChange={e => setPOrder(e.target.value)} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Gradiente (Clases de Tailwind)</label>
                <input value={pColor} onChange={e => setPColor(e.target.value)} placeholder="from-tesseract-500/20 to-blue-500/20" className={inputClass} />
              </div>
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={pVisible} onChange={e => setPVisible(e.target.checked)} className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-accent-500" />
                  <span className="text-xs font-medium">Visible en la Web</span>
                </label>
                <div className="flex gap-2">
                  {editingProject && (
                    <button type="button" onClick={resetProjectForm} className="px-4 py-2 border border-zinc-800 rounded-xl text-xs hover:bg-zinc-800">
                       Cancelar
                    </button>
                  )}
                  <button type="submit" disabled={loading} className="flex items-center gap-1.5 px-4 py-2 bg-accent-600 hover:bg-accent-500 text-white rounded-xl text-xs font-semibold">
                    {loading ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
                    Guardar
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Listado Proyectos */}
          <div className="lg:col-span-7 space-y-3">
            <h2 className="text-lg font-bold text-zinc-100 font-mono text-xs uppercase tracking-wider">Proyectos Guardados</h2>
            <div className="space-y-3">
              {projects.length === 0 ? (
                <div className="text-sm text-zinc-600 text-center py-8 border border-dashed border-zinc-800 rounded-xl">No hay proyectos. Clic en "Nuevo Proyecto" para crear uno.</div>
              ) : (
                projects.map(proj => (
                  <div key={proj.id} className="flex items-center justify-between p-4 bg-zinc-900/20 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500 font-mono bg-zinc-950 px-2 py-0.5 rounded">Order: {proj.order_index}</span>
                        <h3 className="text-sm font-semibold text-zinc-100">{proj.title}</h3>
                        {!proj.is_visible && <span className="text-[9px] bg-red-950 text-red-400 px-1.5 py-0.5 rounded border border-red-900/50 flex items-center gap-1"><EyeOff size={8} /> Oculto</span>}
                      </div>
                      <p className="text-xs text-zinc-500 line-clamp-2 max-w-md">{proj.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-500">
                      <button onClick={() => startEditProject(proj)} className="p-2 text-zinc-400 hover:text-accent-400 hover:bg-zinc-800/50 rounded-lg"><Edit3 size={15} /></button>
                      <button onClick={() => setDeletingProjectId(proj.id)} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800/50 rounded-lg"><Trash2 size={15} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {subTab === 'servicios' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Formulario Servicio */}
          <div className="lg:col-span-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Plus size={18} className="text-accent-400" />
              {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h2>
            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Nombre del Servicio</label>
                <input required value={sTitle} onChange={e => setSTitle(e.target.value)} placeholder="Ej. Formateo APA 7ma" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Descripción</label>
                <textarea required value={sDesc} onChange={e => setSDesc(e.target.value)} rows={3} placeholder="Explica detalladamente en qué consiste este servicio..." className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Orden de Aparición</label>
                <input type="number" value={sOrder} onChange={e => setSOrder(e.target.value)} className={inputClass} />
              </div>

              {/* Imágenes del Servicio */}
              <div className="space-y-4 border-t border-zinc-800/80 pt-4">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-accent-400" /> Evidencia Visual (Opcional)
                </h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Sube una Imagen Principal, o sube imágenes de "Antes/Después" para generar una comparación interactiva con slider.
                </p>

                {/* Imagen Principal */}
                <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-3 space-y-2">
                  <span className="block text-[11px] font-medium text-zinc-300">Imagen Principal (Fija)</span>
                  <div className="flex items-center gap-3">
                    {(imagePreview || sImageUrl) && (
                      <img src={imagePreview || sImageUrl} alt="Preview Principal" className="w-12 h-12 object-cover rounded border border-zinc-800" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          setImageFile(file);
                          const reader = new FileReader();
                          reader.onload = ev => setImagePreview(ev.target.result);
                          reader.readAsDataURL(file);
                        }
                      }} 
                      className="text-[11px] text-zinc-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-zinc-800 file:text-zinc-200 file:cursor-pointer hover:file:bg-zinc-700" 
                    />
                    {(imagePreview || sImageUrl) && (
                      <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); setSImageUrl(''); }} className="text-[10px] text-red-400 hover:text-red-300 hover:underline">Eliminar</button>
                    )}
                  </div>
                </div>

                {/* Slider: Antes / Después */}
                <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-3 space-y-3">
                  <span className="block text-[11px] font-medium text-zinc-300 border-b border-zinc-800/60 pb-1">Slider Comparativo (Antes/Después)</span>
                  
                  {/* Antes */}
                  <div className="space-y-1">
                    <label className="block text-[10px] text-zinc-500">Imagen Antes (Borrador)</label>
                    <div className="flex items-center gap-3">
                      {(antesPreview || sAntesUrl) && (
                        <img src={antesPreview || sAntesUrl} alt="Preview Antes" className="w-10 h-10 object-cover rounded border border-zinc-800" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            setAntesFile(file);
                            const reader = new FileReader();
                            reader.onload = ev => setAntesPreview(ev.target.result);
                            reader.readAsDataURL(file);
                          }
                        }} 
                        className="text-[11px] text-zinc-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-zinc-800 file:text-zinc-200 file:cursor-pointer hover:file:bg-zinc-700" 
                      />
                      {(antesPreview || sAntesUrl) && (
                        <button type="button" onClick={() => { setAntesFile(null); setAntesPreview(null); setSAntesUrl(''); }} className="text-[10px] text-red-400 hover:text-red-300 hover:underline">Eliminar</button>
                      )}
                    </div>
                  </div>

                  {/* Después */}
                  <div className="space-y-1">
                    <label className="block text-[10px] text-zinc-500">Imagen Después (Corregido)</label>
                    <div className="flex items-center gap-3">
                      {(despuesPreview || sDespuesUrl) && (
                        <img src={despuesPreview || sDespuesUrl} alt="Preview Después" className="w-10 h-10 object-cover rounded border border-zinc-800" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            setDespuesFile(file);
                            const reader = new FileReader();
                            reader.onload = ev => setDespuesPreview(ev.target.result);
                            reader.readAsDataURL(file);
                          }
                        }} 
                        className="text-[11px] text-zinc-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-zinc-800 file:text-zinc-200 file:cursor-pointer hover:file:bg-zinc-700" 
                      />
                      {(despuesPreview || sDespuesUrl) && (
                        <button type="button" onClick={() => { setDespuesFile(null); setDespuesPreview(null); setSDespuesUrl(''); }} className="text-[10px] text-red-400 hover:text-red-300 hover:underline">Eliminar</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={sVisible} onChange={e => setSVisible(e.target.checked)} className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-accent-500" />
                  <span className="text-xs font-medium">Visible en la Web</span>
                </label>
                <div className="flex gap-2">
                  {editingService && (
                    <button type="button" onClick={resetServiceForm} className="px-4 py-2 border border-zinc-800 rounded-xl text-xs hover:bg-zinc-800">
                      Cancelar
                    </button>
                  )}
                  <button type="submit" disabled={loading} className="flex items-center gap-1.5 px-4 py-2 bg-accent-600 hover:bg-accent-500 text-white rounded-xl text-xs font-semibold">
                    {loading ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
                    Guardar
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Listado Servicios */}
          <div className="lg:col-span-7 space-y-3">
            <h2 className="text-lg font-bold text-zinc-100 font-mono text-xs uppercase tracking-wider">Servicios Guardados</h2>
            <div className="space-y-3">
              {services.length === 0 ? (
                <div className="text-sm text-zinc-600 text-center py-8 border border-dashed border-zinc-800 rounded-xl">No hay servicios. Clic en "Nuevo Servicio" para crear uno.</div>
              ) : (
                services.map(serv => (
                  <div key={serv.id} className="flex items-center justify-between p-4 bg-zinc-900/20 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500 font-mono bg-zinc-950 px-2 py-0.5 rounded">Order: {serv.order_index}</span>
                        <h3 className="text-sm font-semibold text-zinc-100">{serv.title}</h3>
                        {!serv.is_visible && <span className="text-[9px] bg-red-950 text-red-400 px-1.5 py-0.5 rounded border border-red-900/50 flex items-center gap-1"><EyeOff size={8} /> Oculto</span>}
                      </div>
                      <p className="text-xs text-zinc-500 line-clamp-2 max-w-md">{serv.description}</p>
                      
                      {/* Mostrar indicadores de imágenes subidas */}
                      <div className="flex gap-2.5 text-[9px] text-zinc-600 font-mono pt-1">
                        {serv.image_url && <span className="text-emerald-500">✓ Imagen Principal</span>}
                        {serv.antes_image_url && serv.despues_image_url && <span className="text-violet-500">✓ Slider Comparativo</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-500">
                      <button onClick={() => startEditService(serv)} className="p-2 text-zinc-400 hover:text-accent-400 hover:bg-zinc-800/50 rounded-lg"><Edit3 size={15} /></button>
                      <button onClick={() => setDeletingServiceId(serv.id)} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800/50 rounded-lg"><Trash2 size={15} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmación para Eliminar Proyecto */}
      {deletingProjectId && (
        <ConfirmDialog
          title="¿Eliminar este proyecto?"
          message="Esta acción no se puede deshacer. Se borrará permanentemente de la base de datos."
          confirmLabel="Eliminar"
          onConfirm={confirmDeleteProject}
          onCancel={() => setDeletingProjectId(null)}
        />
      )}

      {/* Confirmación para Eliminar Servicio */}
      {deletingServiceId && (
        <ConfirmDialog
          title="¿Eliminar este servicio?"
          message="Esta acción no se puede deshacer. Se borrará permanentemente de la base de datos."
          confirmLabel="Eliminar"
          onConfirm={confirmDeleteService}
          onCancel={() => setDeletingServiceId(null)}
        />
      )}

    </div>
  );
}
