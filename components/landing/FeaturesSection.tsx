'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';

const features = [
  {
    id: 'tasks',
    title: 'Exploration Tasks',
    description: 'Guided tasks to help you explore your major deeply. Complete them and you might even surpass some university students in knowledge!',
    image: '/images/tasks.png',
    href: '/tasks',
    highlight: true,
  },
  {
    id: 'dashboard',
    title: 'Your Dashboard',
    description: 'Your central hub for tracking all your college prep progress in one place.',
    image: '/images/dashboard.png',
    href: '/dashboard',
  },
  {
    id: 'universities',
    title: 'University Tracker',
    description: 'Organize and track all your university applications, deadlines, and decisions.',
    image: '/images/universities.png',
    href: '/universities',
  },
  {
    id: 'tests',
    title: 'Test Management',
    description: 'Track your SAT, TOEFL, and other standardized test preparations and scores.',
    image: '/images/tests.png',
    href: '/tests',
  },
  {
    id: 'activities',
    title: 'Activities Log',
    description: 'Document all your extracurricular activities in Common App format.',
    image: '/images/activities.png',
    href: '/activities',
  },
  {
    id: 'honors',
    title: 'Honors & Awards',
    description: 'Keep track of all your achievements, awards, and recognitions.',
    image: '/images/honors.png',
    href: '/honors',
  },
  {
    id: 'essays',
    title: 'Essay Organizer',
    description: 'Manage all your college application essays in one organized space.',
    image: '/images/essays.png',
    href: '/essays',
  },
  {
    id: 'recs',
    title: 'Recommendation Letters',
    description: 'Track your recommendation letter requests and their status.',
    image: '/images/recs.png',
    href: '/recommendations',
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });
  const isEven = index % 2 === 0;

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const imageYSpring = useSpring(imageY, { stiffness: 100, damping: 30 });

  const textY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const textYSpring = useSpring(textY, { stiffness: 100, damping: 30 });

  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.02, 0.95]);
  const imageScaleSpring = useSpring(imageScale, { stiffness: 100, damping: 30 });

  const imageRotate = useTransform(scrollYProgress, [0, 0.5, 1], [isEven ? -2 : 2, 0, isEven ? 2 : -2]);
  const imageRotateSpring = useSpring(imageRotate, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`py-12 sm:py-16 md:py-24 ${feature.highlight ? 'bg-gradient-to-r from-[#FF6B4A]/5 to-[#FF8A6D]/5' : ''}`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-6 sm:gap-8 lg:gap-16`}>
          {/* Image with parallax */}
          <motion.div
            className="flex-1 w-full"
            style={{ y: imageYSpring }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: isEven ? -50 : 50 }}
              animate={isInView ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.85, x: isEven ? -50 : 50 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{ scale: imageScaleSpring, rotateZ: imageRotateSpring }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#E2E8F0]"
            >
              <Image
                src={feature.image}
                alt={feature.title}
                width={600}
                height={400}
                className="w-full h-auto"
              />
              {/* Glow overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-[#FF6B4A]/0 via-transparent to-[#FF6B4A]/10"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          </motion.div>

          {/* Text with different parallax speed */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            style={{ y: textYSpring }}
          >
            <motion.h3
              initial={{ opacity: 0, y: 30, x: isEven ? 30 : -30 }}
              animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: 30, x: isEven ? 30 : -30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] mb-3 sm:mb-4"
            >
              {feature.title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg text-[#64748B] mb-4 sm:mb-6"
            >
              {feature.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={feature.href}
                  className={`inline-block px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    feature.highlight
                      ? 'gradient-accent text-white hover:shadow-lg hover:shadow-[#FF6B4A]/30'
                      : 'bg-[#0F172A]/5 border border-[#E2E8F0] text-[#0F172A] hover:bg-[#0F172A]/10 hover:border-[#FF6B4A]/30'
                  }`}
                >
                  {feature.highlight ? 'Start Exploring' : 'Learn More'}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' });

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-24 overflow-hidden">
      {/* Section Header */}
      <div className="container mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-[#FF6B4A]/10 text-[#FF6B4A] mb-3 sm:mb-4"
          >
            All Free Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#0F172A] mb-3 sm:mb-4"
          >
            Everything You Need to{' '}
            <span className="gradient-text">Succeed</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm sm:text-lg text-[#64748B] max-w-2xl mx-auto"
          >
            Comprehensive tools designed to help you navigate your college application journey
          </motion.p>
        </motion.div>
      </div>

      {/* Feature Cards */}
      {features.map((feature, index) => (
        <FeatureCard key={feature.id} feature={feature} index={index} />
      ))}
    </section>
  );
}
