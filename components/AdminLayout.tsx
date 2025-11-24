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
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold gradient-text">iMajor Admin</h1>
            <button
              onClick={handleLogout}
              className="text-[#64748B] hover:text-[#FF6B4A] transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto px-6">
          <div className="flex gap-6">
            <Link
              href="/admin/dashboard"
              className={`px-4 py-3 ${
                isActive('/admin/dashboard')
                  ? 'text-[#FF6B4A] border-b-2 border-[#FF6B4A] font-semibold'
                  : 'text-[#64748B] hover:text-[#FF6B4A]'
              } transition-colors duration-200`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/sections"
              className={`px-4 py-3 ${
                isActive('/admin/sections')
                  ? 'text-[#FF6B4A] border-b-2 border-[#FF6B4A] font-semibold'
                  : 'text-[#64748B] hover:text-[#FF6B4A]'
              } transition-colors duration-200`}
            >
              Sections
            </Link>
            <Link
              href="/admin/questions"
              className={`px-4 py-3 ${
                isActive('/admin/questions')
                  ? 'text-[#FF6B4A] border-b-2 border-[#FF6B4A] font-semibold'
                  : 'text-[#64748B] hover:text-[#FF6B4A]'
              } transition-colors duration-200`}
            >
              Questions
            </Link>
            <Link
              href="/admin/interpretations"
              className={`px-4 py-3 ${
                isActive('/admin/interpretations')
                  ? 'text-[#FF6B4A] border-b-2 border-[#FF6B4A] font-semibold'
                  : 'text-[#64748B] hover:text-[#FF6B4A]'
              } transition-colors duration-200`}
            >
              Interpretations
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
}
