import { ChevronRight, Shield, CheckCircle2, Flag, Sun, Award, AlertTriangle, Star, type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Conflict, getConditionStats } from '@/data/conflictConditions';

const conflictIconMap: Record<string, LucideIcon> = { Flag, Sun, Award, AlertTriangle, Shield, Star };

interface ConflictCardProps {
  conflict: Conflict;
  onClick: () => void;
  isSelected?: boolean;
}

export function ConflictCard({ conflict, onClick, isSelected }: ConflictCardProps) {
  const stats = getConditionStats(conflict);

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-lg ${
        isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] flex-shrink-0" role="img" aria-label={conflict.name}>
              {(() => { const Icon = conflictIconMap[conflict.icon]; return Icon ? <Icon className="h-5 w-5 text-gold" /> : null; })()}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate">{conflict.name}</h3>
              <p className="text-sm text-muted-foreground">{conflict.years}</p>
            </div>
          </div>
          <ChevronRight
            className={`h-5 w-5 text-muted-foreground transition-transform ${
              isSelected ? 'rotate-90' : ''
            }`}
          />
        </div>

        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
          {conflict.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary" className="gap-1">
            <Shield className="h-3 w-3" />
            {stats.total} conditions
          </Badge>
          {stats.presumptive > 0 && (
            <Badge className="gap-1 bg-success/15 text-success border-success/30">
              <CheckCircle2 className="h-3 w-3" />
              {stats.presumptive} presumptive
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {conflict.exposures.slice(0, 3).map((exposure) => (
            <Badge key={exposure} variant="outline" className="text-xs truncate max-w-full">
              {exposure}
            </Badge>
          ))}
          {conflict.exposures.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{conflict.exposures.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
