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
  { value: 39, suffix: '+', label: 'Tools & Features' },
  { value: 780, suffix: '+', label: 'VA Conditions' },
  { value: 100, suffix: '%', label: 'Local-First Design' },
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
              <span className="block text-3xl md:text-4xl">
                <svg width="36" height="36" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="metallic-gold-flag" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#BF953F"/>
                      <stop offset="25%" stopColor="#FCF6BA"/>
                      <stop offset="50%" stopColor="#B38728"/>
                      <stop offset="75%" stopColor="#FBF5B7"/>
                      <stop offset="100%" stopColor="#AA771C"/>
                    </linearGradient>
                  </defs>
                  {/* Flagpole */}
                  <rect x="8" y="8" width="3" height="48" rx="1.5" fill="url(#metallic-gold-flag)"/>
                  {/* Flag body */}
                  <rect x="11" y="10" width="40" height="28" rx="2" fill="url(#metallic-gold-flag)" opacity="0.9"/>
                  {/* Stripes */}
                  <rect x="11" y="14.3" width="40" height="2.15" fill="#0A0A0A" opacity="0.25"/>
                  <rect x="11" y="18.6" width="40" height="2.15" fill="#0A0A0A" opacity="0.25"/>
                  <rect x="11" y="22.9" width="40" height="2.15" fill="#0A0A0A" opacity="0.25"/>
                  <rect x="11" y="27.2" width="40" height="2.15" fill="#0A0A0A" opacity="0.25"/>
                  <rect x="11" y="31.5" width="40" height="2.15" fill="#0A0A0A" opacity="0.25"/>
                  <rect x="11" y="35.8" width="40" height="2.15" fill="#0A0A0A" opacity="0.25"/>
                  {/* Star field */}
                  <rect x="11" y="10" width="18" height="15" rx="1" fill="#0A0A0A" opacity="0.3"/>
                  {/* Stars */}
                  <circle cx="15" cy="13.5" r="1" fill="url(#metallic-gold-flag)"/>
                  <circle cx="20" cy="13.5" r="1" fill="url(#metallic-gold-flag)"/>
                  <circle cx="25" cy="13.5" r="1" fill="url(#metallic-gold-flag)"/>
                  <circle cx="17.5" cy="16.5" r="1" fill="url(#metallic-gold-flag)"/>
                  <circle cx="22.5" cy="16.5" r="1" fill="url(#metallic-gold-flag)"/>
                  <circle cx="15" cy="19.5" r="1" fill="url(#metallic-gold-flag)"/>
                  <circle cx="20" cy="19.5" r="1" fill="url(#metallic-gold-flag)"/>
                  <circle cx="25" cy="19.5" r="1" fill="url(#metallic-gold-flag)"/>
                  <circle cx="17.5" cy="22.5" r="1" fill="url(#metallic-gold-flag)"/>
                  <circle cx="22.5" cy="22.5" r="1" fill="url(#metallic-gold-flag)"/>
                </svg>
              </span>
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
