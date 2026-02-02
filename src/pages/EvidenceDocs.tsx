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
  X,
  FileCheck,
  Users,
  Stethoscope,
  Shield,
  ClipboardList,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  ClaimDocumentType,
  claimDocumentTypeLabels,
  claimDocumentTypeShort,
  formatFileSize,
  getDocTypeColor,
} from '@/types/claimDocuments';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const documentCategories: { type: ClaimDocumentType; label: string; icon: React.ElementType; description: string }[] = [
  { type: 'dbq', label: 'DBQs', icon: ClipboardList, description: 'Disability Benefits Questionnaires' },
  { type: 'nexus-letter', label: 'Nexus Letters', icon: FileCheck, description: 'Medical connection letters' },
  { type: 'buddy-statement', label: 'Buddy Statements', icon: Users, description: 'Witness statements' },
  { type: 'medical-records', label: 'Medical Records', icon: Stethoscope, description: 'Treatment documentation' },
  { type: 'service-records', label: 'Service Records', icon: Shield, description: 'Military service documents' },
  { type: 'cp-exam-results', label: 'C&P Exam Results', icon: FileText, description: 'Compensation exam results' },
  { type: 'personal-statement', label: 'Personal Statements', icon: MessageSquare, description: 'Your written statements' },
  { type: 'stressor-statement', label: 'Stressor Statements', icon: MessageSquare, description: 'PTSD stressor descriptions' },
  { type: 'private-medical-opinion', label: 'Private Medical Opinions', icon: FileText, description: 'Independent medical opinions' },
  { type: 'other', label: 'Other', icon: FolderOpen, description: 'Other supporting documents' },
];

export default function EvidenceDocs() {
  const { data } = useClaims();
  const {
    documents,
    addDocument,
    deleteDocument,
    getUniqueConditions,
    getDocumentsByType,
  } = useClaimDocuments();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<typeof documents[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDocType, setFilterDocType] = useState<string>('all');
  const [isDragging, setIsDragging] = useState(false);

  // Form state
  const [uploadForm, setUploadForm] = useState({
    documentType: '' as ClaimDocumentType | '',
    condition: '',
    title: '',
    notes: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    pendingFile: null as { dataUrl: string; fileName: string; fileType: string; fileSize: number } | null,
  });

  // Get conditions from claims context
  const conditionsFromSymptoms = Array.from(
    new Set(data.symptoms.map((s) => s.bodyArea).filter(Boolean))
  );
  const conditionsFromClaims = data.claimConditions.map((c) => c.name);
  const allConditions = Array.from(
    new Set([...conditionsFromSymptoms, ...conditionsFromClaims])
  ).sort();

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      searchQuery === '' ||
      doc.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDocType =
      filterDocType === 'all' || doc.documentType === filterDocType;

    return matchesSearch && matchesDocType;
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

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

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

  // Get category counts
  const getCategoryCounts = () => {
    const counts: Record<ClaimDocumentType, number> = {} as Record<ClaimDocumentType, number>;
    documentCategories.forEach(cat => {
      counts[cat.type] = getDocumentsByType(cat.type).length;
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  return (
    <div className="space-y-6 animate-fade-in overflow-x-hidden max-w-full pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="section-header mb-0">
          <div className="section-icon bg-primary/10">
            <FolderOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Evidence & Documents</h1>
            <p className="text-muted-foreground text-sm">
              Upload, categorize, and manage your VA claim evidence
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

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-6 sm:p-8 transition-all duration-200',
          'flex flex-col items-center justify-center gap-4',
          isDragging
            ? 'border-primary bg-primary/10'
            : 'border-border hover:border-primary/50 bg-muted/30'
        )}
      >
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10">
          <Upload className="h-7 w-7 text-primary" />
        </div>
        <div className="text-center">
          <p className="font-medium text-foreground">
            {isDragging ? 'Drop your file here' : 'Drag & drop files here'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            or use the buttons below to upload
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            onClick={() => cameraInputRef.current?.click()}
            className="h-12 sm:h-11 gap-2 text-sm font-semibold bg-primary hover:bg-primary/90 min-h-[48px]"
          >
            <Camera className="h-5 w-5" />
            Take Photo
          </Button>
          <Button 
            variant="outline"
            onClick={() => fileInputRef.current?.click()} 
            className="h-12 sm:h-11 gap-2 text-sm font-semibold min-h-[48px]"
          >
            <Upload className="h-5 w-5" />
            Choose File
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Supports images, PDFs, and documents up to 15MB
        </p>
      </div>

      {/* Document Categories Overview */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Document Categories</h2>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-3 pb-3">
            {documentCategories.map((cat) => {
              const count = categoryCounts[cat.type] || 0;
              return (
                <Card 
                  key={cat.type}
                  className={cn(
                    'flex-shrink-0 w-[140px] sm:w-[160px] cursor-pointer transition-all hover:border-primary/50',
                    filterDocType === cat.type && 'border-primary bg-primary/5'
                  )}
                  onClick={() => setFilterDocType(filterDocType === cat.type ? 'all' : cat.type)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center',
                        count > 0 ? 'bg-primary/10' : 'bg-muted'
                      )}>
                        <cat.icon className={cn(
                          'h-5 w-5',
                          count > 0 ? 'text-primary' : 'text-muted-foreground'
                        )} />
                      </div>
                      <div>
                        <p className="font-medium text-sm truncate">{cat.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {count} {count === 1 ? 'doc' : 'docs'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Stats Row */}
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
              <FileCheck className="h-6 w-6 text-success" />
              <div>
                <p className="text-xl font-bold">{categoryCounts['nexus-letter'] || 0}</p>
                <p className="text-xs text-muted-foreground">Nexus Letters</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="data-card">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-6 w-6 text-info" />
              <div>
                <p className="text-xl font-bold">{categoryCounts['dbq'] || 0}</p>
                <p className="text-xs text-muted-foreground">DBQs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="data-card">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-warning" />
              <div>
                <p className="text-xl font-bold">{categoryCounts['buddy-statement'] || 0}</p>
                <p className="text-xs text-muted-foreground">Buddy Letters</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
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
        {filterDocType !== 'all' && (
          <Button
            variant="outline"
            onClick={() => setFilterDocType('all')}
            className="gap-2 min-h-[48px]"
          >
            <X className="h-4 w-4" />
            Clear Filter
          </Button>
        )}
      </div>

      {/* Documents List */}
      {filteredDocuments.length === 0 ? (
        <Card className="data-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">
              {searchQuery || filterDocType !== 'all'
                ? 'No documents match your filters.'
                : 'No documents uploaded yet.'}
            </p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Upload evidence to support your VA claim.
            </p>
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
                    className="flex-1 h-10 min-h-[44px] text-xs"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-10 min-h-[44px] px-3 text-destructive hover:text-destructive"
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
        <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Document Details</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-4 py-2">
              {/* File Preview */}
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
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-background flex items-center justify-center">
                        {getFileIcon(uploadForm.pendingFile.fileType)}
                      </div>
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
                  )}
                </div>
              )}

              {/* Document Type */}
              <div className="space-y-2">
                <Label>Document Type *</Label>
                <Select
                  value={uploadForm.documentType}
                  onValueChange={(value) =>
                    setUploadForm((prev) => ({ ...prev, documentType: value as ClaimDocumentType }))
                  }
                >
                  <SelectTrigger className="min-h-[48px]">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(claimDocumentTypeLabels) as ClaimDocumentType[]).map((type) => (
                      <SelectItem key={type} value={type}>
                        {claimDocumentTypeLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Condition */}
              <div className="space-y-2">
                <Label>Related Condition *</Label>
                <Select
                  value={uploadForm.condition}
                  onValueChange={(value) =>
                    setUploadForm((prev) => ({ ...prev, condition: value }))
                  }
                >
                  <SelectTrigger className="min-h-[48px]">
                    <SelectValue placeholder="Select condition" />
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
                {allConditions.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add conditions on the Dashboard to categorize documents.
                  </p>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label>Title (Optional)</Label>
                <Input
                  placeholder="e.g., Nexus Letter from Dr. Smith"
                  value={uploadForm.title}
                  onChange={(e) =>
                    setUploadForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label>Document Date</Label>
                <Input
                  type="date"
                  value={uploadForm.date}
                  onChange={(e) =>
                    setUploadForm((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="min-h-[48px]"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  placeholder="Add any relevant notes about this document..."
                  value={uploadForm.notes}
                  onChange={(e) =>
                    setUploadForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  rows={3}
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsUploadOpen(false)}
              className="min-h-[48px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitUpload}
              disabled={!uploadForm.documentType || !uploadForm.condition || !uploadForm.pendingFile}
              className="min-h-[48px]"
            >
              Save Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Document Modal */}
      <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="truncate pr-8">
              {selectedDoc?.title || selectedDoc?.fileName}
            </DialogTitle>
          </DialogHeader>
          {selectedDoc && (
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-2">
                {/* Document Preview */}
                <div className="rounded-lg overflow-hidden bg-muted">
                  {selectedDoc.fileType.startsWith('image/') ? (
                    <img
                      src={selectedDoc.dataUrl}
                      alt={selectedDoc.title || selectedDoc.fileName}
                      className="w-full h-auto max-h-[50vh] object-contain"
                    />
                  ) : selectedDoc.fileType === 'application/pdf' ? (
                    <div className="aspect-[4/3] flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">PDF Preview</p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = selectedDoc.dataUrl;
                            link.download = selectedDoc.fileName;
                            link.click();
                          }}
                          className="min-h-[48px]"
                        >
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[4/3] flex items-center justify-center">
                      <div className="text-center">
                        <File className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">{selectedDoc.fileName}</p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = selectedDoc.dataUrl;
                            link.download = selectedDoc.fileName;
                            link.click();
                          }}
                          className="min-h-[48px]"
                        >
                          Download File
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Document Details */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className={`${getDocTypeColor(selectedDoc.documentType)}`}
                    >
                      {claimDocumentTypeLabels[selectedDoc.documentType]}
                    </Badge>
                    <Badge variant="secondary">{selectedDoc.condition}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {format(new Date(selectedDoc.date), 'MMMM d, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">File Size</p>
                      <p className="font-medium">{formatFileSize(selectedDoc.fileSize)}</p>
                    </div>
                  </div>

                  {selectedDoc.notes && (
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Notes</p>
                      <p className="text-sm">{selectedDoc.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="pt-4 border-t">
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedDoc) {
                  deleteDocument(selectedDoc.id);
                  setSelectedDoc(null);
                  toast({ title: 'Document Deleted' });
                }
              }}
              className="min-h-[48px]"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
