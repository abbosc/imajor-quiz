'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ListSkeleton } from '@/components/skeletons';
import { useHonors } from '@/hooks/useDashboardData';
import { DeleteModal } from '@/components/ui/Modal';

interface Honor {
  id: string;
  honor_name: string;
  level: 'school' | 'state' | 'regional' | 'national' | 'international';
  year_received: string | null;
  description: string | null;
  order_index: number;
}

const levelColors: Record<string, string> = {
  school: 'bg-gray-100 text-gray-700',
  state: 'bg-blue-100 text-blue-700',
  regional: 'bg-purple-100 text-purple-700',
  national: 'bg-amber-100 text-amber-700',
  international: 'bg-green-100 text-green-700',
};

const levelLabels: Record<string, string> = {
  school: 'School',
  state: 'State/Regional',
  regional: 'Regional',
  national: 'National',
  international: 'International',
};

export default function HonorsPage() {
  const { honors, isLoading: loading, mutate } = useHonors();
  const [showForm, setShowForm] = useState(false);
  const [editingHonor, setEditingHonor] = useState<Honor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Honor | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    honor_name: '',
    level: 'school' as Honor['level'],
    year_received: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = {
        honor_name: formData.honor_name,
        level: formData.level,
        year_received: formData.year_received || null,
        description: formData.description || null,
        order_index: editingHonor?.order_index || honors.length,
        ...(editingHonor && { id: editingHonor.id }),
      };

      const response = await fetch('/api/user/honors', {
        method: editingHonor ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        mutate();
        resetForm();
        toast.success(editingHonor ? 'Honor updated' : 'Honor added');
      } else {
        const result = await response.json();
        toast.error(result.error || 'Failed to save honor');
      }
    } catch (error) {
      console.error('Error saving honor:', error);
      toast.error('Failed to save honor');
    }
  };

  const handleEdit = (honor: Honor) => {
    setEditingHonor(honor);
    setFormData({
      honor_name: honor.honor_name,
      level: honor.level,
      year_received: honor.year_received || '',
      description: honor.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/user/honors?id=${deleteTarget.id}`, { method: 'DELETE' });
      if (response.ok) {
        mutate();
        toast.success('Honor deleted');
        setDeleteTarget(null);
      }
    } catch (error) {
      console.error('Error deleting honor:', error);
      toast.error('Failed to delete honor');
    } finally {
      setDeleting(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingHonor(null);
    setFormData({
      honor_name: '',
      level: 'school',
      year_received: '',
      description: '',
    });
  };

  return (
    <div>
      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Honor"
        itemName={deleteTarget?.honor_name}
        loading={deleting}
      />

      {/* Static header - renders immediately */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-1 sm:mb-2">Honors & Awards</h1>
          <p className="text-sm sm:text-base text-[#64748B]">List your academic and extracurricular achievements.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-xl font-medium text-white gradient-accent hover:shadow-lg transition-all text-sm sm:text-base w-full sm:w-auto"
        >
          + Add Honor
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold text-[#0F172A] mb-4">
              {editingHonor ? 'Edit Honor' : 'Add Honor'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Honor/Award Name *</label>
                <input
                  type="text"
                  value={formData.honor_name}
                  onChange={(e) => setFormData({ ...formData, honor_name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                  placeholder="e.g., National Merit Scholar"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Level *</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as Honor['level'] })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                  >
                    <option value="school">School</option>
                    <option value="state">State/Regional</option>
                    <option value="regional">Regional</option>
                    <option value="national">National</option>
                    <option value="international">International</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Year Received</label>
                  <input
                    type="text"
                    value={formData.year_received}
                    onChange={(e) => setFormData({ ...formData, year_received: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                    placeholder="e.g., 2024"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  maxLength={250}
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none resize-none"
                  placeholder="Brief description of the honor..."
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
                  {editingHonor ? 'Save Changes' : 'Add Honor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Honors List - shows skeleton while loading */}
      {loading ? (
        <ListSkeleton count={3} />
      ) : honors.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-[#E2E8F0] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">No honors yet</h3>
          <p className="text-[#64748B] mb-4">Add your academic and extracurricular achievements.</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 rounded-xl font-medium text-white gradient-accent hover:shadow-lg transition-all"
          >
            Add Your First Honor
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {honors.map((honor, index) => (
            <div key={honor.id} className="card p-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F8FAFC] text-[#64748B] font-medium text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-[#0F172A]">{honor.honor_name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${levelColors[honor.level]}`}>
                      {levelLabels[honor.level]}
                    </span>
                    {honor.year_received && (
                      <span className="text-sm text-[#64748B]">{honor.year_received}</span>
                    )}
                  </div>
                  {honor.description && (
                    <p className="text-sm text-[#64748B]">{honor.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(honor)} className="p-2 rounded-lg text-[#64748B] hover:bg-[#F8FAFC] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => setDeleteTarget(honor)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
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
