'use client';

import { motion } from 'framer-motion';

interface ParticleExplosionProps {
  x: number;
  y: number;
  onComplete?: () => void;
}

export default function ParticleExplosion({ x, y, onComplete }: ParticleExplosionProps) {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    angle: (i * 30) * (Math.PI / 180),
    delay: i * 0.015,
    distance: 40 + Math.random() * 20,
    size: 4 + Math.random() * 4,
  }));

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: i % 2 === 0 ? '#FF6B4A' : '#FFD700',
            boxShadow: `0 0 ${p.size}px ${i % 2 === 0 ? '#FF6B4A' : '#FFD700'}`,
          }}
          initial={{
            scale: 0,
            x: 0,
            y: 0,
            opacity: 1,
          }}
          animate={{
            scale: [0, 1.5, 0],
            x: Math.cos(p.angle) * p.distance,
            y: Math.sin(p.angle) * p.distance,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 0.5,
            delay: p.delay,
            ease: 'easeOut',
          }}
          onAnimationComplete={i === 0 ? onComplete : undefined}
        />
      ))}

      {/* Center flash */}
      <motion.div
        className="absolute w-8 h-8 rounded-full bg-white"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 20px white, 0 0 40px #FF6B4A',
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 2, 0], opacity: [1, 0.8, 0] }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  );
}
