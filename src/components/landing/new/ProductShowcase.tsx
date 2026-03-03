import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HEADING_H2_STYLE,
  EASE_SMOOTH,
  GOLD_GRADIENT_TEXT,
  GOLD_GRADIENT,
  CARD_SHADOW,
  staggerContainerFast,
  fadeInUp,
  LANDING_BG,
  LANDING_BG_CARD,
  TEXT_SECONDARY,
} from '@/lib/landing-animations';
import {
  Activity,
  FileText,
  Package,
  Database,
  Brain,
  Shield,
  ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface FeatureCategory {
  id: string;
  icon: LucideIcon;
  label: string;
  headline: string;
  description: string;
  features: string[];
}

const CATEGORIES: FeatureCategory[] = [
  {
    id: 'tracking',
    icon: Activity,
    label: 'Health Tracking',
    headline: 'Symptoms organized by VA rating categories',
    description:
      'Daily logs with severity, frequency, and triggers — automatically organized to align with VA rating schedule categories.',
    features: [
      'Symptom, sleep, and migraine trackers',
      'Medication log with side effects',
      'Interactive body map for pain documentation',
      'Health timeline and trend analysis',
      'Medical visit logger',
      'Exposure and hazard tracker',
    ],
  },
  {
    id: 'documents',
    icon: FileText,
    label: 'Document Builders',
    headline: 'Statements that actually help your claim',
    description:
      'Guided builders walk you through every section. No blank pages, no guesswork — just effective documents ready for submission.',
    features: [
      'Personal statement builder with nexus language',
      'Buddy and lay statement templates',
      'Doctor summary outline for your clinician',
      'Stressor statement writer for PTSD claims',
    ],
  },
  {
    id: 'strategy',
    icon: Brain,
    label: 'Strategy & Prep',
    headline: 'Walk into your C&P exam confident',
    description:
      'Condition-specific exam prep, claim organization tools, and secondary condition discovery — based on publicly available VA rating schedules.',
    features: [
      'Claim Strategy Wizard with filing order guidance',
      'C&P Exam Prep with practice questions',
      'DBQ criteria review and rating breakdowns',
      'Secondary Condition Finder',
      'Bilateral Factor and Back Pay calculators',
    ],
  },
  {
    id: 'database',
    icon: Database,
    label: '800+ Conditions',
    headline: 'Every VA-rated condition, researched',
    description:
      'Browse the full VA disability database with rating criteria, required evidence, and common secondary connections.',
    features: [
      'Comprehensive rating criteria for each condition',
      'Secondary condition mapping',
      'Evidence guidance per condition',
      'Conditions by conflict and service era',
    ],
  },
  {
    id: 'export',
    icon: Package,
    label: 'Packet Export',
    headline: 'One packet. Everything organized.',
    description:
      'Compile your complete claim package — statements, trackers, evidence, checklists — into a single organized submission.',
    features: [
      'Full claim packet compilation',
      'AES-256 encrypted document vault',
      'Organized sections by condition',
      'PDF export for your records',
    ],
  },
  {
    id: 'privacy',
    icon: Shield,
    label: 'Privacy First',
    headline: 'Your data never leaves your device',
    description:
      'Everything is stored locally with optional AES-256 encryption. No server uploads, no third-party analytics, no data selling.',
    features: [
      'Local-first architecture — no cloud required',
      'Optional AES-256 encryption at rest',
      'PII redaction on any AI features',
      'Full data export and delete controls',
    ],
  },
];

export function ProductShowcase() {
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);
  const active = CATEGORIES.find((c) => c.id === activeId)!;
  const ActiveIcon = active.icon;

  return (
    <section
      id="features"
      className="py-16 md:py-24"
      style={{ backgroundColor: LANDING_BG, scrollMarginTop: '5rem' }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <motion.h2
          className="text-white text-center mb-4 px-4"
          style={{
            ...HEADING_H2_STYLE,
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_SMOOTH }}
        >
          Everything you need to{' '}
          <span style={GOLD_GRADIENT_TEXT}>prepare</span>
        </motion.h2>
        <motion.p
          className="text-center mb-16 text-lg max-w-2xl mx-auto"
          style={{ color: TEXT_SECONDARY }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE_SMOOTH }}
        >
          50+ tools designed around how the VA actually evaluates claims.
        </motion.p>

        {/* Category tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE_SMOOTH }}
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = cat.id === activeId;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveId(cat.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium cursor-pointer border-none transition-all duration-300"
                style={{
                  backgroundColor: isActive
                    ? 'rgba(197, 165, 90, 0.15)'
                    : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#C5A55A' : TEXT_SECONDARY,
                  border: isActive
                    ? '1px solid rgba(197, 165, 90, 0.3)'
                    : '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{cat.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Active category detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: EASE_SMOOTH }}
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: LANDING_BG_CARD,
                border: '1px solid rgba(255, 255, 255, 0.06)',
                boxShadow: CARD_SHADOW,
              }}
            >
              {/* Top gold accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(197, 165, 90, 0.4), transparent)' }}
              />

              <div className="grid md:grid-cols-2 gap-0">
                {/* Left — description */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                    style={{
                      background: 'rgba(197, 165, 90, 0.1)',
                      border: '1px solid rgba(197, 165, 90, 0.2)',
                    }}
                  >
                    <ActiveIcon size={22} style={{ color: '#C5A55A' }} />
                  </div>
                  <h3
                    className="text-2xl md:text-3xl text-white mb-4"
                    style={{ fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.2 }}
                  >
                    {active.headline}
                  </h3>
                  <p
                    className="text-base leading-relaxed mb-8"
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    {active.description}
                  </p>
                  <Link
                    to="/auth"
                    className="inline-flex items-center gap-2 text-sm font-semibold no-underline"
                    style={{ color: '#C5A55A' }}
                  >
                    Get started <ChevronRight size={16} />
                  </Link>
                </div>

                {/* Right — feature list */}
                <div
                  className="p-8 md:p-12 md:border-l"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}
                >
                  <motion.ul
                    className="space-y-4"
                    variants={staggerContainerFast}
                    initial="hidden"
                    animate="visible"
                    key={active.id + '-list'}
                  >
                    {active.features.map((feature) => (
                      <motion.li
                        key={feature}
                        variants={fadeInUp}
                        className="flex items-start gap-3"
                      >
                        <span
                          className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: '#C5A55A' }}
                        />
                        <span
                          className="text-[15px] leading-relaxed"
                          style={{ color: 'rgba(255, 255, 255, 0.85)' }}
                        >
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </div>

              {/* Bottom gold accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(197, 165, 90, 0.2), transparent)' }}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* CTA below */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE_SMOOTH }}
        >
          <Link
            to="/auth"
            className="inline-block rounded-full px-8 py-3.5 text-sm font-semibold text-black no-underline"
            style={{ background: GOLD_GRADIENT }}
          >
            Explore All 50+ Tools
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
