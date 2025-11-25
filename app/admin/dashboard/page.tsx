'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';

interface Stats {
  totalSubmissions: number;
  totalQuestions: number;
  averageScore: number;
  recentSubmissions: Array<{
    id: string;
    user_name: string;
    total_score: number;
    created_at: string;
  }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalSubmissions: 0,
    totalQuestions: 0,
    averageScore: 0,
    recentSubmissions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
      return;
    }

    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Fetch total submissions
      const { count: submissionsCount } = await supabase
        .from('quiz_submissions')
        .select('*', { count: 'exact', head: true });

      // Fetch average score
      const { data: submissions } = await supabase
        .from('quiz_submissions')
        .select('total_score');

      const submissionsList = submissions as { total_score: number }[] | null;
      const avgScore = submissionsList && submissionsList.length > 0
        ? submissionsList.reduce((sum, s) => sum + s.total_score, 0) / submissionsList.length
        : 0;

      // Fetch total questions
      const { count: questionsCount } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });

      // Fetch recent submissions
      const { data: recentSubs } = await supabase
        .from('quiz_submissions')
        .select('id, user_name, total_score, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalSubmissions: submissionsCount || 0,
        totalQuestions: questionsCount || 0,
        averageScore: Math.round(avgScore),
        recentSubmissions: recentSubs || []
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B4A]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold text-[#0F172A] mb-8">Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 gradient-accent rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-[#64748B]">Total Submissions</p>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.totalSubmissions}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 gradient-accent rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-[#64748B]">Total Questions</p>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.totalQuestions}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 gradient-accent rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-[#64748B]">Average Score</p>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.averageScore}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-[#0F172A] mb-4">Recent Submissions</h3>
          {stats.recentSubmissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E2E8F0]">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#64748B]">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#64748B]">Score</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#64748B]">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentSubmissions.map((submission) => (
                    <tr key={submission.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                      <td className="py-3 px-4 text-[#0F172A]">{submission.user_name}</td>
                      <td className="py-3 px-4 text-[#0F172A] font-semibold">{submission.total_score}</td>
                      <td className="py-3 px-4 text-[#64748B]">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-[#64748B] text-center py-8">No submissions yet</p>
          )}
        </div>
    </AdminLayout>
  );
}
