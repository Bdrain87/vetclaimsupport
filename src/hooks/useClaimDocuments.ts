import { useState, useEffect, useCallback } from 'react';
import type { ClaimDocument, ClaimDocumentType } from '@/types/claimDocuments';
import {
  storeFileData,
  getFileData,
  deleteFileData,
  INDEXEDDB_THRESHOLD,
  isIndexedDBAvailable,
} from '@/lib/indexedDB';

const STORAGE_KEY = 'va-claim-documents';

const getInitialData = (): ClaimDocument[] => {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      console.error('Failed to parse claim documents');
    }
  }
  return [];
};

export function useClaimDocuments() {
  const [documents, setDocuments] = useState<ClaimDocument[]>(getInitialData);
  const [loadingFiles, setLoadingFiles] = useState<Set<string>>(new Set());

  // Persist metadata to localStorage
  useEffect(() => {
    const toStore = documents.map((doc) => {
      if (doc.storageType === 'indexedDB') {
        return { ...doc, dataUrl: '' };
      }
      return doc;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [documents]);

  // Load IndexedDB data on mount
  useEffect(() => {
    const loadIndexedDBData = async () => {
      const docsNeedingData = documents.filter(
        (doc) => doc.storageType === 'indexedDB' && !doc.dataUrl
      );

      if (docsNeedingData.length === 0) return;

      const ids = new Set(docsNeedingData.map((d) => d.id));
      setLoadingFiles(ids);

      const updates: Record<string, string> = {};

      for (const doc of docsNeedingData) {
        const data = await getFileData(doc.id);
        if (data) {
          updates[doc.id] = data;
        }
      }

      if (Object.keys(updates).length > 0) {
        setDocuments((prev) =>
          prev.map((doc) =>
            updates[doc.id] ? { ...doc, dataUrl: updates[doc.id] } : doc
          )
        );
      }

      setLoadingFiles(new Set());
    };

    loadIndexedDBData();
  }, []);

  // Add a new document
  const addDocument = useCallback(
    async (doc: Omit<ClaimDocument, 'id' | 'storageType'>) => {
      const id = crypto.randomUUID();
      const fileSize = doc.dataUrl.length;
      const useIndexedDB = isIndexedDBAvailable() && fileSize > INDEXEDDB_THRESHOLD;

      if (useIndexedDB) {
        await storeFileData(id, doc.dataUrl);
      }

      const newDoc: ClaimDocument = {
        ...doc,
        id,
        storageType: useIndexedDB ? 'indexedDB' : 'localStorage',
      };

      setDocuments((prev) => [...prev, newDoc]);
      return id;
    },
    []
  );

  // Delete a document
  const deleteDocument = useCallback(
    async (id: string) => {
      const doc = documents.find((d) => d.id === id);

      if (doc?.storageType === 'indexedDB') {
        await deleteFileData(id);
      }

      setDocuments((prev) => prev.filter((d) => d.id !== id));
    },
    [documents]
  );

  // Get unique conditions from documents
  const getUniqueConditions = useCallback(() => {
    const conditions = new Set(documents.map((d) => d.condition).filter(Boolean));
    return Array.from(conditions).sort();
  }, [documents]);

  // Get documents by condition
  const getDocumentsByCondition = useCallback(
    (condition: string) => {
      return documents.filter((doc) => doc.condition === condition);
    },
    [documents]
  );

  // Get documents by type
  const getDocumentsByType = useCallback(
    (docType: ClaimDocumentType) => {
      return documents.filter((doc) => doc.documentType === docType);
    },
    [documents]
  );

  // Search documents
  const searchDocuments = useCallback(
    (query: string) => {
      const lower = query.toLowerCase();
      return documents.filter(
        (doc) =>
          doc.condition.toLowerCase().includes(lower) ||
          doc.title?.toLowerCase().includes(lower) ||
          doc.notes?.toLowerCase().includes(lower) ||
          doc.fileName.toLowerCase().includes(lower)
      );
    },
    [documents]
  );

  // Check if file is loading
  const isFileLoading = useCallback(
    (id: string) => {
      return loadingFiles.has(id);
    },
    [loadingFiles]
  );

  return {
    documents,
    addDocument,
    deleteDocument,
    getUniqueConditions,
    getDocumentsByCondition,
    getDocumentsByType,
    searchDocuments,
    isFileLoading,
  };
}
