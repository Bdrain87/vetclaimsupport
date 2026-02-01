import { useState, useRef, useCallback } from 'react';
import { 
  Camera, 
  Upload, 
  Eye, 
  Trash2, 
  FileText, 
  X, 
  Scan,
  Copy,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { createWorker, OEM } from 'tesseract.js';
import type { UploadedDocument, DocumentTypeId } from '@/types/claims';

interface DocumentScannerProps {
  documents: UploadedDocument[];
  documentType: DocumentTypeId;
  onAdd: (doc: Omit<UploadedDocument, 'id'>) => void;
  onDelete: (id: string) => void;
  showCustomLabel?: boolean;
}

interface ScanResult {
  text: string;
  confidence: number;
}

export function DocumentScanner({ 
  documents, 
  documentType, 
  onAdd, 
  onDelete,
  showCustomLabel = false 
}: DocumentScannerProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<UploadedDocument | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ 
    name: string; 
    type: string; 
    size: number; 
    dataUrl: string 
  } | null>(null);
  
  // OCR State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const filteredDocs = documents.filter(doc => doc.documentType === documentType);

  // 100% LOCAL OCR - runs entirely in browser using Tesseract.js
  const performLocalOCR = useCallback(async (imageDataUrl: string) => {
    setIsScanning(true);
    setScanProgress(0);
    setOcrError(null);
    setScanResult(null);

    try {
      const worker = await createWorker('eng', OEM.LSTM_ONLY, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setScanProgress(Math.round(m.progress * 100));
          }
        },
      });

      const { data } = await worker.recognize(imageDataUrl);
      
      await worker.terminate();

      setScanResult({
        text: data.text,
        confidence: data.confidence,
      });

      toast({
        title: 'OCR Complete',
        description: `Text extracted with ${Math.round(data.confidence)}% confidence`,
      });
    } catch (error) {
      console.error('OCR Error:', error);
      setOcrError('Failed to process image. Please try again.');
      toast({
        title: 'OCR Failed',
        description: 'Could not extract text from image',
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
    }
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Maximum file size is 10MB',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSelectedFile({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl,
      });
      setIsUploadOpen(true);
      
      // Auto-populate title
      if (!title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setTitle(nameWithoutExt);
      }

      // Reset OCR state
      setScanResult(null);
      setOcrError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!selectedFile || !title.trim()) return;
    if (showCustomLabel && !customLabel.trim()) return;

    onAdd({
      title: title.trim(),
      description: scanResult 
        ? `${description.trim()}\n\n--- Extracted Text ---\n${scanResult.text.substring(0, 2000)}${scanResult.text.length > 2000 ? '...' : ''}`
        : description.trim(),
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
    
    toast({
      title: 'Document Saved',
      description: 'Stored locally on your device only',
    });
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCustomLabel('');
    setSelectedFile(null);
    setScanResult(null);
    setOcrError(null);
    setScanProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const copyTextToClipboard = async () => {
    if (!scanResult?.text) return;
    
    try {
      await navigator.clipboard.writeText(scanResult.text);
      toast({
        title: 'Copied!',
        description: 'Text copied to clipboard',
      });
    } catch {
      toast({
        title: 'Copy Failed',
        description: 'Could not copy text',
        variant: 'destructive',
      });
    }
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
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={handleFileSelect}
      />
      
      {/* Inline Action Buttons */}
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

      {/* Upload + OCR Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsUploadOpen(open); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5 text-primary" />
              Document Scanner
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-xs">
              <Lock className="h-3 w-3" />
              100% on-device processing • No data leaves your device
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Image Preview */}
            {selectedFile && (
              <div className="relative rounded-lg border border-border overflow-hidden">
                {isImage(selectedFile.type) ? (
                  <img 
                    src={selectedFile.dataUrl} 
                    alt="Preview" 
                    className="w-full max-h-48 object-contain bg-muted/50"
                  />
                ) : (
                  <div className="h-32 bg-muted/50 flex items-center justify-center">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                  <Badge variant="secondary" className="text-xs">
                    {formatFileSize(selectedFile.size)}
                  </Badge>
                  {scanResult && (
                    <Badge className="bg-success text-success-foreground text-xs gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      OCR Complete
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* OCR Section */}
            {selectedFile && isImage(selectedFile.type) && (
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scan className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Local AI Text Extraction</span>
                    </div>
                    {!isScanning && !scanResult && (
                      <Button
                        size="sm"
                        onClick={() => performLocalOCR(selectedFile.dataUrl)}
                        className="gap-1"
                      >
                        <Scan className="h-3 w-3" />
                        Extract Text
                      </Button>
                    )}
                  </div>

                  {isScanning && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing locally on your device...
                      </div>
                      <Progress value={scanProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground text-right">
                        {scanProgress}% complete
                      </p>
                    </div>
                  )}

                  {ocrError && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      {ocrError}
                    </div>
                  )}

                  {scanResult && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          Confidence: {Math.round(scanResult.confidence)}%
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyTextToClipboard}
                          className="h-7 gap-1 text-xs"
                        >
                          <Copy className="h-3 w-3" />
                          Copy
                        </Button>
                      </div>
                      <div className="max-h-32 overflow-y-auto rounded bg-muted/50 p-2 text-xs font-mono whitespace-pre-wrap">
                        {scanResult.text || '(No text detected)'}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Form Fields */}
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
              <Label htmlFor="doc-description">Notes (optional)</Label>
              <Textarea
                id="doc-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any notes about this document..."
                rows={2}
              />
            </div>

            {/* Privacy Notice */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-success/10 border border-success/20 text-xs">
              <Lock className="h-4 w-4 text-success shrink-0 mt-0.5" />
              <div className="text-success-foreground">
                <strong>Privacy Guaranteed:</strong> All text extraction happens locally in your browser. 
                No images or text are uploaded to any server. Your documents stay on YOUR device.
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => { resetForm(); setIsUploadOpen(false); }}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!title.trim() || !selectedFile || (showCustomLabel && !customLabel.trim()) || isScanning}
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
                  <Badge className="bg-primary">{viewingDoc.customLabel}</Badge>
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
                    <FileText className="h-16 w-16 mx-auto mb-4" />
                    <p>Preview not available</p>
                  </div>
                )}

                {viewingDoc.description && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm whitespace-pre-wrap">{viewingDoc.description}</p>
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
