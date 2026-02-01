import { useState, useRef, useCallback } from 'react';
import { useEvidence } from '@/context/EvidenceContext';
import { useClaims } from '@/context/ClaimsContext';
import { 
  FileArchive, Upload, Search, Filter, Image as ImageIcon, FileText, 
  File, Trash2, Eye, Link2, FolderOpen, AlertTriangle, CheckCircle2,
  Stethoscope, Users, User, Folder, X, Edit, Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { EvidenceDocument, DocumentCategory } from '@/types/documents';
import { 
  documentCategoryLabels, 
  suggestCategoryFromFilename, 
  formatFileSize,
  conditionDocumentRequirements 
} from '@/types/documents';

const categoryIcons: Record<DocumentCategory, typeof Stethoscope> = {
  'medical-records': Stethoscope,
  'service-documents': FileText,
  'personal-statements': User,
  'buddy-letters': Users,
  'photos': ImageIcon,
  'other': Folder,
};

export default function EvidenceLibrary() {
  const { documents, addDocument, updateDocument, deleteDocument, getCategoryCounts } = useEvidence();
  const { data } = useClaims();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<DocumentCategory | 'all'>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<EvidenceDocument | null>(null);
  const [editingDoc, setEditingDoc] = useState<EvidenceDocument | null>(null);

  const categoryCounts = getCategoryCounts();
  const totalDocuments = documents.length;

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle file upload
  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: `${file.name} exceeds 10MB limit.`,
          variant: 'destructive',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const suggestedCategory = suggestCategoryFromFilename(file.name);
        
        const newDoc: Omit<EvidenceDocument, 'id' | 'storageType'> = {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          dataUrl,
          uploadedAt: new Date().toISOString(),
          category: suggestedCategory,
          title: file.name.replace(/\.[^/.]+$/, ''),
          linkedEntries: [],
          autoSuggestedCategory: suggestedCategory,
        };

        if (file.type.startsWith('image/')) {
          (newDoc as any).thumbnailUrl = dataUrl;
        }

        addDocument(newDoc);
        
        toast({
          title: 'Document Uploaded',
          description: `${file.name} added to ${documentCategoryLabels[suggestedCategory]}.`,
        });
      };
      reader.readAsDataURL(file);
    });
  }, [addDocument, toast]);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // Get file icon
  const getFileIcon = (doc: EvidenceDocument) => {
    if (doc.fileType.startsWith('image/')) return <ImageIcon className="h-5 w-5" />;
    if (doc.fileType === 'application/pdf') return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  // Get missing documents for claimed conditions
  const getMissingDocuments = () => {
    const missing: { condition: string; docs: typeof conditionDocumentRequirements.default }[] = [];
    
    data.claimConditions.forEach(condition => {
      const condName = condition.name.toLowerCase();
      let requirements = conditionDocumentRequirements.default;
      
      if (condName.includes('ptsd')) {
        requirements = conditionDocumentRequirements.PTSD;
      } else if (condName.includes('mental') || condName.includes('depression') || condName.includes('anxiety')) {
        requirements = conditionDocumentRequirements['Mental Health'];
      } else if (condName.includes('hearing') || condName.includes('tinnitus')) {
        requirements = conditionDocumentRequirements.Hearing;
      } else if (condName.includes('back') || condName.includes('spine')) {
        requirements = conditionDocumentRequirements.Back;
      }
      
      // Filter out documents that exist for this condition
      const conditionDocs = documents.filter(d => 
        d.linkedEntries.some(l => l.entryId === condition.id)
      );
      
      const missingReqs = requirements.filter(req => 
        !conditionDocs.some(d => d.category === req.category)
      );
      
      if (missingReqs.length > 0) {
        missing.push({ condition: condition.name, docs: missingReqs });
      }
    });
    
    return missing;
  };

  const missingDocs = getMissingDocuments();

  return (
    <div className="space-y-6 animate-fade-in overflow-x-hidden max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="section-header mb-0">
          <div className="section-icon bg-primary/10">
            <FileArchive className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Evidence Library</h1>
            <p className="text-muted-foreground text-sm">Central hub for all your claim evidence</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />
          <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        <Card 
          className={`data-card cursor-pointer transition-all ${activeCategory === 'all' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="text-lg font-bold">{totalDocuments}</p>
                <p className="text-xs text-muted-foreground">All Files</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {(Object.keys(documentCategoryLabels) as DocumentCategory[]).map(cat => {
          const Icon = categoryIcons[cat];
          return (
            <Card 
              key={cat}
              className={`data-card cursor-pointer transition-all ${activeCategory === cat ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-bold">{categoryCounts[cat]}</p>
                    <p className="text-xs text-muted-foreground truncate">{documentCategoryLabels[cat].split(' ')[0]}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Missing Documents Alert */}
      {missingDocs.length > 0 && (
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Missing Evidence for Your Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {missingDocs.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <p className="font-medium text-sm">{item.condition}</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.docs.slice(0, 3).map((doc, i) => (
                    <Badge 
                      key={i} 
                      variant={doc.priority === 'critical' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {doc.documentType}
                    </Badge>
                  ))}
                  {item.docs.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.docs.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Search and Drag Zone */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Drop Zone */}
        <div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
            ${isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/30 hover:border-primary/50'
            }
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className={`h-10 w-10 mx-auto mb-3 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
          <p className="font-medium text-foreground">
            {isDragging ? 'Drop files here' : 'Drag & drop files or click to upload'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            PDFs, images, and documents up to 10MB
          </p>
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <Card className="data-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileArchive className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">
              {searchQuery ? 'No documents match your search.' : 'No documents uploaded yet.'}
            </p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Upload evidence files to build your claim.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDocuments.map(doc => (
            <Card key={doc.id} className="data-card hover:border-primary/50 transition-colors group">
              <CardContent className="p-3">
                {/* Thumbnail/Preview */}
                <div 
                  className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted mb-3 cursor-pointer"
                  onClick={() => setSelectedDoc(doc)}
                >
                  {doc.thumbnailUrl ? (
                    <img 
                      src={doc.thumbnailUrl} 
                      alt={doc.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getFileIcon(doc)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <p className="font-medium text-sm truncate" title={doc.title}>{doc.title}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {documentCategoryLabels[doc.category].split(' ')[0]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatFileSize(doc.fileSize)}</span>
                  </div>
                  {doc.linkedEntries.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Link2 className="h-3 w-3" />
                      <span>Linked to {doc.linkedEntries.length} {doc.linkedEntries.length === 1 ? 'entry' : 'entries'}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-1 mt-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 h-8"
                    onClick={() => setEditingDoc(doc)}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-destructive hover:text-destructive"
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

      {/* Preview Modal */}
      <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{selectedDoc?.title}</DialogTitle>
          </DialogHeader>
          {selectedDoc && (
            <div className="space-y-4">
              <div className="flex items-center justify-center min-h-[300px] bg-muted rounded-lg">
                {selectedDoc.fileType.startsWith('image/') ? (
                  <img 
                    src={selectedDoc.dataUrl} 
                    alt={selectedDoc.title}
                    className="max-h-[60vh] object-contain rounded-lg"
                  />
                ) : selectedDoc.fileType === 'application/pdf' ? (
                  <iframe
                    src={selectedDoc.dataUrl}
                    className="w-full h-[60vh] rounded-lg"
                    title={selectedDoc.title}
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
                  <Badge variant="outline">{documentCategoryLabels[selectedDoc.category]}</Badge>
                  <span className="text-sm text-muted-foreground">{formatFileSize(selectedDoc.fileSize)}</span>
                  <span className="text-sm text-muted-foreground">
                    Uploaded {new Date(selectedDoc.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
                {selectedDoc.linkedEntries.length > 0 && (
                  <Badge variant="secondary">
                    <Link2 className="h-3 w-3 mr-1" />
                    {selectedDoc.linkedEntries.length} linked entries
                  </Badge>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editingDoc} onOpenChange={() => setEditingDoc(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
          </DialogHeader>
          {editingDoc && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingDoc.title}
                  onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={editingDoc.category}
                  onValueChange={(value: DocumentCategory) => setEditingDoc({ ...editingDoc, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(documentCategoryLabels) as DocumentCategory[]).map(cat => (
                      <SelectItem key={cat} value={cat}>{documentCategoryLabels[cat]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={editingDoc.description || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, description: e.target.value })}
                  placeholder="Add notes about this document..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setEditingDoc(null)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  updateDocument(editingDoc.id, {
                    title: editingDoc.title,
                    category: editingDoc.category,
                    description: editingDoc.description,
                  });
                  setEditingDoc(null);
                  toast({ title: 'Document Updated' });
                }}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Privacy Notice */}
      <Card className="data-card bg-muted/50">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">100% Local Storage - Your Data Never Leaves Your Device</p>
              <p className="text-xs text-muted-foreground">
                All documents are stored locally using IndexedDB for large files and localStorage for smaller ones. 
                No data is ever uploaded to any external server. Your veteran medical information stays completely private.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
