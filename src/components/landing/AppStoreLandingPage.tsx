import { ShieldCheck, Lock, Medal, Flag, Activity, FileText, FolderOpen, Moon, Pill, Upload, Users, Clock, ClipboardCheck, History, Database, Heart, BookOpen, Stethoscope, ArrowRight, Sparkles, Calculator, Brain, MapPin, Star, CheckCircle2, TrendingUp, Zap, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { totalDisabilitiesCount } from '@/data/vaDisabilities';
import { cn } from '@/lib/utils';

const featureCategories = [
  {
    title: 'Health Tracking',
    description: 'Comprehensive daily logging',
    icon: Heart,
    gradient: 'from-rose-500/20 to-pink-500/20',
    borderColor: 'border-rose-500/30',
    iconColor: 'text-rose-400',
    items: [
      { icon: Activity, name: 'Symptom Journal', desc: 'Track daily symptoms' },
      { icon: Heart, name: 'Migraine Log', desc: 'VA-aligned tracking' },
      { icon: Moon, name: 'Sleep Tracker', desc: 'Apnea documentation' },
      { icon: Pill, name: 'Medication Log', desc: 'Side effect records' },
    ]
  },
  {
    title: 'Evidence Building',
    description: 'Build your strongest case',
    icon: FolderOpen,
    gradient: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-400',
    items: [
      { icon: Upload, name: 'Document Upload', desc: 'Secure storage' },
      { icon: FolderOpen, name: 'Evidence Library', desc: 'Organized records' },
      { icon: Users, name: 'Buddy Statements', desc: 'Generate templates' },
      { icon: Clock, name: 'Timeline Builder', desc: 'Visual history' },
    ]
  },
  {
    title: 'Premium Tools',
    description: 'Maximize your rating',
    icon: Calculator,
    gradient: 'from-violet-500/20 to-purple-500/20',
    borderColor: 'border-violet-500/30',
    iconColor: 'text-violet-400',
    items: [
      { icon: Calculator, name: 'VA Calculator', desc: 'Bilateral factor math' },
      { icon: ClipboardCheck, name: 'C&P Exam Prep', desc: 'Question guides' },
      { icon: Brain, name: 'Secondary Finder', desc: '700+ connections' },
      { icon: MapPin, name: 'Claim Journey', desc: '5-phase tracker' },
    ]
  },
];

const stats = [
  { value: totalDisabilitiesCount, label: 'VA Conditions', suffix: '+' },
  { value: 700, label: 'Secondary Links', suffix: '+' },
  { value: 38, label: 'CFR Part 4', suffix: '' },
  { value: 100, label: 'Privacy Score', suffix: '%' },
];

const trustBadges = [
  { icon: Lock, text: 'No Account Required' },
  { icon: Shield, text: 'Data Never Leaves Device' },
  { icon: Award, text: 'Veteran Owned' },
];

export function AppStoreLandingPage() {
  const appStoreUrl = 'https://apps.apple.com/app/vet-claim-support';

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/15 rounded-full blur-[100px] opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <div className="max-w-6xl mx-auto text-center">
            {/* Logo Animation */}
            <div className="mb-8 inline-block">
              <div className="relative group">
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-blue-500/40 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                {/* Icon Container */}
                <div className="relative flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-[2rem] bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 shadow-2xl backdrop-blur-sm transform transition-transform duration-500 group-hover:scale-105">
                  <div className="absolute inset-[1px] rounded-[calc(2rem-1px)] bg-gradient-to-br from-slate-800 to-slate-900" />
                  <ShieldCheck className="relative h-14 w-14 sm:h-16 sm:w-16 text-primary drop-shadow-lg" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-b from-white via-white to-slate-400 bg-clip-text text-transparent">
                Vet Claim
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
                Support
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              The complete toolkit for tracking, organizing, and maximizing your VA disability claim
            </p>

            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 mb-10">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-slow-pulse absolute inline-flex h-full w-full rounded-full bg-primary"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              <span className="text-sm sm:text-base font-medium text-primary">Coming Soon to the App Store</span>
            </div>

            {/* Pricing Card */}
            <div className="mb-10">
              <div className="relative inline-block">
                {/* Floating Save Badge */}
                <div className="absolute -top-4 -right-4 z-10 transform rotate-12 hover:rotate-0 transition-transform duration-300">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 shadow-lg shadow-emerald-500/30 text-sm font-bold px-3 py-1.5">
                    SAVE 50%
                  </Badge>
                </div>

                {/* Pricing Container */}
                <div className="relative bg-gradient-to-b from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl px-10 py-8 shadow-2xl">
                  {/* Inner glow */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-transparent via-transparent to-white/5" />

                  <div className="relative">
                    {/* Launch Special Badge */}
                    <div className="flex justify-center mb-3">
                      <Badge className="bg-gradient-to-r from-primary/80 to-blue-500/80 text-white border-0 shadow-lg shadow-primary/20 text-xs font-bold px-4 py-1.5 animate-pulse">
                        🚀 LIMITED TIME LAUNCH PRICE
                      </Badge>
                    </div>

                    {/* Launch Price */}
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-2xl text-slate-400 font-medium">$</span>
                      <span className="text-6xl sm:text-7xl font-bold bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent tracking-tight">
                        4.99
                      </span>
                    </div>

                    {/* Regular Price */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <span className="text-slate-500 line-through text-lg">$9.99</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400 text-sm">One-time purchase</span>
                    </div>

                    {/* Value Props */}
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm text-emerald-300 font-medium">No Ads</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                        <CheckCircle2 className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-blue-300 font-medium">No Subscription</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                        <CheckCircle2 className="h-4 w-4 text-violet-400" />
                        <span className="text-sm text-violet-300 font-medium">No Account Required</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* App Store Button */}
            <div className="mb-12">
              <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                <Button
                  size="lg"
                  className="h-16 px-10 text-lg font-semibold bg-white hover:bg-slate-100 text-black rounded-2xl gap-3 shadow-2xl shadow-white/20 transition-all duration-300 hover:scale-105 hover:shadow-white/30"
                >
                  <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Download on the App Store
                </Button>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-16">
              {trustBadges.map((badge) => (
                <div key={badge.text} className="flex items-center gap-2 text-slate-400">
                  <badge.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Veteran Badge Section */}
        <section className="px-6 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-900/30 via-amber-950/20 to-amber-900/10 border border-amber-600/20 p-8 sm:p-10">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-600/10 rounded-full blur-2xl" />

              <div className="relative flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="flex gap-4">
                  <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 shadow-lg shadow-amber-500/10">
                    <Medal className="h-8 w-8 text-amber-400" />
                  </div>
                  <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 shadow-lg shadow-amber-500/10">
                    <Flag className="h-8 w-8 text-amber-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-amber-100 mb-2">
                    Built by a Veteran, For Those Who Serve
                  </h3>
                  <p className="text-amber-200/70 text-base sm:text-lg">
                    Created by someone who has been through the claims process—for veterans, service members, and their families.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6 pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    "relative overflow-hidden rounded-2xl p-6 text-center",
                    "bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-white/5",
                    "backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:scale-105"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent mb-1">
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Symptom Checker Feature Highlight */}
        <section className="px-6 pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/15 border border-emerald-500/20 p-8 sm:p-12">
              {/* Decorative */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-400/20 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-teal-400/15 to-transparent rounded-full blur-2xl" />

              <div className="relative">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-emerald-400/30 blur-2xl rounded-full scale-150 group-hover:scale-175 transition-transform duration-500" />
                      <div className="relative flex items-center justify-center h-24 w-24 sm:h-28 sm:w-28 rounded-3xl bg-gradient-to-br from-emerald-500/30 to-teal-500/20 border border-emerald-400/30 shadow-2xl shadow-emerald-500/20">
                        <Stethoscope className="h-12 w-12 sm:h-14 sm:w-14 text-emerald-400" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs font-bold mb-4 px-3 py-1">
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      FLAGSHIP FEATURE
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                      Intelligent Symptom Checker
                    </h2>
                    <p className="text-lg text-slate-300 mb-6 max-w-2xl">
                      Enter your symptoms and discover potential <span className="text-emerald-400 font-semibold">VA-ratable conditions</span>.
                      Our smart analyzer also suggests <span className="text-teal-400 font-semibold">secondary conditions</span> to maximize your combined rating.
                    </p>

                    {/* Feature pills */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                      {[
                        { icon: ArrowRight, text: 'Match symptoms to conditions', color: 'emerald' },
                        { icon: ArrowRight, text: 'Find secondary connections', color: 'teal' },
                        { icon: ArrowRight, text: 'Rating optimization tips', color: 'cyan' },
                      ].map((item) => (
                        <div
                          key={item.text}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full",
                            "bg-white/5 border border-white/10",
                            "transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                          )}
                        >
                          <item.icon className={cn("h-4 w-4", `text-${item.color}-400`)} />
                          <span className="text-sm text-slate-300">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Everything You Need
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                A comprehensive suite of tools designed specifically for the VA claims process
              </p>
            </div>

            {/* Feature Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {featureCategories.map((category) => (
                <div
                  key={category.title}
                  className={cn(
                    "relative overflow-hidden rounded-2xl p-6",
                    "bg-gradient-to-br", category.gradient,
                    "border", category.borderColor,
                    "transition-all duration-300 hover:scale-[1.02]"
                  )}
                >
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className={cn(
                      "flex items-center justify-center h-12 w-12 rounded-xl",
                      "bg-white/10 border border-white/10"
                    )}>
                      <category.icon className={cn("h-6 w-6", category.iconColor)} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{category.title}</h3>
                      <p className="text-sm text-slate-400">{category.description}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {category.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-200"
                      >
                        <item.icon className="h-5 w-5 text-slate-400" />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-white">{item.name}</span>
                          <span className="text-xs text-slate-500 ml-2">{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Reference Database */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-blue-500/10 to-violet-500/10 border border-primary/20 p-8 sm:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

              <div className="relative flex flex-col sm:flex-row items-center gap-8">
                <div className="flex items-center justify-center h-24 w-24 rounded-2xl bg-gradient-to-br from-primary/30 to-blue-500/20 border border-primary/30 shadow-xl shadow-primary/10 shrink-0">
                  <Database className="h-12 w-12 text-primary" />
                </div>

                <div className="text-center sm:text-left flex-1">
                  <div className="flex items-baseline justify-center sm:justify-start gap-3 mb-3">
                    <span className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary via-blue-400 to-violet-400 bg-clip-text text-transparent">
                      {totalDisabilitiesCount}
                    </span>
                    <span className="text-2xl sm:text-3xl font-semibold text-white">VA Conditions</span>
                  </div>
                  <p className="text-slate-400 mb-4 text-lg">
                    Complete 38 CFR Part 4 reference database at your fingertips
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    {[
                      { icon: BookOpen, text: 'Rating Criteria' },
                      { icon: FileText, text: 'Diagnostic Codes' },
                      { icon: ClipboardCheck, text: 'Required Forms' },
                      { icon: History, text: 'Military Operations' },
                    ].map((item) => (
                      <Badge
                        key={item.text}
                        variant="outline"
                        className="bg-white/5 border-white/20 text-slate-300 px-3 py-1.5"
                      >
                        <item.icon className="h-3.5 w-3.5 mr-1.5" />
                        {item.text}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="px-6 pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Why Veterans Choose Us
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Lock,
                  title: 'Complete Privacy',
                  description: 'Your data stays on your device. No accounts, no cloud sync, no tracking.',
                  gradient: 'from-emerald-500/20 to-green-500/20',
                  iconColor: 'text-emerald-400'
                },
                {
                  icon: Zap,
                  title: 'Instant Access',
                  description: 'No signup required. Install and start building your evidence immediately.',
                  gradient: 'from-amber-500/20 to-orange-500/20',
                  iconColor: 'text-amber-400'
                },
                {
                  icon: TrendingUp,
                  title: 'Maximize Your Rating',
                  description: 'Smart tools help identify secondary conditions and optimize your claim.',
                  gradient: 'from-blue-500/20 to-cyan-500/20',
                  iconColor: 'text-blue-400'
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={cn(
                    "relative overflow-hidden rounded-2xl p-6",
                    "bg-gradient-to-br", item.gradient,
                    "border border-white/10",
                    "transition-all duration-300 hover:scale-105"
                  )}
                >
                  <item.icon className={cn("h-10 w-10 mb-4", item.iconColor)} />
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 p-10 sm:p-14">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />

              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Ready to Build Your Claim?
                </h2>
                <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
                  Join thousands of veterans who are taking control of their VA claims process.
                </p>

                <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-3 shadow-xl shadow-primary/20 transition-all duration-300 hover:scale-105"
                  >
                    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Download Now — $4.99
                  </Button>
                </a>

                <p className="text-sm text-slate-500 mt-4">
                  One-time purchase • No subscription • No ads
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 px-6 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <p className="text-sm text-slate-500 text-center sm:text-left">
                Not affiliated with the U.S. Department of Veterans Affairs
              </p>
              <div className="flex items-center gap-8">
                <a href="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Terms of Use
                </a>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <p className="text-xs text-slate-600">
                © {new Date().getFullYear()} Vet Claim Support. Built with care for those who served.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
