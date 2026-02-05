import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Clock, Briefcase, Heart } from 'lucide-react';

const audiences = [
  {
    title: 'Active Duty',
    description: 'Getting out in 6 months? Start documenting now. Build your evidence package while you still have access to military medical records.',
    tagline: 'Start documenting now for when you separate',
    icon: Shield,
    gradient: 'from-blue-500 to-indigo-500'
  },
  {
    title: 'BDD Filers',
    description: '180-90 days before separation is your window. Get organized, file your claim before discharge, and receive compensation from Day 1.',
    tagline: 'File before discharge, get paid Day 1',
    icon: Clock,
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    title: 'Recently Separated',
    description: 'Just got out? Denied or underrated? Now you\'ll understand why. Learn exactly what the VA needs and prepare a winning supplemental claim.',
    tagline: 'Denied or underrated? Now you\'ll know why',
    icon: Briefcase,
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    title: 'Long-Time Veterans',
    description: 'Been out for 20 years? Knees getting worse? Secondary conditions can dramatically increase your rating. Your service earned this.',
    tagline: 'It\'s never too late. Secondary conditions exist.',
    icon: Heart,
    gradient: 'from-rose-500 to-pink-500'
  }
];

export function AudienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 sm:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0A1628] mb-4">
            Built For Every Veteran
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto">
            Whether you're active duty or retired 20 years ago, we've got you covered.
          </p>
        </motion.div>

        {/* Audience cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              className="group relative bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${audience.gradient}`} />

              <div className="flex items-start gap-5">
                {/* Icon */}
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${audience.gradient} flex items-center justify-center shadow-lg`}>
                  <audience.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#0A1628] mb-2">
                    {audience.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {audience.description}
                  </p>
                  <p className="text-sm font-semibold bg-gradient-to-r from-[#0A1628] to-[#1E3A5F] bg-clip-text text-transparent">
                    {audience.tagline}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
