import { useClaims } from '@/context/ClaimsContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getRelatedConditions } from '@/data/antiPyramidingConditions';
import { Plus, Link2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface RelatedConditionsProps {
  conditionName: string;
  existingConditionNames: string[];
}

export function RelatedConditions({ conditionName, existingConditionNames }: RelatedConditionsProps) {
  const { addClaimCondition } = useClaims();
  
  const relatedConditions = getRelatedConditions(conditionName, 3);
  
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

  return (
    <div className="space-y-2 pt-2 border-t border-border/50">
      <div className="flex items-center gap-1.5">
        <Link2 className="h-3 w-3 text-primary" />
        <span className="text-xs font-medium text-foreground">Related Conditions</span>
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
          38 CFR 4.14 Compliant
        </Badge>
      </div>
      
      <div className="space-y-1.5">
        {availableConditions.map((rc, idx) => (
          <div 
            key={idx}
            className="flex items-start justify-between gap-2 p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground">{rc.name}</p>
              <p className="text-[10px] text-muted-foreground line-clamp-1">{rc.reason}</p>
              <Badge variant="outline" className="text-[9px] px-1 py-0 mt-0.5">
                {rc.category}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs shrink-0"
              onClick={(e) => handleAddCondition(rc.name, e)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
        ))}
      </div>

      {/* Anti-pyramiding disclaimer */}
      <div className="flex items-start gap-1.5 p-2 rounded-md bg-warning/5 border border-warning/20">
        <AlertTriangle className="h-3 w-3 text-warning shrink-0 mt-0.5" />
        <p className="text-[10px] text-muted-foreground leading-tight">
          <span className="font-medium text-warning">Educational only.</span> These are conditions with different symptoms to avoid pyramiding. Consult a VSO before filing.
        </p>
      </div>
    </div>
  );
}
