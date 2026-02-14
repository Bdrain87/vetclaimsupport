import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, HEADING_H2_STYLE } from '@/lib/landing-animations';

const POINTS = [
  {
    title: 'Encrypted Storage',
    desc: 'Your data is encrypted and stored securely using industry-standard AES-256 encryption.',
  },
  {
    title: 'Optional Cloud Sync',
    desc: 'Create an account to sync across devices. Your data is secured using industry-standard practices.',
  },
  {
    title: 'No Data Sales',
    desc: 'No targeted ads, no marketing sharing, no data sales. Your information stays yours.',
  },
];

function ShieldIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 3L5 8v7c0 7.73 4.66 14.95 11 17 6.34-2.05 11-9.27 11-17V8L16 3z"
        stroke="#000000"
        strokeWidth="2"
        fill="none"
      />
      <path d="M12 16l3 3 5-6" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PrivacySection() {
  return (
    <section
      className="py-5 md:py-6"
      style={{
        background:
          'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {POINTS.map((point, i) => (
            <motion.div key={point.title} variants={fadeInUp} className="flex items-center gap-2">
              <ShieldIcon />
              <div>
                <span className="font-bold text-black text-sm">{point.title}</span>
                {i < POINTS.length - 1 && <span className="hidden md:inline text-black/30 ml-6">|</span>}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
