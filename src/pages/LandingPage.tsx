import { useEffect } from 'react';
import { StickyNav } from '@/components/landing/new/StickyNav';
import { Hero } from '@/components/landing/new/Hero';

import { ValueProps } from '@/components/landing/new/ValueProps';
import { FeatureBento } from '@/components/landing/new/FeatureBento';
import { PrivacySection } from '@/components/landing/new/PrivacySection';
import { HowItWorks } from '@/components/landing/new/HowItWorks';
import { Pricing } from '@/components/landing/new/Pricing';
import { FinalCTA } from '@/components/landing/new/FinalCTA';
import { TrustMarquee } from '@/components/landing/new/TrustMarquee';
import { LandingFooter } from '@/components/landing/new/LandingFooter';
import { BuiltByVeteran } from '@/components/landing/new/BuiltByVeteran';
import { LegalDisclaimer } from '@/components/landing/new/LegalDisclaimer';

export default function LandingPage() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // The app's global CSS sets overflow-x:hidden on html/body which
    // breaks position:sticky and overscroll-behavior:none on body
    // which blocks trackpad momentum scrolling. Override for landing page.
    // Using 'clip' instead of 'hidden' — clips overflow without creating
    // a scroll container, so sticky positioning still works.
    html.style.overflowY = 'scroll';
    html.style.overflowX = 'clip';
    body.style.overscrollBehavior = 'auto';
    body.style.overflowX = 'clip';

    return () => {
      html.style.overflowY = '';
      html.style.overflowX = '';
      body.style.overscrollBehavior = '';
      body.style.overflowX = '';
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#000000' }}>
      <StickyNav />
      <Hero />
      <ValueProps />
      <HowItWorks />
      <TrustMarquee />
      <FeatureBento />
      <BuiltByVeteran />
      <Pricing />
      <PrivacySection />
      <FinalCTA />
      <LegalDisclaimer />
      <LandingFooter />
    </div>
  );
}
