'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

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

export default function QuizResultsPage() {
  const { user } = useAuth();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadResults();
  }, [user]);

  const loadResults = async () => {
    try {
      const response = await fetch('/api/user/quiz-results');
      const result = await response.json();
      if (result.data) setResults(result.data);
    } catch (error) {
      console.error('Error loading quiz results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreLabel = (percentage: number) => {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Fair';
    return 'Needs Work';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B4A]"></div>
      </div>
    );
  }

  return (
    <div>
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

      {results.length === 0 ? (
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
      ) : (
        <div className="space-y-4">
          {/* Latest Result Highlight */}
          {results.length > 0 && (
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
          )}

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
      )}
    </div>
  );
}
