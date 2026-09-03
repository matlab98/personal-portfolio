import { useRef } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useTranslation } from 'react-i18next';

import useCarousel from '@/hooks/useCarousel';
import useReducedMotion from '@/hooks/useReducedMotion';
import ProjectCard from '@/features/portfolio/ProjectCard';

const MAX_DOTS = 8;

const ProjectCarousel = ({ projects = [], onViewDetails }) => {
  const { t } = useTranslation();
  const trackRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');

  const {
    activeIndex,
    canScrollPrev,
    canScrollNext,
    scrollByStep,
    scrollToIndex,
    showControls,
    trackHandlers,
  } = useCarousel(trackRef, projects.length, reducedMotion);

  const showArrows = finePointer && showControls && (canScrollPrev || canScrollNext);
  const showDots = projects.length > 0 && projects.length <= MAX_DOTS;

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Box
        ref={trackRef}
        data-portfolio-track
        role="group"
        tabIndex={0}
        aria-label={t('portfolio.carousel_label')}
        aria-roledescription={t('portfolio.carousel_role')}
        {...trackHandlers}
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'stretch',
          gap: 'var(--app-carousel-gap)',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          overscrollBehaviorX: 'contain',
          scrollPaddingInline: 'var(--app-slide-padding-x)',
          mx: { xs: -2.5, md: -4 },
          px: { xs: 2.5, md: 4 },
          py: { xs: 0.75, md: 1.25 },
          cursor: 'grab',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          '&:active': { cursor: 'grabbing' },
          '&:focus-visible': {
            outline: `2px solid ${theme.tokens.surface.outlineStrong}`,
            outlineOffset: 4,
          },
        })}
      >
        {projects.map((item, index) => (
          <ProjectCard
            key={item?.name_project ?? index}
            item={item}
            index={index}
            onViewDetails={onViewDetails}
          />
        ))}
      </Box>

      {showControls && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1.5}
          sx={{
            '@media (hover: hover) and (pointer: fine)': {},
          }}
        >
          {showArrows && (
            <IconButton
              aria-label={t('portfolio.prev')}
              onClick={() => scrollByStep(-1)}
              disabled={!canScrollPrev}
              size="small"
            >
              <ChevronLeftRoundedIcon />
            </IconButton>
          )}

          {showDots ? (
            <Stack direction="row" spacing={0.75} role="group" aria-label={t('portfolio.carousel_label')}>
              {projects.map((_, index) => (
                <Box
                  key={index}
                  component="button"
                  type="button"
                  aria-label={t('portfolio.goTo', { index: index + 1 })}
                  aria-current={activeIndex === index ? 'true' : undefined}
                  onClick={() => scrollToIndex(index)}
                  sx={(theme) => ({
                    width: activeIndex === index ? 20 : 8,
                    height: 8,
                    p: 0,
                    border: 'none',
                    borderRadius: theme.tokens.radius.pill,
                    backgroundColor:
                      activeIndex === index ? 'primary.main' : theme.tokens.surface.outlineStrong,
                    cursor: 'pointer',
                    transition: 'width 200ms, background-color 200ms',
                    '&:focus-visible': {
                      outline: `2px solid ${theme.tokens.surface.outlineStrong}`,
                      outlineOffset: 2,
                    },
                  })}
                />
              ))}
            </Stack>
          ) : (
            <Typography variant="caption" color="text.secondary" aria-live="polite">
              {t('portfolio.position', { current: activeIndex + 1, total: projects.length })}
            </Typography>
          )}

          {showArrows && (
            <IconButton
              aria-label={t('portfolio.next')}
              onClick={() => scrollByStep(1)}
              disabled={!canScrollNext}
              size="small"
            >
              <ChevronRightRoundedIcon />
            </IconButton>
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default ProjectCarousel;
