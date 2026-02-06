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
  Award,
  Scale,
  Flag,
  Check,
  X,
} from 'lucide-react';

/* ─── animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

/* ─── gold gradient text style ─── */
const goldGradientStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #C8A628 0%, #E8D48B 50%, #C8A628 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

/* ─── comparison icons ─── */
function GreenCheck({ size = 7 }: { size?: number }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-full bg-emerald-500/20 flex-shrink-0 ${size === 8 ? 'w-8 h-8' : 'w-7 h-7'}`}>
      <Check size={size === 8 ? 18 : 16} className="text-emerald-400" strokeWidth={3} />
    </span>
  );
}

function RedX() {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 flex-shrink-0">
      <X size={14} className="text-red-400" strokeWidth={3} />
    </span>
  );
}

/* ─── reusable section header ─── */
function SectionHeader({ gold, sub }: { gold: string; sub?: string }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center mb-8 md:mb-12 px-4">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-wide leading-tight" style={goldGradientStyle}>
        {gold}
      </h2>
      {sub && (
        <p className="mt-3 md:mt-4 text-white/70 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
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
      className={`bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-lg shadow-black/20 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-[#C8A628]/10 hover:border-[#C8A628]/30 hover:-translate-y-1 ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ─── tool / log card with premium gold icon ─── */
function ToolCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <GlassCard>
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C8A628]/20 to-[#C8A628]/5 border border-[#C8A628]/30 flex items-center justify-center shadow-lg shadow-[#C8A628]/10 mb-5 transition-all duration-300 group-hover:shadow-[#C8A628]/20 group-hover:border-[#C8A628]/50 group-hover:scale-105">
        <span className="text-[#C8A628]">{icon}</span>
      </div>
      <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
      <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
    </GlassCard>
  );
}

/* ─── gold icon circle (for audience lanes) ─── */
function GoldIconCircle({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#C8A628]/40 bg-[#C8A628]/10 text-[#C8A628] mb-5">
      {children}
    </div>
  );
}

/* ─── Apple App Store badge (standard black/white) ─── */
function AppStoreBadge() {
  return (
    <Link to="/dashboard" className="inline-flex items-center gap-2.5 bg-black border border-white/20 rounded-xl px-5 py-2.5 hover:bg-white/10 transition-colors min-h-[48px]">
      <svg viewBox="0 0 384 512" width="20" height="24" fill="white" aria-hidden="true">
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
      </svg>
      <div className="text-left">
        <p className="text-white/70 text-[10px] leading-none">Download on the</p>
        <p className="text-white font-semibold text-base leading-tight">App Store</p>
      </div>
    </Link>
  );
}

/* ─── Google Play badge (standard black/white) ─── */
function GooglePlayBadge() {
  return (
    <Link to="/dashboard" className="inline-flex items-center gap-2.5 bg-black border border-white/20 rounded-xl px-5 py-2.5 hover:bg-white/10 transition-colors min-h-[48px]">
      <svg viewBox="0 0 512 512" width="22" height="24" fill="none" aria-hidden="true">
        <path d="M48 59.5v393a28.1 28.1 0 0 0 16.4 25.6l225.7-225.5L64.4 27.1A28.6 28.6 0 0 0 48 59.5z" fill="#4285F4"/>
        <path d="M290.1 252.6l62.8-62.8L99.6 57.4a28 28 0 0 0-35.2-30.3l225.7 225.5z" fill="#34A853"/>
        <path d="M290.1 252.6L64.4 478.1a28 28 0 0 0 35.2-30.3l253.3-132.4-62.8-62.8z" fill="#FBBC04"/>
        <path d="M464 252.6c0-10.7-5.9-20.5-15.4-25.6l-95.8-50-62.8 62.8 62.8 62.8 95.8-50c9.5-5.1 15.4-14.9 15.4-25.6v-.4z" fill="#EA4335"/>
      </svg>
      <div className="text-left">
        <p className="text-white/70 text-[10px] leading-none uppercase tracking-wider">Get it on</p>
        <p className="text-white font-semibold text-base leading-tight">Google Play</p>
      </div>
    </Link>
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
      <section className="relative flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-16 sm:min-h-[100dvh]">
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
          className="relative mt-5 sm:mt-8 text-white/70 text-base sm:text-lg md:text-xl max-w-[600px] leading-relaxed px-2"
        >
          Whether you're still in uniform, just got your DD-214, or haven't touched your claim
          in 30 years — this is the tool that puts YOU in control of your claim.
        </motion.p>

        {/* Hero pricing card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="relative mt-8 sm:mt-10 w-full max-w-sm"
        >
          <div className="relative bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/30">
            {/* SALE badge */}
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute -top-3 -right-3 bg-[#22C55E] text-white font-bold text-xs px-3 py-1 rounded-lg -rotate-[15deg] shadow-lg shadow-green-500/30 z-10"
            >
              SALE
            </motion.span>

            <div className="flex items-baseline justify-center gap-3 mb-1">
              <span className="text-white/50 line-through text-xl">$19.99</span>
              <span className="text-5xl sm:text-6xl font-black" style={goldGradientStyle}>$4.99</span>
            </div>
            <p className="text-white/60 text-sm mb-6 text-center">Limited Time Launch Price</p>

            <Link
              to="/dashboard"
              className="block w-full bg-[#C8A628] hover:bg-[#D4B632] text-[#102039] font-bold text-lg py-3.5 rounded-xl transition-all duration-300 text-center hover:shadow-[0_0_30px_rgba(200,166,40,0.4)] active:scale-[0.98] min-h-[48px]"
            >
              Get Started Now →
            </Link>
          </div>

          {/* App Store badge */}
          <div className="flex justify-center mt-4 sm:mt-5">
            <AppStoreBadge />
          </div>
        </motion.div>

        {/* scroll indicator — desktop only */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="hidden sm:block absolute bottom-10"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
            <ChevronDown className="text-white/50" size={28} aria-hidden="true" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════ SECTION 2: TRUST BAR ═══════════════ */}
      <section className="py-6 sm:py-10 px-4 sm:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-5xl mx-auto bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-16 shadow-lg shadow-black/20"
        >
          {[
            { icon: <Award size={24} />, text: 'Built by a 100% Disabled Veteran' },
            { icon: <ClipboardList size={24} />, text: '800+ VA Conditions Covered' },
            { icon: <Scale size={24} />, text: '38 CFR Part 4 Intelligence Built In' },
          ].map((item, i) => (
            <motion.div key={i} variants={cardVariant} className="flex items-center gap-3 text-center md:text-left">
              <span className="text-[#C8A628] flex-shrink-0">{item.icon}</span>
              <span className="text-white font-bold text-sm sm:text-base">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════ SECTION 3: AUDIENCE LANES ═══════════════ */}
      <section className="py-10 sm:py-12 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <SectionHeader gold="Where Are You in Your Journey?" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-6 md:gap-8"
        >
          {/* Card 1 — Still Serving */}
          <GlassCard>
            <GoldIconCircle><Shield size={24} /></GoldIconCircle>
            <h3 className="text-xl font-bold text-white mb-4">Still Serving?</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              You have 180 days before separation to file a BDD claim — and walk out with a rating and
              a check waiting. Most service members don't know this exists. The ones who do? They build
              their case before they take off the uniform.
            </p>
            <Link to="/claim-tools" className="inline-flex items-center text-[#C8A628] font-bold text-base min-h-[44px] group">
              Start Your BDD Claim <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </GlassCard>

          {/* Card 2 — Just Got Out */}
          <GlassCard>
            <GoldIconCircle><FileText size={24} /></GoldIconCircle>
            <h3 className="text-xl font-bold text-white mb-4">Just Got Out?</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              The clock is ticking on your presumptive window. Every condition you don't document now
              gets harder to prove later. Stop Googling symptoms at 2 AM. Start building your case
              with the tools the pros use.
            </p>
            <Link to="/dashboard" className="inline-flex items-center text-[#C8A628] font-bold text-base min-h-[44px] group">
              Organize Your Evidence <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </GlassCard>

          {/* Card 3 — Been Out for Years */}
          <GlassCard>
            <GoldIconCircle><Flag size={24} /></GoldIconCircle>
            <h3 className="text-xl font-bold text-white mb-4">10, 20, 30+ Years Out?</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              New presumptive conditions get added every year. The PACT Act alone opened the door for
              millions. It doesn't matter if you served in Vietnam, Desert Storm, Iraq, or Afghanistan —
              if it's service-connected, it's owed. It's never too late.
            </p>
            <Link to="/conditions" className="inline-flex items-center text-[#C8A628] font-bold text-base min-h-[44px] group">
              See What You Qualify For <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </GlassCard>
        </motion.div>
      </section>

      {/* ═══════════════ SECTION 4: THE PROBLEM ═══════════════ */}
      <section className="py-10 sm:py-12 md:py-20 px-4 sm:px-6 bg-black/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-wide leading-tight mb-8 md:mb-10 px-4"
            style={goldGradientStyle}
          >
            The VA Claims Industry Is a $2 Billion Business Built on Your Confusion
          </motion.h2>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-white/70 text-base sm:text-lg leading-relaxed max-w-[700px] mx-auto space-y-6 mb-10"
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
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto items-stretch"
          >
            {/* Competitor: Claim Shark */}
            <motion.div
              variants={cardVariant}
              className="rounded-2xl p-6 border text-center bg-white/[0.02] border-white/[0.06] opacity-80"
            >
              <p className="text-white/50 text-sm mb-2">Claim Shark</p>
              <p className="font-bold text-lg text-white mb-3">$4,000–$6,000</p>
              <RedX />
            </motion.div>

            {/* Competitor: VA Attorney */}
            <motion.div
              variants={cardVariant}
              className="rounded-2xl p-6 border text-center bg-white/[0.02] border-white/[0.06] opacity-80"
            >
              <p className="text-white/50 text-sm mb-2">VA Attorney</p>
              <p className="font-bold text-lg text-white mb-3">20–33% of your back pay</p>
              <RedX />
            </motion.div>

            {/* WINNER: Vet Claim Support */}
            <motion.div
              variants={cardVariant}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(200,166,40,0.2), 0 0 40px rgba(200,166,40,0.1)',
                  '0 0 30px rgba(200,166,40,0.4), 0 0 60px rgba(200,166,40,0.2)',
                  '0 0 20px rgba(200,166,40,0.2), 0 0 40px rgba(200,166,40,0.1)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative rounded-2xl p-6 border-2 border-[#C8A628] text-center bg-gradient-to-b from-[#C8A628]/10 to-transparent scale-[1.03]"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C8A628] text-[#102039] text-xs font-bold px-4 py-1 rounded-full shadow-lg whitespace-nowrap">
                BEST VALUE
              </div>
              <p className="text-white/70 text-sm mb-2 mt-1">Vet Claim Support</p>
              <p className="font-bold text-xl mb-3" style={goldGradientStyle}>$4.99 Launch Price</p>
              <GreenCheck size={8} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ SECTION 5: THE ARSENAL ═══════════════ */}
      <section className="py-10 sm:py-12 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <SectionHeader gold="The Arsenal" sub="Every tool you need to understand, build, and win your claim." />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid sm:grid-cols-2 gap-5 sm:gap-6"
        >
          <ToolCard
            icon={<Crosshair size={28} />}
            title="MOS Profiler"
            desc="Your military job already qualifies you for conditions you haven't claimed. We map your MOS to every known service-connected condition."
          />
          <ToolCard
            icon={<Shield size={28} />}
            title="Primary Conditions Builder"
            desc="Select your conditions. We pull the 38 CFR rating criteria, show you what the VA is scoring, and tell you exactly what evidence you need to win."
          />
          <ToolCard
            icon={<Brain size={28} />}
            title="Secondary Conditions Engine"
            desc="800+ conditions with 775+ medically documented secondary connections. One missed link could be worth $400/month for life."
          />
          <ToolCard
            icon={<MapPin size={28} />}
            title="Discovery Body Map"
            desc="Interactive body map — tap where it hurts. See every condition connected to that area and what the VA rates it under."
          />
          <ToolCard
            icon={<Calculator size={28} />}
            title="Rating Calculator (VA Math)"
            desc="VA math isn't regular math. 50% + 30% doesn't equal 80%. See your real combined rating — including bilateral factor — before you file."
          />
          <ToolCard
            icon={<Search size={28} />}
            title="Nexus Discovery"
            desc="Find the medical and scientific evidence that connects your conditions to your service. The nexus is where claims are won or lost."
          />
          <ToolCard
            icon={<FileText size={28} />}
            title="Decision Letter Auditor"
            desc="Already denied? Paste your decision letter. We find exactly where the VA got it wrong and show you how to fight it."
          />
          <ToolCard
            icon={<Clock size={28} />}
            title="ITF Sentinel (Intent to File Tracker)"
            desc="Your Intent to File locks in your effective date for 12 months. We track it, remind you, and make sure you never lose a dollar of back pay."
          />
        </motion.div>
      </section>

      {/* ═══════════════ SECTION 6: DAILY EVIDENCE MACHINE ═══════════════ */}
      <section className="py-10 sm:py-12 md:py-20 px-4 sm:px-6 bg-gradient-to-b from-[#0A1628]/40 via-[#0A1628]/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            gold="Your Daily Evidence Machine"
            sub="The VA doesn't deny veterans with organized evidence. They deny veterans who walk in empty-handed."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid sm:grid-cols-2 gap-5 sm:gap-6"
          >
            <ToolCard
              icon={<Activity size={28} />}
              title="Daily Symptom Log"
              desc="Track severity, frequency, and impact on your life — every single day. The VA rates on consistency, not one bad day. Build the pattern that proves it's chronic."
            />
            <ToolCard
              icon={<Flame size={28} />}
              title="Flare-Up Journal"
              desc="When it spikes, capture it in real time. Timestamp. Severity. What you couldn't do. This is exactly what C&P examiners ask about — and what veterans can never remember."
            />
            <ToolCard
              icon={<Moon size={28} />}
              title="Pain & Sleep Tracker"
              desc={'Chronic means chronic. Weeks and months of pain and sleep data that prove your conditions aren\'t "improving" — no matter what the VA wants to believe.'}
            />
            <ToolCard
              icon={<Pill size={28} />}
              title="Medication Vault"
              desc="Every prescription, every OTC, every dosage change, every side effect. Organized and formatted for your C&P examiner to review in seconds."
            />
            <ToolCard
              icon={<ClipboardList size={28} />}
              title="Activity & Impact Log"
              desc={'Missed work. Couldn\'t drive. Skipped your kid\'s game. Couldn\'t get out of bed. This is the evidence that turns "not disabling" into a compensable rating.'}
            />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ SECTION 7: BATTLE PREP ═══════════════ */}
      <section className="py-10 sm:py-12 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <SectionHeader
          gold="Battle Prep"
          sub="You wouldn't walk into a job interview unprepared. Don't walk into the exam that decides your financial future with nothing."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid sm:grid-cols-2 gap-5 sm:gap-6"
        >
          <ToolCard
            icon={<GraduationCap size={28} />}
            title="C&P Exam Prep"
            desc="Condition-specific prep that shows you exactly what the examiner is scoring, what questions they'll ask, and what answers move the needle."
          />
          <ToolCard
            icon={<MessageSquare size={28} />}
            title="VA-Speak Coach"
            desc={'"I have good days and bad days" gets you lowballed. Learn the language the VA actually scores on. Practice it before you walk in.'}
          />
          <ToolCard
            icon={<Move size={28} />}
            title="ROM Visualizer (Range of Motion)"
            desc="Range of motion is how they rate musculoskeletal conditions. See exactly where your measurements fall on the rating scale — before they measure you."
          />
          <ToolCard
            icon={<Users size={28} />}
            title="Buddy Statement Architect"
            desc={'Guided templates that turn your buddy\'s "yeah he was hurt" into a structured, credible lay statement that actually moves the rater.'}
          />
          <ToolCard
            icon={<FileBarChart size={28} />}
            title="Timeline Builder & Narrative Generator"
            desc="Turn 5, 10, 20 years of medical chaos into one clean chronological narrative the rater can follow from service to present."
          />
          <ToolCard
            icon={<Download size={28} />}
            title="Tactical Evidence Brief (PDF Export)"
            desc="One PDF. Every log entry, every buddy statement, every condition connection, every piece of evidence — packaged and formatted for the rater's desk."
          />
        </motion.div>
      </section>

      {/* ═══════════════ SECTION 8: PRIVACY ═══════════════ */}
      <section className="py-10 sm:py-12 md:py-20 px-4 sm:px-6 bg-black/40">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white leading-tight mb-6 sm:mb-8"
          >
            We Don't Want Your Data.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-white/70 text-base sm:text-lg leading-relaxed max-w-[600px] mx-auto mb-8 sm:mb-10"
          >
            No accounts. No cloud. No servers. No sign-ups. Your medical history, your symptoms, your
            conditions, your entire case — all of it stays on your device and nowhere else. We built it
            that way on purpose. Your evidence is yours. Period.
          </motion.p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12"
          >
            {[
              { icon: <Lock size={32} />, label: 'All data stored locally on your device' },
              { icon: <Ban size={32} />, label: 'Zero data collection — ever' },
              { icon: <ShieldCheck size={32} />, label: 'No accounts required' },
            ].map((item, i) => (
              <motion.div key={i} variants={cardVariant} className="flex flex-col items-center gap-3 text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-white/5 rounded-2xl text-[#C8A628] border border-white/[0.08]">{item.icon}</div>
                <p className="text-white/70 text-sm font-medium max-w-[180px]">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ SECTION 9: PRICING ═══════════════ */}
      <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 overflow-hidden">
        {/* gold glow behind price */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#C8A628]/[0.04] blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <p className="text-white/60 text-3xl sm:text-4xl md:text-5xl font-bold line-through mb-2">$19.99</p>
            <p className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none mb-4" style={goldGradientStyle}>$4.99</p>
            <p className="text-white uppercase text-sm font-bold tracking-widest mb-10 sm:mb-12">
              Limited Time Launch Price
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-3 sm:space-y-4 max-w-md mx-auto mb-10 sm:mb-12"
          >
            {[
              { text: 'Claim shark: $4,000–$6,000', bad: true },
              { text: 'VA attorney: 20–33% of your back pay', bad: true },
              { text: 'Vet Claim Support: $4.99 Launch Price', bad: false },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={cardVariant}
                className={`flex items-center justify-between px-5 sm:px-6 py-3 sm:py-4 rounded-xl border ${
                  item.bad
                    ? 'bg-white/[0.02] border-white/[0.06]'
                    : 'bg-[#C8A628]/10 border-[#C8A628]/30'
                }`}
              >
                <span className={`text-sm sm:text-base ${item.bad ? 'text-white/70' : 'text-white font-semibold'}`}>{item.text}</span>
                <span className="ml-4">{item.bad ? <RedX /> : <GreenCheck size={8} />}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-white/60 text-sm mb-8 sm:mb-10"
          >
            No subscriptions. No upsells. No percentage of your back pay. Ever.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <AppStoreBadge />
            <GooglePlayBadge />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ SECTION 10: FOUNDER STORY ═══════════════ */}
      <section className="py-10 sm:py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-wide leading-tight mb-8 md:mb-10" style={goldGradientStyle}>
              Built by a Veteran Who Went Through It
            </h2>

            <div className="border-l-4 border-[#C8A628]/60 pl-6 sm:pl-8">
              <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-[700px] mb-6 sm:mb-8">
                I'm a 100% service-connected disabled veteran. I went through the claims process myself —
                the confusion, the denials, the C&amp;P exams, the sharks who wanted thousands of dollars to
                do what I could do with the right tools. I built <em className="text-white italic">Vet Claim Support</em>{' '}
                because no veteran should have to pay a predator to organize what's already theirs. This
                isn't a corporation. It's a weapon — built by a veteran, for veterans.
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C8A628]/20 border border-[#C8A628]/40 flex items-center justify-center text-[#C8A628] font-bold text-sm">
                  BD
                </div>
                <p className="text-white/70 font-bold">
                  — Blake Drain, <span className="text-[#C8A628]">Vet Claim Support</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ SECTION 11: FOOTER ═══════════════ */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-white/5 bg-black/30">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-3 sm:space-y-4 text-white/40 text-xs leading-relaxed mb-8 sm:mb-10">
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

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 sm:pt-8 border-t border-white/5">
            <div className="flex items-center gap-6 text-white/40 text-xs">
              <Link to="/terms" className="hover:text-white transition-colors min-h-[44px] inline-flex items-center">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-white transition-colors min-h-[44px] inline-flex items-center">Privacy Policy</Link>
              <Link to="/help" className="hover:text-white transition-colors min-h-[44px] inline-flex items-center">Contact</Link>
            </div>
            <p className="text-white/40 text-xs">
              &copy; {new Date().getFullYear()} <span className="italic">Vet Claim Support</span>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
