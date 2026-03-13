/**
 * CompetitorComparison — 3-column comparison table: VCS vs AI Chatbot Tools vs Manual Prep.
 * Does NOT name any competitor directly.
 */
import { motion } from 'motion/react';
import {
  HEADING_H2_STYLE,
  fadeInUp,
  staggerContainerFast,
  LANDING_BG,
  LANDING_BG_CARD,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  GOLD,
  GOLD_GRADIENT_TEXT,
  CARD_SHADOW,
  viewportOnce,
} from '@/lib/landing-animations';
import { Check, X, Minus } from 'lucide-react';

interface ComparisonRow {
  feature: string;
  vcs: string;
  chatbot: string;
  manual: string;
}

const ROWS: ComparisonRow[] = [
  {
    feature: 'Total tools',
    vcs: '85+',
    chatbot: '~14',
    manual: '0',
  },
  {
    feature: 'VA DBQ forms',
    vcs: 'All 70',
    chatbot: '0',
    manual: 'Download yourself',
  },
  {
    feature: 'Health tracking',
    vcs: '10 dedicated trackers',
    chatbot: 'None',
    manual: 'Pen and paper',
  },
  {
    feature: 'AI document builders',
    vcs: 'Data-connected',
    chatbot: 'Basic templates',
    manual: 'None',
  },
  {
    feature: 'C&P exam simulator',
    vcs: 'Voice-based AI',
    chatbot: 'No',
    manual: 'No',
  },
  {
    feature: 'DBQ rating analyzer',
    vcs: 'Upload and analyze',
    chatbot: 'No',
    manual: 'No',
  },
  {
    feature: 'Evidence packet builder',
    vcs: 'Automated',
    chatbot: 'No',
    manual: 'Manual assembly',
  },
  {
    feature: 'Secondary conditions',
    vcs: '700+ mapped',
    chatbot: 'Basic lookup',
    manual: 'Forum searching',
  },
  {
    feature: 'Price',
    vcs: '$14.99/mo',
    chatbot: '$25/mo',
    manual: 'Free (you\'re on your own)',
  },
  {
    feature: 'iOS native app',
    vcs: 'Yes',
    chatbot: 'No',
    manual: 'N/A',
  },
];

function CellIcon({ value }: { value: string }) {
  const lower = value.toLowerCase();
  if (lower === 'no' || lower === '0' || lower === 'none') {
    return <X className="h-4 w-4 shrink-0 text-red-400/60" />;
  }
  if (lower === 'n/a') {
    return <Minus className="h-4 w-4 shrink-0" style={{ color: TEXT_TERTIARY }} />;
  }
  return null;
}

export function CompetitorComparison() {
  return (
    <section className="relative py-20 md:py-28 px-4" style={{ backgroundColor: LANDING_BG }}>
      <div className="max-w-5xl mx-auto">
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
            className="text-3xl md:text-5xl text-white"
            style={HEADING_H2_STYLE}
          >
            How VCS{' '}
            <span style={GOLD_GRADIENT_TEXT}>Compares</span>
          </motion.h2>
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
          {/* Desktop header row */}
          <motion.div
            variants={fadeInUp}
            className="hidden sm:grid sm:grid-cols-[1.4fr_1fr_1fr_1fr] gap-0 border-b border-white/5"
          >
            <div className="p-4 text-xs font-semibold uppercase tracking-widest" style={{ color: TEXT_SECONDARY }}>
              Feature
            </div>
            <div className="p-4 text-xs font-semibold uppercase tracking-widest text-center" style={{ color: GOLD }}>
              VCS
            </div>
            <div className="p-4 text-xs font-semibold uppercase tracking-widest text-center" style={{ color: TEXT_SECONDARY }}>
              AI Chatbot Tools
            </div>
            <div className="p-4 text-xs font-semibold uppercase tracking-widest text-center" style={{ color: TEXT_SECONDARY }}>
              Manual Prep
            </div>
          </motion.div>

          {/* Data rows */}
          {ROWS.map((row, i) => (
            <motion.div
              key={row.feature}
              variants={fadeInUp}
              className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_1fr_1fr] gap-0 border-b border-white/5 last:border-b-0"
              style={{ backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
            >
              {/* Feature name */}
              <div className="p-4 pb-1 sm:pb-4 text-sm font-medium text-white">
                {row.feature}
              </div>

              {/* VCS */}
              <div className="px-4 py-1.5 sm:p-4 text-sm flex items-center gap-2 sm:justify-center">
                <Check className="h-4 w-4 shrink-0" style={{ color: GOLD }} />
                <span className="text-xs leading-relaxed text-white/90">
                  <span className="sm:hidden font-semibold mr-1" style={{ color: GOLD }}>VCS:</span>
                  {row.vcs}
                </span>
              </div>

              {/* AI Chatbot Tools */}
              <div className="px-4 py-1.5 sm:p-4 text-sm flex items-center gap-2 sm:justify-center" style={{ color: TEXT_SECONDARY }}>
                <CellIcon value={row.chatbot} />
                <span className="text-xs leading-relaxed">
                  <span className="sm:hidden font-semibold text-white/40 mr-1">Chatbot:</span>
                  {row.chatbot}
                </span>
              </div>

              {/* Manual Prep */}
              <div className="px-4 pt-1.5 pb-4 sm:p-4 text-sm flex items-center gap-2 sm:justify-center" style={{ color: TEXT_SECONDARY }}>
                <CellIcon value={row.manual} />
                <span className="text-xs leading-relaxed">
                  <span className="sm:hidden font-semibold text-white/40 mr-1">Manual:</span>
                  {row.manual}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer disclaimer */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="text-center mt-6 text-xs"
          style={{ color: TEXT_TERTIARY }}
        >
          Comparison based on publicly available feature lists. Features and pricing subject to change.
        </motion.p>
      </div>
    </section>
  );
}
