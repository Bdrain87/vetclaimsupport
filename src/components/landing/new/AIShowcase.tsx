/**
 * AIShowcase — Landing page section highlighting streaming AI analysis,
 * context-aware tools, and data-connected intelligence.
 */
import { motion } from 'motion/react';
import {
  HEADING_H2_STYLE,
  fadeInUp,
  staggerContainerFast,
  LANDING_BG_CARD,
  TEXT_SECONDARY,
  GOLD,
  GOLD_GRADIENT_TEXT,
  CARD_SHADOW,
  viewportOnce,
} from '@/lib/landing-animations';
import { Brain, Zap, Database, Shield, MessageCircle, Target } from 'lucide-react';

const AI_FEATURES = [
  {
    icon: Brain,
    title: 'AI-Powered Document Builders',
    description:
      'Personal statements, buddy statements, and doctor summaries generated with context from your logged data — not generic templates.',
  },
  {
    icon: Database,
    title: 'Data-Connected Intelligence',
    description:
      'Every AI tool knows your symptoms, medications, medical visits, and conditions. Your data flows between tools automatically.',
  },
  {
    icon: Zap,
    title: 'Real-Time Streaming Analysis',
    description:
      'Post-exam debrief, evidence scanning, and claim strategy — all stream results in real time so you see analysis as it happens.',
  },
  {
    icon: Target,
    title: 'Evidence vs. Criteria Matching',
    description:
      'Your documented evidence is automatically compared against published VA rating criteria. See exactly where you\'re strong and where gaps exist.',
  },
  {
    icon: MessageCircle,
    title: 'Ask Intel — Claims Coach',
    description:
      'On-demand AI claims preparation advisor that knows your complete veteran profile. Ask questions, get personalized guidance.',
  },
  {
    icon: Shield,
    title: 'Privacy-First AI',
    description:
      'PII is masked before any AI call. No data stored on external servers. All context stays on your device — AI sees anonymized summaries only.',
  },
];

export function AIShowcase() {
  return (
    <section className="relative py-24 px-4" style={{ backgroundColor: '#0F0F0F' }}>
      {/* Top glow */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}33, transparent)` }}
      />

      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainerFast}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 mb-4">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: GOLD }}
            >
              Intelligent Preparation
            </span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            style={HEADING_H2_STYLE}
          >
            AI That Actually Knows{' '}
            <span style={GOLD_GRADIENT_TEXT}>Your Claim</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-4 max-w-2xl mx-auto text-lg"
            style={{ color: TEXT_SECONDARY }}
          >
            Every AI feature uses your logged symptoms, medications, and medical visits —
            not generic advice. Your data makes every tool smarter.
          </motion.p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainerFast}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {AI_FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              className="rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors"
              style={{
                backgroundColor: LANDING_BG_CARD,
                boxShadow: CARD_SHADOW,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${GOLD}15` }}
              >
                <feature.icon className="h-5 w-5" style={{ color: GOLD }} />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: TEXT_SECONDARY }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Compliance Note */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="text-center mt-10 text-xs"
          style={{ color: TEXT_SECONDARY, opacity: 0.6 }}
        >
          AI features are preparation tools only. Not medical or legal advice.
          All ratings determined solely by the VA.
        </motion.p>
      </div>
    </section>
  );
}
