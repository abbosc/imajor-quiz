'use client';

import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import WhySection from "@/components/landing/WhySection";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Link as LocaleLink } from "@/i18n/navigation";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Home() {
  const { user, loading } = useAuth();
  const t = useTranslations('nav');

  return (
    <main className="min-h-screen bg-[#F8FAFC] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#FF6B4A] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-[#FF6B4A] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6B4A] opacity-[0.02] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-6 sm:px-8 lg:px-12 py-4 sm:py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold gradient-text">{t('brand')}</h1>
              <p className="text-xs text-[#64748B] -mt-0.5 hidden sm:block">{t('tagline')}</p>
            </div>

            {/* Public Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <a
                href="#about"
                className="px-4 py-2 rounded-lg font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
              >
                {t('about')}
              </a>
              <a
                href="#features"
                className="px-4 py-2 rounded-lg font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
              >
                {t('features')}
              </a>
              <a
                href="#why"
                className="px-4 py-2 rounded-lg font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
              >
                {t('whyImajor')}
              </a>
              <a
                href="#contact"
                className="px-4 py-2 rounded-lg font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
              >
                {t('contact')}
              </a>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSwitcher />
              {!loading && (
                user ? (
                  <Link
                    href="/dashboard"
                    className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium text-white gradient-accent hover:shadow-lg hover:shadow-[#FF6B4A]/25 transition-all text-sm sm:text-base"
                  >
                    {t('dashboard')}
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium text-[#0F172A] hover:bg-[#F1F5F9] transition-colors text-sm sm:text-base"
                    >
                      {t('login')}
                    </Link>
                    <Link
                      href="/signup"
                      className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium text-white gradient-accent hover:shadow-lg hover:shadow-[#FF6B4A]/25 transition-all text-sm sm:text-base"
                    >
                      {t('startFree')}
                    </Link>
                  </>
                )
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <HeroSection />

        {/* About Section */}
        <AboutSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Why iMajor Section */}
        <WhySection />

        {/* Contact Section */}
        <ContactSection />

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
