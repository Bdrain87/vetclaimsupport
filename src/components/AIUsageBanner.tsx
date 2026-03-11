import { useAIUsageStore } from '@/services/aiUsageTracker';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export function AIUsageBanner() {
  const { used, limit } = useAIUsageStore();

  if (limit <= 0) return null;

  const percentage = Math.min(100, Math.round((used / limit) * 100));

  if (percentage < 80) return null;

  const isBlocked = used >= limit;
  const resetDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
    .toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  if (isBlocked) {
    return (
      <div className="mx-4 mb-3 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm">
        <div className="flex items-center gap-2 text-destructive font-medium">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Monthly AI limit reached. Resets {resetDate}.
        </div>
        <Link to="/settings" className="text-xs text-destructive/70 hover:underline mt-1 inline-block">
          View usage in Settings
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-4 mb-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 px-4 py-3 text-sm">
      <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-medium">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        You've used {percentage}% of your AI calls this month ({used}/{limit})
      </div>
      <Link to="/settings" className="text-xs text-yellow-600/70 dark:text-yellow-400/70 hover:underline mt-1 inline-block">
        View usage in Settings
      </Link>
    </div>
  );
}
