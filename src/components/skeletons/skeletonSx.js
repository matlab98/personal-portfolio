/** Estilos compartidos de placeholders alineados con tokens de superficie. */
export const skeletonSx = (theme) => ({
  bgcolor: theme.tokens.surface.skeletonBase,
  '&::after': {
    background: `linear-gradient(90deg, transparent, ${theme.tokens.surface.skeletonHighlight}, transparent)`,
  },
});

export const BAR_WIDTHS = [72, 58, 88, 45, 63, 51, 77, 40, 68, 55, 82, 47, 61, 74, 53, 69, 44, 80, 57, 66];
