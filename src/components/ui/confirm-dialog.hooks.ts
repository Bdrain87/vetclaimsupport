import { Trash2, LogOut } from 'lucide-react';
import { createElement } from 'react';

export type ConfirmDialogVariant = 'default' | 'destructive' | 'warning';

interface ConfirmDialogConfig {
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

// Pre-configured confirm dialogs for common actions
export function useConfirmDialog() {
  const confirmDelete = (
    itemName: string,
    onConfirm: () => void
  ): ConfirmDialogConfig => ({
    open: true,
    onOpenChange: () => {},
    title: `Delete ${itemName}?`,
    description: `This action cannot be undone. This will permanently delete the ${itemName.toLowerCase()}.`,
    confirmText: 'Delete',
    variant: 'destructive',
    onConfirm,
    icon: createElement(Trash2, { className: "h-6 w-6 text-destructive" }),
  });

  const confirmLogout = (onConfirm: () => void): ConfirmDialogConfig => ({
    open: true,
    onOpenChange: () => {},
    title: 'Sign out?',
    description: 'You will need to sign in again to access your data.',
    confirmText: 'Sign Out',
    variant: 'warning',
    onConfirm,
    icon: createElement(LogOut, { className: "h-6 w-6 text-warning" }),
  });

  const confirmClearData = (onConfirm: () => void): ConfirmDialogConfig => ({
    open: true,
    onOpenChange: () => {},
    title: 'Clear all data?',
    description:
      'This will permanently delete all your tracked data, documents, and settings. This action cannot be undone. Consider exporting your data first.',
    confirmText: 'Clear All Data',
    variant: 'destructive',
    onConfirm,
    icon: createElement(Trash2, { className: "h-6 w-6 text-destructive" }),
  });

  return { confirmDelete, confirmLogout, confirmClearData };
}
