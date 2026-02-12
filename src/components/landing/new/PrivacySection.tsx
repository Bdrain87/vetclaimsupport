import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/landing-animations';

const POINTS = [
  {
    title: '100% Local-First',
    desc: 'Everything stored on your phone. No cloud required.',
  },
  {
    title: 'Optional Encrypted Sync',
    desc: 'Choose to sync across devices with end-to-end encryption.',
  },
  {
    title: 'Zero Data Collection',
    desc: "We don't track you, sell your data, or share anything. Ever.",
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
      className="py-20 md:py-28"
      style={{
        background:
          'linear-gradient(135deg, #E8C560 0%, #C5A442 40%, #A38A35 70%, #C5A442 100%)',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-black text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Your Data Never Leaves Your Device
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {POINTS.map((point) => (
            <motion.div key={point.title} variants={fadeInUp} className="text-center">
              <div className="flex justify-center mb-4">
                <ShieldIcon />
              </div>
              <h3 className="text-lg font-bold text-black mb-2">{point.title}</h3>
              <p className="text-black/70 leading-relaxed">{point.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
