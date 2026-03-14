import { motion } from 'motion/react';
import { EASE_SMOOTH, LANDING_BG, TEXT_PRIMARY, TEXT_TERTIARY } from '@/lib/landing-animations';

function GoldFlag() {
  return (
    <svg
      width="72"
      height="48"
      viewBox="0 0 72 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="flag-stroke" x1="0" y1="0" x2="72" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D0C6A0" />
          <stop offset="50%" stopColor="#B8AB80" />
          <stop offset="100%" stopColor="#B8AB80" />
        </linearGradient>
      </defs>
      {/* Outer border */}
      <rect x="0.5" y="0.5" width="71" height="47" rx="1.5" stroke="url(#flag-stroke)" strokeWidth="1" />
      {/* 13 stripes as lines */}
      {[3.7, 7.4, 11.1, 14.8, 18.5, 22.2, 25.9, 29.6, 33.3, 37, 40.7, 44.4].map((y, i) => (
        <line key={i} x1={i < 6 ? 29 : 2} y1={y} x2={70} y2={y} stroke="url(#flag-stroke)" strokeWidth="0.6" strokeOpacity={0.5} />
      ))}
      {/* Star field box */}
      <rect x="2" y="2" width="26" height="22" rx="0.5" stroke="url(#flag-stroke)" strokeWidth="0.6" strokeOpacity={0.6} fill="none" />
      {/* Stars — row 1 (5 stars) */}
      {[6, 11.5, 17, 22.5].map((cx) => (
        <circle key={`r1-${cx}`} cx={cx} cy={5.5} r="0.9" fill="url(#flag-stroke)" fillOpacity={0.7} />
      ))}
      {/* Stars — row 2 (4 stars, offset) */}
      {[8.75, 14.25, 19.75].map((cx) => (
        <circle key={`r2-${cx}`} cx={cx} cy={9} r="0.9" fill="url(#flag-stroke)" fillOpacity={0.7} />
      ))}
      {/* Stars — row 3 */}
      {[6, 11.5, 17, 22.5].map((cx) => (
        <circle key={`r3-${cx}`} cx={cx} cy={12.5} r="0.9" fill="url(#flag-stroke)" fillOpacity={0.7} />
      ))}
      {/* Stars — row 4 */}
      {[8.75, 14.25, 19.75].map((cx) => (
        <circle key={`r4-${cx}`} cx={cx} cy={16} r="0.9" fill="url(#flag-stroke)" fillOpacity={0.7} />
      ))}
      {/* Stars — row 5 */}
      {[6, 11.5, 17, 22.5].map((cx) => (
        <circle key={`r5-${cx}`} cx={cx} cy={19.5} r="0.9" fill="url(#flag-stroke)" fillOpacity={0.7} />
      ))}
    </svg>
  );
}

export function BuiltByVeteran() {
  return (
    <section className="py-16 md:py-24 px-4" style={{ backgroundColor: LANDING_BG }}>
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
            borderImage: 'linear-gradient(180deg, #DDD3B2, #C8BA8A, #B8AB80, #C8BA8A, #DDD3B2) 1',
          }}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_SMOOTH }}
        >
          <p
            className="text-lg md:text-xl italic leading-relaxed mb-6"
            style={{ color: TEXT_PRIMARY }}
          >
            &ldquo;I&rsquo;m a service-connected disabled veteran. I went through the claims
            process myself &mdash; the confusion, the denials, the C&amp;P exams, the companies charging
            thousands of dollars for help I could have done with the right tools. I built Vet Claim
            Support because no service member or veteran should have to pay that much just to
            organize their own evidence. This isn&rsquo;t a corporation. It&rsquo;s a tool,
            built by a veteran, for service members and veterans.&rdquo;
          </p>
          <footer
            className="text-sm"
            style={{ color: '#B8B8B8' }}
          >
            &mdash; Blake, Founder &amp; Creator
          </footer>
          <p
            className="text-xs mt-4 pl-6 md:pl-8"
            style={{ color: TEXT_TERTIARY }}
          >
            Individual results vary. Vet Claim Support is an organizational tool &mdash; not a guarantee of any particular outcome.
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
}
