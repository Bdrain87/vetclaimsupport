import { motion } from 'framer-motion';
import { EASE_SMOOTH } from '@/lib/landing-animations';

export function LegalDisclaimer() {
  return (
    <motion.section
      className="py-8 px-4"
      style={{
        backgroundColor: '#0A0A0A',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: EASE_SMOOTH }}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        <p className="text-xs leading-relaxed text-center" style={{ color: '#6B7280' }}>
          <strong style={{ color: '#9CA3AF' }}>Important Disclosure:</strong>{' '}
          Vet Claim Support is an educational and organizational tool designed to help veterans prepare and organize information related to VA disability claims. VCS is{' '}
          <strong>NOT</strong> affiliated with, endorsed by, or connected to the U.S. Department of Veterans Affairs.
          VCS is <strong>NOT</strong> a VA-accredited representative, attorney, claims agent, or Veterans Service Organization (VSO).
          VCS does <strong>NOT</strong> provide legal advice, medical advice, or professional claims representation.
          VCS does <strong>NOT</strong> file claims on your behalf and does <strong>NOT</strong> guarantee any claim outcomes.
        </p>
        <p className="text-xs leading-relaxed text-center" style={{ color: '#6B7280' }}>
          AI-generated content may contain errors and must be independently verified before use.
          Free VA-accredited Veterans Service Organizations (VSOs) are available at{' '}
          <a
            href="https://www.va.gov/vso"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: '#9CA3AF' }}
          >
            va.gov/vso
          </a>{' '}
          to help with claims filing.
        </p>
      </div>
    </motion.section>
  );
}
