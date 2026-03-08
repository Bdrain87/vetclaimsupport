import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClaims } from '@/hooks/useClaims';
import { useProfileStore } from '@/store/useProfileStore';
import { Users, Plus, Trash2, Edit, Phone, Mail, FileText, CheckCircle, Clock, Send, Download, Camera, Copy, Check, ChevronRight, ChevronLeft, HelpCircle, Loader2, Share2, Activity } from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { exportBuddyContacts, exportBuddyStatement } from '@/utils/pdfExport';
import { saveToVault } from '@/utils/vaultAutoSave';
import { markJourneyItem } from '@/utils/journeySync';
import { ToastAction } from '@/components/ui/toast';
import { DocumentUploader } from '@/components/documents/DocumentUploader';
import { useToast } from '@/hooks/use-toast';
import { useEvidence } from '@/hooks/useEvidence';
import { EvidenceAttachment } from '@/components/shared/EvidenceAttachment';
import type { BuddyContact } from '@/types/claims';
import { createBuddyShareLink, shareBuddyLink } from '@/services/buddyShare';
import { PageContainer } from '@/components/PageContainer';
import { EmptyState } from '@/components/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DraftRestoredBanner } from '@/components/ui/DraftRestoredBanner';
import { useToolDraft } from '@/hooks/useToolDraft';

const statementStatuses = ['Not Requested', 'Requested', 'Received', 'Submitted'] as const;

interface StatementData {
  witnessName: string;
  witnessRelationship: string;
  veteranName: string;
  howKnown: string;
  datesKnown: string;
  conditionWitnessed: string;
  specificObservations: string;
  impactOnLife: string;
  frequencyWitnessed: string;
  additionalDetails: string;
  witnessContact: string;
  willingToTestify: string;
}

const initialStatementData: StatementData = {
  witnessName: '',
  witnessRelationship: '',
  veteranName: '',
  howKnown: '',
  datesKnown: '',
  conditionWitnessed: '',
  specificObservations: '',
  impactOnLife: '',
  frequencyWitnessed: '',
  additionalDetails: '',
  witnessContact: '',
  willingToTestify: 'yes',
};

const steps = [
  { id: 1, title: 'Witness Info', description: 'Who is writing this statement?' },
  { id: 2, title: 'Relationship', description: 'How do you know the veteran?' },
  { id: 3, title: 'Observations', description: 'What have you witnessed?' },
  { id: 4, title: 'Impact', description: 'How has this affected the veteran?' },
  { id: 5, title: 'Review', description: 'Review and export' },
];

export default function BuddyStatements() {
  const { data, addBuddyContact, updateBuddyContact, deleteBuddyContact, addUploadedDocument, deleteUploadedDocument } = useClaims();
  const navigate = useNavigate();
  const profile = useProfileStore();
  const { documents, setAllDocuments } = useEvidence();
  const { toast } = useToast();
  const symptoms = useAppStore((s) => s.symptoms);
  const [activeTab, setActiveTab] = useState('contacts');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportingStatement, setExportingStatement] = useState(false);

  // Build condition-aware description for pre-fill
  const conditionSummary = useMemo(() => {
    return (data.claimConditions || []).map(c => c.name).join(', ');
  }, [data.claimConditions]);

  // Build symptom summary for buddy context
  const symptomSummary = useMemo(() => {
    if (symptoms.length === 0) return '';
    const recent = symptoms.slice(0, 10);
    const bySymptom = new Map<string, { count: number; maxSeverity: number; impacts: string[] }>();
    for (const s of recent) {
      const existing = bySymptom.get(s.symptom) || { count: 0, maxSeverity: 0, impacts: [] };
      existing.count++;
      existing.maxSeverity = Math.max(existing.maxSeverity, s.severity);
      if (s.dailyImpact && !existing.impacts.includes(s.dailyImpact)) {
        existing.impacts.push(s.dailyImpact);
      }
      bySymptom.set(s.symptom, existing);
    }
    return Array.from(bySymptom.entries())
      .map(([name, info]) => {
        const severity = info.maxSeverity >= 7 ? 'severe' : info.maxSeverity >= 4 ? 'moderate' : 'mild';
        return `${name} (${severity}, logged ${info.count} time${info.count !== 1 ? 's' : ''})${info.impacts.length > 0 ? ` — impacts: ${info.impacts.join(', ')}` : ''}`;
      })
      .join('; ');
  }, [symptoms]);

  // Contacts form state
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<BuddyContact, 'id'>>({
    name: '',
    rank: '',
    relationship: '',
    whatTheyWitnessed: '',
    contactInfo: '',
    statementStatus: 'Not Requested',
  });

  // Pre-populate statement with veteran name and conditions
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  // Statement generator state — draft persisted
  const statementInitial = useMemo(() => ({
    ...initialStatementData,
    veteranName: fullName,
    conditionWitnessed: conditionSummary,
  }), [fullName, conditionSummary]);

  const {
    formData: statementData, updateField: updateStatementField, setFormData: _setFormData,
    currentStep, setCurrentStep, draftRestored, clearDraft, lastSaved,
  } = useToolDraft({
    toolId: 'tool:buddy-statement',
    initialData: statementInitial,
  });
  const [copied, setCopied] = useState(false);

  // Contacts functions
  const resetForm = () => {
    setFormData({
      name: '',
      rank: '',
      relationship: '',
      whatTheyWitnessed: '',
      contactInfo: '',
      statementStatus: 'Not Requested',
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateBuddyContact(editingId, formData);
    } else {
      addBuddyContact(formData);
    }
    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (contact: BuddyContact) => {
    setFormData({
      name: contact.name,
      rank: contact.rank,
      relationship: contact.relationship,
      whatTheyWitnessed: contact.whatTheyWitnessed,
      contactInfo: contact.contactInfo,
      statementStatus: contact.statementStatus,
    });
    setEditingId(contact.id);
    setIsOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Submitted': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'Received': return <FileText className="h-4 w-4 text-primary" />;
      case 'Requested': return <Clock className="h-4 w-4 text-gold" />;
      default: return <Send className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-success/10 text-success ring-success/20';
      case 'Received': return 'bg-primary/10 text-primary ring-primary/20';
      case 'Requested': return 'bg-gold/10 text-gold ring-gold/20';
      default: return 'bg-muted text-muted-foreground ring-border';
    }
  };

  // Statement generator functions
  const updateField = useCallback((field: keyof StatementData, value: string) => {
    updateStatementField(field, value);
  }, [updateStatementField]);

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return statementData.witnessName.trim() !== '';
      case 2:
        return statementData.witnessRelationship.trim() !== '';
      case 3:
        return statementData.specificObservations.trim() !== '';
      case 4:
        return statementData.frequencyWitnessed.trim() !== '';
      case 5:
        return true;
      default:
        return false;
    }
  };

  const generateStatement = (): string => {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `BUDDY/LAY STATEMENT

Date: ${today}

RE: Statement in Support of Claim for ${statementData.veteranName}

I, ${statementData.witnessName}, am providing this statement in support of the VA disability claim for ${statementData.veteranName}.

RELATIONSHIP TO VETERAN:
I am the veteran's ${statementData.witnessRelationship}. ${statementData.howKnown}

I have known ${statementData.veteranName} ${statementData.datesKnown}.

OBSERVATIONS:
${statementData.conditionWitnessed ? `I have personally witnessed ${statementData.veteranName} experiencing ${statementData.conditionWitnessed}.` : ''}

${statementData.specificObservations}

FREQUENCY:
${statementData.frequencyWitnessed}

IMPACT ON DAILY LIFE:
${statementData.impactOnLife}

${statementData.additionalDetails ? `ADDITIONAL INFORMATION:\n${statementData.additionalDetails}` : ''}

CERTIFICATION:
I certify that the statements made herein are true and correct to the best of my knowledge and belief. I understand that making false statements is punishable by law.

${statementData.willingToTestify === 'yes' ? 'I am willing to provide additional testimony if needed.\n' : ''}
Contact Information: ${statementData.witnessContact}

_______________________________
${statementData.witnessName}
Date: ${today}`;
  };

  const copyToClipboard = async () => {
    const statement = generateStatement();
    try {
      await navigator.clipboard.writeText(statement);
      setCopied(true);
      toast({ title: 'Copied to clipboard', description: 'Statement has been copied.' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Copy failed', description: 'Please select and copy the text manually.', variant: 'destructive' });
    }
  };

  const downloadAsPDF = async () => {
    setExportingStatement(true);
    try {
      const statement = generateStatement();
      await exportBuddyStatement(statement, statementData.witnessName);
      markJourneyItem('buddy-statements');
      const condition = statementData.conditionWitnessed || '';
      saveToVault({
        documentType: 'buddy-statement',
        condition,
        title: `Buddy Statement${condition ? ` - ${condition}` : ''}`,
        content: statement,
        fileName: `buddy-statement-${statementData.witnessName || 'witness'}.txt`,
      }).then(() => {
        toast({
          title: 'Saved to Vault',
          action: <ToastAction altText="View in Vault" onClick={() => navigate('/claims/vault')}>View</ToastAction>,
        });
      }).catch(() => {
        toast({ title: 'Downloaded', description: 'Statement saved as PDF.' });
      });
    } catch {
      toast({ title: 'Export failed', description: 'Could not generate PDF. Please try again.', variant: 'destructive' });
    } finally {
      setExportingStatement(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="witnessName">Full Legal Name</Label>
              <Input
                id="witnessName"
                placeholder="Enter your full name"
                value={statementData.witnessName}
                onChange={(e) => updateField('witnessName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="witnessContact">Contact Information</Label>
              <Input
                id="witnessContact"
                placeholder="Phone or email"
                value={statementData.witnessContact}
                onChange={(e) => updateField('witnessContact', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="veteranName">Veteran's Name</Label>
              <Input
                id="veteranName"
                placeholder="Enter veteran's full name"
                value={statementData.veteranName}
                onChange={(e) => updateField('veteranName', e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship to Veteran</Label>
              <Select
                value={statementData.witnessRelationship}
                onValueChange={(value) => updateField('witnessRelationship', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="fellow service member">Fellow Service Member</SelectItem>
                  <SelectItem value="supervisor">Supervisor/Commander</SelectItem>
                  <SelectItem value="coworker">Coworker</SelectItem>
                  <SelectItem value="neighbor">Neighbor</SelectItem>
                  <SelectItem value="caregiver">Caregiver</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="howKnown">How do you know the veteran?</Label>
              <Textarea
                id="howKnown"
                placeholder="e.g., We served together at Fort Bragg from 2010-2012..."
                value={statementData.howKnown}
                onChange={(e) => updateField('howKnown', e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="datesKnown">How long have you known them?</Label>
              <Input
                id="datesKnown"
                placeholder="e.g., since 2010 (over 13 years)"
                value={statementData.datesKnown}
                onChange={(e) => updateField('datesKnown', e.target.value)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="conditionWitnessed">What condition or symptoms have you witnessed?</Label>
              <Input
                id="conditionWitnessed"
                placeholder="e.g., back pain, PTSD symptoms, hearing difficulties"
                value={statementData.conditionWitnessed}
                onChange={(e) => updateField('conditionWitnessed', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specificObservations">Describe specific observations</Label>
              <Textarea
                id="specificObservations"
                placeholder="Be specific: What did you see? When? Where? Include dates if possible..."
                value={statementData.specificObservations}
                onChange={(e) => updateField('specificObservations', e.target.value)}
                rows={5}
              />
              <p className="text-xs text-muted-foreground">
                Tip: Include specific examples with dates when possible
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequencyWitnessed">How often have you witnessed this?</Label>
              <Textarea
                id="frequencyWitnessed"
                placeholder="e.g., I see the veteran weekly and have observed these symptoms consistently over the past 5 years..."
                value={statementData.frequencyWitnessed}
                onChange={(e) => updateField('frequencyWitnessed', e.target.value)}
                rows={2}
              />
            </div>
            {/* Symptom context pre-fill from logged data */}
            {symptomSummary && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold text-foreground">Symptom Context from Your Logs</p>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{symptomSummary}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    const current = statementData.specificObservations;
                    const addition = `\n\nBased on recent symptom tracking: ${symptomSummary}`;
                    updateField('specificObservations', current + addition);
                    toast({ title: 'Symptom context added', description: 'Symptom summary appended to observations.' });
                  }}
                >
                  Include in Observations
                </Button>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="impactOnLife">How has this condition impacted the veteran's life?</Label>
              <Textarea
                id="impactOnLife"
                placeholder="Describe how this affects their work, relationships, daily activities..."
                value={statementData.impactOnLife}
                onChange={(e) => updateField('impactOnLife', e.target.value)}
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalDetails">Additional details (optional)</Label>
              <Textarea
                id="additionalDetails"
                placeholder="Any other relevant information..."
                value={statementData.additionalDetails}
                onChange={(e) => updateField('additionalDetails', e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Would you be willing to provide additional testimony if needed?</Label>
              <Select
                value={statementData.willingToTestify}
                onValueChange={(value) => updateField('willingToTestify', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <pre className="whitespace-pre-wrap text-sm font-mono text-foreground overflow-auto max-h-96">
                  {generateStatement()}
                </pre>
              </CardContent>
            </Card>
            <div className="px-3 py-2 rounded-md bg-gold/10 border border-gold/20">
              <p className="text-[11px] text-gold/70">
                This is a template only — not a legal document. Review all content for accuracy
                and consult with your VSO or attorney before submitting to the VA.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} className="flex-1 gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </Button>
              <Button variant="outline" disabled={exportingStatement} onClick={downloadAsPDF} className="flex-1 gap-2">
                {exportingStatement ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {exportingStatement ? 'Exporting...' : 'Download PDF'}
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full gap-2 mt-2"
              onClick={async () => {
                const result = await createBuddyShareLink({
                  veteranFirstName: profile.firstName || 'A veteran',
                  conditionName: statementData.conditionWitnessed || 'their VA claim',
                  templateContent: generateStatement(),
                  relationshipHint: statementData.witnessRelationship || '',
                });
                if (result.success && result.shareUrl) {
                  await shareBuddyLink(result.shareUrl, profile.firstName || 'A veteran', statementData.conditionWitnessed || undefined);
                  toast({ title: 'Share link created', description: 'Send the link to your buddy to fill out.' });
                } else {
                  toast({ title: 'Could not create share link', description: result.error || 'Please try again.', variant: 'destructive' });
                }
              }}
            >
              <Share2 className="h-4 w-4" />
              Share with Buddy
            </Button>
          </div>
        );
    }
  };

  return (
    <PageContainer className="space-y-6 animate-fade-in overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="section-header mb-0">
          <div className="section-icon bg-buddy/10">
            <Users className="h-5 w-5 text-buddy" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Buddy Statements</h1>
            <p className="text-muted-foreground text-sm">Manage contacts and create witness statements</p>
          </div>
        </div>

        <Button variant="outline" disabled={exporting} onClick={async () => {
          setExporting(true);
          try { await exportBuddyContacts(data.buddyContacts); } catch (err) { toast({ title: 'Export failed', description: err instanceof Error ? err.message : 'Could not generate PDF. Please try again.', variant: 'destructive' }); } finally { setExporting(false); }
        }} className="gap-2 flex-shrink-0">
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {exporting ? 'Exporting...' : 'Export PDF'}
        </Button>
      </div>

      {/* Legal Disclaimer */}
      <div className="px-4 py-3 rounded-lg bg-gold/10 border border-gold/20">
        <p className="text-xs text-gold/80">
          This tool helps organize your thoughts. Generated letters are templates only —
          not legal documents. Review with your VSO or attorney before submitting to the VA.
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contacts" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Contacts</span>
            <span className="sm:hidden">Contacts</span>
          </TabsTrigger>
          <TabsTrigger value="generator" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Statement Writer</span>
            <span className="sm:hidden">Writer</span>
          </TabsTrigger>
        </TabsList>

        {/* CONTACTS TAB */}
        <TabsContent value="contacts" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingId ? 'Edit Contact' : 'Add Buddy Contact'}</DialogTitle>
                  <DialogDescription className="sr-only">Enter buddy contact details for your statement</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rank">Rank</Label>
                      <Input
                        id="rank"
                        placeholder="e.g., TSgt"
                        value={formData.rank}
                        onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input
                      id="relationship"
                      placeholder="e.g., Flight supervisor, fellow crew member"
                      value={formData.relationship}
                      onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="witnessed">What They Witnessed</Label>
                    <Textarea
                      id="witnessed"
                      placeholder="Describe what conditions/incidents they can verify..."
                      value={formData.whatTheyWitnessed}
                      onChange={(e) => setFormData({ ...formData, whatTheyWitnessed: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Info</Label>
                    <Input
                      id="contact"
                      placeholder="Email, phone, or address"
                      value={formData.contactInfo}
                      onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Statement Status</Label>
                    <Select
                      value={formData.statementStatus}
                      onValueChange={(value: typeof statementStatuses[number]) => setFormData({ ...formData, statementStatus: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statementStatuses.map((status) => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingId ? 'Update' : 'Save'} Contact
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Contacts Grid */}
          {data.buddyContacts.length === 0 ? (
            <Card className="data-card">
              <CardContent>
                <EmptyState
                  icon={<Users className="h-10 w-10" />}
                  title="No buddy contacts yet"
                  description="Add people who can provide witness statements for your claim."
                  whyItMatters="Third-party statements are one of the strongest evidence types the VA accepts. Fellow service members and family can describe what they witnessed."
                  actionLabel="Add Contact"
                  onAction={() => setIsOpen(true)}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {data.buddyContacts.map((contact) => (
                <Card key={contact.id} className="data-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(contact.statementStatus)}
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(contact.statementStatus)}`}>
                          {contact.statementStatus}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 min-h-[44px] min-w-[44px]" onClick={() => handleEdit(contact)} aria-label="Edit contact">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 min-h-[44px] min-w-[44px]" onClick={() => setDeleteTarget(contact.id)} aria-label="Delete contact">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-base mt-2 break-words">
                      {contact.rank && `${contact.rank} `}{contact.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {contact.relationship && (
                      <p className="text-muted-foreground leading-tight">{contact.relationship}</p>
                    )}

                    {contact.whatTheyWitnessed && (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Can Verify</p>
                        <p className="text-sm line-clamp-3">{contact.whatTheyWitnessed}</p>
                      </div>
                    )}

                    {contact.contactInfo && (
                      <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                        {contact.contactInfo.includes('@') ? (
                          <Mail className="h-4 w-4 flex-shrink-0" />
                        ) : (
                          <Phone className="h-4 w-4 flex-shrink-0" />
                        )}
                        <span className="text-xs break-all">{contact.contactInfo}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Uploaded Buddy Statement Documents */}
          <Card className="data-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Camera className="h-5 w-5 text-buddy" />
                Scanned Buddy Statements
              </CardTitle>
              <CardDescription>Take a photo or upload signed buddy statements (VA Form 21-10210)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <EvidenceAttachment
                entryType="claim-condition"
                entryId="buddy-statements"
                documents={documents}
                onDocumentsChange={setAllDocuments}
              />
              <DocumentUploader
                documents={data.uploadedDocuments}
                category="buddy-contacts"
                onAdd={addUploadedDocument}
                onDelete={deleteUploadedDocument}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* STATEMENT WRITER TAB */}
        <TabsContent value="generator" className="space-y-4 mt-4">
          {draftRestored && lastSaved && (
            <DraftRestoredBanner lastSaved={lastSaved} onStartFresh={clearDraft} />
          )}

          {/* Info Card */}
          <Card className="bg-primary/5 border-primary/30">
            <CardContent className="pt-6 flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">What is a Buddy Statement?</p>
                <p>
                  A buddy/lay statement is a written statement from someone who has personally witnessed
                  your condition or its effects. These statements can provide crucial evidence for your
                  VA disability claim.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Progress Steps */}
          <div className="flex justify-between items-center overflow-x-auto pb-1">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex flex-col items-center ${
                    step.id === currentStep
                      ? 'text-primary'
                      : step.id < currentStep
                      ? 'text-success'
                      : 'text-muted-foreground'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.id === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : step.id < currentStep
                        ? 'bg-success text-success-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step.id < currentStep ? '✓' : step.id}
                  </div>
                  <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-4 sm:w-16 h-0.5 mx-0.5 sm:mx-1 ${
                      step.id < currentStep ? 'bg-success' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent>{renderStep()}</CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))}
              disabled={currentStep === steps.length || !canProceed()}
              className="gap-2"
            >
              {currentStep === steps.length - 1 ? 'Review' : 'Next'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete Buddy Contact?"
        description="This action cannot be undone. This will permanently delete this buddy contact and their statement."
        confirmText="Delete"
        variant="destructive"
        onConfirm={() => { if (deleteTarget) deleteBuddyContact(deleteTarget); }}
      />
    </PageContainer>
  );
}
