import { StickyNav } from '@/components/landing/new/StickyNav';
import { Hero } from '@/components/landing/new/Hero';
import { SocialProof } from '@/components/landing/new/SocialProof';
import { ValueProps } from '@/components/landing/new/ValueProps';
import { ScrollStory } from '@/components/landing/new/ScrollStory';
import { FeatureBento } from '@/components/landing/new/FeatureBento';
import { PrivacySection } from '@/components/landing/new/PrivacySection';
import { HowItWorks } from '@/components/landing/new/HowItWorks';
import { Pricing } from '@/components/landing/new/Pricing';
import { FinalCTA } from '@/components/landing/new/FinalCTA';
import { LandingFooter } from '@/components/landing/new/LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#000000' }}>
      <StickyNav />
      <Hero />
      <SocialProof />
      <ValueProps />
      <ScrollStory />
      <FeatureBento />
      <PrivacySection />
      <HowItWorks />
      <Pricing />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
}
