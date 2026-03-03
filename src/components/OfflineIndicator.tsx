import { useState, useEffect } from 'react';
import { WifiOff, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getOfflineQueueCount } from '@/services/syncEngine';

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    const goOffline = () => {
      setIsOffline(true);
      setQueueCount(getOfflineQueueCount());
    };
    const goOnline = () => setIsOffline(false);

    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);

    // Check queue count periodically while offline
    const interval = setInterval(() => {
      if (!navigator.onLine) {
        setQueueCount(getOfflineQueueCount());
      }
    }, 5000);

    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
      clearInterval(interval);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2',
        'bg-muted/95 backdrop-blur-sm border-b border-border',
        'px-4 py-2 text-xs text-muted-foreground',
        'animate-fade-in',
      )}
      role="status"
      aria-live="polite"
    >
      <WifiOff className="h-3.5 w-3.5" />
      <span>You&apos;re offline. Your data is saved locally.</span>
      {queueCount > 0 && (
        <span className="flex items-center gap-1 text-primary">
          <Upload className="h-3 w-3" />
          {queueCount} pending
        </span>
      )}
    </div>
  );
}
