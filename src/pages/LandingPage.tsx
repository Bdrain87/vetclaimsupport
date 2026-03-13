import { useEffect } from 'react';
import { StickyNav } from '@/components/landing/new/StickyNav';
import { Hero } from '@/components/landing/new/Hero';
import { TrustMarquee } from '@/components/landing/new/TrustMarquee';
import { HowItWorks } from '@/components/landing/new/HowItWorks';
import { BuiltByVeteran } from '@/components/landing/new/BuiltByVeteran';
import { ProductShowcase } from '@/components/landing/new/ProductShowcase';
import { AIShowcase } from '@/components/landing/new/AIShowcase';
import { PersonalizedDemo } from '@/components/landing/new/PersonalizedDemo';
import { ComparisonTable } from '@/components/landing/new/ComparisonTable';
import { Pricing } from '@/components/landing/new/Pricing';
import { SocialProof } from '@/components/landing/new/SocialProof';
import { FinalCTA } from '@/components/landing/new/FinalCTA';
import { LandingFooter } from '@/components/landing/new/LandingFooter';

export default function LandingPage() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // The app's global CSS sets overflow-x:hidden on html/body/#root which
    // breaks position:sticky, overscroll-behavior:none blocks trackpad
    // momentum scrolling, and overflow:hidden can break IntersectionObserver
    // (used by whileInView animations). Override for landing page.
    // Using 'clip' instead of 'hidden' — clips overflow without creating
    // a scroll container, so sticky + IntersectionObserver still work.
    const root = document.getElementById('root');
    html.style.overflowY = 'scroll';
    html.style.overflowX = 'clip';
    body.style.overscrollBehavior = 'auto';
    body.style.overflowX = 'clip';
    if (root) root.style.overflowX = 'clip';

    return () => {
      html.style.overflowY = '';
      html.style.overflowX = '';
      body.style.overscrollBehavior = '';
      body.style.overflowX = '';
      if (root) root.style.overflowX = '';
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      <StickyNav />
      <main>
        <Hero />
        <TrustMarquee />
        <HowItWorks />
        <BuiltByVeteran />
        <ProductShowcase />
        <AIShowcase />
        <PersonalizedDemo />
        <ComparisonTable />
        <Pricing />
        <SocialProof />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
