'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook that sets a CSS variable --vh with the actual visible viewport height.
 * This is the proven solution for iOS Safari's 100vh problem.
 *
 * The issue: Safari's address bar is an overlay that doesn't reduce the viewport,
 * so 100vh includes space behind the address bar. Lenis also sets height: auto
 * on html/body which breaks CSS viewport solutions.
 *
 * This hook uses window.innerHeight which returns the ACTUAL visible height.
 * Resize events are debounced to avoid excessive calculations during scroll.
 */
export function useViewportHeight() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const setViewportHeight = () => {
      // Get the actual visible viewport height
      const vh = window.innerHeight * 0.01;
      // Set it as a CSS custom property
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Debounced handler for resize events
    const debouncedSetViewportHeight = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(setViewportHeight, 100);
    };

    // Set on mount (immediate, no debounce)
    setViewportHeight();

    // Update on resize and orientation change (debounced)
    window.addEventListener('resize', debouncedSetViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight); // Immediate for orientation

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('resize', debouncedSetViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);
}
