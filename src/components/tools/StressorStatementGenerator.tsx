import { useState } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { useProfileStore } from '@/store/useProfileStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Download, AlertTriangle, Check, MapPin, Calendar, FileText, Plus, Trash2, Info, Sparkles, Loader2, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { exportStressorStatement } from '@/utils/pdfExport';
import { useAIGenerate } from '@/hooks/useAIGenerate';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';

interface StressorEvent {
  id: string;
  what: string;
  when: string;
  whenApproximate: string;
  where: string;
  unit: string;
  details: string;
  witnesses: string;
  serviceEntryId?: string;
}

export function StressorStatementGenerator() {
  const { data } = useClaims();
  const profile = useProfileStore();
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  const [events, setEvents] = useState<StressorEvent[]>([]);
  const [veteranName, setVeteranName] = useState(fullName);
  const [copied, setCopied] = useState(false);
  const { generate: aiGenerate, isLoading: aiLoading, error: aiError } = useAIGenerate('VA_SPEAK_TRANSLATOR');
  const [aiStructured, setAiStructured] = useState<Record<string, string>>({});
  const [aiSafetyBlocked, setAiSafetyBlocked] = useState<Record<string, boolean>>({});

  // Get service history for auto-population
  const serviceHistory = data.serviceHistory || [];

  // Create a new stressor event
  const addEvent = () => {
    setEvents([...events, {
      id: crypto.randomUUID(),
      what: '',
      when: '',
      whenApproximate: '',
      where: '',
      unit: '',
      details: '',
      witnesses: '',
    }]);
  };

  // Update an event
  const updateEvent = (id: string, updates: Partial<StressorEvent>) => {
    setEvents(events.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  // Delete an event
  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  // Auto-fill from service history
  const fillFromServiceHistory = (eventId: string, serviceEntryId: string) => {
    const entry = serviceHistory.find(s => s.id === serviceEntryId);
    if (!entry) return;

    const dateRange = entry.endDate 
      ? `${format(new Date(entry.startDate), 'MMMM yyyy')} to ${format(new Date(entry.endDate), 'MMMM yyyy')}`
      : `${format(new Date(entry.startDate), 'MMMM yyyy')} - Present`;

    updateEvent(eventId, {
      where: entry.base,
      unit: entry.unit || '',
      whenApproximate: dateRange,
      serviceEntryId,
    });
    toast.success('Location and dates filled from service history');
  };

  // Generate the formatted statement
  const generateStatement = () => {
    const today = format(new Date(), 'MMMM d, yyyy');
    
    let statement = `STRESSOR STATEMENT

Date: ${today}
Name: ${veteranName || '[YOUR NAME]'}

I, ${veteranName || '[YOUR NAME]'}, hereby provide this statement regarding traumatic event(s) experienced during my military service. This statement is provided in support of my claim for service-connected Post-Traumatic Stress Disorder (PTSD).

`;

    events.forEach((event, index) => {
      statement += `--- STRESSOR EVENT ${index + 1} ---

WHAT HAPPENED:
${event.what || '[Describe the traumatic event in detail]'}

WHEN IT HAPPENED:
${event.when ? format(new Date(event.when), 'MMMM d, yyyy') : event.whenApproximate || '[Date or approximate timeframe]'}

WHERE IT HAPPENED:
Location: ${event.where || '[Base/Location]'}
${event.unit ? `Unit: ${event.unit}` : ''}

ADDITIONAL DETAILS:
${event.details || '[Any additional context, your role, immediate aftermath, etc.]'}

${event.witnesses ? `WITNESSES/OTHERS PRESENT:
${event.witnesses}` : ''}

`;
    });

    statement += `---

I certify that the information provided in this statement is true and correct to the best of my knowledge and belief.


_________________________________
Signature

_________________________________
${veteranName || '[Printed Name]'}

_________________________________
Date`;

    return statement;
  };

  const handleAIStructure = async (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event || !event.what.trim()) return;

    setAiSafetyBlocked(prev => ({ ...prev, [eventId]: false }));

    const prompt = `Help structure a VA stressor statement for a PTSD claim. The veteran has provided raw details below.

IMPORTANT: Preserve the veteran's own words and voice. Do NOT rewrite their experience. Only organize their input into the VA's required What/When/Where format with clear structure.

Veteran's raw description:
${event.what}

${event.details ? `Additional details: ${event.details}` : ''}
${event.where ? `Location: ${event.where}` : ''}
${event.when || event.whenApproximate ? `Timeframe: ${event.when || event.whenApproximate}` : ''}

Please organize this into a structured stressor statement format:
1. WHAT HAPPENED (preserve veteran's words, improve clarity)
2. WHEN (specific dates or timeframes)
3. WHERE (locations, units)
4. IMPACT (how this affected them)

Keep the veteran's voice. Do not add fabricated details.`;

    const result = await aiGenerate(prompt);
    if (result) {
      setAiStructured(prev => ({ ...prev, [eventId]: result }));
    } else {
      // Check if it was a safety filter block
      setAiSafetyBlocked(prev => ({ ...prev, [eventId]: true }));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateStatement());
    setCopied(true);
    toast.success('Statement copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const statement = generateStatement();
    exportStressorStatement(statement);
    toast.success('Statement downloaded as PDF');
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Stressor Statement Generator</CardTitle>
              <CardDescription>
                Document traumatic events in the What/When/Where format the VA requires
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p>For PTSD claims, the VA requires specific details about stressor events. Be as specific as possible about:</p>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li><strong>WHAT</strong> - What happened (the traumatic event)</li>
                <li><strong>WHEN</strong> - Date or approximate timeframe (within 60 days)</li>
                <li><strong>WHERE</strong> - Specific location (base, country, region)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Veteran Name */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Your Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="veteranName">Full Legal Name</Label>
            <Input
              id="veteranName"
              placeholder="Enter your full name"
              value={veteranName}
              onChange={(e) => setVeteranName(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Service History Reference */}
      {serviceHistory.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Your Service History</CardTitle>
              <Badge variant="outline" className="text-xs">
                {serviceHistory.length} location{serviceHistory.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <CardDescription>Reference for when/where details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {serviceHistory.map((entry) => (
                <div key={entry.id} className="p-3 rounded-lg bg-muted/50 border text-sm">
                  <div className="flex items-center gap-2 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {entry.base}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(entry.startDate), 'MMM yyyy')} - {entry.endDate ? format(new Date(entry.endDate), 'MMM yyyy') : 'Present'}
                  </div>
                  {entry.unit && (
                    <p className="text-xs text-muted-foreground mt-1">{entry.unit}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {serviceHistory.length === 0 && (
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">No Service History Found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add your service history to auto-fill dates and locations.
                </p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link to="/settings/service-history">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service History
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stressor Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Stressor Events</CardTitle>
              <CardDescription>Document each traumatic event separately</CardDescription>
            </div>
            <Button onClick={addEvent} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No stressor events added yet.</p>
              <p className="text-sm mt-1">Click "Add Event" to document a traumatic event.</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-2">
              {events.map((event, index) => (
                <AccordionItem key={event.id} value={event.id} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-3 text-left">
                      <Badge variant="secondary" className="text-xs">
                        Event {index + 1}
                      </Badge>
                      <span className="text-sm truncate max-w-[200px]">
                        {event.what ? event.what.slice(0, 40) + (event.what.length > 40 ? '...' : '') : 'Untitled Event'}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 space-y-4">
                    {/* Auto-fill from service history */}
                    {serviceHistory.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Quick Fill from Service History</Label>
                        <Select onValueChange={(v) => fillFromServiceHistory(event.id, v)}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select a duty station to auto-fill location/dates" />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceHistory.map((entry) => (
                              <SelectItem key={entry.id} value={entry.id}>
                                {entry.base} ({format(new Date(entry.startDate), 'MMM yyyy')})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* WHAT */}
                    <div className="space-y-2">
                      <Label htmlFor={`what-${event.id}`} className="flex items-center gap-2">
                        <Badge className="bg-primary text-xs">WHAT</Badge>
                        What Happened
                      </Label>
                      <Textarea
                        id={`what-${event.id}`}
                        placeholder="Describe the traumatic event in detail. What did you witness or experience? Be specific but don't feel you need to relive every detail."
                        value={event.what}
                        onChange={(e) => updateEvent(event.id, { what: e.target.value })}
                        rows={4}
                      />
                    </div>

                    {/* WHEN */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`when-${event.id}`} className="flex items-center gap-2">
                          <Badge className="bg-primary text-xs">WHEN</Badge>
                          Exact Date (if known)
                        </Label>
                        <Input
                          id={`when-${event.id}`}
                          type="date"
                          value={event.when}
                          onChange={(e) => updateEvent(event.id, { when: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`whenapprox-${event.id}`}>
                          Or Approximate Timeframe
                        </Label>
                        <Input
                          id={`whenapprox-${event.id}`}
                          placeholder="e.g., Summer 2007, March-May 2008"
                          value={event.whenApproximate}
                          onChange={(e) => updateEvent(event.id, { whenApproximate: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* WHERE */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`where-${event.id}`} className="flex items-center gap-2">
                          <Badge className="bg-primary text-xs">WHERE</Badge>
                          Location
                        </Label>
                        <Input
                          id={`where-${event.id}`}
                          placeholder="Base, FOB, city, region, country"
                          value={event.where}
                          onChange={(e) => updateEvent(event.id, { where: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`unit-${event.id}`}>Unit</Label>
                        <Input
                          id={`unit-${event.id}`}
                          placeholder="Your unit at the time"
                          value={event.unit}
                          onChange={(e) => updateEvent(event.id, { unit: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-2">
                      <Label htmlFor={`details-${event.id}`}>Additional Details</Label>
                      <Textarea
                        id={`details-${event.id}`}
                        placeholder="Your role, immediate aftermath, how it affected you..."
                        value={event.details}
                        onChange={(e) => updateEvent(event.id, { details: e.target.value })}
                        rows={3}
                      />
                    </div>

                    {/* Witnesses */}
                    <div className="space-y-2">
                      <Label htmlFor={`witnesses-${event.id}`}>Witnesses or Others Present</Label>
                      <Textarea
                        id={`witnesses-${event.id}`}
                        placeholder="Names of others who witnessed the event (if known)"
                        value={event.witnesses}
                        onChange={(e) => updateEvent(event.id, { witnesses: e.target.value })}
                        rows={2}
                      />
                    </div>

                    {/* AI Structure Assistance */}
                    <div className="space-y-3 pt-2 border-t">
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                        <Heart className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">
                          Take breaks if you need to. Your wellbeing matters more than any claim.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAIStructure(event.id)}
                        disabled={!event.what.trim() || aiLoading}
                        className="w-full border-primary/30 text-primary hover:bg-primary/5"
                      >
                        {aiLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4 mr-2" />
                        )}
                        {aiLoading ? 'Structuring...' : 'Help Me Structure This'}
                      </Button>

                      {aiSafetyBlocked[event.id] && (
                        <Alert className="border-[#D6B25E]/30 bg-[#D6B25E]/5">
                          <Info className="h-4 w-4 text-[#D6B25E]" />
                          <AlertDescription className="text-sm">
                            Our AI was unable to process this content. You can continue writing your statement manually, and it will be just as valid. Consider working with a VSO for additional support.
                          </AlertDescription>
                        </Alert>
                      )}

                      {aiError && !aiLoading && !aiSafetyBlocked[event.id] && (
                        <Alert className="border-warning/30 bg-warning/5">
                          <AlertTriangle className="h-4 w-4 text-warning" />
                          <AlertDescription className="text-sm">{aiError}</AlertDescription>
                        </Alert>
                      )}

                      {aiStructured[event.id] && (
                        <div className="space-y-2">
                          <AIDisclaimer variant="banner" />
                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-sm whitespace-pre-wrap max-h-[250px] overflow-y-auto">
                            {aiStructured[event.id]}
                          </div>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteEvent(event.id)}
                      className="mt-2"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Event
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Preview & Actions */}
      {events.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Statement Preview</CardTitle>
                <CardDescription>Review your formatted stressor statement</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                {events.length} event{events.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30 border font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto">
              {generateStatement()}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCopy} className="flex-1" variant="outline">
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy Statement'}
              </Button>
              <Button onClick={handleDownload} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tips for Effective Stressor Statements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="p-3 rounded-lg border bg-muted/30">
              <p className="text-sm font-medium mb-1">Be Specific on Location</p>
              <p className="text-xs text-muted-foreground">
                Include base name, FOB, grid coordinates if known, country, and region. The more specific, the easier for VA to verify.
              </p>
            </div>
            <div className="p-3 rounded-lg border bg-muted/30">
              <p className="text-sm font-medium mb-1">60-Day Window for Dates</p>
              <p className="text-xs text-muted-foreground">
                The VA can search records within a 60-day window. "Mid-March 2008" is better than "sometime in 2008."
              </p>
            </div>
            <div className="p-3 rounded-lg border bg-muted/30">
              <p className="text-sm font-medium mb-1">Combat Veterans</p>
              <p className="text-xs text-muted-foreground">
                If you have a Combat Action Ribbon/Badge, the VA is more likely to accept your statement without additional verification.
              </p>
            </div>
            <div className="p-3 rounded-lg border bg-muted/30">
              <p className="text-sm font-medium mb-1">Non-Combat Stressors</p>
              <p className="text-xs text-muted-foreground">
                MST, accidents, and other non-combat trauma are valid. Include any documentation like incident reports.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
        <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
        <div className="text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Sensitive Information</p>
          <p>This statement may contain sensitive personal information. Your data is stored locally on your device. Some veterans find it helpful to work with a VSO or mental health professional for support, though you can complete this independently.</p>
        </div>
      </div>
    </div>
  );
}
