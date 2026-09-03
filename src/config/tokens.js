/**
 * Design system: única fuente de verdad.
 *
 * Cambiar el matiz de la marca = editar `brand.indigo` / `brand.violet` aquí.
 * Nada más en el repo debe declarar un hex, un radio o una sombra.
 *
 * Base cromática: indigo + violeta (`docs/DISENO-SLIDES.md` §3). Los pasos
 * oscuros de cada rampa existen para cumplir contraste AA sobre fondos claros;
 * los pasos claros para cumplirlo sobre fondos oscuros.
 */

/* ------------------------------------------------------------------ rampas */

const brand = {
  // Acento principal. 600 es el acento en claro, 300 en oscuro.
  indigo: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#2A1F5C',
    950: '#1B1740',
  },
  // Acento secundario: violeta de énfasis y cifras grandes.
  violet: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },
};

/** Sesgo violeta deliberado (~245°) para que los grises no se vean sucios. */
const neutral = {
  0: '#FFFFFF',
  50: '#F7F7FB',
  100: '#EEEEF5',
  200: '#E1E1EC',
  300: '#CBCBDC',
  400: '#9C9CB5',
  500: '#7C7C96',
  550: '#6B6B8E',
  600: '#52526A',
  700: '#35354A',
  750: '#2A2A42',
  800: '#22223A',
  850: '#1C1C34',
  900: '#131327',
  950: '#0B0B18',
};

/** Estados. Los tonos claros están oscurecidos para cumplir AA sobre blanco. */
const status = {
  light: {
    error: '#BE123C',
    warning: '#B45309',
    info: '#0E7490',
    success: '#15803D',
  },
  dark: {
    error: '#FB7185',
    warning: '#FBBF24',
    info: '#67E8F9',
    success: '#4ADE80',
  },
};

/* ----------------------------------------------------------------- paletas */

const palettes = {
  light: {
    mode: 'light',
    primary: {
      light: brand.indigo[500],
      main: brand.indigo[600],
      dark: brand.indigo[700],
      contrastText: neutral[0],
    },
    secondary: {
      light: brand.violet[600],
      main: brand.violet[700],
      dark: brand.violet[800],
      contrastText: neutral[0],
    },
    error: { main: status.light.error, contrastText: neutral[0] },
    warning: { main: status.light.warning, contrastText: neutral[0] },
    info: { main: status.light.info, contrastText: neutral[0] },
    success: { main: status.light.success, contrastText: neutral[0] },
    background: {
      default: neutral[50],
      paper: neutral[0],
    },
    text: {
      primary: neutral[800],
      secondary: neutral[600],
      disabled: neutral[500],
    },
    divider: neutral[200],
  },
  dark: {
    mode: 'dark',
    primary: {
      light: brand.indigo[200],
      main: brand.indigo[300],
      dark: brand.indigo[500],
      contrastText: neutral[950],
    },
    secondary: {
      light: brand.violet[200],
      main: brand.violet[300],
      dark: brand.violet[400],
      contrastText: neutral[950],
    },
    error: { main: status.dark.error, contrastText: neutral[950] },
    warning: { main: status.dark.warning, contrastText: neutral[950] },
    info: { main: status.dark.info, contrastText: neutral[950] },
    success: { main: status.dark.success, contrastText: neutral[950] },
    background: {
      default: neutral[950],
      paper: neutral[900],
    },
    text: {
      primary: neutral[100],
      secondary: neutral[400],
      disabled: neutral[550],
    },
    divider: neutral[750],
  },
};

/** Gris de la marquesina: fuera de la rampa, calibrado para AA decorativo. */
const marqueeInk = { light: '#6B6B84', dark: '#7A7A99' };

/**
 * Superficies extra que MUI no modela.
 *
 * `divider` es decorativo (no llega a 3:1 y está exento por WCAG 1.4.11).
 * `outlineStrong` es su gemelo funcional: todo borde que sea *la única* señal
 * de que algo es interactivo (input, chip filtro, punto del riel) usa este
 * token, nunca `divider`.
 */
const surfaces = {
  light: {
    subtle: neutral[100],
    raised: neutral[0],
    outlineStrong: neutral[500],
    marquee: marqueeInk.light,
    scrim: 'rgba(34, 34, 58, 0.55)',
    skeletonBase: neutral[200],
    skeletonHighlight: neutral[50],
    heroGradient: `linear-gradient(160deg, ${neutral[0]} 0%, ${brand.indigo[50]} 45%, ${brand.violet[100]} 100%)`,
    accentGradient: `linear-gradient(90deg, ${brand.indigo[600]} 0%, ${brand.violet[700]} 100%)`,
    glow: 'radial-gradient(60% 60% at 15% 8%, rgba(99, 102, 241, 0.18), transparent 70%)',
  },
  dark: {
    subtle: neutral[900],
    raised: neutral[850],
    outlineStrong: neutral[550],
    marquee: marqueeInk.dark,
    scrim: 'rgba(0, 0, 0, 0.65)',
    skeletonBase: neutral[850],
    skeletonHighlight: neutral[750],
    heroGradient: `linear-gradient(160deg, ${neutral[950]} 0%, ${neutral[900]} 45%, ${brand.indigo[900]} 100%)`,
    accentGradient: `linear-gradient(90deg, ${brand.indigo[300]} 0%, ${brand.violet[300]} 100%)`,
    glow: 'radial-gradient(60% 60% at 15% 8%, rgba(124, 58, 237, 0.28), transparent 70%)',
  },
};

const shadow = {
  light: {
    xs: '0 1px 2px rgba(34, 34, 58, 0.06)',
    sm: '0 2px 8px rgba(34, 34, 58, 0.08)',
    md: '0 8px 24px rgba(34, 34, 58, 0.10)',
    lg: '0 18px 40px rgba(34, 34, 58, 0.14)',
    focus: `0 0 0 3px ${brand.indigo[200]}`,
  },
  dark: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.4)',
    sm: '0 2px 8px rgba(0, 0, 0, 0.45)',
    md: '0 8px 24px rgba(0, 0, 0, 0.5)',
    lg: '0 18px 40px rgba(0, 0, 0, 0.55)',
    focus: `0 0 0 3px ${brand.indigo[800]}`,
  },
};

/* --------------------------------------------------------------- fundación */

/** Coinciden con los defaults de MUI: se declaran aquí para tener un solo mapa. */
const breakpoints = { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 };

const spacingUnit = 8;

const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

const fontFamily = '"Inter", "Roboto", "Helvetica", "Arial", sans-serif';

/**
 * Escala fluida: `clamp(mínimo móvil, preferido, máximo desktop)`.
 * Evita media queries por variante y elimina el texto que se sale en 320px.
 */
const typeScale = {
  display: { size: 'clamp(3rem, 1.5rem + 7.4vw, 7.5rem)', weight: 800, lineHeight: 0.92, letterSpacing: '-0.04em' },
  h1: { size: 'clamp(2.5rem, 1.45rem + 4.8vw, 5rem)', weight: 800, lineHeight: 1.02, letterSpacing: '-0.03em' },
  h2: { size: 'clamp(1.875rem, 1.3rem + 2.5vw, 3.25rem)', weight: 700, lineHeight: 1.10, letterSpacing: '-0.02em' },
  stat: { size: 'clamp(2rem, 1.2rem + 3.4vw, 3.5rem)', weight: 800, lineHeight: 1.00, letterSpacing: '-0.02em' },
  h3: { size: 'clamp(1.375rem, 1.18rem + 0.95vw, 1.875rem)', weight: 700, lineHeight: 1.24, letterSpacing: '-0.01em' },
  h4: { size: 'clamp(1.125rem, 1.02rem + 0.5vw, 1.5rem)', weight: 600, lineHeight: 1.3, letterSpacing: '-0.005em' },
  h5: { size: 'clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)', weight: 600, lineHeight: 1.35, letterSpacing: '0em' },
  h6: { size: 'clamp(1rem, 0.96rem + 0.2vw, 1.125rem)', weight: 600, lineHeight: 1.4, letterSpacing: '0em' },
  subtitle1: { size: 'clamp(1rem, 0.94rem + 0.4vw, 1.25rem)', weight: 400, lineHeight: 1.55, letterSpacing: '0em' },
  subtitle2: { size: '0.9375rem', weight: 600, lineHeight: 1.55, letterSpacing: '0em' },
  body1: { size: 'clamp(0.9375rem, 0.91rem + 0.15vw, 1.0625rem)', weight: 400, lineHeight: 1.65, letterSpacing: '0em' },
  body2: { size: '0.9375rem', weight: 400, lineHeight: 1.6, letterSpacing: '0em' },
  button: { size: '0.9375rem', weight: 600, lineHeight: 1.5, letterSpacing: '0.01em' },
  caption: { size: '0.8125rem', weight: 500, lineHeight: 1.5, letterSpacing: '0.02em' },
  overline: { size: '0.75rem', weight: 700, lineHeight: 1.6, letterSpacing: '0.14em' },
};

/** Un solo lenguaje de movimiento para framer-motion y transiciones CSS. */
const motion = {
  duration: { fast: 0.24, base: 0.45, slow: 0.7 },
  ease: [0.22, 1, 0.36, 1],
  cssEase: 'cubic-bezier(0.22, 1, 0.36, 1)',
};

/**
 * Medidas de layout compartidas entre scroll-spy, diapositivas y CSS colocado.
 * `slideMinHeight` usa `dvh` (nunca `vh`) — ver `docs/DISENO-SLIDES.md` §1.5.
 */
const layout = {
  headerHeight: 56,
  slideMinHeight: '100dvh',
  slidePaddingTop: { xs: 9, md: 10 },
  slidePaddingBottom: { xs: 6, md: 7 },
  slidePaddingX: { xs: 2.5, md: 4 },
  slideMaxWidth: 'lg',
  slideHeaderGap: { xs: 3, md: 4 },
  contentGap: { xs: 2.5, md: 4 },
  railWidth: 28,
  railOffset: { md: 20, lg: 32 },
  railDot: { idle: 6, active: 22 },
  carouselCard: { xs: 'min(78vw, 320px)', md: '360px' },
  carouselGap: { xs: 2, md: 3 },
  snapDisableMaxHeight: 640,
  /** Scroll-snap y 100dvh por diapositiva solo desde este breakpoint (px). */
  snapMinWidth: 900,
  readableMaxWidth: '62ch',
  leadMaxWidth: '46ch',
  touchTarget: 44,
  // Compatibilidad con secciones legacy hasta que desaparezcan por completo.
  containerMaxWidth: 'lg',
  sectionPaddingY: { xs: 7, md: 12 },
  heroPaddingY: { xs: 8, md: 14 },
};

const tokens = {
  brand,
  neutral,
  status,
  palettes,
  surfaces,
  shadow,
  breakpoints,
  spacingUnit,
  radius,
  fontFamily,
  typeScale,
  motion,
  layout,
};

export {
  brand,
  neutral,
  status,
  palettes,
  surfaces,
  shadow,
  breakpoints,
  spacingUnit,
  radius,
  fontFamily,
  typeScale,
  motion,
  layout,
};

export default tokens;
