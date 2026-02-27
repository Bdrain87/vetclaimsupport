import { useCallback, useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useAppStore from '@/store/useAppStore';
import type { DocumentCategory, AttachableEntryType } from '@/types/documents';

/**
 * Adapter hook — returns the same shape as the old EvidenceContext / useEvidenceDocuments.
 * All consuming components continue to work unchanged.
 */
export function useEvidence() {
  const {
    evidenceDocuments,
    _evidenceLoading,
    _hydrateEvidenceDocuments,
    addEvidenceDocument,
    updateEvidenceDocument,
    deleteEvidenceDocument,
    linkToEntry,
    unlinkFromEntry,
    setAllEvidenceDocuments,
  } = useAppStore(
    useShallow((s) => ({
      evidenceDocuments: s.evidenceDocuments,
      _evidenceLoading: s._evidenceLoading,
      _hydrateEvidenceDocuments: s._hydrateEvidenceDocuments,
      addEvidenceDocument: s.addEvidenceDocument,
      updateEvidenceDocument: s.updateEvidenceDocument,
      deleteEvidenceDocument: s.deleteEvidenceDocument,
      linkToEntry: s.linkToEntry,
      unlinkFromEntry: s.unlinkFromEntry,
      setAllEvidenceDocuments: s.setAllEvidenceDocuments,
    })),
  );

  const hydratedRef = useRef(false);

  // Hydrate IndexedDB data once on mount
  useEffect(() => {
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      _hydrateEvidenceDocuments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDocumentsForEntry = useCallback(
    (entryType: AttachableEntryType, entryId: string) => {
      return evidenceDocuments.filter((doc) =>
        doc.linkedEntries.some((link) => link.entryType === entryType && link.entryId === entryId),
      );
    },
    [evidenceDocuments],
  );

  const getDocumentsByCategory = useCallback(
    (category: DocumentCategory) => {
      return evidenceDocuments.filter((doc) => doc.category === category);
    },
    [evidenceDocuments],
  );

  const getUnlinkedDocuments = useCallback(() => {
    return evidenceDocuments.filter((doc) => doc.linkedEntries.length === 0);
  }, [evidenceDocuments]);

  const searchDocuments = useCallback(
    (query: string) => {
      const lower = query.toLowerCase();
      return evidenceDocuments.filter((doc) =>
        doc.title?.toLowerCase().includes(lower) ||
        doc.fileName?.toLowerCase().includes(lower) ||
        doc.description?.toLowerCase().includes(lower),
      );
    },
    [evidenceDocuments],
  );

  const getCategoryCounts = useCallback(() => {
    const counts: Record<DocumentCategory, number> = {
      'medical-records': 0,
      'service-documents': 0,
      'personal-statements': 0,
      'buddy-letters': 0,
      'photos': 0,
      'other': 0,
    };
    evidenceDocuments.forEach((doc) => {
      counts[doc.category]++;
    });
    return counts;
  }, [evidenceDocuments]);

  const isFileLoading = useCallback(
    (id: string) => _evidenceLoading.has(id),
    [_evidenceLoading],
  );

  const isHydrating = _evidenceLoading.size > 0;

  return {
    documents: evidenceDocuments,
    addDocument: addEvidenceDocument,
    updateDocument: updateEvidenceDocument,
    deleteDocument: deleteEvidenceDocument,
    linkToEntry,
    unlinkFromEntry,
    getDocumentsForEntry,
    getDocumentsByCategory,
    getUnlinkedDocuments,
    searchDocuments,
    getCategoryCounts,
    setAllDocuments: setAllEvidenceDocuments,
    isFileLoading,
    isHydrating,
  };
}
