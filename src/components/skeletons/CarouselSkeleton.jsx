import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import { skeletonSx } from './skeletonSx';

const CarouselSkeleton = ({ animation = 'wave' }) => (
  <Stack
    direction="row"
    spacing={3}
    sx={{
      width: '100%',
      maxWidth: '100vw',
      overflow: 'hidden',
      px: { xs: 2.5, md: 4 },
    }}
  >
    {Array.from({ length: 3 }).map((_, index) => (
      <Skeleton
        key={index}
        variant="rounded"
        animation={animation}
        sx={{
          flex: '0 0 min(78vw, 320px)',
          height: 320,
          ...skeletonSx,
          '@media (min-width: 900px)': { flexBasis: '360px' },
        }}
      />
    ))}
  </Stack>
);

export default CarouselSkeleton;
