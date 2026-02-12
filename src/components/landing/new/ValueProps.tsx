import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/landing-animations';

function ClipboardIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="6" width="24" height="30" rx="3" stroke="#C5A442" strokeWidth="2" />
      <rect x="14" y="2" width="12" height="6" rx="2" fill="#C5A442" />
      <line x1="14" y1="16" x2="26" y2="16" stroke="#C5A442" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="22" x2="26" y2="22" stroke="#C5A442" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="28" x2="22" y2="28" stroke="#C5A442" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TranslateIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 8h16M14 4v4M10 8c0 6 4 12 10 14M18 8c0 6-4 12-10 14" stroke="#C5A442" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 36l4-12 4 12M25.5 32h5" stroke="#C5A442" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalculatorIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="4" width="24" height="32" rx="3" stroke="#C5A442" strokeWidth="2" />
      <rect x="12" y="8" width="16" height="8" rx="1.5" fill="#C5A442" opacity="0.2" stroke="#C5A442" strokeWidth="1.5" />
      <circle cx="15" cy="22" r="1.5" fill="#C5A442" />
      <circle cx="20" cy="22" r="1.5" fill="#C5A442" />
      <circle cx="25" cy="22" r="1.5" fill="#C5A442" />
      <circle cx="15" cy="28" r="1.5" fill="#C5A442" />
      <circle cx="20" cy="28" r="1.5" fill="#C5A442" />
      <circle cx="25" cy="28" r="1.5" fill="#C5A442" />
      <circle cx="15" cy="33" r="1.5" fill="#C5A442" />
      <rect x="19" y="31.5" width="7" height="3" rx="1" fill="#C5A442" />
    </svg>
  );
}

const PROPS = [
  {
    Icon: ClipboardIcon,
    title: 'Organize Your Evidence',
    desc: 'Add your conditions, upload documents, and let AI help you build a complete evidence package for each claim.',
  },
  {
    Icon: TranslateIcon,
    title: 'Understand VA Language',
    desc: "Our VA-Speak Translator converts complex medical and legal jargon into plain English you can actually understand.",
  },
  {
    Icon: CalculatorIcon,
    title: 'Know Your Rating',
    desc: 'Calculate your estimated combined rating before you file. No surprises, no guessing.',
  },
];

export function ValueProps() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            What is Vet Claim Support?
          </h2>
          <p style={{ color: '#6B7280' }} className="text-lg">
            Your all-in-one VA claim preparation toolkit
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {PROPS.map(({ Icon, title, desc }) => (
            <motion.div key={title} variants={fadeInUp} className="text-center">
              <div className="flex justify-center mb-5">
                <Icon />
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">{title}</h3>
              <p style={{ color: '#6B7280' }} className="leading-relaxed">
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
