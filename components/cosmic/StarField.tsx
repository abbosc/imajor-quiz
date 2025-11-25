'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  layer: number;
}

function ShootingStar() {
  const [key, setKey] = useState(0);
  const [position, setPosition] = useState({ top: '20%', left: '80%' });

  useEffect(() => {
    const interval = setInterval(() => {
      setKey(prev => prev + 1);
      setPosition({
        top: `${Math.random() * 40}%`,
        left: `${60 + Math.random() * 30}%`,
      });
    }, 8000 + Math.random() * 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key={key}
      className="absolute w-1 h-1 bg-white rounded-full"
      style={{
        top: position.top,
        left: position.left,
        boxShadow: '0 0 6px 2px white, -20px 0 15px 1px rgba(255,255,255,0.3), -40px 0 10px 1px rgba(255,255,255,0.1)',
      }}
      initial={{ x: 0, y: 0, opacity: 0 }}
      animate={{
        x: -200,
        y: 150,
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 1.2,
        ease: 'easeIn',
      }}
    />
  );
}

export default function StarField() {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
      layer: Math.floor(Math.random() * 3),
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#1a1a3a]" />

      {/* Coral nebula accents */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FF6B4A] opacity-[0.03] rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-[#E85537] opacity-[0.03] rounded-full blur-3xl" />
      <div className="absolute top-2/3 right-1/3 w-64 h-64 bg-[#87CEEB] opacity-[0.02] rounded-full blur-3xl" />

      {/* Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.2 + star.layer * 0.15, 0.8 + star.layer * 0.1, 0.2 + star.layer * 0.15],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Shooting stars */}
      <ShootingStar />
    </div>
  );
}
