import { motion } from 'framer-motion';
import { Shield, CheckCircle, Star, TrendingUp, Users } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function HeroSection() {
  const appStoreUrl = 'https://apps.apple.com/app/vet-claim-support';

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#14192b] via-[#192136] to-[#1e2844]" />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#C9A227]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 lg:py-32">
        <motion.div
          className="text-center"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          {/* Shield icon */}
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
            variants={fadeInUp}
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>

          {/* Primary headline */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight"
            variants={fadeInUp}
          >
            Get the VA Rating
            <br />
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              You Earned
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-10 leading-relaxed"
            variants={fadeInUp}
          >
            The same preparation that costs veterans $10,000+ with claim consultants.
            <span className="block mt-2 text-white/90 font-medium">In your pocket. On your terms.</span>
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={fadeInUp} className="mb-6">
            <a
              href={appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-[#10B981] rounded-2xl shadow-lg shadow-[#10B981]/25 hover:shadow-[#10B981]/40 hover:scale-[1.02] transition-all duration-300"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download for $4.99
            </a>
          </motion.div>

          {/* No subscription note */}
          <motion.p
            className="text-sm text-white/50 mb-12"
            variants={fadeInUp}
          >
            No subscriptions. No hidden fees.
          </motion.p>

          {/* iPhone mockup placeholder */}
          <motion.div
            className="relative mx-auto mb-12 max-w-[280px] sm:max-w-[320px]"
            variants={fadeInUp}
          >
            <div className="relative aspect-[9/19] bg-gradient-to-b from-slate-800 to-slate-900 rounded-[3rem] border-4 border-slate-700 shadow-2xl overflow-hidden">
              {/* Phone notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full" />
              {/* Screen content placeholder */}
              <div className="absolute inset-4 top-10 bg-gradient-to-b from-[#14192b] to-[#1e2844] rounded-2xl flex items-center justify-center">
                <div className="text-center p-4">
                  <Shield className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/30 text-sm">App Preview</p>
                </div>
              </div>
            </div>
            {/* Reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-[3rem] pointer-events-none" />
          </motion.div>

          {/* Trust bar */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-8 border-t border-white/10"
            variants={fadeInUp}
          >
            <div className="flex items-center gap-2 text-white/60">
              <CheckCircle className="w-5 h-5 text-[#10B981]" />
              <span className="text-sm font-medium">Built by veterans</span>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <Users className="w-5 h-5 text-[#10B981]" />
              <span className="text-sm font-medium">Used by thousands</span>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <TrendingUp className="w-5 h-5 text-[#10B981]" />
              <span className="text-sm font-medium">Average rating increase: 30%</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
