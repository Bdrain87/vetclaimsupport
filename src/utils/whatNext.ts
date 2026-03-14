/**
 * "What Next" Engine — Personalized next-step recommendations after
 * completing an action. Every feature should answer "What should I do now?"
 *
 * Returns prioritized next actions based on what was just completed, the
 * current condition context, and the veteran's data state.
 */

import { buildToolLink } from '@/lib/toolRouting';
import useAppStore from '@/store/useAppStore';

export interface NextAction {
  label: string;
  description: string;
  route: string;
  priority: 'high' | 'medium' | 'low';
}

type CompletedAction =
  | 'log-symptom'
  | 'log-medication'
  | 'log-sleep'
  | 'log-migraine'
  | 'log-medical-visit'
  | 'log-work-impact'
  | 'log-exposure'
  | 'export-doctor-summary'
  | 'export-personal-statement'
  | 'export-buddy-statement'
  | 'export-stressor-statement'
  | 'export-claim-strategy'
  | 'complete-dbq-prep'
  | 'complete-exam-prep'
  | 'complete-exam-simulator'
  | 'complete-post-debrief'
  | 'generate-buddy-statement'
  | 'generate-stressor-statement'
  | 'complete-exam-debrief'
  | 'analyze-decision-letter'
  | 'add-secondary-condition'
  | 'add-condition'
  | 'scan-evidence'
  | 'complete-onboarding'
  | 'quick-log-low'
  | 'quick-log-normal'
  | 'browse-vso-locator'
  | 'browse-va-resources'
  | 'browse-glossary'
  | 'browse-form-guide'
  | 'browse-state-benefits';

/**
 * Get recommended next actions based on what was just completed.
 *
 * @param completedAction - The action that was just completed
 * @param conditionId - Optional condition context
 * @returns Array of 1-3 prioritized next actions
 */
export function getNextAction(
  completedAction: CompletedAction,
  conditionId?: string,
): NextAction[] {
  const store = useAppStore.getState();
  const symptoms = store.symptoms || [];
  const conditions = store.userConditions || [];
  const buddyContacts = store.buddyContacts || [];

  const actions: NextAction[] = [];

  switch (completedAction) {
    case 'log-symptom': {
      const conditionSymptoms = conditionId
        ? symptoms.filter((s) => s.conditionId === conditionId)
        : symptoms;
      if (conditionSymptoms.length >= 30) {
        actions.push({
          label: 'Start your personal statement',
          description: 'You have 30+ symptom entries — strong evidence for a personal statement.',
          route: buildToolLink('personal-statement', conditionId ? { condition: conditionId } : undefined),
          priority: 'high',
        });
      }
      actions.push({
        label: 'Log medication if you took any today',
        description: 'Pairing symptoms with medications strengthens your evidence.',
        route: buildToolLink('medications'),
        priority: 'medium',
      });
      break;
    }

    case 'log-medication':
      actions.push({
        label: 'Check medication compliance',
        description: 'The VA 2026 rule requires documented on/off medication impact.',
        route: buildToolLink('medication-rule'),
        priority: 'medium',
      });
      break;

    case 'log-sleep':
      actions.push({
        label: 'View your sleep trends',
        description: 'See your sleep quality pattern over time.',
        route: buildToolLink('trends'),
        priority: 'medium',
      });
      break;

    case 'log-migraine':
      actions.push({
        label: 'Check your evidence strength',
        description: 'See how your migraine count compares to VA rating thresholds.',
        route: buildToolLink('evidence-strength', { condition: 'migraines' }),
        priority: 'high',
      });
      break;

    case 'log-medical-visit':
      actions.push({
        label: 'Update your doctor summary outline',
        description: 'Include this visit in your physician preparation materials.',
        route: buildToolLink('doctor-summary', conditionId ? { condition: conditionId } : undefined),
        priority: 'medium',
      });
      break;

    case 'log-work-impact':
      actions.push({
        label: 'Check TDIU eligibility',
        description: 'Your work impact logs may support a TDIU claim.',
        route: buildToolLink('tdiu'),
        priority: 'medium',
      });
      break;

    case 'export-doctor-summary':
      actions.push(
        {
          label: 'Share with your physician',
          description: 'Print or email the outline to your doctor for review before your appointment.',
          route: buildToolLink('vault'),
          priority: 'high',
        },
        {
          label: 'Schedule C&P exam prep',
          description: 'Prepare your talking points for the compensation exam.',
          route: buildToolLink('exam-prep', conditionId ? { condition: conditionId } : undefined),
          priority: 'medium',
        },
      );
      break;

    case 'export-personal-statement':
      if (buddyContacts.length === 0) {
        actions.push({
          label: 'Request buddy statements',
          description: 'Buddy statements corroborate your personal statement.',
          route: buildToolLink('buddy-statement', conditionId ? { condition: conditionId } : undefined),
          priority: 'high',
        });
      }
      actions.push({
        label: 'Build your claim packet',
        description: 'Combine all your evidence into a single shareable packet.',
        route: buildToolLink('packet'),
        priority: 'medium',
      });
      break;

    case 'export-buddy-statement':
    case 'export-stressor-statement':
      actions.push({
        label: 'Build your claim packet',
        description: 'Add this statement to your complete claim packet.',
        route: buildToolLink('packet'),
        priority: 'medium',
      });
      break;

    case 'generate-buddy-statement':
      actions.push(
        {
          label: 'Download or share the statement',
          description: 'Export the buddy statement as a PDF for your claim packet.',
          route: buildToolLink('buddy-statement'),
          priority: 'high',
        },
        {
          label: 'Build your claim packet',
          description: 'Combine all your evidence into a single shareable packet.',
          route: buildToolLink('packet'),
          priority: 'medium',
        },
      );
      break;

    case 'generate-stressor-statement':
      actions.push(
        {
          label: 'Build your claim packet',
          description: 'Add your stressor statement to your complete claim packet.',
          route: buildToolLink('packet'),
          priority: 'high',
        },
        {
          label: 'Request buddy statements',
          description: 'Corroborating witness statements strengthen your stressor claim.',
          route: buildToolLink('buddy-statement'),
          priority: 'medium',
        },
      );
      break;

    case 'complete-exam-debrief':
      actions.push({
        label: 'Review your claim strategy',
        description: 'Update your filing plan based on how the exam went.',
        route: buildToolLink('strategy'),
        priority: 'medium',
      });
      break;

    case 'export-claim-strategy':
      actions.push({
        label: 'Start with your highest-readiness condition',
        description: 'Focus on the condition with the strongest evidence first.',
        route: buildToolLink('conditions'),
        priority: 'high',
      });
      break;

    case 'complete-dbq-prep':
      actions.push({
        label: 'Review your C&P exam talking points',
        description: 'Make sure you can describe your worst-day symptoms to the examiner.',
        route: buildToolLink('exam-prep', conditionId ? { condition: conditionId } : undefined),
        priority: 'high',
      });
      break;

    case 'complete-exam-prep':
      actions.push({
        label: 'Practice with the C&P simulator',
        description: 'Run through mock questions to build confidence.',
        route: buildToolLink('exam-simulator'),
        priority: 'medium',
      });
      break;

    case 'complete-exam-simulator':
      actions.push({
        label: 'Review your exam day checklist',
        description: 'Make sure you have everything ready for your appointment.',
        route: '/prep/exam-day',
        priority: 'high',
      });
      break;

    case 'complete-post-debrief':
      actions.push({
        label: 'Review your claim strategy',
        description: 'Update your filing plan based on exam results.',
        route: buildToolLink('strategy'),
        priority: 'medium',
      });
      break;

    case 'analyze-decision-letter':
      actions.push(
        {
          label: 'Build evidence for denied conditions',
          description: 'Start documenting what the VA said was missing.',
          route: buildToolLink('evidence-strength'),
          priority: 'high',
        },
        {
          label: 'Explore appeal options',
          description: 'Review supplemental claim, HLR, and Board appeal pathways.',
          route: buildToolLink('appeals'),
          priority: 'high',
        },
      );
      break;

    case 'add-secondary-condition':
      actions.push({
        label: 'Log symptoms for this condition',
        description: 'Start documenting how this condition affects your daily life.',
        route: buildToolLink('symptoms', conditionId ? { condition: conditionId } : undefined),
        priority: 'high',
      });
      break;

    case 'add-condition':
      actions.push({
        label: 'Log your first symptoms',
        description: 'Daily symptom tracking is the foundation of a strong claim.',
        route: buildToolLink('symptoms', conditionId ? { condition: conditionId } : undefined),
        priority: 'high',
      });
      break;

    case 'scan-evidence':
      actions.push({
        label: 'Check your evidence checklist',
        description: 'See what evidence you have and what gaps remain.',
        route: buildToolLink('checklist'),
        priority: 'medium',
      });
      break;

    case 'complete-onboarding':
      actions.push({
        label: 'Start logging symptoms',
        description: 'Daily symptom tracking is the foundation of a strong claim.',
        route: buildToolLink('symptoms'),
        priority: 'high',
      });
      if (conditions.length > 0) {
        actions.push({
          label: 'Check your claim readiness',
          description: 'See where your evidence stands for each condition.',
          route: buildToolLink('conditions'),
          priority: 'medium',
        });
      }
      break;

    case 'quick-log-low':
      actions.push({
        label: 'Log what\'s causing this',
        description: 'Document your symptoms while they\'re fresh — it\'s evidence.',
        route: buildToolLink('symptoms'),
        priority: 'high',
      });
      break;

    case 'quick-log-normal':
      actions.push({
        label: 'View your health trends',
        description: 'See how you\'re doing over time.',
        route: buildToolLink('trends'),
        priority: 'low',
      });
      break;

    case 'browse-vso-locator':
      actions.push(
        {
          label: 'Build your claim strategy',
          description: 'Organize your conditions and evidence before meeting your VSO.',
          route: buildToolLink('strategy'),
          priority: 'high',
        },
        {
          label: 'Build your claim packet',
          description: 'Prepare a packet to bring to your VSO appointment.',
          route: buildToolLink('packet'),
          priority: 'medium',
        },
      );
      break;

    case 'browse-va-resources':
      actions.push(
        {
          label: 'Check your claim readiness',
          description: 'See where your evidence stands for each condition.',
          route: buildToolLink('conditions'),
          priority: 'high',
        },
        {
          label: 'Prepare for your C&P exam',
          description: 'Review what to expect and practice your talking points.',
          route: buildToolLink('exam-prep'),
          priority: 'medium',
        },
      );
      break;

    case 'browse-glossary':
      actions.push(
        {
          label: 'Ask Intel a question',
          description: 'Get AI-powered answers about your specific claim.',
          route: buildToolLink('ask-intel'),
          priority: 'medium',
        },
        {
          label: 'Start logging symptoms',
          description: 'Daily symptom tracking is the foundation of a strong claim.',
          route: buildToolLink('symptoms'),
          priority: 'medium',
        },
      );
      break;

    case 'browse-form-guide':
      actions.push(
        {
          label: 'Draft your personal statement',
          description: 'Write the narrative that supports your claim.',
          route: buildToolLink('personal-statement'),
          priority: 'high',
        },
        {
          label: 'Build your claim strategy',
          description: 'Decide which conditions to file and in what order.',
          route: buildToolLink('strategy'),
          priority: 'medium',
        },
      );
      break;

    case 'browse-state-benefits':
      if (conditions.length === 0) {
        actions.push({
          label: 'Add your conditions',
          description: 'Track your claimed conditions to unlock personalized tools.',
          route: buildToolLink('conditions'),
          priority: 'high',
        });
      } else {
        actions.push({
          label: 'Check your combined rating',
          description: 'See if your rating qualifies for additional state benefits.',
          route: buildToolLink('calculator'),
          priority: 'medium',
        });
      }
      actions.push({
        label: 'Explore TDIU eligibility',
        description: 'See if your conditions qualify for individual unemployability.',
        route: buildToolLink('tdiu'),
        priority: 'medium',
      });
      break;
  }

  return actions.slice(0, 3);
}
