'use client';

import { useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  depth: number;
  floatDuration: number;
  floatDelay: number;
}

function ParallaxParticle({ particle }: { particle: Particle }) {
  const { scrollYProgress } = useScroll();

  const yOffset = particle.depth * 60;
  const yRaw = useTransform(scrollYProgress, [0, 1], [0, yOffset]);
  const y = useSpring(yRaw, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: particle.size,
        height: particle.size,
        backgroundColor: particle.color,
        boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
        y,
      }}
      animate={{
        y: [0, -15, 0],
        x: [0, 5, 0],
        opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: particle.floatDuration,
        delay: particle.floatDelay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

export default function FloatingParticles() {
  const reducedMotion = useReducedMotion();

  const particles = useMemo<Particle[]>(() => {
    const colors = ['#FF6B4A', '#FFD700', '#87CEEB', '#FFFFFF', '#FF8A6D', '#9370DB'];

    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 150 - 25, // Extended range for scroll
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.4 + 0.15,
      color: colors[Math.floor(Math.random() * colors.length)],
      depth: Math.floor(Math.random() * 5) + 1,
      floatDuration: 3 + Math.random() * 3,
      floatDelay: Math.random() * 2,
    }));
  }, []);

  if (reducedMotion) {
    return null; // Hide particles for reduced motion preference
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[5]">
      {particles.map((particle) => (
        <ParallaxParticle key={particle.id} particle={particle} />
      ))}
    </div>
  );
}
