/**
 * DataConnectedBadge — Shows users that AI tools are using their logged data.
 * e.g. "Using 12 symptom logs, 3 medications, 2 medical visits"
 */
import { Database } from 'lucide-react';
import { buildVeteranContext } from '@/utils/veteranContext';
import { useMemo } from 'react';

export function DataConnectedBadge({ conditionId }: { conditionId?: string }) {
  const summary = useMemo(() => {
    const ctx = buildVeteranContext({ conditionId });
    const counts = ctx.dataCounts;

    const parts: string[] = [];
    if (counts.symptoms > 0) parts.push(`${counts.symptoms} symptom log${counts.symptoms !== 1 ? 's' : ''}`);
    if (counts.medications > 0) parts.push(`${counts.medications} medication${counts.medications !== 1 ? 's' : ''}`);
    if (counts.medicalVisits > 0) parts.push(`${counts.medicalVisits} medical visit${counts.medicalVisits !== 1 ? 's' : ''}`);
    if (counts.migraines > 0) parts.push(`${counts.migraines} migraine log${counts.migraines !== 1 ? 's' : ''}`);
    if (counts.sleepEntries > 0) parts.push(`${counts.sleepEntries} sleep entr${counts.sleepEntries !== 1 ? 'ies' : 'y'}`);
    if (counts.buddyContacts > 0) parts.push(`${counts.buddyContacts} buddy contact${counts.buddyContacts !== 1 ? 's' : ''}`);
    if (counts.documents > 0) parts.push(`${counts.documents} document${counts.documents !== 1 ? 's' : ''}`);

    return parts;
  }, [conditionId]);

  if (summary.length === 0) return null;

  return (
    <div className="flex items-start gap-2 p-3 rounded-xl bg-gold/5 border border-gold/20">
      <Database className="h-4 w-4 text-gold shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-xs font-medium text-gold">Data Connected</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Using {summary.slice(0, 3).join(', ')}
          {summary.length > 3 && ` +${summary.length - 3} more`}
        </p>
      </div>
    </div>
  );
}
