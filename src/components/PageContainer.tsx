import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  /** If true, shows skeleton instead of children. */
  loading?: boolean;
  /** Skeleton component to show while loading. */
  skeleton?: ReactNode;
}

export function PageContainer({ children, className, noPadding = false, loading, skeleton }: PageContainerProps) {
  if (loading && skeleton) {
    return (
      <div
        className={cn('w-full mx-auto overflow-x-hidden')}
        style={{ maxWidth: '100%', boxSizing: 'border-box' }}
      >
        {skeleton}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-full mx-auto overflow-x-hidden',
        !noPadding && 'px-4 pb-24',
        className
      )}
      style={{
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
}
