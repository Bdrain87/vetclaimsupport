import { useState, useRef } from 'react';
import { z } from 'zod';
import { Download, Upload, AlertTriangle, CheckCircle2, Trash2, Shield } from 'lucide-react';
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
import { getAllFileIds, getFileData, deleteFileData, restoreFiles } from '@/lib/indexedDB';
import { isEncryptionEnabled } from '@/utils/encryption';
import { DATA_PRIVACY_COPY } from '@/data/legalCopy';

const STORAGE_KEY = 'vcs-app-data';
const BACKUP_VERSION = '2.0.0';

// Zod schema for validating imported backup data
const backupDataSchema = z.object({
  version: z.string(),
  exportDate: z.string(),
  claimsData: z.record(z.unknown()).refine(
    (data) => typeof data === 'object' && data !== null,
    { message: 'claimsData must be a non-null object' }
  ),
  indexedDBFiles: z.array(
    z.object({
      id: z.string(),
      dataUrl: z.string(),
    })
  ).optional(),
});

type BackupData = z.infer<typeof backupDataSchema>;

export function DataBackup() {
  const { toast } = useToast();
  const { data } = useClaims();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingImportData, setPendingImportData] = useState<BackupData | null>(null);

  const encrypted = isEncryptionEnabled();

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
        version: BACKUP_VERSION,
        exportDate: new Date().toISOString(),
        claimsData: data as unknown as Record<string, unknown>,
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
    } catch {
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
        const json = JSON.parse(content);

        // Validate backup structure with Zod
        const result = backupDataSchema.safeParse(json);
        if (!result.success) {
          throw new Error('Invalid backup file format');
        }

        setPendingImportData(result.data);
        setShowImportConfirm(true);
      } catch {
        toast({
          title: 'Invalid File',
          description: 'Backup file not recognized. Export a new backup from your old device.',
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: claimsData, version: 3 }));

      // Import IndexedDB files if present
      if (pendingImportData.indexedDBFiles && pendingImportData.indexedDBFiles.length > 0) {
        await restoreFiles(pendingImportData.indexedDBFiles);
      }

      toast({
        title: 'Restore Complete',
        description: `Data restored from backup dated ${new Date(pendingImportData.exportDate).toLocaleDateString()}. Reloading...`,
      });

      await new Promise((resolve) => setTimeout(resolve, 500));
      window.location.reload();
      return;
    } catch {
      toast({
        title: 'Restore Failed',
        description: 'Failed to restore your data. Please try again.',
        variant: 'destructive',
      });
      setIsImporting(false);
      setShowImportConfirm(false);
      setPendingImportData(null);
    }
  };

  const confirmDeleteAll = async () => {
    setIsDeleting(true);
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) keysToRemove.push(key);
      }
      for (const key of keysToRemove) {
        localStorage.removeItem(key);
      }

      const fileIds = await getAllFileIds();
      for (const id of fileIds) {
        await deleteFileData(id);
      }

      toast({
        title: 'All Data Deleted',
        description: 'Your data has been permanently deleted. Redirecting...',
      });

      await new Promise((resolve) => setTimeout(resolve, 500));
      window.location.href = '/';
    } catch {
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete all data. Please try again.',
        variant: 'destructive',
      });
      setIsDeleting(false);
      setShowDeleteConfirm(false);
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
          <div className="p-3 rounded-lg bg-muted border border-border space-y-2">
            <p className="text-sm text-muted-foreground">
              Your data is stored locally on your device. Create regular backups to prevent data loss.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3 shrink-0" />
              <span>
                Format: JSON file · {encrypted ? 'Vault passcode required to decrypt on restore' : 'Not encrypted — vault passcode not set'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground/70">
              {DATA_PRIVACY_COPY.backupWarning}
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

          <div className="pt-3 border-t border-border">
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="w-full sm:w-auto"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? 'Deleting...' : 'Delete All My Data'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Restore Confirmation */}
      <AlertDialog open={showImportConfirm} onOpenChange={setShowImportConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Confirm Data Restore
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>
                  This will <strong>replace all your current data</strong> with the backup from{' '}
                  <strong>
                    {pendingImportData?.exportDate
                      ? new Date(pendingImportData.exportDate).toLocaleString()
                      : 'unknown date'}
                  </strong>.
                </p>
                <p className="text-warning font-medium">
                  This action cannot be undone. Export your current data first if needed.
                </p>
                <p className="text-xs text-muted-foreground">
                  Backup version: {pendingImportData?.version || 'unknown'}
                </p>
              </div>
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

      {/* Delete All Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete All My Data
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>
                  This will permanently delete all your claim preparation data including conditions, documents, symptom logs, AI-generated drafts, and settings.
                </p>
                <p className="text-destructive font-semibold">
                  This cannot be undone. Are you sure?
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
