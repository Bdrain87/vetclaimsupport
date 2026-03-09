import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg' | 'xl';
  strokeWidth?: number;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'gold';
  showValue?: boolean;
  label?: string;
  animate?: boolean;
  children?: React.ReactNode;
}

const ProgressRing = React.forwardRef<HTMLDivElement, ProgressRingProps>(
  (
    {
      className,
      value,
      size = 'md',
      strokeWidth,
      variant = 'primary',
      showValue = true,
      label,
      animate = true,
      children,
      ...props
    },
    ref
  ) => {
    const [animatedValue, setAnimatedValue] = React.useState(0);

    // Size configurations
    const sizeConfig = {
      sm: { dimension: 64, stroke: 4, fontSize: 'text-sm', labelSize: 'text-xs' },
      md: { dimension: 96, stroke: 6, fontSize: 'text-xl', labelSize: 'text-xs' },
      lg: { dimension: 128, stroke: 8, fontSize: 'text-2xl', labelSize: 'text-sm' },
      xl: { dimension: 160, stroke: 10, fontSize: 'text-3xl', labelSize: 'text-base' },
    };

    const config = sizeConfig[size];
    const actualStrokeWidth = strokeWidth ?? config.stroke;
    const radius = (config.dimension - actualStrokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const clampedValue = Math.min(100, Math.max(0, value));

    // Animate value
    React.useEffect(() => {
      if (!animate) {
        setAnimatedValue(clampedValue);
        return;
      }

      let startTime: number | null = null;
      let animationFrame: number;
      const duration = 1000;
      const startValue = animatedValue;

      const animateValue = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);

        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = startValue + (clampedValue - startValue) * easeOut;

        setAnimatedValue(current);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animateValue);
        }
      };

      animationFrame = requestAnimationFrame(animateValue);

      return () => cancelAnimationFrame(animationFrame);
      // eslint-disable-next-line react-hooks/exhaustive-deps -- `animatedValue` is intentionally excluded: it is read only as the starting point for animation. Adding it would cause an infinite loop since the effect calls setAnimatedValue on each animation frame.
    }, [clampedValue, animate]);

    const offset = circumference - (animatedValue / 100) * circumference;

    // Color variants
    const variantStyles = {
      default: {
        track: 'stroke-muted',
        progress: 'stroke-foreground',
        text: 'text-foreground',
      },
      primary: {
        track: 'stroke-primary/20',
        progress: 'stroke-primary',
        text: 'text-primary',
      },
      success: {
        track: 'stroke-success/20',
        progress: 'stroke-success',
        text: 'text-success',
      },
      warning: {
        track: 'stroke-gold/20',
        progress: 'stroke-gold',
        text: 'text-gold-dk dark:text-gold',
      },
      danger: {
        track: 'stroke-destructive/20',
        progress: 'stroke-destructive',
        text: 'text-destructive',
      },
      gold: {
        track: 'stroke-(--gold-md)/20',
        progress: 'stroke-(--gold-md)',
        text: 'text-(--gold-md)',
      },
    };

    const styles = variantStyles[variant];

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={Math.round(clampedValue)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ? `${label}: ${Math.round(clampedValue)}%` : `${Math.round(clampedValue)}%`}
        className={cn('relative inline-flex items-center justify-center', className)}
        style={{ width: config.dimension, height: config.dimension }}
        {...props}
      >
        <svg
          className="transform -rotate-90"
          width={config.dimension}
          height={config.dimension}
        >
          {/* Background track */}
          <circle
            className={cn('transition-all duration-300', styles.track)}
            strokeWidth={actualStrokeWidth}
            fill="none"
            r={radius}
            cx={config.dimension / 2}
            cy={config.dimension / 2}
          />
          {/* Progress arc */}
          <circle
            className={cn(
              'transition-all duration-300 ease-out',
              styles.progress
            )}
            strokeWidth={actualStrokeWidth}
            strokeLinecap="round"
            fill="none"
            r={radius}
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children ? (
            children
          ) : showValue ? (
            <>
              <span
                className={cn(
                  'font-bold tabular-nums',
                  config.fontSize,
                  styles.text
                )}
              >
                {Math.round(animatedValue)}%
              </span>
              {label && (
                <span
                  className={cn(
                    'text-muted-foreground font-medium mt-0.5',
                    config.labelSize
                  )}
                >
                  {label}
                </span>
              )}
            </>
          ) : null}
        </div>
      </div>
    );
  }
);
ProgressRing.displayName = 'ProgressRing';

// Progress Ring with Icon Center
interface ProgressRingIconProps extends Omit<ProgressRingProps, 'children' | 'showValue'> {
  icon: React.ReactNode;
}

const ProgressRingIcon = React.forwardRef<HTMLDivElement, ProgressRingIconProps>(
  ({ icon, variant = 'primary', ...props }, ref) => {
    const variantStyles = {
      default: 'text-foreground',
      primary: 'text-primary',
      success: 'text-success',
      warning: 'text-gold-dk dark:text-gold',
      danger: 'text-destructive',
      gold: 'text-(--gold-md)',
    };

    return (
      <ProgressRing ref={ref} variant={variant} showValue={false} {...props}>
        <div className={cn('flex items-center justify-center', variantStyles[variant])}>
          {icon}
        </div>
      </ProgressRing>
    );
  }
);
ProgressRingIcon.displayName = 'ProgressRingIcon';

export { ProgressRing, ProgressRingIcon };
