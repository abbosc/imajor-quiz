'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { QuizQuestion, QuizAnswer } from '@/types/quiz';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load heavy cosmic components
const StarField = dynamic(() => import('@/components/cosmic/StarField'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a1a] to-[#1a1a2e]" />,
});
const MilestoneModal = dynamic(() => import('@/components/cosmic/MilestoneModal'), { ssr: false });

// These are needed immediately for quiz interaction
import CosmicProgress from '@/components/cosmic/CosmicProgress';
import QuestionTransition from '@/components/cosmic/QuestionTransition';
import AnswerCard from '@/components/cosmic/AnswerCard';
import { useSoundEffect } from '@/components/audio/SoundManager';
import SoundToggle from '@/components/audio/SoundToggle';

// Comprehensive country list
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
  "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde",
  "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India",
  "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
  "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
  "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
  "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
  "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
  "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
  "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
  "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
  "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
  "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export default function QuizPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const { playSound } = useSoundEffect();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, QuizAnswer>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showCountryPrompt, setShowCountryPrompt] = useState(false);
  const [userCountry, setUserCountry] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [direction, setDirection] = useState(1);

  // Milestone tracking
  const [showMilestone, setShowMilestone] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<number | null>(null);
  const passedMilestones = useRef<Set<number>>(new Set());

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  // Check for milestones
  useEffect(() => {
    const milestones = [25, 50, 75];
    for (const milestone of milestones) {
      if (progress >= milestone && !passedMilestones.current.has(milestone)) {
        passedMilestones.current.add(milestone);
        setCurrentMilestone(milestone);
        setShowMilestone(true);
        break;
      }
    }
  }, [progress]);

  useEffect(() => {
    loadQuizData();
  }, []);

  const loadQuizData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate unique session token when quiz starts (prevents duplicate submissions)
      const sessionToken = `QS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('quizSessionToken', sessionToken);

      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select(`
          *,
          answer_choices (*)
        `)
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (questionsError) throw questionsError;

      if (!questionsData || questionsData.length === 0) {
        setError('No quiz questions found. Please contact the administrator.');
        setLoading(false);
        return;
      }

      const formattedQuestions: QuizQuestion[] = questionsData.map(q => {
        const question = q as any;
        return {
          ...question,
          answer_choices: (question.answer_choices as any[])
            .sort((a: any, b: any) => a.order_index - b.order_index)
        };
      });

      setQuestions(formattedQuestions);
      setLoading(false);
    } catch (error) {
      console.error('Error loading quiz data:', error);
      setError('Failed to load quiz. Please refresh the page or contact support.');
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer_choice_id: string, points: number) => {
    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion.id, {
      question_id: currentQuestion.id,
      answer_choice_id,
      points
    });
    setAnswers(newAnswers);

    setTimeout(async () => {
      setShowExplanation(false);
      playSound('whoosh');
      if (currentQuestionIndex < totalQuestions - 1) {
        setDirection(1);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Quiz complete - show country prompt first
        setShowCountryPrompt(true);
      }
    }, 500);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      playSound('whoosh');
      setShowExplanation(false);
      setDirection(-1);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle country selection continue
  const handleCountryContinue = async () => {
    setShowCountryPrompt(false);

    if (user) {
      // Authenticated user - auto-submit immediately
      await submitQuizForAuthenticatedUser(answers);
    } else {
      // Unauthenticated user - store quiz data and show auth prompt
      const quizData = {
        answers: Array.from(answers.entries()),
        sessionToken: localStorage.getItem('quizSessionToken'),
        country: userCountry,
        timestamp: Date.now()
      };
      localStorage.setItem('pendingQuiz', JSON.stringify(quizData));
      setShowAuthPrompt(true);
    }
  };

  // Auto-submit quiz for authenticated users (skips the form)
  const submitQuizForAuthenticatedUser = async (answersMap: Map<string, QuizAnswer>) => {
    try {
      setSubmitting(true);
      playSound('click');

      const sessionToken = localStorage.getItem('quizSessionToken');
      const totalScore = Array.from(answersMap.values()).reduce((sum, answer) => sum + answer.points, 0);
      const uniqueId = `IMJ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Calculate max_score from current questions (stored at submission time for data integrity)
      const maxScore = questions.reduce((sum, q) => {
        const maxPoints = Math.max(...q.answer_choices.map(c => c.points));
        return sum + maxPoints;
      }, 0);

      const { data: submissionData, error: submissionError } = await supabase
        .from('quiz_submissions')
        .insert({
          unique_id: uniqueId,
          user_name: profile?.full_name || user?.email?.split('@')[0] || 'User',
          user_email: user?.email,
          total_score: totalScore,
          max_score: maxScore,
          user_id: user?.id || null,
          session_token: sessionToken,
          country: userCountry || null
        })
        .select()
        .single();

      // Handle duplicate submission (unique constraint violation)
      if (submissionError?.code === '23505') {
        // Fetch existing submission with this session token
        const { data: existing } = await supabase
          .from('quiz_submissions')
          .select('unique_id')
          .eq('session_token', sessionToken)
          .single();

        if (existing) {
          localStorage.removeItem('quizSessionToken');
          router.push(`/results/${existing.unique_id}`);
          return;
        }
      }

      if (submissionError) throw submissionError;

      const answersArray = Array.from(answersMap.values()).map(answer => ({
        submission_id: submissionData.id,
        question_id: answer.question_id,
        answer_choice_id: answer.answer_choice_id,
        points_earned: answer.points
      }));

      const { error: answersError } = await supabase
        .from('submission_answers')
        .insert(answersArray);

      if (answersError) throw answersError;

      localStorage.removeItem('quizSessionToken');
      router.push(`/results/${uniqueId}`);
    } catch (error) {
      console.error('Error auto-submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      playSound('click');

      const sessionToken = localStorage.getItem('quizSessionToken');
      const totalScore = Array.from(answers.values()).reduce((sum, answer) => sum + answer.points, 0);
      const uniqueId = `IMJ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Calculate max_score from current questions (stored at submission time for data integrity)
      const maxScore = questions.reduce((sum, q) => {
        const maxPoints = Math.max(...q.answer_choices.map(c => c.points));
        return sum + maxPoints;
      }, 0);

      const { data: submissionData, error: submissionError } = await supabase
        .from('quiz_submissions')
        .insert({
          unique_id: uniqueId,
          user_name: userName,
          user_email: userEmail,
          total_score: totalScore,
          max_score: maxScore,
          user_id: user?.id || null,
          session_token: sessionToken,
          country: userCountry || null
        })
        .select()
        .single();

      // Handle duplicate submission (unique constraint violation)
      if (submissionError?.code === '23505') {
        const { data: existing } = await supabase
          .from('quiz_submissions')
          .select('unique_id')
          .eq('session_token', sessionToken)
          .single();

        if (existing) {
          localStorage.removeItem('quizSessionToken');
          router.push(`/results/${existing.unique_id}`);
          return;
        }
      }

      if (submissionError) throw submissionError;

      const answersArray = Array.from(answers.values()).map(answer => ({
        submission_id: submissionData.id,
        question_id: answer.question_id,
        answer_choice_id: answer.answer_choice_id,
        points_earned: answer.points
      }));

      const { error: answersError } = await supabase
        .from('submission_answers')
        .insert(answersArray);

      if (answersError) throw answersError;

      localStorage.removeItem('quizSessionToken');
      router.push(`/results/${uniqueId}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
      setSubmitting(false);
    }
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
            <p className="text-white/80 text-lg">Preparing your cosmic journey...</p>
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
            <h2 className="text-2xl font-bold text-white mb-2">Houston, We Have a Problem</h2>
            <p className="text-white/70 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="gradient-accent text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B4A]/30 transition-all duration-300"
            >
              Retry Launch
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Country selection prompt (shown after last question)
  if (showCountryPrompt) {
    const filteredCountries = COUNTRIES.filter(country =>
      country.toLowerCase().includes(countrySearch.toLowerCase())
    );

    return (
      <div className="min-h-screen relative overflow-hidden">
        <StarField />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl max-w-md w-full p-8"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#FF6B4A] to-[#FF8A6D] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">One Last Question!</h2>
              <p className="text-white/70 mb-6">Which country are you from?</p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              {/* Searchable country input */}
              <div className="relative">
                <input
                  type="text"
                  value={userCountry || countrySearch}
                  onChange={(e) => {
                    setCountrySearch(e.target.value);
                    setUserCountry('');
                  }}
                  placeholder="Type to search..."
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent"
                />
                {userCountry && (
                  <button
                    onClick={() => {
                      setUserCountry('');
                      setCountrySearch('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Country dropdown */}
              {countrySearch && !userCountry && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 w-full mt-2 bg-[#1a1a2e] border border-white/20 rounded-xl max-h-48 overflow-y-auto"
                >
                  {filteredCountries.length > 0 ? (
                    filteredCountries.slice(0, 8).map((country) => (
                      <button
                        key={country}
                        onClick={() => {
                          setUserCountry(country);
                          setCountrySearch('');
                        }}
                        className="w-full px-4 py-2.5 text-left text-white hover:bg-white/10 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        {country}
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-white/50 text-sm">No countries found</p>
                  )}
                </motion.div>
              )}
            </motion.div>

            <motion.button
              onClick={handleCountryContinue}
              disabled={!userCountry}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={userCountry ? { scale: 1.02 } : {}}
              whileTap={userCountry ? { scale: 0.98 } : {}}
              className={`w-full mt-6 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                userCountry
                  ? 'gradient-accent text-white hover:shadow-lg hover:shadow-[#FF6B4A]/30'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              Continue
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Auth prompt for unauthenticated users
  if (showAuthPrompt) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <StarField />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl max-w-md w-full p-8"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#FF6B4A] to-[#FF8A6D] rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Mission Complete!</h2>
              <p className="text-white/80 text-lg mb-2">Create your account to see your results</p>
              <p className="text-[#FF6B4A] font-semibold mb-6">
                You may win a 30-min consultation from top mentors!
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <Link
                href="/signup?redirect=quiz-results"
                className="block w-full gradient-accent text-white px-6 py-4 rounded-xl font-semibold text-center hover:shadow-lg hover:shadow-[#FF6B4A]/30 transition-all duration-300"
              >
                Create Account
              </Link>

              <Link
                href="/login?redirect=quiz-results"
                className="block w-full bg-white/10 border border-white/20 text-white px-6 py-4 rounded-xl font-semibold text-center hover:bg-white/20 transition-all duration-300"
              >
                Already have an account? Login
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center text-white/50 text-sm mt-6"
            >
              Your quiz progress has been saved
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (showUserForm) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <StarField />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl max-w-md w-full p-8"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white mb-2">Mission Complete!</h2>
              <p className="text-white/70 mb-6">Confirm your details to receive your cosmic results.</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent disabled:opacity-50"
                  placeholder="Space Explorer"
                />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent disabled:opacity-50"
                  placeholder="explorer@galaxy.com"
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={submitting}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full gradient-accent text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B4A]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Launching Results...
                  </span>
                ) : (
                  'Reveal My Cosmic Score'
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <StarField />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <p className="text-white/70">No questions available in this galaxy</p>
        </div>
      </div>
    );
  }

  const selectedAnswer = answers.get(currentQuestion?.id);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />

      {/* Milestone Modal */}
      <MilestoneModal
        milestone={currentMilestone}
        isVisible={showMilestone}
        onClose={() => setShowMilestone(false)}
      />

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <nav className="bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white" style={{ textShadow: '0 0 20px rgba(255, 107, 74, 0.5)' }}>
              iMajor
            </h1>
            <SoundToggle />
          </div>
        </nav>

        {/* Progress */}
        <div className="bg-black/10 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-6 py-6">
            <CosmicProgress current={currentQuestionIndex + 1} total={totalQuestions} />
          </div>
        </div>

        {/* Question */}
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            <QuestionTransition questionKey={currentQuestionIndex} direction={direction}>
              <motion.div
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white flex-1">
                    {currentQuestion.question_text}
                  </h2>
                  {currentQuestion.explanation && (
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="ml-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                      title="More info"
                    >
                      <svg className="w-6 h-6 text-[#FF6B4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showExplanation && currentQuestion.explanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 p-4 bg-[#87CEEB]/20 border border-[#87CEEB]/30 rounded-xl overflow-hidden"
                    >
                      <p className="text-sm text-white/90">{currentQuestion.explanation}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Answer Choices */}
                <div className="space-y-4">
                  {currentQuestion.answer_choices.map((choice, index) => {
                    const isSelected = selectedAnswer?.answer_choice_id === choice.id;
                    return (
                      <motion.div
                        key={choice.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <AnswerCard
                          choiceText={choice.choice_text}
                          isSelected={isSelected}
                          onClick={() => handleAnswerSelect(choice.id, choice.points)}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </QuestionTransition>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <motion.button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                whileHover={currentQuestionIndex > 0 ? { scale: 1.05 } : {}}
                whileTap={currentQuestionIndex > 0 ? { scale: 0.95 } : {}}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  currentQuestionIndex === 0
                    ? 'bg-white/5 text-white/30 cursor-not-allowed'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                }`}
              >
                ← Previous
              </motion.button>

              <div className="text-sm text-white/50 italic">
                Select an answer to continue
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
