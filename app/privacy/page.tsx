'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F3] via-white to-[#FFF0ED] flex items-center justify-center p-4">
      <div className="card p-8 sm:p-12 max-w-lg w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#FF6B4A]/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-[#FF6B4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-3">
          Privacy Policy
        </h1>

        <p className="text-[#64748B] mb-8">
          We&apos;re currently working on our Privacy Policy. Check back soon for updates.
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
