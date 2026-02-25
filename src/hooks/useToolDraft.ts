import { useState, useRef, useEffect, useCallback } from 'react';
import useAppStore from '@/store/useAppStore';

const DEBOUNCE_MS = 500;
const STEP_KEY = '__step';

/** Serialize a value for storage. Strings stored as-is; everything else as JSON. */
function serializeValue(value: unknown): string {
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

/** Deserialize a stored string back to the expected type, using the initial value as a type reference. */
function deserializeValue<T>(stored: string, referenceValue: T): T {
  // String fields → return stored string directly
  if (typeof referenceValue === 'string') return stored as unknown as T;
  // Non-string fields → parse JSON
  try {
    return JSON.parse(stored) as T;
  } catch {
    return referenceValue;
  }
}

interface UseToolDraftOptions<T extends Record<string, unknown>> {
  toolId: string;
  initialData: T;
  initialStep?: number;
}

interface UseToolDraftReturn<T extends Record<string, unknown>> {
  formData: T;
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  currentStep: number;
  setCurrentStep: (action: number | ((prev: number) => number)) => void;
  draftRestored: boolean;
  clearDraft: () => void;
  lastSaved: string | null;
}

export function useToolDraft<T extends Record<string, unknown>>({
  toolId,
  initialData,
  initialStep = 1,
}: UseToolDraftOptions<T>): UseToolDraftReturn<T> {
  const clearFormDraft = useAppStore((s) => s.clearFormDraft);

  // Read formDrafts once on mount via getState() to avoid re-render on every save
  const [savedDraft] = useState(() => useAppStore.getState().formDrafts[toolId]);

  // Track whether a draft was restored on mount
  const [draftRestored, setDraftRestored] = useState(
    () => !!savedDraft && Object.keys(savedDraft).filter((k) => k !== 'lastModified').length > 0,
  );

  const [lastSaved, setLastSaved] = useState<string | null>(savedDraft?.lastModified ?? null);

  // Keep initialData ref current (for clearDraft to use latest prefill values)
  const initialDataRef = useRef(initialData);
  initialDataRef.current = initialData;

  // Initialize form data: restore from draft or use initialData
  const [formData, setFormDataRaw] = useState<T>(() => {
    if (!savedDraft) return initialData;

    const restored = { ...initialData };
    for (const [key, storedValue] of Object.entries(savedDraft)) {
      if (key === 'lastModified' || key === STEP_KEY) continue;
      if (key in initialData) {
        (restored as Record<string, unknown>)[key] = deserializeValue(
          storedValue,
          initialData[key],
        );
      }
    }
    return restored;
  });

  // Initialize step from draft
  const [currentStep, setCurrentStepRaw] = useState<number>(() => {
    if (savedDraft?.[STEP_KEY]) {
      const parsed = parseInt(savedDraft[STEP_KEY], 10);
      return isNaN(parsed) ? initialStep : parsed;
    }
    return initialStep;
  });

  // Refs for accessing current values in callbacks and cleanup
  const dataRef = useRef(formData);
  const stepRef = useRef(currentStep);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearedRef = useRef(false);

  // Keep refs in sync with state
  dataRef.current = formData;
  stepRef.current = currentStep;

  // Sync all fields to the store in a single batched update
  const flushToStore = useCallback(() => {
    if (clearedRef.current) return;
    const data = dataRef.current;
    const draft: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      draft[key] = serializeValue(value);
    }
    draft[STEP_KEY] = String(stepRef.current);
    const now = new Date().toISOString();
    useAppStore.setState((s) => ({
      formDrafts: {
        ...s.formDrafts,
        [toolId]: { ...draft, lastModified: now },
      },
    }));
    setLastSaved(now);
  }, [toolId]);

  // Schedule a debounced save
  const scheduleSave = useCallback(() => {
    clearedRef.current = false;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(flushToStore, DEBOUNCE_MS);
  }, [flushToStore]);

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      flushToStore();
    };
  }, [flushToStore]);

  // Update a single field (debounced save)
  const updateField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setFormDataRaw((prev) => {
        const next = { ...prev, [field]: value };
        dataRef.current = next;
        return next;
      });
      scheduleSave();
    },
    [scheduleSave],
  );

  // Set entire form data (debounced save)
  const setFormData: React.Dispatch<React.SetStateAction<T>> = useCallback(
    (action) => {
      setFormDataRaw((prev) => {
        const next = typeof action === 'function' ? action(prev) : action;
        dataRef.current = next;
        return next;
      });
      scheduleSave();
    },
    [scheduleSave],
  );

  // Set step (immediate save)
  const setCurrentStep = useCallback(
    (action: number | ((prev: number) => number)) => {
      const next = typeof action === 'function' ? action(stepRef.current) : action;
      stepRef.current = next;
      setCurrentStepRaw(next);
      // Cancel pending debounce and flush everything immediately
      if (debounceRef.current) clearTimeout(debounceRef.current);
      // Schedule flush after React processes pending state updates
      setTimeout(flushToStore, 0);
    },
    [flushToStore],
  );

  // Clear draft and reset form
  const clearDraft = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    clearedRef.current = true;
    clearFormDraft(toolId);
    const freshData = initialDataRef.current;
    dataRef.current = freshData;
    stepRef.current = initialStep;
    setFormDataRaw(freshData);
    setCurrentStepRaw(initialStep);
    setDraftRestored(false);
    setLastSaved(null);
  }, [toolId, clearFormDraft, initialStep]);

  return {
    formData,
    updateField,
    setFormData,
    currentStep,
    setCurrentStep,
    draftRestored,
    clearDraft,
    lastSaved,
  };
}
