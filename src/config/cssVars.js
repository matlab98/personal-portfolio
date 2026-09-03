/**
 * Proyecta el tema activo a custom properties CSS bajo `:root`.
 *
 * Se hace a mano (en vez de `createTheme({ cssVariables: true })`) porque el
 * portafolio intercambia dos objetos de tema completos al alternar claro/oscuro;
 * emitir nosotros el bloque `:root` garantiza que las variables cambien en el
 * mismo render que la paleta de MUI.
 */
const toCssVariables = (theme) => {
  const { palette, tokens } = theme;
  const { surface, elevation, radius, layout, motion } = tokens;

  const slidePaddingX = `${layout.slidePaddingX.xs * tokens.spacingUnit}px`;

  return {
    ':root': {
      '--app-color-primary': palette.primary.main,
      '--app-color-primary-contrast': palette.primary.contrastText,
      '--app-color-secondary': palette.secondary.main,
      '--app-color-bg': palette.background.default,
      '--app-color-surface': palette.background.paper,
      '--app-color-surface-subtle': surface.subtle,
      '--app-color-text': palette.text.primary,
      '--app-color-text-muted': palette.text.secondary,
      '--app-color-border': palette.divider,
      // Borde funcional: úsalo cuando el borde es la única señal de que algo
      // es interactivo. `--app-color-border` es decorativo y no llega a 3:1.
      '--app-color-outline-strong': surface.outlineStrong,
      '--app-color-error': palette.error.main,
      '--app-color-success': palette.success.main,

      '--app-radius-sm': `${radius.sm}px`,
      '--app-radius-md': `${radius.md}px`,
      '--app-radius-lg': `${radius.lg}px`,
      '--app-radius-pill': `${radius.pill}px`,

      '--app-shadow-sm': elevation.sm,
      '--app-shadow-md': elevation.md,
      '--app-shadow-lg': elevation.lg,

      '--app-header-height': `${layout.headerHeight}px`,
      '--app-slide-height': layout.slideMinHeight,
      '--app-rail-width': `${layout.railWidth}px`,
      '--app-carousel-card': layout.carouselCard.xs,
      '--app-carousel-gap': `${layout.carouselGap.xs * tokens.spacingUnit}px`,
      '--app-slide-padding-x': slidePaddingX,
      '--app-ease': motion.cssEase,

      colorScheme: palette.mode,
      [`@media (min-width: ${tokens.breakpoints.md}px)`]: {
        '--app-carousel-card': layout.carouselCard.md,
        '--app-carousel-gap': `${layout.carouselGap.md * tokens.spacingUnit}px`,
        '--app-slide-padding-x': `${layout.slidePaddingX.md * tokens.spacingUnit}px`,
      },
    },
  };
};

export default toCssVariables;
