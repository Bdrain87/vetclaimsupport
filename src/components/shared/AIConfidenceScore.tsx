/**
 * AIConfidenceScore — Shows confidence level based on available veteran data.
 * Displayed after AI generates a document to indicate data quality.
 *
 * NOT a rating prediction — purely reflects data depth for AI context.
 */
import { useMemo } from 'react';
import { buildVeteranContext } from '@/utils/veteranContext';
import { Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIConfidenceScoreProps {
  conditionId?: string;
  className?: string;
}

type ConfidenceLevel = 'high' | 'moderate' | 'low';

export function AIConfidenceScore({ conditionId, className }: AIConfidenceScoreProps) {
  const { level, label, counts } = useMemo(() => {
    const ctx = buildVeteranContext({ conditionId });
    const dc = ctx.dataCounts;

    const total =
      (dc.symptoms || 0) +
      (dc.medications || 0) +
      (dc.medicalVisits || 0) +
      (dc.migraines || 0) +
      (dc.sleepEntries || 0) +
      (dc.buddyContacts || 0);

    let lvl: ConfidenceLevel;
    let lbl: string;
    if (total >= 15) {
      lvl = 'high';
      lbl = 'High confidence';
    } else if (total >= 5) {
      lvl = 'moderate';
      lbl = 'Moderate confidence';
    } else {
      lvl = 'low';
      lbl = 'Limited data';
    }

    // Build readable counts
    const parts: string[] = [];
    if (dc.symptoms) parts.push(`${dc.symptoms} symptom log${dc.symptoms === 1 ? '' : 's'}`);
    if (dc.medications) parts.push(`${dc.medications} medication${dc.medications === 1 ? '' : 's'}`);
    if (dc.medicalVisits) parts.push(`${dc.medicalVisits} medical visit${dc.medicalVisits === 1 ? '' : 's'}`);
    if (dc.migraines) parts.push(`${dc.migraines} migraine log${dc.migraines === 1 ? '' : 's'}`);
    if (dc.sleepEntries) parts.push(`${dc.sleepEntries} sleep entr${dc.sleepEntries === 1 ? 'y' : 'ies'}`);
    if (dc.buddyContacts) parts.push(`${dc.buddyContacts} buddy contact${dc.buddyContacts === 1 ? '' : 's'}`);

    return { level: lvl, label: lbl, counts: parts.join(', ') || 'No logged data' };
  }, [conditionId]);

  const Icon = level === 'high' ? CheckCircle2 : level === 'moderate' ? Shield : AlertTriangle;

  return (
    <div
      className={cn(
        'flex items-start gap-2.5 p-3 rounded-xl border text-xs',
        level === 'high' && 'border-gold/20 bg-gold/5',
        level === 'moderate' && 'border-gold/20 bg-gold/5',
        level === 'low' && 'border-muted bg-muted/30',
        className,
      )}
    >
      <Icon
        className={cn(
          'h-3.5 w-3.5 shrink-0 mt-0.5',
          level === 'high' && 'text-gold',
          level === 'moderate' && 'text-gold',
          level === 'low' && 'text-muted-foreground',
        )}
      />
      <div>
        <p
          className={cn(
            'font-semibold',
            level === 'high' && 'text-gold',
            level === 'moderate' && 'text-gold',
            level === 'low' && 'text-muted-foreground',
          )}
        >
          {label}
        </p>
        <p className="text-muted-foreground mt-0.5">
          Based on {counts}.{' '}
          {level === 'low' && 'Log more data for stronger AI-generated documents.'}
        </p>
      </div>
    </div>
  );
}
