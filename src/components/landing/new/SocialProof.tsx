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
  { value: 50, suffix: '+', label: 'Tools & Features' },
  { value: 800, suffix: '+', label: 'VA Conditions' },
  { value: 256, suffix: '-bit', label: 'AES Encryption' },
  { value: 0, suffix: '', label: 'Veteran Founded', isText: true },
];

export function SocialProof() {
  return (
    <section className="py-6" style={{ backgroundColor: '#111111' }}>
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
              <div className="flex items-center justify-center h-[36px] md:h-[40px]">
                <svg width="52" height="36" viewBox="-2 -2 64 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="gold-flag-light" x1="0" y1="0" x2="60" y2="40" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#E2C468"/>
                      <stop offset="100%" stopColor="#D4AF37"/>
                    </linearGradient>
                    <linearGradient id="silver-border" x1="0" y1="0" x2="60" y2="40" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#E8E8E8"/>
                      <stop offset="30%" stopColor="#B0B0B0"/>
                      <stop offset="50%" stopColor="#F0F0F0"/>
                      <stop offset="70%" stopColor="#A8A8A8"/>
                      <stop offset="100%" stopColor="#D0D0D0"/>
                    </linearGradient>
                  </defs>
                  {/* Metallic silver border */}
                  <rect x="-1.5" y="-1.5" width="63" height="43" rx="4.5" fill="none" stroke="url(#silver-border)" strokeWidth="2"/>
                  {/* Flag body — light gold */}
                  <rect x="0" y="0" width="60" height="40" rx="3" fill="url(#gold-flag-light)"/>
                  {/* Stripes — alternating darker gold bands */}
                  <rect x="0" y="6.15" width="60" height="3.08" fill="#B38728"/>
                  <rect x="0" y="12.3" width="60" height="3.08" fill="#B38728"/>
                  <rect x="0" y="18.45" width="60" height="3.08" fill="#B38728"/>
                  <rect x="0" y="24.6" width="60" height="3.08" fill="#B38728"/>
                  <rect x="0" y="30.75" width="60" height="3.08" fill="#B38728"/>
                  <rect x="0" y="36.9" width="60" height="3.1" fill="#B38728"/>
                  {/* Star field — solid dark gold */}
                  <rect x="0" y="0" width="24" height="21.5" rx="2" fill="#B38728"/>
                  {/* Stars — lighter gold */}
                  <circle cx="5" cy="4" r="1.2" fill="#E2C468"/>
                  <circle cx="12" cy="4" r="1.2" fill="#E2C468"/>
                  <circle cx="19" cy="4" r="1.2" fill="#E2C468"/>
                  <circle cx="8.5" cy="7.5" r="1.2" fill="#E2C468"/>
                  <circle cx="15.5" cy="7.5" r="1.2" fill="#E2C468"/>
                  <circle cx="5" cy="11" r="1.2" fill="#E2C468"/>
                  <circle cx="12" cy="11" r="1.2" fill="#E2C468"/>
                  <circle cx="19" cy="11" r="1.2" fill="#E2C468"/>
                  <circle cx="8.5" cy="14.5" r="1.2" fill="#E2C468"/>
                  <circle cx="15.5" cy="14.5" r="1.2" fill="#E2C468"/>
                  <circle cx="5" cy="18" r="1.2" fill="#E2C468"/>
                  <circle cx="12" cy="18" r="1.2" fill="#E2C468"/>
                  <circle cx="19" cy="18" r="1.2" fill="#E2C468"/>
                </svg>
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
