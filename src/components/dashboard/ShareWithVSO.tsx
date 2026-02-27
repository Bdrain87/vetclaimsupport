import { useState } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Share2, Copy, CheckCircle2, Download, Calendar, FileText, Stethoscope, Pill, Activity, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ShareWithVSO() {
  const { data } = useClaims();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const conditions = data.claimConditions || [];
  const buddyStatementsReceived = (data.buddyContacts || []).filter(b =>
    b.statementStatus === 'Received' || b.statementStatus === 'Submitted'
  ).length;
  const documentsObtained = (data.documents || []).filter(d =>
    d.status === 'Obtained' || d.status === 'Submitted'
  ).length;

  // Generate plain text summary for clipboard
  const generatePlainTextSummary = () => {
    const lines: string[] = [];
    lines.push('VET CLAIM SUPPORT — VSO SUMMARY');
    lines.push(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);
    lines.push('');
    lines.push('--- VETERAN INFO ---');
    lines.push(`Separation Date: ${data.separationDate ? new Date(data.separationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not set'}`);
    if ((data.serviceHistory || []).length > 0) {
      lines.push('Service Locations:');
      (data.serviceHistory || []).filter(s => s.base).forEach(s => {
        lines.push(`  - ${s.base}`);
      });
    }
    lines.push('');
    lines.push(`--- CONDITIONS BEING CLAIMED (${conditions.length}) ---`);
    if (conditions.length > 0) {
      conditions.forEach(c => {
        lines.push(`• ${c.name}`);
        lines.push(`    Medical Visits: ${c.linkedMedicalVisits.length} | Symptoms: ${c.linkedSymptoms.length} | Exposures: ${c.linkedExposures.length} | Buddy Contacts: ${c.linkedBuddyContacts.length}`);
      });
    } else {
      lines.push('No conditions added to claim yet.');
    }
    lines.push('');
    lines.push('--- EVIDENCE SUMMARY ---');
    lines.push(`Medical Visits: ${(data.medicalVisits || []).length}`);
    lines.push(`Medications: ${(data.medications || []).length}`);
    lines.push(`Symptoms Logged: ${(data.symptoms || []).length}`);
    lines.push(`Buddy Contacts: ${(data.buddyContacts || []).length}`);
    lines.push('');
    lines.push('--- DOCUMENTS & STATEMENTS ---');
    lines.push(`Documents: ${documentsObtained} of ${(data.documents || []).length} obtained/submitted`);
    lines.push(`Buddy Statements: ${buddyStatementsReceived} of ${(data.buddyContacts || []).length} received`);
    lines.push(`Exposures Documented: ${(data.exposures || []).length}`);
    lines.push('');
    lines.push('Privacy Note: This summary contains only aggregate counts and condition names. Detailed medical information stays on your device.');
    return lines.join('\n');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generatePlainTextSummary());
      setCopied(true);
      toast({
        title: 'Summary Copied!',
        description: 'You can now paste this summary to share with your VSO',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Copy failed', description: 'Unable to access clipboard.', variant: 'destructive' });
    }
  };

  const handleDownloadPDF = async () => {
    setExporting(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'pt', format: 'letter' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 50;
      const maxWidth = pageWidth - margin * 2;
      let y = 50;

      const addText = (text: string, size: number, style: 'normal' | 'bold' = 'normal') => {
        doc.setFontSize(size);
        doc.setFont('helvetica', style);
        const lines = doc.splitTextToSize(text, maxWidth);
        if (y + lines.length * size * 1.2 > doc.internal.pageSize.getHeight() - 50) {
          doc.addPage();
          y = 50;
        }
        doc.text(lines, margin, y);
        y += lines.length * size * 1.2 + 4;
      };

      const addSpacer = (px = 12) => { y += px; };

      // Header
      addText('VET CLAIM SUPPORT — VSO SUMMARY', 16, 'bold');
      addText(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 10, 'normal');
      addSpacer(16);

      // Veteran Info
      addText('VETERAN INFO', 12, 'bold');
      addText(`Separation Date: ${data.separationDate ? new Date(data.separationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not set'}`, 10);
      if ((data.serviceHistory || []).length > 0) {
        addText('Service Locations:', 10, 'bold');
        (data.serviceHistory || []).filter(s => s.base).forEach(s => {
          addText(`  • ${s.base}`, 10);
        });
      } else {
        addText('No service history logged', 10);
      }
      addSpacer();

      // Conditions
      addText(`CONDITIONS BEING CLAIMED (${conditions.length})`, 12, 'bold');
      if (conditions.length > 0) {
        conditions.forEach(c => {
          addText(`• ${c.name}`, 10, 'bold');
          addText(`  Medical Visits: ${c.linkedMedicalVisits.length} | Symptoms: ${c.linkedSymptoms.length} | Exposures: ${c.linkedExposures.length} | Buddy Contacts: ${c.linkedBuddyContacts.length}`, 9);
        });
      } else {
        addText('No conditions added to claim yet.', 10);
      }
      addSpacer();

      // Evidence Summary
      addText('EVIDENCE SUMMARY', 12, 'bold');
      addText(`Medical Visits: ${(data.medicalVisits || []).length}`, 10);
      addText(`Medications: ${(data.medications || []).length}`, 10);
      addText(`Symptoms Logged: ${(data.symptoms || []).length}`, 10);
      addText(`Buddy Contacts: ${(data.buddyContacts || []).length}`, 10);
      addSpacer();

      // Documents
      addText('DOCUMENTS & STATEMENTS', 12, 'bold');
      addText(`Documents: ${documentsObtained} of ${(data.documents || []).length} obtained/submitted`, 10);
      addText(`Buddy Statements: ${buddyStatementsReceived} of ${(data.buddyContacts || []).length} received`, 10);
      addText(`Exposures Documented: ${(data.exposures || []).length}`, 10);
      addSpacer(20);

      // Privacy note
      doc.setDrawColor(180, 150, 46);
      doc.setFillColor(250, 245, 230);
      doc.roundedRect(margin, y, maxWidth, 36, 4, 4, 'FD');
      y += 14;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('Privacy Note:', margin + 8, y);
      doc.setFont('helvetica', 'normal');
      doc.text(' This summary contains only aggregate counts and condition names. Detailed medical information stays on your device.', margin + 60, y);

      doc.save(`vso-summary-${new Date().toISOString().split('T')[0]}.pdf`);

      toast({
        title: 'PDF Downloaded',
        description: 'Send this PDF to your VSO for review',
      });
    } catch {
      toast({
        title: 'Export Failed',
        description: 'Could not generate PDF. Try the Copy Text option instead.',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Not set';
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 w-full md:w-auto">
          <Share2 className="h-4 w-4" />
          Share with VSO
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Share Summary with VSO</DialogTitle>
          <DialogDescription>
            Generate a summary of your claim preparation to share with your Veterans Service Organization representative.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-5">
            {/* Veteran Info Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Calendar className="h-4 w-4 text-gold" />
                Veteran Info
              </div>
              <div className="pl-6 space-y-1 text-sm text-muted-foreground">
                <p><span className="font-medium text-foreground">Separation Date:</span> {formatDate(data.separationDate)}</p>
                {(data.serviceHistory || []).length > 0 && (
                  <div>
                    <span className="font-medium text-foreground">Service Locations:</span>
                    <ul className="list-disc list-inside ml-2 mt-1">
                      {(data.serviceHistory || []).filter(s => s.base).map((s, i) => (
                        <li key={i} className="truncate">{s.base}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {(data.serviceHistory || []).length === 0 && (
                  <p className="italic">No service history logged</p>
                )}
              </div>
            </div>

            {/* Conditions Being Claimed */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <FileText className="h-4 w-4 text-gold" />
                Conditions Being Claimed ({conditions.length})
              </div>
              <div className="pl-6 text-sm">
                {conditions.length > 0 ? (
                  <ul className="space-y-2">
                    {conditions.map((c, i) => (
                      <li key={i} className="p-2 bg-muted/30 rounded-md">
                        <p className="font-medium text-foreground truncate">{c.name}</p>
                        <div className="text-xs text-muted-foreground mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1">
                          <span>• {c.linkedMedicalVisits.length} medical visits</span>
                          <span>• {c.linkedSymptoms.length} symptoms</span>
                          <span>• {c.linkedExposures.length} exposures</span>
                          <span>• {c.linkedBuddyContacts.length} buddy contacts</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground italic">No conditions added to claim yet</p>
                )}
              </div>
            </div>

            {/* Evidence Summary */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Activity className="h-4 w-4 text-gold" />
                Evidence Summary
              </div>
              <div className="pl-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                  <Stethoscope className="h-4 w-4 text-gold" />
                  <div>
                    <p className="font-medium text-foreground">{(data.medicalVisits || []).length}</p>
                    <p className="text-xs text-muted-foreground">Medical Visits</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                  <Pill className="h-4 w-4 text-gold" />
                  <div>
                    <p className="font-medium text-foreground">{(data.medications || []).length}</p>
                    <p className="text-xs text-muted-foreground">Medications</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                  <Activity className="h-4 w-4 text-gold" />
                  <div>
                    <p className="font-medium text-foreground">{(data.symptoms || []).length}</p>
                    <p className="text-xs text-muted-foreground">Symptoms Logged</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                  <Users className="h-4 w-4 text-gold" />
                  <div>
                    <p className="font-medium text-foreground">{(data.buddyContacts || []).length}</p>
                    <p className="text-xs text-muted-foreground">Buddy Contacts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <FileText className="h-4 w-4 text-gold" />
                Documents & Statements
              </div>
              <div className="pl-6 space-y-1 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">{documentsObtained}</span> of {(data.documents || []).length} documents obtained/submitted
                </p>
                <p>
                  <span className="font-medium text-foreground">{buddyStatementsReceived}</span> of {(data.buddyContacts || []).length} buddy statements received
                </p>
                <p>
                  <span className="font-medium text-foreground">{(data.exposures || []).length}</span> exposures documented
                </p>
              </div>
            </div>

            {/* Privacy Note */}
            <div className="p-3 bg-[rgba(240,192,0,0.08)] border border-[rgba(240,192,0,0.25)] rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Privacy Note:</strong> This summary contains only
                aggregate counts and condition names. Detailed medical information stays on your device.
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex gap-2">
            <Button onClick={handleCopyText} variant="outline" className="flex-1 gap-2">
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-gold" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Text
                </>
              )}
            </Button>
            <Button
              onClick={handleDownloadPDF}
              disabled={exporting}
              className="flex-1 gap-2 bg-gold hover:bg-gold-dk text-black font-semibold"
            >
              <Download className="h-4 w-4" />
              {exporting ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
