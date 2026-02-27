import useAppStore from '@/store/useAppStore';
import type { ClaimDocumentType } from '@/types/claimDocuments';

interface SaveToVaultOptions {
  documentType: ClaimDocumentType;
  condition: string;
  title: string;
  content: string;
  fileName: string;
}

export async function saveToVault({
  documentType,
  condition,
  title,
  content,
  fileName,
}: SaveToVaultOptions): Promise<string> {
  const store = useAppStore.getState();

  // Deduplicate: delete existing doc with same type + condition
  const existing = store.claimDocuments.find(
    (doc) => doc.documentType === documentType && doc.condition === condition,
  );
  if (existing) {
    await store.deleteClaimDocument(existing.id);
  }

  // Convert text → base64 data URL
  const dataUrl = `data:text/plain;base64,${btoa(unescape(encodeURIComponent(content)))}`;
  const now = new Date().toISOString();

  return store.addClaimDocument({
    fileName,
    fileType: 'text/plain',
    fileSize: content.length,
    dataUrl,
    documentType,
    condition,
    title,
    date: now,
    uploadedAt: now,
  });
}
