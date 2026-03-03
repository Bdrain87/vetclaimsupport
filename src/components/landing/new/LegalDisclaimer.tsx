import { motion } from 'motion/react';
import { EASE_SMOOTH, LANDING_BG } from '@/lib/landing-animations';

export function LegalDisclaimer() {
  return (
    <motion.section
      className="py-8 px-4"
      style={{
        backgroundColor: LANDING_BG,
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: EASE_SMOOTH }}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        <p className="text-xs leading-relaxed text-center" style={{ color: 'rgba(255, 255, 255, 0.35)' }}>
          <strong style={{ color: 'rgba(255, 255, 255, 0.55)' }}>Important Disclosure:</strong>{' '}
          Vet Claim Support is an evidence organization and claim preparation tool. It is not a law firm,
          accredited claims agent, or Veterans Service Organization (VSO). VCS does not file claims on your
          behalf, provide legal advice, or represent veterans before the VA. All claim filing decisions are
          made by you. For accredited representation, contact a VSO, VA-accredited attorney, or claims agent.
          Not affiliated with the U.S. Department of Veterans Affairs.
        </p>
        <p className="text-xs leading-relaxed text-center" style={{ color: 'rgba(255, 255, 255, 0.35)' }}>
          Free VA-accredited Veterans Service Organizations (VSOs) are available at{' '}
          <a
            href="https://www.va.gov/ogc/apps/accreditation"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: 'rgba(255, 255, 255, 0.55)' }}
          >
            va.gov/ogc/apps/accreditation
          </a>{' '}
          to help with claims filing.
        </p>
      </div>
    </motion.section>
  );
}
