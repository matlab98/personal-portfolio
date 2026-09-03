import { useEffect, useState } from 'react';

/**
 * Marca qué sección del home está en pantalla, para resaltarla en el `Navbar`.
 *
 * @param {string[]} sectionIds ids realmente renderizados por el home
 * @returns {string|null}
 */
const useActiveSection = (sectionIds = []) => {
  const [activeId, setActiveId] = useState(null);
  const key = sectionIds.join('|');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const elements = key
      .split('|')
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (mostVisible) setActiveId(mostVisible.target.id);
      },
      // La banda central evita que dos secciones se disputen el estado activo.
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.5, 1] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [key]);

  return activeId;
};

export default useActiveSection;
