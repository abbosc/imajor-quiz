'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

interface Submission {
  id: string;
  unique_id: string;
  user_name: string;
  user_email: string;
  total_score: number;
  max_score: number | null;
  created_at: string;
  user_id: string | null;
}

export default function AdminSubmissions() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
      return;
    }

    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/submissions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch submissions');

      const { data } = await response.json();
      setSubmissions(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading submissions:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
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
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Quiz Submissions</h2>
        <span className="text-sm sm:text-base text-[#64748B]">{submissions.length} total</span>
      </div>

      {submissions.length > 0 ? (
        <>
          {/* Mobile Cards */}
          <div className="block md:hidden space-y-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="card p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-[#0F172A]">{submission.user_name}</h3>
                    <p className="text-sm text-[#64748B] truncate max-w-[200px]">{submission.user_email}</p>
                  </div>
                  {submission.user_id ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Registered
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      Guest
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#64748B]">{formatDate(submission.created_at)}</span>
                  <span className="font-semibold text-[#0F172A]">
                    {submission.total_score}
                    {submission.max_score && <span className="text-[#64748B]">/{submission.max_score}</span>}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block card p-4 sm:p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E2E8F0]">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#64748B]">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#64748B]">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#64748B]">Score</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#64748B]">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#64748B]">User</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                      <td className="py-3 px-4 text-[#0F172A] font-medium">{submission.user_name}</td>
                      <td className="py-3 px-4 text-[#64748B]">{submission.user_email}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#0F172A]">{submission.total_score}</span>
                        {submission.max_score && (
                          <span className="text-[#64748B]">/{submission.max_score}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#64748B]">{formatDate(submission.created_at)}</td>
                      <td className="py-3 px-4">
                        {submission.user_id ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Registered
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Guest
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="card p-6">
          <p className="text-[#64748B] text-center py-8">No submissions yet</p>
        </div>
      )}
    </AdminLayout>
  );
}
