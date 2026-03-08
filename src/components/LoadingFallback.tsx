import { motion } from 'motion/react';

export function LoadingFallback() {
  return (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-10 rounded-3xl border border-border bg-card text-center"
      >
        <div className="w-14 h-14 border-4 border-muted border-t-gold rounded-full animate-spin mx-auto" />
        <p className="mt-6 text-foreground font-semibold text-lg">
          Loading…
        </p>
        <p className="text-muted-foreground text-sm mt-2">Vet Claim Support</p>
        <div className="h-px w-20 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-10" />
      </motion.div>
    </div>
  );
}

export function RouteLoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="p-10 rounded-3xl border border-border bg-card shadow-2xl text-center max-w-sm"
      >
        <div className="w-14 h-14 border-4 border-muted border-t-gold rounded-full animate-spin mx-auto" />
        <p className="mt-6 text-foreground font-semibold text-lg">
          Loading…
        </p>
        <p className="text-muted-foreground text-sm mt-2">Vet Claim Support</p>
        <div className="h-px w-20 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-10" />
      </motion.div>
    </div>
  );
}
