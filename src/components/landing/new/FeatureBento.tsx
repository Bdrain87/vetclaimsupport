import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/landing-animations';

interface BentoCard {
  title: string;
  desc: string;
  span: 1 | 2;
}

const CARDS: BentoCard[] = [
  {
    title: 'Rating Calculator',
    desc: 'Calculate your combined VA disability rating instantly. Add conditions, see your estimated rating, understand bilateral factors.',
    span: 2,
  },
  {
    title: 'VA-Speak Translator',
    desc: 'Decode VA jargon into plain English.',
    span: 1,
  },
  {
    title: 'C&P Exam Prep',
    desc: 'Know exactly what to expect and say.',
    span: 1,
  },
  {
    title: 'AI Claim Intelligence',
    desc: 'Our AI analyzes your conditions and suggests secondary claims, missing evidence, and preparation strategies.',
    span: 2,
  },
  {
    title: 'Buddy & Stressor Statements',
    desc: 'Generate properly formatted supporting statements.',
    span: 1,
  },
  {
    title: 'Back Pay Estimator',
    desc: 'See what you could be owed in retroactive benefits.',
    span: 1,
  },
];

function CardIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="22" height="22" rx="6" stroke="#C5A442" strokeWidth="1.5" />
      <path d="M10 14h8M14 10v8" stroke="#C5A442" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function FeatureBento() {
  return (
    <section id="features" className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-black text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Everything You Need, Nothing You Don&apos;t
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {CARDS.map((card) => (
            <motion.div
              key={card.title}
              variants={fadeInUp}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`rounded-2xl p-6 md:p-8 border border-transparent hover:border-[#C5A442]/30 transition-colors ${
                card.span === 2 ? 'lg:col-span-2' : ''
              }`}
              style={{ backgroundColor: '#1a1a1a' }}
            >
              <div className="mb-4">
                <CardIcon />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>
                {card.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
