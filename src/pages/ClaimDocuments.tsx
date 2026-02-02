import { useState, useRef, useCallback } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { useClaimDocuments } from '@/hooks/useClaimDocuments';
import {
  FolderOpen,
  Upload,
  Camera,
  Search,
  Filter,
  Image as ImageIcon,
  FileText,
  File,
  Trash2,
  Eye,
  Plus,
  Calendar,
  Download,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  ClaimDocumentType,
  claimDocumentTypeLabels,
  claimDocumentTypeShort,
  formatFileSize,
  getDocTypeColor,
} from '@/types/claimDocuments';
import { format } from 'date-fns';

export default function ClaimDocuments() {
  const { data } = useClaims();
  const {
    documents,
    addDocument,
    deleteDocument,
    getUniqueConditions,
    searchDocuments,
  } = useClaimDocuments();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<typeof documents[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [filterDocType, setFilterDocType] = useState<string>('all');

  // Form state
  const [uploadForm, setUploadForm] = useState({
    documentType: '' as ClaimDocumentType | '',
    condition: '',
    title: '',
    notes: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    pendingFile: null as { dataUrl: string; fileName: string; fileType: string; fileSize: number } | null,
  });

  // Get conditions from both symptoms (bodyArea) and claim conditions
  const conditionsFromSymptoms = Array.from(
    new Set(data.symptoms.map((s) => s.bodyArea).filter(Boolean))
  );
  const conditionsFromClaims = data.claimConditions.map((c) => c.name);
  const allConditions = Array.from(
    new Set([...conditionsFromSymptoms, ...conditionsFromClaims])
  ).sort();

  // Conditions used in documents for filtering
  const documentConditions = getUniqueConditions();

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      searchQuery === '' ||
      doc.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCondition =
      filterCondition === 'all' || doc.condition === filterCondition;

    const matchesDocType =
      filterDocType === 'all' || doc.documentType === filterDocType;

    return matchesSearch && matchesCondition && matchesDocType;
  });

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 15 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please select a file under 15MB.',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setUploadForm((prev) => ({
        ...prev,
        pendingFile: {
          dataUrl,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        },
      }));
      setIsUploadOpen(true);
    };
    reader.readAsDataURL(file);
  }, [toast]);

  // Submit upload
  const handleSubmitUpload = async () => {
    if (!uploadForm.documentType || !uploadForm.condition || !uploadForm.pendingFile) {
      toast({
        title: 'Missing Required Fields',
        description: 'Please select a document type and condition.',
        variant: 'destructive',
      });
      return;
    }

    const { pendingFile, documentType, condition, title, notes, date } = uploadForm;

    await addDocument({
      fileName: pendingFile.fileName,
      fileType: pendingFile.fileType,
      fileSize: pendingFile.fileSize,
      dataUrl: pendingFile.dataUrl,
      thumbnailUrl: pendingFile.fileType.startsWith('image/') ? pendingFile.dataUrl : undefined,
      uploadedAt: new Date().toISOString(),
      documentType: documentType as ClaimDocumentType,
      condition,
      title: title || undefined,
      notes: notes || undefined,
      date,
    });

    toast({
      title: 'Document Uploaded',
      description: `${pendingFile.fileName} saved for ${condition}.`,
    });

    // Reset form
    setUploadForm({
      documentType: '',
      condition: '',
      title: '',
      notes: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      pendingFile: null,
    });
    setIsUploadOpen(false);
  };

  // Get file icon
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="h-5 w-5" />;
    if (fileType === 'application/pdf') return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6 animate-fade-in overflow-x-hidden max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="section-header mb-0">
          <div className="section-icon bg-primary/10">
            <FolderOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Claim Documents</h1>
            <p className="text-muted-foreground text-sm">
              Upload and organize evidence by condition
            </p>
          </div>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Mobile-Optimized Upload Buttons */}
      <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-2">
        <Button
          onClick={() => cameraInputRef.current?.click()}
          className="h-14 sm:h-10 gap-2 text-base sm:text-sm font-semibold bg-primary hover:bg-primary/90"
        >
          <Camera className="h-6 w-6 sm:h-4 sm:w-4" />
          Take Photo
        </Button>
        <Button 
          variant="outline"
          onClick={() => fileInputRef.current?.click()} 
          className="h-14 sm:h-10 gap-2 text-base sm:text-sm font-semibold"
        >
          <Upload className="h-6 w-6 sm:h-4 sm:w-4" />
          Upload File
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        <Card className="data-card">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <FolderOpen className="h-6 w-6 text-primary" />
              <div>
                <p className="text-xl font-bold">{documents.length}</p>
                <p className="text-xs text-muted-foreground">Total Docs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="data-card">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-success" />
              <div>
                <p className="text-xl font-bold">{documentConditions.length}</p>
                <p className="text-xs text-muted-foreground">Conditions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="data-card">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="h-6 w-6 flex items-center justify-center p-0 text-xs">
                N
              </Badge>
              <div>
                <p className="text-xl font-bold">
                  {documents.filter((d) => d.documentType === 'nexus-letter').length}
                </p>
                <p className="text-xs text-muted-foreground">Nexus Letters</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="data-card">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="h-6 w-6 flex items-center justify-center p-0 text-xs">
                D
              </Badge>
              <div>
                <p className="text-xl font-bold">
                  {documents.filter((d) => d.documentType === 'dbq').length}
                </p>
                <p className="text-xs text-muted-foreground">DBQs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCondition} onValueChange={setFilterCondition}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            {documentConditions.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterDocType} onValueChange={setFilterDocType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Doc Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {(Object.keys(claimDocumentTypeLabels) as ClaimDocumentType[]).map((type) => (
              <SelectItem key={type} value={type}>
                {claimDocumentTypeShort[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <Card className="data-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">
              {searchQuery || filterCondition !== 'all' || filterDocType !== 'all'
                ? 'No documents match your filters.'
                : 'No documents uploaded yet.'}
            </p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Upload evidence to support your VA claim.
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 gap-2"
            >
              <Plus className="h-4 w-4" />
              Upload Document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {filteredDocuments.map((doc) => (
            <Card
              key={doc.id}
              className="data-card hover:border-primary/50 transition-colors group cursor-pointer"
            >
              <CardContent className="p-3">
                {/* Thumbnail */}
                <div
                  className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted mb-2"
                  onClick={() => setSelectedDoc(doc)}
                >
                  {doc.thumbnailUrl ? (
                    <img
                      src={doc.thumbnailUrl}
                      alt={doc.title || doc.fileName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getFileIcon(doc.fileType)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1.5">
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 ${getDocTypeColor(doc.documentType)}`}
                  >
                    {claimDocumentTypeShort[doc.documentType]}
                  </Badge>
                  <p className="font-medium text-sm truncate" title={doc.condition}>
                    {doc.condition}
                  </p>
                  {doc.title && (
                    <p className="text-xs text-muted-foreground truncate" title={doc.title}>
                      {doc.title}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{format(new Date(doc.date), 'MMM d, yyyy')}</span>
                    <span>{formatFileSize(doc.fileSize)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1 mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 h-8 min-h-[44px] text-xs"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <Eye className="h-3.5 w-3.5 sm:mr-1" />
                    <span className="hidden sm:inline">View</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 min-h-[44px] px-2 text-destructive hover:text-destructive"
                    onClick={() => {
                      deleteDocument(doc.id);
                      toast({ title: 'Document Deleted' });
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Document Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Enhanced Photo/File Preview */}
            {uploadForm.pendingFile && (
              <div className="p-3 bg-muted rounded-lg border border-border">
                {uploadForm.pendingFile.fileType.startsWith('image/') ? (
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-background">
                      <img
                        src={uploadForm.pendingFile.dataUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">
                          {uploadForm.pendingFile.fileName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(uploadForm.pendingFile.fileSize)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 min-h-[44px] min-w-[44px] p-0"
                        onClick={() =>
                          setUploadForm((prev) => ({ ...prev, pendingFile: null }))
                        }
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    {getFileIcon(uploadForm.pendingFile.fileType)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {uploadForm.pendingFile.fileName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(uploadForm.pendingFile.fileSize)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 min-h-[44px] min-w-[44px] p-0"
                      onClick={() =>
                        setUploadForm((prev) => ({ ...prev, pendingFile: null }))
                      }
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label>
                Document Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={uploadForm.documentType}
                onValueChange={(v) =>
                  setUploadForm((prev) => ({ ...prev, documentType: v as ClaimDocumentType }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(claimDocumentTypeLabels) as ClaimDocumentType[]).map(
                    (type) => (
                      <SelectItem key={type} value={type}>
                        {claimDocumentTypeLabels[type]}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Condition <span className="text-destructive">*</span>
              </Label>
              <Select
                value={uploadForm.condition}
                onValueChange={(v) =>
                  setUploadForm((prev) => ({ ...prev, condition: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition..." />
                </SelectTrigger>
                <SelectContent>
                  {allConditions.length > 0 ? (
                    allConditions.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="General">General</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Log symptoms first to see your conditions here
              </p>
            </div>

            <div className="space-y-2">
              <Label>Document Title (optional)</Label>
              <Input
                placeholder="e.g., Nexus Letter from Dr. Smith"
                value={uploadForm.title}
                onChange={(e) =>
                  setUploadForm((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="e.g., From VA appointment Jan 2026"
                value={uploadForm.notes}
                onChange={(e) =>
                  setUploadForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Document Date</Label>
              <Input
                type="date"
                value={uploadForm.date}
                onChange={(e) =>
                  setUploadForm((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsUploadOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleSubmitUpload}
                className="flex-1"
                disabled={!uploadForm.documentType || !uploadForm.condition || !uploadForm.pendingFile}
              >
                Save Document
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Document Modal */}
      <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{selectedDoc?.title || selectedDoc?.fileName}</DialogTitle>
          </DialogHeader>
          {selectedDoc && (
            <div className="space-y-4">
              <div className="flex items-center justify-center min-h-[300px] bg-muted rounded-lg">
                {selectedDoc.fileType.startsWith('image/') ? (
                  <img
                    src={selectedDoc.dataUrl}
                    alt={selectedDoc.title || selectedDoc.fileName}
                    className="max-h-[60vh] object-contain rounded-lg"
                  />
                ) : selectedDoc.fileType === 'application/pdf' ? (
                  <iframe
                    src={selectedDoc.dataUrl}
                    className="w-full h-[60vh] rounded-lg"
                    title={selectedDoc.title || selectedDoc.fileName}
                  />
                ) : (
                  <div className="text-center p-8">
                    <File className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">{selectedDoc.fileName}</p>
                    <Button className="mt-4" asChild>
                      <a href={selectedDoc.dataUrl} download={selectedDoc.fileName}>
                        <Download className="h-4 w-4 mr-2" />
                        Download File
                      </a>
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={getDocTypeColor(selectedDoc.documentType)}
                  >
                    {claimDocumentTypeLabels[selectedDoc.documentType]}
                  </Badge>
                  <Badge variant="secondary">{selectedDoc.condition}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(selectedDoc.date), 'MMMM d, yyyy')}
                </div>
              </div>
              {selectedDoc.notes && (
                <p className="text-sm text-muted-foreground">{selectedDoc.notes}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
