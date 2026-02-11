import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, FileJson, FileText, Loader2, ChevronLeft, Check } from 'lucide-react';
import { exportAllData } from '@/services/accountManagement';
import { saveAs } from 'file-saver';
import { PageContainer } from '@/components/PageContainer';

export default function ExportDataPage() {
  const navigate = useNavigate();
  const [format, setFormat] = useState<'json' | 'pdf'>('json');
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
        className="flex items-center gap-1 text-white/50 hover:text-white text-sm transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center">
          <Download className="h-8 w-8 text-[#3B82F6]" />
        </div>
        <h1 className="text-2xl font-bold text-white">Export Your Data</h1>
        <p className="text-white/50 text-sm">
          Download a copy of all your claim data and health logs.
        </p>
      </div>

      {/* Format selector */}
      <div className="space-y-3">
        <label className="block text-sm text-white/50 font-medium">Choose format:</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setFormat('json')}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
              format === 'json'
                ? 'bg-[#3B82F6]/10 border-[#3B82F6]/40'
                : 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.06]'
            }`}
          >
            <FileJson className={`h-8 w-8 ${format === 'json' ? 'text-[#3B82F6]' : 'text-white/40'}`} />
            <span className={`text-sm font-medium ${format === 'json' ? 'text-white' : 'text-white/60'}`}>JSON</span>
            <span className="text-[10px] text-white/30">Machine-readable</span>
          </button>

          <button
            onClick={() => setFormat('pdf')}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
              format === 'pdf'
                ? 'bg-[#3B82F6]/10 border-[#3B82F6]/40'
                : 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.06]'
            }`}
          >
            <FileText className={`h-8 w-8 ${format === 'pdf' ? 'text-[#3B82F6]' : 'text-white/40'}`} />
            <span className={`text-sm font-medium ${format === 'pdf' ? 'text-white' : 'text-white/60'}`}>PDF</span>
            <span className="text-[10px] text-white/30">Human-readable</span>
          </button>
        </div>
      </div>

      {/* Export button */}
      <button
        onClick={handleExport}
        disabled={exporting}
        className="w-full h-12 rounded-xl bg-[#3B82F6] text-[#102039] font-bold text-sm hover:bg-[#3B82F6]/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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
      <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-4">
        <p className="text-xs text-white/40 leading-relaxed">
          Your export includes your profile, conditions, health logs, medications,
          medical visits, service history, and document metadata. Uploaded file
          attachments are not included in the export.
        </p>
      </div>
    </PageContainer>
  );
}
