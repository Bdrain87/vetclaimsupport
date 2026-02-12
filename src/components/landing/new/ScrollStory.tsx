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
    heading: "You Served Your Country. Now Let's Get What You Earned.",
    sub: "The VA claims process is complex, time-consuming, and filled with jargon. Many veterans don't know where to start — or what they're eligible for.",
  },
  {
    num: '02',
    heading: 'One Missing Document Can Set You Back Months',
    sub: "Between gathering records, writing statements, and understanding rating criteria, it's easy to miss something critical. Preparation is everything.",
  },
  {
    num: '03',
    heading: 'Professional Help Comes at a Price',
    sub: "Claim consultants and attorneys can be expensive. You shouldn't need to spend thousands just to understand your own benefits.",
  },
  {
    num: '04',
    heading: "Now There's a Better Way.",
    sub: 'A privacy-first toolkit with preparation tools, condition tracking, and document generators — all in one place.',
    cta: true,
  },
];

/* ── Desktop: sticky scroll crossfade ── */
function DesktopScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef} className="hidden md:block relative" style={{ height: '400vh' }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {FRAMES.map((frame, i) => (
          <DesktopFrame
            key={frame.num}
            frame={frame}
            progress={scrollYProgress}
            index={i}
            total={FRAMES.length}
          />
        ))}
      </div>
    </div>
  );
}

function DesktopFrame({
  frame,
  progress,
  index,
  total,
}: {
  frame: Frame;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  index: number;
  total: number;
}) {
  const seg = 1 / total;
  const start = index * seg;
  const end = start + seg;

  const isFirst = index === 0;
  const isLast = index === total - 1;

  const inputRange = isFirst
    ? [0, end - 0.05, end]
    : isLast
      ? [start, start + 0.05, 1]
      : [start, start + 0.05, end - 0.05, end];

  const outputRange = isFirst
    ? [1, 1, 0]
    : isLast
      ? [0, 1, 1]
      : [0, 1, 1, 0];

  const opacity = useTransform(progress, inputRange, outputRange);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-6"
      style={{ opacity }}
    >
      <div className="max-w-3xl text-center">
        <span
          className="block text-8xl font-black mb-6"
          style={{
            background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            opacity: 0.2,
          }}
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
                  'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
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
            style={{
              background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: 0.2,
            }}
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
                  'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
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
