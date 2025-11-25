'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useSoundEffect } from '@/components/audio/SoundManager';

// Cosmic components
import StarField from '@/components/cosmic/StarField';
import CountdownReveal from '@/components/results/CountdownReveal';
import ScoreCounter from '@/components/results/ScoreCounter';
import CosmicConfetti from '@/components/results/CosmicConfetti';
import SoundToggle from '@/components/audio/SoundToggle';

interface ZeroPointQuestion {
  section: string;
  question: string;
}

export default function ResultsPage() {
  const params = useParams();
  const uniqueId = params.id as string;
  const { playSound } = useSoundEffect();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100); // Will be calculated from DB
  const [interpretation, setInterpretation] = useState('');
  const [interpretationDescription, setInterpretationDescription] = useState('');
  const [zeroPointQuestions, setZeroPointQuestions] = useState<ZeroPointQuestion[]>([]);
  const [copied, setCopied] = useState(false);

  // Reveal state
  const [showCountdown, setShowCountdown] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [scoreAnimationComplete, setScoreAnimationComplete] = useState(false);

  useEffect(() => {
    loadResults();
  }, [uniqueId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch submission data
      const { data: submission, error: submissionError } = await supabase
        .from('quiz_submissions')
        .select('*')
        .eq('unique_id', uniqueId)
        .single();

      if (submissionError) {
        if (submissionError.code === 'PGRST116') {
          setError('Results not found. Please check your unique ID.');
        } else {
          throw submissionError;
        }
        setLoading(false);
        return;
      }

      if (!submission) {
        setError('Results not found. Please check your unique ID.');
        setLoading(false);
        return;
      }

      setName(submission.user_name);
      setEmail(submission.user_email);
      setScore(submission.total_score);

      // Calculate max possible score from all active questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select(`
          id,
          answer_choices (points)
        `)
        .eq('is_active', true);

      if (!questionsError && questionsData) {
        // For each question, find the maximum points among its answer choices
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

      // Fetch interpretation level
      const { data: interpretationLevels, error: interpretationError } = await supabase
        .from('interpretation_levels')
        .select('*')
        .lte('min_score', submission.total_score)
        .gte('max_score', submission.total_score)
        .order('order_index', { ascending: true })
        .limit(1)
        .single();

      if (!interpretationError && interpretationLevels) {
        setInterpretation(interpretationLevels.level_label);
        setInterpretationDescription(interpretationLevels.description || '');
      } else {
        // Fallback interpretation if none found in database
        if (submission.total_score >= 0 && submission.total_score < 50) {
          setInterpretation('Just Getting Started');
          setInterpretationDescription('There\'s plenty of room to explore!');
        } else if (submission.total_score >= 50 && submission.total_score < 100) {
          setInterpretation('Early Explorer');
          setInterpretationDescription('You\'re beginning your exploration journey!');
        } else if (submission.total_score >= 100 && submission.total_score < 150) {
          setInterpretation('Active Researcher');
          setInterpretationDescription('Great progress on your exploration journey!');
        } else if (submission.total_score >= 150 && submission.total_score < 200) {
          setInterpretation('Well-Informed Explorer');
          setInterpretationDescription('You\'ve done significant exploration!');
        } else {
          setInterpretation('Expert Navigator');
          setInterpretationDescription('Exceptional exploration depth!');
        }
      }

      // Fetch zero-point questions (questions where user scored 0)
      const { data: submissionAnswers, error: answersError } = await supabase
        .from('submission_answers')
        .select(`
          points_earned,
          questions (
            question_text,
            sections (
              title
            )
          )
        `)
        .eq('submission_id', submission.id)
        .eq('points_earned', 0);

      if (!answersError && submissionAnswers) {
        const zeroPoints: ZeroPointQuestion[] = submissionAnswers.map((answer: any) => ({
          section: answer.questions?.sections?.title || 'General',
          question: answer.questions?.question_text || ''
        })).filter((item: ZeroPointQuestion) => item.question);
        setZeroPointQuestions(zeroPoints);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading results:', error);
      setError('Failed to load results. Please try again or contact support.');
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

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    playSound('click');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    playSound('click');
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(255, 107, 74);
    doc.text('iMajor - Your Exploration To-Do List', 20, 20);

    // Subheader
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated for: ${name}`, 20, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 37);

    // Divider
    doc.setDrawColor(255, 107, 74);
    doc.setLineWidth(0.5);
    doc.line(20, 42, 190, 42);

    // Introduction
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    if (zeroPointQuestions.length > 0) {
      doc.text('Areas to explore to deepen your major exploration:', 20, 52);

      // Questions
      let yPosition = 65;
      zeroPointQuestions.forEach((item, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(10);
        doc.setTextColor(255, 107, 74);
        doc.text(item.section, 20, yPosition);

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        const lines = doc.splitTextToSize(`${index + 1}. ${item.question}`, 170);
        doc.text(lines, 25, yPosition + 7);

        yPosition += 15 + (lines.length - 1) * 5;
      });
    } else {
      doc.text('Congratulations! You scored points on all questions.', 20, 52);
      doc.text('Keep up the great exploration work!', 20, 62);
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text('iMajor - Major Exploration Platform', 105, 285, { align: 'center' });
    }

    doc.save(`imajor-todo-${uniqueId}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <StarField />
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
            <p className="text-white/80 text-lg">Loading your cosmic results...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <StarField />
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
            <h2 className="text-2xl font-bold text-white mb-2">Lost in Space</h2>
            <p className="text-white/70 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-block gradient-accent text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B4A]/30 transition-all duration-300"
            >
              Return to Home Base
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  // Show countdown first
  if (showCountdown) {
    return (
      <AnimatePresence>
        <CountdownReveal onComplete={handleCountdownComplete} />
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />
      <CosmicConfetti trigger={triggerConfetti} />

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <nav className="bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white" style={{ textShadow: '0 0 20px rgba(255, 107, 74, 0.5)' }}>
              iMajor
            </Link>
            <SoundToggle />
          </div>
        </nav>

        {/* Results */}
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Congratulations Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: showResults ? 1 : 0, y: showResults ? 0 : 30 }}
              transition={{ duration: 0.6 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 md:p-12 mb-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                className="inline-block px-4 py-2 bg-[#FF6B4A]/20 text-[#FF6B4A] rounded-full text-sm font-semibold mb-4"
              >
                Mission Complete
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold text-white mb-4"
                style={{ textShadow: '0 0 30px rgba(255, 255, 255, 0.2)' }}
              >
                Congratulations, {name}!
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-white/70 mb-8"
              >
                You&apos;ve completed your cosmic journey through the Major Exploration Quiz
              </motion.p>

              {/* Animated Score Display */}
              <div className="flex justify-center mb-8">
                <ScoreCounter
                  targetScore={score}
                  maxScore={maxScore}
                  duration={2000}
                  onComplete={handleScoreAnimationComplete}
                />
              </div>

              {/* Interpretation */}
              <AnimatePresence>
                {scoreAnimationComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                  >
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {interpretation}
                    </h2>
                    <p className="text-white/70">
                      {interpretationDescription || `You scored ${percentage}% on your exploration journey!`}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Unique ID */}
              <AnimatePresence>
                {scoreAnimationComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-black/30 rounded-xl p-6 mb-6"
                  >
                    <p className="text-sm text-white/60 mb-2">Your Cosmic ID</p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      <code className="text-lg font-mono font-bold text-[#FF6B4A]">
                        {uniqueId}
                      </code>
                      <motion.button
                        onClick={copyToClipboard}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm font-medium text-white hover:bg-white/20 transition-all duration-200"
                      >
                        {copied ? 'Copied!' : 'Copy Link'}
                      </motion.button>
                    </div>
                    <p className="text-xs text-white/50 mt-2">
                      Save this ID to access your results anytime
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Action Cards */}
            <AnimatePresence>
              {scoreAnimationComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="grid md:grid-cols-2 gap-6 mb-8"
                >
                  {/* Download To-Do List */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
                  >
                    <div className="w-12 h-12 gradient-accent rounded-xl mb-4 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Download Your To-Do List
                    </h3>
                    <p className="text-white/60 mb-4">
                      Get a PDF with personalized action items based on areas you have not explored yet
                    </p>
                    <motion.button
                      onClick={downloadPDF}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full gradient-accent text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B4A]/30 transition-all duration-300"
                    >
                      Download PDF
                    </motion.button>
                  </motion.div>

                  {/* Join Telegram */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
                  >
                    <div className="w-12 h-12 gradient-accent rounded-xl mb-4 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Join Our Community
                    </h3>
                    <p className="text-white/60 mb-4">
                      Connect with other explorers, get expert advice, and access more resources
                    </p>
                    <motion.a
                      href="https://t.me/your_channel"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="block w-full bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 text-center transition-all duration-300"
                    >
                      Join Telegram
                    </motion.a>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next Steps */}
            <AnimatePresence>
              {scoreAnimationComplete && zeroPointQuestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8"
                >
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Your Next Mission Objectives
                  </h3>
                  <p className="text-white/60 mb-6">
                    Based on your journey, here are areas to explore:
                  </p>
                  <div className="space-y-4">
                    {zeroPointQuestions.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex gap-4 p-4 bg-black/20 rounded-xl hover:bg-black/30 transition-colors"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF6B4A]/20 flex items-center justify-center">
                          <span className="text-[#FF6B4A] font-semibold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm text-[#FF6B4A] font-semibold">{item.section}</p>
                          <p className="text-white/90">{item.question}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Back to Home */}
            <AnimatePresence>
              {scoreAnimationComplete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center mt-8"
                >
                  <Link
                    href="/"
                    className="inline-block text-white/60 hover:text-[#FF6B4A] transition-colors duration-200"
                  >
                    ← Return to Home Base
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
