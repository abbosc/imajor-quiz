'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  // Handle pending quiz submission after user is authenticated
  useEffect(() => {
    if (user && redirect === 'quiz-results') {
      submitPendingQuiz();
    }
  }, [user, redirect]);

  const submitPendingQuiz = async () => {
    const pendingQuizData = localStorage.getItem('pendingQuiz');
    if (!pendingQuizData || !user) return;

    try {
      const quizData = JSON.parse(pendingQuizData);
      const answers = new Map(quizData.answers);

      const totalScore = Array.from(answers.values()).reduce((sum: number, answer: any) => sum + answer.points, 0);
      const uniqueId = `IMJ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Calculate max_score from current active questions
      const { data: questions } = await supabase
        .from('questions')
        .select('id, answer_choices(points)')
        .eq('is_active', true);

      const maxScore = questions?.reduce((sum: number, q: any) => {
        const points = q.answer_choices?.map((c: any) => c.points) || [0];
        return sum + Math.max(...points);
      }, 0) || 0;

      const { data: submissionData, error: submissionError } = await supabase
        .from('quiz_submissions')
        .insert({
          unique_id: uniqueId,
          user_name: fullName || user.email?.split('@')[0] || 'User',
          user_email: user.email,
          total_score: totalScore,
          max_score: maxScore,
          user_id: user.id
        })
        .select()
        .single();

      if (submissionError) throw submissionError;

      const answersArray = Array.from(answers.values()).map((answer: any) => ({
        submission_id: submissionData.id,
        question_id: answer.question_id,
        answer_choice_id: answer.answer_choice_id,
        points_earned: answer.points
      }));

      await supabase.from('submission_answers').insert(answersArray);

      localStorage.removeItem('pendingQuiz');
      router.push(`/results/${uniqueId}`);
    } catch (error) {
      console.error('Error submitting pending quiz:', error);
      localStorage.removeItem('pendingQuiz');
      router.push('/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password, fullName);

      if (error) {
        toast.error(error.message || 'Failed to create account');
        return;
      }

      toast.success('Account created! Please check your email to verify your account.');
      router.push(redirect ? `/login?redirect=${redirect}` : '/login');
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Create Your Account</h1>
        <p className="text-[#64748B]">Start your college application journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-[#0F172A] mb-2">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none transition-all"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#0F172A] mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none transition-all"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#0F172A] mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none transition-all"
            placeholder="At least 8 characters"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#0F172A] mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none transition-all"
            placeholder="Confirm your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 rounded-xl font-semibold text-white gradient-accent hover:shadow-lg hover:shadow-[#FF6B4A]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#64748B]">
        By signing up, you agree to our{' '}
        <Link href="/terms" className="text-[#FF6B4A] hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-[#FF6B4A] hover:underline">
          Privacy Policy
        </Link>
      </p>

      <div className="mt-6 text-center">
        <p className="text-[#64748B]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#FF6B4A] hover:text-[#E85537] font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
