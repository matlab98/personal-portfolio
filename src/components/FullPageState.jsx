import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import SectionSkeleton from '@/components/skeletons/SectionSkeleton';

/** Pantalla completa para los estados del CMS: cargando, vacío o error. */
const FullPageState = ({ loading = false, message, actionLabel, onAction }) => (
    <Box
      role={loading ? 'status' : 'alert'}
      aria-busy={loading || undefined}
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
        color: 'text.primary',
      }}
    >
      {loading ? (
        <>
          <Box
            component="header"
            sx={(theme) => ({
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: theme.zIndex.appBar,
              borderBottom: `1px solid ${theme.palette.divider}`,
              backgroundColor: `${theme.palette.background.paper}D1`,
              backdropFilter: 'blur(12px)',
            })}
          >
            <Toolbar sx={{ minHeight: 56 }}>
              <Box
                sx={{
                  width: 120,
                  height: 20,
                  borderRadius: 1,
                  bgcolor: 'action.hover',
                }}
              />
            </Toolbar>
          </Box>
          <Toolbar aria-hidden="true" />
          <Box
            aria-hidden="true"
            sx={{
              position: 'fixed',
              left: { md: 20, lg: 32 },
              top: '50%',
              transform: 'translateY(-50%)',
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: (theme) => theme.tokens.surface.outlineStrong,
                }}
              />
            ))}
          </Box>
          <SectionSkeleton variant="hero" fullSlide />
        </>
      ) : (
        <Stack
          spacing={3}
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          sx={{ flex: 1, px: 3, maxWidth: '34rem', mx: 'auto' }}
        >
          <Typography variant="body1">{message}</Typography>
          {actionLabel && onAction && (
            <Button variant="contained" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </Stack>
      )}
    </Box>
);

export default FullPageState;
