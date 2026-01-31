import { useState } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Share2, Copy, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ShareWithVSO() {
  const { data } = useClaims();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate a summary for sharing
  const generateSummary = () => {
    const conditions = data.claimConditions || [];
    const summary = {
      generatedAt: new Date().toISOString(),
      veteranInfo: {
        separationDate: data.separationDate,
        serviceLocations: data.serviceHistory.map(s => s.base).filter(Boolean),
      },
      claimsOverview: {
        totalConditions: conditions.length,
        conditions: conditions.map(c => ({
          name: c.name,
          linkedMedicalVisits: c.linkedMedicalVisits.length,
          linkedSymptoms: c.linkedSymptoms.length,
          linkedExposures: c.linkedExposures.length,
          linkedBuddyContacts: c.linkedBuddyContacts.length,
        })),
      },
      evidenceSummary: {
        medicalVisits: data.medicalVisits.length,
        symptoms: data.symptoms.length,
        exposures: data.exposures.length,
        medications: data.medications.length,
        buddyContacts: data.buddyContacts.length,
        buddyStatementsReceived: data.buddyContacts.filter(b => 
          b.statementStatus === 'Received' || b.statementStatus === 'Submitted'
        ).length,
        documentsObtained: data.documents.filter(d => 
          d.status === 'Obtained' || d.status === 'Submitted'
        ).length,
      },
      note: 'This is a summary for VSO review. Full details available in the app.',
    };

    return JSON.stringify(summary, null, 2);
  };

  const summaryText = generateSummary();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summaryText);
    setCopied(true);
    toast({
      title: 'Summary Copied!',
      description: 'You can now paste this summary to share with your VSO',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([summaryText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vso-summary-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Summary Downloaded',
      description: 'Send this file to your VSO for review',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share with VSO
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share Summary with VSO</DialogTitle>
          <DialogDescription>
            Generate a summary of your claim preparation to share with your Veterans Service Organization representative.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{(data.claimConditions || []).length}</p>
              <p className="text-xs text-muted-foreground">Conditions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{data.medicalVisits.length}</p>
              <p className="text-xs text-muted-foreground">Medical Visits</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{data.symptoms.length}</p>
              <p className="text-xs text-muted-foreground">Symptoms</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{data.buddyContacts.length}</p>
              <p className="text-xs text-muted-foreground">Buddy Contacts</p>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Summary Preview</Label>
            <pre className="p-3 bg-muted/50 rounded-lg text-xs overflow-auto max-h-48 font-mono">
              {summaryText}
            </pre>
          </div>

          {/* Privacy Note */}
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Privacy Note:</strong> This summary contains only 
              aggregate counts and condition names. Detailed medical information stays on your device.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleCopy} variant="outline" className="flex-1 gap-2">
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Summary
                </>
              )}
            </Button>
            <Button onClick={handleDownload} className="flex-1 gap-2">
              <Share2 className="h-4 w-4" />
              Download File
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
