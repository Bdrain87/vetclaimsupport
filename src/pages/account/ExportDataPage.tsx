import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Database, Download, AlertTriangle, ChevronLeft, Loader2, Check } from 'lucide-react';
import { exportAllData } from '@/services/accountManagement';
import { saveAs } from 'file-saver';
import { PageContainer } from '@/components/PageContainer';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExportButton } from '@/components/dashboard/ExportButton';

export default function ExportDataPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [exportingJson, setExportingJson] = useState(false);
  const [exportedJson, setExportedJson] = useState(false);

  const handleJsonExport = async () => {
    setExportingJson(true);
    try {
      const blob = await exportAllData('json');
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `vet-claim-support-export-${timestamp}.json`;

      // Try native share if available, otherwise download
      if (navigator.share && navigator.canShare?.({ files: [new File([blob], filename)] })) {
        const file = new File([blob], filename, {
          type: 'application/json',
        });
        await navigator.share({ files: [file], title: 'Vet Claim Support Data Export' });
      } else {
        saveAs(blob, filename);
      }

      setExportedJson(true);
      setTimeout(() => setExportedJson(false), 3000);
    } catch (err) {
      toast({
        title: 'Export Failed',
        description: err instanceof Error ? err.message : 'Unable to generate export. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setExportingJson(false);
    }
  };

  return (
    <PageContainer className="space-y-6 animate-fade-in py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
          <Download className="h-8 w-8 text-gold" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Export Your Data</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Download your claim data as a formatted PDF for submission prep, or as a raw JSON backup for portability.
        </p>
      </div>

      {/* Export option cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1 — PDF Claim Packet */}
        <Card className="border-gold/20 bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-gold" />
              </div>
              <CardTitle className="text-base">PDF Claim Packet</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Formatted evidence report for your VSO or VA submission preparation.
            </p>

            <div className="rounded-lg bg-muted/50 border border-border p-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Includes service history, symptoms, medical visits, and conditions.
              </p>
            </div>

            <ExportButton variant="prominent" />

            <div className="flex items-start gap-2 rounded-lg bg-gold/5 border border-gold/20 p-3">
              <AlertTriangle className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <p className="text-xs text-gold/90 leading-relaxed">
                Exported PDFs may contain sensitive health information. Review before sharing.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 — Data Export (JSON) */}
        <Card className="border-border/50 bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0">
                <Database className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="text-base">Data Export (JSON)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Raw data backup for portability and safekeeping.
            </p>

            <div className="rounded-lg bg-muted/50 border border-border p-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Includes all app data in JSON format.
              </p>
            </div>

            <Button
              onClick={handleJsonExport}
              disabled={exportingJson}
              variant="outline"
              className="w-full gap-2"
            >
              {exportingJson ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : exportedJson ? (
                <>
                  <Check className="h-4 w-4" />
                  Exported!
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Export Data
                </>
              )}
            </Button>

            <div className="flex items-start gap-2 rounded-lg bg-gold/5 border border-gold/20 p-3">
              <AlertTriangle className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <p className="text-xs text-gold/90 leading-relaxed">
                Exported files are outside the app sandbox and are not automatically encrypted.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info footer */}
      <div className="rounded-xl bg-muted/50 border border-border p-4">
        <p className="text-xs text-muted-foreground/70 leading-relaxed">
          Your export includes your profile, conditions, health logs, medications,
          medical visits, service history, and document metadata. Uploaded file
          attachments are not included in the export.
        </p>
      </div>
    </PageContainer>
  );
}
