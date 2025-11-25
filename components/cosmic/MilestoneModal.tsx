'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundEffect } from '@/components/audio/SoundManager';

interface MilestoneModalProps {
  milestone: number | null;
  isVisible: boolean;
  onClose: () => void;
}

const milestoneData: Record<number, { title: string; subtitle: string; emoji: string }> = {
  25: {
    title: 'Liftoff!',
    subtitle: "You're exploring the cosmos!",
    emoji: '🚀',
  },
  50: {
    title: 'Halfway There!',
    subtitle: 'Through the galaxy you go!',
    emoji: '🌟',
  },
  75: {
    title: 'Almost There!',
    subtitle: 'Your destination awaits!',
    emoji: '✨',
  },
};

export default function MilestoneModal({ milestone, isVisible, onClose }: MilestoneModalProps) {
  const { playSound } = useSoundEffect();

  useEffect(() => {
    if (isVisible && milestone) {
      playSound('milestone');
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, milestone, onClose, playSound]);

  const data = milestone ? milestoneData[milestone] : null;

  return (
    <AnimatePresence>
      {isVisible && data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(10, 10, 26, 0.8)', backdropFilter: 'blur(8px)' }}
        >
          {/* Star burst background */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * 18) * Math.PI / 180) * (100 + Math.random() * 100),
                  y: Math.sin((i * 18) * Math.PI / 180) * (100 + Math.random() * 100),
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.03,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>

          {/* Content */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="text-center p-8 relative z-10"
          >
            {/* Emoji with glow */}
            <motion.div
              className="text-7xl mb-6"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 0.6,
                ease: 'easeInOut',
              }}
              style={{
                filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))',
              }}
            >
              {data.emoji}
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-5xl font-bold text-white mb-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                textShadow: '0 0 30px rgba(255, 107, 74, 0.8)',
              }}
            >
              {data.title}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="text-xl text-white/80"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {data.subtitle}
            </motion.p>

            {/* Progress indicator */}
            <motion.div
              className="mt-6 text-[#FF6B4A] font-bold text-2xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
            >
              {milestone}% Complete
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
