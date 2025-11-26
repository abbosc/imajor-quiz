'use client';

import dynamic from 'next/dynamic';
import HeroSection from "@/components/landing/HeroSection";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

// Lazy load below-the-fold sections for faster initial page load
const PrizeSection = dynamic(() => import("@/components/landing/PrizeSection"), {
  loading: () => <div className="h-96 animate-shimmer" />,
});
const FeaturesSection = dynamic(() => import("@/components/landing/FeaturesSection"), {
  loading: () => <div className="h-96 animate-shimmer" />,
});
const WhySection = dynamic(() => import("@/components/landing/WhySection"), {
  loading: () => <div className="h-64 animate-shimmer" />,
});
const ContactSection = dynamic(() => import("@/components/landing/ContactSection"), {
  loading: () => <div className="h-64 animate-shimmer" />,
});
const Footer = dynamic(() => import("@/components/landing/Footer"));

export default function Home() {
  const { user, loading } = useAuth();

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
        <nav className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold gradient-text">iMajor</h1>
              <p className="text-xs text-[#64748B] -mt-0.5">Discover yourself</p>
            </div>
            <div className="flex items-center gap-4">
              {!loading && (
                user ? (
                  <Link
                    href="/dashboard"
                    className="px-5 py-2.5 rounded-xl font-medium text-white gradient-accent hover:shadow-lg hover:shadow-[#FF6B4A]/25 transition-all"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-5 py-2.5 rounded-xl font-medium text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="px-5 py-2.5 rounded-xl font-medium text-white gradient-accent hover:shadow-lg hover:shadow-[#FF6B4A]/25 transition-all"
                    >
                      Start Free
                    </Link>
                  </>
                )
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section with Typewriter */}
        <HeroSection />

        {/* Consultation Prize Section */}
        <PrizeSection />

        {/* Why iMajor Section */}
        <WhySection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Contact Section */}
        <ContactSection />

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
