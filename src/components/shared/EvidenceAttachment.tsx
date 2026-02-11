import { useState, useRef } from 'react';
import { Paperclip, X, Image as ImageIcon, FileText, File, Eye, Link2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { EvidenceDocument, AttachableEntryType, DocumentCategory } from '@/types/documents';
import { suggestCategoryFromFilename, formatFileSize, documentCategoryLabels } from '@/types/documents';

interface EvidenceAttachmentProps {
  entryType: AttachableEntryType;
  entryId: string;
  documents: EvidenceDocument[];
  onDocumentsChange: (documents: EvidenceDocument[]) => void;
  maxFiles?: number;
  compact?: boolean;
}

export function EvidenceAttachment({
  entryType,
  entryId,
  documents,
  onDocumentsChange,
  maxFiles = 10,
  compact = false,
}: EvidenceAttachmentProps) {
  const [previewDoc, setPreviewDoc] = useState<EvidenceDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Get documents linked to this entry
  const linkedDocuments = documents.filter(doc => 
    doc.linkedEntries.some(link => link.entryType === entryType && link.entryId === entryId)
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (linkedDocuments.length + files.length > maxFiles) {
      toast({
        title: 'Too Many Files',
        description: `Maximum ${maxFiles} files allowed per entry.`,
        variant: 'destructive',
      });
      return;
    }

    const validFiles: File[] = [];
    Array.from(files).forEach(file => {
      // Validate file size (10MB limit for documents)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: `${file.name} exceeds 10MB limit.`,
          variant: 'destructive',
        });
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      Promise.all(
        validFiles.map(file => new Promise<EvidenceDocument>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            const suggestedCategory = suggestCategoryFromFilename(file.name);

            const newDoc: EvidenceDocument = {
              id: crypto.randomUUID(),
              fileName: file.name,
              fileType: file.type,
              fileSize: file.size,
              dataUrl,
              uploadedAt: new Date().toISOString(),
              category: suggestedCategory,
              title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension for title
              linkedEntries: [{
                entryType,
                entryId,
                linkedAt: new Date().toISOString(),
              }],
              autoSuggestedCategory: suggestedCategory,
              storageType: 'localStorage', // All local storage, no cloud
            };

            // Generate thumbnail for images
            if (file.type.startsWith('image/')) {
              newDoc.thumbnailUrl = dataUrl;
            }

            resolve(newDoc);
          };
          reader.readAsDataURL(file);
        }))
      ).then(newDocs => {
        onDocumentsChange([...documents, ...newDocs]);

        toast({
          title: 'Evidence Attached',
          description: `${newDocs.length} file${newDocs.length > 1 ? 's' : ''} added to this entry.`,
        });
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const unlinkDocument = (docId: string) => {
    const updatedDocs = documents.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          linkedEntries: doc.linkedEntries.filter(
            link => !(link.entryType === entryType && link.entryId === entryId)
          ),
        };
      }
      return doc;
    });
    onDocumentsChange(updatedDocs);
  };

  const getFileIcon = (doc: EvidenceDocument) => {
    if (doc.fileType.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    if (doc.fileType === 'application/pdf') return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="gap-1.5"
        >
          <Paperclip className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Attach</span>
          {linkedDocuments.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {linkedDocuments.length}
            </Badge>
          )}
        </Button>
        
        {linkedDocuments.length > 0 && (
          <div className="flex gap-1">
            {linkedDocuments.slice(0, 3).map(doc => (
              <div
                key={doc.id}
                className="w-8 h-8 rounded border border-border overflow-hidden cursor-pointer hover:border-primary transition-colors"
                onClick={() => setPreviewDoc(doc)}
              >
                {doc.thumbnailUrl ? (
                  <img src={doc.thumbnailUrl} alt={doc.title || 'Document thumbnail'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    {getFileIcon(doc)}
                  </div>
                )}
              </div>
            ))}
            {linkedDocuments.length > 3 && (
              <div className="w-8 h-8 rounded border border-border flex items-center justify-center bg-muted text-xs font-medium">
                +{linkedDocuments.length - 3}
              </div>
            )}
          </div>
        )}

        {/* Preview Modal */}
        <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{previewDoc?.title}</DialogTitle>
            </DialogHeader>
            {previewDoc && (
              <div className="space-y-4">
                <div className="flex items-center justify-center min-h-[300px] bg-muted rounded-lg">
                  {previewDoc.fileType.startsWith('image/') ? (
                    <img 
                      src={previewDoc.dataUrl} 
                      alt={previewDoc.title}
                      className="max-h-[60vh] object-contain rounded-lg"
                    />
                  ) : previewDoc.fileType === 'application/pdf' ? (
                    <iframe
                      src={previewDoc.dataUrl}
                      className="w-full h-[60vh] rounded-lg"
                      title={previewDoc.title}
                    />
                  ) : (
                    <div className="text-center p-8">
                      <File className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">{previewDoc.fileName}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(previewDoc.fileSize)}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{documentCategoryLabels[previewDoc.category]}</Badge>
                    <span className="text-sm text-muted-foreground">{formatFileSize(previewDoc.fileSize)}</span>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      unlinkDocument(previewDoc.id);
                      setPreviewDoc(null);
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Unlink
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground flex items-center gap-2">
          <Paperclip className="h-4 w-4" />
          Evidence Attachments
        </span>
        <span className="text-xs text-muted-foreground">
          {linkedDocuments.length}/{maxFiles}
        </span>
      </div>

      {/* Document Grid */}
      {linkedDocuments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {linkedDocuments.map(doc => (
            <Dialog key={doc.id}>
              <DialogTrigger asChild>
                <div 
                  className="relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer border border-border hover:border-primary transition-colors group"
                >
                  {doc.thumbnailUrl ? (
                    <img 
                      src={doc.thumbnailUrl} 
                      alt={doc.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      {getFileIcon(doc)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      unlinkDocument(doc.id);
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs hover:bg-destructive/90"
                    aria-label="Remove attachment"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>{doc.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-center min-h-[300px] bg-muted rounded-lg">
                    {doc.fileType.startsWith('image/') ? (
                      <img 
                        src={doc.dataUrl} 
                        alt={doc.title}
                        className="max-h-[60vh] object-contain rounded-lg"
                      />
                    ) : doc.fileType === 'application/pdf' ? (
                      <iframe
                        src={doc.dataUrl}
                        className="w-full h-[60vh] rounded-lg"
                        title={doc.title}
                      />
                    ) : (
                      <div className="text-center p-8">
                        <File className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">{doc.fileName}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(doc.fileSize)}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{documentCategoryLabels[doc.category]}</Badge>
                      <span className="text-sm text-muted-foreground">{formatFileSize(doc.fileSize)}</span>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}

      {/* Add Attachment Button */}
      {linkedDocuments.length < maxFiles && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Attach Evidence
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Attach doctor's notes, test results, photos, or other evidence. Max 10MB per file.
      </p>
    </div>
  );
}

// Display-only thumbnails for entry cards
interface EvidenceThumbnailsProps {
  entryType: AttachableEntryType;
  entryId: string;
  documents: EvidenceDocument[];
}

export function EvidenceThumbnails({ entryType, entryId, documents }: EvidenceThumbnailsProps) {
  const linkedDocuments = documents.filter(doc => 
    doc.linkedEntries.some(link => link.entryType === entryType && link.entryId === entryId)
  );

  if (linkedDocuments.length === 0) return null;

  const getFileIcon = (doc: EvidenceDocument) => {
    if (doc.fileType.startsWith('image/')) return <ImageIcon className="h-3 w-3" />;
    if (doc.fileType === 'application/pdf') return <FileText className="h-3 w-3" />;
    return <File className="h-3 w-3" />;
  };

  return (
    <div className="flex items-center gap-1.5 mt-2">
      <Link2 className="h-3 w-3 text-muted-foreground" />
      <div className="flex gap-1">
        {linkedDocuments.slice(0, 4).map(doc => (
          <div
            key={doc.id}
            className="w-6 h-6 rounded border border-border overflow-hidden"
          >
            {doc.thumbnailUrl ? (
              <img src={doc.thumbnailUrl} alt={doc.title || 'Document thumbnail'} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                {getFileIcon(doc)}
              </div>
            )}
          </div>
        ))}
        {linkedDocuments.length > 4 && (
          <span className="text-xs text-muted-foreground">+{linkedDocuments.length - 4}</span>
        )}
      </div>
    </div>
  );
}
