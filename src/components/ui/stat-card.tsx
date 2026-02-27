import * as React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAnimatedCounter } from './stat-card.hooks';

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number | string;
  suffix?: string;
  prefix?: string;
  trend?: {
    value: number;
    label?: string;
  };
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      label,
      value,
      suffix,
      prefix,
      trend,
      icon,
      variant = 'default',
      size = 'md',
      animate = true,
      ...props
    },
    ref
  ) => {
    const numericValue = typeof value === 'number' ? value : parseInt(value) || 0;
    const animatedValue = useAnimatedCounter(numericValue, 1200, animate);
    const displayValue = animate && typeof value === 'number' ? animatedValue : value;

    const variantStyles = {
      default: 'bg-card border border-border/50',
      primary: 'bg-primary/5 border border-primary/20',
      success: 'bg-green-500/5 border border-green-500/20',
      warning: 'bg-gold/5 border border-gold/20',
      muted: 'bg-muted/50 border border-border/30',
    };

    const valueStyles = {
      default: 'text-foreground',
      primary: 'text-primary',
      success: 'text-green-600 dark:text-green-500',
      warning: 'text-gold-dk dark:text-gold',
      muted: 'text-muted-foreground',
    };

    const sizeStyles = {
      sm: { card: 'p-4', value: 'text-2xl', label: 'text-xs' },
      md: { card: 'p-5', value: 'text-3xl', label: 'text-sm' },
      lg: { card: 'p-6', value: 'text-4xl', label: 'text-base' },
    };

    const trendDirection = trend
      ? trend.value > 0
        ? 'up'
        : trend.value < 0
        ? 'down'
        : 'neutral'
      : null;

    const trendStyles = {
      up: 'text-green-600 dark:text-green-500 bg-green-500/10',
      down: 'text-red-600 dark:text-red-500 bg-red-500/10',
      neutral: 'text-muted-foreground bg-muted/50',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-300 ease-out',
          'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5',
          variantStyles[variant],
          sizeStyles[size].card,
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                'text-muted-foreground font-medium mb-1.5',
                sizeStyles[size].label
              )}
            >
              {label}
            </p>
            <p
              className={cn(
                'font-bold tabular-nums tracking-tight',
                valueStyles[variant],
                sizeStyles[size].value
              )}
            >
              {prefix}
              {typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}
              {suffix}
            </p>
            {trend && (
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                    trendDirection && trendStyles[trendDirection]
                  )}
                >
                  {trendDirection === 'up' && <TrendingUp className="h-3 w-3" />}
                  {trendDirection === 'down' && <TrendingDown className="h-3 w-3" />}
                  {trendDirection === 'neutral' && <Minus className="h-3 w-3" />}
                  {trend.value > 0 ? '+' : ''}
                  {trend.value}%
                </span>
                {trend.label && (
                  <span className="text-xs text-muted-foreground">{trend.label}</span>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div
              className={cn(
                'flex-shrink-0 p-2.5 rounded-xl',
                variant === 'primary'
                  ? 'bg-primary/10 text-primary'
                  : variant === 'success'
                  ? 'bg-green-500/10 text-green-600 dark:text-green-500'
                  : variant === 'warning'
                  ? 'bg-gold/10 text-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {icon}
            </div>
          )}
        </div>
      </div>
    );
  }
);
StatCard.displayName = 'StatCard';

// Stats Grid for laying out multiple stat cards
interface StatsGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4 | 5;
}

const StatsGrid = React.forwardRef<HTMLDivElement, StatsGridProps>(
  ({ className, columns = 4, children, ...props }, ref) => {
    const gridCols = {
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    };

    return (
      <div
        ref={ref}
        className={cn('grid gap-4', gridCols[columns], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
StatsGrid.displayName = 'StatsGrid';

export { StatCard, StatsGrid };
