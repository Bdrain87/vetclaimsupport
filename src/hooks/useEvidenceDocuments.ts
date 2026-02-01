import { useState, useEffect, useCallback } from 'react';
import type { EvidenceDocument, DocumentCategory, AttachableEntryType, LinkedEntry } from '@/types/documents';

const STORAGE_KEY = 'va-claims-evidence-documents';

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

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  }, [documents]);

  // Add a new document
  const addDocument = useCallback((doc: Omit<EvidenceDocument, 'id'>) => {
    const newDoc: EvidenceDocument = {
      ...doc,
      id: crypto.randomUUID(),
    };
    setDocuments(prev => [...prev, newDoc]);
    return newDoc.id;
  }, []);

  // Update a document
  const updateDocument = useCallback((id: string, updates: Partial<EvidenceDocument>) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, ...updates } : doc
    ));
  }, []);

  // Delete a document
  const deleteDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  }, []);

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

  // Bulk update documents (for external state sync)
  const setAllDocuments = useCallback((docs: EvidenceDocument[]) => {
    setDocuments(docs);
  }, []);

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
  };
}
