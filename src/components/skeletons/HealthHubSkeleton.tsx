import { Skeleton } from '@/components/ui/skeleton';

export function HealthHubSkeleton() {
  return (
    <div className="w-full px-4 space-y-4 animate-fade-in pb-4">
      {/* Header */}
      <Skeleton className="h-6 w-28" />

      {/* Quick stats row */}
      <div className="flex gap-2">
        <Skeleton className="h-16 flex-1 rounded-2xl" />
        <Skeleton className="h-16 flex-1 rounded-2xl" />
      </div>

      {/* Health tracking cards grid */}
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="rounded-2xl bg-card border border-border p-4 space-y-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Summary/Timeline links */}
      <div className="space-y-2">
        <Skeleton className="h-14 w-full rounded-2xl" />
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
    </div>
  );
}
