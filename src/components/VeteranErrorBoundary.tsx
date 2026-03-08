import { motion } from 'motion/react';
import { Button } from './ui/button';
import { impactMedium } from '@/lib/haptics';

interface Props {
  error: Error;
  resetErrorBoundary: () => void;
}

export function VeteranErrorBoundary({ error, resetErrorBoundary }: Props) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-2xl border border-border bg-card max-w-md"
      >
        <h2 className="text-2xl font-bold text-foreground mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">An unexpected error occurred. Your data is safe.</p>
        <p className="text-red-400/80 mb-6 text-sm font-mono">{error.message}</p>
        <Button
          onClick={() => { impactMedium(); resetErrorBoundary(); }}
          className="bg-gold hover:bg-gold/80 text-black font-semibold"
        >
          Try Again
        </Button>
      </motion.div>
    </div>
  );
}
