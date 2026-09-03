import { useMemo } from 'react';
import Box from '@mui/material/Box';

import useActiveSection from '@/hooks/useActiveSection';

/**
 * Barra fina superior de progreso (xs). Avanza a saltos según la sección activa.
 * Sustituye al scroll continuo cuando hay diapositivas con snap.
 */
const SlideProgressBar = ({ sectionIds = [] }) => {
  const activeId = useActiveSection(sectionIds);

  const progress = useMemo(() => {
    if (!sectionIds.length) return 0;
    const index = activeId ? sectionIds.indexOf(activeId) : -1;
    const step = index >= 0 ? index + 1 : 0;
    const total = sectionIds.length + 1;
    return Math.min(100, Math.max(0, (step / total) * 100));
  }, [activeId, sectionIds]);

  return (
    <Box
      aria-hidden="true"
      sx={(theme) => ({
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: theme.zIndex.appBar + 1,
        pointerEvents: 'none',
        display: { xs: 'block', md: 'none' },
        '@media (max-height: 640px)': { display: 'none' },
      })}
    >
      <Box
        sx={(theme) => ({
          height: '100%',
          width: `${progress}%`,
          background: theme.tokens.surface.accentGradient,
          transition: 'width 240ms cubic-bezier(0.22, 1, 0.36, 1)',
        })}
      />
    </Box>
  );
};

export default SlideProgressBar;
