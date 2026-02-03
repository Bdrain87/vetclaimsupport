import { ShieldCheck, Lock, Medal, Flag, Activity, FileText, FolderOpen, MapPin, Moon, Pill, Upload, Users, Clock, ClipboardCheck, History, Database, Heart, BookOpen, Stethoscope, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const featureCategories = [
  {
    title: 'Health Tracking',
    icon: Heart,
    items: [
      { icon: Activity, name: 'Symptom Journal' },
      { icon: Heart, name: 'Migraine Log' },
      { icon: Moon, name: 'Sleep Tracker' },
      { icon: Pill, name: 'Medication Log' },
    ]
  },
  {
    title: 'Evidence Building',
    icon: FolderOpen,
    items: [
      { icon: Upload, name: 'Document Upload' },
      { icon: FolderOpen, name: 'Evidence Library' },
      { icon: Users, name: 'Buddy Statements' },
      { icon: Clock, name: 'Timeline Builder' },
    ]
  },
  {
    title: 'Claim Tools',
    icon: ClipboardCheck,
    items: [
      { icon: ClipboardCheck, name: 'C&P Exam Prep' },
      { icon: FileText, name: 'Documents Checklist' },
      { icon: History, name: 'Service History' },
      { icon: MapPin, name: '4-Phase Progress' },
    ]
  },
];

export function AppStoreLandingPage() {
  const appStoreUrl = 'https://apps.apple.com/app/vet-claim-support'; // Replace with actual App Store URL

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        {/* Logo */}
        <div className="mb-6 animate-fade-in">
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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-sm font-medium">Coming Soon to the App Store</span>
        </div>

        {/* Introductory Pricing Section */}
        <div className="mb-8 animate-fade-in">
          <div className="relative inline-block">
            {/* Save 50% Badge */}
            <div className="absolute -top-3 -right-3 z-10">
              <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg shadow-emerald-500/30 text-xs font-bold px-2 py-1">
                SAVE 50%
              </Badge>
            </div>
            
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-8 py-6">
              {/* Launch Price */}
              <div className="flex items-baseline justify-center gap-1 mb-1">
                <span className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
                  $4.99
                </span>
              </div>
              
              {/* Regular Price Strikethrough */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-slate-500 line-through text-lg">$9.99</span>
                <span className="text-slate-400 text-sm">regular price</span>
              </div>
              
              {/* Urgency Message */}
              <div className="flex items-center justify-center gap-2 text-amber-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                </span>
                <span className="text-sm font-medium">Limited Time Launch Offer</span>              <span className="text-sm font-medium text-emerald-400">No ads. Ever.</span>
              </div>
            </div>
          </div>
        </div>

        {/* App Store Button */}
        <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="mb-8">
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

        {/* Built by Veteran Badge */}
        <div className="mb-10 animate-fade-in">
          <div className="inline-flex flex-col items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-br from-amber-900/20 to-amber-950/10 border border-amber-700/30">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-600/20 border border-amber-600/30">
                <Medal className="h-5 w-5 text-amber-500" />
              </div>
              <div className="text-center">
                <p className="text-amber-100 font-semibold text-sm sm:text-base">
                  Proudly Built by a 100% Disabled Veteran
                </p>
                <p className="text-amber-200/60 text-xs sm:text-sm">
                  Made by veterans for our service members and fellow veterans
                </p>
              </div>
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-600/20 border border-amber-600/30">
                <Flag className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid - Privacy & AI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl animate-fade-in mb-12">
          {[
            { icon: Lock, title: 'Privacy-First', desc: 'Your data stays on your device, always secure and private' },
            { icon: Sparkles, title: 'AI-Powered', desc: 'Smart analysis helps identify conditions and strengthen your claim' },
          ].map((feature) => (
            <div key={feature.title} className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <feature.icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-slate-400 text-center">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Comprehensive Feature Showcase */}
        <div className="w-full max-w-5xl animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">Everything You Need</h2>
          
          {/* Symptom Checker Feature Highlight */}
          <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-500/20 border border-emerald-500/30 p-6 sm:p-8">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-400/20 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-400/20 to-transparent rounded-full blur-xl" />
            
            <div className="relative flex flex-col lg:flex-row items-center gap-6">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-400/30 blur-xl rounded-full scale-150" />
                  <div className="relative flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-500/20 border border-emerald-400/40 shadow-lg shadow-emerald-500/20">
                    <Stethoscope className="h-10 w-10 text-emerald-400" />
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs font-semibold">
                    <Sparkles className="h-3 w-3 mr-1" />
                    NEW FEATURE
                  </Badge>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Symptom Checker
                </h3>
                <p className="text-slate-300 text-base sm:text-lg mb-4 max-w-2xl">
                  Enter your symptoms and discover potential <span className="text-emerald-400 font-semibold">VA-ratable conditions</span> you may qualify for. 
                  Our smart analyzer also suggests <span className="text-teal-400 font-semibold">secondary conditions</span> that could increase your combined rating.
                </p>
                
                {/* Feature bullets */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-sm text-slate-300">Match symptoms to conditions</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <ArrowRight className="h-3.5 w-3.5 text-teal-400" />
                    <span className="text-sm text-slate-300">Find secondary connections</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="text-sm text-slate-300">Maximize your rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featureCategories.map((category) => (
              <div key={category.title} className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-white">{category.title}</h3>
                </div>
                <div className="space-y-2">
                  {category.items.map((item) => (
                    <div key={item.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <item.icon className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-300">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Reference Database Highlight */}
          <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-primary/20 border border-primary/30 shrink-0">
                <Database className="h-10 w-10 text-primary" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <div className="flex items-baseline justify-center sm:justify-start gap-2 mb-2">
                  <span className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
                    941
                  </span>
                  <span className="text-xl sm:text-2xl font-semibold text-white">VA Conditions</span>
                </div>
                <p className="text-slate-400 mb-3">
                  Complete 38 CFR Part 4 reference database at your fingertips
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Badge variant="outline" className="bg-white/5 border-white/20 text-slate-300">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Rating Criteria
                  </Badge>
                  <Badge variant="outline" className="bg-white/5 border-white/20 text-slate-300">
                    <FileText className="h-3 w-3 mr-1" />
                    Diagnostic Codes
                  </Badge>
                  <Badge variant="outline" className="bg-white/5 border-white/20 text-slate-300">
                    <ClipboardCheck className="h-3 w-3 mr-1" />
                    Required Forms
                  </Badge>
                </div>
              </div>
            </div>
          </div>
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
