'use client';

import HeroSection from "@/components/landing/HeroSection";
import PrizeSection from "@/components/landing/PrizeSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import WhySection from "@/components/landing/WhySection";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

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
