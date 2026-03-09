import { useState } from 'react';
import { Clock, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

function timeAgo(isoString: string): string {
  const parsed = new Date(isoString).getTime();
  if (isNaN(parsed)) return 'recently';
  const diff = Date.now() - parsed;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

interface DraftRestoredBannerProps {
  lastSaved: string;
  onStartFresh: () => void;
}

export function DraftRestoredBanner({ lastSaved, onStartFresh }: DraftRestoredBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/30 bg-primary/5 text-sm">
      <Clock className="h-4 w-4 text-primary shrink-0" />
      <span className="flex-1 min-w-0 text-muted-foreground">
        Draft restored from{' '}
        <span className="font-medium text-foreground">{timeAgo(lastSaved)}</span>
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 min-h-[44px] text-xs text-muted-foreground hover:text-destructive"
        onClick={onStartFresh}
      >
        <RotateCcw className="h-3 w-3 mr-1" />
        Start Fresh
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 min-h-[44px] min-w-[44px] text-muted-foreground"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss draft restored notification"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
