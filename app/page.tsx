import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#FF6B4A] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#FF6B4A] opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold gradient-text">iMajor</h1>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-7xl font-bold text-[#0F172A] mb-6 leading-tight">
                How Deep Is Your
                <span className="gradient-text block mt-2">Major Exploration?</span>
              </h2>
              <p className="text-xl md:text-2xl text-[#64748B] max-w-3xl mx-auto leading-relaxed">
                Take our comprehensive assessment to measure your exploration depth and receive personalized guidance for your academic journey.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center gap-6 mb-24">
              <Link
                href="/quiz"
                className="gradient-accent text-white px-10 py-5 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl hover:shadow-[#FF6B4A]/30 transition-all duration-300 hover:scale-105"
              >
                Start Assessment
              </Link>
              <p className="text-[#64748B] text-sm">
                No sign-up required • Takes 5 minutes • Get instant results
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card p-8">
                <div className="w-12 h-12 gradient-accent rounded-lg mb-6 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-3">Track Your Progress</h3>
                <p className="text-[#64748B] leading-relaxed">
                  Measure how thoroughly you've researched your academic options across multiple dimensions.
                </p>
              </div>

              <div className="card p-8">
                <div className="w-12 h-12 gradient-accent rounded-lg mb-6 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-3">Personalized Insights</h3>
                <p className="text-[#64748B] leading-relaxed">
                  Receive tailored recommendations and actionable next steps based on your exploration score.
                </p>
              </div>

              <div className="card p-8">
                <div className="w-12 h-12 gradient-accent rounded-lg mb-6 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-3">Win Consultations</h3>
                <p className="text-[#64748B] leading-relaxed">
                  Qualify for free expert guidance sessions to help navigate your academic decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 text-center">
          <p className="text-[#64748B]">
            Trusted by thousands of students making informed major decisions
          </p>
        </footer>
      </div>
    </main>
  );
}
