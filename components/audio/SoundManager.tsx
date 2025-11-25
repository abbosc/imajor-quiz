'use client';

import { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';

type SoundName = 'click' | 'whoosh' | 'milestone' | 'countdown' | 'reveal' | 'celebration';

interface SoundContextType {
  playSound: (name: SoundName) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  isMuted: boolean;
}

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize AudioContext on first user interaction
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  // Sound generators using Web Audio API
  const playClick = useCallback((ctx: AudioContext, vol: number) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(vol * 0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }, []);

  const playWhoosh = useCallback((ctx: AudioContext, vol: number) => {
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }

    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    source.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
    filter.Q.value = 1;

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    gainNode.gain.setValueAtTime(vol * 0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    source.start(ctx.currentTime);
  }, []);

  const playMilestone = useCallback((ctx: AudioContext, vol: number) => {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = ctx.currentTime + i * 0.1;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(vol * 0.25, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.4);
    });
  }, []);

  const playCountdown = useCallback((ctx: AudioContext, vol: number) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 440; // A4
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(vol * 0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }, []);

  const playReveal = useCallback((ctx: AudioContext, vol: number) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(300, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(vol * 0.3, ctx.currentTime);
    gainNode.gain.setValueAtTime(vol * 0.3, ctx.currentTime + 0.25);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  }, []);

  const playCelebration = useCallback((ctx: AudioContext, vol: number) => {
    // Multiple ascending notes for celebration
    const notes = [
      { freq: 523.25, time: 0 },     // C5
      { freq: 587.33, time: 0.08 },  // D5
      { freq: 659.25, time: 0.16 },  // E5
      { freq: 783.99, time: 0.24 },  // G5
      { freq: 1046.50, time: 0.32 }, // C6
    ];

    notes.forEach(({ freq, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = freq;
      osc.type = 'triangle';

      const startTime = ctx.currentTime + time;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol * 0.25, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });

    // Add a sparkle effect
    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = 2000 + Math.random() * 2000;
      osc.type = 'sine';

      const startTime = ctx.currentTime + 0.4 + i * 0.05;
      gain.gain.setValueAtTime(vol * 0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);

      osc.start(startTime);
      osc.stop(startTime + 0.1);
    }
  }, []);

  const playSound = useCallback((name: SoundName) => {
    if (isMuted) return;

    try {
      const ctx = getAudioContext();

      switch (name) {
        case 'click':
          playClick(ctx, volume);
          break;
        case 'whoosh':
          playWhoosh(ctx, volume);
          break;
        case 'milestone':
          playMilestone(ctx, volume);
          break;
        case 'countdown':
          playCountdown(ctx, volume);
          break;
        case 'reveal':
          playReveal(ctx, volume);
          break;
        case 'celebration':
          playCelebration(ctx, volume);
          break;
      }
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [isMuted, volume, getAudioContext, playClick, playWhoosh, playMilestone, playCountdown, playReveal, playCelebration]);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(Math.max(0, Math.min(1, vol)));
  }, []);

  const handleSetMuted = useCallback((muted: boolean) => {
    setIsMuted(muted);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <SoundContext.Provider value={{ playSound, setVolume, setMuted: handleSetMuted, isMuted }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundEffect() {
  const context = useContext(SoundContext);
  if (!context) {
    return {
      playSound: () => {},
      setVolume: () => {},
      setMuted: () => {},
      isMuted: false,
    };
  }
  return context;
}
