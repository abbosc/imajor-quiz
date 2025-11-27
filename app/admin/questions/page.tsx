'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';

interface Question {
  id: string;
  question_text: string;
  explanation: string | null;
  order_index: number;
  is_active: boolean;
  answer_choices?: AnswerChoice[];
}

interface AnswerChoice {
  id: string;
  choice_text: string;
  points: number;
  order_index: number;
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await fetch('/api/admin/questions');

      if (!response.ok) throw new Error('Failed to load questions');

      const result = await response.json();
      setQuestions(result.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/questions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          is_active: !currentStatus
        })
      });

      if (!response.ok) throw new Error('Failed to update question');

      loadQuestions();
    } catch (error) {
      console.error('Error toggling question:', error);
      alert('Failed to update question');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question? All answer choices will also be deleted.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/questions?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete question');

      loadQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete question');
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Questions</h2>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <Link
            href="/admin/questions/bulk-import"
            className="flex-1 sm:flex-none text-center border-2 border-[#FF6B4A] text-[#FF6B4A] px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-[#FF6B4A] hover:text-white transition-all duration-300 text-sm sm:text-base"
          >
            Bulk Import
          </Link>
          <Link
            href="/admin/questions/new"
            className="flex-1 sm:flex-none text-center gradient-accent text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
          >
            Add Question
          </Link>
        </div>
      </div>

      {questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="card p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                    <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                      question.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {question.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs sm:text-sm text-[#64748B]">
                      Order: {question.order_index}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#0F172A] mb-1">
                    {question.question_text}
                  </h3>
                  {question.explanation && (
                    <p className="text-xs sm:text-sm text-[#64748B] mb-3 italic">{question.explanation}</p>
                  )}
                  {question.answer_choices && question.answer_choices.length > 0 && (
                    <div className="space-y-2">
                      {question.answer_choices
                        .sort((a, b) => a.order_index - b.order_index)
                        .map((choice) => (
                          <div key={choice.id} className="flex items-center gap-2 text-xs sm:text-sm">
                            <span className="w-14 sm:w-16 px-2 py-1 bg-[#F8FAFC] rounded text-[#FF6B4A] font-semibold text-center">
                              {choice.points} pts
                            </span>
                            <span className="text-[#64748B]">{choice.choice_text}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 w-full sm:w-auto sm:ml-4">
                  <button
                    onClick={() => toggleActive(question.id, question.is_active)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg border border-[#E2E8F0] text-[#0F172A] font-medium hover:border-[#FF6B4A] transition-all duration-200 text-xs sm:text-sm"
                  >
                    {question.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <Link
                    href={`/admin/questions/${question.id}/edit`}
                    className="flex-1 sm:flex-none text-center px-3 sm:px-4 py-2 rounded-lg bg-[#FF6B4A] text-white font-medium hover:bg-[#E85537] transition-all duration-200 text-xs sm:text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-all duration-200 text-xs sm:text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-[#64748B] mb-4">No questions yet</p>
          <Link
            href="/admin/questions/new"
            className="inline-block gradient-accent text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Add Your First Question
          </Link>
        </div>
      )}
    </AdminLayout>
  );
}
