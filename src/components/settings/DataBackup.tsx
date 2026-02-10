import { useState, useRef } from 'react';
import { Download, Upload, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useClaims } from '@/hooks/useClaims';
import useAppStore from '@/store/useAppStore';
import { getAllFileIds, getFileData } from '@/lib/indexedDB';

const STORAGE_KEY = 'vcs-app-data';

interface BackupData {
  version: string;
  exportDate: string;
  claimsData: unknown;
  indexedDBFiles?: Array<{ id: string; dataUrl: string }>;
}

export function DataBackup() {
  const { toast } = useToast();
  const { data } = useClaims();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [pendingImportData, setPendingImportData] = useState<BackupData | null>(null);

  const exportData = async () => {
    setIsExporting(true);
    try {
      // Get IndexedDB files
      const fileIds = await getAllFileIds();
      const indexedDBFiles: Array<{ id: string; dataUrl: string }> = [];

      for (const id of fileIds) {
        const fileData = await getFileData(id);
        if (fileData) {
          indexedDBFiles.push({ id, dataUrl: fileData });
        }
      }

      const backupData: BackupData = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        claimsData: data,
        indexedDBFiles,
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vet-claim-support-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Backup Created',
        description: 'Your data has been exported successfully.',
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export your data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content) as BackupData;

        // Validate backup structure
        if (!parsed.version || !parsed.claimsData) {
          throw new Error('Invalid backup file format');
        }

        setPendingImportData(parsed);
        setShowImportConfirm(true);
      } catch (error) {
        console.error('Import parse error:', error);
        toast({
          title: 'Invalid File',
          description: 'The selected file is not a valid backup file.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const confirmImport = async () => {
    if (!pendingImportData) return;

    setIsImporting(true);
    try {
      // Write to Zustand persist storage key and reload state
      const claimsData = pendingImportData.claimsData;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: claimsData, version: 1 }));

      // Import IndexedDB files if present
      if (pendingImportData.indexedDBFiles && pendingImportData.indexedDBFiles.length > 0) {
        const { storeFileData } = await import('@/lib/indexedDB');
        for (const file of pendingImportData.indexedDBFiles) {
          await storeFileData(file.id, file.dataUrl);
        }
      }

      // Reload the page to rehydrate Zustand from the updated localStorage
      toast({
        title: 'Restore Complete',
        description: `Data restored from backup dated ${new Date(pendingImportData.exportDate).toLocaleDateString()}. Reloading...`,
      });

      // Small delay to show toast before reload
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'Restore Failed',
        description: 'Failed to restore your data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
      setShowImportConfirm(false);
      setPendingImportData(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Backup & Restore
          </CardTitle>
          <CardDescription>
            Export your data for safekeeping or restore from a previous backup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 rounded-lg bg-muted border border-border">
            <p className="text-sm text-muted-foreground">
              Your data is stored locally on this device. Create regular backups to prevent data loss if you clear your browser data or switch devices.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={exportData}
              disabled={isExporting}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export Backup'}
            </Button>

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isImporting ? 'Importing...' : 'Restore from Backup'}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Select backup file to restore"
            />
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showImportConfirm} onOpenChange={setShowImportConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Confirm Data Restore
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                This will replace all your current data with the backup from{' '}
                <strong>
                  {pendingImportData?.exportDate
                    ? new Date(pendingImportData.exportDate).toLocaleString()
                    : 'unknown date'}
                </strong>.
              </p>
              <p className="text-warning font-medium">
                This action cannot be undone. Make sure to export your current data first if needed.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmImport}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Restore Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
