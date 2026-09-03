import { Suspense } from 'react';

import ErrorBoundary from './ErrorBoundary';
import SectionSkeleton from '@/components/skeletons/SectionSkeleton';

/**
 * Suspense por sección con skeleton tipado. `fullSlide` aplica 100dvh solo en desktop (modo snap).
 *
 * @param {string} [skeleton] variante de SectionSkeleton
 * @param {boolean} [fullSlide] min-height 100dvh en el fallback
 */
const LazySectionWrapper = ({ children, fallback, skeleton, fullSlide = false }) => {
  const resolvedFallback =
    fallback ??
    (skeleton ? (
      <SectionSkeleton variant={skeleton} fullSlide={fullSlide} />
    ) : (
      <SectionSkeleton variant="text" fullSlide={fullSlide} />
    ));

  return (
    <ErrorBoundary scope="section">
      <Suspense fallback={resolvedFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default LazySectionWrapper;
