'use client';

import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

export default function AdminCareersPage() {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2">Career Management</h2>
          <p className="text-[#64748B]">Import and manage career categories, majors, and careers</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Import Majors */}
          <Link href="/admin/careers/import-majors">
            <div className="card p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2 group-hover:text-[#FF6B4A] transition-colors">
                Import Majors
              </h3>
              <p className="text-sm text-[#64748B]">
                Upload a JSON file to bulk import majors into categories
              </p>
            </div>
          </Link>

          {/* Import Careers */}
          <Link href="/admin/careers/import-careers">
            <div className="card p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2 group-hover:text-[#FF6B4A] transition-colors">
                Import Careers
              </h3>
              <p className="text-sm text-[#64748B]">
                Upload a JSON file to bulk import careers for majors
              </p>
            </div>
          </Link>
        </div>

        {/* Category Info */}
        <div className="card p-6 mt-6">
          <h3 className="text-lg font-bold text-[#0F172A] mb-4">Available Categories</h3>
          <p className="text-sm text-[#64748B] mb-4">
            Categories are pre-seeded in the database. Use these slugs when importing majors:
          </p>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 p-2 bg-[#F8FAFC] rounded-lg">
              <span>💻</span>
              <code className="text-xs bg-white px-2 py-0.5 rounded">technology-engineering</code>
            </div>
            <div className="flex items-center gap-2 p-2 bg-[#F8FAFC] rounded-lg">
              <span>🏥</span>
              <code className="text-xs bg-white px-2 py-0.5 rounded">healthcare-medicine</code>
            </div>
            <div className="flex items-center gap-2 p-2 bg-[#F8FAFC] rounded-lg">
              <span>💼</span>
              <code className="text-xs bg-white px-2 py-0.5 rounded">business-finance</code>
            </div>
            <div className="flex items-center gap-2 p-2 bg-[#F8FAFC] rounded-lg">
              <span>🎨</span>
              <code className="text-xs bg-white px-2 py-0.5 rounded">arts-design</code>
            </div>
            <div className="flex items-center gap-2 p-2 bg-[#F8FAFC] rounded-lg">
              <span>📚</span>
              <code className="text-xs bg-white px-2 py-0.5 rounded">education-social-sciences</code>
            </div>
            <div className="flex items-center gap-2 p-2 bg-[#F8FAFC] rounded-lg">
              <span>⚖️</span>
              <code className="text-xs bg-white px-2 py-0.5 rounded">law-public-policy</code>
            </div>
            <div className="flex items-center gap-2 p-2 bg-[#F8FAFC] rounded-lg">
              <span>🔬</span>
              <code className="text-xs bg-white px-2 py-0.5 rounded">natural-sciences</code>
            </div>
            <div className="flex items-center gap-2 p-2 bg-[#F8FAFC] rounded-lg">
              <span>📝</span>
              <code className="text-xs bg-white px-2 py-0.5 rounded">communications-media</code>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
