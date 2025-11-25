'use client';

import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useSoundEffect } from '@/components/audio/SoundManager';

interface CosmicConfettiProps {
  trigger: boolean;
}

export default function CosmicConfetti({ trigger }: CosmicConfettiProps) {
  const { playSound } = useSoundEffect();

  const fireConfetti = useCallback(() => {
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0.6,
      decay: 0.94,
      startVelocity: 30,
      colors: ['#FF6B4A', '#E85537', '#FFD700', '#FFFFFF', '#87CEEB', '#FF8A6D'],
    };

    // Center burst
    confetti({
      ...defaults,
      particleCount: 60,
      origin: { x: 0.5, y: 0.5 },
      shapes: ['circle', 'star'],
      scalar: 1.2,
    });

    // Left and right bursts
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 40,
        origin: { x: 0.2, y: 0.6 },
        shapes: ['circle', 'star'],
      });
      confetti({
        ...defaults,
        particleCount: 40,
        origin: { x: 0.8, y: 0.6 },
        shapes: ['circle', 'star'],
      });
    }, 200);

    // Top burst
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 50,
        origin: { x: 0.5, y: 0.3 },
        startVelocity: 45,
        shapes: ['circle', 'star'],
        scalar: 1.5,
      });
    }, 400);

    // Final shower
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { x: 0.5, y: 0 },
        colors: ['#FF6B4A', '#FFD700', '#FFFFFF'],
        gravity: 1.2,
        shapes: ['circle'],
        scalar: 0.8,
      });
    }, 600);
  }, []);

  useEffect(() => {
    if (trigger) {
      playSound('celebration');
      fireConfetti();
    }
  }, [trigger, fireConfetti, playSound]);

  return null;
}
