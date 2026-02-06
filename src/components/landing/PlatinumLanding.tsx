import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ChevronDown,
  Shield,
  Lock,
  Ban,
  ShieldCheck,
  Crosshair,
  Brain,
  MapPin,
  Calculator,
  Search,
  FileText,
  Clock,
  Activity,
  Flame,
  Moon,
  Pill,
  ClipboardList,
  GraduationCap,
  MessageSquare,
  Move,
  Users,
  FileBarChart,
  Download,
  Apple,
  Play,
} from 'lucide-react';

/* ─── animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } },
};

/* ─── reusable section header ─── */
function SectionHeader({ gold, sub }: { gold: string; sub?: string }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-16 px-4">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-wide text-[#C8A628] leading-tight">
        {gold}
      </h2>
      {sub && (
        <p className="mt-4 text-white/70 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          {sub}
        </p>
      )}
    </motion.div>
  );
}

/* ─── glass card ─── */
function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={cardVariant}
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(200,166,40,0.3)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ─── tool / log card ─── */
function ToolCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <GlassCard>
      <div className="p-3 bg-[#C8A628]/10 rounded-xl text-[#C8A628] w-fit mb-5">{icon}</div>
      <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
      <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
    </GlassCard>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════ */
export const PlatinumLanding = () => {
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 1.05]);

  return (
    <div className="min-h-[100dvh] bg-[#102039] selection:bg-[#C8A628]/30 overflow-x-hidden max-w-full">

      {/* ═══════════════ SECTION 1: HERO ═══════════════ */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-hidden">
        {/* radial bg glow */}
        <motion.div
          style={{ scale: heroScale }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,166,40,0.06)_0%,transparent_70%)]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="relative text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black uppercase text-white tracking-tight leading-[1.08] max-w-5xl"
        >
          YOUR CLAIM.{' '}
          <span className="text-[#C8A628]">YOUR EVIDENCE.</span>{' '}
          YOUR MONEY.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="relative mt-6 sm:mt-8 text-white/70 text-base sm:text-lg md:text-xl max-w-[600px] leading-relaxed px-2"
        >
          Whether you're still in uniform, just got your DD-214, or haven't touched your claim
          in 30 years — this is the tool the VA doesn't want you to have.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="relative mt-10"
        >
          <Link
            to="/dashboard"
            className="inline-block w-full sm:w-auto bg-[#C8A628] text-black font-bold text-lg px-8 sm:px-10 py-4 sm:py-5 rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(200,166,40,0.4)] hover:scale-[1.02] active:scale-[0.98] min-h-[48px] text-center"
            style={{ textShadow: '1px 1px 0 rgba(0,0,0,1)' }}
          >
            Get Started — $4.99
          </Link>
          <p className="mt-4 text-white/60 text-sm">Limited Time Founder's Launch Price</p>
        </motion.div>

        {/* scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-10"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
            <ChevronDown className="text-white/50" size={28} aria-hidden="true" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════ SECTION 2: TRUST BAR ═══════════════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-5xl mx-auto bg-white/[0.03] backdrop-blur-md sm:backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16"
        >
          {[
            { emoji: '🎖️', text: 'Built by a 100% Disabled Veteran' },
            { emoji: '📋', text: '778+ Secondary Conditions Mapped' },
            { emoji: '⚖️', text: '38 CFR Part 4 Intelligence Built In' },
          ].map((item, i) => (
            <motion.div key={i} variants={cardVariant} className="flex items-center gap-3 text-center md:text-left">
              <span className="text-2xl" role="img">{item.emoji}</span>
              <span className="text-white font-bold text-sm sm:text-base">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════ SECTION 3: AUDIENCE LANES ═══════════════ */}
      <section className="py-14 sm:py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
        <SectionHeader gold="Where Are You in Your Journey?" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {/* Card 1 — Still Serving */}
          <GlassCard>
            <span className="text-4xl mb-5 block" role="img" aria-label="military">🎖️</span>
            <h3 className="text-xl font-bold text-white mb-4">Still Serving?</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              You have 180 days before separation to file a BDD claim — and walk out with a rating and
              a check waiting. Most service members don't know this exists. The ones who do? They build
              their case before they take off the uniform.
            </p>
            <Link to="/claim-tools" className="inline-flex items-center text-[#C8A628] font-bold text-base min-h-[44px] hover:underline active:opacity-80">
              Start Your BDD Claim <span className="ml-1">→</span>
            </Link>
          </GlassCard>

          {/* Card 2 — Just Got Out */}
          <GlassCard>
            <span className="text-4xl mb-5 block" role="img" aria-label="documents">📋</span>
            <h3 className="text-xl font-bold text-white mb-4">Just Got Out?</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              The clock is ticking on your presumptive window. Every condition you don't document now
              gets harder to prove later. Stop Googling symptoms at 2 AM. Start building your case
              with the tools the pros use.
            </p>
            <Link to="/dashboard" className="inline-flex items-center text-[#C8A628] font-bold text-base min-h-[44px] hover:underline active:opacity-80">
              Organize Your Evidence <span className="ml-1">→</span>
            </Link>
          </GlassCard>

          {/* Card 3 — Been Out for Years */}
          <GlassCard>
            <span className="text-4xl mb-5 block" role="img" aria-label="flag">🇺🇸</span>
            <h3 className="text-xl font-bold text-white mb-4">10, 20, 30+ Years Out?</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              New presumptive conditions get added every year. The PACT Act alone opened the door for
              millions. It doesn't matter if you served in Vietnam, Desert Storm, Iraq, or Afghanistan —
              if it's service-connected, it's owed. It's never too late.
            </p>
            <Link to="/conditions" className="inline-flex items-center text-[#C8A628] font-bold text-base min-h-[44px] hover:underline active:opacity-80">
              See What You Qualify For <span className="ml-1">→</span>
            </Link>
          </GlassCard>
        </motion.div>
      </section>

      {/* ═══════════════ SECTION 4: THE PROBLEM ═══════════════ */}
      <section className="py-14 sm:py-20 md:py-28 px-4 sm:px-6 bg-black/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-wide text-[#C8A628] leading-tight mb-10 px-4"
          >
            The VA Claims Industry Is a $2 Billion Business Built on Your Confusion
          </motion.h2>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-white/70 text-base sm:text-lg leading-relaxed max-w-[700px] mx-auto space-y-6 mb-14"
          >
            <p>
              Claim sharks charge $4,000 to $6,000 — or take 5x your monthly back pay — for work you
              can do yourself. Cookie-cutter nexus letters get denied. "Consultants" with no medical or
              legal credentials tell you what to file. And the VA? They count on you walking into your
              C&amp;P exam with nothing.
            </p>
            <p className="text-white font-bold text-lg sm:text-xl">
              You don't need a consultant. You need a system.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {[
              { label: 'Claim Shark', price: '$4,000–$6,000', bad: true },
              { label: 'VA Attorney', price: '20–33% of your back pay', bad: true },
              { label: 'Vet Claim Support', price: '$4.99. Once. Forever.', bad: false },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={cardVariant}
                className={`rounded-2xl p-6 border text-center ${
                  item.bad
                    ? 'bg-white/[0.03] border-white/10'
                    : 'bg-[#C8A628]/10 border-[#C8A628]/30'
                }`}
              >
                <p className="text-white/70 text-sm mb-2">{item.label}</p>
                <p className={`font-bold text-lg ${item.bad ? 'text-white' : 'text-[#C8A628]'}`}>{item.price}</p>
                <span className="text-xl mt-2 block">{item.bad ? '❌' : '✅'}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ SECTION 5: THE ARSENAL ═══════════════ */}
      <section className="py-14 sm:py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
        <SectionHeader gold="The Arsenal" sub="Every tool you need to understand, build, and win your claim." />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid sm:grid-cols-2 gap-6"
        >
          <ToolCard
            icon={<Crosshair size={24} />}
            title="MOS Profiler"
            desc="Your military job already qualifies you for conditions you haven't claimed. We map your MOS to every known service-connected condition."
          />
          <ToolCard
            icon={<Shield size={24} />}
            title="Primary Conditions Builder"
            desc="Select your conditions. We pull the 38 CFR rating criteria, show you what the VA is scoring, and tell you exactly what evidence you need to win."
          />
          <ToolCard
            icon={<Brain size={24} />}
            title="Secondary Conditions Engine"
            desc="778+ medically documented connections between conditions. One missed secondary could be worth $400/month for life."
          />
          <ToolCard
            icon={<MapPin size={24} />}
            title="Discovery Body Map"
            desc="Interactive body map — tap where it hurts. See every condition connected to that area and what the VA rates it under."
          />
          <ToolCard
            icon={<Calculator size={24} />}
            title="Rating Calculator (VA Math)"
            desc="VA math isn't regular math. 50% + 30% doesn't equal 80%. See your real combined rating — including bilateral factor — before you file."
          />
          <ToolCard
            icon={<Search size={24} />}
            title="Nexus Discovery"
            desc="Find the medical and scientific evidence that connects your conditions to your service. The nexus is where claims are won or lost."
          />
          <ToolCard
            icon={<FileText size={24} />}
            title="Decision Letter Auditor"
            desc="Already denied? Paste your decision letter. We find exactly where the VA got it wrong and show you how to fight it."
          />
          <ToolCard
            icon={<Clock size={24} />}
            title="ITF Sentinel (Intent to File Tracker)"
            desc="Your Intent to File locks in your effective date for 12 months. We track it, remind you, and make sure you never lose a dollar of back pay."
          />
        </motion.div>
      </section>

      {/* ═══════════════ SECTION 6: DAILY EVIDENCE MACHINE ═══════════════ */}
      <section className="py-14 sm:py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
        <SectionHeader
          gold="Your Daily Evidence Machine"
          sub="The VA doesn't deny veterans with organized evidence. They deny veterans who walk in empty-handed."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid sm:grid-cols-2 gap-6"
        >
          <ToolCard
            icon={<Activity size={24} />}
            title="Daily Symptom Log"
            desc="Track severity, frequency, and impact on your life — every single day. The VA rates on consistency, not one bad day. Build the pattern that proves it's chronic."
          />
          <ToolCard
            icon={<Flame size={24} />}
            title="Flare-Up Journal"
            desc="When it spikes, capture it in real time. Timestamp. Severity. What you couldn't do. This is exactly what C&P examiners ask about — and what veterans can never remember."
          />
          <ToolCard
            icon={<Moon size={24} />}
            title="Pain & Sleep Tracker"
            desc={'Chronic means chronic. Weeks and months of pain and sleep data that prove your conditions aren\'t "improving" — no matter what the VA wants to believe.'}
          />
          <ToolCard
            icon={<Pill size={24} />}
            title="Medication Vault"
            desc="Every prescription, every OTC, every dosage change, every side effect. Organized and formatted for your C&P examiner to review in seconds."
          />
          <ToolCard
            icon={<ClipboardList size={24} />}
            title="Activity & Impact Log"
            desc={'Missed work. Couldn\'t drive. Skipped your kid\'s game. Couldn\'t get out of bed. This is the evidence that turns "not disabling" into a compensable rating.'}
          />
        </motion.div>
      </section>

      {/* ═══════════════ SECTION 7: BATTLE PREP ═══════════════ */}
      <section className="py-14 sm:py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
        <SectionHeader
          gold="Battle Prep"
          sub="You wouldn't walk into a job interview unprepared. Don't walk into the exam that decides your financial future with nothing."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid sm:grid-cols-2 gap-6"
        >
          <ToolCard
            icon={<GraduationCap size={24} />}
            title="C&P Exam Prep"
            desc="Condition-specific prep that shows you exactly what the examiner is scoring, what questions they'll ask, and what answers move the needle."
          />
          <ToolCard
            icon={<MessageSquare size={24} />}
            title="VA-Speak Coach"
            desc={'"I have good days and bad days" gets you lowballed. Learn the language the VA actually scores on. Practice it before you walk in.'}
          />
          <ToolCard
            icon={<Move size={24} />}
            title="ROM Visualizer (Range of Motion)"
            desc="Range of motion is how they rate musculoskeletal conditions. See exactly where your measurements fall on the rating scale — before they measure you."
          />
          <ToolCard
            icon={<Users size={24} />}
            title="Buddy Statement Architect"
            desc={'Guided templates that turn your buddy\'s "yeah he was hurt" into a structured, credible lay statement that actually moves the rater.'}
          />
          <ToolCard
            icon={<FileBarChart size={24} />}
            title="Timeline Builder & Narrative Generator"
            desc="Turn 5, 10, 20 years of medical chaos into one clean chronological narrative the rater can follow from service to present."
          />
          <ToolCard
            icon={<Download size={24} />}
            title="Tactical Evidence Brief (PDF Export)"
            desc="One PDF. Every log entry, every buddy statement, every condition connection, every piece of evidence — packaged and formatted for the rater's desk."
          />
        </motion.div>
      </section>

      {/* ═══════════════ SECTION 8: PRIVACY ═══════════════ */}
      <section className="py-14 sm:py-20 md:py-28 px-4 sm:px-6 bg-black/40">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white leading-tight mb-8"
          >
            We Don't Want Your Data.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-white/70 text-base sm:text-lg leading-relaxed max-w-[600px] mx-auto mb-14"
          >
            No accounts. No cloud. No servers. No sign-ups. Your medical history, your symptoms, your
            conditions, your entire case — all of it stays on your device and nowhere else. We built it
            that way on purpose. Your evidence is yours. Period.
          </motion.p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12"
          >
            {[
              { icon: <Lock size={28} />, label: 'All data stored locally on your device' },
              { icon: <Ban size={28} />, label: 'Zero data collection — ever' },
              { icon: <ShieldCheck size={28} />, label: 'No accounts required' },
            ].map((item, i) => (
              <motion.div key={i} variants={cardVariant} className="flex flex-col items-center gap-3 text-center">
                <div className="p-4 bg-white/5 rounded-2xl text-[#C8A628]">{item.icon}</div>
                <p className="text-white/70 text-sm font-medium max-w-[180px]">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ SECTION 9: PRICING ═══════════════ */}
      <section className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 overflow-hidden">
        {/* gold glow behind price */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#C8A628]/[0.04] blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
            <p className="text-white/60 text-3xl sm:text-4xl md:text-5xl font-bold line-through mb-2">$19.99</p>
            <p className="text-[#C8A628] text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none mb-4">$4.99</p>
            <p className="text-white uppercase text-sm font-bold tracking-widest mb-12">
              Founder's Launch Price — Limited Time
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-4 max-w-md mx-auto mb-12"
          >
            {[
              { text: 'Claim shark: $4,000–$6,000', bad: true },
              { text: 'VA attorney: 20–33% of your back pay', bad: true },
              { text: 'Vet Claim Support: $4.99. Once. Forever.', bad: false },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={cardVariant}
                className="flex items-center justify-between px-6 py-4 rounded-xl bg-white/[0.03] border border-white/10"
              >
                <span className="text-white text-sm sm:text-base">{item.text}</span>
                <span className="text-xl ml-4">{item.bad ? '❌' : '✅'}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-white/60 text-sm mb-10"
          >
            No subscriptions. No upsells. No percentage of your back pay. Ever.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto bg-[#C8A628] text-black font-bold text-base px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(200,166,40,0.4)] hover:scale-[1.02] active:scale-[0.98] min-h-[48px]"
              style={{ textShadow: '1px 1px 0 rgba(0,0,0,1)' }}
            >
              <Apple size={22} />
              Download on the App Store
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto border border-white/20 text-white font-bold text-base px-8 py-4 rounded-xl transition-all duration-200 hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98] min-h-[48px]"
            >
              <Play size={22} />
              Download on Google Play
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ SECTION 10: FOUNDER STORY ═══════════════ */}
      <section className="py-14 sm:py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-wide text-[#C8A628] leading-tight mb-10">
              Built by a Veteran Who Went Through It
            </h2>

            <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-[700px] mb-10">
              I'm a 100% service-connected disabled veteran. I went through the claims process myself —
              the confusion, the denials, the C&amp;P exams, the sharks who wanted thousands of dollars to
              do what I could do with the right tools. I built <em className="text-white italic">Vet Claim Support</em>{' '}
              because no veteran should have to pay a predator to organize what's already theirs. This
              isn't a corporation. It's a weapon — built by a veteran, for veterans.
            </p>

            <p className="text-white/70 font-bold italic">
              — The Founder, <span className="text-[#C8A628] italic">Vet Claim Support</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ SECTION 11: FOOTER ═══════════════ */}
      <footer className="py-10 sm:py-16 px-4 sm:px-6 border-t border-white/5 bg-black/30">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 text-white/60 text-xs leading-relaxed mb-10">
            <p>
              Vet Claim Support is not affiliated with, endorsed by, or sponsored by the U.S. Department
              of Veterans Affairs or any government agency.
            </p>
            <p>
              This application does not provide legal, medical, or financial advice. All content is for
              informational and organizational purposes only.
            </p>
            <p>
              AI-assisted features provide suggestions based on publicly available regulations (38 CFR
              Part 4). Always verify with qualified professionals.
            </p>
            <p>
              Rating estimates are approximations based on published VA criteria and are not guarantees
              of actual VA disability ratings.
            </p>
            <p>
              All user data is stored locally on the user's device. Vet Claim Support does not collect,
              transmit, or store any personal or medical information.
            </p>
            <p>
              Statistics referenced (e.g., secondary condition counts, approval rates) are derived from
              publicly available VA data and medical literature.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
            <div className="flex items-center gap-6 text-white/60 text-xs">
              <Link to="/terms" className="hover:text-white transition-colors min-h-[44px] inline-flex items-center">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-white transition-colors min-h-[44px] inline-flex items-center">Privacy Policy</Link>
              <Link to="/help" className="hover:text-white transition-colors min-h-[44px] inline-flex items-center">Contact</Link>
            </div>
            <p className="text-white/60 text-xs">
              &copy; {new Date().getFullYear()} <span className="italic">Vet Claim Support</span>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
