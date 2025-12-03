'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

// Professional SVG icons for each category (Heroicons outline style)
function CategoryIcon({ slug, color, className = "w-6 h-6" }: { slug: string; color: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    'technology-engineering': (
      <svg className={className} fill="none" stroke={color} strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
      </svg>
    ),
    'healthcare-medicine': (
      <svg className={className} fill="none" stroke={color} strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
    'business-finance': (
      <svg className={className} fill="none" stroke={color} strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
    ),
    'arts-design': (
      <svg className={className} fill="none" stroke={color} strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
      </svg>
    ),
    'education-social-sciences': (
      <svg className={className} fill="none" stroke={color} strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
    'law-public-policy': (
      <svg className={className} fill="none" stroke={color} strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
      </svg>
    ),
    'natural-sciences': (
      <svg className={className} fill="none" stroke={color} strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    'communications-media': (
      <svg className={className} fill="none" stroke={color} strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
      </svg>
    ),
  };

  const defaultIcon = (
    <svg className={className} fill="none" stroke={color} strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
    </svg>
  );

  return <>{icons[slug] || defaultIcon}</>;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
}

interface Major {
  id: string;
  name: string;
  slug: string;
  category: Category;
}

interface Career {
  id: string;
  name: string;
  slug: string;
  brief_description: string | null;
  responsibilities: string[] | null;
  hard_skills: string[] | null;
  soft_skills: string[] | null;
  education_required: string | null;
  certifications: string[] | null;
  salary_entry: number | null;
  salary_average: number | null;
  salary_high: number | null;
  salary_growth: string | null;
  high_paying_regions: string[] | null;
  high_paying_industries: string[] | null;
  growth_outlook: string | null;
  advancement_paths: string[] | null;
  typical_day: string | null;
  real_tasks: string[] | null;
  major: Major;
}

function formatSalary(amount: number | null): string {
  if (!amount) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function SalaryBar({ entry, average, high, color }: { entry: number | null; average: number | null; high: number | null; color: string }) {
  const maxSalary = Math.max(entry || 0, average || 0, high || 0, 1);

  return (
    <div className="space-y-3">
      {/* Entry */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-[#64748B]">Entry Level</span>
          <span className="font-semibold text-[#0F172A]">{formatSalary(entry)}</span>
        </div>
        <div className="h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((entry || 0) / maxSalary) * 100}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full rounded-full"
            style={{ background: `${color}60` }}
          />
        </div>
      </div>

      {/* Average */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-[#64748B]">Average</span>
          <span className="font-bold text-[#0F172A]">{formatSalary(average)}</span>
        </div>
        <div className="h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((average || 0) / maxSalary) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full rounded-full"
            style={{ background: `${color}90` }}
          />
        </div>
      </div>

      {/* High */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-[#64748B]">High End</span>
          <span className="font-bold" style={{ color }}>{formatSalary(high)}</span>
        </div>
        <div className="h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((high || 0) / maxSalary) * 100}%` }}
            transition={{ duration: 1, delay: 0.7 }}
            className="h-full rounded-full"
            style={{ background: color }}
          />
        </div>
      </div>
    </div>
  );
}

function SkillBadge({ skill, color, type }: { skill: string; color: string; type: 'hard' | 'soft' }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-transform hover:scale-105"
      style={{
        background: type === 'hard' ? `${color}15` : '#F1F5F9',
        color: type === 'hard' ? color : '#64748B',
      }}
    >
      {type === 'hard' ? (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )}
      {skill}
    </span>
  );
}

function Section({ title, icon, children, delay = 0 }: { title: string; icon: React.ReactNode; children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center text-[#64748B]">
          {icon}
        </div>
        <h2 className="text-lg font-bold text-[#0F172A]">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

export default function CareerPage() {
  const params = useParams();
  const { user } = useAuth();
  const categorySlug = params.category as string;
  const majorSlug = params.major as string;
  const careerSlug = params.career as string;

  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  useEffect(() => {
    async function fetchCareer() {
      try {
        const res = await fetch(`/api/careers/${careerSlug}`);
        const { data } = await res.json();
        setCareer(data);
      } catch (error) {
        console.error('Failed to fetch career:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCareer();
  }, [careerSlug]);

  // Check if bookmarked
  useEffect(() => {
    async function checkBookmark() {
      if (!user || !career) return;
      try {
        const res = await fetch('/api/user/saved-careers');
        const { data } = await res.json();
        const saved = data?.some((s: any) => s.career?.id === career.id);
        setIsBookmarked(saved);
      } catch (error) {
        console.error('Failed to check bookmark:', error);
      }
    }
    checkBookmark();
  }, [user, career]);

  async function toggleBookmark() {
    if (!user || !career || bookmarking) return;

    setBookmarking(true);
    try {
      if (isBookmarked) {
        await fetch('/api/careers/bookmark', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ career_id: career.id }),
        });
        setIsBookmarked(false);
      } else {
        await fetch('/api/careers/bookmark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ career_id: career.id }),
        });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    } finally {
      setBookmarking(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[80vh]">
        <div className="h-6 w-96 bg-[#F1F5F9] rounded animate-pulse mb-6" />
        <div className="h-12 w-64 bg-[#F1F5F9] rounded animate-pulse mb-4" />
        <div className="h-24 bg-[#F1F5F9] rounded-2xl animate-pulse mb-6" />
        <div className="grid lg:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-[#F1F5F9] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#FEE2E2] flex items-center justify-center">
            <svg className="w-10 h-10 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#0F172A] mb-2">Career not found</h3>
          <p className="text-[#64748B] mb-6">The career you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/careers" className="text-[#FF6B4A] font-medium hover:underline">
            Back to all categories
          </Link>
        </div>
      </div>
    );
  }

  const color = career.major?.category?.color || '#FF6B4A';

  return (
    <div className="min-h-[80vh] pb-10">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 text-sm mb-6 flex-wrap"
      >
        <Link href="/careers" className="text-[#64748B] hover:text-[#FF6B4A] transition-colors">
          Careers
        </Link>
        <svg className="w-4 h-4 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link href={`/careers/${categorySlug}`} className="text-[#64748B] hover:text-[#FF6B4A] transition-colors">
          {career.major?.category?.name}
        </Link>
        <svg className="w-4 h-4 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link href={`/careers/${categorySlug}/${majorSlug}`} className="text-[#64748B] hover:text-[#FF6B4A] transition-colors">
          {career.major?.name}
        </Link>
        <svg className="w-4 h-4 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-medium" style={{ color }}>
          {career.name}
        </span>
      </motion.nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}12` }}
            >
              <CategoryIcon slug={career.major?.category?.slug || ''} color={color} className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium mb-1" style={{ color }}>
                {career.major?.category?.name} • {career.major?.name}
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight">
                {career.name}
              </h1>
            </div>
          </div>

          {/* Bookmark Button */}
          {user && (
            <button
              onClick={toggleBookmark}
              disabled={bookmarking}
              className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isBookmarked
                  ? 'bg-[#FF6B4A] text-white shadow-lg shadow-[#FF6B4A]/30'
                  : 'bg-white border-2 border-[#E2E8F0] text-[#64748B] hover:border-[#FF6B4A] hover:text-[#FF6B4A]'
              }`}
            >
              {bookmarking ? (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill={isBookmarked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              )}
            </button>
          )}
        </div>

        {career.brief_description && (
          <p className="text-[#64748B] text-lg max-w-3xl leading-relaxed">
            {career.brief_description}
          </p>
        )}
      </motion.div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Responsibilities */}
        {career.responsibilities && career.responsibilities.length > 0 && (
          <Section
            title="Responsibilities"
            delay={0.1}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
          >
            <ul className="space-y-2">
              {career.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-3 text-[#475569]">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: color }} />
                  {resp}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Skills */}
        {((career.hard_skills && career.hard_skills.length > 0) || (career.soft_skills && career.soft_skills.length > 0)) && (
          <Section
            title="Skills Required"
            delay={0.2}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
          >
            <div className="space-y-4">
              {career.hard_skills && career.hard_skills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-[#64748B] mb-2">Technical Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {career.hard_skills.map((skill, i) => (
                      <SkillBadge key={i} skill={skill} color={color} type="hard" />
                    ))}
                  </div>
                </div>
              )}
              {career.soft_skills && career.soft_skills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-[#64748B] mb-2">Soft Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {career.soft_skills.map((skill, i) => (
                      <SkillBadge key={i} skill={skill} color={color} type="soft" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Education */}
        {(career.education_required || (career.certifications && career.certifications.length > 0)) && (
          <Section
            title="Education & Training"
            delay={0.3}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            }
          >
            <div className="space-y-4">
              {career.education_required && (
                <p className="text-[#475569]">{career.education_required}</p>
              )}
              {career.certifications && career.certifications.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-[#64748B] mb-2">Helpful Certifications</p>
                  <div className="flex flex-wrap gap-2">
                    {career.certifications.map((cert, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-[#ECFDF5] text-[#059669]"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Salary */}
        {(career.salary_entry || career.salary_average || career.salary_high) && (
          <Section
            title="Salary & Earnings"
            delay={0.4}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          >
            <div className="space-y-5">
              <SalaryBar
                entry={career.salary_entry}
                average={career.salary_average}
                high={career.salary_high}
                color={color}
              />

              {career.salary_growth && (
                <p className="text-sm text-[#64748B] flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  {career.salary_growth}
                </p>
              )}

              {career.high_paying_regions && career.high_paying_regions.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-[#94A3B8] mb-2">Top Paying Locations</p>
                  <div className="flex flex-wrap gap-1.5">
                    {career.high_paying_regions.map((region, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#475569]"
                      >
                        <svg className="w-3 h-3 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {region}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {career.high_paying_industries && career.high_paying_industries.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-[#94A3B8] mb-2">Top Paying Industries</p>
                  <div className="flex flex-wrap gap-1.5">
                    {career.high_paying_industries.map((industry, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#475569]"
                      >
                        <svg className="w-3 h-3 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Growth */}
        {(career.growth_outlook || (career.advancement_paths && career.advancement_paths.length > 0)) && (
          <Section
            title="Growth Opportunities"
            delay={0.5}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          >
            <div className="space-y-4">
              {career.growth_outlook && (
                <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: `${color}08` }}>
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[#475569]">{career.growth_outlook}</p>
                </div>
              )}

              {career.advancement_paths && career.advancement_paths.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-[#64748B] mb-3">Career Progression</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {career.advancement_paths.map((path, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span
                          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-[#E2E8F0]"
                        >
                          {path}
                        </span>
                        {i < career.advancement_paths!.length - 1 && (
                          <svg className="w-4 h-4 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Typical Day */}
        {career.typical_day && (
          <Section
            title="A Typical Day"
            delay={0.6}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          >
            <p className="text-[#475569] leading-relaxed whitespace-pre-line">{career.typical_day}</p>
          </Section>
        )}

        {/* Real Tasks */}
        {career.real_tasks && career.real_tasks.length > 0 && (
          <Section
            title="Real Tasks You'll Do"
            delay={0.7}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          >
            <ul className="space-y-2">
              {career.real_tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-3 text-[#475569]">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {task}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </div>
  );
}
