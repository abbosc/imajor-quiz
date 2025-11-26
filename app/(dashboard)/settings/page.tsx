'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Major {
  id: string;
  name: string;
  is_active: boolean;
}

interface UserMajor {
  id: string;
  major_id: string;
  majors: Major;
}

export default function SettingsPage() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    grade_level: '',
    school_name: '',
  });
  const [availableMajors, setAvailableMajors] = useState<Major[]>([]);
  const [userMajors, setUserMajors] = useState<UserMajor[]>([]);
  const [majorsLoading, setMajorsLoading] = useState(true);
  const [majorSearch, setMajorSearch] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        grade_level: profile.grade_level || '',
        school_name: profile.school_name || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    loadMajors();
  }, []);

  const loadMajors = async () => {
    try {
      const [majorsRes, userMajorsRes] = await Promise.all([
        fetch('/api/majors'),
        fetch('/api/user/majors')
      ]);

      const majorsData = await majorsRes.json();
      const userMajorsData = await userMajorsRes.json();

      if (majorsData.data && Array.isArray(majorsData.data)) {
        setAvailableMajors(majorsData.data);
      }
      if (userMajorsData.data && Array.isArray(userMajorsData.data)) {
        setUserMajors(userMajorsData.data);
      }
    } catch (error) {
      console.error('Error loading majors:', error);
    } finally {
      setMajorsLoading(false);
    }
  };

  const toggleMajor = async (majorId: string) => {
    const isSelected = userMajors.some(um => um.major_id === majorId);

    try {
      if (isSelected) {
        const res = await fetch(`/api/user/majors?majorId=${majorId}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          setUserMajors(prev => prev.filter(um => um.major_id !== majorId));
          toast.success('Major removed');
        }
      } else {
        const res = await fetch('/api/user/majors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ major_id: majorId })
        });
        if (res.ok) {
          const { data } = await res.json();
          setUserMajors(prev => [...prev, data]);
          toast.success('Major added');
        }
      }
    } catch (error) {
      console.error('Error toggling major:', error);
      toast.error('Failed to update major');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await updateProfile(formData);
      if (error) {
        throw error;
      }
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
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2">Settings</h1>
        <p className="text-sm sm:text-base text-[#64748B]">Manage your account and preferences.</p>
      </div>

      {/* Profile Section */}
      <div className="card p-4 sm:p-6 mb-4 sm:mb-6">
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
              <option value="9">9th Grade</option>
              <option value="10">10th Grade</option>
              <option value="11">11th Grade</option>
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

      {/* Interested Majors Section */}
      <div id="majors" className="card p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-[#0F172A] mb-2">Interested Majors</h2>
        <p className="text-xs sm:text-sm text-[#64748B] mb-4">Select the majors you&apos;re interested in exploring. This helps personalize your experience.</p>

        {majorsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B4A]"></div>
          </div>
        ) : availableMajors.length === 0 ? (
          <div className="py-8 text-center text-[#64748B]">
            <p>No majors available yet. Check back later!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Selected Majors */}
            {userMajors.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-[#0F172A] mb-2">Your selections ({userMajors.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {userMajors.map((um) => (
                    <button
                      key={um.id}
                      onClick={() => toggleMajor(um.major_id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FF6B4A]/10 text-[#FF6B4A] rounded-full text-sm font-medium hover:bg-[#FF6B4A]/20 transition-colors"
                    >
                      {um.majors?.name}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Box */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={majorSearch}
                onChange={(e) => setMajorSearch(e.target.value)}
                placeholder="Search majors... (e.g., Computer Science, Engineering)"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
              />
              {majorSearch && (
                <button
                  onClick={() => setMajorSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Available Majors Grid */}
            {(() => {
              const filteredMajors = availableMajors.filter(major =>
                major.name.toLowerCase().includes(majorSearch.toLowerCase())
              );

              if (filteredMajors.length === 0) {
                return (
                  <div className="py-6 text-center text-[#64748B]">
                    <p>No majors found matching &quot;{majorSearch}&quot;</p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-1">
                  {filteredMajors.map((major) => {
                    const isSelected = userMajors.some(um => um.major_id === major.id);
                    return (
                      <button
                        key={major.id}
                        onClick={() => toggleMajor(major.id)}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? 'border-[#FF6B4A] bg-[#FF6B4A]/5'
                            : 'border-[#E2E8F0] hover:border-[#FF6B4A]/40'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-[#FF6B4A] text-white' : 'border-2 border-[#E2E8F0]'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-sm font-medium ${isSelected ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>
                            {major.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Account Section */}
      <div className="card p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-[#0F172A] mb-4">Account</h2>

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
