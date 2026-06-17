import { useContext } from 'react';
import { SiteConfigContext } from '../context/SiteConfigContextBase';

/**
 * Custom hook useSiteConfig.
 * Mantiene compatibilidad con todos los imports existentes:
 *   import { useSiteConfig } from '../lib/useSiteConfig'
 */
export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    throw new Error('useSiteConfig debe usarse dentro de <SiteConfigProvider>');
  }
  return ctx;
}
