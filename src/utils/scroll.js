/**
 * Navegación por anclas del home.
 *
 * Devuelve `false` cuando la sección no está en el DOM (el CMS no trajo ese
 * campo) para que quien llame pueda reaccionar en vez de fallar en silencio.
 */

/** Enlaces legacy → ancla actual (`statistics` se fusionó en `skills`). */
const ANCHOR_ALIASES = { statistics: 'skills' };

const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const resolveAnchor = (sectionId) => ANCHOR_ALIASES[sectionId] ?? sectionId;

/**
 * @param {string} sectionId
 * @returns {boolean} si encontró la sección
 */
export const scrollToSection = (sectionId) => {
  if (typeof document === 'undefined' || !sectionId) return false;

  const target = document.getElementById(resolveAnchor(sectionId));
  if (!target) return false;

  target.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  });
  return true;
};

export const scrollToTop = () => {
  if (typeof window === 'undefined') return;
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
};

export { ANCHOR_ALIASES, resolveAnchor };
