import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { fadeInUp, staggerContainer, LANDING_BG_CARD, TEXT_SECONDARY } from '@/lib/landing-animations';

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!isInView) return;
    setDisplay(0);
    const duration = 1800;
    const startTime = Date.now();
    let rafId: number;
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, value]);

  return (
    <div ref={ref}>
      <span
        className="block text-3xl md:text-4xl font-bold"
        style={{
          background: 'linear-gradient(90deg, #A68B3C 0%, #C5A55A 25%, #D9BE6C 50%, #C5A55A 75%, #A68B3C 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {display}{suffix}
      </span>
    </div>
  );
}

const STATS = [
  { value: 85, suffix: '+', label: 'Tools & Features' },
  { value: 70, suffix: '', label: 'VA DBQ Forms' },
  { value: 790, suffix: '+', label: 'Conditions Covered' },
  { value: 10, suffix: '', label: 'Health Trackers' },
];

export function SocialProof() {
  return (
    <section className="py-4 md:py-6" style={{ backgroundColor: LANDING_BG_CARD, borderTop: '1px solid rgba(197,165,90,0.15)', borderBottom: '1px solid rgba(197,165,90,0.15)' }}>
      <motion.div
        className="mx-auto max-w-5xl px-4 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeInUp}
            className={`text-center py-3 ${
              i < STATS.length - 1 ? 'md:border-r md:border-gray-700' : ''
            }`}
          >
            <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            <span className="text-sm" style={{ color: TEXT_SECONDARY }}>
              {stat.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
      <p
        className="text-center mt-4 text-xs"
        style={{ color: 'rgba(255, 255, 255, 0.40)' }}
      >
        Veteran-built. 256-bit encrypted. Not affiliated with the VA.
      </p>
    </section>
  );
}
