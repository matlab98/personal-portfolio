import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

/**
 * Diapositiva del home. Sucesor de `Section`.
 *
 * fit="contain" — en desktop (≥ md) el contenido cabe en 100dvh; en móvil altura natural.
 * fit="scroll" — cabecera fija + región scrolleable en desktop (trayectoria); en móvil fluye con la página.
 */
const Slide = ({
  id,
  children,
  header,
  fit = 'contain',
  variant = 'default',
  labelledBy,
  scrollAriaLabel,
  sx,
}) => {
  const isHero = variant === 'hero';
  const isAlt = variant === 'alt';
  const isScroll = fit === 'scroll';

  return (
    <Box
      component="section"
      id={id}
      className={`slide slide--${fit}`}
      aria-labelledby={labelledBy}
      sx={[
        (theme) => ({
          position: 'relative',
          backgroundColor: isAlt ? 'background.paper' : 'transparent',
          background: isHero ? theme.tokens.surface.heroGradient : undefined,
          borderTop: isAlt ? `1px solid ${theme.palette.divider}` : 'none',
          borderBottom: isAlt ? `1px solid ${theme.palette.divider}` : 'none',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Container
        maxWidth="lg"
        sx={(theme) => {
          const gap = theme.tokens.spacingUnit * 1.5;
          const gapLg = theme.tokens.spacingUnit * 2;
          const railClearance =
            theme.tokens.layout.railOffset.md + theme.tokens.layout.railWidth + gap;
          const railClearanceLg =
            theme.tokens.layout.railOffset.lg + theme.tokens.layout.railWidth + gapLg;

          return {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            // Deja aire al riel fijo en md+ sin pelear con el contenido.
            pl: {
              md: `max(${theme.spacing(3)}, ${railClearance}px)`,
              lg: `max(${theme.spacing(3)}, ${railClearanceLg}px)`,
            },
          };
        }}
      >
        {header}

        {isScroll ? (
          <Box
            className="slide__body"
            tabIndex={0}
            role="group"
            aria-label={scrollAriaLabel}
          >
            {children}
          </Box>
        ) : (
          children
        )}
      </Container>
    </Box>
  );
};

export default Slide;
