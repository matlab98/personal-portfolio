import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Expone la preferencia del sistema para que JS y CSS desactiven snap,
 * animaciones y scroll suave de forma coherente.
 */
const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const media = window.matchMedia(QUERY);
    const onChange = (event) => setReducedMotion(event.matches);

    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return reducedMotion;
};

export default useReducedMotion;
