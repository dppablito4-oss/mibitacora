export const getColDisplayLabel = (isFront, colIdx, customLabel) => {
  const cleanLabel = customLabel ? String(customLabel).trim() : '';
  const defaultsFront = ['Contraportada', 'Dorso', 'Portada'];
  const defaultsBack = ['Panel 1', 'Panel 2', 'Panel 3', 'Introducción', 'Desarrollo', 'Soluciones', 'Conclusión'];
  
  const isDefault = !cleanLabel || 
                    defaultsFront.includes(cleanLabel) || 
                    defaultsBack.includes(cleanLabel);
                    
  if (isFront) {
    if (colIdx === 0) return isDefault ? 'Bloque 5 (Contraportada)' : `Bloque 5 (${cleanLabel})`;
    if (colIdx === 1) return isDefault ? 'Bloque 6 (Dorso / Anexos)' : `Bloque 6 (${cleanLabel})`;
    if (colIdx === 2) return isDefault ? 'Bloque 1 (Portada)' : `Bloque 1 (${cleanLabel})`;
  } else {
    if (colIdx === 0) return isDefault ? 'Bloque 2 (Presentación)' : `Bloque 2 (${cleanLabel})`;
    if (colIdx === 1) return isDefault ? 'Bloque 3 (Desarrollo)' : `Bloque 3 (${cleanLabel})`;
    if (colIdx === 2) return isDefault ? 'Bloque 4 (Desarrollo / Conclusión)' : `Bloque 4 (${cleanLabel})`;
  }
  return cleanLabel;
};
