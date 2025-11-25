'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Recommendation {
  id: string;
  recommender_name: string;
  recommender_email: string | null;
  subject_taught: string | null;
  relationship: string | null;
  status: 'not_requested' | 'requested' | 'in_progress' | 'submitted';
  due_date: string | null;
  notes: string | null;
}

const statusColors: Record<string, string> = {
  not_requested: 'bg-gray-100 text-gray-700',
  requested: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  submitted: 'bg-green-100 text-green-700',
};

const statusLabels: Record<string, string> = {
  not_requested: 'Not Requested',
  requested: 'Requested',
  in_progress: 'In Progress',
  submitted: 'Submitted',
};

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRec, setEditingRec] = useState<Recommendation | null>(null);
  const [formData, setFormData] = useState({
    recommender_name: '',
    recommender_email: '',
    subject_taught: '',
    relationship: '',
    status: 'not_requested' as Recommendation['status'],
    due_date: '',
    notes: '',
  });

  useEffect(() => {
    if (user) loadRecommendations();
  }, [user]);

  const loadRecommendations = async () => {
    try {
      const response = await fetch('/api/user/recommendations');
      const result = await response.json();
      if (result.data) setRecommendations(result.data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = {
        recommender_name: formData.recommender_name,
        recommender_email: formData.recommender_email || null,
        subject_taught: formData.subject_taught || null,
        relationship: formData.relationship || null,
        status: formData.status,
        due_date: formData.due_date || null,
        notes: formData.notes || null,
        ...(editingRec && { id: editingRec.id }),
      };

      const response = await fetch('/api/user/recommendations', {
        method: editingRec ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        loadRecommendations();
        resetForm();
        toast.success(editingRec ? 'Recommendation updated' : 'Recommendation added');
      } else {
        const result = await response.json();
        toast.error(result.error || 'Failed to save recommendation');
      }
    } catch (error) {
      console.error('Error saving recommendation:', error);
      toast.error('Failed to save recommendation');
    }
  };

  const handleEdit = (rec: Recommendation) => {
    setEditingRec(rec);
    setFormData({
      recommender_name: rec.recommender_name,
      recommender_email: rec.recommender_email || '',
      subject_taught: rec.subject_taught || '',
      relationship: rec.relationship || '',
      status: rec.status,
      due_date: rec.due_date || '',
      notes: rec.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recommendation?')) return;
    try {
      const response = await fetch(`/api/user/recommendations?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        loadRecommendations();
        toast.success('Recommendation deleted');
      }
    } catch (error) {
      console.error('Error deleting recommendation:', error);
      toast.error('Failed to delete recommendation');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingRec(null);
    setFormData({
      recommender_name: '',
      recommender_email: '',
      subject_taught: '',
      relationship: '',
      status: 'not_requested',
      due_date: '',
      notes: '',
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Recommendations</h1>
          <p className="text-[#64748B]">Track your recommendation letter requests.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-xl font-medium text-white gradient-accent hover:shadow-lg transition-all"
        >
          + Add Recommender
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gray-600">{recommendations.filter(r => r.status === 'not_requested').length}</p>
          <p className="text-xs text-[#64748B]">Not Requested</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{recommendations.filter(r => r.status === 'requested').length}</p>
          <p className="text-xs text-[#64748B]">Requested</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{recommendations.filter(r => r.status === 'in_progress').length}</p>
          <p className="text-xs text-[#64748B]">In Progress</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{recommendations.filter(r => r.status === 'submitted').length}</p>
          <p className="text-xs text-[#64748B]">Submitted</p>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#0F172A] mb-4">
              {editingRec ? 'Edit Recommender' : 'Add Recommender'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.recommender_name}
                  onChange={(e) => setFormData({ ...formData, recommender_name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                  placeholder="e.g., Mr. John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Email</label>
                <input
                  type="email"
                  value={formData.recommender_email}
                  onChange={(e) => setFormData({ ...formData, recommender_email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                  placeholder="teacher@school.edu"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Subject Taught</label>
                  <input
                    type="text"
                    value={formData.subject_taught}
                    onChange={(e) => setFormData({ ...formData, subject_taught: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                    placeholder="e.g., AP Physics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Relationship</label>
                  <input
                    type="text"
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                    placeholder="e.g., Teacher"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Recommendation['status'] })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                  >
                    <option value="not_requested">Not Requested</option>
                    <option value="requested">Requested</option>
                    <option value="in_progress">In Progress</option>
                    <option value="submitted">Submitted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Due Date</label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none resize-none"
                  placeholder="Any notes about this recommendation..."
                />
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
                  {editingRec ? 'Save Changes' : 'Add Recommender'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recommendations List */}
      {recommendations.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-[#E2E8F0] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">No recommenders yet</h3>
          <p className="text-[#64748B] mb-4">Track your recommendation letter requests.</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 rounded-xl font-medium text-white gradient-accent hover:shadow-lg transition-all"
          >
            Add Your First Recommender
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div key={rec.id} className="card p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] font-semibold">
                  {rec.recommender_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-[#0F172A]">{rec.recommender_name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[rec.status]}`}>
                      {statusLabels[rec.status]}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-[#64748B]">
                    {rec.subject_taught && <span>{rec.subject_taught}</span>}
                    {rec.relationship && <span>{rec.relationship}</span>}
                    {rec.due_date && <span>Due: {new Date(rec.due_date).toLocaleDateString()}</span>}
                  </div>
                  {rec.recommender_email && (
                    <p className="text-sm text-[#64748B] mt-1">{rec.recommender_email}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(rec)} className="p-2 rounded-lg text-[#64748B] hover:bg-[#F8FAFC] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(rec.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
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
