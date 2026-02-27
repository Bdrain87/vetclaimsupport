import { useState, useMemo } from 'react';
import { FileText, Copy, Share2, CheckCircle2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageContainer } from '@/components/PageContainer';
import { useToast } from '@/hooks/use-toast';
import { saveToVault } from '@/utils/vaultAutoSave';
import { generateVSOPacket } from '@/utils/exportPacket';

export default function VSOPacket() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const packet = useMemo(() => generateVSOPacket(), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(packet);
      setCopied(true);
      toast({ title: 'Copied to clipboard', description: 'Paste into an email or document for your VSO.' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Copy failed', description: 'Try selecting the text manually.', variant: 'destructive' });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'VSO/Attorney Packet', text: packet });
      } catch { /* user cancelled */ }
    } else {
      handleCopy();
    }
  };

  const handleSaveToVault = async () => {
    const now = new Date().toISOString().slice(0, 10);
    await saveToVault({
      fileName: `VSO-Packet-${now}.txt`,
      title: `VSO Packet — ${now}`,
      content: packet,
      documentType: 'other',
      condition: 'all',
    });
    toast({ title: 'Saved to vault', description: 'Find it in Settings → Document Vault.' });
  };

  return (
    <PageContainer className="py-6 space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/20">
          <FileText className="h-6 w-6 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">VSO/Attorney Packet</h1>
          <p className="text-muted-foreground text-sm">Ready to share with your representative.</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="gap-1.5" onClick={handleCopy}>
          {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={handleShare}>
          <Share2 className="h-4 w-4" /> Share
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={handleSaveToVault}>
          <Download className="h-4 w-4" /> Save to Vault
        </Button>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="py-4 px-4">
          <pre className="text-xs text-foreground/90 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
            {packet}
          </pre>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
