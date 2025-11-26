'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// Cosmic components
import ParallaxStarField from '@/components/cosmic/ParallaxStarField';
import FloatingParticles from '@/components/cosmic/FloatingParticles';
import CosmicOrbs from '@/components/cosmic/CosmicOrbs';
import CountdownReveal from '@/components/results/CountdownReveal';
import ScoreCounter from '@/components/results/ScoreCounter';
import CosmicConfetti from '@/components/results/CosmicConfetti';

// Feature data
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

// Interpretation tiers
function getInterpretation(percentage: number) {
  if (percentage <= 33) {
    return {
      level: 'Explorer',
      emoji: '🌱',
      message: "Your adventure is just beginning! You have so much exciting discovery ahead. Start with our exploration tasks to build your foundation.",
      color: 'from-blue-500 to-cyan-500',
    };
  } else if (percentage <= 66) {
    return {
      level: 'Pathfinder',
      emoji: '🧭',
      message: "You're finding your way! Keep exploring to solidify your path. Our tools can help you go even deeper.",
      color: 'from-purple-500 to-pink-500',
    };
  } else {
    return {
      level: 'Trailblazer',
      emoji: '🚀',
      message: "You're well-prepared! You've done your homework. Now let's turn that knowledge into action.",
      color: 'from-orange-500 to-red-500',
    };
  }
}

// Parallax Results Card
function ParallaxResultsCard({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const ySpring = useSpring(y, { stiffness: 100, damping: 30 });
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.98]);
  const scaleSpring = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      style={{ y: ySpring, scale: scaleSpring }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 sm:p-8 md:p-12 mb-6 sm:mb-8 text-center gpu-accelerated"
    >
      {children}
    </motion.div>
  );
}

// Parallax Telegram CTA
function ParallaxTelegramCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const ySpring = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
      style={{ y: ySpring }}
      className="bg-gradient-to-r from-[#0088cc]/20 to-[#0088cc]/10 backdrop-blur-lg border border-[#0088cc]/30 rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8 text-center gpu-accelerated"
    >
      <motion.div
        className="w-12 h-12 sm:w-16 sm:h-16 bg-[#0088cc] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
        animate={{
          boxShadow: [
            '0 0 20px rgba(0, 136, 204, 0.3)',
            '0 0 40px rgba(0, 136, 204, 0.5)',
            '0 0 20px rgba(0, 136, 204, 0.3)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
        </svg>
      </motion.div>
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
        Win a Free Consultation!
      </h3>
      <p className="text-sm sm:text-base text-white/70 mb-4 sm:mb-6 max-w-md mx-auto">
        Join our Telegram channel and wait for the results on <span className="text-[#0088cc] font-semibold">December 1st</span>.
        Seven lucky participants will receive a free 1-on-1 consultation!
      </p>
      <motion.a
        href="https://t.me/imajorapp"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-[#0088cc] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 136, 204, 0.5)' }}
        whileTap={{ scale: 0.98 }}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
        </svg>
        Join Telegram Channel
      </motion.a>
    </motion.div>
  );
}

// Parallax Feature Section
function ParallaxFeatureSection({ feature, index }: { feature: typeof features[0]; index: number }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const isEven = index % 2 === 0;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Image parallax - moves slower than scroll (depth effect)
  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const imageYSpring = useSpring(imageY, { stiffness: 100, damping: 30 });

  // Text parallax - slightly different speed for depth separation
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const textYSpring = useSpring(textY, { stiffness: 100, damping: 30 });

  // Scale effect for depth
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.02, 0.95]);
  const imageScaleSpring = useSpring(imageScale, { stiffness: 100, damping: 30 });

  // Rotation for subtle 3D effect
  const imageRotate = useTransform(scrollYProgress, [0, 0.5, 1], [isEven ? -2 : 2, 0, isEven ? 2 : -2]);
  const imageRotateSpring = useSpring(imageRotate, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`py-12 sm:py-16 lg:py-20 parallax-section ${feature.highlight ? 'bg-gradient-to-r from-[#FF6B4A]/10 to-[#FF8A6D]/5' : ''}`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-6 sm:gap-8 lg:gap-16`}>
          {/* Image with parallax */}
          <motion.div
            className="flex-1 w-full gpu-accelerated"
            style={{ y: imageYSpring }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: isEven ? -50 : 50 }}
              animate={isInView ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.85, x: isEven ? -50 : 50 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{ scale: imageScaleSpring, rotateZ: imageRotateSpring }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10"
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
                className="absolute inset-0 bg-gradient-to-tr from-[#FF6B4A]/0 via-transparent to-white/5"
                animate={{
                  opacity: [0.3, 0.5, 0.3],
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
            className="flex-1 text-center lg:text-left gpu-accelerated"
            style={{ y: textYSpring }}
          >
            <motion.h3
              initial={{ opacity: 0, y: 30, x: isEven ? 30 : -30 }}
              animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: 30, x: isEven ? 30 : -30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4"
            >
              {feature.title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg text-white/70 mb-4 sm:mb-6"
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
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30'
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

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const uniqueId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        localStorage.setItem('pendingResultsId', uniqueId);
        router.push('/signup?redirect=quiz-results');
      } else {
        setAuthChecked(true);
      }
    }
  }, [user, authLoading, uniqueId, router]);

  const [name, setName] = useState('');
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100);

  // Reveal state
  const [showCountdown, setShowCountdown] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [scoreAnimationComplete, setScoreAnimationComplete] = useState(false);

  useEffect(() => {
    if (authChecked) {
      loadResults();
    }
  }, [uniqueId, authChecked]);

  const loadResults = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: submission, error: submissionError } = await supabase
        .from('quiz_submissions')
        .select('*')
        .eq('unique_id', uniqueId)
        .single();

      if (submissionError) {
        if (submissionError.code === 'PGRST116') {
          setError('Results not found. Please check your link.');
        } else {
          throw submissionError;
        }
        setLoading(false);
        return;
      }

      if (!submission) {
        setError('Results not found. Please check your link.');
        setLoading(false);
        return;
      }

      setName(submission.user_name);
      setScore(submission.total_score);

      // Calculate max score
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select(`id, answer_choices (points)`)
        .eq('is_active', true);

      if (!questionsError && questionsData) {
        const calculatedMaxScore = questionsData.reduce((total, question) => {
          const choices = question.answer_choices as { points: number }[];
          if (choices && choices.length > 0) {
            const maxPoints = Math.max(...choices.map(c => c.points));
            return total + maxPoints;
          }
          return total;
        }, 0);
        setMaxScore(calculatedMaxScore > 0 ? calculatedMaxScore : 100);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading results:', error);
      setError('Failed to load results. Please try again.');
      setLoading(false);
    }
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setShowResults(true);
  };

  const handleScoreAnimationComplete = () => {
    setScoreAnimationComplete(true);
    setTriggerConfetti(true);
  };

  if (authLoading || !authChecked || loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <ParallaxStarField />
        <FloatingParticles />
        <CosmicOrbs />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-[#FF6B4A] border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-white/80 text-lg">Loading your results...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <ParallaxStarField />
        <FloatingParticles />
        <CosmicOrbs />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl max-w-md w-full p-8 text-center"
          >
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
            <p className="text-white/70 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-block gradient-accent text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B4A]/30 transition-all"
            >
              Go Home
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const interpretation = getInterpretation(percentage);

  if (showCountdown) {
    return <CountdownReveal onComplete={handleCountdownComplete} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Parallax Background Layers */}
      <ParallaxStarField />
      <FloatingParticles />
      <CosmicOrbs />
      <CosmicConfetti trigger={triggerConfetti} />

      <div className="relative z-10">
        {/* Header */}
        <nav className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-20">
          <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-white" style={{ textShadow: '0 0 20px rgba(255, 107, 74, 0.5)' }}>
              iMajor
            </Link>
          </div>
        </nav>

        {/* Results Section */}
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Main Results Card with Parallax */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: showResults ? 1 : 0, y: showResults ? 0 : 30 }}
              transition={{ duration: 0.6 }}
            >
              <ParallaxResultsCard>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2"
                >
                  Congratulations, {name}!
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm sm:text-base text-white/60 mb-6 sm:mb-8"
                >
                  You&apos;ve completed the Major Exploration Quiz
                </motion.p>

                {/* Score Display */}
                <div className="flex justify-center mb-8">
                  <ScoreCounter
                    targetScore={score}
                    maxScore={maxScore}
                    duration={2000}
                    onComplete={handleScoreAnimationComplete}
                  />
                </div>

                {/* Interpretation */}
                {scoreAnimationComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${interpretation.color} mb-4`}
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(255, 255, 255, 0.2)',
                          '0 0 40px rgba(255, 255, 255, 0.3)',
                          '0 0 20px rgba(255, 255, 255, 0.2)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-2xl">{interpretation.emoji}</span>
                      <span className="text-xl font-bold text-white">{interpretation.level}</span>
                    </motion.div>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto">
                      {interpretation.message}
                    </p>
                  </motion.div>
                )}
              </ParallaxResultsCard>
            </motion.div>

            {/* Telegram CTA with Parallax */}
            {scoreAnimationComplete && <ParallaxTelegramCTA />}
          </div>
        </div>

        {/* Feature Sections with Parallax */}
        {scoreAnimationComplete && (
          <div className="pb-12 sm:pb-16">
            <div className="container mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
                  Free Tools to Help You Succeed
                </h2>
                <p className="text-white/60 text-sm sm:text-lg">
                  Everything you need to prepare for college applications
                </p>
              </motion.div>
            </div>

            {features.map((feature, index) => (
              <ParallaxFeatureSection key={feature.id} feature={feature} index={index} />
            ))}

            {/* Final CTA with Parallax */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center"
            >
              <motion.h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(255, 107, 74, 0.3)',
                    '0 0 40px rgba(255, 107, 74, 0.5)',
                    '0 0 20px rgba(255, 107, 74, 0.3)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Ready to Start Your Journey?
              </motion.h2>
              <p className="text-white/60 mb-6 sm:mb-8 max-w-md mx-auto text-base sm:text-lg">
                Access all these features for free and take control of your college prep.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/dashboard"
                  className="inline-block gradient-accent text-white px-10 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#FF6B4A]/30 transition-all duration-300"
                >
                  Go to Dashboard
                </Link>
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
