import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/landing-animations';

const STEPS = [
  {
    num: 1,
    title: 'Select Your MOS & Conditions',
    desc: "Tell us your military job code and claimed conditions. We'll recommend secondary conditions you might be missing.",
  },
  {
    num: 2,
    title: 'Build Your Evidence Package',
    desc: 'Our AI guides you through exactly what documentation the VA needs for each condition.',
  },
  {
    num: 3,
    title: 'Prepare for Your C&P Exam',
    desc: 'Know the specific questions, tests, and criteria the examiner will use.',
  },
  {
    num: 4,
    title: 'Submit with Confidence',
    desc: 'Export your complete claim package with all evidence organized and ready to file.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28" style={{ backgroundColor: '#000000', scrollMarginTop: '5rem' }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Get Claim-Ready in 4 Steps
        </motion.h2>

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
