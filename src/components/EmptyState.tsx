import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { fadeInUp } from '@/constants/animations';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  /** VA-specific context explaining why this data matters for claims. */
  whyItMatters?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, whyItMatters, actionLabel, onAction }: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="mb-4 text-muted-foreground/40">{icon}</div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-2">{description}</p>
      {whyItMatters && (
        <p className="text-xs text-primary/80 max-w-xs mb-4 bg-primary/5 rounded-xl px-3 py-2">
          {whyItMatters}
        </p>
      )}
      {!whyItMatters && <div className="mb-2" />}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
