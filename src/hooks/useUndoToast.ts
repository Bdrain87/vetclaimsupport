import { useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

const UNDO_DELAY_MS = 5000;

export function useUndoToast() {
  const { toast } = useToast();
  const pendingRef = useRef<{ timer: ReturnType<typeof setTimeout>; undo: () => void } | null>(null);

  const performWithUndo = useCallback(
    <T>(opts: {
      label: string;
      doAction: () => T;
      undoAction: (result: T) => void;
    }) => {
      const result = opts.doAction();

      if (pendingRef.current) {
        clearTimeout(pendingRef.current.timer);
        pendingRef.current = null;
      }

      const { dismiss } = toast({
        title: opts.label,
        description: 'This action can be undone for 5 seconds.',
        duration: UNDO_DELAY_MS,
      });

      const timer = setTimeout(() => {
        pendingRef.current = null;
      }, UNDO_DELAY_MS);

      const undo = () => {
        clearTimeout(timer);
        pendingRef.current = null;
        opts.undoAction(result);
        dismiss();
        toast({
          title: 'Undone',
          description: `${opts.label} has been reversed.`,
          duration: 2000,
        });
      };

      pendingRef.current = { timer, undo };

      return { undo };
    },
    [toast],
  );

  const undoLast = useCallback(() => {
    if (pendingRef.current) {
      pendingRef.current.undo();
    }
  }, []);

  return { performWithUndo, undoLast };
}
