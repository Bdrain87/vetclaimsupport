import { ExternalLink, CheckCircle2, AlertCircle, Shield, FileText, Flag, Sun, Award, AlertTriangle, Star, type LucideIcon } from 'lucide-react';

const conflictIconMap: Record<string, LucideIcon> = { Flag, Sun, Award, AlertTriangle, Shield, Star };
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Conflict } from '@/data/conflictConditions';

interface ConflictDetailProps {
  conflict: Conflict;
  onClose?: () => void;
}

export function ConflictDetail({ conflict, onClose }: ConflictDetailProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] flex-shrink-0" role="img" aria-label={conflict.name}>
            {(() => { const Icon = conflictIconMap[conflict.icon]; return Icon ? <Icon className="h-6 w-6 text-gold" /> : null; })()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground break-words">{conflict.name}</h2>
            <p className="text-muted-foreground">{conflict.years}</p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      <p className="text-muted-foreground">{conflict.description}</p>

      {/* Exposures */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            Known Exposures
          </CardTitle>
          <CardDescription>
            Common hazardous exposures for this service era
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {conflict.exposures.map((exposure) => (
              <Badge key={exposure} variant="secondary" className="px-3 py-1">
                {exposure}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Condition Groups */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Common Conditions
        </h3>

        <Accordion type="multiple" defaultValue={[conflict.commonConditions[0]?.name]} className="space-y-2">
          {conflict.commonConditions.map((group) => (
            <AccordionItem
              key={group.name}
              value={group.name}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <div>
                    <span className="font-medium">{group.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {group.conditions.length} conditions
                      </Badge>
                      {group.presumptive && (
                        <Badge className="text-xs bg-success/15 text-success border-success/30 gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Presumptive
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                {group.notes && (
                  <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Note:</strong> {group.notes}
                    </p>
                  </div>
                )}
                <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                  {group.conditions.map((condition) => (
                    <div
                      key={condition}
                      className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border text-sm min-w-0"
                    >
                      {group.presumptive ? (
                        <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                      )}
                      <span className="break-words min-w-0">{condition}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* What is Presumptive */}
      <Card className="bg-primary/5 border-primary/30">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            What Does "Presumptive" Mean?
          </h4>
          <p className="text-sm text-muted-foreground">
            Presumptive conditions are automatically assumed to be connected to your service if you meet certain criteria
            (like serving in a specific location during a specific time). You don't need to prove the condition was
            caused by service - the VA "presumes" the connection. This makes the claims process faster and easier.
          </p>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Official Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {conflict.resources.map((resource) => (
              <a
                key={resource.url}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group min-w-0"
              >
                <span className="text-sm font-medium truncate">{resource.name}</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-semibold text-foreground mb-3">Evidence Tips for {conflict.name} Veterans</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                Keep records of all duty stations and dates - this establishes your presence in qualifying locations.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                For presumptive conditions, you only need to show you have the condition and served in the right place/time.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                Request your DD-214 and service personnel records to document your service locations.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                Even non-presumptive conditions can be service-connected with medical nexus evidence.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                Consider buddy statements from fellow service members who can attest to shared exposures.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
