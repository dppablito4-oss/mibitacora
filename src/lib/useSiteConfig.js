/**
 * Re-exporta useSiteConfig desde el Context centralizado.
 * Mantiene compatibilidad con todos los imports existentes:
 *   import { useSiteConfig } from '../lib/useSiteConfig'
 */
export { useSiteConfig } from '../context/SiteConfigContext';
