import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { logger } from '@/utils/logger';
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
import {
  isRetentionWarningPending,
  dismissRetentionWarning,
  purgeAppData,
} from '@/utils/dataRetention';

export function RetentionWarningBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isRetentionWarningPending()) {
      setOpen(true);
    }
  }, []);

  if (!open) return null;

  const handleKeep = () => {
    dismissRetentionWarning();
    setOpen(false);
  };

  const handlePurge = async () => {
    try {
      await purgeAppData();
      dismissRetentionWarning();
      window.location.reload();
    } catch (error) {
      logger.error('[RetentionWarningBanner] purge failed:', error);
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <AlertDialogTitle>Welcome Back</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            It&apos;s been over a year since you last used VetClaimSupport. Your
            locally stored data may be outdated. Would you like to keep your
            existing data or start fresh?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleKeep}>
            Keep My Data
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handlePurge}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Start Fresh
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
