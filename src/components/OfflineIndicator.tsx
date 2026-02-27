import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);

    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);

    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
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
    </div>
  );
}
