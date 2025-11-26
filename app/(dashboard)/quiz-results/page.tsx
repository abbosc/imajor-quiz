import Link from 'next/link';
import { Suspense } from 'react';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { ListSkeleton, ContentCardSkeleton } from '@/components/skeletons';

interface QuizResult {
  id: string;
  score: number;
  max_score: number;
  percentage: number;
  created_at: string;
}

function getInterpretation(percentage: number) {
  if (percentage <= 33) {
    return {
      level: 'Explorer',
      emoji: '🌱',
      message: "Your adventure is just beginning! You have so much exciting discovery ahead. Start with our exploration tasks to build your foundation.",
    };
  } else if (percentage <= 66) {
    return {
      level: 'Pathfinder',
      emoji: '🧭',
      message: "You're finding your way! Keep exploring to solidify your path. Our tools can help you go even deeper.",
    };
  } else {
    return {
      level: 'Trailblazer',
      emoji: '🚀',
      message: "You're well-prepared! You've done your homework. Now let's turn that knowledge into action.",
    };
  }
}

function getScoreColor(percentage: number) {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-blue-600';
  if (percentage >= 40) return 'text-amber-600';
  return 'text-red-600';
}

function getScoreLabel(percentage: number) {
  if (percentage >= 80) return 'Excellent';
  if (percentage >= 60) return 'Good';
  if (percentage >= 40) return 'Fair';
  return 'Needs Work';
}

// Async component that fetches quiz results
async function QuizResultsList() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  let data: any[] = [];

  // First try user_id
  const result1 = await supabase
    .from('quiz_submissions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (result1.error) {
    // user_id column might not exist yet, try user_email
    if (user.email) {
      const result2 = await supabase
        .from('quiz_submissions')
        .select('*')
        .eq('user_email', user.email)
        .order('created_at', { ascending: false });

      data = result2.data || [];
    }
  } else {
    data = result1.data || [];

    // Also fetch by email for older submissions
    if (user.email) {
      const result2 = await supabase
        .from('quiz_submissions')
        .select('*')
        .eq('user_email', user.email)
        .is('user_id', null)
        .order('created_at', { ascending: false });

      if (result2.data) {
        const existing = new Set(data.map((d: any) => d.id));
        for (const item of result2.data) {
          if (!existing.has(item.id)) {
            data.push(item);
          }
        }
      }
    }
  }

  // Sort by created_at descending
  data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Transform data
  const results: QuizResult[] = data.map((submission: any) => ({
    id: submission.id,
    score: submission.total_score,
    max_score: submission.max_score,
    percentage: submission.max_score
      ? Math.round((submission.total_score / submission.max_score) * 100)
      : 0,
    created_at: submission.created_at
  }));

  if (results.length === 0) {
    return (
      <div className="card p-12 text-center">
        <svg className="w-16 h-16 mx-auto text-[#E2E8F0] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 className="text-lg font-semibold text-[#0F172A] mb-2">No quiz results yet</h3>
        <p className="text-[#64748B] mb-4">Take the major exploration quiz to see your results here.</p>
        <Link
          href="/quiz"
          className="inline-block px-6 py-2 rounded-xl font-medium text-white gradient-accent hover:shadow-lg transition-all"
        >
          Take the Quiz
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Latest Result Highlight */}
      <div className="card p-4 sm:p-6 bg-gradient-to-r from-[#FF6B4A]/5 to-[#FF8A6D]/5 border-[#FF6B4A]/20">
        <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
          <span className="px-2 py-0.5 rounded-full text-xs bg-[#FF6B4A] text-white">Latest</span>
          <span className="text-xs sm:text-sm text-[#64748B]">
            {new Date(results[0].created_at).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-3xl sm:text-4xl font-bold ${getScoreColor(results[0].percentage)}`}>
              {results[0].percentage}%
            </div>
            <div className="text-xs sm:text-sm text-[#64748B]">
              {results[0].score} / {results[0].max_score} points
            </div>
          </div>
          <div className="text-right">
            <div className={`text-base sm:text-lg font-semibold ${getScoreColor(results[0].percentage)}`}>
              {getScoreLabel(results[0].percentage)}
            </div>
            <div className="text-xs sm:text-sm text-[#64748B]">Exploration Level</div>
          </div>
        </div>
        {results[0].percentage !== null && (
          <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
            <h4 className="font-medium text-[#0F172A] mb-2">
              {getInterpretation(results[0].percentage).emoji} {getInterpretation(results[0].percentage).level}
            </h4>
            <p className="text-sm text-[#64748B]">{getInterpretation(results[0].percentage).message}</p>
          </div>
        )}
      </div>

      {/* History */}
      {results.length > 1 && (
        <>
          <h3 className="text-lg font-semibold text-[#0F172A] mt-8 mb-4">Previous Results</h3>
          <div className="space-y-3">
            {results.slice(1).map((result) => (
              <div key={result.id} className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-[#64748B]">
                      {new Date(result.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${getScoreColor(result.percentage)}`}>
                      {result.percentage}%
                    </div>
                    <div className="text-xs text-[#64748B]">
                      {result.score} / {result.max_score}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Results skeleton
function ResultsSkeleton() {
  return (
    <div className="space-y-4">
      <ContentCardSkeleton />
      <ListSkeleton count={2} />
    </div>
  );
}

export default function QuizResultsPage() {
  return (
    <div>
      {/* Static header - renders immediately */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-1 sm:mb-2">Quiz Results</h1>
          <p className="text-sm sm:text-base text-[#64748B]">View your major exploration quiz history.</p>
        </div>
        <Link
          href="/quiz"
          className="px-4 py-2 rounded-xl font-medium text-white gradient-accent hover:shadow-lg transition-all text-sm sm:text-base w-full sm:w-auto text-center"
        >
          Take Quiz
        </Link>
      </div>

      {/* Results - streams in with Suspense */}
      <Suspense fallback={<ResultsSkeleton />}>
        <QuizResultsList />
      </Suspense>
    </div>
  );
}
