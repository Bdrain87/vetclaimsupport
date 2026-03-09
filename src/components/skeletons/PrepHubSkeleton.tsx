import { Skeleton } from '@/components/ui/skeleton';

export function PrepHubSkeleton() {
  return (
    <div className="w-full px-4 space-y-4 animate-fade-in pb-4">
      {/* Header + search */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>

      {/* Most used row */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <div className="grid grid-cols-2 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl border border-border">
              <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-2.5 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category sections */}
      {[0, 1, 2].map((s) => (
        <div key={s} className="space-y-2">
          <Skeleton className="h-4 w-28" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl border border-border">
              <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-36" />
                <Skeleton className="h-2.5 w-48" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
