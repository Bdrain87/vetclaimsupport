/**
 * ClaimIntelligence - Core intelligence engine for VCS veteran disability claims.
 *
 * ALL intelligence is LOCAL. No API calls. No cloud.
 * Pure rule-based lookups and pattern matching against local data.
 */

import { secondaryConditions, conditionProfiles } from '@/data/secondaryConditions';
import type { SecondaryConnection, ConditionSecondaryProfile } from '@/data/secondaryConditions';
import { vaConditions, getConditionById } from '@/data/vaConditions';
import type { VACondition } from '@/data/vaConditions';
import { dbqForms } from '@/data/vaRequiredForms';
import type { VAForm } from '@/data/vaRequiredForms';
import { militaryJobCodes } from '@/data/militaryMOS';
import type { MilitaryJobCode } from '@/data/militaryMOS';
import type { ClaimsData, ClaimCondition } from '@/types/claims';
import type { UserCondition } from '@/store/useAppStore';
import type { UserProfile, Branch } from '@/store/useProfileStore';

// ---------------------------------------------------------------------------
// Exported interfaces
// ---------------------------------------------------------------------------

export interface NextStep {
  id: string;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: string;
  actionRoute?: string;
}

export interface ConditionReadiness {
  conditionName: string;
  overallScore: number;
  components: {
    medicalEvidence: number;
    serviceConnection: number;
    currentSeverity: number;
    statements: number;
    examPrep: number;
  };
  tips: string[];
}

export interface Recommendation {
  conditionId: string;
  conditionName: string;
  reason: string;
  source: 'service' | 'condition' | 'symptom';
  strength: 'strong' | 'moderate' | 'possible';
  sourceCondition?: string;
}

export interface FormGuidance {
  formNumber: string;
  title: string;
  priority: 'urgent' | 'required' | 'recommended';
  reason: string;
  url?: string;
}

export interface LogInsight {
  message: string;
  suggestedConditions: string[];
  matchedKeywords: string[];
}

export interface FrequencyReport {
  conditionName: string;
  periodDays: number;
  totalEntries: number;
  symptomCounts: Record<string, number>;
  averageSeverity: number;
  trend: 'improving' | 'stable' | 'worsening' | 'insufficient-data';
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const BRANCH_MAP: Record<Branch, string> = {
  army: 'Army',
  marines: 'Marines',
  navy: 'Navy',
  air_force: 'Air Force',
  coast_guard: 'Coast Guard',
  space_force: 'Space Force',
};

/**
 * Returns the number of days between `dateStr` (ISO string) and now.
 * Positive means the date is in the past.
 */
function daysAgo(dateStr: string): number {
  const then = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

/**
 * Returns true if the ISO date string is within the last `days` days.
 */
function isWithinDays(dateStr: string, days: number): boolean {
  return daysAgo(dateStr) <= days;
}

/**
 * Case-insensitive keyword check against a block of text.
 */
function textMatchesAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

/**
 * Resolve a VACondition for a UserCondition, falling back to name search.
 */
function resolveVACondition(uc: UserCondition): VACondition | undefined {
  return getConditionById(uc.conditionId) ??
    vaConditions.find(
      (c) => c.name.toLowerCase() === uc.conditionId.toLowerCase() ||
             c.abbreviation.toLowerCase() === uc.conditionId.toLowerCase(),
    );
}

/**
 * Collect all free-text log content from the last N days for pattern matching.
 */
function recentLogTexts(claimsData: ClaimsData, days: number): string[] {
  const texts: string[] = [];

  for (const s of claimsData.symptoms) {
    if (isWithinDays(s.date, days)) {
      texts.push([s.symptom, s.bodyArea, s.dailyImpact, s.notes].join(' '));
    }
  }
  for (const q of claimsData.quickLogs) {
    if (isWithinDays(q.date, days)) {
      texts.push(q.flareUpNote);
    }
  }
  for (const m of claimsData.migraines) {
    if (isWithinDays(m.date, days)) {
      texts.push([m.treatment, m.notes].join(' '));
    }
  }
  for (const sl of claimsData.sleepEntries) {
    if (isWithinDays(sl.date, days)) {
      texts.push([sl.notes, sl.impactOnWork ?? ''].join(' '));
    }
  }
  for (const p of claimsData.ptsdSymptoms) {
    if (isWithinDays(p.date, days)) {
      texts.push([p.occupationalImpairment, p.socialImpairment, p.notes, p.triggeredBy ?? ''].join(' '));
    }
  }

  return texts.filter((t) => t.trim().length > 0);
}

// ---------------------------------------------------------------------------
// Hazard-to-condition mapping for service-based recommendations
// ---------------------------------------------------------------------------

interface HazardMapping {
  keywords: string[];
  conditions: { id: string; name: string }[];
}

const HAZARD_CONDITION_MAP: HazardMapping[] = [
  {
    keywords: ['noise', 'hearing', 'artillery', 'weapons fire', 'mortar', 'blast', 'rotor', 'jet', 'flight line', 'headphone'],
    conditions: [
      { id: 'tinnitus', name: 'Tinnitus' },
      { id: 'hearing-loss', name: 'Hearing Loss' },
    ],
  },
  {
    keywords: ['combat', 'hostile', 'ied', 'patrol', 'psychological stress', 'psychological trauma', 'combat stress', 'operational stress', 'extreme stress'],
    conditions: [
      { id: 'ptsd', name: 'PTSD' },
      { id: 'tbi', name: 'Traumatic Brain Injury' },
      { id: 'anxiety', name: 'Generalized Anxiety Disorder' },
    ],
  },
  {
    keywords: ['heavy lifting', 'heavy load', 'heavy equipment', 'heavy component', 'physical demands', 'physical strain'],
    conditions: [
      { id: 'lumbosacral-strain', name: 'Lumbosacral Strain' },
      { id: 'knee-condition', name: 'Knee Condition' },
    ],
  },
  {
    keywords: ['chemical', 'fuel', 'exhaust', 'fumes', 'hazmat', 'propellant', 'soldering', 'composites', 'diesel', 'petroleum', 'burn pit', 'particulate', 'dust'],
    conditions: [
      { id: 'asthma', name: 'Asthma' },
      { id: 'sinusitis', name: 'Chronic Sinusitis' },
      { id: 'skin-condition', name: 'Skin Condition' },
    ],
  },
  {
    keywords: ['stress', 'high stress', 'shift work', 'cultural stress'],
    conditions: [
      { id: 'ptsd', name: 'PTSD' },
      { id: 'anxiety', name: 'Generalized Anxiety Disorder' },
      { id: 'depression', name: 'Major Depressive Disorder' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Symptom keyword patterns for log insight detection
// ---------------------------------------------------------------------------

interface SymptomPattern {
  keywords: string[];
  conditions: string[];
  label: string;
}

const SYMPTOM_PATTERNS: SymptomPattern[] = [
  {
    keywords: ['sleep', 'insomnia', 'can\'t sleep', 'cannot sleep', 'waking up', 'restless', 'cpap', 'apnea', 'snoring', 'gasping'],
    conditions: ['sleep-apnea', 'insomnia'],
    label: 'sleep issues',
  },
  {
    keywords: ['ear', 'ringing', 'tinnitus', 'buzzing', 'hissing', 'hearing'],
    conditions: ['tinnitus', 'hearing-loss'],
    label: 'ear/hearing symptoms',
  },
  {
    keywords: ['back', 'spine', 'lumbar', 'lower back', 'disc', 'spinal', 'sciatica'],
    conditions: ['lumbosacral-strain', 'radiculopathy'],
    label: 'back/spine symptoms',
  },
  {
    keywords: ['nightmare', 'flashback', 'hypervigilance', 'startle', 'panic', 'intrusive thought', 'avoidance', 'triggered'],
    conditions: ['ptsd', 'anxiety'],
    label: 'PTSD/anxiety indicators',
  },
  {
    keywords: ['knee', 'patella', 'acl', 'mcl', 'meniscus', 'knee pain', 'knee swelling', 'knee buckling'],
    conditions: ['knee-condition', 'knee-strain'],
    label: 'knee symptoms',
  },
  {
    keywords: ['headache', 'migraine', 'aura', 'prostrating', 'light sensitivity', 'throbbing head'],
    conditions: ['migraines', 'tension-headaches'],
    label: 'headache/migraine indicators',
  },
  {
    keywords: ['shoulder', 'rotator cuff', 'shoulder pain', 'shoulder impingement', 'frozen shoulder', 'shoulder range'],
    conditions: ['shoulder-condition', 'rotator-cuff'],
    label: 'shoulder symptoms',
  },
];

// ---------------------------------------------------------------------------
// ClaimIntelligence implementation
// ---------------------------------------------------------------------------

export const ClaimIntelligence = {
  // -----------------------------------------------------------------------
  // 1. getNextSteps
  // -----------------------------------------------------------------------
  getNextSteps(
    profile: UserProfile | undefined,
    userConditions: UserCondition[],
    claimsData: ClaimsData,
  ): NextStep[] {
    const steps: NextStep[] = [];
    let stepId = 0;
    const nextId = () => `step-${++stepId}`;

    // --- No conditions added ---
    if (userConditions.length === 0) {
      steps.push({
        id: nextId(),
        title: 'Add your claimed conditions',
        description:
          'Start by adding the conditions you plan to claim. This drives all evidence recommendations and form guidance.',
        priority: 'urgent',
        category: 'conditions',
        actionRoute: '/conditions',
      });
    }

    // --- No symptoms logged in last 30 days ---
    const recentSymptoms = claimsData.symptoms.filter((s) => isWithinDays(s.date, 30));
    const recentQuickLogs = claimsData.quickLogs.filter((q) => isWithinDays(q.date, 30));
    const recentMigraines = claimsData.migraines.filter((m) => isWithinDays(m.date, 30));
    const recentSleep = claimsData.sleepEntries.filter((s) => isWithinDays(s.date, 30));
    const recentPtsd = claimsData.ptsdSymptoms.filter((p) => isWithinDays(p.date, 30));

    const hasRecentLogs =
      recentSymptoms.length > 0 ||
      recentQuickLogs.length > 0 ||
      recentMigraines.length > 0 ||
      recentSleep.length > 0 ||
      recentPtsd.length > 0;

    if (!hasRecentLogs && userConditions.length > 0) {
      steps.push({
        id: nextId(),
        title: 'Log your symptoms',
        description:
          'You have not logged any symptoms in the past 30 days. Regular logging strengthens your claim by documenting severity and frequency.',
        priority: 'high',
        category: 'logging',
        actionRoute: '/log',
      });
    }

    // --- Conditions with low evidence ---
    for (const uc of userConditions) {
      const vaCondition = resolveVACondition(uc);
      const condName = vaCondition?.abbreviation ?? uc.conditionId;

      // Find the matching ClaimCondition, if any
      const cc = claimsData.claimConditions.find(
        (c) =>
          c.name.toLowerCase() === (vaCondition?.name ?? uc.conditionId).toLowerCase() ||
          c.name.toLowerCase() === condName.toLowerCase(),
      );

      if (!cc) {
        steps.push({
          id: nextId(),
          title: `Link evidence for ${condName}`,
          description:
            `No claim builder entry found for "${condName}". Create one and link medical visits, exposures, and buddy statements.`,
          priority: 'high',
          category: 'evidence',
          actionRoute: '/claim-builder',
        });
        continue;
      }

      const evidenceCount =
        cc.linkedMedicalVisits.length +
        cc.linkedExposures.length +
        cc.linkedSymptoms.length +
        cc.linkedDocuments.length +
        cc.linkedBuddyContacts.length;

      if (evidenceCount < 3) {
        steps.push({
          id: nextId(),
          title: `Add more evidence for ${condName}`,
          description:
            `"${condName}" only has ${evidenceCount} linked evidence item${evidenceCount === 1 ? '' : 's'}. Aim for at least 3 (medical visits, symptoms, buddy statements).`,
          priority: evidenceCount === 0 ? 'urgent' : 'medium',
          category: 'evidence',
          actionRoute: '/claim-builder',
        });
      }
    }

    // --- No buddy contacts ---
    if (claimsData.buddyContacts.length === 0 && userConditions.length > 0) {
      steps.push({
        id: nextId(),
        title: 'Add buddy / witness contacts',
        description:
          'Buddy statements are one of the strongest forms of lay evidence. Add at least one person who can attest to your conditions.',
        priority: 'medium',
        category: 'statements',
        actionRoute: '/buddy-contacts',
      });
    }

    // --- Profile incomplete ---
    if (profile) {
      const missing: string[] = [];
      if (!profile.firstName) missing.push('first name');
      if (!profile.lastName) missing.push('last name');
      if (!profile.branch) missing.push('branch of service');
      if (!profile.mosCode) missing.push('MOS/AFSC/Rating code');
      if (!profile.hasCompletedOnboarding) missing.push('onboarding');

      if (missing.length > 0) {
        steps.push({
          id: nextId(),
          title: 'Complete your profile',
          description: `Missing profile info: ${missing.join(', ')}. A complete profile enables service-based condition recommendations.`,
          priority: missing.includes('onboarding') ? 'high' : 'low',
          category: 'profile',
          actionRoute: '/profile',
        });
      }
    }

    // Sort by priority
    const priorityOrder: Record<NextStep['priority'], number> = {
      urgent: 0,
      high: 1,
      medium: 2,
      low: 3,
    };
    steps.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return steps;
  },

  // -----------------------------------------------------------------------
  // 2. getOverallReadiness
  // -----------------------------------------------------------------------
  getOverallReadiness(
    userConditions: UserCondition[],
    claimsData: ClaimsData,
    profile?: UserProfile,
  ): number {
    // Weights: hasConditions(15), hasEvidence(25), hasLogs(20),
    //          hasStatements(15), profileComplete(10), formsIdentified(15)
    let score = 0;

    // --- hasConditions (15) ---
    if (userConditions.length > 0) {
      score += Math.min(15, userConditions.length * 5);
    }

    // --- hasEvidence (25) ---
    const totalEvidenceLinks = claimsData.claimConditions.reduce((sum, cc) => {
      return (
        sum +
        cc.linkedMedicalVisits.length +
        cc.linkedExposures.length +
        cc.linkedSymptoms.length +
        cc.linkedDocuments.length +
        cc.linkedBuddyContacts.length
      );
    }, 0);

    if (totalEvidenceLinks > 0) {
      // Scale: 1-4 links = partial, 5+ = good, 10+ per condition = excellent
      const target = Math.max(userConditions.length * 3, 1);
      score += Math.min(25, Math.round((totalEvidenceLinks / target) * 25));
    }

    // --- hasLogs (20) ---
    const recentLogCount =
      claimsData.symptoms.filter((s) => isWithinDays(s.date, 90)).length +
      claimsData.quickLogs.filter((q) => isWithinDays(q.date, 90)).length +
      claimsData.migraines.filter((m) => isWithinDays(m.date, 90)).length +
      claimsData.sleepEntries.filter((s) => isWithinDays(s.date, 90)).length +
      claimsData.ptsdSymptoms.filter((p) => isWithinDays(p.date, 90)).length;

    if (recentLogCount > 0) {
      score += Math.min(20, Math.round((recentLogCount / 20) * 20));
    }

    // --- hasStatements (15) ---
    const buddyCount = claimsData.buddyContacts.length;
    const receivedStatements = claimsData.buddyContacts.filter(
      (b) => b.statementStatus === 'Received' || b.statementStatus === 'Submitted',
    ).length;

    if (buddyCount > 0) {
      // Having contacts is worth some, having received/submitted statements is worth more
      const contactPts = Math.min(5, buddyCount * 2.5);
      const statementPts = Math.min(10, receivedStatements * 5);
      score += Math.min(15, Math.round(contactPts + statementPts));
    }

    // --- profileComplete (10) ---
    if (profile) {
      let profilePts = 0;
      if (profile.firstName) profilePts += 2;
      if (profile.lastName) profilePts += 2;
      if (profile.branch) profilePts += 2;
      if (profile.mosCode) profilePts += 2;
      if (profile.hasCompletedOnboarding) profilePts += 2;
      score += profilePts;
    }

    // --- formsIdentified (15) ---
    // Check if each user condition has at least one matching DBQ form key
    if (userConditions.length > 0) {
      let conditionsWithForms = 0;
      for (const uc of userConditions) {
        const vaCondition = resolveVACondition(uc);
        if (vaCondition) {
          const condId = vaCondition.id.toLowerCase().replace(/-/g, '_');
          const category = vaCondition.category.toLowerCase().replace(/-/g, '_');
          if (dbqForms[condId] || dbqForms[category]) {
            conditionsWithForms++;
          }
        }
      }
      const formRatio = conditionsWithForms / userConditions.length;
      score += Math.round(formRatio * 15);
    }

    return Math.min(100, Math.max(0, score));
  },

  // -----------------------------------------------------------------------
  // 3. getConditionReadiness
  // -----------------------------------------------------------------------
  getConditionReadiness(
    conditionName: string,
    claimsData: ClaimsData,
  ): ConditionReadiness {
    const lowerName = conditionName.toLowerCase();
    const tips: string[] = [];

    // Find the claim condition entry
    const cc = claimsData.claimConditions.find(
      (c) => c.name.toLowerCase() === lowerName,
    );

    // Try to resolve the VA condition for enriched tips
    const vaCondition = vaConditions.find(
      (c) =>
        c.name.toLowerCase() === lowerName ||
        c.abbreviation.toLowerCase() === lowerName ||
        c.id.toLowerCase() === lowerName.replace(/\s+/g, '-'),
    );

    // --- medicalEvidence (0-100) ---
    let medicalEvidence = 0;
    if (cc) {
      const visitCount = cc.linkedMedicalVisits.length;
      const docCount = cc.linkedDocuments.length;
      medicalEvidence = Math.min(100, (visitCount * 25) + (docCount * 15));
    }
    if (medicalEvidence < 50) {
      tips.push('Add more medical visit records and supporting documents for this condition.');
    }

    // --- serviceConnection (0-100) ---
    let serviceConnection = 0;
    if (cc) {
      const exposureCount = cc.linkedExposures.length;
      serviceConnection += Math.min(50, exposureCount * 25);
    }
    // Check service history for related hazards
    const serviceHazardMatch = claimsData.serviceHistory.some(
      (sh) => textMatchesAny(sh.hazards + ' ' + sh.duties, [lowerName]),
    );
    if (serviceHazardMatch) {
      serviceConnection += 30;
    }
    // Check deployments
    const deploymentMatch = claimsData.deployments.some(
      (d) => textMatchesAny(d.hazardsEncountered + ' ' + d.notes, [lowerName]),
    );
    if (deploymentMatch) {
      serviceConnection += 20;
    }
    serviceConnection = Math.min(100, serviceConnection);
    if (serviceConnection < 50) {
      tips.push('Strengthen the service connection: link exposures, service history entries, or deployment records.');
    }

    // --- currentSeverity (0-100) ---
    let currentSeverity = 0;
    const recentSymptomMatches = claimsData.symptoms.filter(
      (s) =>
        isWithinDays(s.date, 90) &&
        textMatchesAny(s.symptom + ' ' + s.bodyArea + ' ' + s.notes, [lowerName]),
    );
    if (recentSymptomMatches.length > 0) {
      const avgSeverity =
        recentSymptomMatches.reduce((sum, s) => sum + s.severity, 0) /
        recentSymptomMatches.length;
      currentSeverity = Math.min(100, Math.round((avgSeverity / 10) * 60 + recentSymptomMatches.length * 5));
    }
    // Also check quick logs
    const recentFlareUps = claimsData.quickLogs.filter(
      (q) => isWithinDays(q.date, 90) && q.hadFlareUp && textMatchesAny(q.flareUpNote, [lowerName]),
    );
    currentSeverity = Math.min(100, currentSeverity + recentFlareUps.length * 10);
    if (currentSeverity < 30) {
      tips.push('Log symptoms regularly to document the current severity and frequency of this condition.');
    }

    // --- statements (0-100) ---
    let statements = 0;
    if (cc) {
      const buddyCount = cc.linkedBuddyContacts.length;
      statements = Math.min(100, buddyCount * 35);
    }
    // Personal statement in notes
    if (cc && cc.notes && cc.notes.trim().length > 50) {
      statements = Math.min(100, statements + 30);
    }
    if (statements < 50) {
      tips.push('Add buddy/witness statements and detailed personal notes to support this claim.');
    }

    // --- examPrep (0-100) ---
    let examPrep = 0;
    // Check if condition-specific forms are identified
    if (vaCondition) {
      const condId = vaCondition.id.toLowerCase().replace(/-/g, '_');
      const category = vaCondition.category.toLowerCase().replace(/-/g, '_');
      if (dbqForms[condId] || dbqForms[category]) {
        examPrep += 40;
      }
      if (vaCondition.nexusTip) {
        examPrep += 20;
      }
    }
    // Check if there are enough recent logs for this condition
    if (recentSymptomMatches.length >= 5) {
      examPrep += 20;
    }
    // Check if profile for condition exists in conditionProfiles
    const condProfile = conditionProfiles.find(
      (cp) => cp.id === vaCondition?.id,
    );
    if (condProfile) {
      examPrep += 20;
    }
    examPrep = Math.min(100, examPrep);
    if (examPrep < 50) {
      tips.push('Review the DBQ forms and C&P exam tips for this condition before your exam.');
    }

    const overallScore = Math.round(
      medicalEvidence * 0.25 +
      serviceConnection * 0.25 +
      currentSeverity * 0.2 +
      statements * 0.15 +
      examPrep * 0.15,
    );

    return {
      conditionName,
      overallScore: Math.min(100, Math.max(0, overallScore)),
      components: {
        medicalEvidence,
        serviceConnection,
        currentSeverity,
        statements,
        examPrep,
      },
      tips,
    };
  },

  // -----------------------------------------------------------------------
  // 4. getRecommendations
  // -----------------------------------------------------------------------
  getRecommendations(
    profile: UserProfile | undefined,
    userConditions: UserCondition[],
    claimsData: ClaimsData,
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const seenConditionIds = new Set<string>();

    // Track conditions the user already has so we don't recommend them
    const existingConditionIds = new Set(
      userConditions.map((uc) => uc.conditionId.toLowerCase()),
    );

    const addRec = (rec: Recommendation) => {
      const key = `${rec.source}-${rec.conditionId}-${rec.sourceCondition ?? ''}`;
      if (!seenConditionIds.has(key) && !existingConditionIds.has(rec.conditionId.toLowerCase())) {
        seenConditionIds.add(key);
        recommendations.push(rec);
      }
    };

    // === Layer 1: Service-based recommendations (MOS/AFSC -> conditions) ===
    if (profile && profile.branch && profile.mosCode) {
      const branchLabel = BRANCH_MAP[profile.branch as Branch];
      const jobCode = militaryJobCodes.find(
        (j) =>
          j.code.toLowerCase() === profile.mosCode.toLowerCase() &&
          j.branch === branchLabel,
      );

      if (jobCode && jobCode.commonHazards) {
        for (const hazard of jobCode.commonHazards) {
          const hazardLower = hazard.toLowerCase();

          for (const mapping of HAZARD_CONDITION_MAP) {
            const matches = mapping.keywords.some((kw) => hazardLower.includes(kw));
            if (matches) {
              for (const cond of mapping.conditions) {
                addRec({
                  conditionId: cond.id,
                  conditionName: cond.name,
                  reason: `Your MOS/AFSC (${jobCode.code} - ${jobCode.title}) involved "${hazard}" which is associated with this condition.`,
                  source: 'service',
                  strength: hazardLower.includes('combat') || hazardLower.includes('blast') ? 'strong' : 'moderate',
                });
              }
            }
          }
        }
      }
    }

    // === Layer 2: Condition-based recommendations (primary -> secondaries) ===
    for (const uc of userConditions) {
      const vaCondition = resolveVACondition(uc);
      if (!vaCondition) continue;

      // Check conditionProfiles for structured secondary data
      const profile2 = conditionProfiles.find((cp) => cp.id === vaCondition.id);
      if (profile2) {
        for (const secId of profile2.possibleSecondaries) {
          const secCondition = getConditionById(secId);
          addRec({
            conditionId: secId,
            conditionName: secCondition?.name ?? secId,
            reason: profile2.nexusTip || `Commonly secondary to ${vaCondition.abbreviation}.`,
            source: 'condition',
            strength: 'strong',
            sourceCondition: vaCondition.abbreviation,
          });
        }
      }

      // Check the commonSecondaries array on the VACondition itself
      if (vaCondition.commonSecondaries) {
        for (const secId of vaCondition.commonSecondaries) {
          const secCondition = getConditionById(secId);
          addRec({
            conditionId: secId,
            conditionName: secCondition?.name ?? secId,
            reason: `Listed as a common secondary to ${vaCondition.abbreviation} in the VA conditions database.`,
            source: 'condition',
            strength: 'moderate',
            sourceCondition: vaCondition.abbreviation,
          });
        }
      }

      // Check the full secondaryConditions table
      const scMatches = secondaryConditions.filter(
        (sc) =>
          sc.primaryCondition.toLowerCase() === vaCondition.name.toLowerCase() ||
          sc.primaryCondition.toLowerCase() === vaCondition.abbreviation.toLowerCase(),
      );
      for (const sc of scMatches) {
        // Try to find the id of the secondary condition
        const secVA = vaConditions.find(
          (c) =>
            c.name.toLowerCase() === sc.secondaryCondition.toLowerCase() ||
            c.abbreviation.toLowerCase() === sc.secondaryCondition.toLowerCase(),
        );
        const secId = secVA?.id ?? sc.secondaryCondition.toLowerCase().replace(/\s+/g, '-');
        addRec({
          conditionId: secId,
          conditionName: sc.secondaryCondition,
          reason: sc.medicalConnection,
          source: 'condition',
          strength: 'moderate',
          sourceCondition: vaCondition.abbreviation,
        });
      }
    }

    // === Layer 3: Symptom-based recommendations (health logs -> conditions) ===
    const logTexts = recentLogTexts(claimsData, 90);
    const combinedText = logTexts.join(' ').toLowerCase();

    if (combinedText.length > 0) {
      for (const pattern of SYMPTOM_PATTERNS) {
        const matchedKeywords = pattern.keywords.filter((kw) => combinedText.includes(kw.toLowerCase()));
        if (matchedKeywords.length > 0) {
          for (const condId of pattern.conditions) {
            const vaCondition = getConditionById(condId);
            addRec({
              conditionId: condId,
              conditionName: vaCondition?.name ?? condId,
              reason: `Your recent logs mention ${matchedKeywords.slice(0, 3).join(', ')} which may indicate this condition.`,
              source: 'symptom',
              strength: matchedKeywords.length >= 3 ? 'strong' : matchedKeywords.length >= 2 ? 'moderate' : 'possible',
            });
          }
        }
      }
    }

    return recommendations;
  },

  // -----------------------------------------------------------------------
  // 5. getRequiredForms
  // -----------------------------------------------------------------------
  getRequiredForms(
    userConditions: UserCondition[],
    claimType?: string,
  ): FormGuidance[] {
    const forms: FormGuidance[] = [];
    const seenFormNumbers = new Set<string>();

    const addForm = (fg: FormGuidance) => {
      if (!seenFormNumbers.has(fg.formNumber)) {
        seenFormNumbers.add(fg.formNumber);
        forms.push(fg);
      }
    };

    // Always include Intent to File
    addForm({
      formNumber: '21-0966',
      title: 'Intent to File a Claim for Compensation',
      priority: 'urgent',
      reason:
        'Locks in your effective date. File this first to protect your benefits start date — gives you 1 year to submit your full claim.',
      url: 'https://www.va.gov/find-forms/about-form-21-0966/',
    });

    // Always include 21-526EZ
    addForm({
      formNumber: '21-526EZ',
      title: 'Application for Disability Compensation and Related Compensation Benefits',
      priority: 'required',
      reason: 'The main claim application required for all VA disability claims.',
      url: 'https://www.va.gov/find-forms/about-form-21-526ez/',
    });

    // Condition-specific forms from dbqForms
    for (const uc of userConditions) {
      const vaCondition = resolveVACondition(uc);
      if (!vaCondition) continue;

      const condName = vaCondition.name.toLowerCase();
      const condId = vaCondition.id.toLowerCase();
      const condCategory = vaCondition.category.toLowerCase();
      const bodySystem = (vaCondition.bodySystem ?? '').toLowerCase();

      // Build candidate keys to look up in dbqForms
      const candidateKeys: string[] = [
        condId,
        condId.replace(/-/g, '_'),
        condCategory,
        condCategory.replace(/-/g, '_'),
        bodySystem,
        bodySystem.replace(/\s+/g, '_'),
      ];

      // Also do keyword-based matching against known dbqForms keys
      const dbqKeys = Object.keys(dbqForms);
      for (const dbqKey of dbqKeys) {
        if (condName.includes(dbqKey) || condId.includes(dbqKey)) {
          candidateKeys.push(dbqKey);
        }
      }

      const addedForCondition = new Set<string>();
      for (const key of candidateKeys) {
        const matchedForms = dbqForms[key];
        if (matchedForms) {
          for (const form of matchedForms) {
            if (!addedForCondition.has(form.formNumber)) {
              addedForCondition.add(form.formNumber);
              addForm({
                formNumber: form.formNumber,
                title: form.name,
                priority: 'recommended',
                reason: `${form.description} — relevant to your claimed condition: ${vaCondition.abbreviation}.`,
                url: form.url,
              });
            }
          }
        }
      }
    }

    // Sort: urgent first, then required, then recommended
    const priorityOrder: Record<FormGuidance['priority'], number> = {
      urgent: 0,
      required: 1,
      recommended: 2,
    };
    forms.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return forms;
  },

  // -----------------------------------------------------------------------
  // 6. getLogInsights
  // -----------------------------------------------------------------------
  getLogInsights(claimsData: ClaimsData): LogInsight[] {
    const insights: LogInsight[] = [];
    const logTexts = recentLogTexts(claimsData, 90);
    const combinedText = logTexts.join(' ').toLowerCase();

    if (combinedText.length === 0) {
      return [];
    }

    for (const pattern of SYMPTOM_PATTERNS) {
      const matchedKeywords = pattern.keywords.filter((kw) =>
        combinedText.includes(kw.toLowerCase()),
      );

      if (matchedKeywords.length > 0) {
        const conditionNames = pattern.conditions.map((condId) => {
          const vc = getConditionById(condId);
          return vc?.abbreviation ?? condId;
        });

        insights.push({
          message: `Your recent logs show ${pattern.label} (matched: ${matchedKeywords.join(', ')}). Consider tracking or claiming: ${conditionNames.join(', ')}.`,
          suggestedConditions: pattern.conditions,
          matchedKeywords,
        });
      }
    }

    return insights;
  },

  // -----------------------------------------------------------------------
  // 7. getSymptomFrequency
  // -----------------------------------------------------------------------
  getSymptomFrequency(
    conditionName: string,
    claimsData: ClaimsData,
    days: number = 90,
  ): FrequencyReport {
    const lowerName = conditionName.toLowerCase();

    // Also resolve the VA condition for keyword matching
    const vaCondition = vaConditions.find(
      (c) =>
        c.name.toLowerCase() === lowerName ||
        c.abbreviation.toLowerCase() === lowerName ||
        c.id.toLowerCase() === lowerName.replace(/\s+/g, '-'),
    );
    const matchTerms = [lowerName];
    if (vaCondition) {
      matchTerms.push(vaCondition.id.toLowerCase());
      matchTerms.push(vaCondition.abbreviation.toLowerCase());
      matchTerms.push(...vaCondition.keywords.map((k) => k.toLowerCase()));
    }

    const symptomCounts: Record<string, number> = {};
    let totalEntries = 0;
    let severitySum = 0;
    let severityCount = 0;

    // Scan symptoms
    for (const s of claimsData.symptoms) {
      if (!isWithinDays(s.date, days)) continue;
      const text = [s.symptom, s.bodyArea, s.notes].join(' ').toLowerCase();
      if (matchTerms.some((t) => text.includes(t))) {
        totalEntries++;
        symptomCounts[s.symptom] = (symptomCounts[s.symptom] || 0) + 1;
        severitySum += s.severity;
        severityCount++;
      }
    }

    // Scan quick logs
    for (const q of claimsData.quickLogs) {
      if (!isWithinDays(q.date, days)) continue;
      const text = q.flareUpNote.toLowerCase();
      if (matchTerms.some((t) => text.includes(t))) {
        totalEntries++;
        const label = q.hadFlareUp ? 'flare-up' : 'general-log';
        symptomCounts[label] = (symptomCounts[label] || 0) + 1;
        if (q.painLevel !== undefined) {
          severitySum += q.painLevel;
          severityCount++;
        }
      }
    }

    // Scan migraines (if condition relates)
    const migraineTerms = ['migraine', 'headache', 'migraines'];
    if (matchTerms.some((t) => migraineTerms.includes(t))) {
      for (const m of claimsData.migraines) {
        if (!isWithinDays(m.date, days)) continue;
        totalEntries++;
        symptomCounts[m.severity] = (symptomCounts[m.severity] || 0) + 1;
        const severityValue =
          m.severity === 'Prostrating' ? 10 : m.severity === 'Severe' ? 8 : m.severity === 'Moderate' ? 5 : 3;
        severitySum += severityValue;
        severityCount++;
      }
    }

    // Scan sleep entries (if condition relates)
    const sleepTerms = ['sleep', 'apnea', 'insomnia', 'sleep-apnea', 'cpap'];
    if (matchTerms.some((t) => sleepTerms.includes(t))) {
      for (const sl of claimsData.sleepEntries) {
        if (!isWithinDays(sl.date, days)) continue;
        totalEntries++;
        symptomCounts[sl.quality] = (symptomCounts[sl.quality] || 0) + 1;
        const qualityVal =
          sl.quality === 'Very Poor' ? 9 : sl.quality === 'Poor' ? 7 : sl.quality === 'Fair' ? 5 : sl.quality === 'Good' ? 3 : 1;
        severitySum += qualityVal;
        severityCount++;
      }
    }

    // Scan PTSD symptoms (if condition relates)
    const ptsdTerms = ['ptsd', 'post-traumatic', 'anxiety', 'mental health'];
    if (matchTerms.some((t) => ptsdTerms.includes(t))) {
      for (const p of claimsData.ptsdSymptoms) {
        if (!isWithinDays(p.date, days)) continue;
        totalEntries++;
        symptomCounts['ptsd-entry'] = (symptomCounts['ptsd-entry'] || 0) + 1;
        severitySum += p.overallSeverity;
        severityCount++;
      }
    }

    // Determine trend
    let trend: FrequencyReport['trend'] = 'insufficient-data';
    if (totalEntries >= 4) {
      // Simple trend: compare first half vs second half severity
      const halfDays = Math.floor(days / 2);
      let firstHalfSev = 0;
      let firstHalfCount = 0;
      let secondHalfSev = 0;
      let secondHalfCount = 0;

      for (const s of claimsData.symptoms) {
        if (!isWithinDays(s.date, days)) continue;
        const text = [s.symptom, s.bodyArea, s.notes].join(' ').toLowerCase();
        if (!matchTerms.some((t) => text.includes(t))) continue;

        if (daysAgo(s.date) > halfDays) {
          firstHalfSev += s.severity;
          firstHalfCount++;
        } else {
          secondHalfSev += s.severity;
          secondHalfCount++;
        }
      }

      if (firstHalfCount > 0 && secondHalfCount > 0) {
        const firstAvg = firstHalfSev / firstHalfCount;
        const secondAvg = secondHalfSev / secondHalfCount;
        const delta = secondAvg - firstAvg;

        if (delta > 1) {
          trend = 'worsening';
        } else if (delta < -1) {
          trend = 'improving';
        } else {
          trend = 'stable';
        }
      }
    }

    return {
      conditionName,
      periodDays: days,
      totalEntries,
      symptomCounts,
      averageSeverity: severityCount > 0 ? Math.round((severitySum / severityCount) * 10) / 10 : 0,
      trend,
    };
  },
};
