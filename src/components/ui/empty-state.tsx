import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import {
  FileText, Search, Bell, Calendar, Users, Heart, Shield,
  Inbox
} from 'lucide-react';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'compact' | 'card';
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      icon,
      title,
      description,
      action,
      secondaryAction,
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: 'py-16',
      compact: 'py-8',
      card: 'py-12 px-6 rounded-2xl border border-dashed border-border bg-muted/20',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center text-center',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {/* Icon container with subtle animation */}
        {icon && (
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse" />
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-muted to-muted/50 border border-border/50">
              <div className="text-muted-foreground/60">{icon}</div>
            </div>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            {description}
          </p>
        )}

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {action && (
              <Button
                onClick={action.onClick}
                variant={action.variant || 'default'}
                className="min-w-[140px]"
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                onClick={secondaryAction.onClick}
                variant="ghost"
                className="text-muted-foreground"
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';

// Pre-built empty states for common scenarios
interface PrebuiltEmptyStateProps extends Omit<EmptyStateProps, 'icon' | 'title'> {
  title?: string;
}

const EmptyStateNoData = React.forwardRef<HTMLDivElement, PrebuiltEmptyStateProps>(
  ({ title = 'No data yet', description = 'Start adding data to see it appear here.', ...props }, ref) => (
    <EmptyState
      ref={ref}
      icon={<Inbox className="h-10 w-10" />}
      title={title}
      description={description}
      {...props}
    />
  )
);
EmptyStateNoData.displayName = 'EmptyStateNoData';

const EmptyStateNoResults = React.forwardRef<HTMLDivElement, PrebuiltEmptyStateProps>(
  ({ title = 'No results found', description = 'Try adjusting your search or filter to find what you\'re looking for.', ...props }, ref) => (
    <EmptyState
      ref={ref}
      icon={<Search className="h-10 w-10" />}
      title={title}
      description={description}
      {...props}
    />
  )
);
EmptyStateNoResults.displayName = 'EmptyStateNoResults';

const EmptyStateNoDocuments = React.forwardRef<HTMLDivElement, PrebuiltEmptyStateProps>(
  ({ title = 'No documents', description = 'Upload your first document to get started with your evidence collection.', ...props }, ref) => (
    <EmptyState
      ref={ref}
      icon={<FileText className="h-10 w-10" />}
      title={title}
      description={description}
      {...props}
    />
  )
);
EmptyStateNoDocuments.displayName = 'EmptyStateNoDocuments';

const EmptyStateNoNotifications = React.forwardRef<HTMLDivElement, PrebuiltEmptyStateProps>(
  ({ title = 'All caught up!', description = 'You have no new notifications at the moment.', ...props }, ref) => (
    <EmptyState
      ref={ref}
      icon={<Bell className="h-10 w-10" />}
      title={title}
      description={description}
      {...props}
    />
  )
);
EmptyStateNoNotifications.displayName = 'EmptyStateNoNotifications';

const EmptyStateNoEvents = React.forwardRef<HTMLDivElement, PrebuiltEmptyStateProps>(
  ({ title = 'No events scheduled', description = 'Add your medical appointments and important dates to stay organized.', ...props }, ref) => (
    <EmptyState
      ref={ref}
      icon={<Calendar className="h-10 w-10" />}
      title={title}
      description={description}
      {...props}
    />
  )
);
EmptyStateNoEvents.displayName = 'EmptyStateNoEvents';

const EmptyStateNoContacts = React.forwardRef<HTMLDivElement, PrebuiltEmptyStateProps>(
  ({ title = 'No contacts added', description = 'Add contacts who can provide buddy statements to support your claim.', ...props }, ref) => (
    <EmptyState
      ref={ref}
      icon={<Users className="h-10 w-10" />}
      title={title}
      description={description}
      {...props}
    />
  )
);
EmptyStateNoContacts.displayName = 'EmptyStateNoContacts';

const EmptyStateNoSymptoms = React.forwardRef<HTMLDivElement, PrebuiltEmptyStateProps>(
  ({ title = 'No symptoms logged', description = 'Track your symptoms regularly to build strong evidence for your claim.', ...props }, ref) => (
    <EmptyState
      ref={ref}
      icon={<Heart className="h-10 w-10" />}
      title={title}
      description={description}
      {...props}
    />
  )
);
EmptyStateNoSymptoms.displayName = 'EmptyStateNoSymptoms';

const EmptyStateNoClaims = React.forwardRef<HTMLDivElement, PrebuiltEmptyStateProps>(
  ({ title = 'No claims tracked', description = 'Start tracking your VA disability claims to stay organized.', ...props }, ref) => (
    <EmptyState
      ref={ref}
      icon={<Shield className="h-10 w-10" />}
      title={title}
      description={description}
      {...props}
    />
  )
);
EmptyStateNoClaims.displayName = 'EmptyStateNoClaims';

const EmptyStateError = React.forwardRef<HTMLDivElement, PrebuiltEmptyStateProps>(
  ({ title = 'Something went wrong', description = 'We encountered an error loading this content. Please try again.', action, ...props }, ref) => (
    <EmptyState
      ref={ref}
      icon={<Shield className="h-10 w-10" />}
      title={title}
      description={description}
      action={action || { label: 'Try Again', onClick: () => window.location.reload() }}
      {...props}
    />
  )
);
EmptyStateError.displayName = 'EmptyStateError';

export {
  EmptyState,
  EmptyStateNoData,
  EmptyStateNoResults,
  EmptyStateNoDocuments,
  EmptyStateNoNotifications,
  EmptyStateNoEvents,
  EmptyStateNoContacts,
  EmptyStateNoSymptoms,
  EmptyStateNoClaims,
  EmptyStateError,
};
