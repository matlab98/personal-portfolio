import React, { Suspense } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const DefaultFallback = () => (
  <Box 
    sx={{ 
      minHeight: '200px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      width: '100%'
    }}
  >
    <CircularProgress />
  </Box>
);

const LazySectionWrapper = ({ children, fallback }) => (
  <Suspense fallback={fallback || <DefaultFallback />}>
    {children}
  </Suspense>
);

export default LazySectionWrapper; 