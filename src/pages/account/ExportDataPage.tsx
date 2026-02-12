import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, FileText, Loader2, ChevronLeft, Check } from 'lucide-react';
import { exportAllData } from '@/services/accountManagement';
import { saveAs } from 'file-saver';
import { PageContainer } from '@/components/PageContainer';

export default function ExportDataPage() {
  const navigate = useNavigate();
  const format = 'pdf' as const;
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportAllData(format);
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `vet-claim-support-export-${timestamp}.${format}`;

      // Try native share if available, otherwise download
      if (navigator.share && navigator.canShare?.({ files: [new File([blob], filename)] })) {
        const file = new File([blob], filename, {
          type: format === 'json' ? 'application/json' : 'application/pdf',
        });
        await navigator.share({ files: [file], title: 'Vet Claim Support Export' });
      } else {
        saveAs(blob, filename);
      }

      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
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
        <div className="w-16 h-16 mx-auto rounded-full bg-[rgba(214,178,94,0.1)] border border-[rgba(214,178,94,0.2)] flex items-center justify-center">
          <Download className="h-8 w-8 text-gold" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Export Your Data</h1>
        <p className="text-muted-foreground text-sm">
          Download a copy of all your claim data and health logs.
        </p>
      </div>

      {/* Format info */}
      <div className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-[rgba(214,178,94,0.1)] border-[rgba(214,178,94,0.4)]">
        <FileText className="h-8 w-8 text-gold" />
        <span className="text-sm font-medium text-foreground">PDF Export</span>
        <span className="text-xs text-muted-foreground/70">Human-readable, ready for submission</span>
      </div>

      {/* Export button */}
      <button
        onClick={handleExport}
        disabled={exporting}
        className="w-full h-12 rounded-xl bg-gold text-[#000000] font-bold text-sm hover:bg-gold/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
      >
        {exporting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Exporting...
          </>
        ) : exported ? (
          <>
            <Check className="h-4 w-4" />
            Exported!
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Export {format.toUpperCase()}
          </>
        )}
      </button>

      {/* Info */}
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
