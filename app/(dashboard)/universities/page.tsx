'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface University {
  id: string;
  name: string;
  deadline: string | null;
  status: 'researching' | 'applying' | 'applied' | 'accepted' | 'rejected' | 'waitlisted' | 'withdrawn';
  decision_type: 'early_decision' | 'early_action' | 'regular' | 'rolling' | null;
  major: string | null;
  scholarship_info: string | null;
  notes: string | null;
}

const statusColors: Record<string, string> = {
  researching: 'bg-gray-100 text-gray-700',
  applying: 'bg-blue-100 text-blue-700',
  applied: 'bg-purple-100 text-purple-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  waitlisted: 'bg-amber-100 text-amber-700',
  withdrawn: 'bg-slate-100 text-slate-700',
};

const decisionTypes = [
  { value: 'early_decision', label: 'Early Decision' },
  { value: 'early_action', label: 'Early Action' },
  { value: 'regular', label: 'Regular Decision' },
  { value: 'rolling', label: 'Rolling Admission' },
];

export default function UniversitiesPage() {
  const { user } = useAuth();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    deadline: '',
    status: 'researching' as University['status'],
    decision_type: '' as string,
    major: '',
    scholarship_info: '',
    notes: '',
  });

  useEffect(() => {
    if (user) loadUniversities();
  }, [user]);

  const loadUniversities = async () => {
    try {
      const response = await fetch('/api/user/universities');
      const result = await response.json();
      if (result.data) setUniversities(result.data);
    } catch (error) {
      console.error('Error loading universities:', error);
      toast.error('Failed to load universities');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = {
        ...formData,
        deadline: formData.deadline || null,
        decision_type: formData.decision_type || null,
        major: formData.major || null,
        scholarship_info: formData.scholarship_info || null,
        notes: formData.notes || null,
        ...(editingUniversity && { id: editingUniversity.id }),
      };

      const response = await fetch('/api/user/universities', {
        method: editingUniversity ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        loadUniversities();
        resetForm();
        toast.success(editingUniversity ? 'University updated' : 'University added');
      } else {
        const result = await response.json();
        toast.error(result.error || 'Failed to save university');
      }
    } catch (error) {
      console.error('Error saving university:', error);
      toast.error('Failed to save university');
    }
  };

  const handleEdit = (uni: University) => {
    setEditingUniversity(uni);
    setFormData({
      name: uni.name,
      deadline: uni.deadline || '',
      status: uni.status,
      decision_type: uni.decision_type || '',
      major: uni.major || '',
      scholarship_info: uni.scholarship_info || '',
      notes: uni.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this university?')) return;
    try {
      const response = await fetch(`/api/user/universities?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        loadUniversities();
        toast.success('University deleted');
      }
    } catch (error) {
      console.error('Error deleting university:', error);
      toast.error('Failed to delete university');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingUniversity(null);
    setFormData({
      name: '',
      deadline: '',
      status: 'researching',
      decision_type: '',
      major: '',
      scholarship_info: '',
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
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Universities</h1>
          <p className="text-[#64748B]">Manage your college application list.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-xl font-medium text-white gradient-accent hover:shadow-lg transition-all"
        >
          + Add University
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#0F172A] mb-4">
              {editingUniversity ? 'Edit University' : 'Add University'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                  placeholder="e.g., Stanford University"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as University['status'] })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                  >
                    <option value="researching">Researching</option>
                    <option value="applying">Applying</option>
                    <option value="applied">Applied</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="waitlisted">Waitlisted</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Decision Type</label>
                  <select
                    value={formData.decision_type}
                    onChange={(e) => setFormData({ ...formData, decision_type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                  >
                    <option value="">Not specified</option>
                    {decisionTypes.map((dt) => (
                      <option key={dt.value} value={dt.value}>{dt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Scholarship Info</label>
                  <input
                    type="text"
                    value={formData.scholarship_info}
                    onChange={(e) => setFormData({ ...formData, scholarship_info: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                    placeholder="e.g., Full ride, $20k/year"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Major</label>
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                  placeholder="e.g., Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none resize-none"
                  placeholder="Additional notes..."
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
                  {editingUniversity ? 'Save Changes' : 'Add University'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Universities List */}
      {universities.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-[#E2E8F0] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">No universities yet</h3>
          <p className="text-[#64748B] mb-4">Start building your college list.</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 rounded-xl font-medium text-white gradient-accent hover:shadow-lg transition-all"
          >
            Add Your First University
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {universities.map((uni) => (
            <div key={uni.id} className="card p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-[#0F172A]">{uni.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${statusColors[uni.status]}`}>
                      {uni.status}
                    </span>
                    {uni.decision_type && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-[#F1F5F9] text-[#64748B]">
                        {uni.decision_type}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-[#64748B]">
                    {uni.major && <span>Major: {uni.major}</span>}
                    {uni.deadline && <span>Deadline: {new Date(uni.deadline).toLocaleDateString()}</span>}
                    {uni.scholarship_info && <span>Scholarship: {uni.scholarship_info}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(uni)} className="p-2 rounded-lg text-[#64748B] hover:bg-[#F8FAFC] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(uni.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
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
