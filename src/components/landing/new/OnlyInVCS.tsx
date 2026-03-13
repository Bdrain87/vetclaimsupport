/**
 * OnlyInVCS — 6 unique features no competitor has.
 * 2x3 card grid showcasing VCS differentiators.
 */
import { motion } from 'motion/react';
import {
  HEADING_H2_STYLE,
  PILL_STYLE,
  fadeInUp,
  scaleIn,
  staggerContainerFast,
  LANDING_BG,
  LANDING_BG_CARD,
  TEXT_SECONDARY,
  TEXT_BRIGHT,
  GOLD,
  GOLD_GRADIENT_TEXT,
  CARD_SHADOW,
  viewportOnce,
} from '@/lib/landing-animations';
import { TiltCard } from './TiltCard';
import {
  Activity,
  FileSearch,
  Mic,
  FolderArchive,
  ClipboardList,
  MapPin,
} from 'lucide-react';

const UNIQUE_FEATURES = [
  {
    icon: Activity,
    title: 'Health Tracking Suite',
    description:
      '10 dedicated trackers: symptoms, sleep, migraines, medications, medical visits, exposures, work impact, body map, trends, and quick log.',
  },
  {
    icon: FileSearch,
    title: 'Interactive DBQ Analyzer',
    description:
      'Upload or photograph a completed DBQ and get instant color-coded rating alignment with gap analysis.',
  },
  {
    icon: Mic,
    title: 'C&P Exam Simulator',
    description:
      'Voice-based AI mock exams with condition-specific questions and real-time feedback on your answers.',
  },
  {
    icon: FolderArchive,
    title: 'Full Claim Packet Builder',
    description:
      'Compile statements, evidence, health logs, and prep materials into one organized submission-ready packet.',
  },
  {
    icon: ClipboardList,
    title: 'All 70 VA DBQ Forms',
    description:
      'Interactive preparation for every single VA Disability Benefits Questionnaire with rating criteria and exam tips.',
  },
  {
    icon: MapPin,
    title: 'State Benefits Finder',
    description:
      'Discover state-level veteran benefits beyond federal VA programs — property tax exemptions, education, and more.',
  },
];

export function OnlyInVCS() {
  return (
    <section id="features" className="relative py-16 md:py-24 px-4" style={{ backgroundColor: LANDING_BG }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainerFast}
          className="text-center mb-12"
        >
          <motion.div variants={fadeInUp} className="mb-4">
            <span style={PILL_STYLE}>Only in Vet Claim Support</span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl text-white"
            style={HEADING_H2_STYLE}
          >
            <span style={GOLD_GRADIENT_TEXT}>Purpose-Built</span> for VA Claims
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-4 text-lg max-w-2xl mx-auto"
            style={{ color: TEXT_SECONDARY }}
          >
            Every tool designed around the VA disability claims process — not adapted from something else.
          </motion.p>
        </motion.div>

        {/* 2x3 grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainerFast}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {UNIQUE_FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={scaleIn}
            >
              <TiltCard
                className="relative rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors h-full"
                style={{ backgroundColor: LANDING_BG_CARD, boxShadow: CARD_SHADOW }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${GOLD}15` }}
                >
                  <feature.icon className="h-5 w-5" style={{ color: GOLD }} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_SECONDARY }}>
                  {feature.description}
                </p>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
