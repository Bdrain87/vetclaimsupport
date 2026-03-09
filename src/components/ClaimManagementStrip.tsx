import { Link } from 'react-router-dom';
import { FolderOpen, Clock, Map, Shield } from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';

const JOURNEY_PHASE_LABELS = ['Research', 'Evidence', 'Filing', 'C&P Exam', 'Decision'];

export function ClaimManagementStrip() {
  const docCount = useAppStore((s) => s.claimDocuments.length);
  const activeDeadlines = useAppStore((s) => (s.deadlines ?? []).filter((d) => !d.completed).length);
  const currentPhase = useAppStore((s) => s.journeyProgress?.currentPhase ?? 0);
  const itfFiled = useProfileStore((s) => s.intentToFileFiled);

  const phaseLabel = JOURNEY_PHASE_LABELS[currentPhase] || `Phase ${currentPhase + 1}`;

  const cards = [
    {
      icon: FolderOpen,
      label: 'Vault',
      detail: docCount > 0 ? `${docCount} doc${docCount !== 1 ? 's' : ''}` : 'No docs',
      route: '/claims/vault',
    },
    {
      icon: Clock,
      label: 'Deadlines',
      detail: activeDeadlines > 0 ? `${activeDeadlines} active` : 'None set',
      route: '/claims/deadlines',
    },
    {
      icon: Map,
      label: 'Journey',
      detail: phaseLabel,
      route: '/claims/journey',
    },
    {
      icon: Shield,
      label: 'ITF',
      detail: itfFiled ? 'Filed' : 'Not filed',
      route: '/claims/itf',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {cards.map((card) => (
        <Link
          key={card.route}
          to={card.route}
          aria-label={`${card.label} — ${card.detail}`}
          className="flex flex-col items-center gap-1 p-3 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-center"
        >
          <card.icon className="h-5 w-5 text-gold" />
          <span className="text-[11px] font-semibold text-foreground leading-tight">{card.label}</span>
          <span className="text-[10px] text-muted-foreground leading-tight">{card.detail}</span>
        </Link>
      ))}
    </div>
  );
}
