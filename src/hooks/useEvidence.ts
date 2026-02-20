import { useCallback, useEffect, useRef } from 'react';
import useAppStore from '@/store/useAppStore';
import type { DocumentCategory, AttachableEntryType } from '@/types/documents';

/**
 * Adapter hook — returns the same shape as the old EvidenceContext / useEvidenceDocuments.
 * All consuming components continue to work unchanged.
 */
export function useEvidence() {
  const store = useAppStore();
  const hydratedRef = useRef(false);

  // Hydrate IndexedDB data once on mount
  useEffect(() => {
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      store._hydrateEvidenceDocuments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDocumentsForEntry = useCallback(
    (entryType: AttachableEntryType, entryId: string) => {
      return store.evidenceDocuments.filter((doc) =>
        doc.linkedEntries.some((link) => link.entryType === entryType && link.entryId === entryId),
      );
    },
    [store.evidenceDocuments],
  );

  const getDocumentsByCategory = useCallback(
    (category: DocumentCategory) => {
      return store.evidenceDocuments.filter((doc) => doc.category === category);
    },
    [store.evidenceDocuments],
  );

  const getUnlinkedDocuments = useCallback(() => {
    return store.evidenceDocuments.filter((doc) => doc.linkedEntries.length === 0);
  }, [store.evidenceDocuments]);

  const searchDocuments = useCallback(
    (query: string) => {
      const lower = query.toLowerCase();
      return store.evidenceDocuments.filter((doc) =>
        doc.title.toLowerCase().includes(lower) ||
        doc.fileName.toLowerCase().includes(lower) ||
        doc.description?.toLowerCase().includes(lower),
      );
    },
    [store.evidenceDocuments],
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
    store.evidenceDocuments.forEach((doc) => {
      counts[doc.category]++;
    });
    return counts;
  }, [store.evidenceDocuments]);

  const isFileLoading = useCallback(
    (id: string) => store._evidenceLoading.has(id),
    [store._evidenceLoading],
  );

  const isHydrating = store._evidenceLoading.size > 0;

  return {
    documents: store.evidenceDocuments,
    addDocument: store.addEvidenceDocument,
    updateDocument: store.updateEvidenceDocument,
    deleteDocument: store.deleteEvidenceDocument,
    linkToEntry: store.linkToEntry,
    unlinkFromEntry: store.unlinkFromEntry,
    getDocumentsForEntry,
    getDocumentsByCategory,
    getUnlinkedDocuments,
    searchDocuments,
    getCategoryCounts,
    setAllDocuments: store.setAllEvidenceDocuments,
    isFileLoading,
    isHydrating,
  };
}
