import { supabase } from '../config/supabaseClient';

/**
 * Registra un evento en la tabla user_logs para analytics internos.
 * No bloquea — fire-and-forget.
 * 
 * @param {string} event - Nombre del evento (ej: 'page_view', 'cta_click', 'contact_submit')
 * @param {Object} metadata - Datos adicionales del evento
 */
export function trackEvent(event, metadata = {}) {
  try {
    supabase
      .from('user_logs')
      .insert([{
        event,
        metadata,
        user_agent: navigator.userAgent,
        ip_hint: null, // Se puede obtener server-side si se necesita
      }])
      .then(({ error }) => {
        if (error) console.warn('[Analytics]', error.message);
      })
      .catch((err) => {
        console.warn('[Analytics] network error:', err);
      });
  } catch {
    // Silently fail — analytics should never break the app
  }
}

/**
 * Trackea una vista de página.
 */
export function trackPageView(path) {
  trackEvent('page_view', { path, referrer: document.referrer || null });
}

/**
 * Trackea un click en CTA.
 */
export function trackCTA(label, href) {
  trackEvent('cta_click', { label, href });
}
