import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check, Lock } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface StepIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[];
  currentStep: number; // 0-indexed
  variant?: 'default' | 'compact' | 'vertical';
  onStepClick?: (stepIndex: number) => void;
  allowNavigation?: boolean;
}

const StepIndicator = React.forwardRef<HTMLDivElement, StepIndicatorProps>(
  (
    {
      className,
      steps,
      currentStep,
      variant = 'default',
      onStepClick,
      allowNavigation = false,
      ...props
    },
    ref
  ) => {
    const getStepStatus = (index: number) => {
      if (index < currentStep) return 'completed';
      if (index === currentStep) return 'current';
      return 'upcoming';
    };

    const handleStepClick = (index: number) => {
      if (!allowNavigation || !onStepClick) return;
      if (index <= currentStep) {
        onStepClick(index);
      }
    };

    if (variant === 'vertical') {
      return (
        <div ref={ref} className={cn('space-y-0', className)} {...props}>
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const isLast = index === steps.length - 1;
            const isClickable = allowNavigation && index <= currentStep;

            return (
              <div key={step.id} className="flex gap-4">
                {/* Step indicator and line */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => handleStepClick(index)}
                    disabled={!isClickable}
                    aria-label={`Step ${index + 1}: ${step.label}${status === 'completed' ? ' (completed)' : status === 'current' ? ' (current)' : ' (upcoming)'}`}
                    className={cn(
                      'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                      status === 'completed' &&
                        'border-green-500 bg-green-500 text-white',
                      status === 'current' &&
                        'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30',
                      status === 'upcoming' &&
                        'border-muted-foreground/30 bg-muted/50 text-muted-foreground',
                      isClickable && 'cursor-pointer hover:scale-105',
                      !isClickable && 'cursor-default'
                    )}
                  >
                    {status === 'completed' ? (
                      <Check className="h-5 w-5" />
                    ) : status === 'upcoming' ? (
                      <Lock className="h-4 w-4" />
                    ) : step.icon ? (
                      step.icon
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </button>
                  {!isLast && (
                    <div
                      className={cn(
                        'w-0.5 flex-1 min-h-[40px] transition-colors duration-500',
                        status === 'completed' ? 'bg-green-500' : 'bg-border'
                      )}
                    />
                  )}
                </div>

                {/* Step content */}
                <div className={cn('pb-8', isLast && 'pb-0')}>
                  <p
                    className={cn(
                      'font-semibold transition-colors duration-300',
                      status === 'completed' && 'text-green-600 dark:text-green-500',
                      status === 'current' && 'text-primary',
                      status === 'upcoming' && 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    if (variant === 'compact') {
      return (
        <div
          ref={ref}
          className={cn('flex items-center gap-2', className)}
          {...props}
        >
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const isLast = index === steps.length - 1;
            const isClickable = allowNavigation && index <= currentStep;

            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => handleStepClick(index)}
                  disabled={!isClickable}
                  aria-label={`Step ${index + 1}: ${step.label}${status === 'completed' ? ' (completed)' : status === 'current' ? ' (current)' : ' (upcoming)'}`}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300',
                    status === 'completed' &&
                      'bg-green-500 text-white',
                    status === 'current' &&
                      'bg-primary text-primary-foreground shadow-md shadow-primary/30',
                    status === 'upcoming' &&
                      'bg-muted text-muted-foreground',
                    isClickable && 'cursor-pointer hover:scale-110',
                    !isClickable && 'cursor-default'
                  )}
                >
                  {status === 'completed' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-semibold">{index + 1}</span>
                  )}
                </button>
                {!isLast && (
                  <div
                    className={cn(
                      'h-0.5 w-8 transition-colors duration-500',
                      index < currentStep ? 'bg-green-500' : 'bg-border'
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      );
    }

    // Default horizontal variant
    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div className="flex items-start justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const isLast = index === steps.length - 1;
            const isClickable = allowNavigation && index <= currentStep;

            return (
              <div
                key={step.id}
                className={cn(
                  'flex flex-col items-center relative',
                  !isLast && 'flex-1'
                )}
              >
                {/* Connector line */}
                {!isLast && (
                  <div
                    className={cn(
                      'absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-0.5 transition-colors duration-500',
                      index < currentStep ? 'bg-green-500' : 'bg-border'
                    )}
                  />
                )}

                {/* Step circle */}
                <button
                  type="button"
                  onClick={() => handleStepClick(index)}
                  disabled={!isClickable}
                  aria-label={`Step ${index + 1}: ${step.label}${status === 'completed' ? ' (completed)' : status === 'current' ? ' (current)' : ' (upcoming)'}`}
                  className={cn(
                    'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                    status === 'completed' &&
                      'border-green-500 bg-green-500 text-white',
                    status === 'current' &&
                      'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30',
                    status === 'upcoming' &&
                      'border-muted-foreground/30 bg-background text-muted-foreground',
                    isClickable && 'cursor-pointer hover:scale-105',
                    !isClickable && 'cursor-default'
                  )}
                >
                  {status === 'completed' ? (
                    <Check className="h-5 w-5" />
                  ) : status === 'upcoming' ? (
                    <Lock className="h-4 w-4" />
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </button>

                {/* Step label */}
                <div className="mt-3 text-center max-w-[120px]">
                  <p
                    className={cn(
                      'text-sm font-medium transition-colors duration-300',
                      status === 'completed' && 'text-green-600 dark:text-green-500',
                      status === 'current' && 'text-primary',
                      status === 'upcoming' && 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
StepIndicator.displayName = 'StepIndicator';

export { StepIndicator };
export type { Step, StepIndicatorProps };
