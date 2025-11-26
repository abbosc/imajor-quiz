'use client';

import { useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { useRef, RefObject } from 'react';

interface UseParallaxOptions {
  offset?: [string, string];
  speed?: number;
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
}

interface UseParallaxReturn {
  ref: RefObject<HTMLDivElement | null>;
  y: MotionValue<number>;
  x: MotionValue<number>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
}

export function useParallax({
  offset = ["start end", "end start"],
  speed = 0.5,
  springConfig = { stiffness: 100, damping: 30, mass: 1 },
}: UseParallaxOptions = {}): UseParallaxReturn {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as ["start end", "end start"],
  });

  const yRange = speed * 100;

  const yRaw = useTransform(scrollYProgress, [0, 1], [yRange, -yRange]);
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const opacityRaw = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  const y = useSpring(yRaw, springConfig);
  const x = useSpring(xRaw, springConfig);
  const opacity = useSpring(opacityRaw, springConfig);
  const scale = useSpring(scaleRaw, springConfig);

  return { ref, y, x, opacity, scale, scrollYProgress };
}

// Simple parallax for global scroll (not element-specific)
export function useGlobalParallax(speed: number = 0.5) {
  const { scrollYProgress } = useScroll();

  const yRaw = useTransform(scrollYProgress, [0, 1], [0, speed * 300]);
  const y = useSpring(yRaw, { stiffness: 100, damping: 30 });

  return { y, scrollYProgress };
}
