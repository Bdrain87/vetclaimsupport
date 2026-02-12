import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function FinalCTA() {
  return (
    <section
      className="py-24 md:py-32"
      style={{
        background: `
          radial-gradient(ellipse at 30% 50%, rgba(197,164,66,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 30%, rgba(197,164,66,0.05) 0%, transparent 50%),
          #000000
        `,
      }}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-white mb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Ready to Take Control of Your Claim?
        </motion.h2>
        <motion.p
          className="text-lg mb-4"
          style={{ color: '#9CA3AF' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          All the preparation tools you need. Zero upfront cost.
        </motion.p>
        <motion.p
          className="text-sm mb-10"
          style={{ color: '#6B7280' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          Privacy-first &bull; Free plan available &bull; Veteran founded
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Link
              to="/app"
              className="inline-block rounded-full px-10 py-4 text-xl font-semibold text-black no-underline"
              style={{
                background:
                  'linear-gradient(135deg, #E8C560 0%, #C5A442 40%, #A38A35 70%, #C5A442 100%)',
              }}
            >
              Get Started Free
            </Link>
          </motion.div>
        </motion.div>
        <motion.p
          className="text-sm mt-6"
          style={{ color: '#9CA3AF' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Free plan available &bull; Premium from $9.99/mo
        </motion.p>
      </div>
    </section>
  );
}
