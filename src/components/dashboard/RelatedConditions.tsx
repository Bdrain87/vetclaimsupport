import { useState } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getRelatedConditions } from '@/data/antiPyramidingConditions';
import { Plus, Link2, AlertTriangle, ChevronDown, ClipboardList, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Link } from 'react-router-dom';

interface RelatedConditionsProps {
  conditionName: string;
  existingConditionNames: string[];
}

// Evidence requirements for common secondary conditions
const evidenceRequirements: Record<string, { items: string[]; critical?: string }> = {
  'Sleep Apnea': {
    items: ['Sleep study (polysomnogram)', 'Doctor summary linking to primary', 'CPAP prescription records'],
    critical: 'Sleep study is required for diagnosis'
  },
  'GERD': {
    items: ['Endoscopy results', 'PPI medication history', 'Doctor summary from GI doctor'],
  },
  'Migraines': {
    items: ['Headache log showing frequency', 'Prostrating attack documentation', 'Doctor summary'],
    critical: 'Document prostrating attacks (bed rest required)'
  },
  'Hypertension': {
    items: ['Blood pressure readings over time', 'Medication history', 'Doctor summary linking to primary'],
  },
  'Tinnitus': {
    items: ['Audiogram', 'Statement of constant ringing', 'Buddy statements about when noticed'],
  },
  'IBS': {
    items: ['GI specialist diagnosis', 'Symptom log', 'Doctor summary linking to anxiety/stress'],
  },
  'Tension Headaches': {
    items: ['Headache diary', 'Treatment records', 'Doctor summary'],
  },
  'TMJ Disorder': {
    items: ['Dental exam records', 'X-rays or MRI of jaw', 'Documentation of bruxism'],
  },
  'Radiculopathy': {
    items: ['MRI showing nerve compression', 'EMG/nerve conduction study', 'Neurologist evaluation'],
    critical: 'EMG confirms nerve damage'
  },
  'Sciatica': {
    items: ['MRI of lumbar spine', 'Physical exam noting positive SLR test', 'Treatment records'],
  },
  'Erectile Dysfunction': {
    items: ['Urologist diagnosis', 'Medication records (if any)', 'Doctor summary linking to primary'],
  },
  'Hearing Loss': {
    items: ['Audiogram showing hearing thresholds', 'Noise exposure documentation', 'Buddy statements'],
    critical: 'Audiogram required for rating'
  },
  'Vertigo': {
    items: ['Vestibular testing', 'ENT evaluation', 'Documentation of episodes'],
  },
  'Chronic Fatigue': {
    items: ['Sleep study to rule out other causes', 'Medical records showing pattern', 'Functional impact statements'],
  },
  'Obesity': {
    items: ['Weight records over time', 'Medical documentation of BMI', 'Doctor summary linking to medications/inactivity'],
  },
  'Peripheral Neuropathy': {
    items: ['EMG/nerve conduction study', 'Neurologist diagnosis', 'Documentation of symptoms'],
    critical: 'EMG required for rating'
  },
  'Diabetic Retinopathy': {
    items: ['Ophthalmologist exam', 'Retinal imaging', 'Visual acuity testing'],
  },
  'Hip Condition': {
    items: ['X-rays or MRI of hip', 'Range of motion testing', 'Doctor summary linking to gait changes'],
  },
  'Lower Back Pain': {
    items: ['Imaging (X-ray/MRI)', 'Range of motion with goniometer', 'Doctor summary'],
  },
  'Knee Condition': {
    items: ['X-rays or MRI', 'Range of motion testing', 'Instability testing'],
  },
  'Cervical Strain': {
    items: ['Imaging of cervical spine', 'Range of motion testing', 'Treatment records'],
  },
  'Post-Traumatic Headaches': {
    items: ['TBI diagnosis records', 'Headache frequency log', 'Doctor summary linking to head injury'],
  },
  'Pituitary Dysfunction': {
    items: ['Hormone panel blood tests', 'Endocrinologist evaluation', 'MRI of pituitary'],
  },
};

export function RelatedConditions({ conditionName, existingConditionNames }: RelatedConditionsProps) {
  const { addClaimCondition } = useClaims();
  const [expandedCondition, setExpandedCondition] = useState<string | null>(null);
  
  const relatedConditions = getRelatedConditions(conditionName, 5);
  
  // Filter out conditions already being claimed
  const availableConditions = relatedConditions.filter(
    rc => !existingConditionNames.some(
      existing => existing.toLowerCase().includes(rc.name.toLowerCase()) ||
                  rc.name.toLowerCase().includes(existing.toLowerCase())
    )
  );

  if (availableConditions.length === 0) {
    return null;
  }

  const handleAddCondition = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    addClaimCondition({
      name,
      linkedMedicalVisits: [],
      linkedExposures: [],
      linkedSymptoms: [],
      linkedDocuments: [],
      linkedBuddyContacts: [],
      notes: `Secondary to ${conditionName}`,
      createdAt: new Date().toISOString(),
    });
    toast.success(`Added "${name}" to your claims`);
  };

  const getEvidenceForCondition = (name: string) => {
    return evidenceRequirements[name] || {
      items: ['Medical diagnosis records', 'Doctor summary linking to primary condition', 'Treatment history']
    };
  };

  return (
    <div className="space-y-2 pt-2 border-t border-border/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Link2 className="h-3 w-3 text-primary" />
          <span className="text-xs font-medium text-foreground">Commonly Linked Secondary Conditions</span>
        </div>
        <Link to="/settings/resources">
          <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] gap-1 text-primary hover:text-primary">
            View All
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
      
      <p className="text-[10px] text-muted-foreground">
        You have <span className="font-medium text-primary">{conditionName}</span> → commonly linked:
      </p>
      
      <div className="space-y-1.5">
        {availableConditions.map((rc, idx) => {
          const evidence = getEvidenceForCondition(rc.name);
          const isExpanded = expandedCondition === rc.name;
          
          return (
            <Collapsible 
              key={idx} 
              open={isExpanded} 
              onOpenChange={(open) => setExpandedCondition(open ? rc.name : null)}
            >
              <div className="rounded-lg bg-muted/30 border border-border/50 overflow-hidden">
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2 p-2">
                  <CollapsibleTrigger asChild>
                    <button className="flex-1 min-w-0 text-left flex items-center gap-2 hover:opacity-80">
                      <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground">{rc.name}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">{rc.reason}</p>
                      </div>
                    </button>
                  </CollapsibleTrigger>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Badge variant="outline" className="text-[9px] px-1 py-0 hidden sm:inline-flex">
                      {rc.category}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={(e) => handleAddCondition(rc.name, e)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Expanded Evidence Requirements */}
                <CollapsibleContent>
                  <div className="px-3 pb-3 pt-1 border-t border-border/30">
                    <p className="text-[10px] font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <ClipboardList className="h-3 w-3" />
                      Evidence Needed for {rc.name}:
                    </p>
                    
                    <ul className="space-y-1">
                      {evidence.items.map((item, i) => (
                        <li key={i} className="text-[10px] text-foreground flex items-start gap-1.5">
                          <span className="text-primary mt-0.5">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    
                    {evidence.critical && (
                      <div className="mt-2 p-1.5 rounded bg-warning/10 border border-warning/20">
                        <p className="text-[10px] text-warning font-medium flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {evidence.critical}
                        </p>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>

      {/* Anti-pyramiding disclaimer */}
      <div className="flex items-start gap-1.5 p-2 rounded-md bg-success/5 border border-success/20">
        <Badge variant="outline" className="text-[9px] px-1 py-0 border-success/30 text-success">
          Different System
        </Badge>
        <p className="text-[10px] text-muted-foreground leading-tight">
          These conditions affect different body systems (38 CFR 4.14 compliant). Consult a VSO before filing.
        </p>
      </div>
    </div>
  );
}
