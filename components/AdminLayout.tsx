'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token && pathname !== '/admin') {
      router.push('/admin');
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <nav className="bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold gradient-text">iMajor Admin</h1>
            <button
              onClick={handleLogout}
              className="text-sm sm:text-base text-[#64748B] hover:text-[#FF6B4A] transition-colors duration-200"
            >
              Logout
            </button>
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
