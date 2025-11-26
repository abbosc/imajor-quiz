'use client';

import { useEffect } from 'react';

/**
 * Hook that sets a CSS variable --vh with the actual visible viewport height.
 * This is the proven solution for iOS Safari's 100vh problem.
 *
 * The issue: Safari's address bar is an overlay that doesn't reduce the viewport,
 * so 100vh includes space behind the address bar. Lenis also sets height: auto
 * on html/body which breaks CSS viewport solutions.
 *
 * This hook uses window.innerHeight which returns the ACTUAL visible height.
 */
export function useViewportHeight() {
  useEffect(() => {
    const setViewportHeight = () => {
      // Get the actual visible viewport height
      const vh = window.innerHeight * 0.01;
      // Set it as a CSS custom property
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set on mount
    setViewportHeight();

    // Update on resize and orientation change
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);
}
