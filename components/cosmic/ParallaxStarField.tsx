'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  brightness: number;
}

interface Nebula {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  blur: number;
  depth: number;
}

// Parallax star layer component
function StarLayer({
  stars,
  speed,
  brightness
}: {
  stars: Star[];
  speed: number;
  brightness: number;
}) {
  const { scrollYProgress } = useScroll();
  const yRaw = useTransform(scrollYProgress, [0, 1], [0, speed * 200]);
  const y = useSpring(yRaw, { stiffness: 50, damping: 20 });

  return (
    <motion.div className="absolute inset-0" style={{ y }}>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            boxShadow: star.size > 2 ? `0 0 ${star.size * 2}px rgba(255,255,255,${brightness * 0.5})` : 'none',
          }}
          animate={{
            opacity: [brightness * 0.4, brightness, brightness * 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  );
}

// Parallax nebula layer component
function NebulaLayer({ nebulas, speed }: { nebulas: Nebula[]; speed: number }) {
  const { scrollYProgress } = useScroll();
  const yRaw = useTransform(scrollYProgress, [0, 1], [0, speed * 150]);
  const y = useSpring(yRaw, { stiffness: 30, damping: 20 });

  return (
    <motion.div className="absolute inset-0" style={{ y }}>
      {nebulas.map((nebula) => (
        <motion.div
          key={nebula.id}
          className="absolute rounded-full"
          style={{
            left: `${nebula.x}%`,
            top: `${nebula.y}%`,
            width: nebula.size,
            height: nebula.size,
            background: nebula.color,
            opacity: nebula.opacity,
            filter: `blur(${nebula.blur}px)`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [nebula.opacity, nebula.opacity * 1.3, nebula.opacity],
          }}
          transition={{
            duration: 8 + nebula.depth * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  );
}

// Enhanced shooting star with parallax
function ShootingStar({ depth }: { depth: number }) {
  const [key, setKey] = useState(0);
  const [position, setPosition] = useState({ top: '20%', left: '80%' });
  const { scrollYProgress } = useScroll();

  const yOffset = useTransform(scrollYProgress, [0, 1], [0, depth * 50]);
  const y = useSpring(yOffset, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const interval = setInterval(() => {
      setKey(prev => prev + 1);
      setPosition({
        top: `${Math.random() * 40}%`,
        left: `${60 + Math.random() * 30}%`,
      });
    }, 6000 + Math.random() * 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key={key}
      className="absolute w-1 h-1 bg-white rounded-full"
      style={{
        top: position.top,
        left: position.left,
        boxShadow: '0 0 8px 3px white, -30px 0 20px 2px rgba(255,255,255,0.4), -60px 0 15px 1px rgba(255,255,255,0.2)',
        y,
      }}
      initial={{ x: 0, y: 0, opacity: 0 }}
      animate={{
        x: -250,
        y: 180,
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 1.5,
        ease: 'easeIn',
      }}
    />
  );
}

export default function ParallaxStarField() {
  const reducedMotion = useReducedMotion();

  // Enhanced nebula colors
  const nebulaColors = useMemo(() => [
    'rgba(255, 107, 74, 0.15)',   // Coral
    'rgba(232, 85, 55, 0.12)',    // Deep coral
    'rgba(135, 206, 235, 0.10)',  // Sky blue
    'rgba(255, 215, 0, 0.08)',    // Gold
    'rgba(147, 112, 219, 0.12)',  // Purple
    'rgba(255, 138, 109, 0.10)', // Light coral
    'rgba(100, 149, 237, 0.10)', // Cornflower blue
    'rgba(255, 182, 193, 0.08)', // Pink
  ], []);

  // Generate nebulas at different depths
  const nebulas = useMemo<{ far: Nebula[]; mid: Nebula[]; near: Nebula[] }>(() => ({
    far: [
      { id: 1, x: 15, y: 10, size: 450, color: nebulaColors[4], opacity: 0.04, blur: 100, depth: 1 },
      { id: 2, x: 80, y: 55, size: 400, color: nebulaColors[6], opacity: 0.03, blur: 90, depth: 1 },
    ],
    mid: [
      { id: 3, x: 55, y: 20, size: 350, color: nebulaColors[0], opacity: 0.06, blur: 70, depth: 2 },
      { id: 4, x: 20, y: 65, size: 320, color: nebulaColors[1], opacity: 0.05, blur: 75, depth: 2 },
      { id: 5, x: 75, y: 35, size: 300, color: nebulaColors[2], opacity: 0.05, blur: 60, depth: 3 },
    ],
    near: [
      { id: 6, x: 35, y: 40, size: 280, color: nebulaColors[0], opacity: 0.08, blur: 45, depth: 4 },
      { id: 7, x: 65, y: 75, size: 250, color: nebulaColors[3], opacity: 0.07, blur: 40, depth: 4 },
      { id: 8, x: 10, y: 50, size: 220, color: nebulaColors[5], opacity: 0.08, blur: 35, depth: 5 },
    ],
  }), [nebulaColors]);

  // Generate stars for each layer
  const starLayers = useMemo(() => ({
    far: Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1 + 0.5,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 5,
      brightness: 0.3 + Math.random() * 0.2,
    })),
    mid: Array.from({ length: 40 }, (_, i) => ({
      id: i + 60,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 4,
      brightness: 0.5 + Math.random() * 0.3,
    })),
    near: Array.from({ length: 20 }, (_, i) => ({
      id: i + 100,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1.5,
      duration: Math.random() * 2 + 2,
      delay: Math.random() * 3,
      brightness: 0.7 + Math.random() * 0.3,
    })),
  }), []);

  // If reduced motion, render static version
  if (reducedMotion) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#1a1a3a]" />
        {[...starLayers.far, ...starLayers.mid, ...starLayers.near].map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              opacity: star.brightness,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Layer 0: Deep space gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#1a1a3a]" />

      {/* Layer 1: Far nebulas (slowest parallax - 0.05x) */}
      <NebulaLayer nebulas={nebulas.far} speed={0.05} />

      {/* Layer 2: Far stars (0.1x) */}
      <StarLayer stars={starLayers.far} speed={0.1} brightness={0.4} />

      {/* Layer 3: Mid nebulas (0.2x) */}
      <NebulaLayer nebulas={nebulas.mid} speed={0.2} />

      {/* Layer 4: Mid stars (0.3x) */}
      <StarLayer stars={starLayers.mid} speed={0.3} brightness={0.65} />

      {/* Layer 5: Near nebulas (0.4x) */}
      <NebulaLayer nebulas={nebulas.near} speed={0.4} />

      {/* Layer 6: Near stars (0.5x) */}
      <StarLayer stars={starLayers.near} speed={0.5} brightness={0.9} />

      {/* Layer 7: Shooting stars (multiple at different depths) */}
      <ShootingStar depth={2} />
      <ShootingStar depth={3} />
      <ShootingStar depth={4} />
    </div>
  );
}
