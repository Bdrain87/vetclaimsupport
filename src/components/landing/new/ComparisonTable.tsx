/**
 * ComparisonTable — VCS vs Manual Claim Preparation
 * Shows side-by-side what veterans get with vs without the app.
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
import { Check, X } from 'lucide-react';

const COMPARISON_ROWS = [
  {
    feature: 'Symptom & health tracking',
    manual: 'Scattered notes, no structure',
    vcs: 'Organized daily logs aligned to VA rating criteria',
  },
  {
    feature: 'Personal statement',
    manual: 'Blank page, no guidance',
    vcs: 'Guided builder with nexus language & your logged data',
  },
  {
    feature: 'C&P exam preparation',
    manual: 'Google searches, forum advice',
    vcs: 'DBQ-specific prep, AI mock exams, condition guidance',
  },
  {
    feature: 'Evidence organization',
    manual: 'Folders of loose documents',
    vcs: 'Auto-compiled packets with evidence strength scoring',
  },
  {
    feature: 'Secondary conditions',
    manual: 'Word of mouth, guesswork',
    vcs: '500+ mapped secondary connections with nexus guidance',
  },
  {
    feature: 'Rating criteria research',
    manual: 'Reading 38 CFR Part 4 yourself',
    vcs: 'Plain-language criteria for 800+ conditions',
  },
  {
    feature: 'Data-connected AI tools',
    manual: 'Generic AI chatbots',
    vcs: 'AI that knows your symptoms, meds, and medical visits',
  },
  {
    feature: 'Guided preparation pathway',
    manual: 'Figuring out the order yourself',
    vcs: 'Step-by-step journeys per condition with progress tracking',
  },
];

export function ComparisonTable() {
  return (
    <section className="relative py-24 px-4" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainerFast}
          className="text-center mb-12"
        >
          <motion.h2
            variants={fadeInUp}
            style={HEADING_H2_STYLE}
          >
            Why Veterans Choose{' '}
            <span style={GOLD_GRADIENT_TEXT}>VCS</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-4 max-w-2xl mx-auto text-lg"
            style={{ color: TEXT_SECONDARY }}
          >
            The difference between preparing on your own and having every tool built for your claim.
          </motion.p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainerFast}
          className="rounded-2xl overflow-hidden border border-white/5"
          style={{ backgroundColor: LANDING_BG_CARD, boxShadow: CARD_SHADOW }}
        >
          {/* Header row — hidden on mobile (labels shown inline instead) */}
          <motion.div
            variants={fadeInUp}
            className="hidden sm:grid sm:grid-cols-[1fr_1fr_1fr] gap-0 border-b border-white/5"
          >
            <div className="p-4 text-xs font-semibold uppercase tracking-widest" style={{ color: TEXT_SECONDARY }}>
              Feature
            </div>
            <div className="p-4 text-xs font-semibold uppercase tracking-widest text-center" style={{ color: TEXT_SECONDARY }}>
              Manual Prep
            </div>
            <div className="p-4 text-xs font-semibold uppercase tracking-widest text-center" style={{ color: GOLD }}>
              Vet Claim Support
            </div>
          </motion.div>

          {/* Data rows */}
          {COMPARISON_ROWS.map((row, i) => (
            <motion.div
              key={row.feature}
              variants={fadeInUp}
              className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr] gap-0 border-b border-white/5 last:border-b-0"
              style={{ backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
            >
              <div className="p-4 pb-1 sm:pb-4 text-sm font-medium text-white">
                {row.feature}
              </div>
              <div className="px-4 py-2 sm:p-4 text-sm flex items-start gap-2" style={{ color: TEXT_SECONDARY }}>
                <X className="h-4 w-4 shrink-0 mt-0.5 text-red-400/60" />
                <span className="text-xs leading-relaxed"><span className="sm:hidden font-semibold text-red-400/60 mr-1">Manual:</span>{row.manual}</span>
              </div>
              <div className="px-4 pt-2 pb-4 sm:p-4 text-sm flex items-start gap-2">
                <Check className="h-4 w-4 shrink-0 mt-0.5" style={{ color: GOLD }} />
                <span className="text-xs leading-relaxed text-white/90"><span className="sm:hidden font-semibold mr-1" style={{ color: GOLD }}>VCS:</span>{row.vcs}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
