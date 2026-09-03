import Box from '@mui/material/Box';

/**
 * Envoltura del `<main>` con las diapositivas.
 *
 * El scroll-snap vive en `html` solo en desktop (≥ md) — ver `createAppTheme.js`.
 * Móvil/tableta: scroll continuo del documento, sin 100dvh por sección.
 */
const SlideViewport = ({ children, id = 'main-content' }) => (
  <Box component="main" id={id} tabIndex={-1}>
    {children}
  </Box>
);

export default SlideViewport;
