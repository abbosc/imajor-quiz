import Link from 'next/link';
import { Suspense } from 'react';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { PendingQuizHandler } from '@/components/dashboard/PendingQuizHandler';
import { StatsGridSkeleton, MajorTagsSkeleton } from '@/components/skeletons';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Async component for user majors tags
async function UserMajorTags({ userId }: { userId: string }) {
  const supabase = await createServerSupabaseClient();

  const { data: userMajors } = await supabase
    .from('user_majors')
    .select(`
      id,
      major_id,
      majors (
        id,
        name,
        is_active
      )
    `)
    .eq('user_id', userId);

  const majors = userMajors || [];

  if (majors.length === 0) {
    return (
      <div className="card p-5 sm:p-8 bg-gradient-to-r from-[#FF6B4A]/10 to-[#FF8A6D]/10 border-2 border-dashed border-[#FF6B4A]/40 mb-6 sm:mb-8">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-[#FF6B4A]/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#FF6B4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-2">
            What majors interest you?
          </h3>
          <p className="text-sm sm:text-base text-[#64748B] mb-4 sm:mb-6 max-w-md mx-auto">
            Select your areas of interest to personalize your experience and get better recommendations for your college journey.
          </p>
          <Link
            href="/settings#majors"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white gradient-accent hover:shadow-lg hover:shadow-[#FF6B4A]/25 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Select Your Majors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {majors.map((um: any) => (
        <span
          key={um.id}
          className="inline-flex items-center gap-1 px-3 py-1 bg-[#FF6B4A]/10 text-[#FF6B4A] rounded-full text-sm font-medium"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
          {um.majors?.name}
        </span>
      ))}
      <Link
        href="/settings#majors"
        className="inline-flex items-center gap-1 px-3 py-1 border border-dashed border-[#E2E8F0] text-[#64748B] rounded-full text-sm hover:border-[#FF6B4A] hover:text-[#FF6B4A] transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Edit
      </Link>
    </div>
  );
}

// Async component for dashboard stats
async function DashboardStats({ userId }: { userId: string }) {
  const supabase = await createServerSupabaseClient();

  // Fetch all stats in parallel
  const [tasksResult, totalTasksResult, universitiesResult, activitiesResult, essaysResult] = await Promise.all([
    supabase.from('user_task_progress').select('status').eq('user_id', userId),
    supabase.from('exploration_tasks').select('id', { count: 'exact', head: true }),
    supabase.from('user_universities').select('status').eq('user_id', userId),
    supabase.from('user_activities').select('id').eq('user_id', userId),
    supabase.from('user_essays').select('status').eq('user_id', userId),
  ]);

  const tasks = tasksResult.data || [];
  const universities = universitiesResult.data || [];
  const activities = activitiesResult.data || [];
  const essays = essaysResult.data || [];

  const stats = {
    tasks: {
      total: totalTasksResult.count || 0,
      completed: tasks.filter((t: any) => t.status === 'completed').length,
    },
    universities: {
      total: universities.length,
      accepted: universities.filter((u: any) => u.status === 'accepted').length,
    },
    activities: {
      total: activities.length,
    },
    essays: {
      total: essays.length,
      final: essays.filter((e: any) => e.status === 'final').length,
    },
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      <div className="card p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-[#64748B] mb-1">Tasks</p>
        <p className="text-xl sm:text-2xl font-bold text-[#0F172A]">{stats.tasks.total}</p>
        <p className="text-xs text-green-600">{stats.tasks.completed} completed</p>
      </div>
      <div className="card p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-[#64748B] mb-1">Universities</p>
        <p className="text-xl sm:text-2xl font-bold text-[#0F172A]">{stats.universities.total}</p>
        <p className="text-xs text-[#64748B]">{stats.universities.accepted} accepted</p>
      </div>
      <div className="card p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-[#64748B] mb-1">Activities</p>
        <p className="text-xl sm:text-2xl font-bold text-[#0F172A]">{stats.activities.total}</p>
        <p className="text-xs text-[#64748B]">of 10 max</p>
      </div>
      <div className="card p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-[#64748B] mb-1">Essays</p>
        <p className="text-xl sm:text-2xl font-bold text-[#0F172A]">{stats.essays.total}</p>
        <p className="text-xs text-[#64748B]">{stats.essays.final} final</p>
      </div>
    </div>
  );
}

// Async component for saved careers
async function SavedCareers({ userId }: { userId: string }) {
  const { data: savedCareers } = await supabaseAdmin
    .from('user_saved_careers')
    .select(`
      id,
      created_at,
      career:careers(
        id,
        name,
        slug,
        brief_description,
        salary_average,
        major:career_majors(
          slug,
          category:career_categories(slug, color)
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(4);

  const careers = savedCareers || [];

  if (careers.length === 0) {
    return (
      <div className="card p-5 sm:p-8 bg-gradient-to-r from-[#FF6B4A]/10 to-[#FF8A6D]/10 border-2 border-dashed border-[#FF6B4A]/40 mb-6 sm:mb-8">
        <div className="text-center">
          <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-[#FF6B4A]/20 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7 sm:w-10 sm:h-10 text-[#FF6B4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-2">
            Save Your Favorite Careers
          </h3>
          <p className="text-sm sm:text-base text-[#64748B] mb-4 sm:mb-6 max-w-md mx-auto">
            Browse career paths and bookmark the ones you&apos;re interested in. Your saved careers will appear here for easy access.
          </p>
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white gradient-accent hover:shadow-lg hover:shadow-[#FF6B4A]/25 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Browse & Save Careers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">Saved Careers</h2>
        <Link
          href="/careers"
          className="text-sm text-[#FF6B4A] hover:underline font-medium"
        >
          Explore more
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {careers.map((saved: any) => {
          const career = saved.career;
          if (!career) return null;
          const color = career.major?.category?.color || '#FF6B4A';
          const categorySlug = career.major?.category?.slug || '';
          const majorSlug = career.major?.slug || '';

          return (
            <Link
              key={saved.id}
              href={`/careers/${categorySlug}/${majorSlug}/${career.slug}`}
              className="card p-4 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}12` }}
                >
                  <svg className="w-5 h-5" style={{ color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-[#0F172A] group-hover:text-[#FF6B4A] transition-colors line-clamp-1">
                    {career.name}
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-1">
                    {career.brief_description || 'Explore this career path'}
                  </p>
                  {career.salary_average && (
                    <p className="text-xs font-medium mt-1" style={{ color }}>
                      ${(career.salary_average / 1000).toFixed(0)}k avg
                    </p>
                  )}
                </div>
                <svg
                  className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#FF6B4A] transition-colors flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SavedCareersSkeleton() {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="h-7 w-36 bg-[#F1F5F9] rounded animate-pulse mb-4" />
      <div className="grid sm:grid-cols-2 gap-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] animate-pulse" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-[#F1F5F9] rounded animate-pulse mb-2" />
                <div className="h-3 w-48 bg-[#F1F5F9] rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const quickLinks = [
  {
    title: 'Exploration Tasks',
    description: 'Track your major exploration progress',
    href: '/tasks',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    color: 'bg-blue-500',
  },
  {
    title: 'Universities',
    description: 'Manage your college list',
    href: '/universities',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: 'bg-purple-500',
  },
  {
    title: 'Activities',
    description: 'Document your extracurriculars',
    href: '/activities',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    color: 'bg-amber-500',
  },
  {
    title: 'Essays',
    description: 'Write and organize your essays',
    href: '/essays',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'bg-green-500',
  },
];

export default async function DashboardPage() {
  // Only fetch user/profile - fast single query
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const firstName = profile?.full_name?.split(' ')[0] || 'there';
  const userName = profile?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <div>
      {/* Client component for handling pending quiz from localStorage */}
      <PendingQuizHandler
        userId={user.id}
        userEmail={user.email || ''}
        userName={userName}
      />

      {/* Welcome Section - Static, renders immediately */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2">
          Welcome back, {firstName}!
        </h1>
        <p className="text-sm sm:text-base text-[#64748B]">
          Track your college application progress and stay organized.
        </p>
        {/* Selected Majors Tags - Dynamic with Suspense */}
        <Suspense fallback={<MajorTagsSkeleton />}>
          <UserMajorTags userId={user.id} />
        </Suspense>
      </div>

      {/* Quick Stats - Dynamic with Suspense */}
      <Suspense fallback={<StatsGridSkeleton />}>
        <DashboardStats userId={user.id} />
      </Suspense>

      {/* Saved Careers - Dynamic with Suspense */}
      <Suspense fallback={<SavedCareersSkeleton />}>
        <SavedCareers userId={user.id} />
      </Suspense>

      {/* Quick Links - Static, renders immediately */}
      <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-3 sm:mb-4">Quick Access</h2>
      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="card p-4 sm:p-5 hover:shadow-lg transition-all group"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className={`${link.color} p-2.5 sm:p-3 rounded-xl text-white`}>
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-[#0F172A] group-hover:text-[#FF6B4A] transition-colors">
                  {link.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] truncate">{link.description}</p>
              </div>
              <svg
                className="w-5 h-5 text-[#64748B] group-hover:text-[#FF6B4A] group-hover:translate-x-1 transition-all flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Take Quiz CTA - Static, renders immediately */}
      <div className="card p-4 sm:p-6 bg-gradient-to-r from-[#FF6B4A]/10 to-[#FF8A6D]/10 border-[#FF6B4A]/20">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-[#0F172A] mb-1">
              Take the Major Exploration Quiz
            </h3>
            <p className="text-sm sm:text-base text-[#64748B]">
              Discover how deeply you have explored your major options and get personalized insights.
            </p>
          </div>
          <Link
            href="/quiz"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white gradient-accent hover:shadow-lg hover:shadow-[#FF6B4A]/25 transition-all whitespace-nowrap text-center"
          >
            Start Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
