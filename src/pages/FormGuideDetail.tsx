import { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AlertTriangle, Copy, Check, Sparkles, Loader2, X, Download, ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { getFormGuideById, type FormField } from '@/data/formGuideData';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';
import { getAllBranchLabels } from '@/utils/veteranProfile';
import { useClaims } from '@/hooks/useClaims';
import { useGemini } from '@/hooks/useGemini';
import { generateFormGuidePDF } from '@/services/exportEngine';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';
import { PageContainer } from '@/components/PageContainer';

// ---------------------------------------------------------------------------
// Field Card — each field in the form
// ---------------------------------------------------------------------------

interface FieldCardProps {
  field: FormField;
  formId: string;
  savedValue: string;
  onSave: (fieldId: string, value: string) => void;
}

function FieldCard({ field, formId: _formId, savedValue, onSave }: FieldCardProps) {
  const [value, setValue] = useState(savedValue);
  const [copied, setCopied] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [aiError, setAiError] = useState(false);

  const { generate, isLoading: aiLoading, cancel: cancelAI } = useGemini('VA_SPEAK_TRANSLATOR');
  const profile = useProfileStore();
  const { data } = useClaims();

  const handleChange = useCallback(
    (newVal: string) => {
      setValue(newVal);
      onSave(field.fieldId, newVal);
    },
    [field.fieldId, onSave]
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: noop
    }
  }, [value]);

  const handleAIHelper = useCallback(async () => {
    if (!value.trim() && !field.aiHelpPrompt) return;
    setShowAI(true);
    setAiError(false);
    setAiSuggestion(null);

    // Build context
    const contextParts: string[] = [];
    if (field.aiHelpPrompt) contextParts.push(field.aiHelpPrompt);
    contextParts.push(`Field: ${field.label}`);
    if (value.trim()) contextParts.push(`Veteran's input: ${value}`);
    if (profile.firstName) contextParts.push(`Name: ${profile.firstName} ${profile.lastName}`);
    const allBranches = getAllBranchLabels(profile);
    if (allBranches) contextParts.push(`Branch: ${allBranches}`);
    if (profile.mosCode) contextParts.push(`MOS: ${profile.mosCode} — ${profile.mosTitle}`);
    if (profile.serviceDates?.start)
      contextParts.push(`Service: ${profile.serviceDates.start} to ${profile.serviceDates.end || 'present'}`);

    // Add a few symptom/condition references
    const conditions = data.claimConditions?.slice(0, 5).map((c) => c.name) || [];
    if (conditions.length > 0) contextParts.push(`Claimed conditions: ${conditions.join(', ')}`);

    const recentSymptoms = data.symptoms?.slice(0, 3).map((s) => `${s.symptom} (${s.bodyArea}, ${s.severity}/10)`) || [];
    if (recentSymptoms.length > 0) contextParts.push(`Recent symptoms: ${recentSymptoms.join('; ')}`);

    contextParts.push(
      'Instruction: Rewrite the veteran\'s input using proper VA clinical/legal terminology. Keep it truthful and based only on what they wrote. Do not invent facts.'
    );

    const result = await generate(contextParts.join('\n'));
    if (result) {
      setAiSuggestion(result);
    } else {
      setAiError(true);
    }
  }, [value, field, generate, profile, data]);

  const handleUseAI = useCallback(() => {
    if (aiSuggestion) {
      handleChange(aiSuggestion);
      setShowAI(false);
      setAiSuggestion(null);
    }
  }, [aiSuggestion, handleChange]);

  const handleDismissAI = useCallback(() => {
    cancelAI();
    setShowAI(false);
    setAiSuggestion(null);
    setAiError(false);
  }, [cancelAI]);

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      {/* Section + Label */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
          {field.section}
        </p>
        <h3 className="font-semibold text-sm text-foreground mt-1 break-words">{field.label}</h3>
      </div>

      {/* Plain-language explanation */}
      <p className="text-xs text-muted-foreground leading-relaxed">{field.explanation}</p>

      {/* Text Input */}
      <Textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={field.placeholder}
        className="min-h-[80px] text-sm"
      />

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* AI Helper */}
        {field.aiHelpPrompt && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 h-9 min-h-[36px]"
            onClick={handleAIHelper}
            disabled={aiLoading || (!value.trim())}
          >
            {aiLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            AI Helper
          </Button>
        )}

        {/* Copy */}
        <Button
          variant="ghost"
          size="sm"
          className="text-xs gap-1.5 h-9 min-h-[36px]"
          onClick={handleCopy}
          disabled={!value.trim()}
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>

      {/* AI Suggestion Panel */}
      {showAI && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2">
          {aiLoading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Generating suggestion...
            </div>
          )}
          {aiError && (
            <p className="text-xs text-muted-foreground">
              AI suggestion unavailable. You can still write your response manually.
            </p>
          )}
          {aiSuggestion && (
            <>
              <AIDisclaimer variant="banner" className="mb-2" />
              <p className="text-xs text-foreground whitespace-pre-wrap">{aiSuggestion}</p>
              <div className="flex gap-2">
                <Button size="sm" className="text-xs h-8" onClick={handleUseAI}>
                  Use This
                </Button>
                <Button size="sm" variant="ghost" className="text-xs h-8" onClick={handleDismissAI}>
                  Dismiss
                </Button>
              </div>
            </>
          )}
          {(aiError || (!aiLoading && !aiSuggestion)) && (
            <Button size="sm" variant="ghost" className="text-xs h-8" onClick={handleDismissAI}>
              <X className="h-3 w-3 mr-1" />
              Close
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function FormGuideDetail() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const formDrafts = useAppStore((s) => s.formDrafts);
  const setFormDraft = useAppStore((s) => s.setFormDraft);
  const clearFormDraft = useAppStore((s) => s.clearFormDraft);

  const formDef = formId ? getFormGuideById(formId) : undefined;
  const drafts = (formId && formDrafts[formId]) || {};

  // Track which sections are expanded
  const sections = useMemo(() => {
    if (!formDef) return [];
    const sectionMap = new Map<string, typeof formDef.fields>();
    formDef.fields.forEach((f) => {
      const existing = sectionMap.get(f.section) || [];
      existing.push(f);
      sectionMap.set(f.section, existing);
    });
    return Array.from(sectionMap.entries()).map(([name, fields]) => ({ name, fields }));
  }, [formDef]);

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(sections.map((s) => s.name))
  );

  const toggleSection = useCallback((name: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const handleSaveField = useCallback(
    (fieldId: string, value: string) => {
      if (formId) setFormDraft(formId, fieldId, value);
    },
    [formId, setFormDraft]
  );

  const handleExportPDF = useCallback(async () => {
    if (!formDef || !formId) return;
    await generateFormGuidePDF(
      formDef.formId,
      formDef.formTitle,
      formDef.fields.map((f) => ({ section: f.section, label: f.label, fieldId: f.fieldId })),
      drafts as Record<string, string>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDef, formId, formDrafts]);

  if (!formDef) {
    return (
      <PageContainer className="py-6 text-center">
        <p className="text-muted-foreground">Form not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/prep/form-guide')}>
          Back to Form Guide
        </Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-6 space-y-5">
      {/* Header */}
      <div>
        <p className="font-mono text-sm font-semibold text-primary">{formDef.formId}</p>
        <h1 className="text-xl font-bold text-foreground mt-1 break-words">{formDef.formTitle}</h1>
      </div>

      {/* Form Source Notice */}
      <div className={cn(
        'rounded-xl p-4 flex items-start gap-3',
        'bg-muted/50 border border-border'
      )}>
        <AlertTriangle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Forms change. We link to official VA sources and display the revision date.
          Always verify you are using the latest VA version before submitting.
        </p>
      </div>

      {/* What to Gather */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="font-semibold text-sm text-foreground mb-3">What to Gather</h2>
        <ul className="space-y-2">
          {formDef.whatToGather.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Field-by-Field Guide */}
      <div className="space-y-3">
        {sections.map((section) => (
          <div key={section.name}>
            <button
              onClick={() => toggleSection(section.name)}
              className="w-full flex items-center justify-between px-1 py-2 text-left"
            >
              <h2 className="font-semibold text-sm text-foreground">{section.name}</h2>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-muted-foreground transition-transform',
                  expandedSections.has(section.name) && 'rotate-180'
                )}
              />
            </button>
            {expandedSections.has(section.name) && (
              <div className="space-y-3 mt-1">
                {section.fields.map((field) => (
                  <FieldCard
                    key={field.fieldId}
                    field={field}
                    formId={formDef.formId}
                    savedValue={drafts[field.fieldId] || ''}
                    onSave={handleSaveField}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Export + Clear Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-4">
        <Button className="flex-1 gap-2" onClick={handleExportPDF}>
          <Download className="h-4 w-4" />
          <span className="truncate">Export Draft Worksheet</span>
        </Button>
        <Button
          variant="outline"
          className="text-destructive hover:text-destructive"
          onClick={() => {
            if (formId) clearFormDraft(formId);
          }}
        >
          Clear All
        </Button>
      </div>
    </PageContainer>
  );
}
