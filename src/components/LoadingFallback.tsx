import { motion } from 'motion/react';

export function LoadingFallback() {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 rounded-3xl border border-white/10 backdrop-blur-3xl text-center"
      >
        <div className="w-14 h-14 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
        <p className="mt-6 text-white font-semibold tracking-[3px] text-xl">
          HONORING YOUR SERVICE…
        </p>
        <p className="text-white/70 text-sm mt-2">Loading Vet Claim Support</p>
        <div className="h-px w-20 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-10" />
      </motion.div>
    </div>
  );
}

export function RouteLoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card p-10 rounded-3xl border border-white/10 backdrop-blur-3xl shadow-2xl text-center max-w-sm"
      >
        <div className="w-14 h-14 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
        <p className="mt-6 text-white font-semibold tracking-[3px] text-xl">
          HONORING YOUR SERVICE…
        </p>
        <p className="text-white/70 text-sm mt-2">Building your unbreakable claim packet</p>
        <div className="h-px w-20 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-10" />
      </motion.div>
    </div>
  );
}
