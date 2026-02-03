import { useEffect } from 'react';
import { Milestone } from '@/hooks/useMilestones';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl shadow-2xl shadow-amber-500/30 p-4 pr-12 flex items-center gap-4 min-w-[300px] max-w-[400px]">
        {/* Confetti background effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute -top-1 -left-1 text-2xl animate-bounce" style={{ animationDelay: '0ms' }}>✨</div>
          <div className="absolute -top-1 -right-8 text-2xl animate-bounce" style={{ animationDelay: '100ms' }}>🎉</div>
          <div className="absolute -bottom-1 -left-2 text-xl animate-bounce" style={{ animationDelay: '200ms' }}>⭐</div>
        </div>

        {/* Badge icon */}
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl">
            {milestone.icon}
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
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
