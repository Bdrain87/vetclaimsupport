import * as React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'rounded';
  animation?: 'pulse' | 'shimmer' | 'none';
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'default', animation = 'pulse', ...props }, ref) => {
    const variantStyles = {
      default: 'rounded-md',
      circular: 'rounded-full',
      rounded: 'rounded-2xl',
    };

    const animationStyles = {
      pulse: 'animate-pulse',
      shimmer: 'skeleton-shimmer',
      none: '',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'bg-muted/60',
          variantStyles[variant],
          animationStyles[animation],
          className
        )}
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';

// Pre-built skeleton patterns
const SkeletonCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6 rounded-2xl border border-border/50 space-y-4', className)}
    {...props}
  >
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12" variant="circular" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-4/6" />
    </div>
  </div>
));
SkeletonCard.displayName = 'SkeletonCard';

const SkeletonStats = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { count?: number }
>(({ className, count = 4, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('grid grid-cols-2 lg:grid-cols-4 gap-4', className)}
    {...props}
  >
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="p-5 rounded-2xl border border-border/50 space-y-3"
      >
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-8 w-1/2" />
      </div>
    ))}
  </div>
));
SkeletonStats.displayName = 'SkeletonStats';

const SkeletonList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { count?: number; showAvatar?: boolean }
>(({ className, count = 5, showAvatar = true, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-3', className)} {...props}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 p-4 rounded-xl border border-border/50"
      >
        {showAvatar && <Skeleton className="h-10 w-10" variant="circular" />}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    ))}
  </div>
));
SkeletonList.displayName = 'SkeletonList';

const SkeletonTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { rows?: number; columns?: number }
>(({ className, rows = 5, columns = 4, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-3', className)} {...props}>
    {/* Header */}
    <div className="flex gap-4 p-4 border-b border-border">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4 p-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            className={cn('h-4 flex-1', colIndex === 0 && 'w-1/4 flex-none')}
          />
        ))}
      </div>
    ))}
  </div>
));
SkeletonTable.displayName = 'SkeletonTable';

const SkeletonText = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { lines?: number }
>(({ className, lines = 3, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-2', className)} {...props}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn(
          'h-4',
          i === lines - 1 ? 'w-3/4' : 'w-full'
        )}
      />
    ))}
  </div>
));
SkeletonText.displayName = 'SkeletonText';

const SkeletonForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { fields?: number }
>(({ className, fields = 4, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-6', className)} {...props}>
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    ))}
    <Skeleton className="h-10 w-32 rounded-lg mt-4" />
  </div>
));
SkeletonForm.displayName = 'SkeletonForm';

// Page-level skeletons
const SkeletonPage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-8', className)} {...props}>
    {/* Header */}
    <div className="space-y-2">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    {/* Stats */}
    <SkeletonStats />
    {/* Content */}
    <div className="grid md:grid-cols-2 gap-6">
      <SkeletonCard />
      <SkeletonCard />
    </div>
    <SkeletonList count={3} />
  </div>
));
SkeletonPage.displayName = 'SkeletonPage';

export {
  Skeleton,
  SkeletonCard,
  SkeletonStats,
  SkeletonList,
  SkeletonTable,
  SkeletonText,
  SkeletonForm,
  SkeletonPage,
};
