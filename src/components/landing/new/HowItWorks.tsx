/**
 * HowItWorks — Compact horizontal scene transition with clickable step indicators.
 * No scroll jacking, no sticky phone, no 400vh blank space.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GOLD_GRADIENT_TEXT,
  HEADING_H2_STYLE,
  EASE_SMOOTH,
  LANDING_BG,
  GOLD,
  TEXT_SECONDARY,
} from '@/lib/landing-animations';
import { MapPin, FileSearch, Mic, FolderArchive } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'Map Your Service',
    desc: 'Enter your service history, conditions, and exposures. Document duty stations, deployments, and job codes in one place.',
    icon: MapPin,
    accent: '#C5A55A',
  },
  {
    num: '02',
    title: 'Build Your Case',
    desc: 'Your evidence is organized by condition with supporting documentation. Link medical records, buddy statements, and personal statements.',
    icon: FileSearch,
    accent: '#5A9EC5',
  },
  {
    num: '03',
    title: 'Prepare for the C&P Exam',
    desc: 'Practice questions, prep with all 70 DBQ forms, and analyze your answers against rating criteria with AI. Walk in feeling confident.',
    icon: Mic,
    accent: '#5AC57A',
  },
  {
    num: '04',
    title: 'Export Your Packet',
    desc: 'Everything organized, nothing missed. Export your complete packet and review it before bringing it to your VSO or representative.',
    icon: FolderArchive,
    accent: '#C55A8A',
  },
];

function StepIndicators({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-0 mt-10">
      {STEPS.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <button
            onClick={() => onSelect(i)}
            className="relative flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-all duration-300 bg-transparent"
            style={{
              backgroundColor: i === active ? `${step.accent}20` : 'rgba(255,255,255,0.04)',
              border: i <= active ? `2px solid ${i === active ? step.accent : 'rgba(197,165,90,0.3)'}` : '2px solid rgba(255,255,255,0.08)',
            }}
          >
            <span
              className="text-xs font-bold transition-colors duration-300"
              style={{ color: i === active ? step.accent : i < active ? GOLD : 'rgba(255,255,255,0.3)' }}
            >
              {step.num}
            </span>
          </button>
          {i < STEPS.length - 1 && (
            <div
              className="w-8 sm:w-12 md:w-16 h-0.5 transition-colors duration-500"
              style={{
                backgroundColor: i < active ? 'rgba(197,165,90,0.3)' : 'rgba(255,255,255,0.06)',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const step = STEPS[activeStep];
  const Icon = step.icon;

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden py-16 md:py-24 px-4"
      style={{ backgroundColor: LANDING_BG, scrollMarginTop: '5rem' }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.h2
          className="text-white text-center text-3xl md:text-4xl lg:text-5xl mb-4"
          style={HEADING_H2_STYLE}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_SMOOTH }}
        >
          From First Login to{' '}
          <span style={GOLD_GRADIENT_TEXT}>Finished Packet</span>
        </motion.h2>

        <motion.p
          className="text-center text-lg mb-12 max-w-2xl mx-auto"
          style={{ color: TEXT_SECONDARY }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Four steps. One organized claim packet.
        </motion.p>

        {/* Scene container — fixed height on desktop */}
        <div
          className="relative rounded-2xl border border-white/[0.06] overflow-hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)', minHeight: 320 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              className="flex flex-col md:flex-row items-center gap-8 md:gap-12 p-8 md:p-12"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.35, ease: EASE_SMOOTH }}
            >
              {/* Left: watermark number + icon */}
              <div className="relative flex-shrink-0 flex items-center justify-center w-40 h-40 md:w-48 md:h-48">
                {/* Large background watermark number */}
                <span
                  className="absolute text-[8rem] md:text-[10rem] font-black select-none pointer-events-none"
                  style={{
                    color: `${step.accent}08`,
                    lineHeight: 1,
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}
                >
                  {step.num}
                </span>
                {/* Icon */}
                <div
                  className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${step.accent}15`,
                    border: `1px solid ${step.accent}30`,
                  }}
                >
                  <Icon className="w-8 h-8" style={{ color: step.accent }} />
                </div>
              </div>

              {/* Right: text content */}
              <div className="flex-1 text-center md:text-left">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                  style={{ backgroundColor: `${step.accent}12`, border: `1px solid ${step.accent}25` }}
                >
                  <span className="text-xs font-bold" style={{ color: step.accent }}>
                    Step {step.num}
                  </span>
                </div>
                <h3
                  className="text-2xl md:text-3xl font-bold text-white mb-4"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '-0.02em' }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-base md:text-lg leading-relaxed max-w-lg"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  {step.desc}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step indicators */}
        <StepIndicators active={activeStep} onSelect={setActiveStep} />
      </div>
    </section>
  );
}
