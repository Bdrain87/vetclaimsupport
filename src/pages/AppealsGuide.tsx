import { useState, useMemo, useCallback } from 'react';
import {
  Search, ExternalLink, CheckCircle2, FileDown, Scale,
  Clock, ArrowRight, BookOpen, Filter, X, AlertTriangle,
  Gavel, ChevronDown, ChevronUp,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { PageContainer } from '@/components/PageContainer';
import {
  appealLanes,
  verifiedCases,
  searchCaseLaw,
  CASE_LAW_DISCLAIMER,
} from '@/data/appealsData';
import type { VerifiedCase } from '@/data/appealsData';

// ── Court display helpers ───────────────────────────────────────────────
const courtLabels: Record<string, string> = {
  BVA: 'Board of Veterans\u2019 Appeals',
  CAVC: 'CAVC',
  FedCir: 'Fed. Circuit',
  SupCt: 'Supreme Court',
};

const courtColors: Record<string, string> = {
  BVA: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  CAVC: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  FedCir: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
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

// ── Sub-components ──────────────────────────────────────────────────────

function DisclaimerBanner() {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm p-4 flex gap-3 items-start">
      <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
      <div className="space-y-1">
        <p className="text-sm text-amber-200/90 font-medium leading-relaxed">
          {CASE_LAW_DISCLAIMER}
        </p>
        <div className="flex items-center gap-1.5 pt-1">
          <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
          <span className="text-xs text-gold font-medium">Only verified sources shown</span>
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
        <div className="flex items-center gap-1.5 text-xs text-amber-400/90">
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

// ── Main Page ───────────────────────────────────────────────────────────

export default function AppealsGuide() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [exporting, setExporting] = useState(false);

  const filteredCases = useMemo(
    () => searchCaseLaw(searchQuery, activeTopic ?? undefined),
    [searchQuery, activeTopic]
  );

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
  };

  const hasActiveFilters = searchQuery.length > 0 || activeTopic !== null;

  return (
    <PageContainer className="py-6 space-y-5">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Scale className="h-6 w-6 text-gold" />
          <h1 className="text-2xl font-bold text-foreground">Appeals Guide</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Understand your appeal options and reference verified case law.
        </p>
      </div>

      {/* Disclaimer banner */}
      <DisclaimerBanner />

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full grid grid-cols-2 bg-muted/50 border border-border/50">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gold/15 data-[state=active]:text-gold text-sm"
          >
            <BookOpen className="h-4 w-4 mr-1.5" />
            Appeal Lanes
          </TabsTrigger>
          <TabsTrigger
            value="caselaw"
            className="data-[state=active]:bg-gold/15 data-[state=active]:text-gold text-sm"
          >
            <Gavel className="h-4 w-4 mr-1.5" />
            Case Law
          </TabsTrigger>
        </TabsList>

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
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cases, holdings, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
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
