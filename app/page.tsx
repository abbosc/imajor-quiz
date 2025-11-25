import HeroSection from "@/components/landing/HeroSection";
import PrizeSection from "@/components/landing/PrizeSection";

export default function Home() {
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
            <h1 className="text-3xl font-bold gradient-text">iMajor</h1>
          </div>
        </nav>

        {/* Hero Section with Typewriter */}
        <HeroSection />

        {/* Consultation Prize Section */}
        <PrizeSection />

        {/* Footer */}
        <footer className="container mx-auto px-6 py-10 text-center border-t border-[#E2E8F0]">
          <p className="text-[#94A3B8] text-sm">
            Trusted by students making informed major decisions
          </p>
        </footer>
      </div>
    </main>
  );
}
