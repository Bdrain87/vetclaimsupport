/**
 * FAQ — Accordion-style frequently asked questions for objection handling.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HEADING_H2_STYLE,
  fadeInUp,
  fadeInRight,
  staggerContainerFast,
  LANDING_BG,
  LANDING_BG_CARD,
  TEXT_SECONDARY,
  TEXT_BRIGHT,
  GOLD,
  GOLD_GRADIENT_TEXT,
  EASE_SMOOTH,
  viewportOnce,
} from '@/lib/landing-animations';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Is VCS a VSO or claims agent?',
    answer:
      'No. Vet Claim Support is an educational and organizational tool that helps you prepare your claim materials. We do not file claims, represent veterans before the VA, or provide legal advice. We recommend working with a free Veterans Service Organization (VSO) for accredited representation.',
  },
  {
    question: 'How is this different from ChatGPT?',
    answer:
      'Generic AI doesn\'t know VA rating criteria, doesn\'t have your health data, and can\'t build claim documents. VCS has 85+ purpose-built tools that use your logged symptoms, medications, and medical visits to generate personalized statements, analyze evidence strength, and prepare you for C&P exams.',
  },
  {
    question: 'Do I still need a VSO?',
    answer:
      'We recommend it. VCS handles preparation — organizing evidence, building statements, and prepping for exams. A VSO handles representation — filing your claim and advocating on your behalf. They complement each other.',
  },
  {
    question: 'Is my data safe?',
    answer:
      'Yes. All data is protected with AES-256 encryption. Personally identifiable information is masked before any AI processing. We never sell or share your data with third parties. You can export or delete your data at any time.',
  },
  {
    question: 'What if I already got denied?',
    answer:
      'VCS includes tools specifically for this: Decision Letter Decoder helps you understand why you were denied, Evidence Strength Analyzer identifies gaps in your evidence, and our supplemental claim tools help you build a stronger case for your next submission.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes. No contracts, no cancellation fees. You can cancel your subscription at any time and retain access through the end of your billing period.',
  },
  {
    question: 'Is VCS available on Android?',
    answer:
      'VCS is currently available as a native iOS app and a full-featured web app accessible from any device. Android is coming soon.',
  },
];

function FAQAccordionItem({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      variants={fadeInRight}
      className="border-b border-white/5 last:border-b-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 px-1 bg-transparent border-none cursor-pointer text-left"
      >
        <span className="text-base font-medium text-white pr-4">{item.question}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown size={18} style={{ color: GOLD }} />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE_SMOOTH }}
            className="overflow-hidden"
          >
            <p
              className="text-sm leading-relaxed pb-5 px-1"
              style={{ color: TEXT_BRIGHT }}
            >
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="relative py-16 md:py-24 px-4" style={{ backgroundColor: LANDING_BG }}>
      <div className="max-w-3xl mx-auto">
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
            className="text-3xl md:text-4xl lg:text-5xl text-white"
            style={HEADING_H2_STYLE}
          >
            Frequently Asked{' '}
            <span style={GOLD_GRADIENT_TEXT}>Questions</span>
          </motion.h2>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainerFast}
          className="rounded-2xl p-6 md:p-8 border border-white/5"
          style={{ backgroundColor: LANDING_BG_CARD }}
        >
          {FAQ_ITEMS.map((item) => (
            <FAQAccordionItem key={item.question} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
