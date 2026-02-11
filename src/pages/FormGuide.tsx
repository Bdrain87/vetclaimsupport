import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, FileText, AlertTriangle, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { searchFormGuides } from '@/data/formGuideData';
import { useClaims } from '@/hooks/useClaims';
import { useUserConditions } from '@/hooks/useUserConditions';
import { getConditionById } from '@/data/vaConditions';
import { PageContainer } from '@/components/PageContainer';

type FormPriority = 'urgent' | 'required' | 'recommended';

function getPriorityForForm(formId: string, conditionNames: string[]): FormPriority {
  if (formId === '21-526EZ') return 'required';
  if (formId === '21-0781') {
    const hasPTSD = conditionNames.some(
      (n) => n.toLowerCase().includes('ptsd') || n.toLowerCase().includes('post-traumatic')
    );
    return hasPTSD ? 'urgent' : 'recommended';
  }
  if (formId === '21-8940') return 'recommended';
  if (formId === '21-4138') return 'required';
  return 'recommended';
}

function priorityLabel(p: FormPriority): string {
  return p === 'urgent' ? 'Urgent' : p === 'required' ? 'Required' : 'Recommended';
}

function priorityColor(p: FormPriority): string {
  return p === 'urgent'
    ? 'bg-blue-500/15 text-blue-500 border-blue-500/30'
    : p === 'required'
      ? 'bg-primary/15 text-primary border-primary/30'
      : 'bg-muted text-muted-foreground border-border';
}

export default function FormGuide() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { data } = useClaims();
  const { conditions: userConditions } = useUserConditions();

  const conditionNames = useMemo(() => {
    const names = new Set<string>();
    (data.claimConditions ?? []).forEach((c) => {
      if (c.name) names.add(c.name);
    });
    userConditions.forEach((uc) => {
      const details = getConditionById(uc.conditionId);
      if (details) names.add(details.name);
    });
    return Array.from(names);
  }, [data.claimConditions, userConditions]);

  const filteredForms = useMemo(() => {
    return searchFormGuides(searchQuery);
  }, [searchQuery]);

  return (
    <PageContainer className="py-6 space-y-5">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">VA Form Guide</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Understand and draft your form responses
        </p>
      </div>

      {/* Disclaimer Banner */}
      <div className={cn(
        'rounded-xl p-4 flex items-start gap-3',
        'bg-blue-500/[0.08] border border-blue-500/20'
      )}>
        <AlertTriangle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">Drafting Assistant, Not Filing</p>
          <p className="text-xs text-muted-foreground mt-1">
            We help you understand form fields and draft your responses.
            We do not file your claim, submit forms, or communicate with the VA on your behalf.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder='Search by form number, title, or use case (e.g., "PTSD", "TDIU")'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Form Cards */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {filteredForms.map((form, index) => {
          const priority = getPriorityForForm(form.formId, conditionNames);
          return (
            <motion.button
              key={form.formId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              onClick={() => navigate(`/prep/form-guide/${form.formId}`)}
              className={cn(
                'w-full text-left rounded-xl border border-border bg-card p-4',
                'hover:bg-accent/50 transition-colors',
                'active:scale-[0.99]'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-sm font-semibold text-primary">
                      {form.formId}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn('text-[10px] font-bold uppercase tracking-wider', priorityColor(priority))}
                    >
                      {priorityLabel(priority)}
                    </Badge>
                  </div>
                  <h3 className="font-medium text-foreground text-sm">{form.formTitle}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{form.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
              </div>
            </motion.button>
          );
        })}

        {filteredForms.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No forms match your search.</p>
          </div>
        )}
      </motion.div>
    </PageContainer>
  );
}
