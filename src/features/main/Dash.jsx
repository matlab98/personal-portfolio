import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { useTranslation } from 'react-i18next';

import MotionReveal from '@/components/MotionReveal';
import { scrollToSection } from '@/utils/scroll';

const PhotoPlaceholder = ({ label }) => (
  <Box
    sx={(theme) => ({
      position: 'relative',
      width: '100%',
      maxWidth: { xs: 240, sm: 280, md: 300, lg: 340 },
      mx: { xs: 'auto', md: 0 },
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: { xs: '-8%', md: '-12%' },
        background: theme.tokens.surface.glow,
        pointerEvents: 'none',
        zIndex: 0,
      },
    })}
  >
    <Box
      aria-hidden="true"
      sx={(theme) => ({
        position: 'relative',
        zIndex: 1,
        width: '100%',
        aspectRatio: '4 / 5',
        borderRadius: `${theme.tokens.radius.lg}px`,
        border: `1px solid ${theme.palette.divider}`,
        background: theme.tokens.surface.heroGradient,
        boxShadow: theme.tokens.elevation.sm,
        display: 'grid',
        placeItems: 'center',
        color: 'text.disabled',
        overflow: 'hidden',
      })}
    >
      <Stack alignItems="center" spacing={1.25} sx={{ px: 2 }}>
        <Box
          sx={(theme) => ({
            width: 72,
            height: 72,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: 'action.hover',
            border: `1px dashed ${theme.palette.divider}`,
          })}
        >
          <PersonOutlineRoundedIcon sx={{ fontSize: 36 }} />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
          {label}
        </Typography>
      </Stack>
    </Box>
  </Box>
);

const Dash = ({ resume, cv }) => {
  const { t } = useTranslation();

  return (
    <MotionReveal style={{ position: 'relative', width: '100%' }}>
      <Grid
        container
        spacing={{ xs: 3.5, sm: 4, md: 6, lg: 8 }}
        alignItems="center"
        sx={{ pb: { md: 4 } }}
      >
        <Grid size={{ xs: 12, md: 7 }} sx={{ order: { xs: 2, md: 1 } }}>
          <Chip
            label={t('hero.eyebrow')}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ mb: { xs: 2, md: 2.5, lg: 3 } }}
          />

          <Typography variant="h1" component="h1" sx={{ textWrap: 'balance' }}>
            <Box component="span" sx={{ display: 'block', color: 'text.primary' }}>
              {t('hero.titleLine1')}
            </Box>
            <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>
              {t('hero.titleLine2')}
            </Box>
          </Typography>

          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={(theme) => ({
              mt: { xs: 2, md: 2.5, lg: 3 },
              maxWidth: theme.tokens.layout.leadMaxWidth,
              lineHeight: 1.65,
            })}
          >
            {t('hero.subtitle')}
          </Typography>

          {resume && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={(theme) => ({
                mt: { xs: 2, md: 2.5 },
                maxWidth: theme.tokens.layout.readableMaxWidth,
                display: { xs: 'none', sm: 'block' },
              })}
            >
              {resume}
            </Typography>
          )}

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            useFlexGap
            flexWrap="wrap"
            sx={{
              mt: { xs: 3.5, md: 4.5, lg: 5 },
              alignItems: { xs: 'stretch', sm: 'center' },
            }}
          >
            <Button
              variant="contained"
              size="large"
              href="#portfolio"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={(event) => {
                event.preventDefault();
                if (!scrollToSection('portfolio')) {
                  scrollToSection('skills');
                }
              }}
            >
              {t('hero.cta_work')}
            </Button>

            {cv?.link && (
              <Button
                variant="outlined"
                size="large"
                href={cv.link}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<DownloadRoundedIcon />}
              >
                {t('download_cv')}
              </Button>
            )}

            <Button
              variant="text"
              size="large"
              href="#contact"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}
              onClick={(event) => {
                event.preventDefault();
                scrollToSection('contact');
              }}
            >
              {t('hero.cta_contact')}
            </Button>
          </Stack>
        </Grid>

        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{
            order: { xs: 1, md: 2 },
            display: 'flex',
            justifyContent: { xs: 'center', md: 'flex-end' },
            mb: { xs: 0.5, md: 0 },
          }}
        >
          <PhotoPlaceholder label={t('hero.photo_placeholder')} />
        </Grid>
      </Grid>

      <Stack
        alignItems="center"
        spacing={0.25}
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'absolute',
          left: '50%',
          bottom: 0,
          transform: 'translateX(-50%)',
          color: 'text.disabled',
          pointerEvents: 'none',
        }}
      >
        <Typography variant="caption" sx={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {t('slides.hint')}
        </Typography>
        <KeyboardArrowDownRoundedIcon
          fontSize="small"
          sx={{
            '@media (prefers-reduced-motion: no-preference)': {
              animation: 'hero-nudge 1.8s ease-in-out infinite',
            },
            '@keyframes hero-nudge': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(4px)' },
            },
          }}
        />
      </Stack>
    </MotionReveal>
  );
};

export default Dash;
