import { Shield } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import PACTActChecker from '@/components/tools/PACTActChecker';

export default function PACTActStandalone() {
  return (
    <PageContainer className="py-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gold/10 border border-gold/20">
          <Shield className="h-6 w-6 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">PACT Act Checker</h1>
          <p className="text-muted-foreground text-sm">Check if you qualify for presumptive benefits</p>
        </div>
      </div>

      <PACTActChecker />
    </PageContainer>
  );
}
