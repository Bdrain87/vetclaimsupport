import { useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClaims } from '@/hooks/useClaims';
import { useUserConditions } from '@/hooks/useUserConditions';
import { useClaimDocuments } from '@/hooks/useClaimDocuments';
import { getConditionById } from '@/data/vaConditions';
import {
  FolderOpen,
  Upload,
  Camera,
  Search,
  Image as ImageIcon,
  FileText,
  File,
  Trash2,
  Eye,
  X,
  FileCheck,
  Users,
  Stethoscope,
  Shield,
  ClipboardList,
  MessageSquare,
  Check,
  Clock,
  AlertCircle,
  Plus,
  Minus,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  Sparkles,
  ChevronRight,
  ListChecks,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
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
import { useToast } from '@/hooks/use-toast';
import {
  ClaimDocumentType,
  claimDocumentTypeLabels,
  claimDocumentTypeShort,
  formatFileSize,
  getDocTypeColor,
} from '@/types/claimDocuments';
import { exportDocuments } from '@/utils/pdfExport';
import { DocumentScanner } from '@/components/documents/DocumentScanner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { DocumentTypeId } from '@/types/claims';
import { PageContainer } from '@/components/PageContainer';

// Tab configuration
const tabConfig = [
  { value: 'overview', label: 'Overview', icon: FolderOpen },
  { value: 'my-docs', label: 'My Documents', icon: FileText },
  { value: 'checklist', label: 'Checklist', icon: ListChecks },
  { value: 'templates', label: 'Templates', icon: FileSpreadsheet },
];

// Document categories for evidence
const documentCategories: { type: ClaimDocumentType; label: string; icon: React.ElementType; description: string }[] = [
  { type: 'dbq', label: 'DBQs', icon: ClipboardList, description: 'Disability Benefits Questionnaires' },
  { type: 'nexus-letter', label: 'Doctor Summaries', icon: FileCheck, description: 'Medical connection letters' },
  { type: 'buddy-statement', label: 'Buddy Statements', icon: Users, description: 'Witness statements' },
  { type: 'medical-records', label: 'Medical Records', icon: Stethoscope, description: 'Treatment documentation' },
  { type: 'service-records', label: 'Service Records', icon: Shield, description: 'Military service documents' },
  { type: 'cp-exam-results', label: 'C&P Exam Results', icon: FileText, description: 'Compensation exam results' },
  { type: 'personal-statement', label: 'Personal Statements', icon: MessageSquare, description: 'Your written statements' },
  { type: 'stressor-statement', label: 'Stressor Statements', icon: MessageSquare, description: 'PTSD stressor descriptions' },
  { type: 'private-medical-opinion', label: 'Private Medical Opinions', icon: FileText, description: 'Independent medical opinions' },
  { type: 'other', label: 'Other', icon: FolderOpen, description: 'Other supporting documents' },
];

// Checklist statuses
const statuses = ['Not Started', 'In Progress', 'Obtained', 'Submitted'] as const;

// Map document names to document type IDs
const documentTypeMap: Record<string, DocumentTypeId> = {
  'Service Treatment Records (STRs)': 'str',
  'DD-214': 'dd214',
  'Personnel Records': 'personnel',
  'Medical Records (Post-Service)': 'medical-records',
  'Doctor Summaries': 'nexus',
  'Buddy Statements': 'buddy-statement',
};

// Statement templates
const statementTemplates = [
  {
    id: 'personal',
    title: 'Personal Statement',
    description: 'Describe your condition and its impact on your life',
    icon: MessageSquare,
    gradient: 'from-gold/20 to-gold-hl/10',
    borderColor: 'border-gold/30',
    iconColor: 'text-gold-hl',
  },
  {
    id: 'buddy-request',
    title: 'Buddy Statement Request',
    description: 'Email template to request statements from witnesses',
    icon: Users,
    gradient: 'from-gold/20 to-gold/10',
    borderColor: 'border-gold/30',
    iconColor: 'text-gold-hl',
  },
  {
    id: 'stressor',
    title: 'Stressor Statement',
    description: 'Document traumatic events for PTSD claims',
    icon: Shield,
    gradient: 'from-red-500/20 to-rose-500/10',
    borderColor: 'border-red-500/30',
    iconColor: 'text-red-400',
  },
];

export default function DocumentsHub() {
  const navigate = useNavigate();
  const { data, updateDocument, addUploadedDocument, deleteUploadedDocument } = useClaims();
  const { conditions: userConditions } = useUserConditions();
  const {
    documents: claimDocuments,
    addDocument,
    deleteDocument,
    getDocumentsByType,
  } = useClaimDocuments();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDocType, setFilterDocType] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<typeof claimDocuments[0] | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Form state for uploads
  const [uploadForm, setUploadForm] = useState({
    documentType: '' as ClaimDocumentType | '',
    condition: '',
    title: '',
    notes: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    pendingFile: null as { dataUrl: string; fileName: string; fileType: string; fileSize: number } | null,
  });

  // Get conditions from all sources (useAppStore via adapter hooks)
  const allConditions = useMemo(() => {
    const names = new Set<string>();
    data.symptoms.forEach(s => { if (s.bodyArea) names.add(s.bodyArea); });
    data.claimConditions.forEach(c => names.add(c.name));
    userConditions.forEach(uc => {
      const details = getConditionById(uc.conditionId);
      if (details?.name) names.add(details.name);
    });
    return Array.from(names).sort();
  }, [data.symptoms, data.claimConditions, userConditions]);

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return claimDocuments.filter((doc) => {
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
  }, [claimDocuments, searchQuery, filterDocType]);

  // Calculate stats
  const stats = useMemo(() => {
    const categoryCounts: Record<ClaimDocumentType, number> = {} as Record<ClaimDocumentType, number>;
    documentCategories.forEach(cat => {
      categoryCounts[cat.type] = getDocumentsByType(cat.type).length;
    });

    const checklistProgress = {
      completed: data.documents.filter(d => d.status === 'Obtained' || d.status === 'Submitted').length,
      inProgress: data.documents.filter(d => d.status === 'In Progress').length,
      notStarted: data.documents.filter(d => d.status === 'Not Started').length,
      total: data.documents.length,
    };

    return {
      totalDocuments: claimDocuments.length,
      categoryCounts,
      checklistProgress,
    };
  }, [claimDocuments, data.documents, getDocumentsByType]);

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
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
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
      description: `${pendingFile.fileName} saved successfully.`,
    });

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

  // Status helpers for checklist
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Submitted': return <Check className="h-4 w-4 text-success" />;
      case 'Obtained': return <FileText className="h-4 w-4 text-primary" />;
      case 'In Progress': return <Clock className="h-4 w-4 text-warning" />;
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-success/10 border-success/20';
      case 'Obtained': return 'bg-primary/10 border-primary/20';
      case 'In Progress': return 'bg-warning/10 border-warning/20';
      default: return 'bg-muted/50 border-border';
    }
  };

  const getDocumentTypeId = (docName: string): DocumentTypeId => {
    return documentTypeMap[docName] || 'other';
  };

  const getUploadedDocsForType = (docType: DocumentTypeId) => {
    return data.uploadedDocuments.filter(doc => doc.documentType === docType);
  };

  return (
    <PageContainer className="space-y-6 animate-fade-in">
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-150 opacity-50" />
            <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-lg shadow-primary/10">
              <FolderOpen className="h-7 w-7 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Documents
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Organize evidence and track required documents
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 rounded-2xl" />

          <TabsList className="relative w-full h-auto p-1.5 bg-transparent grid grid-cols-2 sm:grid-cols-4 gap-1">
            {tabConfig.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 px-2 sm:px-4 rounded-xl",
                  "text-xs sm:text-sm font-medium transition-all duration-300",
                  "data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:shadow-primary/10",
                  "data-[state=active]:border data-[state=active]:border-primary/20",
                  "hover:bg-background/50"
                )}
              >
                <tab.icon className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5 transition-colors",
                  activeTab === tab.value ? "text-primary" : "text-muted-foreground"
                )} />
                <span className="hidden xs:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-0">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setActiveTab('my-docs')}
              className="group p-4 rounded-2xl bg-gradient-to-br from-gold/20 to-gold-hl/10 border border-gold/30 hover:scale-[1.02] transition-all text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <Upload className="h-5 w-5 text-gold-hl" />
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </div>
              <h3 className="font-semibold text-sm">Upload Document</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Add evidence files</p>
            </button>

            <button
              onClick={() => setActiveTab('checklist')}
              className="group p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 border border-emerald-500/30 hover:scale-[1.02] transition-all text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <ListChecks className="h-5 w-5 text-emerald-400" />
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </div>
              <h3 className="font-semibold text-sm">View Checklist</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Track progress</p>
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className="group p-4 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/10 border border-gold/30 hover:scale-[1.02] transition-all text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <FileSpreadsheet className="h-5 w-5 text-gold-hl" />
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </div>
              <h3 className="font-semibold text-sm">Templates</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Statement guides</p>
            </button>

            <button
              onClick={() => exportDocuments(data.documents)}
              className="group p-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/30 hover:scale-[1.02] transition-all text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <Download className="h-5 w-5 text-violet-400" />
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </div>
              <h3 className="font-semibold text-sm">Export PDF</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Download report</p>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FolderOpen className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-3xl font-bold">{stats.totalDocuments}</p>
                    <p className="text-sm text-muted-foreground">Total Docs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                  <div>
                    <p className="text-3xl font-bold">{stats.checklistProgress.completed}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-warning" />
                  <div>
                    <p className="text-3xl font-bold">{stats.checklistProgress.inProgress}</p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-3xl font-bold">{stats.checklistProgress.notStarted}</p>
                    <p className="text-sm text-muted-foreground">Not Started</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Document Categories */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Document Categories</h2>
            <ScrollArea className="w-full">
              <div className="flex gap-3 pb-3">
                {documentCategories.slice(0, 6).map((cat) => {
                  const count = stats.categoryCounts[cat.type] || 0;
                  return (
                    <Card
                      key={cat.type}
                      className={cn(
                        'flex-shrink-0 w-[140px] cursor-pointer transition-all hover:border-primary/50',
                        count > 0 ? 'border-primary/20 bg-primary/5' : ''
                      )}
                      onClick={() => {
                        setFilterDocType(cat.type);
                        setActiveTab('my-docs');
                      }}
                    >
                      <CardContent className="p-4 text-center">
                        <div className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2',
                          count > 0 ? 'bg-primary/10' : 'bg-muted'
                        )}>
                          <cat.icon className={cn(
                            'h-5 w-5',
                            count > 0 ? 'text-primary' : 'text-muted-foreground'
                          )} />
                        </div>
                        <p className="font-medium text-sm">{cat.label}</p>
                        <p className="text-xs text-muted-foreground">{count} docs</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* VA Tip */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Key Evidence for VA Claims</h3>
                  <p className="text-xs text-muted-foreground">
                    <strong>Doctor summaries</strong> are often the most important evidence for service connection.
                    They should clearly state that your condition is "at least as likely as not" (50%+) related to service.
                    Get one for each condition you're claiming.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Documents Tab */}
        <TabsContent value="my-docs" className="space-y-6 mt-0">
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

          {/* Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'relative border-2 border-dashed rounded-2xl p-6 transition-all duration-200',
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
              <p className="font-medium">
                {isDragging ? 'Drop your file here' : 'Drag & drop files here'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or use the buttons below
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={() => cameraInputRef.current?.click()}
                className="gap-2"
              >
                <Camera className="h-4 w-4" />
                Take Photo
              </Button>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Choose File
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Supports images, PDFs, and documents up to 15MB
            </p>
            <p className="text-xs text-gold/80 mt-1">
              Documents are stored locally on this device only and are not synced to the cloud. Use Settings &gt; Export Backup regularly.
            </p>
          </div>

          {/* Search and Filter */}
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
            <Select value={filterDocType} onValueChange={setFilterDocType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {documentCategories.map((cat) => (
                  <SelectItem key={cat.type} value={cat.type}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filterDocType !== 'all' && (
              <Button variant="ghost" size="icon" onClick={() => setFilterDocType('all')} aria-label="Clear filter">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Document Grid */}
          {filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FolderOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery || filterDocType !== 'all'
                    ? 'No documents match your filters.'
                    : 'No documents uploaded yet.'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload evidence to support your VA claim.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {filteredDocuments.map((doc) => (
                <Card
                  key={doc.id}
                  className="group hover:border-primary/50 transition-colors cursor-pointer overflow-hidden"
                  onClick={() => setSelectedDoc(doc)}
                >
                  <CardContent className="p-3">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted mb-2">
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

                    <div className="space-y-1">
                      <Badge variant="outline" className={`text-[10px] ${getDocTypeColor(doc.documentType)}`}>
                        {claimDocumentTypeShort[doc.documentType]}
                      </Badge>
                      <p className="font-medium text-sm truncate">{doc.condition}</p>
                      {doc.title && (
                        <p className="text-xs text-muted-foreground truncate">{doc.title}</p>
                      )}
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>{format(new Date(doc.date), 'MMM d, yyyy')}</span>
                        <span>{formatFileSize(doc.fileSize)}</span>
                      </div>
                    </div>

                    <div className="flex gap-1 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoc(doc);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDocument(doc.id);
                          toast({ title: 'Document Deleted' });
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Checklist Tab */}
        <TabsContent value="checklist" className="space-y-6 mt-0">
          {/* Progress Summary */}
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-xl font-bold">{data.documents.reduce((sum, doc) => sum + (doc.count || 0), 0)}</p>
                    <p className="text-xs text-muted-foreground">Total Copies</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-success/20 bg-success/5">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-3">
                  <Check className="h-6 w-6 text-success" />
                  <div>
                    <p className="text-xl font-bold">{stats.checklistProgress.completed}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-warning/20 bg-warning/5">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-warning" />
                  <div>
                    <p className="text-xl font-bold">{stats.checklistProgress.inProgress}</p>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="text-xl font-bold">{stats.checklistProgress.notStarted}</p>
                    <p className="text-xs text-muted-foreground">Not Started</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documents List */}
          <div className="space-y-3">
            {data.documents.map((doc) => {
              const docTypeId = getDocumentTypeId(doc.name);
              const uploadedForType = getUploadedDocsForType(docTypeId);

              return (
                <Card key={doc.id} className={`border ${getStatusColor(doc.status)}`}>
                  <CardContent className="py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        {getStatusIcon(doc.status)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-medium">{doc.name}</h3>
                            {(doc.count || 0) > 0 && (
                              <Badge variant="secondary" className="font-mono">
                                {doc.count} {doc.count === 1 ? 'copy' : 'copies'}
                              </Badge>
                            )}
                            {uploadedForType.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {uploadedForType.length} scanned
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{doc.description}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 lg:items-center">
                        <DocumentScanner
                          documents={data.uploadedDocuments}
                          documentType={docTypeId}
                          onAdd={addUploadedDocument}
                          onDelete={deleteUploadedDocument}
                        />

                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10"
                            onClick={() => {
                              if ((doc.count || 0) > 0) {
                                updateDocument(doc.id, { count: (doc.count || 0) - 1 });
                              }
                            }}
                            disabled={(doc.count || 0) === 0}
                            aria-label="Decrease document count"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <div className="w-10 text-center font-mono" aria-label={`Document count: ${doc.count || 0}`}>{doc.count || 0}</div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10"
                            onClick={() => updateDocument(doc.id, { count: (doc.count || 0) + 1 })}
                            aria-label="Increase document count"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Select
                          value={doc.status}
                          onValueChange={(value: typeof statuses[number]) => updateDocument(doc.id, { status: value })}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((status) => (
                              <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Input
                          placeholder="Notes..."
                          value={doc.notes}
                          onChange={(e) => updateDocument(doc.id, { notes: e.target.value })}
                          className="w-full sm:w-[180px]"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Tips */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-primary">Tips for Gathering Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-foreground/80">
              <p>• <strong>STRs:</strong> Request from NPRC or your local MTF</p>
              <p>• <strong>DD-214:</strong> If lost, request from eBenefits or NPRC (SF-180 form)</p>
              <p>• <strong>Personnel Records:</strong> Request via vMPF or AFPC</p>
              <p>• <strong>Buddy Statements:</strong> VA Form 21-10210 - collect multiple!</p>
              <p>• <strong>Doctor Summaries:</strong> Get one for each condition you're claiming</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6 mt-0">
          <div className="grid gap-4 md:grid-cols-3">
            {statementTemplates.map((template) => (
              <Card
                key={template.id}
                className={cn(
                  "cursor-pointer transition-all hover:scale-[1.02]",
                  "bg-gradient-to-br", template.gradient,
                  "border", template.borderColor
                )}
                onClick={() => {
                  // Navigate to claim tools for the template
                  navigate('/prep');
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-xl bg-background/50 border border-white/10")}>
                      <template.icon className={cn("h-6 w-6", template.iconColor)} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{template.title}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Statement Writing Tips</h3>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Be specific with dates, locations, and details</li>
                    <li>• Use "I" statements and describe what you personally observed</li>
                    <li>• Describe how the condition affects daily life and work</li>
                    <li>• Include any witnesses who can corroborate your account</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {uploadForm.pendingFile && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                {getFileIcon(uploadForm.pendingFile.fileType)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{uploadForm.pendingFile.fileName}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(uploadForm.pendingFile.fileSize)}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Document Type *</Label>
              <Select
                value={uploadForm.documentType}
                onValueChange={(v) => setUploadForm(p => ({ ...p, documentType: v as ClaimDocumentType }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {documentCategories.map((cat) => (
                    <SelectItem key={cat.type} value={cat.type}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Related Condition *</Label>
              <Select
                value={uploadForm.condition}
                onValueChange={(v) => setUploadForm(p => ({ ...p, condition: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {allConditions.map((condition) => (
                    <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                  ))}
                  <SelectItem value="General">General / Multiple</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Title (optional)</Label>
              <Input
                placeholder="e.g., Doctor Summary from Dr. Smith"
                value={uploadForm.title}
                onChange={(e) => setUploadForm(p => ({ ...p, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={uploadForm.date}
                onChange={(e) => setUploadForm(p => ({ ...p, date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Any additional notes..."
                value={uploadForm.notes}
                onChange={(e) => setUploadForm(p => ({ ...p, notes: e.target.value }))}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitUpload}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Preview Dialog */}
      <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{selectedDoc?.title || selectedDoc?.fileName}</DialogTitle>
          </DialogHeader>

          {selectedDoc && (
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                {selectedDoc.thumbnailUrl || selectedDoc.dataUrl ? (
                  <img
                    src={selectedDoc.thumbnailUrl || selectedDoc.dataUrl}
                    alt={selectedDoc.title || selectedDoc.fileName}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getFileIcon(selectedDoc.fileType)}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium">{claimDocumentTypeLabels[selectedDoc.documentType]}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Condition</p>
                  <p className="font-medium">{selectedDoc.condition}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{format(new Date(selectedDoc.date), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Size</p>
                  <p className="font-medium">{formatFileSize(selectedDoc.fileSize)}</p>
                </div>
              </div>

              {selectedDoc.notes && (
                <div>
                  <p className="text-muted-foreground text-sm">Notes</p>
                  <p className="text-sm">{selectedDoc.notes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedDoc) {
                  deleteDocument(selectedDoc.id);
                  setSelectedDoc(null);
                  toast({ title: 'Document Deleted' });
                }
              }}
            >
              Delete
            </Button>
            <Button variant="outline" onClick={() => setSelectedDoc(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
