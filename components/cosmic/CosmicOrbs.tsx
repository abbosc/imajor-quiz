'use client';

import { useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Orb {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  glowColor: string;
  depth: number;
  pulseDuration: number;
}

function ParallaxOrb({ orb }: { orb: Orb }) {
  const { scrollYProgress } = useScroll();

  const yOffset = orb.depth * 80;
  const yRaw = useTransform(scrollYProgress, [0, 1], [0, yOffset]);
  const y = useSpring(yRaw, { stiffness: 50, damping: 20 });

  const scaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1]);
  const scale = useSpring(scaleRaw, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: `${orb.x}%`,
        top: `${orb.y}%`,
        width: orb.size,
        height: orb.size,
        background: `radial-gradient(circle at 30% 30%, ${orb.color}, transparent 70%)`,
        y,
        scale,
      }}
      animate={{
        boxShadow: [
          `0 0 ${orb.size * 0.5}px ${orb.glowColor}`,
          `0 0 ${orb.size}px ${orb.glowColor}`,
          `0 0 ${orb.size * 0.5}px ${orb.glowColor}`,
        ],
      }}
      transition={{
        duration: orb.pulseDuration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

export default function CosmicOrbs() {
  const reducedMotion = useReducedMotion();

  const orbs = useMemo<Orb[]>(() => [
    {
      id: 1,
      x: 88,
      y: 15,
      size: 70,
      color: 'rgba(255, 107, 74, 0.6)',
      glowColor: 'rgba(255, 107, 74, 0.4)',
      depth: 2,
      pulseDuration: 4,
    },
    {
      id: 2,
      x: 8,
      y: 40,
      size: 50,
      color: 'rgba(135, 206, 235, 0.5)',
      glowColor: 'rgba(135, 206, 235, 0.3)',
      depth: 3,
      pulseDuration: 5,
    },
    {
      id: 3,
      x: 75,
      y: 65,
      size: 40,
      color: 'rgba(255, 215, 0, 0.5)',
      glowColor: 'rgba(255, 215, 0, 0.3)',
      depth: 4,
      pulseDuration: 3.5,
    },
    {
      id: 4,
      x: 20,
      y: 80,
      size: 55,
      color: 'rgba(147, 112, 219, 0.5)',
      glowColor: 'rgba(147, 112, 219, 0.3)',
      depth: 1,
      pulseDuration: 4.5,
    },
    {
      id: 5,
      x: 60,
      y: 25,
      size: 35,
      color: 'rgba(255, 138, 109, 0.45)',
      glowColor: 'rgba(255, 138, 109, 0.25)',
      depth: 5,
      pulseDuration: 3,
    },
  ], []);

  if (reducedMotion) {
    return null; // Hide orbs for reduced motion preference
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[2]">
      {orbs.map((orb) => (
        <ParallaxOrb key={orb.id} orb={orb} />
      ))}
    </div>
  );
}
