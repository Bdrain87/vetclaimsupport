import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function PageContainer({ children, className, noPadding = false }: PageContainerProps) {
  return (
    <div
      className={cn(
        'w-full mx-auto overflow-x-hidden',
        className
      )}
      style={{
        maxWidth: 'min(42rem, 100%)',
        paddingLeft: noPadding ? undefined : 'max(1rem, env(safe-area-inset-left, 1rem))',
        paddingRight: noPadding ? undefined : 'max(1rem, env(safe-area-inset-right, 1rem))',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
}
