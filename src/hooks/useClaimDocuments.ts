import { useCallback, useEffect, useRef } from 'react';
import useAppStore from '@/store/useAppStore';
import type { ClaimDocumentType } from '@/types/claimDocuments';

/**
 * Adapter hook — returns the same shape as the old useClaimDocuments.
 * DocumentsHub.tsx continues to work unchanged.
 */
export function useClaimDocuments() {
  const store = useAppStore();
  const hydratedRef = useRef(false);

  // Hydrate IndexedDB data once on mount
  useEffect(() => {
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      store._hydrateClaimDocuments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUniqueConditions = useCallback(() => {
    const conditions = new Set(store.claimDocuments.map((d) => d.condition).filter(Boolean));
    return Array.from(conditions).sort();
  }, [store.claimDocuments]);

  const getDocumentsByCondition = useCallback(
    (condition: string) => {
      return store.claimDocuments.filter((doc) => doc.condition === condition);
    },
    [store.claimDocuments],
  );

  const getDocumentsByType = useCallback(
    (docType: ClaimDocumentType) => {
      return store.claimDocuments.filter((doc) => doc.documentType === docType);
    },
    [store.claimDocuments],
  );

  const searchDocuments = useCallback(
    (query: string) => {
      const lower = query.toLowerCase();
      return store.claimDocuments.filter(
        (doc) =>
          doc.condition.toLowerCase().includes(lower) ||
          doc.title?.toLowerCase().includes(lower) ||
          doc.notes?.toLowerCase().includes(lower) ||
          doc.fileName.toLowerCase().includes(lower),
      );
    },
    [store.claimDocuments],
  );

  const isFileLoading = useCallback(
    (id: string) => store._claimDocLoading.has(id),
    [store._claimDocLoading],
  );

  const isHydrating = store._claimDocLoading.size > 0;

  return {
    documents: store.claimDocuments,
    addDocument: store.addClaimDocument,
    deleteDocument: store.deleteClaimDocument,
    getUniqueConditions,
    getDocumentsByCondition,
    getDocumentsByType,
    searchDocuments,
    isFileLoading,
    isHydrating,
  };
}
