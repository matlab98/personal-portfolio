import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import { BAR_WIDTHS, skeletonSx } from './skeletonSx';

const SkillsListSkeleton = ({ animation = 'wave' }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
      gap: { xs: 1.5, md: 2 },
      width: '100%',
      maxWidth: 'lg',
      mx: 'auto',
      px: { xs: 2.5, md: 4 },
    }}
  >
    {BAR_WIDTHS.map((width, index) => (
      <Stack key={index} spacing={0.75}>
        <Skeleton variant="text" width="40%" height={18} animation={animation} sx={skeletonSx} />
        <Skeleton variant="rounded" height={4} width={`${width}%`} animation={animation} sx={skeletonSx} />
        <Skeleton variant="text" width={48} height={16} animation={animation} sx={skeletonSx} />
      </Stack>
    ))}
  </Box>
);

export default SkillsListSkeleton;
