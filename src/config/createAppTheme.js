import { createTheme } from '@mui/material/styles';

import tokens, {
  breakpoints,
  fontFamily,
  layout,
  motion,
  palettes,
  radius,
  shadow,
  spacingUnit,
  surfaces,
  typeScale,
} from './tokens';

/** Scroll-snap solo en desktop (≥ md). Móvil/tableta: scroll continuo del documento. */
const slideDocumentStyles = {
  scrollBehavior: 'smooth',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
  [`@media (min-width:${breakpoints.md}px)`]: {
    scrollSnapType: 'y mandatory',
  },
  [`@media (prefers-reduced-motion: reduce)`]: {
    scrollSnapType: 'none',
    scrollBehavior: 'auto',
  },
  [`@media (max-height: ${layout.snapDisableMaxHeight}px)`]: {
    scrollSnapType: 'none',
  },
};

/**
 * Desktop: cada diapositiva ocupa 100dvh y ancla el snap.
 * Móvil/tableta: altura natural, sin snap ni 100dvh forzado.
 */
const slideSectionStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: 'auto',
  paddingBlock: `${spacingUnit * 6}px`,
  [`@media (min-width:${breakpoints.md}px)`]: {
    minHeight: layout.slideMinHeight,
    scrollSnapAlign: 'start',
    scrollSnapStop: 'normal',
    paddingBlock: 0,
  },
  [`@media (max-height: ${layout.snapDisableMaxHeight}px)`]: {
    minHeight: 'auto',
    paddingBlock: `${spacingUnit * 6}px`,
  },
};

const toTypography = ({ size, weight, lineHeight, letterSpacing }) => ({
  fontSize: size,
  fontWeight: weight,
  lineHeight,
  letterSpacing,
});

/** MUI exige 25 niveles; los derivamos de las 4 sombras del design system. */
const buildShadows = (mode) => {
  const s = shadow[mode];
  return Array.from({ length: 25 }, (_, level) => {
    if (level === 0) return 'none';
    if (level <= 1) return s.xs;
    if (level <= 3) return s.sm;
    if (level <= 8) return s.md;
    return s.lg;
  });
};

/**
 * Construye el tema MUI a partir de `tokens`. No declara ni un hex propio:
 * si algo se ve mal de color, el archivo a tocar es `tokens.js`.
 */
const createAppTheme = (mode = 'light') => {
  const palette = palettes[mode] ?? palettes.light;
  const surface = surfaces[mode] ?? surfaces.light;
  const elevation = shadow[mode] ?? shadow.light;

  const appBarSurface = {
    backgroundColor: palette.background.paper,
    color: palette.text.primary,
    borderBottom: `1px solid ${palette.divider}`,
    backgroundImage: 'none',
  };

  return createTheme({
    breakpoints: { values: breakpoints },
    spacing: spacingUnit,
    shape: { borderRadius: radius.md },
    shadows: buildShadows(mode in shadow ? mode : 'light'),
    palette,

    // Namespace propio: lo que MUI no modela (radios semánticos, degradados,
    // altura del header) vive aquí y no como literal en los componentes.
    tokens: { ...tokens, surface, elevation },

    typography: {
      fontFamily,
      h1: toTypography(typeScale.h1),
      h2: toTypography(typeScale.h2),
      display: toTypography(typeScale.display),
      stat: { ...toTypography(typeScale.stat), fontVariantNumeric: 'tabular-nums' },
      h3: toTypography(typeScale.h3),
      h4: toTypography(typeScale.h4),
      h5: toTypography(typeScale.h5),
      h6: toTypography(typeScale.h6),
      subtitle1: toTypography(typeScale.subtitle1),
      subtitle2: toTypography(typeScale.subtitle2),
      body1: toTypography(typeScale.body1),
      body2: toTypography(typeScale.body2),
      caption: toTypography(typeScale.caption),
      overline: { ...toTypography(typeScale.overline), textTransform: 'uppercase' },
      button: { ...toTypography(typeScale.button), textTransform: 'none' },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            WebkitFontSmoothing: 'antialiased',
            scrollBehavior: 'smooth',
            scrollPaddingTop: layout.headerHeight + spacingUnit * 2,
            ...slideDocumentStyles,
          },
          body: {
            backgroundColor: palette.background.default,
            color: palette.text.primary,
            overflowX: 'hidden',
          },
          '.slide': {
            ...slideSectionStyles,
            scrollMarginTop: `${layout.headerHeight + spacingUnit}px`,
          },
          /**
           * fit="scroll": cabecera fija + región interna scrolleable.
           * fit="contain": todo el contenido debe caber; sin overflow interno.
           */
          '.slide--scroll': {
            justifyContent: 'flex-start',
            paddingTop: `${layout.slidePaddingTop.xs * spacingUnit}px`,
            paddingBottom: `${layout.slidePaddingBottom.xs * spacingUnit}px`,
            [`@media (min-width:${breakpoints.md}px)`]: {
              paddingTop: `${layout.slidePaddingTop.md * spacingUnit}px`,
              paddingBottom: `${layout.slidePaddingBottom.md * spacingUnit}px`,
            },
          },
          '.slide--scroll .slide__body': {
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overscrollBehaviorY: 'contain',
            [`@media (max-width:${breakpoints.md - 1}px)`]: {
              flex: 'none',
              minHeight: 'auto',
              overflowY: 'visible',
            },
          },
          '.slide--contain .MuiContainer-root': {
            [`@media (min-width:${breakpoints.md}px)`]: {
              flex: 1,
              minHeight: 0,
            },
          },
          '.slide--contain': {
            paddingTop: `${layout.slidePaddingTop.xs * spacingUnit}px`,
            paddingBottom: `${layout.slidePaddingBottom.xs * spacingUnit}px`,
            [`@media (min-width:${breakpoints.md}px)`]: {
              paddingTop: `${layout.slidePaddingTop.md * spacingUnit}px`,
              paddingBottom: `${layout.slidePaddingBottom.md * spacingUnit}px`,
            },
          },
          'img, svg, video': { maxWidth: '100%' },
          img: { height: 'auto' },
          '#root': { minHeight: '100dvh' },
          ':focus-visible': {
            outline: `3px solid ${palette.primary.main}`,
            outlineOffset: 2,
            borderRadius: radius.xs,
          },
          '@media (prefers-reduced-motion: reduce)': {
            html: { scrollBehavior: 'auto', scrollSnapType: 'none' },
            '*, *::before, *::after': {
              animationDuration: '0.01ms !important',
              animationIterationCount: '1 !important',
              transitionDuration: '0.01ms !important',
            },
          },
        },
      },

      MuiContainer: {
        styleOverrides: {
          root: {
            paddingLeft: spacingUnit * 2,
            paddingRight: spacingUnit * 2,
            [`@media (min-width:${breakpoints.sm}px)`]: {
              paddingLeft: spacingUnit * 3,
              paddingRight: spacingUnit * 3,
            },
          },
        },
      },

      MuiAppBar: {
        defaultProps: { elevation: 0, color: 'default' },
        styleOverrides: {
          root: appBarSurface,
          // `color="default"` trae su propio gris; se pisa aquí o el navbar
          // deja de seguir la paleta.
          colorDefault: appBarSurface,
        },
      },

      MuiToolbar: {
        styleOverrides: {
          root: { minHeight: layout.headerHeight },
        },
      },

      MuiPaper: {
        styleOverrides: {
          rounded: { borderRadius: radius.lg },
        },
      },

      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: radius.lg,
            border: `1px solid ${palette.divider}`,
            backgroundColor: palette.background.paper,
            backgroundImage: 'none',
            boxShadow: elevation.xs,
            transition: `box-shadow 220ms ${motion.cssEase}, border-color 220ms ${motion.cssEase}`,
          },
        },
      },

      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: radius.pill,
            minHeight: layout.touchTarget,
            paddingInline: spacingUnit * 2.5,
          },
          sizeSmall: { minHeight: 36, paddingInline: spacingUnit * 1.75 },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: { borderRadius: radius.pill },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: { borderRadius: radius.pill, fontWeight: 600 },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: { borderRadius: radius.md, backgroundColor: surface.raised },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: radius.lg },
        },
      },

      MuiLink: {
        defaultProps: { underline: 'hover' },
        styleOverrides: {
          root: { fontWeight: 600 },
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: { borderRadius: radius.md, minHeight: layout.touchTarget },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: { borderRadius: radius.sm, fontSize: typeScale.caption.size },
        },
      },
    },
  });
};

export default createAppTheme;
