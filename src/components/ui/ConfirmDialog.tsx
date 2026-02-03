import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Trash2, LogOut, RefreshCw, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ConfirmDialogVariant = 'default' | 'destructive' | 'warning';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: ConfirmDialogVariant;
  icon?: React.ReactNode;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  icon,
  loading = false,
}: ConfirmDialogProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    if (!loading) {
      onOpenChange(false);
    }
  };

  const variantStyles = {
    default: {
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      buttonClass: '',
    },
    destructive: {
      iconBg: 'bg-destructive/10',
      iconColor: 'text-destructive',
      buttonClass: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    },
    warning: {
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      buttonClass: 'bg-warning text-warning-foreground hover:bg-warning/90',
    },
  };

  const styles = variantStyles[variant];

  const defaultIcon = variant === 'destructive' ? (
    <Trash2 className={cn('h-6 w-6', styles.iconColor)} />
  ) : variant === 'warning' ? (
    <AlertTriangle className={cn('h-6 w-6', styles.iconColor)} />
  ) : (
    <Shield className={cn('h-6 w-6', styles.iconColor)} />
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <div className={cn('p-3 rounded-full', styles.iconBg)}>
              {icon ?? defaultIcon}
            </div>
            <div>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription className="mt-2">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={loading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={cn(styles.buttonClass)}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Pre-configured confirm dialogs for common actions
export function useConfirmDialog() {
  const confirmDelete = (
    itemName: string,
    onConfirm: () => void
  ): ConfirmDialogProps => ({
    open: true,
    onOpenChange: () => {},
    title: `Delete ${itemName}?`,
    description: `This action cannot be undone. This will permanently delete the ${itemName.toLowerCase()}.`,
    confirmText: 'Delete',
    variant: 'destructive',
    onConfirm,
    icon: <Trash2 className="h-6 w-6 text-destructive" />,
  });

  const confirmLogout = (onConfirm: () => void): ConfirmDialogProps => ({
    open: true,
    onOpenChange: () => {},
    title: 'Sign out?',
    description: 'You will need to sign in again to access your data.',
    confirmText: 'Sign Out',
    variant: 'warning',
    onConfirm,
    icon: <LogOut className="h-6 w-6 text-warning" />,
  });

  const confirmClearData = (onConfirm: () => void): ConfirmDialogProps => ({
    open: true,
    onOpenChange: () => {},
    title: 'Clear all data?',
    description:
      'This will permanently delete all your tracked data, documents, and settings. This action cannot be undone. Consider exporting your data first.',
    confirmText: 'Clear All Data',
    variant: 'destructive',
    onConfirm,
    icon: <Trash2 className="h-6 w-6 text-destructive" />,
  });

  return { confirmDelete, confirmLogout, confirmClearData };
}
