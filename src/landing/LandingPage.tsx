import { useEffect } from 'react';
import { HeroSection } from './HeroSection';
import { ProblemSection } from './ProblemSection';
import { SolutionSection } from './SolutionSection';
import { TestimonialsSection } from './TestimonialsSection';
import { ComparisonSection } from './ComparisonSection';
import { AudienceSection } from './AudienceSection';
import { CTASection } from './CTASection';
import { Footer } from './Footer';
import './landing.css';

export function LandingPage() {
  // Ensure scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="landing-page min-h-screen bg-white">
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-[#0A1628] focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      <main id="main-content">
        {/* Section 1: Hero (Above the Fold) */}
        <HeroSection />

        {/* Section 2: The Problem (Pain Points) */}
        <ProblemSection />

        {/* Section 3: The Solution (Features) */}
        <SolutionSection />

        {/* Section 4: Testimonials */}
        <TestimonialsSection />

        {/* Section 5: Comparison */}
        <ComparisonSection />

        {/* Section 6: Audience */}
        <AudienceSection />

        {/* Section 7: Final CTA */}
        <CTASection />
      </main>

      {/* Section 8: Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
