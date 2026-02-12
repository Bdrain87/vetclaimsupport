import { useEffect } from 'react';
import { StickyNav } from '@/components/landing/new/StickyNav';
import { Hero } from '@/components/landing/new/Hero';
import { SocialProof } from '@/components/landing/new/SocialProof';
import { ValueProps } from '@/components/landing/new/ValueProps';
import { FeatureBento } from '@/components/landing/new/FeatureBento';
import { PrivacySection } from '@/components/landing/new/PrivacySection';
import { HowItWorks } from '@/components/landing/new/HowItWorks';
import { Pricing } from '@/components/landing/new/Pricing';
import { FinalCTA } from '@/components/landing/new/FinalCTA';
import { LandingFooter } from '@/components/landing/new/LandingFooter';

export default function LandingPage() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // The app's global CSS sets overflow-x:hidden on html and
    // overscroll-behavior:none on body which can block trackpad
    // momentum scrolling. Override for the landing page.
    html.style.overflowY = 'scroll';
    body.style.overscrollBehavior = 'auto';

    return () => {
      html.style.overflowY = '';
      body.style.overscrollBehavior = '';
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#000000' }}>
      <StickyNav />
      <Hero />
      <SocialProof />
      <Pricing />
      <ValueProps />
      <FeatureBento />
      <HowItWorks />
      <PrivacySection />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
}
