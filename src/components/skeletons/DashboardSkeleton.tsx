import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="w-full px-4 space-y-4 animate-fade-in pb-4">
      {/* Alert banner */}
      <Skeleton className="h-14 w-full rounded-2xl" />

      {/* Greeting row */}
      <div className="rounded-2xl border border-border bg-card p-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>

      {/* Rating ring */}
      <div className="rounded-2xl bg-card border border-border p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </div>

      {/* Quick access 2x2 grid */}
      <div className="grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-2xl border border-border">
            <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-2.5 w-14" />
            </div>
          </div>
        ))}
      </div>

      {/* Next steps */}
      <div className="rounded-2xl bg-card border border-border p-4 space-y-3">
        <Skeleton className="h-4 w-28" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-2xl border border-border">
            <Skeleton className="w-7 h-7 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-2.5 w-56" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick log */}
      <div className="rounded-2xl bg-card border border-border p-4 space-y-3">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-3 p-3 rounded-2xl border border-border">
          <Skeleton className="w-7 h-7 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-2.5 w-48" />
          </div>
        </div>
      </div>
    </div>
  );
}
