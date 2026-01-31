import { useClaims } from '@/context/ClaimsContext';
import { FileCheck, Check, Clock, AlertCircle, FileText, Plus, Minus, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { exportDocuments } from '@/utils/pdfExport';
import type { DocumentItem } from '@/types/claims';

const statuses = ['Not Started', 'In Progress', 'Obtained', 'Submitted'] as const;

export default function Documents() {
  const { data, updateDocument } = useClaims();

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

  const handleIncrement = (doc: DocumentItem) => {
    updateDocument(doc.id, { count: (doc.count || 0) + 1 });
  };

  const handleDecrement = (doc: DocumentItem) => {
    if ((doc.count || 0) > 0) {
      updateDocument(doc.id, { count: (doc.count || 0) - 1 });
    }
  };

  const totalDocuments = data.documents.reduce((sum, doc) => sum + (doc.count || 0), 0);
  const progress = {
    completed: data.documents.filter(d => d.status === 'Obtained' || d.status === 'Submitted').length,
    inProgress: data.documents.filter(d => d.status === 'In Progress').length,
    notStarted: data.documents.filter(d => d.status === 'Not Started').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="section-header mb-0">
          <div className="section-icon bg-documents/10">
            <FileCheck className="h-5 w-5 text-documents" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Documents Checklist</h1>
            <p className="text-muted-foreground">Track important documents for your claim</p>
          </div>
        </div>
        
        <Button variant="outline" onClick={() => exportDocuments(data.documents)} className="gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {/* Progress Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="data-card border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{totalDocuments}</p>
                <p className="text-sm text-muted-foreground">Total Copies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="data-card border-success/20 bg-success/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Check className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{progress.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="data-card border-warning/20 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">{progress.inProgress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="data-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{progress.notStarted}</p>
                <p className="text-sm text-muted-foreground">Not Started</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {data.documents.map((doc) => (
          <Card key={doc.id} className={`data-card border ${getStatusColor(doc.status)}`}>
            <CardContent className="py-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-start gap-3 flex-1">
                  {getStatusIcon(doc.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">{doc.name}</h3>
                      {(doc.count || 0) > 0 && (
                        <Badge variant="secondary" className="font-mono">
                          {doc.count} {doc.count === 1 ? 'copy' : 'copies'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 lg:items-center">
                  {/* Count Controls */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDecrement(doc)}
                      disabled={(doc.count || 0) === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-10 text-center font-mono text-sm">
                      {doc.count || 0}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleIncrement(doc)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Select 
                    value={doc.status} 
                    onValueChange={(value: typeof statuses[number]) => updateDocument(doc.id, { status: value })}
                  >
                    <SelectTrigger className="w-[140px]">
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
                    className="w-full sm:w-[200px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips */}
      <Card className="data-card bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-base text-primary">Tips for Gathering Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-foreground/80">
          <p>• <strong>STRs:</strong> Request from the National Personnel Records Center (NPRC) or your local MTF</p>
          <p>• <strong>DD-214:</strong> If lost, request from eBenefits or NPRC (SF-180 form)</p>
          <p>• <strong>Personnel Records:</strong> Request via vMPF or AFPC</p>
          <p>• <strong>Buddy Statements:</strong> VA Form 21-10210 - Lay/Witness Statement (collect multiple!)</p>
          <p>• <strong>Nexus Letters:</strong> Get one for each condition you're claiming - consider multiple opinions</p>
        </CardContent>
      </Card>
    </div>
  );
}
