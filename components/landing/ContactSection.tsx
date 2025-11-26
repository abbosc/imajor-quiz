'use client';

import { useRef, useState, useEffect } from 'react';

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('contact@imajor.app');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 md:py-32 bg-[#0F172A] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs with CSS animations */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6B4A] opacity-10 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#FF8A6D] opacity-10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '1s' }} />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-10 sm:mb-16 transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className={`inline-block px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-[#FF6B4A]/20 text-[#FF6B4A] mb-3 sm:mb-4 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            Get in Touch
          </span>
          <h2 className={`text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 sm:mb-4 transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <p className={`text-sm sm:text-lg text-white/60 max-w-2xl mx-auto transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            Have questions or feedback? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 max-w-3xl mx-auto">
          {/* Email Card */}
          <div
            onClick={handleCopyEmail}
            className={`flex-1 w-full cursor-pointer group transition-all duration-500 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
          >
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 hover:border-[#FF6B4A]/50 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-[#FF6B4A]/10">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FF6B4A]/0 via-[#FF6B4A]/5 to-[#FF6B4A]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#FF6B4A] to-[#E85537] flex items-center justify-center flex-shrink-0 group-hover:rotate-[-10deg] transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/50 text-xs sm:text-sm mb-1">Email us at</p>
                  <p className="text-white font-semibold text-base sm:text-lg truncate">contact@imajor.app</p>
                </div>
                <div className={`absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full transition-all duration-300 ${copiedEmail ? 'opacity-100 scale-100' : 'opacity-0 scale-80'}`}>
                  Copied!
                </div>
                <svg className="w-5 h-5 text-white/30 group-hover:text-[#FF6B4A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Telegram Card */}
          <a
            href="https://t.me/imajoradmin"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 w-full group transition-all duration-500 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
          >
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 hover:border-[#0088cc]/50 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-[#0088cc]/10">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0088cc]/0 via-[#0088cc]/5 to-[#0088cc]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#0088cc] to-[#0077b5] flex items-center justify-center flex-shrink-0 group-hover:rotate-[-10deg] transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white/50 text-xs sm:text-sm mb-1">Message us on</p>
                  <p className="text-white font-semibold text-base sm:text-lg">Telegram</p>
                </div>
                <svg className="w-5 h-5 text-white/30 group-hover:text-[#0088cc] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
