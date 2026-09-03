import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import { skeletonSx } from './skeletonSx';

const HeroSkeleton = ({ animation = 'wave' }) => (
  <Stack
    spacing={3}
    alignItems="flex-start"
    sx={{ width: '100%', maxWidth: 'lg', mx: 'auto', px: { xs: 2.5, md: 4 } }}
  >
    <Skeleton variant="rounded" width={120} height={28} animation={animation} sx={skeletonSx} />
    <Skeleton variant="text" width="80%" height={64} animation={animation} sx={skeletonSx} />
    <Skeleton variant="text" width="60%" height={64} animation={animation} sx={skeletonSx} />
    <Stack spacing={1} sx={{ width: '100%' }}>
      <Skeleton variant="text" width="90%" animation={animation} sx={skeletonSx} />
      <Skeleton variant="text" width="85%" animation={animation} sx={skeletonSx} />
      <Skeleton variant="text" width="75%" animation={animation} sx={skeletonSx} />
    </Stack>
    <Stack direction="row" spacing={2}>
      <Skeleton variant="rounded" width={160} height={44} animation={animation} sx={skeletonSx} />
      <Skeleton variant="rounded" width={160} height={44} animation={animation} sx={skeletonSx} />
    </Stack>
  </Stack>
);

export default HeroSkeleton;
