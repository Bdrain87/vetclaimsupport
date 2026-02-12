import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/landing-animations';

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, value]);

  return <span ref={ref}>{isInView ? display : 0}{suffix}</span>;
}

const STATS = [
  { value: 39, suffix: '+', label: 'Tools & Features' },
  { value: 780, suffix: '+', label: 'VA Conditions' },
  { value: 100, suffix: '%', label: 'Private by Default' },
  { value: 0, suffix: '', label: 'Veteran Founded', isText: true },
];

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
              {stat.isText ? '\u2713' : <AnimatedNumber value={stat.value} suffix={stat.suffix} />}
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
