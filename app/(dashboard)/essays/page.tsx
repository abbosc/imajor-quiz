'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Essay {
  id: string;
  title: string;
  prompt: string | null;
  content: string | null;
  word_count: number;
  status: 'draft' | 'in_review' | 'final';
  university_id: string | null;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  in_review: 'bg-amber-100 text-amber-700',
  final: 'bg-green-100 text-green-700',
};

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  in_review: 'In Review',
  final: 'Final',
};

export default function EssaysPage() {
  const { user } = useAuth();
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEssay, setEditingEssay] = useState<Essay | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    prompt: '',
    content: '',
    status: 'draft' as Essay['status'],
  });

  useEffect(() => {
    if (user) loadEssays();
  }, [user]);

  const loadEssays = async () => {
    try {
      const response = await fetch('/api/user/essays');
      const result = await response.json();
      if (result.data) setEssays(result.data);
    } catch (error) {
      console.error('Error loading essays:', error);
      toast.error('Failed to load essays');
    } finally {
      setLoading(false);
    }
  };

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = {
        title: formData.title,
        prompt: formData.prompt || null,
        content: formData.content || null,
        word_count: countWords(formData.content),
        status: formData.status,
        ...(editingEssay && { id: editingEssay.id }),
      };

      const response = await fetch('/api/user/essays', {
        method: editingEssay ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        loadEssays();
        resetForm();
        toast.success(editingEssay ? 'Essay updated' : 'Essay created');
      } else {
        const result = await response.json();
        toast.error(result.error || 'Failed to save essay');
      }
    } catch (error) {
      console.error('Error saving essay:', error);
      toast.error('Failed to save essay');
    }
  };

  const handleEdit = (essay: Essay) => {
    setEditingEssay(essay);
    setFormData({
      title: essay.title,
      prompt: essay.prompt || '',
      content: essay.content || '',
      status: essay.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this essay?')) return;
    try {
      const response = await fetch(`/api/user/essays?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        loadEssays();
        toast.success('Essay deleted');
      }
    } catch (error) {
      console.error('Error deleting essay:', error);
      toast.error('Failed to delete essay');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingEssay(null);
    setFormData({
      title: '',
      prompt: '',
      content: '',
      status: 'draft',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B4A]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-1 sm:mb-2">Essays</h1>
          <p className="text-sm sm:text-base text-[#64748B]">Write and organize your application essays.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-xl font-medium text-white gradient-accent hover:shadow-lg transition-all text-sm sm:text-base w-full sm:w-auto"
        >
          + New Essay
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="card p-3 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-gray-600">{essays.filter(e => e.status === 'draft').length}</p>
          <p className="text-xs sm:text-sm text-[#64748B]">Drafts</p>
        </div>
        <div className="card p-3 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-amber-600">{essays.filter(e => e.status === 'in_review').length}</p>
          <p className="text-xs sm:text-sm text-[#64748B]">In Review</p>
        </div>
        <div className="card p-3 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-green-600">{essays.filter(e => e.status === 'final').length}</p>
          <p className="text-xs sm:text-sm text-[#64748B]">Final</p>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#0F172A] mb-4">
              {editingEssay ? 'Edit Essay' : 'New Essay'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                  placeholder="e.g., Common App Personal Statement"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Prompt</label>
                <textarea
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none resize-none"
                  placeholder="The essay prompt or question..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Content <span className="text-[#64748B]">({countWords(formData.content)} words)</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none resize-none font-mono text-sm"
                  placeholder="Write your essay here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Essay['status'] })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="in_review">In Review</option>
                  <option value="final">Final</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 rounded-xl font-medium border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl font-medium text-white gradient-accent hover:shadow-lg transition-all"
                >
                  {editingEssay ? 'Save Changes' : 'Create Essay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Essays List */}
      {essays.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-[#E2E8F0] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">No essays yet</h3>
          <p className="text-[#64748B] mb-4">Start writing your application essays.</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 rounded-xl font-medium text-white gradient-accent hover:shadow-lg transition-all"
          >
            Write Your First Essay
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {essays.map((essay) => (
            <div key={essay.id} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-[#0F172A]">{essay.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[essay.status]}`}>
                      {statusLabels[essay.status]}
                    </span>
                  </div>
                  {essay.prompt && (
                    <p className="text-sm text-[#64748B] mb-1 line-clamp-1">{essay.prompt}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-[#64748B]">
                    <span>{essay.word_count} words</span>
                    <span>Updated {new Date(essay.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(essay)} className="p-2 rounded-lg text-[#64748B] hover:bg-[#F8FAFC] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(essay.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
