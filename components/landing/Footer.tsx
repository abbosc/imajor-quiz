'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

const quickLinks = [
  { label: 'Take Quiz', href: '/quiz' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Tasks', href: '/tasks' },
];

const resourceLinks = [
  { label: 'Universities', href: '/universities' },
  { label: 'Activities', href: '/activities' },
  { label: 'Essays', href: '/essays' },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="bg-[#0F172A] border-t border-white/10 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-10 sm:py-16 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div
            className={`col-span-2 sm:col-span-2 md:col-span-2 transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-1 animate-textGlow">
              iMajor
            </h2>
            <p className="text-white/40 text-xs sm:text-sm mb-3 sm:mb-4">Discover yourself</p>
            <p className="text-sm sm:text-base text-white/60 mb-4 sm:mb-6 max-w-sm">
              Your all-in-one platform for major exploration and college application management. Built by students, for students.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://t.me/imajorapp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#0088cc]/50 hover:bg-[#0088cc]/10 hover:scale-110 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
              >
                <svg className="w-5 h-5 text-white/70 hover:text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
              </a>
              <a
                href="mailto:contact@imajor.app"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#FF6B4A]/50 hover:bg-[#FF6B4A]/10 hover:scale-110 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
              >
                <svg className="w-5 h-5 text-white/70 hover:text-[#FF6B4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div
            className={`transition-all duration-500 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#FF6B4A] transition-colors duration-300 relative group inline-block"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#FF6B4A] group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div
            className={`transition-all duration-500 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#FF6B4A] transition-colors duration-300 relative group inline-block"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#FF6B4A] group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`border-t border-white/10 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 transition-all duration-500 delay-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-white/40 text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} iMajor. All rights reserved.
          </p>
          <p className="text-white/40 text-xs sm:text-sm">
            Made with{' '}
            <span className="inline-block text-[#FF6B4A] animate-heartbeat">♥</span>
            {' '}for students worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
