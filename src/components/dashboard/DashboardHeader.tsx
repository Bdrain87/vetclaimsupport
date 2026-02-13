import { useState } from 'react';
import { Share, MessageCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useClaims } from '@/hooks/useClaims';
import { useToast } from '@/hooks/use-toast';
import { ExportButton } from './ExportButton';

export function DashboardHeader() {
  const { data } = useClaims();
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  const generateShareText = () => {
    const conditionCount = data.claimConditions?.length || 0;
    const medicalCount = data.medicalVisits.length;
    const exposureCount = data.exposures.length;
    const symptomCount = data.symptoms.length;
    
    return `Vet Claim Support Summary\n\n` +
      `Conditions: ${conditionCount}\n` +
      `Medical Visits: ${medicalCount}\n` +
      `Exposures: ${exposureCount}\n` +
      `Symptoms: ${symptomCount}\n\n` +
      `Generated with Vet Claim Support`;
  };

  const handleNativeShare = async () => {
    setIsSharing(true);
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Vet Claim Support Summary',
          text: generateShareText(),
        });
        toast({
          title: 'Shared successfully',
          description: 'Your evidence summary has been shared.',
        });
      } else {
        // Fallback for browsers without native share
        await navigator.clipboard.writeText(generateShareText());
        toast({
          title: 'Copied to clipboard',
          description: 'Evidence summary copied. Paste it to share.',
        });
      }
    } catch (error) {
      // User cancelled share or error occurred
      if ((error as Error).name !== 'AbortError') {
        toast({
          title: 'Share failed',
          description: 'Unable to share. Try exporting as PDF instead.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent('Vet Claim Support Summary');
    const body = encodeURIComponent(generateShareText());
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleSMSShare = () => {
    const text = encodeURIComponent(generateShareText());
    // iOS uses &body=, Android uses ?body=
    window.location.href = `sms:?&body=${text}`;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-bold text-foreground tracking-tight">Vet Claim Support</h1>
        <p className="text-xs text-muted-foreground">Build your disability claim</p>
      </div>
      
      {/* Desktop: Full buttons */}
      <div className="hidden items-center gap-2 flex-shrink-0">
        <Button variant="outline" size="sm" onClick={handleNativeShare} disabled={isSharing} className="gap-2">
          <Share className="h-4 w-4" />
          Share
        </Button>
        <ExportButton />
      </div>
      
      {/* Mobile: Prominent Export + Share dropdown */}
      <div className="flex items-center gap-2">
        {/* Prominent Export Button */}
        <ExportButton />
        
        {/* Share dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-11 w-11 min-h-[44px] min-w-[44px]" aria-label="Share evidence summary">
              <Share className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleNativeShare} className="gap-3">
              <Share className="h-4 w-4" />
              Share via...
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSMSShare} className="gap-3">
              <MessageCircle className="h-4 w-4" />
              Message
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEmailShare} className="gap-3">
              <Mail className="h-4 w-4" />
              Email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
