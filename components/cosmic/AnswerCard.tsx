'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ParticleExplosion from './ParticleExplosion';
import { useSoundEffect } from '@/components/audio/SoundManager';

interface AnswerCardProps {
  choiceText: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function AnswerCard({
  choiceText,
  isSelected,
  onClick,
  disabled = false,
}: AnswerCardProps) {
  const { playSound } = useSoundEffect();
  const [showParticles, setShowParticles] = useState(false);
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;

    playSound('click');
    setClickPos({ x: e.clientX, y: e.clientY });
    setShowParticles(true);
    onClick();
  };

  return (
    <>
      <motion.button
        onClick={handleClick}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        animate={
          isSelected
            ? {
                borderColor: '#FF6B4A',
                boxShadow: '0 0 25px rgba(255, 107, 74, 0.4), inset 0 0 20px rgba(255, 107, 74, 0.1)',
              }
            : {
                borderColor: 'rgba(255, 255, 255, 0.2)',
                boxShadow: 'none',
              }
        }
        className={`
          w-full p-5 rounded-xl border-2 text-left transition-colors duration-200
          ${isSelected
            ? 'bg-[#FF6B4A]/10 border-[#FF6B4A]'
            : 'bg-white/5 border-white/20 hover:border-[#FF6B4A]/50 hover:bg-white/10'
          }
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="flex items-center gap-4">
          {/* Radio indicator */}
          <div
            className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200
              ${isSelected
                ? 'border-[#FF6B4A] bg-[#FF6B4A]'
                : 'border-white/40'
              }
            `}
          >
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 rounded-full bg-white"
              />
            )}
          </div>

          {/* Choice text */}
          <span className={`text-base ${isSelected ? 'text-white font-medium' : 'text-white/80'}`}>
            {choiceText}
          </span>
        </div>
      </motion.button>

      {/* Particle explosion on click */}
      {showParticles && (
        <ParticleExplosion
          x={clickPos.x}
          y={clickPos.y}
          onComplete={() => setShowParticles(false)}
        />
      )}
    </>
  );
}
