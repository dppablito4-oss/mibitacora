import { useEffect, useRef, useState } from 'react';

/**
 * Hook para detectar si un elemento está visible en el viewport.
 * Aplica animaciones de entrada con Intersection Observer.
 * 
 * @param {Object} options
 * @param {number} options.threshold - % del elemento visible para activar (0-1)
 * @param {string} options.rootMargin - Margen del viewport
 * @param {boolean} options.once - Si true, solo anima una vez
 * @returns {{ ref, isVisible }}
 */
export function useScrollAnimation({ threshold = 0.15, rootMargin = '0px 0px -50px 0px', once = true } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}

/**
 * CSS class helper para animaciones scroll.
 * Retorna classes de Tailwind para opacity + transform.
 */
export function scrollAnimClass(isVisible, variant = 'up') {
  const base = 'transition-all duration-700 ease-out';
  if (isVisible) return `${base} opacity-100 translate-y-0 translate-x-0 scale-100 blur-0`;
  
  switch (variant) {
    case 'up':
      return `${base} opacity-0 translate-y-8`;
    case 'down':
      return `${base} opacity-0 -translate-y-8`;
    case 'left':
      return `${base} opacity-0 translate-x-8`;
    case 'right':
      return `${base} opacity-0 -translate-x-8`;
    case 'scale':
      return `${base} opacity-0 scale-95`;
    case 'blur':
      return `${base} opacity-0 blur-sm translate-y-4`;
    default:
      return `${base} opacity-0 translate-y-8`;
  }
}
