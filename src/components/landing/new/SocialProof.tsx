import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/landing-animations';

interface Stat {
  target: number;
  suffix: string;
  label: string;
  isText?: boolean;
  text?: string;
}

const STATS: Stat[] = [
  { target: 10, suffix: '+', label: 'Preparation Tools' },
  { target: 40, suffix: '+', label: 'Conditions Covered' },
  { target: 100, suffix: '%', label: 'Private by Default' },
  { target: 0, suffix: '', label: 'Veteran Founded', isText: true, text: '\u2713' },
];

function CountUp({ stat }: { stat: Stat }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || stat.isText) return;
    const duration = 1200;
    const steps = 30;
    const increment = stat.target / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), stat.target);
      setCount(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, stat.target, stat.isText]);

  return (
    <span ref={ref}>
      {stat.isText ? stat.text : `${isInView ? count : 0}${stat.suffix}`}
    </span>
  );
}

export function SocialProof() {
  return (
    <section className="py-8" style={{ backgroundColor: '#111111' }}>
      <motion.div
        className="mx-auto max-w-5xl px-4 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0"
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
            <span
              className="block text-3xl md:text-4xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #E8C560 0%, #C5A442 40%, #A38A35 70%, #C5A442 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              <CountUp stat={stat} />
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
