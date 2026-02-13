import { useState, useRef } from 'react';
import { Camera, Upload, Trash2, FileText, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { UploadedDocument, DocumentTypeId } from '@/types/claims';

interface InlineDocumentUploaderProps {
  documents: UploadedDocument[];
  documentType: DocumentTypeId;
  onAdd: (doc: Omit<UploadedDocument, 'id'>) => void;
  onDelete: (id: string) => void;
  showCustomLabel?: boolean;
}

export function InlineDocumentUploader({ 
  documents, 
  documentType, 
  onAdd, 
  onDelete,
  showCustomLabel = false 
}: InlineDocumentUploaderProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<UploadedDocument | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; type: string; size: number; dataUrl: string } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const filteredDocs = documents.filter(doc => doc.documentType === documentType);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(null);

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFile({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: reader.result as string,
      });
      setIsUploadOpen(true);
      
      if (!title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setTitle(nameWithoutExt);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!selectedFile || !title.trim()) return;
    if (showCustomLabel && !customLabel.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim(),
      fileName: selectedFile.name,
      fileType: selectedFile.type,
      fileSize: selectedFile.size,
      dataUrl: selectedFile.dataUrl,
      uploadedAt: new Date().toISOString(),
      category: 'documents',
      documentType,
      customLabel: showCustomLabel ? customLabel.trim() : undefined,
    });

    resetForm();
    setIsUploadOpen(false);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCustomLabel('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isImage = (type: string) => type.startsWith('image/');

  return (
    <>
      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
        aria-label="Take a photo of document"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={handleFileSelect}
        aria-label="Choose document file"
      />
      
      {/* File size error */}
      {fileError && (
        <p className="text-xs text-red-500">{fileError}</p>
      )}

      {/* Inline Buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => cameraInputRef.current?.click()}
          className="h-7 px-2 text-xs gap-1"
        >
          <Camera className="h-3 w-3" />
          Scan
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="h-7 px-2 text-xs gap-1"
        >
          <Upload className="h-3 w-3" />
          Import
        </Button>
      </div>

      {/* Thumbnail previews */}
      {filteredDocs.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {filteredDocs.map((doc) => (
            <div 
              key={doc.id} 
              className="relative group w-12 h-12 rounded border bg-muted overflow-hidden cursor-pointer"
              onClick={() => setViewingDoc(doc)}
            >
              {isImage(doc.fileType) ? (
                <img
                  src={doc.dataUrl}
                  alt={doc.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(doc.id);
                }}
                className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsUploadOpen(open); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Document Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedFile && (
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  {isImage(selectedFile.type) ? (
                    <img 
                      src={selectedFile.dataUrl} 
                      alt="Preview" 
                      className="h-16 w-16 object-cover rounded border"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-muted rounded border flex items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
              </div>
            )}

            {showCustomLabel && (
              <div className="space-y-2">
                <Label htmlFor="doc-label">Document Type Label *</Label>
                <Input
                  id="doc-label"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  placeholder="e.g., VA Letter, Award Certificate"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="doc-title">Title *</Label>
              <Input
                id="doc-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Page 1, Front Side"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doc-description">Description (optional)</Label>
              <Textarea
                id="doc-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any notes about this document..."
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => { resetForm(); setIsUploadOpen(false); }}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!title.trim() || !selectedFile || (showCustomLabel && !customLabel.trim())}
              >
                Save Document
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Document Dialog */}
      <Dialog open={!!viewingDoc} onOpenChange={(open) => !open && setViewingDoc(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {viewingDoc && (
            <>
              <DialogHeader>
                <DialogTitle>{viewingDoc.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {viewingDoc.customLabel && (
                  <p className="text-sm font-medium text-primary">{viewingDoc.customLabel}</p>
                )}
                {viewingDoc.description && (
                  <p className="text-sm text-muted-foreground">{viewingDoc.description}</p>
                )}
                
                <div className="text-xs text-muted-foreground flex gap-4">
                  <span>Uploaded: {new Date(viewingDoc.uploadedAt).toLocaleDateString()}</span>
                  <span>{formatFileSize(viewingDoc.fileSize)}</span>
                </div>

                {isImage(viewingDoc.fileType) ? (
                  <img
                    src={viewingDoc.dataUrl}
                    alt={viewingDoc.title}
                    className="w-full rounded-lg border"
                  />
                ) : viewingDoc.fileType === 'application/pdf' ? (
                  <iframe
                    src={viewingDoc.dataUrl}
                    className="w-full h-[60vh] rounded-lg border"
                    title={viewingDoc.title}
                  />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <File className="h-16 w-16 mx-auto mb-4" />
                    <p>Preview not available for this file type</p>
                    <a
                      href={viewingDoc.dataUrl}
                      download={viewingDoc.fileName}
                      className="text-primary underline text-sm mt-2 inline-block"
                    >
                      Download file
                    </a>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setViewingDoc(null)}>
                    Close
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      onDelete(viewingDoc.id);
                      setViewingDoc(null);
                    }}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
