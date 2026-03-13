/**
 * What Next Card — Shows 1-3 prioritized next actions after completing
 * a primary action. Eliminates dead ends.
 */

import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import type { NextAction } from '@/utils/whatNext';

interface WhatNextCardProps {
  actions: NextAction[];
  className?: string;
}

export function WhatNextCard({ actions, className }: WhatNextCardProps) {
  const navigate = useNavigate();

  if (actions.length === 0) return null;

  return (
    <div className={className}>
      <div className="flex items-center gap-1.5 mb-2">
        <Zap className="h-3.5 w-3.5 text-gold" />
        <span className="text-xs font-semibold text-foreground uppercase tracking-wider">What&apos;s Next</span>
      </div>
      <div className="space-y-1.5">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => navigate(action.route)}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-border hover:border-gold/40 hover:bg-gold/5 transition-colors text-left"
          >
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground block">{action.label}</span>
              <span className="text-xs text-muted-foreground block truncate">{action.description}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gold shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
