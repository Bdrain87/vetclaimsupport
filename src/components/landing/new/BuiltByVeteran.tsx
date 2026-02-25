import { motion } from 'framer-motion';
import { EASE_SMOOTH } from '@/lib/landing-animations';

function GoldFlag() {
  return (
    <svg
      width="80"
      height="54"
      viewBox="0 0 80 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.35 }}
    >
      <defs>
        <linearGradient id="flag-gold" x1="0" y1="0" x2="80" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D9BE6C" />
          <stop offset="50%" stopColor="#C5A55A" />
          <stop offset="100%" stopColor="#A68B3C" />
        </linearGradient>
        <linearGradient id="flag-gold-dark" x1="0" y1="0" x2="80" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A68B3C" />
          <stop offset="50%" stopColor="#8B7530" />
          <stop offset="100%" stopColor="#A68B3C" />
        </linearGradient>
      </defs>
      {/* Flag body */}
      <rect width="80" height="54" rx="2" fill="url(#flag-gold)" />
      {/* Stripes — darker gold bands */}
      <rect y="8.3" width="80" height="4.15" fill="url(#flag-gold-dark)" />
      <rect y="16.6" width="80" height="4.15" fill="url(#flag-gold-dark)" />
      <rect y="24.9" width="80" height="4.15" fill="url(#flag-gold-dark)" />
      <rect y="33.2" width="80" height="4.15" fill="url(#flag-gold-dark)" />
      <rect y="41.5" width="80" height="4.15" fill="url(#flag-gold-dark)" />
      <rect y="49.8" width="80" height="4.2" fill="url(#flag-gold-dark)" />
      {/* Star field */}
      <rect width="32" height="29" rx="1" fill="url(#flag-gold-dark)" />
      {/* Stars — 5 rows */}
      {[3.5, 10, 16.5, 23].map((cy) =>
        [5, 12, 19, 26].map((cx) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.3" fill="url(#flag-gold)" />
        ))
      )}
      {[6.75, 13.25, 19.75].map((cy) =>
        [8.5, 15.5, 22.5].map((cx) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.3" fill="url(#flag-gold)" />
        ))
      )}
    </svg>
  );
}

export function BuiltByVeteran() {
  return (
    <section className="py-[120px] px-4" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="mx-auto max-w-3xl">
        {/* Gold flag */}
        <motion.div
          className="flex justify-center mb-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE_SMOOTH }}
        >
          <GoldFlag />
        </motion.div>

        <motion.blockquote
          className="relative pl-6 md:pl-8"
          style={{
            borderLeft: '3px solid transparent',
            borderImage: 'linear-gradient(180deg, #D9BE6C, #C5A55A, #A68B3C, #C5A55A, #D9BE6C) 1',
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE_SMOOTH }}
        >
          <p
            className="text-lg md:text-xl italic leading-relaxed mb-6"
            style={{ color: '#E5E7EB' }}
          >
            &ldquo;I&rsquo;m a 100% service-connected disabled veteran. I went through the claims
            process myself. The confusion, the denials, the C&amp;P exams, the sharks who wanted
            thousands of dollars to do what I could do with the right tools. I built Vet Claim
            Support because no service member or veteran should have to pay someone thousands to
            organize what&rsquo;s already theirs. This isn&rsquo;t a corporation. It&rsquo;s a
            weapon, built by a veteran, for service members and veterans.&rdquo;
          </p>
          <footer
            className="text-sm"
            style={{ color: '#B8B8B8' }}
          >
            &mdash; Blake, Vet Claim Support
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
