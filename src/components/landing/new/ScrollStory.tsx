import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp } from '@/lib/landing-animations';

interface Frame {
  num: string;
  heading: string;
  sub: string;
  cta?: boolean;
}

const FRAMES: Frame[] = [
  {
    num: '01',
    heading: "Filing a VA Claim Shouldn't Be This Hard",
    sub: "The system wasn't designed for you. It was designed for the system.",
  },
  {
    num: '02',
    heading: 'You Spend Months Gathering Evidence',
    sub: '...only to find out you missed one document and get denied. Starting over from scratch.',
  },
  {
    num: '03',
    heading: "You Don't Speak 'VA'",
    sub: "Rating criteria, diagnostic codes, bilateral factors, pyramiding rules — it's designed to be confusing.",
  },
  {
    num: '04',
    heading: 'What If You Had a Guide?',
    sub: 'Vet Claim Support organizes your evidence, translates the language, and prepares you for every step.',
    cta: true,
  },
];

/* ── Desktop: sticky scroll crossfade ── */
function DesktopScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  return (
    <div ref={containerRef} className="hidden md:block relative" style={{ height: '400vh' }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {FRAMES.map((frame, i) => {
          const start = i / FRAMES.length;
          const end = (i + 1) / FRAMES.length;
          return (
            <DesktopFrame key={frame.num} frame={frame} progress={scrollYProgress} start={start} end={end} />
          );
        })}
      </div>
    </div>
  );
}

function DesktopFrame({
  frame,
  progress,
  start,
  end,
}: {
  frame: Frame;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  start: number;
  end: number;
}) {
  const fadeIn = start + 0.02;
  const fadeOut = end - 0.02;
  const opacity = useTransform(progress, [start, fadeIn, fadeOut, end], [0, 1, 1, 0]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-6"
      style={{ opacity }}
    >
      <div className="max-w-3xl text-center">
        <span
          className="block text-8xl font-black mb-6"
          style={{ color: '#C5A442', opacity: 0.15 }}
        >
          {frame.num}
        </span>
        <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">{frame.heading}</h3>
        <p className="text-lg md:text-xl mb-8" style={{ color: '#9CA3AF' }}>
          {frame.sub}
        </p>
        {frame.cta && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/app"
              className="inline-block rounded-full px-8 py-3 text-lg font-semibold text-black no-underline"
              style={{
                background:
                  'linear-gradient(135deg, #E8C560 0%, #C5A442 40%, #A38A35 70%, #C5A442 100%)',
              }}
            >
              Start Preparing Your Claim
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/* ── Mobile: stacked with fade-in ── */
function MobileScrollStory() {
  return (
    <div className="md:hidden py-20 px-4 space-y-24">
      {FRAMES.map((frame) => (
        <motion.div
          key={frame.num}
          className="text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <span
            className="block text-6xl font-black mb-4"
            style={{ color: '#C5A442', opacity: 0.15 }}
          >
            {frame.num}
          </span>
          <h3 className="text-2xl font-bold text-white mb-3">{frame.heading}</h3>
          <p className="text-base mb-6" style={{ color: '#9CA3AF' }}>
            {frame.sub}
          </p>
          {frame.cta && (
            <Link
              to="/app"
              className="inline-block rounded-full px-8 py-3 text-base font-semibold text-black no-underline"
              style={{
                background:
                  'linear-gradient(135deg, #E8C560 0%, #C5A442 40%, #A38A35 70%, #C5A442 100%)',
              }}
            >
              Start Preparing Your Claim
            </Link>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export function ScrollStory() {
  return (
    <section style={{ backgroundColor: '#000000' }}>
      <DesktopScrollStory />
      <MobileScrollStory />
    </section>
  );
}
