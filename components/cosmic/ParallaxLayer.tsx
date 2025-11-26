'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ReactNode } from 'react';

interface ParallaxLayerProps {
  children: ReactNode;
  speed: number; // -1 to 1, negative = opposite direction
  className?: string;
  direction?: 'vertical' | 'horizontal' | 'both';
}

export default function ParallaxLayer({
  children,
  speed,
  className = '',
  direction = 'vertical',
}: ParallaxLayerProps) {
  const { scrollYProgress } = useScroll();

  const yRange = speed * 300;
  const xRange = direction === 'horizontal' || direction === 'both' ? speed * 150 : 0;

  const yRaw = useTransform(scrollYProgress, [0, 1], [0, yRange]);
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, xRange]);

  const y = useSpring(yRaw, { stiffness: 100, damping: 30 });
  const x = useSpring(xRaw, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      style={{ y, x }}
      className={`parallax-layer ${className}`}
    >
      {children}
    </motion.div>
  );
}
