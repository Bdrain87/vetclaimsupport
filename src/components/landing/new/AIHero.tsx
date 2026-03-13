/**
 * AIHero — AI-focused hero section countering competitor "What Six Knows" messaging.
 * Highlights data-connected AI tools and Ask Intel chatbot.
 */
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  HEADING_H2_STYLE,
  PILL_STYLE,
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainerFast,
  LANDING_BG,
  LANDING_BG_CARD,
  TEXT_SECONDARY,
  TEXT_BRIGHT,
  GOLD,
  GOLD_GRADIENT,
  GOLD_GRADIENT_TEXT,
  CARD_SHADOW,
  viewportOnce,
} from '@/lib/landing-animations';
import { TiltCard } from './TiltCard';
import {
  Brain,
  FileText,
  Target,
  Mic,
  BarChart3,
  FileSearch,
  Shield,
  Check,
  MessageCircle,
} from 'lucide-react';

const KNOWLEDGE_ITEMS = [
  'VA rating schedules and criteria for 790+ conditions',
  'Secondary condition connections and associations',
  'C&P exam procedures and what examiners evaluate',
  'Evidence requirements by condition type',
  'DBQ form structure and rating alignment',
  'Supplemental claim and appeal procedures',
];

const EXAMPLE_CHATS = [
  'What evidence do I need for a 70% PTSD rating?',
  'What secondary conditions are linked to my lower back?',
  'How should I describe my sleep disturbance symptoms?',
];

const AI_TOOLS = [
  {
    icon: FileText,
    title: 'AI Document Builders',
    description: 'Personal statements, buddy letters, and doctor summaries built from your logged data.',
  },
  {
    icon: Target,
    title: 'AI DBQ Rating Analyzer',
    description: 'Upload a completed DBQ and get color-coded rating alignment analysis.',
  },
  {
    icon: Mic,
    title: 'C&P Exam Simulator',
    description: 'Voice-based AI mock exams with condition-specific feedback.',
  },
  {
    icon: BarChart3,
    title: 'Evidence Strength Analyzer',
    description: 'Compare your evidence against VA rating criteria to find gaps.',
  },
  {
    icon: FileSearch,
    title: 'C-File Analysis',
    description: 'Upload your C-file for AI-powered analysis of key findings.',
  },
  {
    icon: Shield,
    title: 'Privacy-First AI',
    description: 'PII masked before AI calls. No data stored externally.',
  },
];

export function AIHero() {
  return (
    <section className="relative py-16 md:py-24 px-4" style={{ backgroundColor: LANDING_BG }}>
      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}33, transparent)` }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainerFast}
          className="text-center mb-12"
        >
          <motion.div variants={fadeInUp} className="mb-4">
            <span style={PILL_STYLE}>AI-Powered Preparation</span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl text-white"
            style={HEADING_H2_STYLE}
          >
            AI That Works With{' '}
            <span style={GOLD_GRADIENT_TEXT}>Your Data</span>,
            <br className="hidden sm:block" />
            {' '}Not Just Generic Answers
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-4 max-w-2xl mx-auto text-lg"
            style={{ color: TEXT_SECONDARY }}
          >
            Every AI tool uses your logged symptoms, medications, and medical visits — not generic advice.
          </motion.p>
        </motion.div>

        {/* Two-column: Knowledge list + Ask Intel spotlight */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainerFast}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          {/* Left column — What VCS AI Covers */}
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl p-8 border border-white/5"
            style={{ backgroundColor: LANDING_BG_CARD, boxShadow: CARD_SHADOW }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Brain className="h-5 w-5" style={{ color: GOLD }} />
              <h3 className="text-lg font-semibold text-white">What VCS AI Covers</h3>
            </div>
            <ul className="space-y-3.5">
              {KNOWLEDGE_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm" style={{ color: TEXT_BRIGHT }}>
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${GOLD}15` }}
                  >
                    <Check size={12} style={{ color: GOLD }} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right column — Ask Intel spotlight */}
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl p-8 border border-white/5"
            style={{ backgroundColor: LANDING_BG_CARD, boxShadow: CARD_SHADOW }}
          >
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-5 w-5" style={{ color: GOLD }} />
              <h3 className="text-lg font-semibold text-white">Ask Intel</h3>
            </div>
            <p className="text-sm mb-6" style={{ color: TEXT_SECONDARY }}>
              Your AI claims preparation assistant
            </p>

            {/* Example chat bubbles */}
            <div className="space-y-3 mb-8">
              {EXAMPLE_CHATS.map((chat) => (
                <div
                  key={chat}
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{
                    backgroundColor: 'rgba(197, 165, 90, 0.08)',
                    border: '1px solid rgba(197, 165, 90, 0.12)',
                    color: TEXT_BRIGHT,
                  }}
                >
                  {chat}
                </div>
              ))}
            </div>

            <motion.div
              whileHover={{ boxShadow: '0 4px 20px rgba(197,165,90,0.35)' }}
              style={{ borderRadius: '9999px' }}
            >
              <Link
                to="/auth"
                className="block text-center rounded-full px-6 py-3 text-sm font-semibold text-black no-underline"
                style={{ background: GOLD_GRADIENT }}
              >
                Try Ask Intel Free
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom row — 6 compact AI tool cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainerFast}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {AI_TOOLS.map((tool, i) => (
            <motion.div
              key={tool.title}
              variants={i % 2 === 0 ? fadeInLeft : fadeInRight}
            >
              <TiltCard
                className="relative rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors h-full"
                style={{ backgroundColor: LANDING_BG_CARD, boxShadow: CARD_SHADOW }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${GOLD}15` }}
                >
                  <tool.icon className="h-5 w-5" style={{ color: GOLD }} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{tool.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_SECONDARY }}>
                  {tool.description}
                </p>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Compliance note */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="text-center mt-10 text-xs"
          style={{ color: TEXT_SECONDARY, opacity: 0.6 }}
        >
          AI features provide educational preparation guidance only. Not medical, legal, or claims-filing advice. All ratings determined solely by the VA.
        </motion.p>
      </div>
    </section>
  );
}
