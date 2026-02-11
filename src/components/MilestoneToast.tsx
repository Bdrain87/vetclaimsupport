import { useEffect } from 'react';
import { Milestone } from '@/hooks/useMilestones';
import { X, Sparkles, PartyPopper, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { milestoneIconMap } from '@/components/MilestoneBadge';

interface MilestoneToastProps {
  milestone: Milestone;
  onClose: () => void;
  autoClose?: number; // milliseconds
}

export function MilestoneToast({ milestone, onClose, autoClose = 5000 }: MilestoneToastProps) {
  useEffect(() => {
    if (autoClose > 0) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-[image:var(--gold-gradient)] text-white rounded-2xl shadow-2xl shadow-[0_8px_32px_var(--gold-glow)] p-4 pr-12 flex items-center gap-4 min-w-0 w-[calc(100vw-2rem)] sm:min-w-[300px] sm:max-w-[400px]">
        {/* Confetti background effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute -top-1 -left-1 animate-bounce" style={{ animationDelay: '0ms' }}><Sparkles className="h-5 w-5 text-gold-hl" /></div>
          <div className="absolute -top-1 -right-8 animate-bounce" style={{ animationDelay: '100ms' }}><PartyPopper className="h-5 w-5 text-gold-hl" /></div>
          <div className="absolute -bottom-1 -left-2 animate-bounce" style={{ animationDelay: '200ms' }}><Star className="h-4 w-4 text-gold-hl" /></div>
        </div>

        {/* Badge icon */}
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-[var(--gold-dk)]/30 backdrop-blur flex items-center justify-center">
            {(() => {
              const IconComponent = milestoneIconMap[milestone.icon];
              return IconComponent ? <IconComponent className="h-7 w-7 text-white" /> : null;
            })()}
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
            <span className="text-xs">✓</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white/80 uppercase tracking-wide">
            Achievement Unlocked!
          </p>
          <p className="font-bold text-lg truncate">{milestone.title}</p>
          <p className="text-sm text-white/90 truncate">{milestone.description}</p>
        </div>

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 text-white/80 hover:text-white hover:bg-white/20"
          onClick={onClose}
          aria-label="Close milestone notification"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
