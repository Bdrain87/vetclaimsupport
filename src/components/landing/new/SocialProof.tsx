import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/landing-animations';

const STATS = [
  { number: '12+', label: 'Claim Tools' },
  { number: '40+', label: 'Conditions Covered' },
  { number: '100%', label: 'Local-First Privacy' },
  { number: 'Veteran', label: 'Built' },
];

export function SocialProof() {
  return (
    <section className="py-6" style={{ backgroundColor: '#111111' }}>
      <motion.div
        className="mx-auto max-w-5xl px-4 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeInUp}
            className={`text-center py-3 ${
              i < STATS.length - 1 ? 'md:border-r md:border-gray-700' : ''
            }`}
          >
            <span className="block text-2xl md:text-3xl font-bold" style={{ color: '#C5A442' }}>
              {stat.number}
            </span>
            <span className="text-sm" style={{ color: '#9CA3AF' }}>
              {stat.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
