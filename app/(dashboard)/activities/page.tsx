'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ListSkeleton, ProgressSkeleton } from '@/components/skeletons';
import { useActivities } from '@/hooks/useDashboardData';
import { DeleteModal } from '@/components/ui/Modal';

interface Activity {
  id: string;
  activity_name: string;
  activity_type: string;
  position_title: string | null;
  organization_name: string | null;
  description: string | null;
  hours_per_week: number | null;
  weeks_per_year: number | null;
  years_participated: string | null;
  order_index: number;
}

const activityTypes = [
  'Academic',
  'Art',
  'Athletics: Club',
  'Athletics: JV/Varsity',
  'Career Oriented',
  'Community Service (Volunteer)',
  'Computer/Technology',
  'Cultural',
  'Dance',
  'Debate/Speech',
  'Environmental',
  'Family Responsibilities',
  'Foreign Exchange',
  'Internship',
  'Journalism/Publication',
  'Junior ROTC',
  'LGBTQ+',
  'Music: Instrumental',
  'Music: Vocal',
  'Religious',
  'Research',
  'Robotics',
  'School Spirit',
  'Science/Math',
  'Social Justice',
  'Student Govt./Politics',
  'Theater/Drama',
  'Work (Paid)',
  'Other Club/Activity',
] as const;

const participationYears = ['9', '10', '11', 'Post-Graduate'] as const;

export default function ActivitiesPage() {
  const { activities, isLoading: loading, mutate } = useActivities();
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Activity | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    activity_name: '',
    activity_type: '',
    position_title: '',
    organization_name: '',
    description: '',
    hours_per_week: '',
    weeks_per_year: '',
    years_participated: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.description.length > 150) {
      toast.error('Description must be 150 characters or less');
      return;
    }

    try {
      const body = {
        activity_name: formData.activity_name,
        activity_type: formData.activity_type,
        position_title: formData.position_title || null,
        organization_name: formData.organization_name || null,
        description: formData.description || null,
        hours_per_week: formData.hours_per_week ? parseInt(formData.hours_per_week) : null,
        weeks_per_year: formData.weeks_per_year ? parseInt(formData.weeks_per_year) : null,
        years_participated: formData.years_participated.length > 0 ? formData.years_participated.join(', ') : null,
        order_index: editingActivity?.order_index || activities.length,
        ...(editingActivity && { id: editingActivity.id }),
      };

      const response = await fetch('/api/user/activities', {
        method: editingActivity ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        mutate();
        resetForm();
        toast.success(editingActivity ? 'Activity updated' : 'Activity added');
      } else {
        const result = await response.json();
        toast.error(result.error || 'Failed to save activity');
      }
    } catch (error) {
      console.error('Error saving activity:', error);
      toast.error('Failed to save activity');
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      activity_name: activity.activity_name,
      activity_type: activity.activity_type,
      position_title: activity.position_title || '',
      organization_name: activity.organization_name || '',
      description: activity.description || '',
      hours_per_week: activity.hours_per_week?.toString() || '',
      weeks_per_year: activity.weeks_per_year?.toString() || '',
      years_participated: activity.years_participated ? activity.years_participated.split(', ') : [],
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/user/activities?id=${deleteTarget.id}`, { method: 'DELETE' });
      if (response.ok) {
        mutate();
        toast.success('Activity deleted');
        setDeleteTarget(null);
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
    } finally {
      setDeleting(false);
    }
  };

  const toggleYear = (year: string) => {
    setFormData(prev => ({
      ...prev,
      years_participated: prev.years_participated.includes(year)
        ? prev.years_participated.filter(y => y !== year)
        : [...prev.years_participated, year],
    }));
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingActivity(null);
    setFormData({
      activity_name: '',
      activity_type: '',
      position_title: '',
      organization_name: '',
      description: '',
      hours_per_week: '',
      weeks_per_year: '',
      years_participated: [],
    });
  };

  return (
    <div>
      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Activity"
        itemName={deleteTarget?.activity_name}
        loading={deleting}
      />

      {/* Static header - renders immediately */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-1 sm:mb-2">Activities</h1>
          <p className="text-sm sm:text-base text-[#64748B]">Document your extracurricular activities (max 10).</p>
        </div>
        {!loading && activities.length < 10 && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-xl font-medium text-white gradient-accent hover:shadow-lg transition-all text-sm sm:text-base w-full sm:w-auto"
          >
            + Add Activity
          </button>
        )}
      </div>

      {/* Progress */}
      {loading ? (
        <ProgressSkeleton />
      ) : (
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#64748B]">Activities Added</span>
          <span className="text-sm font-bold text-[#0F172A]">{activities.length} / 10</span>
        </div>
        <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6D] rounded-full transition-all"
            style={{ width: `${(activities.length / 10) * 100}%` }}
          />
        </div>
      </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#0F172A] mb-4">
              {editingActivity ? 'Edit Activity' : 'Add Activity'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Activity Name *</label>
                <input
                  type="text"
                  value={formData.activity_name}
                  onChange={(e) => setFormData({ ...formData, activity_name: e.target.value })}
                  required
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                  placeholder="e.g., Robotics Club"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Activity Type *</label>
                <select
                  value={formData.activity_type}
                  onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                >
                  <option value="">Select type...</option>
                  {activityTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Position/Role</label>
                  <input
                    type="text"
                    value={formData.position_title}
                    onChange={(e) => setFormData({ ...formData, position_title: e.target.value })}
                    maxLength={50}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                    placeholder="e.g., President"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Organization</label>
                  <input
                    type="text"
                    value={formData.organization_name}
                    onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                    maxLength={100}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                    placeholder="e.g., School Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Hours/Week</label>
                  <input
                    type="number"
                    value={formData.hours_per_week}
                    onChange={(e) => setFormData({ ...formData, hours_per_week: e.target.value })}
                    min="1"
                    max="168"
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                    placeholder="e.g., 5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Weeks/Year</label>
                  <input
                    type="number"
                    value={formData.weeks_per_year}
                    onChange={(e) => setFormData({ ...formData, weeks_per_year: e.target.value })}
                    min="1"
                    max="52"
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                    placeholder="e.g., 36"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Years Participated</label>
                <div className="flex flex-wrap gap-2">
                  {participationYears.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => toggleYear(year)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        formData.years_participated.includes(year)
                          ? 'bg-[#FF6B4A] text-white'
                          : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Description <span className="text-[#64748B]">({formData.description.length}/150)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  maxLength={150}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none resize-none"
                  placeholder="Describe your role and accomplishments..."
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
                  {editingActivity ? 'Save Changes' : 'Add Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activities List - shows skeleton while loading */}
      {loading ? (
        <ListSkeleton count={3} />
      ) : activities.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-[#E2E8F0] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">No activities yet</h3>
          <p className="text-[#64748B] mb-4">Document your extracurricular activities here.</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 rounded-xl font-medium text-white gradient-accent hover:shadow-lg transition-all"
          >
            Add Your First Activity
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={activity.id} className="card p-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F8FAFC] text-[#64748B] font-medium text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-[#0F172A]">{activity.activity_name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-[#F1F5F9] text-[#64748B]">
                      {activity.activity_type}
                    </span>
                  </div>
                  {activity.position_title && (
                    <p className="text-sm font-medium text-[#0F172A]">{activity.position_title}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-[#64748B] mt-1">
                    {activity.organization_name && <span>{activity.organization_name}</span>}
                    {activity.hours_per_week && activity.weeks_per_year && (
                      <span>{activity.hours_per_week} hrs/wk, {activity.weeks_per_year} wks/yr</span>
                    )}
                    {activity.years_participated && (
                      <span>Years: {activity.years_participated}</span>
                    )}
                  </div>
                  {activity.description && (
                    <p className="text-sm text-[#64748B] mt-2">{activity.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(activity)} className="p-2 rounded-lg text-[#64748B] hover:bg-[#F8FAFC] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => setDeleteTarget(activity)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
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
