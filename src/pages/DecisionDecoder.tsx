import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  FileSearch,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ExternalLink,
  Scale,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { PageContainer } from '@/components/PageContainer';

// ---------------------------------------------------------------------------
// Common VA denial reason patterns and their plain-English explanations
// ---------------------------------------------------------------------------

interface DenialPattern {
  pattern: RegExp;
  code: string;
  title: string;
  explanation: string;
  whatItMeans: string;
  evidenceNeeded: string;
}

const DENIAL_PATTERNS: DenialPattern[] = [
  {
    pattern: /nexus|service.?connection|not.?related.?to.?service|no.?link|not.?linked|not.?connected/i,
    code: 'NEXUS',
    title: 'Insufficient Evidence of Service Connection (Nexus)',
    explanation:
      'The VA did not find enough medical evidence linking your condition to your military service. A "nexus" is the medical connection between your current disability and a specific in-service event, injury, or exposure.',
    whatItMeans:
      'The VA acknowledged you have the condition, but found no medical opinion or evidence establishing that it was caused by or related to your military service.',
    evidenceNeeded:
      'A medical opinion from a qualified provider stating your condition is "at least as likely as not" related to service. This is commonly called a nexus letter or independent medical opinion (IMO).',
  },
  {
    pattern: /current.?disability|no.?diagnosis|not.?diagnosed|no.?current|without.?a.?current/i,
    code: 'NO_DX',
    title: 'No Current Diagnosis',
    explanation:
      'The VA found no current medical diagnosis for the claimed condition. To receive a disability rating, you must have a condition that is currently diagnosed by a medical professional.',
    whatItMeans:
      'Either the C&P examiner did not diagnose the condition, your medical records do not contain a diagnosis, or a previous diagnosis may have resolved.',
    evidenceNeeded:
      'A current diagnosis from a licensed medical provider. This can be from a VA provider, private physician, or specialist. The diagnosis should be documented in medical records.',
  },
  {
    pattern: /in.?service.?event|no.?evidence.?of.?(?:an?\s+)?event|stressor|no.?record.?of/i,
    code: 'NO_EVENT',
    title: 'No Evidence of In-Service Event',
    explanation:
      'The VA could not verify that the claimed event, injury, or exposure occurred during military service. Service treatment records (STRs), personnel records, and other military documents did not corroborate the claimed in-service incident.',
    whatItMeans:
      'The VA is not disputing your current condition, but could not confirm the in-service event that you believe caused it.',
    evidenceNeeded:
      'Buddy statements from fellow service members, personal statements describing the event in detail, service records, unit records, or deployment records corroborating the event.',
  },
  {
    pattern: /aggravat|pre.?exist|pre.existing|existed.?prior/i,
    code: 'PREEXIST',
    title: 'Pre-Existing Condition Not Aggravated',
    explanation:
      'The VA determined your condition existed before military service and was not permanently worsened (aggravated) by your service. Under the "presumption of soundness," you are presumed healthy at entry unless a condition was noted on your entrance exam.',
    whatItMeans:
      'The VA found evidence the condition existed before service and concluded service did not make it permanently worse beyond its natural progression.',
    evidenceNeeded:
      'Medical evidence showing the condition worsened during or after service beyond normal progression. Compare pre-service medical records with current severity.',
  },
  {
    pattern: /not.?disabling|0.?percent|non.?compensable|does.?not.?meet|criteria.?not.?met/i,
    code: 'ZERO_PCT',
    title: 'Service-Connected but Non-Compensable (0%)',
    explanation:
      'The VA acknowledged your condition is service-connected but rated it at 0% because it does not currently meet the criteria for a compensable rating under the VA rating schedule.',
    whatItMeans:
      'Good news: your condition IS service-connected. However, the VA found your current symptoms do not rise to a compensable level under 38 CFR Part 4.',
    evidenceNeeded:
      'Document that your symptoms meet the criteria for 10% or higher. Review the rating criteria for your specific condition in 38 CFR Part 4 and provide evidence matching the next rating level.',
  },
  {
    pattern: /c&p|compensation.?(?:and|&).?pension|exam(?:ination)?|examiner.?(?:found|determined|opined)/i,
    code: 'CP_EXAM',
    title: 'C&P Examination Finding',
    explanation:
      'The VA relied on the findings from a Compensation & Pension (C&P) examination in making this decision. The C&P examiner\'s opinion carries significant weight in VA rating decisions.',
    whatItMeans:
      'The C&P examiner\'s findings were a key factor in this decision. If you disagree with the examiner\'s conclusions, you may need evidence countering their opinion.',
    evidenceNeeded:
      'If you believe the C&P exam was inadequate or the examiner\'s opinion was wrong, obtain a private medical opinion that addresses the specific points raised by the C&P examiner.',
  },
  {
    pattern: /secondary|caused.?by.?(?:your|a).?service|proximately.?due/i,
    code: 'SECONDARY',
    title: 'Secondary Service Connection',
    explanation:
      'This decision involves a claim for secondary service connection — a condition caused or aggravated by an already service-connected disability.',
    whatItMeans:
      'For secondary claims, the VA evaluates whether your already service-connected condition caused or permanently worsened this new condition.',
    evidenceNeeded:
      'A medical opinion establishing that your service-connected condition caused or aggravated the secondary condition. The opinion should explain the medical mechanism.',
  },
  {
    pattern: /presumptive|pact.?act|burn.?pit|toxic.?exposure|camp.?lejeune|agent.?orange|radiation/i,
    code: 'PRESUMPTIVE',
    title: 'Presumptive Service Connection',
    explanation:
      'This decision involves a presumptive condition — one that the VA presumes is related to service based on specific criteria (deployment location, toxic exposure, time period, etc.).',
    whatItMeans:
      'For presumptive conditions, you generally do not need a nexus letter. You need to establish that you served in the qualifying location/time period and have a current diagnosis of the presumptive condition.',
    evidenceNeeded:
      'Proof of qualifying service (deployment records, DD-214) and a current diagnosis of the presumptive condition.',
  },
  {
    pattern: /increase|wors(?:en|ened)|higher.?rating|(?:rating|evaluation).?(?:increase|higher)|severity/i,
    code: 'INCREASE',
    title: 'Claim for Increased Rating',
    explanation:
      'This decision involves a request to increase the rating for an already service-connected condition. The VA evaluated whether your condition has worsened since the last rating decision.',
    whatItMeans:
      'The VA compared your current symptoms to the rating criteria for your condition and determined your current rating accurately reflects your level of disability.',
    evidenceNeeded:
      'Evidence showing your condition has worsened since the last exam. Document increased frequency, severity, and functional limitations. A new C&P exam may show different findings.',
  },
];

// ---------------------------------------------------------------------------
// Appeal pathway educational information
// ---------------------------------------------------------------------------

interface AppealPathway {
  name: string;
  abbreviation: string;
  description: string;
  timeline: string;
  deadline: string;
  bestFor: string[];
  limitations: string[];
  learnMoreUrl: string;
}

const APPEAL_PATHWAYS: AppealPathway[] = [
  {
    name: 'Supplemental Claim',
    abbreviation: 'SC',
    description:
      'File a new claim with new and relevant evidence that was not previously considered by the VA. This can include new medical records, a new medical opinion (nexus letter), buddy statements, or any evidence not in your file at the time of the original decision.',
    timeline: 'Average 4-5 months for a decision',
    deadline: 'No deadline — can be filed at any time',
    bestFor: [
      'You have new evidence the VA has not seen',
      'You can get a new medical opinion or nexus letter',
      'You found errors in your medical records',
      'You have buddy statements or other lay evidence to add',
    ],
    limitations: [
      'Must include new and relevant evidence (cannot re-submit same evidence)',
      'May result in a new C&P exam',
      'Does not preserve the original effective date unless filed within 1 year',
    ],
    learnMoreUrl: 'https://www.va.gov/decision-reviews/supplemental-claim/',
  },
  {
    name: 'Higher-Level Review',
    abbreviation: 'HLR',
    description:
      'A senior VA reviewer re-examines your existing claim file. No new evidence is submitted — the reviewer looks at the same evidence and determines if the original decision contained a clear and unmistakable error (CUE) or if the evidence was not properly weighed.',
    timeline: 'Average 4-5 months for a decision',
    deadline: '1 year from the date of the decision',
    bestFor: [
      'You believe the VA made an error evaluating existing evidence',
      'The C&P exam did not accurately reflect your condition',
      'The VA did not properly apply the rating criteria',
      'You do not have new evidence to submit',
    ],
    limitations: [
      'Cannot submit new evidence',
      'The reviewer may not change the decision if the evidence genuinely supports it',
      'You can request an informal conference to explain your position',
    ],
    learnMoreUrl: 'https://www.va.gov/decision-reviews/higher-level-review/',
  },
  {
    name: 'Board of Veterans\' Appeals',
    abbreviation: 'BVA',
    description:
      'Appeal to a Veterans Law Judge at the Board of Veterans\' Appeals. You can choose from three dockets: Direct Review (judge reviews existing evidence), Evidence Submission (submit new evidence), or Hearing Request (testify before the judge).',
    timeline: 'Average 1-2 years depending on docket',
    deadline: '1 year from the date of the decision',
    bestFor: [
      'Your case involves complex legal or medical questions',
      'Previous decision reviews did not resolve the issue',
      'You want to present your case directly to a judge',
      'You have strong evidence that was not properly weighed',
    ],
    limitations: [
      'Significantly longer wait time',
      'May benefit from legal representation (VSO or attorney)',
      'Direct Review docket does not allow new evidence',
    ],
    learnMoreUrl: 'https://www.va.gov/decision-reviews/board-appeal/',
  },
];

// ---------------------------------------------------------------------------
// Parser: extract structured info from pasted decision letter text
// ---------------------------------------------------------------------------

interface ParsedDecision {
  grantedConditions: string[];
  deniedConditions: string[];
  deferredConditions: string[];
  matchedPatterns: DenialPattern[];
  effectiveDate: string | null;
  combinedRating: number | null;
  rawText: string;
}

function parseDecisionLetter(text: string): ParsedDecision {
  const result: ParsedDecision = {
    grantedConditions: [],
    deniedConditions: [],
    deferredConditions: [],
    matchedPatterns: [],
    effectiveDate: null,
    combinedRating: null,
    rawText: text,
  };

  // Extract effective date
  const dateMatch = text.match(/effective\s+(?:date\s+)?(?:of\s+)?(\w+\s+\d{1,2},?\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4})/i);
  if (dateMatch) result.effectiveDate = dateMatch[1];

  // Extract combined rating
  const ratingMatch = text.match(/combined\s+(?:disability\s+)?(?:evaluation|rating)\s+(?:of\s+)?(\d{1,3})\s*%/i);
  if (ratingMatch) result.combinedRating = parseInt(ratingMatch[1]);

  // Look for granted conditions (service connection granted, evaluation of X%)
  const grantedPattern = /(?:service\s+connection\s+(?:for\s+)?|evaluation\s+of\s+\d+%\s+for\s+)([^,.\n]+?)(?:\s+is\s+granted|\s+effective)/gi;
  let match;
  while ((match = grantedPattern.exec(text)) !== null) {
    const condition = match[1].trim();
    if (condition.length > 2 && condition.length < 100) {
      result.grantedConditions.push(condition);
    }
  }

  // Look for denied conditions
  const deniedPattern = /(?:service\s+connection\s+(?:for\s+)?|entitlement\s+to\s+(?:service\s+connection\s+for\s+)?)([^,.\n]+?)(?:\s+is\s+denied|\s+is\s+not\s+warranted)/gi;
  while ((match = deniedPattern.exec(text)) !== null) {
    const condition = match[1].trim();
    if (condition.length > 2 && condition.length < 100) {
      result.deniedConditions.push(condition);
    }
  }

  // Look for deferred conditions
  const deferredPattern = /(?:decision\s+on\s+|issue\s+of\s+)([^,.\n]+?)\s+(?:is\s+deferred|has\s+been\s+deferred)/gi;
  while ((match = deferredPattern.exec(text)) !== null) {
    const condition = match[1].trim();
    if (condition.length > 2 && condition.length < 100) {
      result.deferredConditions.push(condition);
    }
  }

  // Match denial patterns
  const seen = new Set<string>();
  for (const dp of DENIAL_PATTERNS) {
    if (dp.pattern.test(text) && !seen.has(dp.code)) {
      result.matchedPatterns.push(dp);
      seen.add(dp.code);
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DecisionDecoder() {
  const navigate = useNavigate();
  const [letterText, setLetterText] = useState('');
  const [parsed, setParsed] = useState<ParsedDecision | null>(null);
  const [expandedPathways, setExpandedPathways] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const handleAnalyze = useCallback(() => {
    if (letterText.trim().length < 20) return;
    const result = parseDecisionLetter(letterText);
    setParsed(result);
  }, [letterText]);

  const handleClear = useCallback(() => {
    setLetterText('');
    setParsed(null);
  }, []);

  const togglePathway = (name: string) => {
    setExpandedPathways((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleCopySummary = useCallback(async () => {
    if (!parsed) return;
    const lines = [
      'DECISION LETTER SUMMARY',
      '',
      parsed.effectiveDate ? `Effective Date: ${parsed.effectiveDate}` : '',
      parsed.combinedRating !== null ? `Combined Rating: ${parsed.combinedRating}%` : '',
      '',
      parsed.grantedConditions.length > 0
        ? `GRANTED:\n${parsed.grantedConditions.map((c) => `  - ${c}`).join('\n')}`
        : '',
      parsed.deniedConditions.length > 0
        ? `DENIED:\n${parsed.deniedConditions.map((c) => `  - ${c}`).join('\n')}`
        : '',
      '',
      parsed.matchedPatterns.length > 0
        ? `KEY ISSUES IDENTIFIED:\n${parsed.matchedPatterns.map((p) => `  - ${p.title}`).join('\n')}`
        : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(lines);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fallback
    }
  }, [parsed]);

  return (
    <PageContainer className="py-6 space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/20">
            <FileSearch className="h-6 w-6 text-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Decision Decoder</h1>
            <p className="text-muted-foreground text-sm">
              Understand your VA decision letter in plain English
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex gap-3 p-3 rounded-2xl border border-blue-500/20 bg-blue-500/5">
        <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          This tool provides general educational explanations of common VA decision language. It does not
          provide legal advice or recommend specific actions for your claim. For personalized guidance,
          consult a{' '}
          <a
            href="https://www.va.gov/get-help-from-accredited-representative/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline"
          >
            free VA-accredited representative
          </a>{' '}
          (VSO, attorney, or claims agent). Your decision letter text is processed entirely on your device
          and is never sent to any server.
        </p>
      </div>

      {/* Input */}
      {!parsed && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="letter">Paste your VA decision letter text below</Label>
            <Textarea
              id="letter"
              placeholder="Copy and paste the text from your VA decision letter here. You can find your decision letters at VA.gov under 'Check your claim or appeal status' or in the VA Health and Benefits mobile app under 'Claims'..."
              value={letterText}
              onChange={(e) => setLetterText(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              {letterText.length > 0
                ? `${letterText.length} characters pasted`
                : 'Tip: Select all text in your decision letter PDF, copy, and paste here.'}
            </p>
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={letterText.trim().length < 20}
            className="w-full"
            size="lg"
          >
            <FileSearch className="h-5 w-5 mr-2" />
            Analyze Decision Letter
          </Button>
        </div>
      )}

      {/* Results */}
      {parsed && (
        <div className="space-y-4">
          {/* Quick stats */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleClear}>
              Analyze Another
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopySummary}
              className="gap-1.5"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy Summary'}
            </Button>
          </div>

          {/* Effective date + combined rating */}
          {(parsed.effectiveDate || parsed.combinedRating !== null) && (
            <Card className="border-gold/20 bg-gold/5">
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-4 text-sm">
                  {parsed.effectiveDate && (
                    <div>
                      <span className="text-muted-foreground">Effective Date: </span>
                      <span className="text-foreground font-medium">{parsed.effectiveDate}</span>
                    </div>
                  )}
                  {parsed.combinedRating !== null && (
                    <div>
                      <span className="text-muted-foreground">Combined Rating: </span>
                      <span className="text-foreground font-bold">{parsed.combinedRating}%</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Granted conditions */}
          {parsed.grantedConditions.length > 0 && (
            <Card className="border-green-500/20">
              <CardContent className="py-3 px-4 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-semibold text-foreground">
                    Granted ({parsed.grantedConditions.length})
                  </span>
                </div>
                {parsed.grantedConditions.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground pl-6">
                    <span className="text-green-400 flex-shrink-0">•</span>
                    <span>{c}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Denied conditions */}
          {parsed.deniedConditions.length > 0 && (
            <Card className="border-destructive/20">
              <CardContent className="py-3 px-4 space-y-2">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-semibold text-foreground">
                    Denied ({parsed.deniedConditions.length})
                  </span>
                </div>
                {parsed.deniedConditions.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground pl-6">
                    <span className="text-destructive/60 flex-shrink-0">•</span>
                    <span>{c}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Deferred */}
          {parsed.deferredConditions.length > 0 && (
            <Card className="border-gold/20">
              <CardContent className="py-3 px-4 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-gold" />
                  <span className="text-sm font-semibold text-foreground">
                    Deferred ({parsed.deferredConditions.length})
                  </span>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  These conditions are still being reviewed. The VA will issue a separate decision later.
                </p>
                {parsed.deferredConditions.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground pl-6">
                    <span className="text-gold flex-shrink-0">•</span>
                    <span>{c}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* No conditions detected */}
          {parsed.grantedConditions.length === 0 &&
            parsed.deniedConditions.length === 0 &&
            parsed.deferredConditions.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="py-4 px-4">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Could not automatically extract specific conditions from this text. The explanations
                    below may still be helpful. For best results, paste the full decision letter text
                    including the "Decision" and "Reasons for Decision" sections.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Matched denial patterns / explanations */}
          {parsed.matchedPatterns.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                Key Issues Identified
              </p>
              {parsed.matchedPatterns.map((dp) => (
                <Card key={dp.code}>
                  <CardContent className="py-3 px-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px]">
                        {dp.code}
                      </Badge>
                      <span className="text-sm font-semibold text-foreground">{dp.title}</span>
                    </div>

                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div>
                        <p className="text-[10px] font-semibold text-foreground uppercase tracking-wider mb-0.5">
                          What This Means
                        </p>
                        <p className="leading-relaxed">{dp.explanation}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-foreground uppercase tracking-wider mb-0.5">
                          In Your Case
                        </p>
                        <p className="leading-relaxed">{dp.whatItMeans}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-foreground uppercase tracking-wider mb-0.5">
                          Evidence That Generally Helps
                        </p>
                        <p className="leading-relaxed">{dp.evidenceNeeded}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Appeal pathways — educational only */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Scale className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Decision Review Options (Educational)
              </p>
            </div>
            <p className="text-xs text-muted-foreground px-1">
              If you disagree with a decision, the VA provides three review options. Each has different
              rules and timelines. A VA-accredited representative can help you choose the best option for
              your specific situation.
            </p>

            {APPEAL_PATHWAYS.map((pathway) => {
              const isExpanded = expandedPathways.has(pathway.name);
              return (
                <Collapsible
                  key={pathway.name}
                  open={isExpanded}
                  onOpenChange={() => togglePathway(pathway.name)}
                >
                  <Card>
                    <CollapsibleTrigger className="w-full text-left p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] px-1.5">
                            {pathway.abbreviation}
                          </Badge>
                          <span className="text-sm font-semibold text-foreground">{pathway.name}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {pathway.description}
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-lg border border-border p-2">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                              Avg Timeline
                            </p>
                            <p className="text-xs text-foreground">{pathway.timeline}</p>
                          </div>
                          <div className="rounded-lg border border-border p-2">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                              Deadline
                            </p>
                            <p className="text-xs text-foreground">{pathway.deadline}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold text-foreground uppercase tracking-wider mb-1">
                            Generally Best When
                          </p>
                          {pathway.bestFor.map((item, i) => (
                            <div key={i} className="flex gap-2 text-xs text-muted-foreground">
                              <CheckCircle2 className="h-3 w-3 text-green-400 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold text-foreground uppercase tracking-wider mb-1">
                            Limitations
                          </p>
                          {pathway.limitations.map((item, i) => (
                            <div key={i} className="flex gap-2 text-xs text-muted-foreground">
                              <AlertTriangle className="h-3 w-3 text-gold/60 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs gap-1.5 text-blue-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(pathway.learnMoreUrl, '_blank', 'noopener,noreferrer');
                          }}
                        >
                          <ExternalLink className="h-3 w-3" />
                          Learn more on VA.gov
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}
          </div>

          {/* VSO referral — always shown */}
          <Card className="border-green-500/20 bg-green-500/5">
            <CardContent className="py-4 px-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Get Free Help</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    VA-accredited Veterans Service Organizations (VSOs) like the DAV, VFW, and American
                    Legion provide free assistance with decision reviews and appeals. They can review your
                    specific decision letter and advise on the best path forward.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1.5"
                    onClick={() =>
                      window.open(
                        'https://www.va.gov/get-help-from-accredited-representative/',
                        '_blank',
                        'noopener,noreferrer',
                      )
                    }
                  >
                    <ExternalLink className="h-3 w-3" />
                    Find a VSO Representative
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}
