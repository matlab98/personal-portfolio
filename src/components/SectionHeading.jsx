import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import MotionReveal from './MotionReveal';

/**
 * Encabezado estándar de sección: overline opcional, `h2` y bajada.
 * Centraliza la jerarquía de headings (el `h1` vive solo en el hero).
 */
const SectionHeading = ({ overline, title, subtitle, align = 'center', sx }) => {
  const isCentered = align === 'center';

  return (
    <MotionReveal>
      <Box
        sx={[
          {
            textAlign: align,
            mb: { xs: 3.5, md: 5.5 },
            mx: isCentered ? 'auto' : 0,
            maxWidth: isCentered ? '48rem' : '100%',
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {overline && (
          <Typography variant="overline" component="p" color="primary" sx={{ mb: 1 }}>
            {overline}
          </Typography>
        )}

        <Typography variant="h2" component="h2" color="text.primary">
          {title}
        </Typography>

        <Box
          aria-hidden="true"
          sx={(theme) => ({
            width: 64,
            height: 4,
            mt: 2,
            mx: isCentered ? 'auto' : 0,
            borderRadius: `${theme.tokens.radius.pill}px`,
            background: theme.tokens.surface.accentGradient,
          })}
        />

        {subtitle && (
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mt: 2, mx: isCentered ? 'auto' : 0, maxWidth: '58ch' }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </MotionReveal>
  );
};

export default SectionHeading;
