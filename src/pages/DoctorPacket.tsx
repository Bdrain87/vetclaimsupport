import { useState, useMemo } from 'react';
import { Stethoscope, Copy, Share2, CheckCircle2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageContainer } from '@/components/PageContainer';
import { useToast } from '@/hooks/use-toast';
import { saveToVault } from '@/utils/vaultAutoSave';
import { generateDoctorPacket } from '@/utils/exportPacket';

export default function DoctorPacket() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const packet = useMemo(() => generateDoctorPacket(), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(packet);
      setCopied(true);
      toast({ title: 'Copied to clipboard', description: 'Paste into notes or print for your appointment.' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Copy failed', description: 'Try selecting the text manually.', variant: 'destructive' });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Doctor Preparation Packet', text: packet });
      } catch { /* user cancelled */ }
    } else {
      handleCopy();
    }
  };

  const handleSaveToVault = async () => {
    const now = new Date().toISOString().slice(0, 10);
    await saveToVault({
      fileName: `Doctor-Packet-${now}.txt`,
      title: `Doctor Packet — ${now}`,
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
          <Stethoscope className="h-6 w-6 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Doctor Preparation Packet</h1>
          <p className="text-muted-foreground text-sm">Print or share before your appointment.</p>
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
