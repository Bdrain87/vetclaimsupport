import { useSyncStatus } from '@/hooks/useSyncStatus';
import { Loader2 } from 'lucide-react';

export function SyncStatusIndicator() {
  const { status, syncNow } = useSyncStatus();

  const statusConfig = {
    synced: {
      color: 'bg-emerald-400',
      label: 'Synced',
    },
    syncing: {
      color: 'bg-gold',
      label: 'Syncing...',
    },
    offline: {
      color: 'bg-gray-400',
      label: 'Offline',
    },
    error: {
      color: 'bg-red-400',
      label: 'Sync error',
    },
  };

  const config = statusConfig[status];

  return (
    <button
      onClick={syncNow}
      className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/5 transition-colors"
      title={config.label}
    >
      {status === 'syncing' ? (
        <Loader2 className="h-2.5 w-2.5 text-gold animate-spin" />
      ) : (
        <div className={`h-2.5 w-2.5 rounded-full ${config.color}`} />
      )}
      <span className="text-[10px] text-white/40 hidden sm:inline">{config.label}</span>
    </button>
  );
}
