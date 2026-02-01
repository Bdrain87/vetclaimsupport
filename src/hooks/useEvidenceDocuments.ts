import { useState, useEffect, useCallback } from 'react';
import type { EvidenceDocument, DocumentCategory, AttachableEntryType } from '@/types/documents';
import { 
  storeFileData, 
  getFileData, 
  deleteFileData, 
  INDEXEDDB_THRESHOLD,
  isIndexedDBAvailable 
} from '@/lib/indexedDB';

const STORAGE_KEY = 'va-claims-evidence-documents';

// Document metadata stored in localStorage (without large dataUrl for IndexedDB items)
interface StoredDocumentMeta extends Omit<EvidenceDocument, 'dataUrl'> {
  dataUrl: string; // Empty string if stored in IndexedDB
}

const getInitialData = (): EvidenceDocument[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      console.error('Failed to parse evidence documents');
    }
  }
  return [];
};

export function useEvidenceDocuments() {
  const [documents, setDocuments] = useState<EvidenceDocument[]>(getInitialData);
  const [loadingFiles, setLoadingFiles] = useState<Set<string>>(new Set());

  // Persist metadata to localStorage (dataUrl excluded for IndexedDB items)
  useEffect(() => {
    const toStore = documents.map(doc => {
      if (doc.storageType === 'indexedDB') {
        // Don't store large dataUrl in localStorage
        return { ...doc, dataUrl: '' };
      }
      return doc;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [documents]);

  // Load IndexedDB data for documents on mount
  useEffect(() => {
    const loadIndexedDBData = async () => {
      const docsNeedingData = documents.filter(
        doc => doc.storageType === 'indexedDB' && !doc.dataUrl
      );
      
      if (docsNeedingData.length === 0) return;
      
      const ids = new Set(docsNeedingData.map(d => d.id));
      setLoadingFiles(ids);
      
      const updates: Record<string, string> = {};
      
      for (const doc of docsNeedingData) {
        const data = await getFileData(doc.id);
        if (data) {
          updates[doc.id] = data;
        }
      }
      
      if (Object.keys(updates).length > 0) {
        setDocuments(prev => prev.map(doc => 
          updates[doc.id] ? { ...doc, dataUrl: updates[doc.id] } : doc
        ));
      }
      
      setLoadingFiles(new Set());
    };
    
    loadIndexedDBData();
  }, []);

  // Add a new document (100% local storage)
  const addDocument = useCallback(async (doc: Omit<EvidenceDocument, 'id' | 'storageType'>) => {
    const id = crypto.randomUUID();
    const fileSize = doc.dataUrl.length;
    const useIndexedDB = isIndexedDBAvailable() && fileSize > INDEXEDDB_THRESHOLD;
    
    // Store large files in IndexedDB
    if (useIndexedDB) {
      await storeFileData(id, doc.dataUrl);
    }
    
    const newDoc: EvidenceDocument = {
      ...doc,
      id,
      storageType: useIndexedDB ? 'indexedDB' : 'localStorage',
    };
    
    setDocuments(prev => [...prev, newDoc]);
    return id;
  }, []);

  // Update a document
  const updateDocument = useCallback(async (id: string, updates: Partial<EvidenceDocument>) => {
    // If updating dataUrl, may need to update storage location
    if (updates.dataUrl) {
      const doc = documents.find(d => d.id === id);
      if (doc) {
        const newSize = updates.dataUrl.length;
        const shouldUseIndexedDB = isIndexedDBAvailable() && newSize > INDEXEDDB_THRESHOLD;
        
        // Clean up old IndexedDB entry if switching to localStorage
        if (doc.storageType === 'indexedDB' && !shouldUseIndexedDB) {
          await deleteFileData(id);
        }
        
        // Store in IndexedDB if large
        if (shouldUseIndexedDB) {
          await storeFileData(id, updates.dataUrl);
        }
        
        updates.storageType = shouldUseIndexedDB ? 'indexedDB' : 'localStorage';
      }
    }
    
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, ...updates } : doc
    ));
  }, [documents]);

  // Delete a document
  const deleteDocument = useCallback(async (id: string) => {
    const doc = documents.find(d => d.id === id);
    
    // Clean up IndexedDB if needed
    if (doc?.storageType === 'indexedDB') {
      await deleteFileData(id);
    }
    
    setDocuments(prev => prev.filter(d => d.id !== id));
  }, [documents]);

  // Link document to an entry
  const linkToEntry = useCallback((docId: string, entryType: AttachableEntryType, entryId: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        const alreadyLinked = doc.linkedEntries.some(
          link => link.entryType === entryType && link.entryId === entryId
        );
        if (alreadyLinked) return doc;
        
        return {
          ...doc,
          linkedEntries: [...doc.linkedEntries, {
            entryType,
            entryId,
            linkedAt: new Date().toISOString(),
          }],
        };
      }
      return doc;
    }));
  }, []);

  // Unlink document from an entry
  const unlinkFromEntry = useCallback((docId: string, entryType: AttachableEntryType, entryId: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          linkedEntries: doc.linkedEntries.filter(
            link => !(link.entryType === entryType && link.entryId === entryId)
          ),
        };
      }
      return doc;
    }));
  }, []);

  // Get documents for a specific entry
  const getDocumentsForEntry = useCallback((entryType: AttachableEntryType, entryId: string) => {
    return documents.filter(doc =>
      doc.linkedEntries.some(link => link.entryType === entryType && link.entryId === entryId)
    );
  }, [documents]);

  // Get documents by category
  const getDocumentsByCategory = useCallback((category: DocumentCategory) => {
    return documents.filter(doc => doc.category === category);
  }, [documents]);

  // Get unlinked documents (orphans)
  const getUnlinkedDocuments = useCallback(() => {
    return documents.filter(doc => doc.linkedEntries.length === 0);
  }, [documents]);

  // Search documents by title or filename
  const searchDocuments = useCallback((query: string) => {
    const lower = query.toLowerCase();
    return documents.filter(doc =>
      doc.title.toLowerCase().includes(lower) ||
      doc.fileName.toLowerCase().includes(lower) ||
      doc.description?.toLowerCase().includes(lower)
    );
  }, [documents]);

  // Get document count per category
  const getCategoryCounts = useCallback(() => {
    const counts: Record<DocumentCategory, number> = {
      'medical-records': 0,
      'service-documents': 0,
      'personal-statements': 0,
      'buddy-letters': 0,
      'photos': 0,
      'other': 0,
    };
    documents.forEach(doc => {
      counts[doc.category]++;
    });
    return counts;
  }, [documents]);

  // Bulk update documents
  const setAllDocuments = useCallback((docs: EvidenceDocument[]) => {
    setDocuments(docs);
  }, []);

  // Check if a specific file is still loading from IndexedDB
  const isFileLoading = useCallback((id: string) => {
    return loadingFiles.has(id);
  }, [loadingFiles]);

  return {
    documents,
    addDocument,
    updateDocument,
    deleteDocument,
    linkToEntry,
    unlinkFromEntry,
    getDocumentsForEntry,
    getDocumentsByCategory,
    getUnlinkedDocuments,
    searchDocuments,
    getCategoryCounts,
    setAllDocuments,
    isFileLoading,
  };
}
