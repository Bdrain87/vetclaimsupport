import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/landing-animations';

const STEPS = [
  {
    num: 1,
    title: 'Enter Your Service Details',
    desc: 'MOS, duty stations, deployments, combat zones, and exposures. We help you organize your service history and identify conditions you may want to research further.',
  },
  {
    num: 2,
    title: 'Build Your Evidence Strategy',
    desc: 'For each condition, identify the medical records, buddy statements, and supporting documents that may strengthen your claim. Stay organized and know what to prepare.',
  },
  {
    num: 3,
    title: 'Prep, Track, Generate',
    desc: 'Use health trackers to log symptoms mapped to rating criteria. Generate supporting documents and statements. Prepare for your C&P exam with commonly used DBQ formats.',
  },
  {
    num: 4,
    title: 'Submit with Confidence',
    desc: 'Export your organized evidence, formatted statements, and tracked health data. Everything in one place, ready for submission.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28" style={{ backgroundColor: '#000000', scrollMarginTop: '5rem' }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          From Overwhelmed to Organized
        </motion.h2>
        <motion.p
          className="text-center mb-16 text-lg"
          style={{ color: '#9CA3AF' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          What takes months with a lawyer takes minutes with VCS.
        </motion.p>

        <motion.div
          className="space-y-0"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              variants={fadeInUp}
              className="flex gap-6 md:gap-8"
            >
              {/* Badge + line column */}
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-black shrink-0"
                  style={{
                    background:
                      'linear-gradient(135deg, #E8C560 0%, #A38A35 100%)',
                  }}
                >
                  {step.num}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="w-0.5 flex-1 my-2"
                    style={{
                      background:
                        'linear-gradient(to bottom, #C5A442, #A38A35)',
                    }}
                  />
                )}
              </div>

              {/* Text */}
              <div className={i === STEPS.length - 1 ? '' : 'pb-12'}>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p style={{ color: '#9CA3AF' }} className="leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
