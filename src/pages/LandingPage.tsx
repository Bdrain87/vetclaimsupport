import { useEffect } from 'react';
import { StickyNav } from '@/components/landing/new/StickyNav';
import { Hero } from '@/components/landing/new/Hero';
import { TrustMarquee } from '@/components/landing/new/TrustMarquee';
import { SocialProof } from '@/components/landing/new/SocialProof';
import { AIHero } from '@/components/landing/new/AIHero';
import { HowItWorks } from '@/components/landing/new/HowItWorks';
import { OnlyInVCS } from '@/components/landing/new/OnlyInVCS';
import { ProductShowcase } from '@/components/landing/new/ProductShowcase';
import { CompetitorComparison } from '@/components/landing/new/CompetitorComparison';
import { PersonalizedDemo } from '@/components/landing/new/PersonalizedDemo';
import { BuiltByVeteran } from '@/components/landing/new/BuiltByVeteran';
import { Pricing } from '@/components/landing/new/Pricing';
import { FAQ } from '@/components/landing/new/FAQ';
import { FinalCTA } from '@/components/landing/new/FinalCTA';
import { LandingFooter } from '@/components/landing/new/LandingFooter';
import { SECTION_DIVIDER, NOISE_OVERLAY, MESH_GRADIENT_1, MESH_GRADIENT_2, MESH_GRADIENT_3 } from '@/lib/landing-animations';

function SectionDivider() {
  return (
    <div
      className="max-w-5xl mx-auto h-px"
      style={{ background: SECTION_DIVIDER }}
    />
  );
}

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
    <div className="min-h-screen relative" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Noise texture overlay — subtle film grain for premium depth */}
      <div
        className="fixed inset-0 z-50 pointer-events-none"
        style={{
          backgroundImage: NOISE_OVERLAY,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
          opacity: 0.03,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Ambient gradient pools for spatial depth */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: '15%',
          left: '-10%',
          width: '60%',
          height: '50%',
          background: MESH_GRADIENT_1,
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          top: '55%',
          right: '-10%',
          width: '50%',
          height: '40%',
          background: MESH_GRADIENT_2,
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          top: '80%',
          left: '20%',
          width: '60%',
          height: '30%',
          background: MESH_GRADIENT_3,
          filter: 'blur(70px)',
          zIndex: 0,
        }}
      />

      <StickyNav />
      <main className="relative z-10">
        <Hero />
        <TrustMarquee />
        <SocialProof />
        <AIHero />
        <SectionDivider />
        <HowItWorks />
        <SectionDivider />
        <OnlyInVCS />
        <SectionDivider />
        <ProductShowcase />
        <SectionDivider />
        <CompetitorComparison />
        <SectionDivider />
        <PersonalizedDemo />
        <SectionDivider />
        <BuiltByVeteran />
        <SectionDivider />
        <Pricing />
        <SectionDivider />
        <FAQ />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
