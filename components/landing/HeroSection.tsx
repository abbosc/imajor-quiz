'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 sm:px-8 lg:px-12 relative overflow-visible">
      <div className="max-w-5xl mx-auto text-center relative">
        {/* Main action-oriented headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-[#0F172A] mb-4 sm:mb-6 leading-tight">
          <span className="block mb-2">Find your perfect major</span>
          <span className="block gradient-text">in 5 minutes</span>
        </h2>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-[#64748B] mb-8 sm:mb-10 max-w-2xl mx-auto">
          Take our interactive quiz to discover which career categories align with your interests, skills, and goals.
        </p>

        {/* CTA Button */}
        <Link
          href="/career-quiz"
          className="inline-block gradient-accent text-white font-bold text-base sm:text-lg md:text-xl px-8 sm:px-12 py-4 sm:py-5 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-[#FF6B4A]/30 hover:scale-105 transition-all duration-300"
        >
          Take the Quiz
        </Link>

        {/* Supporting text */}
        <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-[#94A3B8]">
          100% Free &bull; No signup required &bull; Get instant results
        </p>

        {/* Scroll indicator */}
        <div className="mt-12 sm:mt-16 animate-bounce">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        {/* Mobile: Both messages stacked BELOW scroll indicator */}
        <div className="lg:hidden flex flex-col gap-3 items-center mt-8">
          {/* Sticky note mobile */}
          <div className="bg-[#FFEAA7] p-3 shadow-lg transform rotate-2"
               style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}>
            <p className="text-[#5D4E37] text-sm text-center max-w-[200px] font-[family-name:var(--font-caveat)]">
              How can you love what you don&apos;t know <span className="text-[#D63031] font-bold">in depth?</span>
            </p>
          </div>

          {/* Chalkboard mobile */}
          <div className="bg-[#2C3E2D] rounded-lg p-3 shadow-xl border-4 border-[#8B4513] transform -rotate-1"
               style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)' }}>
            <p className="text-white text-sm text-center max-w-[220px] font-[family-name:var(--font-caveat)]">
              Most students think they know their major.
              <span className="text-[#FFD93D] font-bold block mt-1">This quiz will prove otherwise.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Sticky note - Left side */}
      <div className="hidden lg:block absolute left-8 xl:left-16 top-32 transform -rotate-6 hover:-rotate-3 transition-transform duration-500">
        <div className="relative">
          {/* Sticky note */}
          <div
            className="bg-[#FFEAA7] p-5 shadow-xl relative"
            style={{
              boxShadow: '3px 3px 15px rgba(0,0,0,0.2)',
              clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
            }}
          >
            {/* Folded corner effect */}
            <div
              className="absolute bottom-0 right-0 w-5 h-5 bg-[#E5D190]"
              style={{
                clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
              }}
            />

            {/* Text */}
            <p className="text-[#5D4E37] text-xl leading-snug max-w-[200px] font-[family-name:var(--font-caveat)]"
               style={{ transform: 'rotate(-1deg)' }}>
              How can you love<br/>
              what you don&apos;t know<br/>
              <span className="text-2xl font-bold text-[#D63031]">in depth?</span>
            </p>
          </div>

          {/* Tape on top */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-[#E8DCC4] opacity-70 rounded-sm"
               style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
        </div>
      </div>

      {/* Chalkboard floating element - Right side */}
      <div className="hidden lg:block absolute right-8 xl:right-16 bottom-32 transform rotate-3 hover:rotate-0 transition-transform duration-500">
        <div className="relative">
          {/* Chalkboard background */}
          <div className="bg-[#2C3E2D] rounded-lg p-6 shadow-2xl border-8 border-[#8B4513] relative overflow-hidden"
               style={{
                 boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3), 0 10px 40px rgba(0,0,0,0.3)',
               }}>
            {/* Chalk dust texture overlay */}
            <div className="absolute inset-0 opacity-10"
                 style={{
                   backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                 }} />

            {/* Chalk text */}
            <p className="relative text-white text-lg leading-relaxed max-w-[280px] font-[family-name:var(--font-caveat)]"
               style={{
                 textShadow: '1px 1px 2px rgba(255,255,255,0.1)',
                 letterSpacing: '0.5px',
               }}>
              <span className="text-2xl">Most students think</span><br/>
              <span className="text-2xl">they know their major.</span><br/>
              <span className="text-[#FFD93D] text-2xl font-bold mt-2 block">This quiz will prove otherwise.</span>
            </p>

            {/* Chalk piece decoration */}
            <div className="absolute -bottom-2 -right-2 w-12 h-3 bg-white rounded-full opacity-80 transform rotate-12" />
          </div>

          {/* Pin/tack decoration */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full shadow-lg border-2 border-red-700" />
        </div>
      </div>

    </section>
  );
}
