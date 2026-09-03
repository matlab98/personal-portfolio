/**
 * Mapa único entre el segmento de URL y el tag de i18next.
 * Router, detector de idioma y selector del navbar leen de aquí.
 */
const LANGUAGES = [
  { route: 'en-us', tag: 'en-US', short: 'EN', labelKey: 'nav.languages.en' },
  { route: 'es-co', tag: 'es-CO', short: 'ES', labelKey: 'nav.languages.es' },
];

const DEFAULT_LANGUAGE = LANGUAGES[0];

/** `/EN-US` y `/en-us` son el mismo idioma; cualquier otra cosa cae al default. */
const findByRoute = (route) => {
  const normalized = typeof route === 'string' ? route.toLowerCase() : '';
  return LANGUAGES.find((language) => language.route === normalized) ?? DEFAULT_LANGUAGE;
};

const findByTag = (tag) => {
  const normalized = typeof tag === 'string' ? tag.toLowerCase() : '';
  return (
    LANGUAGES.find((language) => language.tag.toLowerCase() === normalized) ??
    LANGUAGES.find((language) => normalized.startsWith(language.tag.slice(0, 2))) ??
    DEFAULT_LANGUAGE
  );
};

/** Idioma sugerido por el navegador, siempre resuelto a una ruta soportada. */
const detectRoute = (navigatorLanguage) => findByTag(navigatorLanguage).route;

export { LANGUAGES, DEFAULT_LANGUAGE, findByRoute, findByTag, detectRoute };
