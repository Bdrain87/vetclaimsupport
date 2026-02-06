import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, ExternalLink, Copy, Check, ChevronDown, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useClaims } from '@/hooks/useClaims';
import { useUserConditions } from '@/hooks/useUserConditions';
import { useProfileStore, BRANCH_LABELS } from '@/store/useProfileStore';
import { dbqForms, type VAForm } from '@/data/vaRequiredForms';
import { getConditionById } from '@/data/vaConditions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FormPriority = 'urgent' | 'required' | 'recommended';

interface GuidedForm {
  formNumber: string;
  name: string;
  description: string;
  url?: string;
  priority: FormPriority;
  reason: string;
  conditionSource?: string;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ---------------------------------------------------------------------------
// Priority helpers
// ---------------------------------------------------------------------------

const PRIORITY_ORDER: Record<FormPriority, number> = {
  urgent: 0,
  required: 1,
  recommended: 2,
};

const PRIORITY_LABEL: Record<FormPriority, string> = {
  urgent: 'URGENT',
  required: 'REQUIRED',
  recommended: 'RECOMMENDED',
};

function priorityBadgeClass(priority: FormPriority): string {
  switch (priority) {
    case 'urgent':
      return 'bg-[#C8A628]/20 text-[#C8A628] border border-[#C8A628]/40';
    case 'required':
      return 'bg-white/10 text-white border border-white/20';
    case 'recommended':
      return 'bg-white/[0.06] text-white/60 border border-white/10';
  }
}

// ---------------------------------------------------------------------------
// Clipboard helper
// ---------------------------------------------------------------------------

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: noop
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors',
        copied
          ? 'bg-emerald-500/20 text-emerald-400'
          : 'bg-white/[0.06] text-white/50 hover:bg-white/[0.1] hover:text-white/80',
      )}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Form card (expandable)
// ---------------------------------------------------------------------------

function FormCard({ form, index }: { form: GuidedForm; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div variants={itemVariants} custom={index}>
      <div
        className={cn(
          'rounded-xl border transition-all duration-200',
          'bg-white/[0.04] border-white/[0.08]',
          'hover:border-white/[0.14] hover:bg-white/[0.06]',
        )}
      >
        <div className="p-4 sm:p-5">
          {/* Top row: form number + priority badge */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-semibold text-[#C8A628]">
                VA Form {form.formNumber}
              </span>
              <Badge className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5', priorityBadgeClass(form.priority))}>
                {PRIORITY_LABEL[form.priority]}
              </Badge>
            </div>

            {form.url && (
              <a
                href={form.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex-shrink-0',
                  'bg-[#C8A628]/10 text-[#C8A628] hover:bg-[#C8A628]/20',
                )}
              >
                Open on VA.gov
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-white text-base mb-1">{form.name}</h3>

          {/* Reason */}
          <p className="text-sm text-white/60 leading-relaxed">{form.reason}</p>

          {/* Condition source tag */}
          {form.conditionSource && (
            <span className="inline-block mt-2 text-xs text-white/40 bg-white/[0.04] rounded px-2 py-0.5">
              For: {form.conditionSource}
            </span>
          )}

          {/* Expand / collapse */}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 transition-transform duration-200',
                expanded && 'rotate-180',
              )}
            />
            {expanded ? 'Hide details' : 'Show details'}
          </button>

          {expanded && (
            <div className="mt-3 pt-3 border-t border-white/[0.06] text-sm text-white/50 leading-relaxed">
              {form.description}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function FormGuide() {
  const { data } = useClaims();
  const { conditions: userConditions } = useUserConditions();
  const profile = useProfileStore();

  // ---- Resolve condition names from both sources ----
  const conditionNames = useMemo(() => {
    const names = new Set<string>();

    // From claim conditions
    (data.claimConditions ?? []).forEach((c) => {
      if (c.name) names.add(c.name);
    });

    // From user conditions (look up via getConditionById)
    userConditions.forEach((uc) => {
      if (uc.conditionId) {
        const vaCondition = getConditionById(uc.conditionId);
        if (vaCondition) names.add(vaCondition.name);
      }
    });

    return Array.from(names);
  }, [data.claimConditions, userConditions]);

  // ---- Build the prioritised form list ----
  const guidedForms = useMemo(() => {
    const forms: GuidedForm[] = [];
    const seenFormNumbers = new Set<string>();

    const addForm = (f: GuidedForm) => {
      if (seenFormNumbers.has(f.formNumber)) return;
      seenFormNumbers.add(f.formNumber);
      forms.push(f);
    };

    // 1. URGENT: Intent to File
    addForm({
      formNumber: '21-0966',
      name: 'Intent to File a Claim for Compensation',
      description:
        'Notifies the VA that you plan to file a disability claim. This locks in your effective date, giving you up to one year to submit your full application. Filing this first can mean earlier back-pay if your claim is approved.',
      url: 'https://www.va.gov/find-forms/about-form-21-0966/',
      priority: 'urgent',
      reason: 'Protects your effective date \u2014 file this FIRST. Gives you 1 year to prepare your full claim.',
    });

    // 2. REQUIRED: 21-526EZ
    addForm({
      formNumber: '21-526EZ',
      name: 'Application for Disability Compensation',
      description:
        'The main application form for VA disability compensation. Required for all initial, increase, and secondary claims. You list your conditions, service connection basis, and supporting evidence.',
      url: 'https://www.va.gov/find-forms/about-form-21-526ez/',
      priority: 'required',
      reason: 'The primary claim form \u2014 required to apply for VA disability compensation.',
    });

    // 3. CONDITION-SPECIFIC forms
    conditionNames.forEach((conditionName) => {
      const key = conditionName.toLowerCase();

      // Check every key in dbqForms for a match
      Object.entries(dbqForms).forEach(([dbqKey, dbqFormList]) => {
        if (
          key.includes(dbqKey) ||
          dbqKey.includes(key.replace(/\s+/g, '_'))
        ) {
          dbqFormList.forEach((f: VAForm) => {
            addForm({
              formNumber: f.formNumber,
              name: f.name,
              description: f.description,
              url: f.url,
              priority: 'recommended',
              reason: `Condition-specific form for your claimed condition: ${conditionName}`,
              conditionSource: conditionName,
            });
          });
        }
      });

      // Also do keyword matching for common patterns
      if (
        key.includes('ptsd') ||
        key.includes('post-traumatic') ||
        key.includes('posttraumatic')
      ) {
        (dbqForms['ptsd'] || []).forEach((f) =>
          addForm({
            ...f,
            priority: 'recommended',
            reason: `Required for PTSD claims \u2014 documents your stressor events.`,
            conditionSource: conditionName,
          }),
        );
      }
      if (key.includes('sleep apnea') || key.includes('cpap')) {
        (dbqForms['sleep_apnea'] || []).forEach((f) =>
          addForm({
            ...f,
            priority: 'recommended',
            reason: `Required for sleep apnea claims \u2014 documents sleep study results.`,
            conditionSource: conditionName,
          }),
        );
      }
      if (key.includes('migraine') || key.includes('headache')) {
        (dbqForms['migraine'] || []).forEach((f) =>
          addForm({
            ...f,
            priority: 'recommended',
            reason: `Required for migraine/headache claims \u2014 supports frequency and severity documentation.`,
            conditionSource: conditionName,
          }),
        );
      }
      if (key.includes('tinnitus') || key.includes('ringing')) {
        (dbqForms['tinnitus'] || []).forEach((f) =>
          addForm({
            ...f,
            priority: 'recommended',
            reason: `Required for tinnitus claims.`,
            conditionSource: conditionName,
          }),
        );
      }
      if (key.includes('hearing') || key.includes('deaf')) {
        (dbqForms['hearing'] || []).forEach((f) =>
          addForm({
            ...f,
            priority: 'recommended',
            reason: `Required for hearing loss claims \u2014 an audiogram is needed.`,
            conditionSource: conditionName,
          }),
        );
      }
      if (key.includes('knee') || key.includes('patell')) {
        (dbqForms['knee'] || []).forEach((f) =>
          addForm({
            ...f,
            priority: 'recommended',
            reason: `DBQ form for knee/lower leg conditions.`,
            conditionSource: conditionName,
          }),
        );
      }
      if (key.includes('anxiety') || key.includes('panic')) {
        (dbqForms['anxiety'] || []).forEach((f) =>
          addForm({
            ...f,
            priority: 'recommended',
            reason: `Required for anxiety disorder claims.`,
            conditionSource: conditionName,
          }),
        );
      }
      if (key.includes('depression') || key.includes('major depressive')) {
        (dbqForms['depression'] || []).forEach((f) =>
          addForm({
            ...f,
            priority: 'recommended',
            reason: `Required for depressive disorder claims.`,
            conditionSource: conditionName,
          }),
        );
      }
      if (key.includes('lumbar') || key.includes('lower back') || key.includes('thoracolumbar')) {
        (dbqForms['lumbar'] || []).forEach((f) =>
          addForm({
            ...f,
            priority: 'recommended',
            reason: `DBQ form for back (thoracolumbar spine) conditions.`,
            conditionSource: conditionName,
          }),
        );
      }
      if (key.includes('cervical') || key.includes('neck')) {
        (dbqForms['cervical'] || []).forEach((f) =>
          addForm({
            ...f,
            priority: 'recommended',
            reason: `DBQ form for neck (cervical spine) conditions.`,
            conditionSource: conditionName,
          }),
        );
      }
      if (key.includes('shoulder') || key.includes('rotator')) {
        (dbqForms['shoulder'] || []).forEach((f) =>
          addForm({
            ...f,
            priority: 'recommended',
            reason: `DBQ form for shoulder and arm conditions.`,
            conditionSource: conditionName,
          }),
        );
      }
      if (key.includes('diabetes') || key.includes('diabetic')) {
        (dbqForms['diabetes'] || []).forEach((f) =>
          addForm({
            ...f,
            priority: 'recommended',
            reason: `Required for diabetes mellitus claims.`,
            conditionSource: conditionName,
          }),
        );
      }
      if (key.includes('hypertension') || key.includes('high blood pressure')) {
        (dbqForms['hypertension'] || []).forEach((f) =>
          addForm({
            ...f,
            priority: 'recommended',
            reason: `Required for hypertension claims.`,
            conditionSource: conditionName,
          }),
        );
      }
    });

    // Sort by priority order
    forms.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

    return forms;
  }, [conditionNames]);

  // ---- Profile data items for the pre-fill section ----
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
  const branchLabel = profile.branch ? BRANCH_LABELS[profile.branch] : '';

  const dataItems = useMemo(() => {
    const items: { label: string; value: string; source: string }[] = [];

    if (fullName.trim()) {
      items.push({ label: 'Full Name', value: fullName, source: 'Your Profile' });
    }

    if (branchLabel) {
      items.push({ label: 'Branch of Service', value: branchLabel, source: 'Your Profile' });
    }

    if (profile.mosCode && profile.mosTitle) {
      items.push({
        label: 'MOS / Rate / AFSC',
        value: `${profile.mosCode} \u2014 ${profile.mosTitle}`,
        source: 'Your Profile',
      });
    }

    if (profile.serviceDates?.start || profile.serviceDates?.end) {
      const start = profile.serviceDates.start
        ? new Date(profile.serviceDates.start).toLocaleDateString()
        : 'N/A';
      const end = profile.serviceDates.end
        ? new Date(profile.serviceDates.end).toLocaleDateString()
        : 'Present';
      items.push({
        label: 'Service Dates',
        value: `${start} \u2013 ${end}`,
        source: 'Your Profile',
      });
    }

    if (conditionNames.length > 0) {
      items.push({
        label: 'Claimed Conditions',
        value: conditionNames.join(', '),
        source: 'Your Claim Conditions',
      });
    }

    return items;
  }, [fullName, branchLabel, profile.mosCode, profile.mosTitle, profile.serviceDates, conditionNames]);

  // ---- Counts by priority ----
  const urgentCount = guidedForms.filter((f) => f.priority === 'urgent').length;
  const requiredCount = guidedForms.filter((f) => f.priority === 'required').length;
  const recommendedCount = guidedForms.filter((f) => f.priority === 'recommended').length;

  return (
    <motion.div
      className="space-y-8 max-w-3xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ---- Page header ---- */}
      <motion.div variants={itemVariants}>
        <div className="section-header">
          <div className="section-icon">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">VA Form Guidance</h1>
            <p className="text-muted-foreground">
              Forms you need based on your claimed conditions, in priority order
            </p>
          </div>
        </div>
      </motion.div>

      {/* ---- Summary strip ---- */}
      <motion.div variants={itemVariants}>
        <div
          className={cn(
            'rounded-xl p-4 flex flex-wrap items-center gap-4',
            'bg-[#102039] border border-white/[0.08]',
          )}
        >
          <Shield className="h-5 w-5 text-[#C8A628]" />
          <span className="text-sm text-white/70">
            <span className="text-[#C8A628] font-semibold">{guidedForms.length}</span>{' '}
            {guidedForms.length === 1 ? 'form' : 'forms'} identified
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          {urgentCount > 0 && (
            <span className="text-xs text-[#C8A628] font-medium">
              {urgentCount} urgent
            </span>
          )}
          {requiredCount > 0 && (
            <span className="text-xs text-white/60 font-medium">
              {requiredCount} required
            </span>
          )}
          {recommendedCount > 0 && (
            <span className="text-xs text-white/40 font-medium">
              {recommendedCount} condition-specific
            </span>
          )}
        </div>
      </motion.div>

      {/* ---- Warning callout ---- */}
      <motion.div variants={itemVariants}>
        <div
          className={cn(
            'rounded-xl p-4 flex items-start gap-3',
            'bg-[#C8A628]/[0.08] border border-[#C8A628]/20',
          )}
        >
          <AlertTriangle className="h-5 w-5 text-[#C8A628] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[#C8A628]">File your Intent to File first</p>
            <p className="text-xs text-white/50 mt-1">
              VA Form 21-0966 protects your effective date. Even if your full claim takes months to
              prepare, filing this form now means your benefits can be backdated to today.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ---- Form cards ---- */}
      <motion.div className="space-y-3" variants={containerVariants}>
        {guidedForms.map((form, index) => (
          <FormCard key={form.formNumber} form={form} index={index} />
        ))}

        {guidedForms.length === 0 && (
          <motion.div variants={itemVariants}>
            <Card className="bg-white/[0.04] border-white/[0.08]">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-white/20 mx-auto mb-4" />
                <h3 className="font-medium text-white/70 mb-2">No conditions added yet</h3>
                <p className="text-sm text-white/40 mb-4">
                  Add your claimed conditions to see which forms you need.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/conditions">Add Conditions</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* ---- Your pre-filled data section ---- */}
      {dataItems.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="bg-white/[0.04] border-white/[0.08] overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-white/90">
                <Shield className="h-4 w-4 text-[#C8A628]" />
                Your Data for Forms
              </CardTitle>
              <p className="text-xs text-white/40 mt-1">
                Copy these values when filling out your VA forms. All data comes from your VCS profile.
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {dataItems.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    'rounded-lg p-3 flex items-start justify-between gap-3',
                    'bg-white/[0.03] border border-white/[0.06]',
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-white/40 mb-0.5">{item.label}</p>
                    <p className="text-sm text-white/80 break-words">{item.value}</p>
                    <p className="text-[10px] text-white/25 mt-1">Source: {item.source}</p>
                  </div>
                  <CopyButton text={item.value} />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ---- Legal disclaimer ---- */}
      <motion.div variants={itemVariants}>
        <div
          className={cn(
            'rounded-xl p-5',
            'bg-white/[0.02] border border-white/[0.06]',
          )}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-white/30 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-white/35 leading-relaxed">
              VCS is a claim preparation tool. We organize YOUR evidence and show you where it goes.
              We are not a law firm, medical provider, or accredited claims agent. Review all
              information for accuracy. You are responsible for everything submitted to the VA.
              Consider consulting an accredited VSO for personalized advice.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
