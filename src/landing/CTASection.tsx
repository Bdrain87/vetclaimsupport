import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, CheckCircle } from 'lucide-react';

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const appStoreUrl = 'https://apps.apple.com/app/vet-claim-support';

  return (
    <section ref={ref} className="py-24 sm:py-32 bg-gradient-to-b from-[#14192b] via-[#1a2236] to-[#1e2844] relative overflow-hidden">
      {/* Ambient effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#C9A227]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Icon */}
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Shield className="w-10 h-10 text-white" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Your Service Earned This
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Stop leaving money on the table. Stop letting the VA underrate you.
          <span className="block mt-2 text-white/90 font-medium">
            Take control of your claim today.
          </span>
        </motion.p>

        {/* CTA Button */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href={appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-white bg-[#10B981] rounded-2xl shadow-lg shadow-[#10B981]/25 hover:shadow-[#10B981]/40 hover:scale-[1.02] transition-all duration-300"
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" aria-hidden="true">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Download on the App Store
          </a>
        </motion.div>

        {/* Price and guarantee */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-white/80 font-medium">
            $4.99 • No subscriptions • No hidden fees
          </p>

          {/* Money back guarantee */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <CheckCircle className="w-5 h-5 text-[#10B981]" />
            <span className="text-sm text-white/70">30-day money back guarantee</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
