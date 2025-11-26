'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface ScoreCounterProps {
  targetScore: number;
  maxScore?: number;
  duration?: number;
  onComplete?: () => void;
}

export default function ScoreCounter({
  targetScore,
  maxScore = 285,
  duration = 2000,
  onComplete,
}: ScoreCounterProps) {
  const [isComplete, setIsComplete] = useState(false);

  const spring = useSpring(0, {
    stiffness: 50,
    damping: 30,
  });

  const display = useTransform(spring, (value) => Math.round(value));

  useEffect(() => {
    const timeout = setTimeout(() => {
      spring.set(targetScore);
    }, 300);

    const completeTimeout = setTimeout(() => {
      setIsComplete(true);
      onComplete?.();
    }, duration + 500);

    return () => {
      clearTimeout(timeout);
      clearTimeout(completeTimeout);
    };
  }, [targetScore, spring, duration, onComplete]);

  const percentage = Math.round((targetScore / maxScore) * 100);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring', damping: 15 }}
      className="relative"
    >
      {/* Glowing ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, #FF6B4A, #E85537, #FFD700, #FF6B4A)',
          padding: 4,
        }}
        animate={
          isComplete
            ? {
                boxShadow: [
                  '0 0 30px rgba(255, 107, 74, 0.5)',
                  '0 0 60px rgba(255, 107, 74, 0.8)',
                  '0 0 30px rgba(255, 107, 74, 0.5)',
                ],
              }
            : {}
        }
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-full h-full rounded-full bg-[#0f0f2a]" />
      </motion.div>

      {/* Score display */}
      <div className="relative w-56 h-56 rounded-full flex flex-col items-center justify-center">
        <motion.span
          className="text-6xl font-bold text-white"
          style={{
            textShadow: '0 0 30px rgba(255, 107, 74, 0.6)',
          }}
        >
          <motion.span>{display}</motion.span>
        </motion.span>

        <span className="text-white/60 text-lg mt-1">/ {maxScore} points</span>

        {/* Percentage */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: duration / 1000 + 0.5 }}
          className="mt-2"
        >
          <span className="text-[#FF6B4A] font-semibold text-xl">{percentage}%</span>
        </motion.div>
      </div>

      {/* Sparkles on complete */}
      {isComplete && (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#FFD700] rounded-full"
              style={{
                left: '50%',
                top: '50%',
                boxShadow: '0 0 10px #FFD700',
              }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i * 45) * Math.PI / 180) * 120,
                y: Math.sin((i * 45) * Math.PI / 180) * 120,
              }}
              transition={{
                duration: 0.8,
                delay: i * 0.05,
                ease: 'easeOut',
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}
