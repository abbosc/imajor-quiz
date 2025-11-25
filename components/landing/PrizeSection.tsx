import ConsultantStack from './ConsultantStack';

export default function PrizeSection() {
  return (
    <section className="min-h-screen bg-white flex items-center py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFF5F3] to-[#FFE8E3] text-[#FF6B4A] px-5 py-2.5 rounded-full text-sm font-semibold mb-6 shadow-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Win Expert Consultations
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-4">
              Get Advice from Top University Students
            </h3>
            <p className="text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto leading-relaxed">
              <span className="font-semibold text-[#FF6B4A]">7 random quiz-takers</span> will win a 30-minute 1:1 consultation session with our expert mentors from world-class universities.
            </p>
          </div>

          {/* Consultant cards grid */}
          <ConsultantStack />

          {/* Bottom CTA hint */}
          <p className="text-center text-sm text-[#94A3B8] mt-10">
            Take the quiz for a chance to win. No purchase necessary.
          </p>
        </div>
      </div>
    </section>
  );
}
