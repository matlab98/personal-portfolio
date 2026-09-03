import { useCallback, useEffect, useRef, useState } from 'react';

const DRAG_THRESHOLD = 6;
const AUTOPLAY_MS = 5000;

/**
 * Carrusel horizontal con scroll nativo, snap y arrastre de ratón opcional.
 * Autoplay cada {@link AUTOPLAY_MS} ms; se pausa con `prefers-reduced-motion`,
 * hover, foco o interacción manual.
 *
 * @param {React.RefObject<HTMLElement>} trackRef
 * @param {number} itemCount
 * @param {boolean} reducedMotion
 */
const useCarousel = (trackRef, itemCount, reducedMotion = false) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0, pointerId: null });

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanScrollPrev(scrollLeft > 1);
    setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 1);
  }, [trackRef]);

  const getScrollStep = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;

    const firstCard = track.querySelector('[data-carousel-card]');
    if (!firstCard) return track.clientWidth * 0.8;

    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return firstCard.getBoundingClientRect().width + gap;
  }, [trackRef]);

  const scrollByStep = useCallback(
    (direction) => {
      const track = trackRef.current;
      if (!track) return;

      const step = getScrollStep() * direction;
      track.scrollBy({ left: step, behavior: reducedMotion ? 'auto' : 'smooth' });
    },
    [getScrollStep, reducedMotion, trackRef],
  );

  const scrollToIndex = useCallback(
    (index) => {
      const track = trackRef.current;
      if (!track) return;

      const cards = track.querySelectorAll('[data-carousel-card]');
      const target = cards[index];
      if (!target) return;

      target.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    },
    [reducedMotion, trackRef],
  );

  const scrollToStart = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [reducedMotion, trackRef]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || itemCount === 0) return undefined;

    updateScrollState();

    const handleScroll = () => updateScrollState();
    track.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    const cards = track.querySelectorAll('[data-carousel-card]');
    if (cards.length === 0) {
      return () => {
        track.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          const index = Number(visible.target.getAttribute('data-carousel-index'));
          if (!Number.isNaN(index)) setActiveIndex(index);
        }
      },
      { root: track, threshold: 0.6 },
    );

    cards.forEach((card) => observer.observe(card));

    return () => {
      track.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      observer.disconnect();
    };
  }, [itemCount, trackRef, updateScrollState]);

  useEffect(() => {
    if (reducedMotion || itemCount <= 1) return undefined;

    const track = trackRef.current;
    if (!track) return undefined;

    let paused = false;

    const pause = () => {
      paused = true;
    };

    const resume = () => {
      paused = false;
    };

    const tick = () => {
      if (paused) return;

      const { scrollLeft, scrollWidth, clientWidth } = track;
      const atEnd = scrollLeft >= scrollWidth - clientWidth - 1;

      if (atEnd) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const firstCard = track.querySelector('[data-carousel-card]');
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        const step = firstCard
          ? firstCard.getBoundingClientRect().width + gap
          : track.clientWidth * 0.8;
        track.scrollBy({ left: step, behavior: 'smooth' });
      }
    };

    const intervalId = window.setInterval(tick, AUTOPLAY_MS);

    track.addEventListener('pointerenter', pause);
    track.addEventListener('pointerleave', resume);
    track.addEventListener('focusin', pause);
    track.addEventListener('focusout', resume);
    // Pausa solo mientras el puntero está abajo; sin resume el autoplay
    // quedaba muerto tras un click/tap dentro de la pista.
    track.addEventListener('pointerdown', pause);
    track.addEventListener('pointerup', resume);
    track.addEventListener('pointercancel', resume);

    return () => {
      window.clearInterval(intervalId);
      track.removeEventListener('pointerenter', pause);
      track.removeEventListener('pointerleave', resume);
      track.removeEventListener('focusin', pause);
      track.removeEventListener('focusout', resume);
      track.removeEventListener('pointerdown', pause);
      track.removeEventListener('pointerup', resume);
      track.removeEventListener('pointercancel', resume);
    };
  }, [itemCount, reducedMotion, trackRef]);

  const handlePointerDown = useCallback(
    (event) => {
      if (event.pointerType !== 'mouse') return;

      const track = trackRef.current;
      if (!track) return;

      dragState.current = {
        active: false,
        startX: event.clientX,
        scrollLeft: track.scrollLeft,
        pointerId: event.pointerId,
      };
    },
    [trackRef],
  );

  const handlePointerMove = useCallback(
    (event) => {
      const track = trackRef.current;
      const state = dragState.current;
      if (!track || state.pointerId !== event.pointerId) return;

      const delta = event.clientX - state.startX;
      if (!state.active && Math.abs(delta) < DRAG_THRESHOLD) return;

      if (!state.active) {
        state.active = true;
        track.setPointerCapture(event.pointerId);
        track.style.cursor = 'grabbing';
      }

      track.scrollLeft = state.scrollLeft - delta;
    },
    [trackRef],
  );

  const endDrag = useCallback(
    (event) => {
      const track = trackRef.current;
      const state = dragState.current;
      if (!track || state.pointerId !== event.pointerId) return;

      if (state.active) {
        track.releasePointerCapture(event.pointerId);
        track.style.cursor = 'grab';
      }

      dragState.current = { active: false, startX: 0, scrollLeft: 0, pointerId: null };
      updateScrollState();
    },
    [trackRef, updateScrollState],
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollByStep(-1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollByStep(1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        scrollToStart();
      } else if (event.key === 'End') {
        event.preventDefault();
        scrollToIndex(itemCount - 1);
      }
    },
    [itemCount, scrollByStep, scrollToIndex, scrollToStart],
  );

  const showControls = itemCount > 0;

  return {
    activeIndex,
    canScrollPrev,
    canScrollNext,
    scrollByStep,
    scrollToIndex,
    scrollToStart,
    showControls,
    trackHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onKeyDown: handleKeyDown,
    },
  };
};

export default useCarousel;
