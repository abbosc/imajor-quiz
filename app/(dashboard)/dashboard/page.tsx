'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface DashboardStats {
  tasks: { total: number; completed: number };
  universities: { total: number; accepted: number };
  activities: { total: number };
  essays: { total: number; final: number };
}

export default function DashboardPage() {
  const { profile, user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    tasks: { total: 0, completed: 0 },
    universities: { total: 0, accepted: 0 },
    activities: { total: 0 },
    essays: { total: 0, final: 0 },
  });

  // Check for pending quiz data after email confirmation
  useEffect(() => {
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
            user_name: profile?.full_name || user.email?.split('@')[0] || 'User',
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
      }
    };

    if (user) {
      submitPendingQuiz();
    }
  }, [user, profile, router]);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const [tasksRes, unisRes, activitiesRes, essaysRes] = await Promise.all([
        fetch('/api/user/task-progress'),
        fetch('/api/user/universities'),
        fetch('/api/user/activities'),
        fetch('/api/user/essays'),
      ]);

      const [tasksData, unisData, activitiesData, essaysData] = await Promise.all([
        tasksRes.json(),
        unisRes.json(),
        activitiesRes.json(),
        essaysRes.json(),
      ]);

      setStats({
        tasks: {
          total: tasksData.data?.length || 0,
          completed: tasksData.data?.filter((t: any) => t.status === 'completed').length || 0,
        },
        universities: {
          total: unisData.data?.length || 0,
          accepted: unisData.data?.filter((u: any) => u.status === 'accepted').length || 0,
        },
        activities: {
          total: activitiesData.data?.length || 0,
        },
        essays: {
          total: essaysData.data?.length || 0,
          final: essaysData.data?.filter((e: any) => e.status === 'final').length || 0,
        },
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const quickLinks = [
    {
      title: 'Exploration Tasks',
      description: 'Track your major exploration progress',
      href: '/tasks',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: 'bg-blue-500',
    },
    {
      title: 'Universities',
      description: 'Manage your college list',
      href: '/universities',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'bg-purple-500',
    },
    {
      title: 'Activities',
      description: 'Document your extracurriculars',
      href: '/activities',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      color: 'bg-amber-500',
    },
    {
      title: 'Essays',
      description: 'Write and organize your essays',
      href: '/essays',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-green-500',
    },
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-[#64748B]">
          Track your college application progress and stay organized.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-4">
          <p className="text-sm text-[#64748B] mb-1">Tasks</p>
          <p className="text-2xl font-bold text-[#0F172A]">{stats.tasks.total}</p>
          <p className="text-xs text-green-600">{stats.tasks.completed} completed</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-[#64748B] mb-1">Universities</p>
          <p className="text-2xl font-bold text-[#0F172A]">{stats.universities.total}</p>
          <p className="text-xs text-[#64748B]">{stats.universities.accepted} accepted</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-[#64748B] mb-1">Activities</p>
          <p className="text-2xl font-bold text-[#0F172A]">{stats.activities.total}</p>
          <p className="text-xs text-[#64748B]">of 10 max</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-[#64748B] mb-1">Essays</p>
          <p className="text-2xl font-bold text-[#0F172A]">{stats.essays.total}</p>
          <p className="text-xs text-[#64748B]">{stats.essays.final} final</p>
        </div>
      </div>

      {/* Quick Links */}
      <h2 className="text-xl font-bold text-[#0F172A] mb-4">Quick Access</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="card p-5 hover:shadow-lg transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className={`${link.color} p-3 rounded-xl text-white`}>
                {link.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#0F172A] group-hover:text-[#FF6B4A] transition-colors">
                  {link.title}
                </h3>
                <p className="text-sm text-[#64748B]">{link.description}</p>
              </div>
              <svg
                className="w-5 h-5 text-[#64748B] group-hover:text-[#FF6B4A] group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Take Quiz CTA */}
      <div className="card p-6 bg-gradient-to-r from-[#FF6B4A]/10 to-[#FF8A6D]/10 border-[#FF6B4A]/20">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#0F172A] mb-1">
              Take the Major Exploration Quiz
            </h3>
            <p className="text-[#64748B]">
              Discover how deeply you have explored your major options and get personalized insights.
            </p>
          </div>
          <Link
            href="/quiz"
            className="px-6 py-3 rounded-xl font-semibold text-white gradient-accent hover:shadow-lg hover:shadow-[#FF6B4A]/25 transition-all whitespace-nowrap"
          >
            Start Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
