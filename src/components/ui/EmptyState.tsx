import { LucideIcon, FileQuestion, Plus, FileText, FolderOpen, BookOpen, Stethoscope, AlertTriangle, Users } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  hint?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  actionLabel,
  onAction,
  hint,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      "max-w-xs mx-auto",
      className
    )}>
      <div className={cn(
        "rounded-2xl bg-muted p-4 mb-4",
        "transition-colors duration-200"
      )}>
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="gap-2 h-11 bg-success hover:bg-success/90"
        >
          <Plus className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
      {hint && (
        <p className="text-xs text-muted-foreground/70 mt-4 leading-relaxed">
          {hint}
        </p>
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
      icon={FolderOpen}
      title="No documents"
      description="Upload medical records, buddy statements, and other evidence to support your claim."
      actionLabel={onAction ? "Upload Document" : undefined}
      onAction={onAction}
      hint="What counts? Medical records, service records, buddy statements, nexus letters"
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

// New pre-configured empty states from UX audit

export function ConditionsEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={FileText}
      title="No conditions yet"
      description="Add your first condition to start building your claim."
      actionLabel={onAction ? "Add Condition" : undefined}
      onAction={onAction}
      hint="Common conditions: PTSD, Tinnitus, Back Pain, Knee Pain, Sleep Apnea"
    />
  );
}

export function EvidenceEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={FolderOpen}
      title="No evidence yet"
      description="Track your medical records, buddy statements, and more."
      actionLabel={onAction ? "Add Evidence" : undefined}
      onAction={onAction}
      hint="What counts? Medical records, service records, buddy statements, nexus letters"
    />
  );
}

export function JournalEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={BookOpen}
      title="Start your symptom journal"
      description="Document your worst days to show the VA how your conditions really affect you."
      actionLabel={onAction ? "Log Today" : undefined}
      onAction={onAction}
      hint="The VA needs to understand your daily limitations."
    />
  );
}

export function MedicalVisitsEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={Stethoscope}
      title="No medical visits logged"
      description="Track your appointments to build a timeline of treatment."
      actionLabel={onAction ? "Log Visit" : undefined}
      onAction={onAction}
      hint="Include sick call visits, ER trips, and specialist appointments"
    />
  );
}

export function ExposuresEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={AlertTriangle}
      title="No exposures documented"
      description="Record hazardous exposures from your service for presumptive conditions."
      actionLabel={onAction ? "Add Exposure" : undefined}
      onAction={onAction}
      hint="Examples: burn pits, Agent Orange, contaminated water, radiation"
    />
  );
}

export function BuddyStatementsEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="No buddy statements"
      description="Fellow service members can provide crucial supporting evidence for your claim."
      actionLabel={onAction ? "Add Contact" : undefined}
      onAction={onAction}
      hint="Buddies who witnessed your injury or symptoms can strengthen your claim"
    />
  );
}
