/**
 * HowItWorks — Scroll-linked sticky phone walkthrough.
 * Phone stays pinned while 4 steps scroll past. Screen content crossfades per step.
 * Mobile: falls back to vertical card layout.
 */
import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { useState } from 'react';
import {
  GOLD_GRADIENT_TEXT,
  HEADING_H2_STYLE,
  HEADING_H3_STYLE,
  EASE_SMOOTH,
  LANDING_BG,
  LANDING_BG_SUBTLE,
  GOLD,
  TEXT_SECONDARY,
} from '@/lib/landing-animations';

const STEPS = [
  {
    num: '01',
    title: 'Map Your Service',
    desc: 'Enter your service history, conditions, and exposures. Document duty stations, deployments, and job codes in one place.',
    screen: 'service-history',
  },
  {
    num: '02',
    title: 'Build Your Case',
    desc: 'Your evidence is organized by condition with supporting documentation. Link medical records, buddy statements, and personal statements.',
    screen: 'claim-builder',
  },
  {
    num: '03',
    title: 'Prepare for the C&P Exam',
    desc: 'Practice questions, prep with all 70 DBQ forms, and analyze your answers against rating criteria with AI. Walk in feeling confident.',
    screen: 'exam-prep',
  },
  {
    num: '04',
    title: 'Export Your Packet',
    desc: 'Everything organized, nothing missed. Export your complete packet and review it before bringing it to your VSO or representative.',
    screen: 'export-packet',
  },
];

/** CSS-only iPhone mockup frame */
function PhoneFrame({ activeStep }: { activeStep: number }) {
  return (
    <div className="relative mx-auto" style={{ width: 280, height: 560 }}>
      {/* Phone body */}
      <div
        className="absolute inset-0 rounded-[40px] border-2"
        style={{
          borderColor: 'rgba(255,255,255,0.12)',
          background: 'linear-gradient(145deg, #1a1a1a, #0d0d0d)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      />
      {/* Notch */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl"
        style={{
          width: 120,
          height: 28,
          backgroundColor: '#0d0d0d',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      />
      {/* Screen area */}
      <div
        className="absolute overflow-hidden rounded-[32px]"
        style={{ top: 14, left: 14, right: 14, bottom: 14, backgroundColor: '#0A0A0A' }}
      >
        {STEPS.map((step, i) => (
          <motion.div
            key={step.screen}
            className="absolute inset-0 flex flex-col p-5"
            initial={false}
            animate={{ opacity: activeStep === i ? 1 : 0 }}
            transition={{ duration: 0.4, ease: EASE_SMOOTH }}
          >
            <PhoneScreenContent step={step} index={i} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Simplified screen content per step */
function PhoneScreenContent({ step, index }: { step: typeof STEPS[0]; index: number }) {
  const colors = [
    { accent: '#C5A55A', bg: 'rgba(197,165,90,0.08)' },
    { accent: '#5A9EC5', bg: 'rgba(90,158,197,0.08)' },
    { accent: '#5AC57A', bg: 'rgba(90,197,122,0.08)' },
    { accent: '#C55A8A', bg: 'rgba(197,90,138,0.08)' },
  ];
  const c = colors[index];

  return (
    <>
      {/* Status bar */}
      <div className="flex justify-between items-center mb-4 px-1">
        <div className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>VCS</div>
        <div className="flex gap-1">
          <div className="w-3 h-1.5 rounded-sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <div className="w-3 h-1.5 rounded-sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
        </div>
      </div>

      {/* Step indicator */}
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 self-start"
        style={{ backgroundColor: c.bg, border: `1px solid ${c.accent}33` }}
      >
        <span className="text-[10px] font-bold" style={{ color: c.accent }}>Step {step.num}</span>
      </div>

      {/* Screen title */}
      <h4 className="text-sm font-semibold text-white mb-3">{step.title}</h4>

      {/* Mock content lines */}
      {index === 0 && (
        <div className="space-y-2.5">
          {['Service Branch', 'Duty Stations', 'MOS / Job Code', 'Deployments', 'Conditions'].map((label) => (
            <div key={label} className="rounded-lg p-2.5" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-[9px] mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</div>
              <div className="h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)', width: `${60 + Math.random() * 30}%` }} />
            </div>
          ))}
        </div>
      )}
      {index === 1 && (
        <div className="space-y-2">
          {['PTSD — 3 docs linked', 'Tinnitus — 1 doc linked', 'Lower Back — 2 docs linked'].map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-lg p-2.5" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.accent }} />
              <span className="text-[10px] text-white/70">{item}</span>
            </div>
          ))}
          <div className="mt-3 rounded-lg p-3" style={{ backgroundColor: c.bg, border: `1px solid ${c.accent}22` }}>
            <div className="text-[9px] font-medium mb-1" style={{ color: c.accent }}>Evidence Score</div>
            <div className="h-1.5 rounded-full bg-white/5">
              <div className="h-full rounded-full" style={{ width: '72%', background: `linear-gradient(90deg, ${c.accent}88, ${c.accent})` }} />
            </div>
          </div>
        </div>
      )}
      {index === 2 && (
        <div className="space-y-2.5">
          <div className="rounded-lg p-3" style={{ backgroundColor: c.bg, border: `1px solid ${c.accent}22` }}>
            <div className="text-[9px] font-medium mb-2" style={{ color: c.accent }}>AI Examiner</div>
            <div className="text-[10px] text-white/60 leading-relaxed">"Describe how your condition affects your daily activities..."</div>
          </div>
          <div className="rounded-lg p-3 ml-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-1 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400/60 animate-pulse" />
              <span className="text-[9px] text-white/30">Recording...</span>
            </div>
            <div className="h-4 flex items-center gap-0.5">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="w-0.5 rounded-full bg-white/20" style={{ height: `${4 + Math.sin(i * 0.8) * 12}px` }} />
              ))}
            </div>
          </div>
          <div className="rounded-lg p-2.5" style={{ backgroundColor: 'rgba(90,197,122,0.06)', border: '1px solid rgba(90,197,122,0.15)' }}>
            <div className="text-[9px] font-medium text-green-400/80">AI Feedback: Strong response</div>
          </div>
        </div>
      )}
      {index === 3 && (
        <div className="space-y-2">
          <div className="text-[9px] text-white/30 mb-2">Claim Packet — Ready</div>
          {['Personal Statement.pdf', 'Buddy Statement.pdf', 'Health Summary.pdf', 'DBQ Analysis.pdf', 'Evidence Package.pdf'].map((doc, i) => (
            <div key={doc} className="flex items-center gap-2 rounded-lg p-2" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-5 h-6 rounded-sm flex items-center justify-center" style={{ backgroundColor: c.bg }}>
                <span className="text-[7px] font-bold" style={{ color: c.accent }}>PDF</span>
              </div>
              <span className="text-[10px] text-white/70 flex-1">{doc}</span>
              <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(90,197,122,0.15)' }}>
                <span className="text-[7px] text-green-400">✓</span>
              </div>
            </div>
          ))}
          <div className="mt-2 rounded-full py-2 text-center text-[10px] font-semibold" style={{ background: 'linear-gradient(135deg, #A68B3C, #C5A55A, #D9BE6C)', color: '#000' }}>
            Export Packet
          </div>
        </div>
      )}
    </>
  );
}

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const step = Math.min(3, Math.floor(v * 4));
    setActiveStep(step);
  });

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden"
      style={{ backgroundColor: LANDING_BG, scrollMarginTop: '5rem' }}
    >
      <motion.h2
        className="relative z-10 text-white text-center text-3xl md:text-4xl lg:text-5xl pt-10 md:pt-14 mb-6 px-4"
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
        className="text-center text-lg mb-10 px-4 max-w-2xl mx-auto"
        style={{ color: TEXT_SECONDARY }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Four steps. One organized claim packet.
      </motion.p>

      {/* Desktop: sticky phone walkthrough */}
      <div ref={containerRef} className="hidden md:block relative" style={{ height: `${STEPS.length * 100}vh` }}>
        <div className="sticky top-0 h-screen flex items-center">
          <div className="mx-auto max-w-6xl px-6 w-full grid grid-cols-2 gap-12 items-center">
            {/* Left: step cards */}
            <div className="space-y-8">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.num}
                  className="rounded-2xl p-8 transition-all duration-500"
                  style={{
                    backgroundColor: activeStep === i ? LANDING_BG_SUBTLE : 'transparent',
                    border: activeStep === i ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                    opacity: activeStep === i ? 1 : 0.4,
                    transform: activeStep === i ? 'scale(1)' : 'scale(0.97)',
                  }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500"
                      style={{
                        background: activeStep === i ? 'rgba(197, 165, 90, 0.15)' : 'rgba(197, 165, 90, 0.05)',
                        border: `1px solid ${activeStep === i ? 'rgba(197, 165, 90, 0.3)' : 'rgba(197, 165, 90, 0.1)'}`,
                      }}
                    >
                      <span className="text-sm font-semibold" style={{ color: GOLD }}>{step.num}</span>
                    </div>
                  </div>
                  <h3
                    className="text-xl text-white mb-2 transition-colors duration-500"
                    style={{
                      ...HEADING_H3_STYLE,
                      color: activeStep === i ? '#D9BE6C' : '#fff',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Right: sticky phone */}
            <div className="flex items-center justify-center">
              <PhoneFrame activeStep={activeStep} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: simple card layout */}
      <div className="md:hidden mx-auto max-w-lg px-4 pb-10 space-y-4">
        {STEPS.map((step) => (
          <motion.div
            key={step.num}
            className="rounded-2xl p-6"
            style={{
              backgroundColor: LANDING_BG_SUBTLE,
              border: '1px solid rgba(255,255,255,0.06)',
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(197,165,90,0.1)', border: '1px solid rgba(197,165,90,0.2)' }}
              >
                <span className="text-xs font-semibold" style={{ color: GOLD }}>{step.num}</span>
              </div>
              <h3 className="text-lg font-semibold text-white" style={HEADING_H3_STYLE}>{step.title}</h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
