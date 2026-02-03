import * as React from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

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

export function PremiumToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...toast, id }]);

    // Auto-dismiss
    const duration = toast.duration ?? (toast.type === 'error' ? 6000 : 4000);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = React.useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => onDismiss(toast.id)}
          index={index}
        />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: () => void;
  index: number;
}

function ToastItem({ toast, onDismiss, index }: ToastItemProps) {
  const [isExiting, setIsExiting] = React.useState(false);

  const handleDismiss = React.useCallback(() => {
    setIsExiting(true);
    setTimeout(onDismiss, 200);
  }, [onDismiss]);

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  };

  const styles = {
    success: {
      bg: 'bg-green-500/10 dark:bg-green-500/20',
      border: 'border-green-500/30',
      icon: 'text-green-600 dark:text-green-500',
    },
    error: {
      bg: 'bg-red-500/10 dark:bg-red-500/20',
      border: 'border-red-500/30',
      icon: 'text-red-600 dark:text-red-500',
    },
    warning: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      border: 'border-amber-500/30',
      icon: 'text-amber-600 dark:text-amber-500',
    },
    info: {
      bg: 'bg-blue-500/10 dark:bg-blue-500/20',
      border: 'border-blue-500/30',
      icon: 'text-blue-600 dark:text-blue-500',
    },
  };

  const style = styles[toast.type];

  return (
    <div
      className={cn(
        'pointer-events-auto w-[360px] max-w-[calc(100vw-2rem)]',
        'rounded-2xl border shadow-lg backdrop-blur-xl',
        'p-4 flex gap-3 items-start',
        style.bg,
        style.border,
        isExiting
          ? 'animate-toast-exit'
          : 'animate-toast-enter'
      )}
      style={{ animationDelay: `${index * 50}ms` }}
      role="alert"
    >
      <div className={cn('flex-shrink-0 mt-0.5', style.icon)}>
        {icons[toast.type]}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground">{toast.title}</p>
        {toast.description && (
          <p className="text-sm text-muted-foreground mt-1">{toast.description}</p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className={cn(
              'mt-2 text-sm font-medium underline-offset-4 hover:underline',
              style.icon
            )}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// Add toast animations to head
if (typeof document !== 'undefined') {
  const styleId = 'premium-toast-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes toastEnter {
        from {
          opacity: 0;
          transform: translateX(100%) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }

      @keyframes toastExit {
        from {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
        to {
          opacity: 0;
          transform: translateX(100%) scale(0.95);
        }
      }

      .animate-toast-enter {
        animation: toastEnter 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards;
      }

      .animate-toast-exit {
        animation: toastExit 0.2s cubic-bezier(0.32, 0.72, 0, 1) forwards;
      }
    `;
    document.head.appendChild(style);
  }
}
