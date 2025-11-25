'use client';

import { useState, useEffect, useCallback } from 'react';

const MAJORS = [
  'Engineering',
  'Business',
  'Biology',
  'Computer Science',
  'Finance',
  'Economics',
  'Medicine'
];

const TYPING_SPEED = 80;
const DELETING_SPEED = 40;
const PAUSE_DURATION = 1800;

export default function TypewriterText() {
  const [currentMajorIndex, setCurrentMajorIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const getRandomSpeed = useCallback((baseSpeed: number) => {
    return baseSpeed + Math.random() * 40 - 20;
  }, []);

  useEffect(() => {
    const currentMajor = MAJORS[currentMajorIndex];

    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, PAUSE_DURATION);
      return () => clearTimeout(pauseTimeout);
    }

    const speed = isDeleting
      ? getRandomSpeed(DELETING_SPEED)
      : getRandomSpeed(TYPING_SPEED);

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentMajor.length) {
          setDisplayText(currentMajor.slice(0, displayText.length + 1));
        } else {
          setIsPaused(true);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentMajorIndex((prev) => (prev + 1) % MAJORS.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentMajorIndex, isPaused, getRandomSpeed]);

  return (
    <span className="inline-block leading-normal">
      <span className="gradient-text">{displayText}</span>
      <span
        className="inline-block w-[3px] h-[0.85em] bg-[#FF6B4A] animate-blink align-middle"
        aria-hidden="true"
      />
    </span>
  );
}
