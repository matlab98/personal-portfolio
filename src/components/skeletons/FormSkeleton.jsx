import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import { skeletonSx } from './skeletonSx';

const FormSkeleton = ({ animation = 'wave' }) => (
  <Stack spacing={2} sx={{ width: '100%', maxWidth: 480, mx: 'auto', px: { xs: 2.5, md: 4 } }}>
    <Skeleton variant="rounded" height={56} animation={animation} sx={skeletonSx} />
    <Skeleton variant="rounded" height={56} animation={animation} sx={skeletonSx} />
    <Skeleton variant="rounded" height={120} animation={animation} sx={skeletonSx} />
    <Skeleton variant="rounded" width={140} height={44} animation={animation} sx={skeletonSx} />
  </Stack>
);

export default FormSkeleton;
