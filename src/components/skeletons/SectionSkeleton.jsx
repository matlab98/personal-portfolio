import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import useReducedMotion from '@/hooks/useReducedMotion';
import CarouselSkeleton from '@/components/skeletons/CarouselSkeleton';
import FormSkeleton from '@/components/skeletons/FormSkeleton';
import HeroSkeleton from '@/components/skeletons/HeroSkeleton';
import SkillsListSkeleton from '@/components/skeletons/SkillsListSkeleton';
import { skeletonSx } from '@/components/skeletons/skeletonSx';

const SlideShell = ({ children, fullSlide, loadingLabel }) => (
  <Box
    role="status"
    aria-busy="true"
    aria-live="polite"
    sx={{
      position: 'relative',
      width: '100%',
      minHeight: fullSlide ? '100dvh' : 200,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: fullSlide ? 'center' : 'flex-start',
      py: fullSlide ? { xs: 4, md: 6 } : 0,
    }}
  >
    <Typography
      component="span"
      sx={{
        position: 'absolute',
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {loadingLabel}
    </Typography>
    {children}
  </Box>
);

const TextSkeleton = ({ animation }) => (
  <Stack spacing={2} sx={{ width: '100%', maxWidth: 'lg', mx: 'auto', px: { xs: 2.5, md: 4 } }}>
    <Skeleton variant="text" width="45%" height={40} animation={animation} sx={skeletonSx} />
    <Skeleton variant="text" width="65%" height={28} animation={animation} sx={skeletonSx} />
    <Skeleton variant="text" animation={animation} sx={skeletonSx} />
    <Skeleton variant="text" animation={animation} sx={skeletonSx} />
    <Skeleton variant="text" width="92%" animation={animation} sx={skeletonSx} />
    <Skeleton variant="text" width="88%" animation={animation} sx={skeletonSx} />
  </Stack>
);

const CardsSkeleton = ({ count = 3, animation }) => (
  <Stack
    direction={{ xs: 'column', md: 'row' }}
    spacing={3}
    sx={{ width: '100%', maxWidth: 'lg', mx: 'auto', px: { xs: 2.5, md: 4 } }}
  >
    {Array.from({ length: count }).map((_, index) => (
      <Box
        key={index}
        sx={{
          flex: 1,
          p: 2.5,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Skeleton variant="rounded" width={52} height={52} animation={animation} sx={{ mb: 2, ...skeletonSx }} />
        <Skeleton variant="text" width="70%" height={28} animation={animation} sx={skeletonSx} />
        <Skeleton variant="text" animation={animation} sx={skeletonSx} />
        <Skeleton variant="text" width="90%" animation={animation} sx={skeletonSx} />
      </Box>
    ))}
  </Stack>
);

const StatsSkeleton = ({ animation }) => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    spacing={3}
    sx={{ width: '100%', maxWidth: 'lg', mx: 'auto', px: { xs: 2.5, md: 4 } }}
  >
    {Array.from({ length: 3 }).map((_, index) => (
      <Stack key={index} spacing={1} sx={{ flex: 1, alignItems: { xs: 'flex-start', sm: 'center' } }}>
        <Skeleton variant="rounded" width={140} height={48} animation={animation} sx={skeletonSx} />
        <Skeleton variant="text" width={120} animation={animation} sx={skeletonSx} />
      </Stack>
    ))}
  </Stack>
);

const TimelineSkeleton = ({ animation }) => (
  <Stack spacing={3} sx={{ width: '100%', maxWidth: 'lg', mx: 'auto', px: { xs: 2.5, md: 4 } }}>
    {Array.from({ length: 4 }).map((_, index) => (
      <Stack key={index} direction="row" spacing={2} alignItems="flex-start">
        <Skeleton variant="circular" width={12} height={12} animation={animation} sx={{ mt: 1, ...skeletonSx }} />
        <Box sx={{ flex: 1, p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Skeleton variant="text" width="40%" animation={animation} sx={skeletonSx} />
          <Skeleton variant="text" width="70%" animation={animation} sx={skeletonSx} />
          <Skeleton variant="text" animation={animation} sx={skeletonSx} />
        </Box>
      </Stack>
    ))}
  </Stack>
);

const VARIANTS = {
  hero: HeroSkeleton,
  text: TextSkeleton,
  cards: CardsSkeleton,
  stats: StatsSkeleton,
  skills: SkillsListSkeleton,
  carousel: CarouselSkeleton,
  timeline: TimelineSkeleton,
  form: FormSkeleton,
};

/**
 * Placeholder por tipo de sección. En Suspense de diapositivas usar `fullSlide`.
 *
 * @param {'hero'|'text'|'cards'|'stats'|'skills'|'carousel'|'timeline'|'form'} variant
 * @param {boolean} [fullSlide=false]
 * @param {number} [count=3]  solo para `cards`
 */
const SectionSkeleton = ({ variant = 'text', fullSlide = false, count = 3 }) => {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const animation = reducedMotion ? false : 'wave';
  const Content = VARIANTS[variant] ?? TextSkeleton;

  return (
    <SlideShell fullSlide={fullSlide} loadingLabel={t('common.loading_section')}>
      <Content animation={animation} count={count} />
    </SlideShell>
  );
};

export default SectionSkeleton;
