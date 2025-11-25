'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    grade_level: '',
    school_name: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        grade_level: profile.grade_level || '',
        school_name: profile.school_name || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Settings</h1>
        <p className="text-[#64748B]">Manage your account and preferences.</p>
      </div>

      {/* Profile Section */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Profile Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]"
            />
            <p className="text-xs text-[#64748B] mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">Full Name</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">Grade Level</label>
            <select
              value={formData.grade_level}
              onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
            >
              <option value="">Select grade level</option>
              <option value="9">9th Grade (Freshman)</option>
              <option value="10">10th Grade (Sophomore)</option>
              <option value="11">11th Grade (Junior)</option>
              <option value="12">12th Grade (Senior)</option>
              <option value="gap">Gap Year</option>
              <option value="college">College Student</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">School Name</label>
            <input
              type="text"
              value={formData.school_name}
              onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
              placeholder="Your school name"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl font-medium text-white gradient-accent hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Account Section */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Account</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-[#E2E8F0]">
            <div>
              <p className="font-medium text-[#0F172A]">Account Created</p>
              <p className="text-sm text-[#64748B]">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-3 rounded-xl font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
