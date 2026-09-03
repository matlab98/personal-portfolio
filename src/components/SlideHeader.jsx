import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import MotionReveal from './MotionReveal';

/**
 * Cabecera estándar de diapositiva: overline (número + nombre), `h2` y bajada.
 * El `h1` vive solo en el hero.
 */
const SlideHeader = ({ overline, title, subtitle, titleId, align = 'center', sx }) => {
  const isCentered = align === 'center';

  return (
    <MotionReveal>
      <Box
        sx={[
          {
            textAlign: align,
            mb: (theme) => theme.tokens.layout.slideHeaderGap,
            mx: isCentered ? 'auto' : 0,
            maxWidth: isCentered ? '48rem' : '100%',
            flexShrink: 0,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {overline && (
          <Typography variant="overline" component="p" color="primary" sx={{ mb: 1 }}>
            {overline}
          </Typography>
        )}

        <Typography variant="h2" component="h2" id={titleId} color="text.primary">
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
            sx={{
              mt: 2,
              mx: isCentered ? 'auto' : 0,
              maxWidth: (theme) => theme.tokens.layout.leadMaxWidth,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </MotionReveal>
  );
};

export default SlideHeader;
