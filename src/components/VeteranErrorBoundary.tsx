import { motion } from 'motion/react';
import { Button } from './ui/button';
import { impactMedium } from '@/lib/haptics';

interface Props {
  error: Error;
  resetErrorBoundary: () => void;
}

export function VeteranErrorBoundary({ error, resetErrorBoundary }: Props) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-2xl border border-white/10 backdrop-blur-xl max-w-md"
      >
        <h2 className="text-2xl font-bold text-white mb-4">We've Got Your Back</h2>
        <p className="text-white/80 mb-6">An unexpected issue occurred. Your data is safe — let's get back to your claim.</p>
        <p className="text-red-400/80 mb-6 text-sm">{error.message}</p>
        <Button
          onClick={() => { impactMedium(); resetErrorBoundary(); }}
          className="bg-amber-600 hover:bg-amber-500 text-white font-semibold"
        >
          Retry Mission
        </Button>
      </motion.div>
    </div>
  );
}
