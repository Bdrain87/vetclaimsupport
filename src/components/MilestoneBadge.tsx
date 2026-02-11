import { Milestone } from '@/hooks/useMilestones';
import {
  Star, Calendar, Trophy, FileText, Zap, File, Folder, FolderOpen,
  Users, Users2, CheckCircle, Target, Award, Calculator, Bot, Save,
  BookOpen, Medal, PartyPopper, Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// eslint-disable-next-line react-refresh/only-export-components
export const milestoneIconMap: Record<string, LucideIcon> = {
  Star,
  Calendar,
  Trophy,
  FileText,
  Zap,
  File,
  Folder,
  FolderOpen,
  Users,
  Users2,
  CheckCircle,
  Target,
  Award,
  Calculator,
  Bot,
  Save,
  BookOpen,
  Medal,
  PartyPopper,
};

interface MilestoneBadgeProps {
  milestone: Milestone;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  className?: string;
}

export function MilestoneBadge({
  milestone,
  size = 'md',
  showProgress = true,
  className,
}: MilestoneBadgeProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  };

  const progress = milestone.isUnlocked
    ? 100
    : Math.min(100, Math.round(((milestone.current ?? 0) / milestone.requirement) * 100));

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div
        className={cn(
          'relative rounded-full flex items-center justify-center',
          'transition-all duration-300',
          sizeClasses[size],
          milestone.isUnlocked
            ? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/30'
            : 'bg-muted border-2 border-dashed border-muted-foreground/30'
        )}
      >
        {/* Progress ring for locked badges */}
        {!milestone.isUnlocked && showProgress && progress > 0 && (
          <svg
            className="absolute inset-0 -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-primary/30"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={`${progress * 2.89} 289`}
              className="text-primary transition-all duration-500"
            />
          </svg>
        )}

        {/* Icon */}
        <span
          className={cn(
            'relative z-10',
            !milestone.isUnlocked && 'grayscale opacity-50'
          )}
        >
          {(() => {
            const IconComponent = milestoneIconMap[milestone.icon];
            return IconComponent ? <IconComponent className="h-6 w-6" /> : null;
          })()}
        </span>

        {/* Unlocked sparkle */}
        {milestone.isUnlocked && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow">
            <Sparkles className="h-3 w-3 text-blue-500" />
          </div>
        )}
      </div>

      {/* Title and description */}
      <div className="text-center">
        <p
          className={cn(
            'font-medium text-sm',
            milestone.isUnlocked ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {milestone.title}
        </p>
        {showProgress && !milestone.isUnlocked && (
          <p className="text-xs text-muted-foreground">
            {milestone.current ?? 0} / {milestone.requirement}
          </p>
        )}
        {milestone.isUnlocked && milestone.unlockedAt && (
          <p className="text-xs text-muted-foreground">
            Unlocked {new Date(milestone.unlockedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}

// Grid of milestone badges
interface MilestoneGridProps {
  milestones: Milestone[];
  columns?: number;
}

export function MilestoneGrid({ milestones, columns = 4 }: MilestoneGridProps) {
  return (
    <div
      className="grid gap-6"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {milestones.map((milestone) => (
        <MilestoneBadge key={milestone.id} milestone={milestone} />
      ))}
    </div>
  );
}
