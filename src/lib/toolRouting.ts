/**
 * Tool Routing Registry — Central registry of all VCS tools with route building.
 *
 * Used by: ClaimIntelligence "What Next" cards, Decision Decoder action links,
 * C-File Intel finding links, Intel chat tool routing.
 */

export interface ToolDefinition {
  id: string;
  label: string;
  route: string;
  description: string;
  /** Query params the tool accepts for pre-fill (e.g., ['condition', 'bodyArea']) */
  acceptsParams: string[];
}

export const TOOL_REGISTRY: ToolDefinition[] = [
  // ── Claims ─────────────────────────────────────────────
  { id: 'conditions', label: 'My Conditions', route: '/claims', description: 'View and manage claimed conditions', acceptsParams: [] },
  { id: 'condition-detail', label: 'Condition Detail', route: '/claims', description: 'View condition details and evidence', acceptsParams: ['id'] },
  { id: 'secondary-finder', label: 'Secondary Finder', route: '/claims/secondary-finder', description: 'Find secondary conditions linked to primary', acceptsParams: ['condition'] },
  { id: 'evidence-strength', label: 'Evidence Strength', route: '/claims/evidence-strength', description: 'Check evidence strength per condition', acceptsParams: ['condition'] },
  { id: 'decision-decoder', label: 'Decision Decoder', route: '/claims/decision-decoder', description: 'Decode VA decision letters', acceptsParams: [] },
  { id: 'strategy', label: 'Claim Strategy', route: '/claims/strategy', description: 'Build your filing strategy', acceptsParams: [] },
  { id: 'body-map', label: 'Body Map', route: '/claims/body-map', description: 'Visual body map of conditions', acceptsParams: [] },
  { id: 'calculator', label: 'Rating Calculator', route: '/claims/calculator', description: 'Calculate combined VA rating', acceptsParams: [] },
  { id: 'bilateral', label: 'Bilateral Calculator', route: '/claims/bilateral', description: 'Calculate bilateral factor', acceptsParams: [] },
  { id: 'vault', label: 'Document Vault', route: '/claims/vault', description: 'Secure document storage', acceptsParams: [] },
  { id: 'checklist', label: 'Claim Checklist', route: '/claims/checklist', description: 'Evidence checklist per condition', acceptsParams: [] },

  // ── Health ─────────────────────────────────────────────
  { id: 'symptoms', label: 'Symptom Tracker', route: '/health/symptoms', description: 'Log daily symptoms', acceptsParams: ['condition', 'bodyArea'] },
  { id: 'sleep', label: 'Sleep Tracker', route: '/health/sleep', description: 'Track sleep quality', acceptsParams: [] },
  { id: 'migraines', label: 'Migraine Tracker', route: '/health/migraines', description: 'Track migraine episodes', acceptsParams: [] },
  { id: 'medications', label: 'Medication Tracker', route: '/health/medications', description: 'Track medications and side effects', acceptsParams: [] },
  { id: 'medical-visits', label: 'Medical Visits', route: '/health/visits', description: 'Log medical appointments', acceptsParams: [] },
  { id: 'exposures', label: 'Exposure Tracker', route: '/health/exposures', description: 'Document military exposures', acceptsParams: [] },
  { id: 'work-impact', label: 'Work Impact', route: '/health/work-impact', description: 'Track employment impact', acceptsParams: [] },
  { id: 'trends', label: 'Health Trends', route: '/health/trends', description: 'View health trend charts', acceptsParams: [] },

  // ── Prep ───────────────────────────────────────────────
  { id: 'personal-statement', label: 'Personal Statement', route: '/prep/personal-statement', description: 'Draft your personal statement', acceptsParams: ['condition'] },
  { id: 'buddy-statement', label: 'Buddy Statement', route: '/prep/buddy-statement', description: 'Request and manage buddy statements', acceptsParams: ['condition'] },
  { id: 'doctor-summary', label: 'Doctor Summary Outline', route: '/prep/doctor-summary', description: 'Organize evidence for your doctor', acceptsParams: ['condition'] },
  { id: 'stressor', label: 'Stressor Statement', route: '/prep/stressor', description: 'Document PTSD stressors', acceptsParams: [] },
  { id: 'family-statement', label: 'Family Statement', route: '/prep/family-statement', description: 'Family lay statement builder', acceptsParams: [] },
  { id: 'exam-prep', label: 'C&P Exam Prep', route: '/prep/exam', description: 'Prepare for C&P exam', acceptsParams: ['condition'] },
  { id: 'exam-simulator', label: 'C&P Exam Simulator', route: '/prep/exam-simulator', description: 'Practice exam questions', acceptsParams: [] },
  { id: 'post-debrief', label: 'Post-Exam Debrief', route: '/prep/post-debrief', description: 'Debrief after C&P exam', acceptsParams: [] },
  { id: 'evidence-scanner', label: 'Evidence Scanner', route: '/prep/evidence-scanner', description: 'AI evidence document analysis', acceptsParams: [] },
  { id: 'cfile-intel', label: 'C-File Intel', route: '/prep/cfile-intel', description: 'AI-powered C-File analysis', acceptsParams: [] },
  { id: 'interactive-dbq', label: 'DBQ Analyzer', route: '/prep/interactive-dbq', description: 'AI-powered DBQ self-assessment', acceptsParams: [] },
  { id: 'dbq-prep', label: 'DBQ Prep Sheet', route: '/prep/dbq', description: 'DBQ preparation worksheet', acceptsParams: [] },
  { id: 'packet', label: 'Build Packet', route: '/prep/packet', description: 'Build your claim packet', acceptsParams: [] },
  { id: 'appeals', label: 'Appeals Guide', route: '/prep/appeals', description: 'Appeal options and guidance', acceptsParams: ['type'] },
  { id: 'back-pay', label: 'Back Pay Estimator', route: '/prep/back-pay', description: 'Estimate retroactive pay', acceptsParams: [] },
  { id: 'tdiu', label: 'TDIU Checker', route: '/prep/tdiu', description: 'Check TDIU eligibility', acceptsParams: [] },
  { id: 'form-guide', label: 'VA Form Guide', route: '/prep/form-guide', description: 'Find the right VA forms', acceptsParams: [] },
  { id: 'nexus-guide', label: 'Doctor Summary Guide', route: '/prep/nexus-guide', description: 'Guide to doctor summary outlines', acceptsParams: [] },
  { id: 'medication-rule', label: 'Medication Rule Tool', route: '/prep/medication-rule', description: 'VA 2026 medication rule compliance', acceptsParams: [] },
  { id: 'medication-compliance', label: 'Medication Compliance', route: '/prep/medication-compliance', description: 'Per-medication VA 2026 rule compliance dashboard', acceptsParams: [] },
  { id: 'va-speak', label: 'VA-Speak Translator', route: '/prep/va-speak', description: 'Translate symptoms to VA language', acceptsParams: [] },
  { id: 'state-benefits', label: 'State Benefits', route: '/prep/state-benefits', description: 'State veteran benefits lookup', acceptsParams: [] },
  { id: 'ask-intel', label: 'Ask Intel', route: '/prep/ask-intel', description: 'AI-powered claims preparation advisor', acceptsParams: ['condition'] },

  // ── Analysis ─────────────────────────────────────────────
  { id: 'rating-gaps', label: 'Rating Gap Analyzer', route: '/claims/rating-gaps', description: 'Find rating upgrade opportunities', acceptsParams: [] },
  { id: 'readiness', label: 'Readiness Timeline', route: '/claims/readiness', description: 'Track claim preparation progress', acceptsParams: [] },
  { id: 'post-filing', label: 'Post-Filing Tracker', route: '/claims/post-filing', description: 'Track submitted claims through VA processing', acceptsParams: [] },

  // ── Reference ───────────────────────────────────────────
  { id: 'glossary', label: 'Glossary', route: '/settings/glossary', description: 'VA claims terms and definitions', acceptsParams: [] },
  { id: 'va-resources', label: 'VA Resources', route: '/settings/resources', description: 'Official VA links and guides', acceptsParams: [] },
  { id: 'vso-locator', label: 'Find a VSO', route: '/prep/vso-locator', description: 'Find accredited VSO representatives', acceptsParams: [] },
  { id: 'deployment-locations', label: 'Deployment Locations', route: '/reference/deployment-locations', description: 'Military deployment location lookup', acceptsParams: [] },
  { id: 'mos-hazards', label: 'MOS Hazards', route: '/prep/mos-hazards', description: 'MOS-to-condition hazard mapping', acceptsParams: [] },
  { id: 'pact-act', label: 'PACT Act', route: '/prep/pact-act', description: 'PACT Act presumptive conditions', acceptsParams: [] },
  { id: 'bdd-guide', label: 'BDD Guide', route: '/prep/bdd-guide', description: 'Benefits Delivery at Discharge guide', acceptsParams: [] },
  { id: 'dbq-analyzer', label: 'DBQ Document Upload', route: '/prep/dbq-analyzer', description: 'Upload and analyze DBQ documents', acceptsParams: [] },
];

const toolMap = new Map(TOOL_REGISTRY.map((t) => [t.id, t]));

/**
 * Build a navigation URL for a tool, optionally with query params.
 *
 * @example
 * buildToolLink('symptoms', { condition: 'PTSD', bodyArea: 'knee' })
 * // → '/health/symptoms?condition=PTSD&bodyArea=knee'
 */
export function buildToolLink(
  toolId: string,
  params?: Record<string, string>,
): string {
  const tool = toolMap.get(toolId);
  if (!tool) return '/prep';

  // Special case: condition-detail uses path param
  if (toolId === 'condition-detail' && params?.id) {
    const { id, ...rest } = params;
    const base = `${tool.route}/${id}`;
    const qs = buildQueryString(rest);
    return qs ? `${base}?${qs}` : base;
  }

  const qs = buildQueryString(params);
  return qs ? `${tool.route}?${qs}` : tool.route;
}

function buildQueryString(params?: Record<string, string>): string {
  if (!params) return '';
  const entries = Object.entries(params).filter(([, v]) => v);
  if (entries.length === 0) return '';
  return new URLSearchParams(entries).toString();
}

/**
 * Get a tool definition by id.
 */
export function getToolById(toolId: string): ToolDefinition | undefined {
  return toolMap.get(toolId);
}
