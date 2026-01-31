import { useState } from 'react';
import { useClaims } from '@/context/ClaimsContext';
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

  const conditions = data.claimConditions || [];
  const buddyStatementsReceived = data.buddyContacts.filter(b => 
    b.statementStatus === 'Received' || b.statementStatus === 'Submitted'
  ).length;
  const documentsObtained = data.documents.filter(d => 
    d.status === 'Obtained' || d.status === 'Submitted'
  ).length;

  // Generate JSON for export
  const generateExportData = () => {
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
        buddyStatementsReceived,
        documentsObtained,
      },
      note: 'This is a summary for VSO review. Full details available in the app.',
    };

    return JSON.stringify(summary, null, 2);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateExportData());
    setCopied(true);
    toast({
      title: 'Summary Copied!',
      description: 'You can now paste this summary to share with your VSO',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generateExportData()], { type: 'application/json' });
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
                <Calendar className="h-4 w-4 text-primary" />
                Veteran Info
              </div>
              <div className="pl-6 space-y-1 text-sm text-muted-foreground">
                <p><span className="font-medium text-foreground">Separation Date:</span> {formatDate(data.separationDate)}</p>
                {data.serviceHistory.length > 0 && (
                  <div>
                    <span className="font-medium text-foreground">Service Locations:</span>
                    <ul className="list-disc list-inside ml-2 mt-1">
                      {data.serviceHistory.filter(s => s.base).map((s, i) => (
                        <li key={i}>{s.base}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.serviceHistory.length === 0 && (
                  <p className="italic">No service history logged</p>
                )}
              </div>
            </div>

            {/* Conditions Being Claimed */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                Conditions Being Claimed ({conditions.length})
              </div>
              <div className="pl-6 text-sm">
                {conditions.length > 0 ? (
                  <ul className="space-y-2">
                    {conditions.map((c, i) => (
                      <li key={i} className="p-2 bg-muted/30 rounded-md">
                        <p className="font-medium text-foreground">{c.name}</p>
                        <div className="text-xs text-muted-foreground mt-1 grid grid-cols-2 gap-1">
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
                <Activity className="h-4 w-4 text-primary" />
                Evidence Summary
              </div>
              <div className="pl-6 grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                  <Stethoscope className="h-4 w-4 text-medical" />
                  <div>
                    <p className="font-medium text-foreground">{data.medicalVisits.length}</p>
                    <p className="text-xs text-muted-foreground">Medical Visits</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                  <Pill className="h-4 w-4 text-medications" />
                  <div>
                    <p className="font-medium text-foreground">{data.medications.length}</p>
                    <p className="text-xs text-muted-foreground">Medications</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                  <Activity className="h-4 w-4 text-symptoms" />
                  <div>
                    <p className="font-medium text-foreground">{data.symptoms.length}</p>
                    <p className="text-xs text-muted-foreground">Symptoms Logged</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                  <Users className="h-4 w-4 text-buddy" />
                  <div>
                    <p className="font-medium text-foreground">{data.buddyContacts.length}</p>
                    <p className="text-xs text-muted-foreground">Buddy Contacts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                Documents & Statements
              </div>
              <div className="pl-6 space-y-1 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">{documentsObtained}</span> of {data.documents.length} documents obtained/submitted
                </p>
                <p>
                  <span className="font-medium text-foreground">{buddyStatementsReceived}</span> of {data.buddyContacts.length} buddy statements received
                </p>
                <p>
                  <span className="font-medium text-foreground">{data.exposures.length}</span> exposures documented
                </p>
              </div>
            </div>

            {/* Privacy Note */}
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Privacy Note:</strong> This summary contains only 
                aggregate counts and condition names. Detailed medical information stays on your device.
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleCopy} variant="outline" className="flex-1 gap-2">
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-success" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Data
              </>
            )}
          </Button>
          <Button onClick={handleDownload} className="flex-1 gap-2">
            <Download className="h-4 w-4" />
            Download File
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
