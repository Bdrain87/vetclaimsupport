import { useState, useRef } from 'react';
import { safeFormatDate } from '@/utils/dateUtils';
import { Camera, Upload, Eye, Trash2, FileText, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { UploadedDocument } from '@/types/claims';
import { formatFileSize } from '@/types/documents';

interface DocumentUploaderProps {
  documents: UploadedDocument[];
  category: 'documents' | 'buddy-contacts';
  onAdd: (doc: Omit<UploadedDocument, 'id'>) => void;
  onDelete: (id: string) => void;
}

export function DocumentUploader({ documents, category, onAdd, onDelete }: DocumentUploaderProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<UploadedDocument | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; type: string; size: number; dataUrl: string } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const filteredDocs = documents.filter(doc => doc.category === category);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, _source: 'file' | 'camera') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(null);

    // Check file size (max 10MB)
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

      // Auto-set title from filename if empty
      if (!title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setTitle(nameWithoutExt);
      }
    };
    reader.onerror = () => {
      setFileError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!selectedFile || !title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim(),
      fileName: selectedFile.name,
      fileType: selectedFile.type,
      fileSize: selectedFile.size,
      dataUrl: selectedFile.dataUrl,
      uploadedAt: new Date().toISOString(),
      category,
    });

    resetForm();
    setIsUploadOpen(false);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const isImage = (type: string) => type.startsWith('image/');

  return (
    <div className="space-y-4">
      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileSelect(e, 'camera')}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => handleFileSelect(e, 'file')}
      />

      {/* File size error */}
      {fileError && (
        <p className="text-sm text-red-500">{fileError}</p>
      )}

      {/* Mobile-Optimized Upload Buttons - 48px min touch targets */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => cameraInputRef.current?.click()}
          className="h-12 min-h-[48px] gap-2 text-sm font-semibold"
        >
          <Camera className="h-5 w-5" />
          Take Photo
        </Button>
        
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="h-12 min-h-[48px] gap-2 text-sm font-semibold"
        >
          <Upload className="h-5 w-5" />
          Import File
        </Button>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsUploadOpen(open); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Document Details</DialogTitle>
            <DialogDescription className="sr-only">Enter a title and optional notes for this document</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* File Preview */}
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

            <div className="space-y-2">
              <Label htmlFor="doc-title">Title *</Label>
              <Input
                id="doc-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., DD-214, Medical Record Page 1"
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
              <Button onClick={handleSave} disabled={!title.trim() || !selectedFile}>
                Save Document
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Thumbnails */}
      {filteredDocs.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredDocs.map((doc) => (
            <Card key={doc.id} className="overflow-hidden group">
              <div className="relative aspect-[4/3] bg-muted">
                {isImage(doc.fileType) ? (
                  <img
                    src={doc.dataUrl}
                    alt={doc.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewingDoc(doc)}
                    aria-label="View document"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDelete(doc.id)}
                    aria-label="Delete document"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-2">
                <p className="text-xs font-medium truncate">{doc.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(doc.fileSize)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Document Dialog */}
      <Dialog open={!!viewingDoc} onOpenChange={(open) => !open && setViewingDoc(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {viewingDoc && (
            <>
              <DialogHeader>
                <DialogTitle>{viewingDoc.title}</DialogTitle>
                <DialogDescription className="sr-only">Document preview</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {viewingDoc.description && (
                  <p className="text-sm text-muted-foreground">{viewingDoc.description}</p>
                )}
                
                <div className="text-xs text-muted-foreground flex gap-4">
                  <span>Uploaded: {safeFormatDate(viewingDoc.uploadedAt)}</span>
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
    </div>
  );
}
