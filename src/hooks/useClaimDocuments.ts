import { useCallback, useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useAppStore from '@/store/useAppStore';
import type { ClaimDocumentType } from '@/types/claimDocuments';

/**
 * Adapter hook — returns the same shape as the old useClaimDocuments.
 * DocumentsHub.tsx continues to work unchanged.
 */
export function useClaimDocuments() {
  const {
    claimDocuments,
    _claimDocLoading,
    _hydrateClaimDocuments,
    addClaimDocument,
    deleteClaimDocument,
  } = useAppStore(
    useShallow((s) => ({
      claimDocuments: s.claimDocuments,
      _claimDocLoading: s._claimDocLoading,
      _hydrateClaimDocuments: s._hydrateClaimDocuments,
      addClaimDocument: s.addClaimDocument,
      deleteClaimDocument: s.deleteClaimDocument,
    })),
  );

  const hydratedRef = useRef(false);

  // Hydrate IndexedDB data once on mount
  useEffect(() => {
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      _hydrateClaimDocuments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUniqueConditions = useCallback(() => {
    const conditions = new Set(claimDocuments.map((d) => d.condition).filter(Boolean));
    return Array.from(conditions).sort();
  }, [claimDocuments]);

  const getDocumentsByCondition = useCallback(
    (condition: string) => {
      return claimDocuments.filter((doc) => doc.condition === condition);
    },
    [claimDocuments],
  );

  const getDocumentsByType = useCallback(
    (docType: ClaimDocumentType) => {
      return claimDocuments.filter((doc) => doc.documentType === docType);
    },
    [claimDocuments],
  );

  const searchDocuments = useCallback(
    (query: string) => {
      const lower = query.toLowerCase();
      return claimDocuments.filter(
        (doc) =>
          doc.condition?.toLowerCase().includes(lower) ||
          doc.title?.toLowerCase().includes(lower) ||
          doc.notes?.toLowerCase().includes(lower) ||
          doc.fileName?.toLowerCase().includes(lower),
      );
    },
    [claimDocuments],
  );

  const isFileLoading = useCallback(
    (id: string) => _claimDocLoading.has(id),
    [_claimDocLoading],
  );

  const isHydrating = _claimDocLoading.size > 0;

  return {
    documents: claimDocuments,
    addDocument: addClaimDocument,
    deleteDocument: deleteClaimDocument,
    getUniqueConditions,
    getDocumentsByCondition,
    getDocumentsByType,
    searchDocuments,
    isFileLoading,
    isHydrating,
  };
}
