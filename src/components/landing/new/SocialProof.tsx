import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/landing-animations';

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, value]);

  return (
    <div ref={ref}>
      <span
        className="block text-3xl md:text-4xl font-bold"
        style={{
          background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {isInView ? display : 0}{suffix}
      </span>
    </div>
  );
}

const STATS = [
  { value: 780, suffix: '+', label: 'VA Conditions Covered' },
  { value: 0, suffix: '', label: 'Your Data Never Sold. Ever.', isText: true },
  { value: 0, suffix: '', label: 'Free Tier — No Account Required', isText: true },
];

export function SocialProof() {
  return (
    <section className="py-6" style={{ backgroundColor: '#111111' }}>
      <motion.div
        className="mx-auto max-w-5xl px-4 grid grid-cols-3 gap-6 md:gap-0"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeInUp}
            className={`text-center py-3 ${
              i < STATS.length - 1 ? 'md:border-r md:border-gray-700' : ''
            }`}
          >
            {stat.isText ? (
              <div className="flex items-center justify-center h-[36px] md:h-[40px] mb-2">
                <span
                  className="text-2xl md:text-3xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  ✓
                </span>
              </div>
            ) : (
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            )}
            <span className="text-sm" style={{ color: '#9CA3AF' }}>
              {stat.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
