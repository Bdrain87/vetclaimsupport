import * as React from 'react';
import { ToastContext } from "./premium-toast-context";

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function usePremiumToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('usePremiumToast must be used within a PremiumToastProvider');
  }

  return {
    toast: (toast: Omit<Toast, 'id'>) => context.addToast(toast),
    success: (title: string, description?: string) =>
      context.addToast({ type: 'success', title, description }),
    error: (title: string, description?: string) =>
      context.addToast({ type: 'error', title, description }),
    warning: (title: string, description?: string) =>
      context.addToast({ type: 'warning', title, description }),
    info: (title: string, description?: string) =>
      context.addToast({ type: 'info', title, description }),
    dismiss: context.removeToast,
    clearAll: context.clearToasts,
  };
}
