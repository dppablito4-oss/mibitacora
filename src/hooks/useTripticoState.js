import { useState, useCallback } from 'react';

const uid = () => Math.random().toString(36).slice(2, 8);

const ELEMENT_DEFAULTS = {
  text:       { content: 'Nuevo texto', x: 10, y: 10, w: 25, h: 10, style: { fontSize: 24, color: '#000000', fontWeight: '400', textAlign: 'left' } },
  image:      { src: '', x: 10, y: 10, w: 25, h: 25, style: { opacity: 1, borderRadius: 0, objectFit: 'cover' } },
  comparison: { columns: [
                { title: 'Opción A', items: ['Ventaja 1'], color: '#22d3ee' },
                { title: 'Opción B', items: ['Ventaja 1'], color: '#a78bfa' },
              ], x: 5, y: 10, w: 25, h: 30, style: {} },
  bento:      { items: [
                { title: 'Feature 1', desc: 'Descripción', icon: '🚀', size: 'large' },
              ], x: 5, y: 5, w: 25, h: 30, style: {} },
};

export default function useTripticoState() {
  const [pages, setPages] = useState([
    {
      id: 'page-front', // Exterior (Contraportada, Espalda, Portada)
      bgImage: '',
      bgColor: '#ffffff',
      elements: [
        { id: uid(), type: 'text', content: 'PORTADA', x: 70, y: 10, w: 25, h: 10, style: { fontSize: 48, fontWeight: '900', color: '#000000', textAlign: 'center' } }
      ]
    },
    {
      id: 'page-back', // Interior (3 Bloques de contenido)
      bgImage: '',
      bgColor: '#ffffff',
      elements: [
        { id: uid(), type: 'text', content: 'CONTENIDO 1', x: 5, y: 10, w: 25, h: 10, style: { fontSize: 32, fontWeight: '900', color: '#000000', textAlign: 'center' } }
      ]
    }
  ]);
  
  const [activePageId, setActivePageId] = useState('page-front');
  const [selectedElId, setSelectedElId] = useState(null);
  const [rightTab, setRightTab] = useState('element');

  const activePage = pages.find(p => p.id === activePageId);
  const selectedEl = activePage?.elements?.find(e => e.id === selectedElId);

  const updateElement = useCallback((elId, changes) => {
    setPages(prev => prev.map(p =>
      p.id !== activePageId ? p : {
        ...p,
        elements: p.elements.map(e => e.id === elId ? { ...e, ...changes } : e),
      }
    ));
  }, [activePageId]);

  const deleteElement = useCallback((elId) => {
    setPages(prev => prev.map(p =>
      p.id !== activePageId ? p : { ...p, elements: p.elements.filter(e => e.id !== elId) }
    ));
    setSelectedElId(null);
  }, [activePageId]);

  const addElement = useCallback((type) => {
    const newEl = { id: uid(), type, ...ELEMENT_DEFAULTS[type] };
    setPages(prev => prev.map(p =>
      p.id !== activePageId ? p : { ...p, elements: [...p.elements, newEl] }
    ));
    setSelectedElId(newEl.id);
    setRightTab('element');
  }, [activePageId]);

  const duplicateElement = useCallback(() => {
    if (!selectedEl) return;
    const newEl = { ...JSON.parse(JSON.stringify(selectedEl)), id: uid(), x: selectedEl.x + 3, y: selectedEl.y + 3 };
    setPages(prev => prev.map(p =>
      p.id !== activePageId ? p : { ...p, elements: [...p.elements, newEl] }
    ));
    setSelectedElId(newEl.id);
  }, [selectedEl, activePageId]);

  const updatePage = useCallback((changes) => {
    setPages(prev => prev.map(p => p.id === activePageId ? { ...p, ...changes } : p));
  }, [activePageId]);

  const loadFromJson = useCallback((json) => {
    if (json.pages) {
      // Ensure all elements have unique IDs and correct properties
      const safePages = json.pages.map(page => ({
        ...page,
        id: page.id || `page-${uid()}`,
        elements: (page.elements || []).map(el => ({
          ...el,
          id: el.id || uid()
        }))
      }));
      setPages(safePages);
      setActivePageId(safePages[0]?.id || 'page-front');
      setSelectedElId(null);
    }
  }, []);

  return {
    pages,
    activePageId, setActivePageId,
    selectedElId, setSelectedElId,
    activePage, selectedEl,
    rightTab, setRightTab,
    updateElement, deleteElement, addElement, duplicateElement, updatePage,
    loadFromJson
  };
}
