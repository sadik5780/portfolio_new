'use client';

import { useEffect, useRef } from 'react';

/**
 * LUMINAL-style magnetic hover: the element follows the cursor with a small
 * mouse-relative translate while hovered, and snaps back on leave.
 *
 *   const ref = useMagnetic<HTMLButtonElement>();
 *   <button ref={ref} ...>Get in touch</button>
 *
 * Tunable via `strength` (0 = no follow, 1 = full mouse-relative offset).
 * Default 0.18 mirrors the LUMINAL template's feel without being noisy.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.18) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Respect users who prefer reduced motion.
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let raf = 0;
    let targetX = 0;
    let targetY = 0;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      targetX = (e.clientX - rect.left - rect.width / 2) * strength;
      targetY = (e.clientY - rect.top - rect.height / 2) * strength;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = '';
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
      el.style.transform = '';
    };
  }, [strength]);

  return ref;
}
