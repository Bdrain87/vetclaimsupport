import { useProfileStore } from '@/store/useProfileStore';
import { Cloud, CloudOff } from 'lucide-react';
import { useState, useEffect } from 'react';

function formatTimeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Never synced';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function SyncStatusBadge({ className }: { className?: string }) {
  const lastSyncedAt = useProfileStore((s) => s.lastSyncedAt);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const timeAgo = formatTimeAgo(lastSyncedAt);

  return (
    <div className={`flex items-center gap-1.5 text-[10px] text-muted-foreground ${className || ''}`}>
      {isOnline ? (
        <Cloud className="h-3 w-3" />
      ) : (
        <CloudOff className="h-3 w-3 text-gold" />
      )}
      <span>{isOnline ? `Synced ${timeAgo}` : 'Offline'}</span>
    </div>
  );
}
