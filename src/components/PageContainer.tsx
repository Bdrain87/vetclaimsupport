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
        'w-full max-w-2xl mx-auto',
        !noPadding && 'px-4',
        className
      )}
    >
      {children}
    </div>
  );
}
