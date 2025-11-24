'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { QuizQuestion, QuizAnswer } from '@/types/quiz';
import { v4 as uuidv4 } from 'uuid';

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, QuizAnswer>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  useEffect(() => {
    loadQuizData();
  }, []);

  const loadQuizData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch questions with answer choices
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

      // Format questions with sorted answer choices
      const formattedQuestions: QuizQuestion[] = questionsData.map(q => ({
        ...q,
        answer_choices: (q.answer_choices as any[])
          .sort((a, b) => a.order_index - b.order_index)
      }));

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

    // Auto-advance to next question after a short delay
    setTimeout(() => {
      setShowExplanation(false); // Reset explanation visibility
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Quiz completed, show user info form
        setShowUserForm(true);
      }
    }, 400);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed, show user info form
      setShowUserForm(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setShowExplanation(false);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      // Calculate total score
      const totalScore = Array.from(answers.values()).reduce((sum, answer) => sum + answer.points, 0);

      // Generate unique ID
      const uniqueId = `IMJ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Save submission to database
      const { data: submissionData, error: submissionError } = await supabase
        .from('quiz_submissions')
        .insert({
          unique_id: uniqueId,
          user_name: userName,
          user_email: userEmail,
          total_score: totalScore
        })
        .select()
        .single();

      if (submissionError) throw submissionError;

      // Save individual answers
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

      // Redirect to results page
      router.push(`/results/${uniqueId}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B4A]"></div>
          <p className="mt-4 text-[#64748B]">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="card max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Error Loading Quiz</h2>
          <p className="text-[#64748B] mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="gradient-accent text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (showUserForm) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="card max-w-md w-full p-8">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-2">Almost Done!</h2>
          <p className="text-[#64748B] mb-6">Enter your details to receive your results and unique ID.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#0F172A] mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                disabled={submitting}
                className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent text-[#0F172A] disabled:bg-gray-100"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0F172A] mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
                disabled={submitting}
                className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent text-[#0F172A] disabled:bg-gray-100"
                placeholder="john@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full gradient-accent text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'View My Results'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#64748B]">No questions available</p>
        </div>
      </div>
    );
  }

  const selectedAnswer = answers.get(currentQuestion?.id);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <nav className="bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold gradient-text">iMajor</h1>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#64748B]">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <span className="text-sm font-medium text-[#64748B]">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-[#E2E8F0] rounded-full h-2">
            <div
              className="gradient-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Question */}
          <div className="card p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] flex-1">
                {currentQuestion.question_text}
              </h2>
              {currentQuestion.explanation && (
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="ml-4 p-2 rounded-full hover:bg-[#F8FAFC] transition-colors"
                  title="More info"
                >
                  <svg
                    className="w-6 h-6 text-[#FF6B4A]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Explanation */}
            {showExplanation && currentQuestion.explanation && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-[#0F172A]">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Answer Choices */}
            <div className="space-y-4">
              {currentQuestion.answer_choices.map((choice) => {
                const isSelected = selectedAnswer?.answer_choice_id === choice.id;
                return (
                  <button
                    key={choice.id}
                    onClick={() => handleAnswerSelect(choice.id, choice.points)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      isSelected
                        ? 'border-[#FF6B4A] bg-[#FF6B4A]/5'
                        : 'border-[#E2E8F0] hover:border-[#FF6B4A]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg text-[#0F172A] font-medium">
                        {choice.choice_text}
                      </span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-[#FF6B4A]' : 'border-[#E2E8F0]'
                      }`}>
                        {isSelected && (
                          <div className="w-3 h-3 rounded-full bg-[#FF6B4A]"></div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                currentQuestionIndex === 0
                  ? 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                  : 'bg-white border-2 border-[#E2E8F0] text-[#0F172A] hover:border-[#FF6B4A]'
              }`}
            >
              Previous
            </button>

            <div className="text-sm text-[#64748B] italic">
              Select an answer to continue
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
