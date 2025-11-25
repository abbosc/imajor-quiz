'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundEffect } from '@/components/audio/SoundManager';

interface CountdownRevealProps {
  onComplete: () => void;
}

export default function CountdownReveal({ onComplete }: CountdownRevealProps) {
  const [count, setCount] = useState(3);
  const { playSound } = useSoundEffect();

  useEffect(() => {
    if (count > 0) {
      playSound('countdown');
      const timer = setTimeout(() => setCount(count - 1), 900);
      return () => clearTimeout(timer);
    } else {
      playSound('reveal');
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [count, onComplete, playSound]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'linear-gradient(to bottom, #0a0a1a, #0f0f2a, #1a1a3a)',
      }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 107, 74, 0.3) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {count > 0 ? (
          <motion.div
            key={count}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: 'easeOut',
            }}
            className="relative"
          >
            {/* Number with glow */}
            <span
              className="text-[12rem] font-bold text-white"
              style={{
                textShadow: '0 0 60px rgba(255, 107, 74, 0.8), 0 0 120px rgba(255, 107, 74, 0.4)',
              }}
            >
              {count}
            </span>

            {/* Ring effect */}
            <motion.div
              className="absolute inset-0 border-4 border-[#FF6B4A] rounded-full"
              style={{
                top: '50%',
                left: '50%',
                width: 200,
                height: 200,
                marginLeft: -100,
                marginTop: -100,
              }}
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-6xl font-bold text-white"
            style={{
              textShadow: '0 0 40px rgba(255, 215, 0, 0.8)',
            }}
          >
            ✨
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
