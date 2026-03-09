import { useState, useEffect } from 'react';
import { Shield, ChevronDown, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { branchExposures, militaryBranches, type MilitaryBranch } from '@/data/branchExposures';

interface BranchExposuresSelectorProps {
  onSelectExposure: (exposureName: string) => void;
}

export function BranchExposuresSelector({ onSelectExposure }: BranchExposuresSelectorProps) {
  const [selectedBranch, setSelectedBranch] = useState<MilitaryBranch | ''>('');
  const [isExpanded, setIsExpanded] = useState(true);

  // Try to load saved branch from localStorage on mount
  useEffect(() => {
    const savedBranch = localStorage.getItem('militaryBranch');
    if (savedBranch && militaryBranches.includes(savedBranch as MilitaryBranch)) {
      setSelectedBranch(savedBranch as MilitaryBranch);
    }
  }, []);

  const handleBranchChange = (branch: MilitaryBranch) => {
    setSelectedBranch(branch);
    try {
      localStorage.setItem('militaryBranch', branch);
    } catch {
      // Storage full or unavailable
    }
  };

  const exposures = selectedBranch ? branchExposures[selectedBranch] : [];

  return (
    <Card className="data-card border-exposure/20 bg-exposure/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5 text-exposure" />
            Branch-Specific Exposures
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Select Your Branch</label>
            <Select value={selectedBranch} onValueChange={handleBranchChange}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Choose military branch..." />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {militaryBranches.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedBranch && exposures.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Common exposures for <strong className="text-foreground">{selectedBranch}</strong> personnel. 
                Click to quickly log an exposure:
              </p>
              
              <div className="grid gap-2">
                {exposures.map((exposure) => (
                  <button
                    key={exposure.name}
                    onClick={() => onSelectExposure(exposure.name)}
                    className="flex items-start gap-3 p-3 text-left bg-background rounded-lg border border-border hover:border-exposure/50 hover:bg-exposure/5 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm group-hover:text-exposure transition-colors">
                        {exposure.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {exposure.description}
                      </p>
                    </div>
                    <Plus className="h-4 w-4 text-muted-foreground group-hover:text-exposure shrink-0 mt-0.5" />
                  </button>
                ))}
              </div>

              <p className="text-xs text-muted-foreground italic">
                Don't see your exposure? You can still add custom exposures using the "Add Exposure" button above.
              </p>
            </div>
          )}

          {!selectedBranch && (
            <p className="text-sm text-muted-foreground">
              Select your branch to see common exposures. This can help you identify hazards 
              you may have been exposed to during your service.
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
}
