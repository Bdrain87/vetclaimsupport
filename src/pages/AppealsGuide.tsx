import { useState, useMemo, useCallback } from 'react';
import {
  Search, ExternalLink, CheckCircle2, FileDown, Scale,
  Clock, BookOpen, Filter, X, AlertTriangle,
  Gavel, ChevronDown, ChevronUp, User, Crosshair,
  Info, ArrowRight, Sparkles,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { PageContainer } from '@/components/PageContainer';
import { ConditionSelector } from '@/components/shared/ConditionSelector';
import {
  appealLanes,
  searchCaseLaw,
  CASE_LAW_DISCLAIMER,
} from '@/data/appealsData';
import type { VerifiedCase } from '@/data/appealsData';
import useAppStore from '@/store/useAppStore';
import { getConditionById } from '@/data/vaConditions';
import {
  denialReasons,
  findRelevantCases,
  getSuggestedDenialReasons,
  generateRelevanceSummary,
} from '@/data/appealsCaseMatching';
import type { MatchedCase, AppealContext } from '@/data/appealsCaseMatching';
import type { ConditionCategory } from '@/data/conditions/types';

// ── Court display helpers ───────────────────────────────────────────────
const courtLabels: Record<string, string> = {
  BVA: 'Board of Veterans\u2019 Appeals',
  CAVC: 'CAVC',
  FedCir: 'Fed. Circuit',
  SupCt: 'Supreme Court',
};

const courtColors: Record<string, string> = {
  BVA: 'bg-gold/20 text-gold-hl border-gold/30',
  CAVC: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  FedCir: 'bg-gold/20 text-gold border-gold/30',
  SupCt: 'bg-red-500/20 text-red-400 border-red-500/30',
};

// ── Topic filter chips ──────────────────────────────────────────────────
const TOPIC_CHIPS = [
  { value: 'benefit-of-the-doubt', label: 'Benefit of the Doubt' },
  { value: 'nexus', label: 'Nexus' },
  { value: 'service-connection', label: 'Service Connection' },
  { value: 'secondary-connection', label: 'Secondary Connection' },
  { value: 'TDIU', label: 'TDIU' },
  { value: 'inadequate-exam', label: 'Inadequate Exam' },
  { value: 'lay-evidence', label: 'Lay Evidence' },
  { value: 'duty-to-assist', label: 'Duty to Assist' },
  { value: 'musculoskeletal', label: 'Musculoskeletal' },
  { value: 'rating-criteria', label: 'Rating Criteria' },
  { value: 'cp-exam', label: 'C&P Exam' },
  { value: 'aggravation', label: 'Aggravation' },
] as const;

// ── PDF Export ──────────────────────────────────────────────────────────
async function exportCaseLawPDF(cases: VerifiedCase[]) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const usable = pageWidth - margin * 2;
  let y = 20;

  const checkPage = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      y = 20;
    }
  };

  // Title
  doc.setFontSize(18);
  doc.setTextColor(26, 54, 93);
  doc.text('Appeals Guide - Case Law Reference', margin, y);
  y += 8;

  doc.setFontSize(9);
  doc.setTextColor(113, 128, 150);
  doc.text(`Generated ${new Date().toLocaleDateString()} by Vet Claim Support`, margin, y);
  y += 6;

  doc.text(`${cases.length} verified case${cases.length !== 1 ? 's' : ''} included`, margin, y);
  y += 10;

  // Disclaimer
  doc.setFillColor(254, 252, 191);
  const disclaimerLines = doc.splitTextToSize(CASE_LAW_DISCLAIMER, usable - 8);
  const disclaimerHeight = disclaimerLines.length * 4 + 8;
  checkPage(disclaimerHeight);
  doc.roundedRect(margin, y, usable, disclaimerHeight, 2, 2, 'F');
  doc.setFontSize(7);
  doc.setTextColor(116, 66, 16);
  doc.text('DISCLAIMER', margin + 4, y + 5);
  doc.setFontSize(8);
  doc.text(disclaimerLines, margin + 4, y + 10);
  y += disclaimerHeight + 8;

  // Cases
  cases.forEach((c, idx) => {
    checkPage(50);

    // Case header
    doc.setFontSize(11);
    doc.setTextColor(26, 54, 93);
    doc.text(`${idx + 1}. ${c.caseName}`, margin, y);
    y += 5;

    doc.setFontSize(9);
    doc.setTextColor(113, 128, 150);
    doc.text(`${c.citation}  |  ${courtLabels[c.court] || c.court}  |  ${c.year}`, margin + 4, y);
    y += 5;

    if (c.verified) {
      doc.setTextColor(34, 84, 61);
      doc.text('[Verified Source]', margin + 4, y);
      y += 5;
    }

    // Holding
    doc.setFontSize(9);
    doc.setTextColor(45, 55, 72);
    const holdingLines = doc.splitTextToSize(c.holding, usable - 8);
    checkPage(holdingLines.length * 4 + 4);
    doc.text(holdingLines, margin + 4, y);
    y += holdingLines.length * 4 + 2;

    // Topics
    if (c.relevantTopics.length > 0) {
      doc.setFontSize(8);
      doc.setTextColor(113, 128, 150);
      doc.text(`Topics: ${c.relevantTopics.join(', ')}`, margin + 4, y);
      y += 4;
    }

    // Source URL
    doc.setFontSize(8);
    doc.setTextColor(59, 130, 246);
    doc.textWithLink(`Source: ${c.sourceUrl}`, margin + 4, y, { url: c.sourceUrl });
    y += 8;

    // Separator
    if (idx < cases.length - 1) {
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;
    }
  });

  doc.save('appeals-case-law-reference.pdf');
}

async function exportPersonalizedAppealPDF(
  matchedCases: MatchedCase[],
  context: AppealContext,
) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const usable = pageWidth - margin * 2;
  let y = 20;

  const checkPage = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      y = 20;
    }
  };

  doc.setFontSize(18);
  doc.setTextColor(26, 54, 93);
  doc.text('Personalized Appeal Case Law Brief', margin, y);
  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(113, 128, 150);
  doc.text(`Generated ${new Date().toLocaleDateString()} by Vet Claim Support`, margin, y);
  y += 10;

  doc.setFillColor(240, 249, 255);
  const conditionBoxHeight = 24 + (context.denialReasonIds.length > 3 ? 8 : 0);
  checkPage(conditionBoxHeight);
  doc.roundedRect(margin, y, usable, conditionBoxHeight, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setTextColor(26, 54, 93);
  doc.text(`Condition: ${context.conditionName}`, margin + 4, y + 6);
  const selectedReasons = denialReasons.filter((dr) => context.denialReasonIds.includes(dr.id));
  const denialText = selectedReasons.map((r) => r.label).join(', ');
  doc.setFontSize(9);
  doc.setTextColor(113, 128, 150);
  const denialLines = doc.splitTextToSize(`Denial Reason(s): ${denialText}`, usable - 8);
  doc.text(denialLines, margin + 4, y + 12);
  if (context.isSecondary && context.primaryConditionName) {
    doc.text(`Secondary to: ${context.primaryConditionName}`, margin + 4, y + 18);
  }
  y += conditionBoxHeight + 6;
  doc.text(`${matchedCases.length} relevant case${matchedCases.length !== 1 ? 's' : ''} found (ranked by relevance)`, margin, y);
  y += 8;

  doc.setFillColor(254, 252, 191);
  const disclaimerLines = doc.splitTextToSize(CASE_LAW_DISCLAIMER, usable - 8);
  const disclaimerHeight = disclaimerLines.length * 4 + 8;
  checkPage(disclaimerHeight);
  doc.roundedRect(margin, y, usable, disclaimerHeight, 2, 2, 'F');
  doc.setFontSize(7);
  doc.setTextColor(116, 66, 16);
  doc.text('DISCLAIMER', margin + 4, y + 5);
  doc.setFontSize(8);
  doc.text(disclaimerLines, margin + 4, y + 10);
  y += disclaimerHeight + 8;

  matchedCases.forEach((matched, idx) => {
    const c = matched.caseData;
    checkPage(60);
    doc.setFontSize(11);
    doc.setTextColor(26, 54, 93);
    doc.text(`${idx + 1}. ${c.caseName}`, margin, y);
    y += 5;
    doc.setFontSize(9);
    doc.setTextColor(113, 128, 150);
    doc.text(`${c.citation}  |  ${courtLabels[c.court] || c.court}  |  ${c.year}`, margin + 4, y);
    y += 5;
    doc.setTextColor(34, 84, 61);
    doc.text(`[Verified Source]  |  Relevance Score: ${matched.relevanceScore}`, margin + 4, y);
    y += 6;
    if (matched.matchReasons.length > 0) {
      doc.setFontSize(9);
      doc.setTextColor(197, 164, 66);
      doc.text('Why this case matters for your appeal:', margin + 4, y);
      y += 5;
      matched.matchReasons.forEach((reason) => {
        const reasonLines = doc.splitTextToSize(`- ${reason}`, usable - 12);
        checkPage(reasonLines.length * 4);
        doc.setTextColor(45, 55, 72);
        doc.text(reasonLines, margin + 8, y);
        y += reasonLines.length * 4;
      });
      y += 2;
    }
    doc.setFontSize(9);
    doc.setTextColor(45, 55, 72);
    const holdingLines = doc.splitTextToSize(`Holding: ${c.holding}`, usable - 8);
    checkPage(holdingLines.length * 4 + 4);
    doc.text(holdingLines, margin + 4, y);
    y += holdingLines.length * 4 + 2;
    doc.setFontSize(8);
    doc.setTextColor(59, 130, 246);
    doc.textWithLink(`Source: ${c.sourceUrl}`, margin + 4, y, { url: c.sourceUrl });
    y += 8;
    if (idx < matchedCases.length - 1) {
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;
    }
  });

  checkPage(30);
  y += 6;
  doc.setFontSize(10);
  doc.setTextColor(26, 54, 93);
  doc.text('Recommended Next Steps', margin, y);
  y += 6;
  doc.setFontSize(9);
  doc.setTextColor(45, 55, 72);
  const steps = [
    '1. Review each case above and read the full opinion using the source links.',
    '2. Identify which cases most closely match YOUR specific situation.',
    '3. Consult with a VA-accredited attorney, claims agent, or VSO representative.',
    '4. Share this brief with your representative to discuss your appeal strategy.',
    '5. Never cite a case without reading the full opinion first.',
  ];
  steps.forEach((step) => {
    const stepLines = doc.splitTextToSize(step, usable - 4);
    checkPage(stepLines.length * 4 + 2);
    doc.text(stepLines, margin + 4, y);
    y += stepLines.length * 4 + 2;
  });

  doc.save(`appeal-brief-${context.conditionName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}

// ── Sub-components ──────────────────────────────────────────────────────

function DisclaimerBanner() {
  const [acknowledged, setAcknowledged] = useState(false);

  if (acknowledged) {
    return (
      <button
        onClick={() => setAcknowledged(false)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-gold/20 bg-gold/5 text-xs text-gold/70 hover:bg-gold/10 transition-colors"
      >
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
        <span>Legal disclaimer acknowledged — tap to review</span>
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-gold/30 bg-gold/10 backdrop-blur-sm p-4 flex gap-3 items-start">
      <AlertTriangle className="h-5 w-5 text-gold mt-0.5 shrink-0" />
      <div className="space-y-1 flex-1 min-w-0">
        <p className="text-sm text-gold-hl/90 font-medium leading-relaxed">
          {CASE_LAW_DISCLAIMER}
        </p>
        <div className="flex items-center justify-between gap-2 pt-2 flex-wrap">
          <div className="flex items-center gap-1.5 min-w-0">
            <CheckCircle2 className="h-3.5 w-3.5 text-gold shrink-0" />
            <span className="text-xs text-gold font-medium">Only verified sources shown</span>
          </div>
          <button
            onClick={() => setAcknowledged(true)}
            className="px-3 py-1.5 rounded-md bg-gold/20 text-gold-hl text-xs font-medium hover:bg-gold/30 transition-colors flex-shrink-0"
          >
            I Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}

function AppealLaneCard({ lane }: { lane: typeof appealLanes[number] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden transition-all">
      {/* Header */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Scale className="h-5 w-5 text-gold shrink-0" />
            <h3 className="text-base font-semibold text-foreground break-words min-w-0">{lane.name}</h3>
          </div>
          <Badge className="shrink-0 text-[10px] bg-muted/60 text-muted-foreground border-border font-mono px-2 py-0.5">
            {lane.formNumber}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{lane.description}</p>

        {/* Time limit */}
        <div className="flex items-center gap-1.5 text-xs text-gold/90">
          <Clock className="h-3.5 w-3.5" />
          <span className="font-medium">{lane.timeLimit}</span>
        </div>
      </div>

      {/* Best for bullets */}
      <div className="px-4 pb-3">
        <p className="text-xs font-medium text-gold/80 uppercase tracking-wider mb-2">Best for</p>
        <ul className="space-y-1.5">
          {lane.bestFor.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
              <CheckCircle2 className="h-3.5 w-3.5 text-gold/70 mt-0.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Expandable process steps */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-medium text-muted-foreground hover:bg-accent/30 transition-colors border-t border-border/50"
      >
        <span>Process steps ({lane.process.length})</span>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          {lane.process.map((step, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm">
              <span className="shrink-0 w-5 h-5 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="text-foreground/80">{step}</span>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <a
        href={lane.officialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium bg-gold/10 text-gold hover:bg-gold/20 transition-colors border-t border-border/50 overflow-hidden"
      >
        Start this process
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

function CaseLawCard({ caseData }: { caseData: VerifiedCase }) {
  return (
    <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-4 space-y-3">
      {/* Case name + citation */}
      <div className="space-y-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <a
            href={caseData.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-foreground hover:text-gold transition-colors inline-flex items-center gap-1.5 group min-w-0 break-words"
          >
            {caseData.caseName}
            <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          {caseData.verified && (
            <div className="flex items-center gap-1 shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
              <span className="text-[10px] text-gold font-medium">Verified</span>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground font-mono break-all">{caseData.citation}</p>
      </div>

      {/* Court badge + year */}
      <div className="flex items-center gap-2">
        <Badge
          className={cn(
            'text-[10px] px-2 py-0.5 border font-medium',
            courtColors[caseData.court] || 'bg-muted text-muted-foreground'
          )}
        >
          <Gavel className="h-3 w-3 mr-1" />
          {courtLabels[caseData.court] || caseData.court}
        </Badge>
        <span className="text-xs text-muted-foreground">{caseData.year}</span>
      </div>

      {/* Holding */}
      <p className="text-sm text-foreground/80 leading-relaxed">{caseData.holding}</p>

      {/* Topic tags */}
      {caseData.relevantTopics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {caseData.relevantTopics.map((topic) => (
            <Badge
              key={topic}
              variant="outline"
              className="text-[10px] px-2 py-0.5 text-muted-foreground border-border/60"
            >
              {topic}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function MatchedCaseCard({ matched, context }: { matched: MatchedCase; context: AppealContext }) {
  const [showFull, setShowFull] = useState(false);
  const c = matched.caseData;
  const summary = generateRelevanceSummary(matched, context);

  return (
    <div className="rounded-xl border border-gold/30 bg-card/80 backdrop-blur-sm overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0 flex-1">
            <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-foreground hover:text-gold transition-colors inline-flex items-center gap-1.5 group break-words">
              {c.caseName}
              <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <p className="text-xs text-muted-foreground font-mono break-all">{c.citation}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <Badge className="text-[10px] bg-gold/20 text-gold border-gold/30 px-2 py-0.5">Score: {matched.relevanceScore}</Badge>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-gold" />
              <span className="text-[9px] text-gold">Verified</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn('text-[10px] px-2 py-0.5 border font-medium', courtColors[c.court] || 'bg-muted text-muted-foreground')}>
            <Gavel className="h-3 w-3 mr-1" />
            {courtLabels[c.court] || c.court}
          </Badge>
          <span className="text-xs text-muted-foreground">{c.year}</span>
        </div>
        {matched.matchReasons.length > 0 && (
          <div className="rounded-lg bg-gold/5 border border-gold/20 p-3 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-medium text-gold">Why this matters for your appeal</span>
            </div>
            <ul className="space-y-1">
              {matched.matchReasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-foreground/80">
                  <ArrowRight className="h-3 w-3 text-gold/60 mt-0.5 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={() => setShowFull(!showFull)} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          {showFull ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          {showFull ? 'Hide details' : 'Show full holding & summary'}
        </button>
        {showFull && (
          <div className="space-y-3">
            <p className="text-sm text-foreground/80 leading-relaxed">{c.holding}</p>
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground leading-relaxed italic">{summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MyAppealTab() {
  const userConditions = useAppStore((s) => s.userConditions);
  const [selectedConditionId, setSelectedConditionId] = useState<string | null>(null);
  const [selectedDenialReasons, setSelectedDenialReasons] = useState<string[]>([]);
  const [additionalContext, setAdditionalContext] = useState('');
  const [exporting, setExporting] = useState(false);
  const [manualCondition, setManualCondition] = useState('');
  const [manualConditionCategory, setManualConditionCategory] = useState<ConditionCategory | undefined>(undefined);
  const [useManualEntry, setUseManualEntry] = useState(false);

  const conditionsWithDetails = useMemo(() =>
    userConditions.map((uc) => {
      const details = getConditionById(uc.conditionId);
      return { ...uc, details };
    }),
    [userConditions]
  );

  const selectedCondition = useMemo(() => {
    if (!selectedConditionId) return null;
    return conditionsWithDetails.find((c) => c.id === selectedConditionId) || null;
  }, [selectedConditionId, conditionsWithDetails]);

  const conditionCategory = useManualEntry
    ? manualConditionCategory
    : (selectedCondition?.details?.category as ConditionCategory | undefined);
  const conditionName = useManualEntry
    ? manualCondition
    : (selectedCondition?.details?.name || selectedCondition?.conditionId || '');

  const suggestedReasons = useMemo(
    () => getSuggestedDenialReasons(conditionCategory),
    [conditionCategory]
  );

  const toggleDenialReason = (id: string) => {
    setSelectedDenialReasons((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const appealContext: AppealContext | null = useMemo(() => {
    if ((!selectedConditionId && !manualCondition) || selectedDenialReasons.length === 0) return null;
    return {
      conditionName,
      conditionCategory,
      denialReasonIds: selectedDenialReasons,
      additionalContext: additionalContext || undefined,
      isSecondary: selectedCondition ? !selectedCondition.isPrimary : false,
      primaryConditionName: selectedCondition?.linkedPrimaryId
        ? conditionsWithDetails.find((c) => c.id === selectedCondition.linkedPrimaryId)?.details?.name
        : undefined,
    };
  }, [selectedConditionId, manualCondition, conditionName, conditionCategory, selectedDenialReasons, additionalContext, selectedCondition, conditionsWithDetails]);

  const matchedCases = useMemo(() => {
    if (!appealContext) return [];
    return findRelevantCases(appealContext);
  }, [appealContext]);

  const handleExport = useCallback(async () => {
    if (!appealContext || matchedCases.length === 0) return;
    setExporting(true);
    try {
      await exportPersonalizedAppealPDF(matchedCases, appealContext);
    } finally {
      setExporting(false);
    }
  }, [matchedCases, appealContext]);

  const hasResults = matchedCases.length > 0;
  const topCases = matchedCases.slice(0, 15);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-gold/20 bg-gold/5 backdrop-blur-sm p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Crosshair className="h-4 w-4 text-gold" />
          <h3 className="text-sm font-semibold text-foreground">How It Works</h3>
        </div>
        <ol className="space-y-1.5 text-xs text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-4 h-4 rounded-full bg-gold/20 text-gold text-[10px] font-bold flex items-center justify-center mt-0.5">1</span>
            <span>Select the condition you want to appeal</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-4 h-4 rounded-full bg-gold/20 text-gold text-[10px] font-bold flex items-center justify-center mt-0.5">2</span>
            <span>Choose why your claim was denied</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-4 h-4 rounded-full bg-gold/20 text-gold text-[10px] font-bold flex items-center justify-center mt-0.5">3</span>
            <span>Get matched to verified case law ranked by relevance</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-4 h-4 rounded-full bg-gold/20 text-gold text-[10px] font-bold flex items-center justify-center mt-0.5">4</span>
            <span>Export a personalized brief to share with your VSO or attorney</span>
          </li>
        </ol>
        <div className="flex items-start gap-1.5 pt-1">
          <Info className="h-3 w-3 text-gold/60 mt-0.5 shrink-0" />
          <p className="text-[10px] text-gold/80">
            All case citations are real, verified decisions from a curated database. No AI-generated citations. Always verify cases independently before use.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="shrink-0 w-6 h-6 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center">1</span>
          <h3 className="text-sm font-semibold text-foreground">Select Your Condition</h3>
        </div>
        {userConditions.length > 0 && !useManualEntry ? (
          <div className="space-y-2">
            <div className="grid gap-2">
              {conditionsWithDetails.map((uc) => (
                <button
                  key={uc.id}
                  onClick={() => setSelectedConditionId(uc.id === selectedConditionId ? null : uc.id)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border text-left transition-all',
                    selectedConditionId === uc.id ? 'border-gold/50 bg-gold/10 ring-1 ring-gold/20' : 'border-border bg-card/60 hover:bg-accent/30'
                  )}
                >
                  <User className="h-4 w-4 text-gold shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{uc.details?.name || uc.conditionId}</p>
                    {uc.details?.category && (
                      <p className="text-[10px] text-muted-foreground capitalize">{uc.details.category.replace('-', ' ')}</p>
                    )}
                  </div>
                  {!uc.isPrimary && <Badge variant="outline" className="text-[9px] shrink-0">Secondary</Badge>}
                  {uc.claimStatus === 'denied' && <Badge className="text-[9px] bg-red-500/20 text-red-400 border-red-500/30 shrink-0">Denied</Badge>}
                  {uc.claimStatus === 'appeal' && <Badge className="text-[9px] bg-gold/20 text-gold border-gold/30 shrink-0">Appeal</Badge>}
                </button>
              ))}
            </div>
            <button onClick={() => setUseManualEntry(true)} className="text-xs text-gold hover:text-gold/80 transition-colors">Or enter a condition manually</button>
          </div>
        ) : (
          <div className="space-y-2">
            <ConditionSelector
              onSelect={(selected) => {
                const vaCondition = getConditionById(selected.conditionId);
                if (vaCondition) {
                  setManualCondition(vaCondition.abbreviation || vaCondition.name);
                  setManualConditionCategory(vaCondition.category as ConditionCategory);
                } else {
                  // Fallback for non-DB conditions (MOS/presumptive)
                  setManualCondition(selected.name);
                  setManualConditionCategory(undefined);
                }
              }}
              label="Search for a condition"
              placeholder="Search for a condition (e.g., PTSD, Sleep Apnea, Lumbar Strain)..."
            />
            {manualCondition && (
              <p className="text-xs text-gold">Selected: {manualCondition}</p>
            )}
            {userConditions.length > 0 && (
              <button onClick={() => { setUseManualEntry(false); setManualCondition(''); setManualConditionCategory(undefined); }} className="text-xs text-gold hover:text-gold/80 transition-colors">Select from your conditions instead</button>
            )}
          </div>
        )}
      </div>

      {(selectedConditionId || manualCondition.length > 2) && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="shrink-0 w-6 h-6 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center">2</span>
            <h3 className="text-sm font-semibold text-foreground">Why Was It Denied?</h3>
          </div>
          <p className="text-xs text-muted-foreground">Select all that apply. This helps match you to the most relevant case law.</p>
          <div className="grid gap-2">
            {suggestedReasons.map((reason) => (
              <button
                key={reason.id}
                onClick={() => toggleDenialReason(reason.id)}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg border text-left transition-all',
                  selectedDenialReasons.includes(reason.id) ? 'border-gold/50 bg-gold/10 ring-1 ring-gold/20' : 'border-border bg-card/60 hover:bg-accent/30'
                )}
              >
                <div className={cn(
                  'shrink-0 w-4 h-4 rounded border mt-0.5 flex items-center justify-center transition-all',
                  selectedDenialReasons.includes(reason.id) ? 'bg-gold border-gold' : 'border-muted-foreground/30'
                )}>
                  {selectedDenialReasons.includes(reason.id) && <CheckCircle2 className="h-3 w-3 text-black" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{reason.label}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{reason.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedDenialReasons.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Optional: Add details about your denial (this improves matching).</p>
          <Input placeholder="e.g., Examiner spent 5 minutes, didn't review my records..." value={additionalContext} onChange={(e) => setAdditionalContext(e.target.value)} />
        </div>
      )}

      {hasResults && appealContext && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="shrink-0 w-6 h-6 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center">3</span>
              <h3 className="text-sm font-semibold text-foreground">Matched Case Law ({matchedCases.length})</h3>
            </div>
            <button onClick={handleExport} disabled={exporting} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20 transition-all">
              <FileDown className="h-3.5 w-3.5" />
              {exporting ? 'Generating...' : 'Export Brief'}
            </button>
          </div>
          <div className="space-y-3">
            {topCases.map((matched) => (
              <MatchedCaseCard key={matched.caseData.id} matched={matched} context={appealContext} />
            ))}
          </div>
          {matchedCases.length > 15 && (
            <p className="text-xs text-muted-foreground text-center">Showing top 15 of {matchedCases.length} matched cases. Export the PDF for the full list.</p>
          )}
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-2">
            <h4 className="text-sm font-medium text-blue-400">Recommended Next Steps</h4>
            <ul className="space-y-1.5 text-xs text-blue-300/80">
              <li className="flex items-start gap-1.5"><ArrowRight className="h-3 w-3 mt-0.5 shrink-0" /><span>Export this brief and share it with a VA-accredited attorney or VSO representative</span></li>
              <li className="flex items-start gap-1.5"><ArrowRight className="h-3 w-3 mt-0.5 shrink-0" /><span>Read the full opinion of each case using the source links before relying on it</span></li>
              <li className="flex items-start gap-1.5"><ArrowRight className="h-3 w-3 mt-0.5 shrink-0" /><span>Review the Appeal Lanes tab to determine which appeal path is best for your situation</span></li>
            </ul>
          </div>
        </div>
      )}

      {selectedDenialReasons.length > 0 && !hasResults && (
        <div className="text-center py-8 space-y-3">
          <Gavel className="h-10 w-10 text-muted-foreground/30 mx-auto" />
          <p className="text-sm text-muted-foreground">No matching cases found. Try selecting different denial reasons or adding more context.</p>
        </div>
      )}
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────

export default function AppealsGuide() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConditionCategory, setSelectedConditionCategory] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [exporting, setExporting] = useState(false);

  const filteredCases = useMemo(() => {
    const filters: { conditions?: string[]; topics?: string[] } = {};
    if (selectedConditionCategory) filters.conditions = [selectedConditionCategory];
    if (activeTopic) filters.topics = [activeTopic];
    const hasFilters = Object.keys(filters).length > 0;
    return searchCaseLaw(searchQuery, hasFilters ? filters : undefined);
  }, [searchQuery, selectedConditionCategory, activeTopic]);

  const handleExportPDF = useCallback(async () => {
    if (filteredCases.length === 0) return;
    setExporting(true);
    try {
      await exportCaseLawPDF(filteredCases);
    } finally {
      setExporting(false);
    }
  }, [filteredCases]);

  const clearFilters = () => {
    setSearchQuery('');
    setActiveTopic(null);
    setSelectedConditionCategory(null);
  };

  const hasActiveFilters = searchQuery.length > 0 || activeTopic !== null || selectedConditionCategory !== null;

  return (
    <PageContainer className="py-6 space-y-5">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Scale className="h-6 w-6 text-gold" />
          <h1 className="text-2xl font-bold text-foreground">Appeals Guide</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Understand your appeal options, find matching case law, and export personalized briefs.
        </p>
      </div>

      {/* Disclaimer banner */}
      <DisclaimerBanner />

      {/* Tabs */}
      <Tabs defaultValue="my-appeal" className="space-y-4">
        <TabsList className="w-full grid grid-cols-3 bg-muted/50 border border-border/50">
          <TabsTrigger
            value="my-appeal"
            className="data-[state=active]:bg-gold/15 data-[state=active]:text-gold text-xs sm:text-sm"
          >
            <Crosshair className="h-4 w-4 sm:mr-1.5 shrink-0" />
            <span className="hidden sm:inline">My Appeal</span>
            <span className="sm:hidden">Appeal</span>
          </TabsTrigger>
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gold/15 data-[state=active]:text-gold text-xs sm:text-sm"
          >
            <BookOpen className="h-4 w-4 sm:mr-1.5 shrink-0" />
            <span className="hidden sm:inline">Appeal Lanes</span>
            <span className="sm:hidden">Lanes</span>
          </TabsTrigger>
          <TabsTrigger
            value="caselaw"
            className="data-[state=active]:bg-gold/15 data-[state=active]:text-gold text-xs sm:text-sm"
          >
            <Gavel className="h-4 w-4 mr-1.5" />
            Case Law
          </TabsTrigger>
        </TabsList>

        {/* ── My Appeal Tab ──────────────────────────────────────────── */}
        <TabsContent value="my-appeal" className="space-y-4">
          <MyAppealTab />
        </TabsContent>

        {/* ── Appeals Overview Tab ─────────────────────────────────────── */}
        <TabsContent value="overview" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            After an unfavorable VA decision, you have three main lanes plus the
            federal court system. Each has different rules, timelines, and
            strategic advantages.
          </p>

          <div className="space-y-4">
            {appealLanes.map((lane) => (
              <AppealLaneCard key={lane.id} lane={lane} />
            ))}
          </div>
        </TabsContent>

        {/* ── Case Law Search Tab ──────────────────────────────────────── */}
        <TabsContent value="caselaw" className="space-y-4">
          {/* Condition autocomplete - search by code, name, keyword */}
          <ConditionSelector
            onSelect={(selected) => {
              const vaCondition = getConditionById(selected.conditionId);
              if (vaCondition) {
                setSearchQuery(vaCondition.abbreviation || vaCondition.name);
                setSelectedConditionCategory(vaCondition.category || null);
              } else {
                // Fallback for non-DB conditions (MOS/presumptive)
                setSearchQuery(selected.name);
                setSelectedConditionCategory(null);
              }
            }}
            label="Search by condition"
            placeholder="Search by condition code, name, or keyword..."
          />

          {/* Text search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cases, holdings, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
              aria-label="Search appeals"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Filter toggle + chips */}
          <div className="space-y-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Filter className="h-3.5 w-3.5" />
              {showFilters ? 'Hide' : 'Show'} topic filters
              {activeTopic && (
                <Badge className="ml-1 text-[9px] bg-gold/20 text-gold border-gold/30 px-1.5 py-0">
                  1 active
                </Badge>
              )}
            </button>

            {showFilters && (
              <div className="flex flex-wrap gap-1.5">
                {TOPIC_CHIPS.map((chip) => (
                  <button
                    key={chip.value}
                    onClick={() =>
                      setActiveTopic(activeTopic === chip.value ? null : chip.value)
                    }
                    className={cn(
                      'px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all',
                      activeTopic === chip.value
                        ? 'bg-gold/20 text-gold border-gold/40 shadow-sm shadow-gold/10'
                        : 'bg-muted/40 text-muted-foreground border-border/50 hover:bg-muted/60'
                    )}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredCases.length} case{filteredCases.length !== 1 ? 's' : ''} found
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-gold hover:text-gold/80 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            <button
              onClick={handleExportPDF}
              disabled={exporting || filteredCases.length === 0}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                filteredCases.length > 0
                  ? 'bg-gold/10 text-gold border-gold/30 hover:bg-gold/20'
                  : 'bg-muted/30 text-muted-foreground/50 border-border/30 cursor-not-allowed'
              )}
            >
              <FileDown className="h-3.5 w-3.5" />
              {exporting ? 'Generating...' : 'Export PDF'}
            </button>
          </div>

          {/* Case results */}
          {filteredCases.length > 0 ? (
            <div className="space-y-3">
              {filteredCases.map((c) => (
                <CaseLawCard key={c.id} caseData={c} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <Gavel className="h-10 w-10 text-muted-foreground/30 mx-auto" />
              <p className="text-sm text-muted-foreground">
                No cases match your search.
              </p>
              <button
                onClick={clearFilters}
                className="text-xs text-gold hover:text-gold/80 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
