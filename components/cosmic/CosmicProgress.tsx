'use client';

import { motion } from 'framer-motion';

interface CosmicProgressProps {
  current: number;
  total: number;
  onMilestone?: (milestone: number) => void;
}

export default function CosmicProgress({ current, total }: CosmicProgressProps) {
  const progress = (current / total) * 100;
  const milestones = [25, 50, 75];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Question counter */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-white/80 text-sm font-medium">
          Question {current} of {total}
        </span>
        <span className="text-[#FF6B4A] text-sm font-bold">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress bar container */}
      <div className="relative h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
        {/* Milestone markers */}
        {milestones.map((milestone) => (
          <div
            key={milestone}
            className="absolute top-0 bottom-0 w-0.5 bg-white/30 z-10"
            style={{ left: `${milestone}%` }}
          />
        ))}

        {/* Animated progress fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, #FF6B4A, #E85537, #FF8A6D)',
            boxShadow: '0 0 20px rgba(255, 107, 74, 0.5), 0 0 40px rgba(255, 107, 74, 0.3)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Glowing edge */}
        <motion.div
          className="absolute top-0 bottom-0 w-4 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
          }}
          animate={{ left: `calc(${progress}% - 8px)` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Milestone labels */}
      <div className="relative mt-2 h-4">
        {milestones.map((milestone) => (
          <motion.div
            key={milestone}
            className="absolute text-xs transform -translate-x-1/2"
            style={{ left: `${milestone}%` }}
            animate={{
              color: progress >= milestone ? '#FF6B4A' : 'rgba(255,255,255,0.4)',
              scale: progress >= milestone ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {milestone}%
          </motion.div>
        ))}
      </div>
    </div>
  );
}
