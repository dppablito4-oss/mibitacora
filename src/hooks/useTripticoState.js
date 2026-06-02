import { useState, useCallback, useEffect } from 'react';

const uid = () => Math.random().toString(36).slice(2, 8);

/**
 * Tríptico = 1 hoja A4 horizontal dividida en 3 columnas iguales.
 * Cada columna contiene un array de "bloques" que pueden ser:
 *   heading, subheading, paragraph, image, list, divider
 */

const BLOCK_DEFAULTS = {
  heading:    { type: 'heading',    text: 'Título', style: { fontSize: 22, color: '#000000', fontWeight: '700', textAlign: 'left' } },
  subheading: { type: 'subheading', text: 'Subtítulo', style: { fontSize: 16, color: '#1a1a1a', fontWeight: '600', textAlign: 'left' } },
  paragraph:  { type: 'paragraph',  text: 'Escribe tu contenido aquí...', style: { fontSize: 12, color: '#333333', textAlign: 'left', lineHeight: 1.5 } },
  image:      { type: 'image',      src: '', alt: '', style: { borderRadius: 4, objectFit: 'cover', height: 120 } },
  list:       { type: 'list',       items: ['Elemento 1', 'Elemento 2', 'Elemento 3'], style: { fontSize: 12, color: '#333333', marker: '•' } },
  divider:    { type: 'divider',    style: { color: '#cccccc', thickness: 1, marginY: 8 } },
};

function createDefaultPages() {
  return [
    {
      id: 'page-front',
      label: 'Exterior (Anverso)',
      bgColor: '#ffffff',
      bgImage: '',
      columns: [
        {
          id: uid(),
          label: 'Contraportada',
          bgColor: '',
          blocks: [
            { id: uid(), type: 'heading', text: 'Contacto', style: { fontSize: 20, color: '#000000', fontWeight: '700', textAlign: 'center' } },
            { id: uid(), type: 'divider', style: { color: '#22d3ee', thickness: 2, marginY: 8 } },
            { id: uid(), type: 'paragraph', text: 'Nombre de la institución\nDirección completa\nTeléfono: (xxx) xxx-xxxx\nCorreo: ejemplo@email.com', style: { fontSize: 11, color: '#555555', textAlign: 'center', lineHeight: 1.6 } },
          ],
        },
        {
          id: uid(),
          label: 'Dorso',
          bgColor: '',
          blocks: [
            { id: uid(), type: 'paragraph', text: '', style: { fontSize: 11, color: '#666666', textAlign: 'center', lineHeight: 1.5 } },
          ],
        },
        {
          id: uid(),
          label: 'Portada',
          bgColor: '',
          blocks: [
            { id: uid(), type: 'heading', text: 'TÍTULO DEL\nTRÍPTICO', style: { fontSize: 32, color: '#000000', fontWeight: '900', textAlign: 'center' } },
            { id: uid(), type: 'divider', style: { color: '#22d3ee', thickness: 3, marginY: 10 } },
            { id: uid(), type: 'paragraph', text: 'Subtítulo o descripción breve del tema que se aborda en este tríptico informativo.', style: { fontSize: 14, color: '#555555', textAlign: 'center', lineHeight: 1.5 } },
          ],
        },
      ],
    },
    {
      id: 'page-back',
      label: 'Interior (Reverso)',
      bgColor: '#ffffff',
      bgImage: '',
      columns: [
        {
          id: uid(),
          label: 'Panel 1',
          bgColor: '',
          blocks: [
            { id: uid(), type: 'heading', text: '¿Qué es?', style: { fontSize: 22, color: '#000000', fontWeight: '700', textAlign: 'left' } },
            { id: uid(), type: 'divider', style: { color: '#22d3ee', thickness: 2, marginY: 6 } },
            { id: uid(), type: 'paragraph', text: 'Aquí va la introducción o definición del tema. Explica de forma clara y concisa de qué se trata.', style: { fontSize: 12, color: '#333333', textAlign: 'left', lineHeight: 1.5 } },
            { id: uid(), type: 'subheading', text: 'Datos clave', style: { fontSize: 14, color: '#1a1a1a', fontWeight: '600', textAlign: 'left' } },
            { id: uid(), type: 'list', items: ['Dato importante 1', 'Dato importante 2', 'Dato importante 3'], style: { fontSize: 11, color: '#444444', marker: '•' } },
          ],
        },
        {
          id: uid(),
          label: 'Panel 2',
          bgColor: '',
          blocks: [
            { id: uid(), type: 'heading', text: 'Causas', style: { fontSize: 22, color: '#000000', fontWeight: '700', textAlign: 'left' } },
            { id: uid(), type: 'divider', style: { color: '#22d3ee', thickness: 2, marginY: 6 } },
            { id: uid(), type: 'paragraph', text: 'Desarrollo del tema con datos relevantes, causas y características principales.', style: { fontSize: 12, color: '#333333', textAlign: 'left', lineHeight: 1.5 } },
            { id: uid(), type: 'list', items: ['Causa principal 1', 'Causa principal 2', 'Causa principal 3'], style: { fontSize: 11, color: '#444444', marker: '→' } },
          ],
        },
        {
          id: uid(),
          label: 'Panel 3',
          bgColor: '',
          blocks: [
            { id: uid(), type: 'heading', text: 'Soluciones', style: { fontSize: 22, color: '#000000', fontWeight: '700', textAlign: 'left' } },
            { id: uid(), type: 'divider', style: { color: '#22d3ee', thickness: 2, marginY: 6 } },
            { id: uid(), type: 'paragraph', text: 'Conclusiones y propuestas de solución al problema planteado.', style: { fontSize: 12, color: '#333333', textAlign: 'left', lineHeight: 1.5 } },
            { id: uid(), type: 'subheading', text: '¿Qué podemos hacer?', style: { fontSize: 14, color: '#1a1a1a', fontWeight: '600', textAlign: 'left' } },
            { id: uid(), type: 'list', items: ['Acción 1', 'Acción 2', 'Acción 3'], style: { fontSize: 11, color: '#444444', marker: '✓' } },
          ],
        },
      ],
    },
  ];
}

export default function useTripticoState() {
  const [pages, setPages] = useState(() => {
    const saved = localStorage.getItem('triptico_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved triptico state", e);
      }
    }
    return createDefaultPages();
  });
  
  const [activePageId, setActivePageId] = useState('page-front');
  const [selectedColIndex, setSelectedColIndex] = useState(null);
  const [selectedBlockId, setSelectedBlockId] = useState(null);

  useEffect(() => {
    localStorage.setItem('triptico_state', JSON.stringify(pages));
  }, [pages]);

  const activePage = pages.find(p => p.id === activePageId);
  const selectedCol = selectedColIndex !== null ? activePage?.columns?.[selectedColIndex] : null;
  const selectedBlock = selectedCol?.blocks?.find(b => b.id === selectedBlockId) || null;

  // Update a specific block in a column
  const updateBlock = useCallback((colIndex, blockId, changes) => {
    setPages(prev => prev.map(p => {
      if (p.id !== activePageId) return p;
      const newCols = [...p.columns];
      newCols[colIndex] = {
        ...newCols[colIndex],
        blocks: newCols[colIndex].blocks.map(b =>
          b.id === blockId ? { ...b, ...changes } : b
        ),
      };
      return { ...p, columns: newCols };
    }));
  }, [activePageId]);

  // Update block style
  const updateBlockStyle = useCallback((colIndex, blockId, styleChanges) => {
    setPages(prev => prev.map(p => {
      if (p.id !== activePageId) return p;
      const newCols = [...p.columns];
      newCols[colIndex] = {
        ...newCols[colIndex],
        blocks: newCols[colIndex].blocks.map(b =>
          b.id === blockId ? { ...b, style: { ...b.style, ...styleChanges } } : b
        ),
      };
      return { ...p, columns: newCols };
    }));
  }, [activePageId]);

  // Add a block to the selected column
  const addBlock = useCallback((colIndex, type) => {
    const defaults = BLOCK_DEFAULTS[type];
    if (!defaults) return;
    const newBlock = { id: uid(), ...JSON.parse(JSON.stringify(defaults)) };
    setPages(prev => prev.map(p => {
      if (p.id !== activePageId) return p;
      const newCols = [...p.columns];
      newCols[colIndex] = {
        ...newCols[colIndex],
        blocks: [...newCols[colIndex].blocks, newBlock],
      };
      return { ...p, columns: newCols };
    }));
    setSelectedBlockId(newBlock.id);
  }, [activePageId]);

  // Delete a block
  const deleteBlock = useCallback((colIndex, blockId) => {
    setPages(prev => prev.map(p => {
      if (p.id !== activePageId) return p;
      const newCols = [...p.columns];
      newCols[colIndex] = {
        ...newCols[colIndex],
        blocks: newCols[colIndex].blocks.filter(b => b.id !== blockId),
      };
      return { ...p, columns: newCols };
    }));
    if (selectedBlockId === blockId) setSelectedBlockId(null);
  }, [activePageId, selectedBlockId]);

  // Move block up/down within column
  const moveBlock = useCallback((colIndex, blockId, direction) => {
    setPages(prev => prev.map(p => {
      if (p.id !== activePageId) return p;
      const newCols = [...p.columns];
      const blocks = [...newCols[colIndex].blocks];
      const idx = blocks.findIndex(b => b.id === blockId);
      if (idx < 0) return p;
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= blocks.length) return p;
      [blocks[idx], blocks[newIdx]] = [blocks[newIdx], blocks[idx]];
      newCols[colIndex] = { ...newCols[colIndex], blocks };
      return { ...p, columns: newCols };
    }));
  }, [activePageId]);

  // Update column-level properties (label, bgColor)
  const updateColumn = useCallback((colIndex, changes) => {
    setPages(prev => prev.map(p => {
      if (p.id !== activePageId) return p;
      const newCols = [...p.columns];
      newCols[colIndex] = { ...newCols[colIndex], ...changes };
      return { ...p, columns: newCols };
    }));
  }, [activePageId]);

  // Update page-level properties (bgColor, bgImage)
  const updatePage = useCallback((changes) => {
    setPages(prev => prev.map(p => p.id === activePageId ? { ...p, ...changes } : p));
  }, [activePageId]);

  // Load from AI-generated JSON
  const loadFromJson = useCallback((json) => {
    let targetJson = json || {};
    if (!targetJson.pages && targetJson.reply) {
      if (typeof targetJson.reply === 'object') {
        targetJson = targetJson.reply;
      } else if (typeof targetJson.reply === 'string') {
        try {
          targetJson = JSON.parse(targetJson.reply);
        } catch {
          // ignorar
        }
      }
    }

    if (targetJson.pages && Array.isArray(targetJson.pages)) {
      const safePages = targetJson.pages.map((page, pi) => ({
        id: page.id || (pi === 0 ? 'page-front' : 'page-back'),
        label: page.label || (pi === 0 ? 'Exterior (Anverso)' : 'Interior (Reverso)'),
        bgColor: page.bgColor || '#ffffff',
        bgImage: page.bgImage || '',
        columns: (page.columns || []).map(col => ({
          id: col.id || uid(),
          label: col.label || '',
          bgColor: col.bgColor || '',
          blocks: (col.blocks || []).map(b => ({
            id: b.id || uid(),
            type: b.type || 'paragraph',
            text: b.text || '',
            src: b.src || '',
            alt: b.alt || '',
            items: b.items || [],
            style: b.style || {},
          })),
        })),
      }));
      // Ensure each page has exactly 3 columns
      safePages.forEach(p => {
        while (p.columns.length < 3) {
          p.columns.push({ id: uid(), label: `Panel ${p.columns.length + 1}`, bgColor: '', blocks: [] });
        }
        if (p.columns.length > 3) p.columns = p.columns.slice(0, 3);
      });
      setPages(safePages);
      setActivePageId(safePages[0]?.id || 'page-front');
      setSelectedColIndex(null);
      setSelectedBlockId(null);
    }
  }, []);

  const resetToDefaults = useCallback(() => {
    setPages(createDefaultPages());
    setActivePageId('page-front');
    setSelectedColIndex(null);
    setSelectedBlockId(null);
  }, []);

  return {
    pages,
    activePageId, setActivePageId,
    activePage,
    selectedColIndex, setSelectedColIndex,
    selectedBlockId, setSelectedBlockId,
    selectedCol, selectedBlock,
    updateBlock, updateBlockStyle,
    addBlock, deleteBlock, moveBlock,
    updateColumn, updatePage,
    loadFromJson, resetToDefaults,
    BLOCK_DEFAULTS,
  };
}
