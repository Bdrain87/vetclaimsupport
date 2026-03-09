/**
 * PersonalizedDemo — Visitors select conditions and see a preview
 * of what their personalized dashboard would look like.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  HEADING_H2_STYLE,
  fadeInUp,
  staggerContainerFast,
  LANDING_BG_CARD,
  LANDING_BG_ELEVATED,
  TEXT_SECONDARY,
  GOLD,
  GOLD_GRADIENT_TEXT,
  GOLD_GRADIENT,
  CARD_SHADOW,
  viewportOnce,
  EASE_SMOOTH,
} from '@/lib/landing-animations';
import {
  Check,
  Activity,
  FileText,
  Brain,
  ChevronRight,
  Sparkles,
  Target,
} from 'lucide-react';

interface DemoCondition {
  id: string;
  label: string;
  tools: string[];
  insight: string;
  secondaries: string[];
}

const DEMO_CONDITIONS: DemoCondition[] = [
  {
    id: 'ptsd',
    label: 'PTSD',
    tools: ['Stressor Statement Writer', 'C&P Exam Simulator', 'PTSD Symptom Tracker', 'Buddy Statement Builder'],
    insight: 'Your daily symptom logs would auto-populate your personal statement and exam prep materials.',
    secondaries: ['Sleep Apnea', 'Migraines', 'Tinnitus', 'Depression'],
  },
  {
    id: 'back',
    label: 'Back Pain',
    tools: ['Pain Body Map', 'Range of Motion Guide', 'Doctor Summary Outline', 'Work Impact Logger'],
    insight: 'Range of motion measurements and flare-up frequency mapped to VA spine rating criteria.',
    secondaries: ['Radiculopathy', 'Sciatica', 'Hip Condition', 'Knee Condition'],
  },
  {
    id: 'migraines',
    label: 'Migraines',
    tools: ['Migraine Tracker', 'Prostrating Attack Log', 'C&P Exam Prep', 'Evidence Strength Analyzer'],
    insight: 'Tracking prostrating vs non-prostrating attacks — the key factor in VA migraine ratings.',
    secondaries: ['Tinnitus', 'Light Sensitivity', 'TBI', 'Depression'],
  },
  {
    id: 'sleep-apnea',
    label: 'Sleep Apnea',
    tools: ['Sleep Tracker', 'CPAP Compliance Logger', 'Doctor Prep Packet', 'Buddy Statement Builder'],
    insight: 'CPAP usage tracking and daytime impact documentation aligned to DC 6847 criteria.',
    secondaries: ['PTSD', 'Hypertension', 'GERD', 'Depression'],
  },
  {
    id: 'knee',
    label: 'Knee Condition',
    tools: ['Range of Motion Tracker', 'Flare-Up Logger', 'C&P Exam Prep', 'Secondary Condition Finder'],
    insight: 'Flexion and extension measurements compared against DC 5260/5261 rating thresholds.',
    secondaries: ['Hip Condition', 'Back Pain', 'Radiculopathy', 'Ankle Condition'],
  },
  {
    id: 'tinnitus',
    label: 'Tinnitus',
    tools: ['Symptom Logger', 'Hearing Exam Prep', 'Personal Statement Builder', 'Buddy Statement Builder'],
    insight: 'Document when ringing started and its connection to noise exposure during service.',
    secondaries: ['Hearing Loss', 'Migraines', 'PTSD', 'Sleep Disturbance'],
  },
];

export function PersonalizedDemo() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['ptsd']));

  const toggleCondition = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id); // Keep at least one
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedConditions = DEMO_CONDITIONS.filter((c) => selectedIds.has(c.id));

  // Deduplicated secondaries from all selected
  const allSecondaries = [...new Set(
    selectedConditions.flatMap((c) => c.secondaries)
      .filter((s) => !selectedConditions.some((c) => c.label === s)),
  )].slice(0, 6);

  // All unique tools
  const allTools = [...new Set(selectedConditions.flatMap((c) => c.tools))].slice(0, 8);

  return (
    <section className="relative py-24 px-4" style={{ backgroundColor: '#0F0F0F' }}>
      {/* Top separator */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}33, transparent)` }}
      />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainerFast}
          className="text-center mb-12"
        >
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: GOLD }}>
              See It In Action
            </span>
          </motion.div>
          <motion.h2 variants={fadeInUp} style={HEADING_H2_STYLE}>
            Your Claim,{' '}
            <span style={GOLD_GRADIENT_TEXT}>Personalized</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 max-w-2xl mx-auto text-lg" style={{ color: TEXT_SECONDARY }}>
            Select the conditions you're preparing and see what VCS builds for you.
          </motion.p>
        </motion.div>

        {/* Condition Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE_SMOOTH }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {DEMO_CONDITIONS.map((condition) => {
            const isSelected = selectedIds.has(condition.id);
            return (
              <button
                key={condition.id}
                onClick={() => toggleCondition(condition.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium cursor-pointer border transition-all duration-300"
                style={{
                  backgroundColor: isSelected ? `${GOLD}15` : 'rgba(255,255,255,0.04)',
                  borderColor: isSelected ? `${GOLD}40` : 'rgba(255,255,255,0.06)',
                  color: isSelected ? GOLD : TEXT_SECONDARY,
                }}
              >
                {isSelected && <Check className="h-3.5 w-3.5" />}
                {condition.label}
              </button>
            );
          })}
        </motion.div>

        {/* Preview Dashboard */}
        <AnimatePresence mode="wait">
          <motion.div
            key={Array.from(selectedIds).sort().join(',')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: EASE_SMOOTH }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Recommended Tools */}
            <div
              className="rounded-2xl p-6 border border-white/5"
              style={{ backgroundColor: LANDING_BG_CARD, boxShadow: CARD_SHADOW }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4" style={{ color: GOLD }} />
                <h3 className="text-sm font-semibold text-white">Recommended Tools</h3>
              </div>
              <div className="space-y-2.5">
                {allTools.map((tool) => (
                  <div key={tool} className="flex items-center gap-3 text-sm">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${GOLD}10` }}
                    >
                      <FileText className="h-3.5 w-3.5" style={{ color: GOLD }} />
                    </div>
                    <span className="text-white/80">{tool}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Condition Insights */}
            <div
              className="rounded-2xl p-6 border border-white/5"
              style={{ backgroundColor: LANDING_BG_CARD, boxShadow: CARD_SHADOW }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-4 w-4" style={{ color: GOLD }} />
                <h3 className="text-sm font-semibold text-white">AI Insights</h3>
              </div>
              <div className="space-y-3">
                {selectedConditions.map((condition) => (
                  <div
                    key={condition.id}
                    className="p-3 rounded-xl border border-white/5"
                    style={{ backgroundColor: LANDING_BG_ELEVATED }}
                  >
                    <p className="text-xs font-semibold mb-1" style={{ color: GOLD }}>
                      {condition.label}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: TEXT_SECONDARY }}>
                      {condition.insight}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Connections */}
            <div
              className="rounded-2xl p-6 border border-white/5"
              style={{ backgroundColor: LANDING_BG_CARD, boxShadow: CARD_SHADOW }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-4 w-4" style={{ color: GOLD }} />
                <h3 className="text-sm font-semibold text-white">Secondary Connections</h3>
              </div>
              <p className="text-xs mb-3" style={{ color: TEXT_SECONDARY }}>
                Conditions commonly associated with your selections:
              </p>
              <div className="flex flex-wrap gap-2">
                {allSecondaries.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2.5 py-1.5 rounded-full border"
                    style={{
                      borderColor: `${GOLD}20`,
                      backgroundColor: `${GOLD}08`,
                      color: GOLD,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Health Tracking Preview */}
            <div
              className="rounded-2xl p-6 border border-white/5"
              style={{ backgroundColor: LANDING_BG_CARD, boxShadow: CARD_SHADOW }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-4 w-4" style={{ color: GOLD }} />
                <h3 className="text-sm font-semibold text-white">Tracking Dashboard</h3>
              </div>
              <div className="space-y-3">
                {selectedConditions.slice(0, 3).map((condition) => (
                  <div key={condition.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-white">{condition.label}</span>
                        <span className="text-[10px]" style={{ color: GOLD }}>Evidence strength</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: '0%',
                            background: `linear-gradient(90deg, ${GOLD}, ${GOLD}80)`,
                          }}
                        />
                      </div>
                      <p className="text-[10px] mt-1" style={{ color: TEXT_SECONDARY }}>
                        Start logging to build your evidence
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-black no-underline"
            style={{ background: GOLD_GRADIENT }}
          >
            Start Your Personalized Plan <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
