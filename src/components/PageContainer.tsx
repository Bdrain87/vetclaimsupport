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
        !noPadding && 'px-4',
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
