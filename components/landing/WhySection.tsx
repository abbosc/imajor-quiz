'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const reasons = [
  {
    id: 'exploration',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Major Exploration',
    description: 'Discover your path with guided quizzes and exploration tasks designed to help you understand what you truly want to study.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'all-in-one',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    title: 'All-in-One Platform',
    description: 'Keep all your application materials in one place. Universities, essays, activities, tests - everything organized and accessible.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'safe',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Safe & Private',
    description: 'Your data belongs to you. Admins cannot see your personal application materials like university lists, test scores, or essays.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'free',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Free',
    description: 'No hidden costs, no premium tiers, no paywalls. All features are completely free for every student.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'no-chaos',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: 'No More Chaos',
    description: 'Say goodbye to scattered Notion pages, Google Docs, and spreadsheets. Everything in one clean, organized space.',
    color: 'from-rose-500 to-red-500',
  },
  {
    id: 'growing',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: 'Growing Features',
    description: 'We\'re constantly adding new tools and features based on student feedback. Your success drives our development.',
    color: 'from-indigo-500 to-violet-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

function ReasonCard({ reason, index }: { reason: typeof reasons[0]; index: number }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] hover:border-[#FF6B4A]/30 transition-colors duration-300 hover:shadow-xl hover:shadow-[#FF6B4A]/10"
    >
      {/* Icon with gradient background */}
      <motion.div
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${reason.color} flex items-center justify-center text-white mb-4 sm:mb-5 shadow-lg`}
        whileHover={{
          scale: 1.1,
          rotate: [0, -5, 5, 0],
          transition: { duration: 0.4 }
        }}
      >
        {reason.icon}
      </motion.div>

      {/* Title */}
      <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-2 sm:mb-3 group-hover:text-[#FF6B4A] transition-colors duration-300">
        {reason.title}
      </h3>

      {/* Description */}
      <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
        {reason.description}
      </p>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF6B4A]/0 to-[#FF8A6D]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ zIndex: -1 }}
      />
    </motion.div>
  );
}

export default function WhySection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 md:py-32 bg-[#F8FAFC] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-[#FF6B4A] opacity-[0.03] rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#FF6B4A] opacity-[0.03] rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-[#FF6B4A]/10 text-[#FF6B4A] mb-3 sm:mb-4"
          >
            Why Choose Us
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#0F172A] mb-3 sm:mb-4"
          >
            Why <span className="gradient-text">iMajor</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm sm:text-lg text-[#64748B] max-w-2xl mx-auto"
          >
            Built by students, for students. We understand the challenges of college applications.
          </motion.p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {reasons.map((reason, index) => (
            <ReasonCard key={reason.id} reason={reason} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
