import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRef } from 'react';

import useCarousel from '@/hooks/useCarousel';

const buildTrack = () => {
  const track = document.createElement('div');
  const card = document.createElement('article');
  card.setAttribute('data-carousel-card', 'true');
  card.setAttribute('data-carousel-index', '0');
  Object.defineProperty(card, 'getBoundingClientRect', {
    value: () => ({ width: 320, height: 400, top: 0, left: 0, right: 320, bottom: 400 }),
  });
  track.appendChild(card);
  Object.defineProperty(track, 'clientWidth', { value: 800, configurable: true });
  Object.defineProperty(track, 'scrollWidth', { value: 1600, configurable: true });
  Object.defineProperty(track, 'scrollLeft', { value: 0, writable: true, configurable: true });
  track.scrollBy = vi.fn();
  track.scrollTo = vi.fn();
  document.body.appendChild(track);
  return track;
};

describe('useCarousel autoplay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('avanza automáticamente cuando reducedMotion es false', () => {
    const track = buildTrack();

    const { result, unmount } = renderHook(() => {
      const ref = useRef(track);
      return useCarousel(ref, 3, false);
    });

    expect(result.current.showControls).toBe(true);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(track.scrollBy).toHaveBeenCalled();
    unmount();
  });

  it('no programa autoplay cuando reducedMotion es true', () => {
    const track = buildTrack();
    track.scrollBy.mockClear();

    const { unmount } = renderHook(() => {
      const ref = useRef(track);
      return useCarousel(ref, 3, true);
    });

    act(() => {
      vi.advanceTimersByTime(15000);
    });

    expect(track.scrollBy).not.toHaveBeenCalled();
    unmount();
  });
});
