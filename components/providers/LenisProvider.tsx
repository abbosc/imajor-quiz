'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { usePathname } from 'next/navigation';

interface LenisProviderProps {
  children: React.ReactNode;
}

// Dashboard routes that shouldn't use Lenis smooth scrolling
const dashboardRoutes = [
  '/dashboard',
  '/activities',
  '/tasks',
  '/tests',
  '/universities',
  '/essays',
  '/honors',
  '/recommendations',
  '/quiz-results',
  '/settings',
  '/admin',
];

export default function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const pathname = usePathname();

  // Check if current route is a dashboard route
  const isDashboardRoute = dashboardRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    // Don't initialize Lenis on dashboard routes - use native scrolling
    if (isDashboardRoute) {
      return;
    }

    // Initialize Lenis with smooth settings for landing/public pages
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // RAF loop for smooth scrolling
    function raf(time: number) {
      lenisRef.current?.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }
    rafIdRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [isDashboardRoute]);

  // Reset scroll position on route change (only when Lenis is active)
  useEffect(() => {
    if (!isDashboardRoute && lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname, isDashboardRoute]);

  return <>{children}</>;
}
