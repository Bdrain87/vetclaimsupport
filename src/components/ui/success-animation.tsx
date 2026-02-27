import * as React from 'react';
import { cn } from '@/lib/utils';

interface SuccessAnimationProps extends React.HTMLAttributes<HTMLDivElement> {
  show: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'checkmark' | 'celebration';
  message?: string;
  subMessage?: string;
  onComplete?: () => void;
  autoHide?: boolean;
  autoHideDelay?: number;
}

const SuccessAnimation = React.forwardRef<HTMLDivElement, SuccessAnimationProps>(
  (
    {
      className,
      show,
      size = 'md',
      variant = 'checkmark',
      message,
      subMessage,
      onComplete,
      autoHide = false,
      autoHideDelay = 3000,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [particles, setParticles] = React.useState<Array<{
      id: number;
      x: number;
      y: number;
      color: string;
      delay: number;
    }>>([]);

    const sizeConfig = {
      sm: { circle: 48, stroke: 3, check: 24, text: 'text-sm', subtext: 'text-xs' },
      md: { circle: 72, stroke: 4, check: 36, text: 'text-base', subtext: 'text-sm' },
      lg: { circle: 96, stroke: 5, check: 48, text: 'text-lg', subtext: 'text-base' },
      xl: { circle: 128, stroke: 6, check: 64, text: 'text-xl', subtext: 'text-lg' },
    };

    const config = sizeConfig[size];

    React.useEffect(() => {
      let completeTimer: ReturnType<typeof setTimeout>;
      let hideTimer: ReturnType<typeof setTimeout>;

      if (show) {
        setIsVisible(true);

        // Generate particles for celebration variant
        if (variant === 'celebration') {
          const colors = [
            '#22c55e', '#D9BE6C', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'
          ];
          const newParticles = Array.from({ length: 24 }, (_, i) => ({
            id: i,
            x: Math.random() * 200 - 100,
            y: Math.random() * -150 - 50,
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: Math.random() * 0.3,
          }));
          setParticles(newParticles);
        }

        if (onComplete) {
          completeTimer = setTimeout(onComplete, 1000);
        }

        if (autoHide) {
          hideTimer = setTimeout(() => setIsVisible(false), autoHideDelay);
        }
      } else {
        setIsVisible(false);
      }

      return () => {
        clearTimeout(completeTimer);
        clearTimeout(hideTimer);
      };
    }, [show, variant, onComplete, autoHide, autoHideDelay]);

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center',
          className
        )}
        {...props}
      >
        {/* Animation container */}
        <div className="relative">
          {/* Particles for celebration variant */}
          {variant === 'celebration' && particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full animate-particle"
              style={{
                backgroundColor: particle.color,
                '--x': `${particle.x}px`,
                '--y': `${particle.y}px`,
                animationDelay: `${particle.delay}s`,
              } as React.CSSProperties}
            />
          ))}

          {/* Glow effect */}
          <div
            className="absolute inset-0 rounded-full bg-green-500/20 blur-xl animate-success-glow"
            style={{ width: config.circle, height: config.circle }}
          />

          {/* Main circle */}
          <svg
            width={config.circle}
            height={config.circle}
            viewBox={`0 0 ${config.circle} ${config.circle}`}
            className="relative z-10"
          >
            {/* Background circle */}
            <circle
              cx={config.circle / 2}
              cy={config.circle / 2}
              r={(config.circle - config.stroke) / 2}
              fill="none"
              stroke="currentColor"
              strokeWidth={config.stroke}
              className="text-green-500/20"
            />

            {/* Animated circle */}
            <circle
              cx={config.circle / 2}
              cy={config.circle / 2}
              r={(config.circle - config.stroke) / 2}
              fill="none"
              stroke="currentColor"
              strokeWidth={config.stroke}
              strokeLinecap="round"
              className="text-green-500 animate-success-circle"
              style={{
                strokeDasharray: Math.PI * (config.circle - config.stroke),
                strokeDashoffset: Math.PI * (config.circle - config.stroke),
                transformOrigin: 'center',
                transform: 'rotate(-90deg)',
              }}
            />

            {/* Checkmark */}
            <path
              d={`M${config.circle * 0.28} ${config.circle * 0.52} L${config.circle * 0.42} ${config.circle * 0.66} L${config.circle * 0.72} ${config.circle * 0.36}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={config.stroke}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-500 animate-success-check"
              style={{
                strokeDasharray: config.check * 2,
                strokeDashoffset: config.check * 2,
              }}
            />
          </svg>
        </div>

        {/* Message */}
        {(message || subMessage) && (
          <div className="text-center mt-6 animate-fade-in-up">
            {message && (
              <p className={cn('font-semibold text-foreground', config.text)}>
                {message}
              </p>
            )}
            {subMessage && (
              <p className={cn('text-muted-foreground mt-1', config.subtext)}>
                {subMessage}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);
SuccessAnimation.displayName = 'SuccessAnimation';

// Mini success indicator for inline use
interface MiniSuccessProps extends React.HTMLAttributes<HTMLSpanElement> {
  show: boolean;
}

const MiniSuccess = React.forwardRef<HTMLSpanElement, MiniSuccessProps>(
  ({ className, show, ...props }, ref) => {
    if (!show) return null;

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white animate-scale-in',
          className
        )}
        {...props}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-success-check-fast"
        >
          <path
            d="M2.5 6.5L4.5 8.5L9.5 3.5"
            style={{
              strokeDasharray: 12,
              strokeDashoffset: 12,
            }}
          />
        </svg>
      </span>
    );
  }
);
MiniSuccess.displayName = 'MiniSuccess';

// Full-screen success overlay
interface SuccessOverlayProps extends SuccessAnimationProps {
  onDismiss?: () => void;
}

const SuccessOverlay = React.forwardRef<HTMLDivElement, SuccessOverlayProps>(
  ({ show, onDismiss, ...props }, ref) => {
    if (!show) return null;

    return (
      <div
        ref={ref}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={onDismiss}
      >
        <div className="p-8 rounded-3xl bg-card border border-border shadow-2xl animate-scale-in">
          <SuccessAnimation show={show} variant="celebration" {...props} />
        </div>
      </div>
    );
  }
);
SuccessOverlay.displayName = 'SuccessOverlay';

export { SuccessAnimation, MiniSuccess, SuccessOverlay };
