'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        router.push('/admin');
        return;
      }

      // Check if user is admin
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error || !profile?.is_admin) {
        router.push('/admin');
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    }

    checkAdminStatus();
  }, [user, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/admin');
  };

  const isActive = (path: string) => pathname === path;

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B4A]"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <nav className="bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold gradient-text">iMajor Admin</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#64748B] hidden sm:block">
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm sm:text-base text-[#64748B] hover:text-[#FF6B4A] transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide">
            <Link
              href="/admin/dashboard"
              className={`px-3 sm:px-4 py-3 text-sm sm:text-base whitespace-nowrap ${
                isActive('/admin/dashboard')
                  ? 'text-[#FF6B4A] border-b-2 border-[#FF6B4A] font-semibold'
                  : 'text-[#64748B] hover:text-[#FF6B4A]'
              } transition-colors duration-200`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/questions"
              className={`px-3 sm:px-4 py-3 text-sm sm:text-base whitespace-nowrap ${
                isActive('/admin/questions')
                  ? 'text-[#FF6B4A] border-b-2 border-[#FF6B4A] font-semibold'
                  : 'text-[#64748B] hover:text-[#FF6B4A]'
              } transition-colors duration-200`}
            >
              Questions
            </Link>
            <Link
              href="/admin/tasks"
              className={`px-3 sm:px-4 py-3 text-sm sm:text-base whitespace-nowrap ${
                isActive('/admin/tasks')
                  ? 'text-[#FF6B4A] border-b-2 border-[#FF6B4A] font-semibold'
                  : 'text-[#64748B] hover:text-[#FF6B4A]'
              } transition-colors duration-200`}
            >
              Tasks
            </Link>
            <Link
              href="/admin/majors"
              className={`px-3 sm:px-4 py-3 text-sm sm:text-base whitespace-nowrap ${
                isActive('/admin/majors')
                  ? 'text-[#FF6B4A] border-b-2 border-[#FF6B4A] font-semibold'
                  : 'text-[#64748B] hover:text-[#FF6B4A]'
              } transition-colors duration-200`}
            >
              Majors
            </Link>
            <Link
              href="/admin/careers"
              className={`px-3 sm:px-4 py-3 text-sm sm:text-base whitespace-nowrap ${
                pathname?.startsWith('/admin/careers')
                  ? 'text-[#FF6B4A] border-b-2 border-[#FF6B4A] font-semibold'
                  : 'text-[#64748B] hover:text-[#FF6B4A]'
              } transition-colors duration-200`}
            >
              Careers
            </Link>
            <Link
              href="/admin/submissions"
              className={`px-3 sm:px-4 py-3 text-sm sm:text-base whitespace-nowrap ${
                isActive('/admin/submissions')
                  ? 'text-[#FF6B4A] border-b-2 border-[#FF6B4A] font-semibold'
                  : 'text-[#64748B] hover:text-[#FF6B4A]'
              } transition-colors duration-200`}
            >
              Submissions
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </div>
    </div>
  );
}
