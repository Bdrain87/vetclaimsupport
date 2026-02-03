import { LucideIcon, FileQuestion, Plus } from 'lucide-react';
import { Button } from './button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="gap-2">
          <Plus className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

// Pre-configured empty states for common use cases
export function NoDataEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      title="No data yet"
      description="Start tracking your information to build your evidence."
      actionLabel={onAction ? "Add Entry" : undefined}
      onAction={onAction}
    />
  );
}

export function NoSearchResultsEmptyState({ searchTerm }: { searchTerm: string }) {
  return (
    <EmptyState
      title="No results found"
      description={`No items match "${searchTerm}". Try adjusting your search or filters.`}
    />
  );
}

export function NoDocumentsEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      title="No documents"
      description="Upload medical records, buddy statements, and other evidence to support your claim."
      actionLabel={onAction ? "Upload Document" : undefined}
      onAction={onAction}
    />
  );
}

export function ErrorEmptyState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <EmptyState
      title="Something went wrong"
      description={message || "An error occurred while loading data. Please try again."}
      actionLabel={onRetry ? "Try Again" : undefined}
      onAction={onRetry}
    />
  );
}
