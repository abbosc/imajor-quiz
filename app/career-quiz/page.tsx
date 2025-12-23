'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { questions, categoryInfo, CategoryKey, CareerQuizOption } from '@/data/career-quiz-questions';

type QuizState = 'start' | 'quiz' | 'results';

interface CategoryResult {
  key: CategoryKey;
  name: string;
  slug: string;
  color: string;
  score: number;
  maxScore: number;
  percentage: number;
}

// SVG Icons matching /careers page
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

  return <>{icons[slug]}</>;
}

export default function CareerQuizPage() {
  const [state, setState] = useState<QuizState>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Map<number, CareerQuizOption>>(new Map());

  // Calculate max possible score per category
  const maxScores = useMemo(() => {
    const maxes: Record<CategoryKey, number> = {
      tech: 0, health: 0, business: 0, science: 0,
      education: 0, law: 0, arts: 0, media: 0
    };

    questions.forEach(q => {
      const questionMaxes: Record<CategoryKey, number> = {
        tech: 0, health: 0, business: 0, science: 0,
        education: 0, law: 0, arts: 0, media: 0
      };

      q.options.forEach(opt => {
        Object.entries(opt.scores).forEach(([key, value]) => {
          const catKey = key as CategoryKey;
          if (value > questionMaxes[catKey]) {
            questionMaxes[catKey] = value;
          }
        });
      });

      Object.entries(questionMaxes).forEach(([key, value]) => {
        maxes[key as CategoryKey] += value;
      });
    });

    return maxes;
  }, []);

  // Calculate results
  const results = useMemo((): CategoryResult[] => {
    const totals: Record<CategoryKey, number> = {
      tech: 0, health: 0, business: 0, science: 0,
      education: 0, law: 0, arts: 0, media: 0
    };

    answers.forEach(option => {
      Object.entries(option.scores).forEach(([key, value]) => {
        totals[key as CategoryKey] += value;
      });
    });

    return Object.entries(categoryInfo)
      .map(([key, info]) => {
        const catKey = key as CategoryKey;
        const score = totals[catKey];
        const maxScore = maxScores[catKey];
        const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

        return {
          key: catKey,
          name: info.name,
          slug: info.slug,
          color: info.color,
          score,
          maxScore,
          percentage
        };
      })
      .sort((a, b) => b.percentage - a.percentage);
  }, [answers, maxScores]);

  const handleAnswer = (option: CareerQuizOption) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questions[currentQuestion].id, option);
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setState('results');
      }
    }, 300);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestart = () => {
    setAnswers(new Map());
    setCurrentQuestion(0);
    setState('start');
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const selectedAnswer = answers.get(currentQ?.id);

  // Start Screen
  if (state === 'start') {
    return (
      <main className="min-h-screen bg-[#F8FAFC]">
        <nav className="container mx-auto px-6 sm:px-8 lg:px-12 py-4 sm:py-6">
          <div className="flex justify-between items-center">
            <Link href="/">
              <h1 className="text-2xl sm:text-3xl font-bold gradient-text">iMajor</h1>
            </Link>
            <Link
              href="/careers"
              className="px-4 py-2 rounded-lg font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
            >
              View Careers
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-[#FF6B4A]/10 text-[#FF6B4A] mb-6">
              Career Interest Quiz
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] mb-6">
              Discover Your <span className="gradient-text">Career Path</span>
            </h2>
            <p className="text-lg text-[#64748B] mb-8">
              Answer 21 quick questions to find out which career categories match your interests,
              personality, and goals. Takes about 5 minutes.
            </p>

            <div className="grid grid-cols-4 gap-3 mb-10 max-w-lg mx-auto">
              {Object.entries(categoryInfo).map(([key, info]) => (
                <div
                  key={key}
                  className="flex flex-col items-center p-3 rounded-xl bg-white border border-[#E2E8F0]"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
                    style={{ backgroundColor: `${info.color}15` }}
                  >
                    <CategoryIcon slug={info.slug} color={info.color} className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-[#64748B] text-center leading-tight">
                    {info.name.split(' & ')[0]}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setState('quiz')}
              className="px-8 py-4 rounded-xl font-semibold text-white gradient-accent hover:shadow-lg hover:shadow-[#FF6B4A]/25 transition-all text-lg"
            >
              Start Quiz
            </button>

            <p className="mt-6 text-sm text-[#94A3B8]">
              No signup required
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Results Screen
  if (state === 'results') {
    return (
      <main className="min-h-screen bg-[#F8FAFC]">
        <nav className="container mx-auto px-6 sm:px-8 lg:px-12 py-4 sm:py-6">
          <div className="flex justify-between items-center">
            <Link href="/">
              <h1 className="text-2xl sm:text-3xl font-bold gradient-text">iMajor</h1>
            </Link>
            <Link
              href="/careers"
              className="px-4 py-2 rounded-lg font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
            >
              View All Careers
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-[#FF6B4A]/10 text-[#FF6B4A] mb-4">
                Your Results
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F172A] mb-3">
                Your Career Interests
              </h2>
              <p className="text-[#64748B]">
                Based on your answers, here are the career categories that match your interests
              </p>
            </div>

            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={result.key}
                  className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${result.color}15` }}
                      >
                        <CategoryIcon slug={result.slug} color={result.color} className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0F172A]">{result.name}</h3>
                        {index === 0 && (
                          <span className="text-xs text-[#FF6B4A] font-medium">Top Match</span>
                        )}
                      </div>
                    </div>
                    <span className="text-xl font-bold" style={{ color: result.color }}>
                      {result.percentage}%
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${result.percentage}%`,
                          backgroundColor: result.color
                        }}
                      />
                    </div>
                  </div>

                  <Link
                    href={`/careers/${result.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-medium hover:gap-2 transition-all"
                    style={{ color: result.color }}
                  >
                    Explore careers
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="px-6 py-3 rounded-xl font-medium border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
              >
                Retake Quiz
              </button>
              <Link
                href="/careers"
                className="px-6 py-3 rounded-xl font-semibold text-white gradient-accent hover:shadow-lg hover:shadow-[#FF6B4A]/25 transition-all text-center"
              >
                Browse All Careers
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Quiz Screen
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <nav className="container mx-auto px-6 sm:px-8 lg:px-12 py-4 sm:py-6">
        <div className="flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">iMajor</h1>
          </Link>
          <span className="text-sm text-[#64748B]">
            {currentQuestion + 1} of {questions.length}
          </span>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
          <div
            className="h-full gradient-accent rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0F172A] text-center">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswer?.text === option.text;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-4 sm:p-5 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-[#FF6B4A] bg-[#FF6B4A]/5'
                      : 'border-[#E2E8F0] bg-white hover:border-[#FF6B4A]/50 hover:bg-[#FFF5F3]'
                  }`}
                >
                  <span className={`font-medium ${isSelected ? 'text-[#FF6B4A]' : 'text-[#0F172A]'}`}>
                    {option.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentQuestion === 0
                  ? 'text-[#CBD5E1] cursor-not-allowed'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <span className="text-sm text-[#94A3B8]">
              Select an answer to continue
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
