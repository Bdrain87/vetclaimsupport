import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HEADING_H2_STYLE,
  HEADING_H3_STYLE,
  EASE_SMOOTH,
} from '@/lib/landing-animations';
import { Activity, FileText, Package, Database } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  details: string[];
}

const FEATURES: Feature[] = [
  {
    icon: Activity,
    title: 'Symptom & Health Tracking',
    description: 'Log symptoms mapped directly to VA rating criteria.',
    details: [
      'Daily symptom logs with severity and frequency',
      'Sleep, migraine, and medication trackers',
      'Trend analysis and health timeline',
      'Interactive body map for visual documentation',
    ],
  },
  {
    icon: FileText,
    title: 'AI-Assisted Document Builder',
    description: 'Generate personal statements, buddy letters, and doctor summaries.',
    details: [
      'Personal statement builder with guided prompts',
      'Buddy and lay statement templates',
      'Doctor summary outlines for your clinician',
      'Stressor statement writer for PTSD claims',
    ],
  },
  {
    icon: Package,
    title: 'Claim Packet Export',
    description: 'Everything organized, exported, ready for your C&P exam.',
    details: [
      'Full claim packet compilation',
      'Organized sections by condition',
      'Submission checklist and review',
      'PDF export for your records',
    ],
  },
  {
    icon: Database,
    title: '800+ Condition Database',
    description: 'Research every VA-rated condition. Find secondaries. Know your rating.',
    details: [
      'Comprehensive rating criteria for each condition',
      'Secondary condition finder',
      'C&P exam prep with condition-specific guides',
      'DBQ criteria review and rating breakdowns',
    ],
  },
];

function FeatureIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{
        background: 'rgba(191, 149, 63, 0.1)',
        border: '1px solid rgba(191, 149, 63, 0.2)',
      }}
    >
      <Icon size={22} style={{ color: '#D4AF37' }} />
    </div>
  );
}

function FeaturePlaceholder({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <div
      className="w-full rounded-2xl flex items-center justify-center"
      style={{
        backgroundColor: '#111111',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        aspectRatio: '4 / 3',
        maxHeight: '360px',
      }}
    >
      <div className="text-center p-8">
        <Icon size={48} style={{ color: 'rgba(212, 175, 55, 0.3)' }} className="mx-auto mb-4" />
        <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.2)' }}>
          App screenshot
        </p>
      </div>
    </div>
  );
}

export function ProductShowcase() {
  return (
    <section
      id="features"
      className="py-[120px]"
      style={{ backgroundColor: '#000000', scrollMarginTop: '5rem' }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl text-white text-center mb-20 px-4"
          style={HEADING_H2_STYLE}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_SMOOTH }}
        >
          Everything you need to prepare
        </motion.h2>

        {/* Feature sections — alternating left/right layout */}
        <div className="space-y-24 md:space-y-32">
          {FEATURES.map((feature, i) => {
            const isReversed = i % 2 === 1;
            return (
              <motion.div
                key={feature.title}
                className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center ${
                  isReversed ? 'md:[direction:rtl]' : ''
                }`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: EASE_SMOOTH }}
              >
                {/* Text content */}
                <div className={isReversed ? 'md:[direction:ltr]' : ''}>
                  <FeatureIcon icon={feature.icon} />
                  <h3
                    className="text-2xl md:text-3xl text-white mt-5 mb-3"
                    style={HEADING_H3_STYLE}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-lg mb-6 leading-relaxed"
                    style={{ color: '#9CA3AF' }}
                  >
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-start gap-3 text-[15px]"
                        style={{ color: '#D1D5DB' }}
                      >
                        <span
                          className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: '#D4AF37' }}
                        />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Screenshot placeholder */}
                <div className={isReversed ? 'md:[direction:ltr]' : ''}>
                  <FeaturePlaceholder feature={feature} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* "See all features" link */}
        <motion.p
          className="text-center mt-20 text-lg"
          style={{ color: '#9CA3AF' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE_SMOOTH }}
        >
          50+ tools included — from calculators to trackers to exam prep.{' '}
          <Link
            to="/features"
            className="no-underline font-medium transition-colors"
            style={{ color: '#D4AF37' }}
          >
            See all features →
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
