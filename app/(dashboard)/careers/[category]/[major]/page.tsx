'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

interface Career {
  id: string;
  name: string;
  slug: string;
  brief_description: string;
  salary_entry: number | null;
  salary_average: number | null;
  salary_high: number | null;
  growth_outlook: string | null;
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
  description: string;
  category: Category;
  careers: Career[];
}

// Professional SVG icons for categories
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97Z" />
      </svg>
    ),
    'natural-sciences': (
      <svg className={className} fill="none" stroke={color} strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6Z" />
    </svg>
  );
  return icons[slug] || defaultIcon;
}

function formatSalary(amount: number | null): string {
  if (!amount) return '-';
  return `$${(amount / 1000).toFixed(0)}k`;
}

export default function MajorPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const majorSlug = params.major as string;
  const [major, setMajor] = useState<Major | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMajor() {
      try {
        const res = await fetch(`/api/careers/majors/${majorSlug}`);
        const { data } = await res.json();
        setMajor(data);
      } catch (error) {
        console.error('Failed to fetch major:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMajor();
  }, [majorSlug]);

  if (loading) {
    return (
      <div className="min-h-[80vh]">
        <div className="h-6 w-64 rounded animate-shimmer mb-6" />
        <div className="h-10 w-80 rounded animate-shimmer mb-3" />
        <div className="h-5 w-96 rounded animate-shimmer mb-10" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl animate-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (!major) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#FEE2E2] flex items-center justify-center">
            <svg className="w-10 h-10 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#0F172A] mb-2">Major not found</h3>
          <p className="text-[#64748B] mb-6">The major you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/careers" className="text-[#FF6B4A] font-medium hover:underline">
            Back to all categories
          </Link>
        </div>
      </div>
    );
  }

  const color = major.category?.color || '#FF6B4A';

  return (
    <div className="min-h-[80vh]">
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
          {major.category?.name}
        </Link>
        <svg className="w-4 h-4 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-medium" style={{ color }}>
          {major.name}
        </span>
      </motion.nav>

      {/* Major Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: `${color}12` }}
          >
            <CategoryIcon slug={major.category?.slug || ''} color={color} className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color }}>
              {major.category?.name}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              {major.name}
            </h1>
          </div>
        </div>
        {major.description && (
          <p className="text-[#64748B] max-w-2xl">
            {major.description}
          </p>
        )}
      </motion.div>

      {/* Careers List */}
      {major.careers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ background: `${color}10` }}
          >
            <svg className="w-10 h-10" style={{ color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#0F172A] mb-2">No careers yet</h3>
          <p className="text-[#64748B]">Career paths for this major will appear here once added.</p>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between mb-4"
          >
            <p className="text-sm text-[#94A3B8]">
              {major.careers.length} {major.careers.length === 1 ? 'career path' : 'career paths'} available
            </p>
            <div className="hidden sm:flex items-center gap-4 text-xs text-[#94A3B8]">
              <span>Entry</span>
              <span>Average</span>
              <span>High</span>
            </div>
          </motion.div>

          <div className="space-y-3">
            {major.careers.map((career, index) => (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Link href={`/careers/${categorySlug}/${majorSlug}/${career.slug}`}>
                  <div className="group bg-white rounded-2xl p-5 border border-[#E2E8F0] hover:border-transparent hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Career Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: `${color}12` }}
                          >
                            <svg className="w-6 h-6" style={{ color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#FF6B4A] transition-colors">
                              {career.name}
                            </h3>
                            {career.brief_description && (
                              <p className="text-sm text-[#64748B] line-clamp-2 mt-1">
                                {career.brief_description}
                              </p>
                            )}
                            {career.growth_outlook && (
                              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                {career.growth_outlook}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Salary Range */}
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 sm:gap-4 text-sm">
                          <div className="text-center min-w-[50px]">
                            <p className="text-[#94A3B8] text-xs sm:hidden mb-0.5">Entry</p>
                            <p className="font-semibold text-[#64748B]">{formatSalary(career.salary_entry)}</p>
                          </div>
                          <div className="text-center min-w-[50px]">
                            <p className="text-[#94A3B8] text-xs sm:hidden mb-0.5">Avg</p>
                            <p className="font-bold text-[#0F172A]">{formatSalary(career.salary_average)}</p>
                          </div>
                          <div className="text-center min-w-[50px]">
                            <p className="text-[#94A3B8] text-xs sm:hidden mb-0.5">High</p>
                            <p className="font-semibold" style={{ color }}>{formatSalary(career.salary_high)}</p>
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 text-[#CBD5E1] group-hover:text-[#FF6B4A] group-hover:translate-x-1 transition-all flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
