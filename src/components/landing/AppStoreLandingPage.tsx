import { ShieldCheck, CheckCircle2, Smartphone, Lock, Wifi, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppStoreLandingPage() {
  const appStoreUrl = 'https://apps.apple.com/app/vet-claim-support'; // Replace with actual App Store URL

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full scale-150" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 shadow-2xl shadow-primary/20">
              <ShieldCheck className="h-12 w-12 text-primary" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight animate-fade-in">
          Vet Claim Support
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-400 mb-4 max-w-lg animate-fade-in">
          Track and organize your VA disability claim evidence with confidence
        </p>

        {/* Coming Soon Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-sm font-medium">Coming Soon to the App Store</span>
        </div>

        {/* App Store Button */}
        <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="mb-12">
          <Button
            size="lg"
            className="h-16 px-8 text-lg font-semibold bg-white hover:bg-slate-100 text-black rounded-2xl gap-3 shadow-xl shadow-white/10 transition-all hover:scale-105"
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current" aria-hidden="true">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Download on the App Store
          </Button>
        </a>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl animate-fade-in">
          {[
            { icon: Lock, title: 'Privacy-First', desc: 'Your data stays on your device, always secure and private' },
            { icon: Wifi, title: 'Offline-Ready', desc: 'Full functionality without internet connection' },
            { icon: Heart, title: 'Built for Veterans', desc: 'Designed by those who understand the claims process' },
          ].map((feature) => (
            <div key={feature.title} className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <feature.icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-slate-400 text-center">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 text-center border-t border-white/10">
        <p className="text-sm text-slate-500 mb-4">
          Not affiliated with the U.S. Department of Veterans Affairs
        </p>
        <div className="flex items-center justify-center gap-6 text-sm">
          <a href="/privacy" className="text-slate-400 hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" className="text-slate-400 hover:text-white transition-colors">
            Terms of Use
          </a>
        </div>
      </footer>
    </div>
  );
}
