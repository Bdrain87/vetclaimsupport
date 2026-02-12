import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { X, Check, Clock, DollarSign, Shield, Zap } from 'lucide-react';

export function ComparisonSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const themFeatures = [
    { text: '$5,000 - $25,000 upfront costs', icon: DollarSign },
    { text: 'Months of waiting for appointments', icon: Clock },
    { text: 'No guarantees on results', icon: X },
    { text: 'Limited availability', icon: Clock },
    { text: 'One-size-fits-all approach', icon: X }
  ];

  const usFeatures = [
    { text: '$4.99 total cost', icon: DollarSign },
    { text: 'Start immediately', icon: Zap },
    { text: 'Work at your own pace', icon: Check },
    { text: 'Available 24/7', icon: Clock },
    { text: 'Personalized for your conditions', icon: Shield }
  ];

  return (
    <section ref={ref} className="py-24 sm:py-32 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#000000] mb-4">
            What You'd Pay Elsewhere
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto">
            Compare your options.
          </p>
        </motion.div>

        {/* Comparison cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Them column */}
          <motion.div
            className="bg-white rounded-2xl p-8 border border-gray-200"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Claim Consultants
              </span>
              <div className="mt-4 text-4xl sm:text-5xl font-bold text-gray-400">
                $5K-$25K
              </div>
              <p className="text-gray-500 mt-2">average cost</p>
            </div>

            <ul className="space-y-4">
              {themFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <X className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-gray-600">{feature.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Us column */}
          <motion.div
            className="relative bg-gradient-to-b from-[#000000] to-[#0a0a0a] rounded-2xl p-8 text-white shadow-xl"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#10B981] text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
              Best Value
            </div>

            <div className="text-center mb-8">
              <span className="text-sm font-medium text-white/60 uppercase tracking-wider">
                Vet Claim Support
              </span>
              <div className="mt-4 text-4xl sm:text-5xl font-bold text-white">
                $4.99
              </div>
              <p className="text-white/70 mt-2">that's it. forever.</p>
            </div>

            <ul className="space-y-4">
              {usFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/90">{feature.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Price callout */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-2xl sm:text-3xl font-bold text-[#000000]">
            $4.99 — That's it. Forever.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
