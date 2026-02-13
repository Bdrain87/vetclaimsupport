import { motion } from 'framer-motion';
import { GOLD_GRADIENT_TEXT, EASE_SMOOTH } from '@/lib/landing-animations';

export function BuiltByVeteran() {
  return (
    <section className="py-16 md:py-20 px-4" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="mx-auto max-w-3xl">
        <motion.h2
          className="text-2xl md:text-3xl mb-8 text-center"
          style={{
            fontWeight: 500,
            letterSpacing: '-0.025em',
            lineHeight: 1.2,
            ...GOLD_GRADIENT_TEXT,
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE_SMOOTH }}
        >
          Built By A Veteran Who Went Through It
        </motion.h2>

        <motion.blockquote
          className="relative pl-6 md:pl-8"
          style={{
            borderLeft: '3px solid transparent',
            borderImage: 'linear-gradient(180deg, #E8C560, #C5A442, #A38A35) 1',
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE_SMOOTH }}
        >
          <p
            className="text-lg md:text-xl italic leading-relaxed mb-4"
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
