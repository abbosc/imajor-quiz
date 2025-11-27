'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F3] via-white to-[#FFF0ED] flex items-center justify-center p-4">
      <div className="card p-8 sm:p-12 max-w-lg w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#FF6B4A]/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-[#FF6B4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-3">
          Terms of Service
        </h1>

        <p className="text-[#64748B] mb-8">
          We&apos;re currently working on our Terms of Service. Check back soon for updates.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B4A]/10 text-[#FF6B4A] text-sm font-medium mb-8">
          <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="10" />
          </svg>
          Coming Soon
        </div>

        <div className="pt-6 border-t border-[#E2E8F0]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#FF6B4A] hover:text-[#E85537] font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
