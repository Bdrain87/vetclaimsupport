import { useState, useMemo } from 'react';
import { FileText, Download, Copy, Users, CheckCircle2, AlertTriangle, HelpCircle, ChevronDown, Share2, MessageSquare, Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { useClaims } from '@/hooks/useClaims';
import { useProfileStore } from '@/store/useProfileStore';
import { useAIGenerate } from '@/hooks/useAIGenerate';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';

const relationshipOptions = [
  { value: 'fellow-service-member', label: 'Fellow Service Member' },
  { value: 'supervisor', label: 'Supervisor/Commander' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'family-member', label: 'Family Member' },
  { value: 'friend', label: 'Friend' },
  { value: 'coworker', label: 'Coworker' },
  { value: 'medical-professional', label: 'Medical Professional' },
];

interface FormData {
  witnessName: string;
  relationship: string;
  timePeriod: string;
  statement: string;
}

interface WitnessTemplateData {
  veteranName: string;
  conditionName: string;
  serviceDates: string;
  witnessType: string;
}

interface AssessmentState {
  hasRecordsDocumented: 'yes' | 'no' | 'unsure' | null;
  hasNexusLetter: 'yes' | 'no' | 'unsure' | null;
}

export function BuddyStatementGenerator() {
  const { data } = useClaims();
  const profile = useProfileStore();
  const veteranFullName = `${profile.firstName} ${profile.lastName}`.trim();

  // Pre-fill condition name from user's tracked conditions
  const primaryConditionName = useMemo(() => {
    const conditions = data.claimConditions || [];
    return conditions.length > 0 ? conditions[0].name : '';
  }, [data.claimConditions]);

  // Pre-fill service dates from profile
  const serviceDatesText = useMemo(() => {
    if (profile.serviceDates?.start && profile.serviceDates?.end) {
      const start = new Date(profile.serviceDates.start);
      const end = new Date(profile.serviceDates.end);
      return `${start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    }
    return '';
  }, [profile.serviceDates]);

  const [formData, setFormData] = useState<FormData>({
    witnessName: '',
    relationship: '',
    timePeriod: '',
    statement: '',
  });
  const [assessment, setAssessment] = useState<AssessmentState>({
    hasRecordsDocumented: null,
    hasNexusLetter: null,
  });
  const [witnessTemplate, setWitnessTemplate] = useState<WitnessTemplateData>({
    veteranName: veteranFullName,
    conditionName: primaryConditionName,
    serviceDates: serviceDatesText,
    witnessType: 'service-member',
  });
  const [showGuidance, setShowGuidance] = useState(false);
  const [showWitnessTemplate, setShowWitnessTemplate] = useState(false);
  const { toast } = useToast();
  const { generate: aiGenerate, isLoading: aiLoading, error: aiError } = useAIGenerate('VA_SPEAK_TRANSLATOR');
  const [aiDraft, setAiDraft] = useState<string | null>(null);

  // Determine if buddy letters are needed based on assessment
  const getAssessmentResult = () => {
    const { hasRecordsDocumented, hasNexusLetter } = assessment;
    
    if (hasRecordsDocumented === null || hasNexusLetter === null) {
      return 'incomplete';
    }
    
    if (hasRecordsDocumented === 'yes' && hasNexusLetter === 'yes') {
      return 'optional';
    }
    
    return 'recommended';
  };

  const assessmentResult = getAssessmentResult();

  const generateStatementText = () => {
    const relationshipLabel = relationshipOptions.find(r => r.value === formData.relationship)?.label || formData.relationship;
    
    return `BUDDY/LAY STATEMENT
===============================================

Statement Provided By:
Name: ${formData.witnessName || '[Witness Name]'}
Relationship to Veteran: ${relationshipLabel || '[Relationship]'}
Time Period Known: ${formData.timePeriod || '[Time Period]'}

STATEMENT
---------
${formData.statement || '[Statement details...]'}

CERTIFICATION
-------------
I certify that the above statements are true and correct to the best of my knowledge and belief. I understand that making false statements is punishable by law.

Signature: _________________________
Date: _________________________
Contact Information: _________________________
`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateStatementText());
    toast({
      title: 'Copied to Clipboard',
      description: 'The statement has been copied.',
    });
  };

  const downloadPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const relationshipLabel = relationshipOptions.find(r => r.value === formData.relationship)?.label || formData.relationship;
    
    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('BUDDY/LAY STATEMENT', 105, 20, { align: 'center' });
    
    doc.setDrawColor(0);
    doc.line(20, 25, 190, 25);
    
    let yPos = 35;
    
    // Statement Info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Statement Provided By:', 20, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${formData.witnessName || '[Witness Name]'}`, 20, yPos);
    yPos += 6;
    doc.text(`Relationship to Veteran: ${relationshipLabel || '[Relationship]'}`, 20, yPos);
    yPos += 6;
    doc.text(`Time Period Known: ${formData.timePeriod || '[Time Period]'}`, 20, yPos);
    yPos += 12;
    
    // Statement Section
    doc.setFont('helvetica', 'bold');
    doc.text('STATEMENT', 20, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'normal');
    const statementText = formData.statement || '[Statement details...]';
    const splitStatement = doc.splitTextToSize(statementText, 170);
    doc.text(splitStatement, 20, yPos);
    yPos += splitStatement.length * 6 + 12;
    
    // Certification
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATION', 20, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'normal');
    const certText = 'I certify that the above statements are true and correct to the best of my knowledge and belief. I understand that making false statements is punishable by law.';
    const splitCert = doc.splitTextToSize(certText, 170);
    doc.text(splitCert, 20, yPos);
    yPos += splitCert.length * 6 + 12;
    
    // Signature lines
    doc.text('Signature: _________________________', 20, yPos);
    yPos += 8;
    doc.text('Date: _________________________', 20, yPos);
    yPos += 8;
    doc.text('Contact Information: _________________________', 20, yPos);
    
    doc.save('Buddy_Statement.pdf');
    
    toast({
      title: 'PDF Downloaded',
      description: 'The statement has been saved as a PDF.',
    });
  };

  const handleAIGenerateDraft = async () => {
    const relationshipLabel = relationshipOptions.find(r => r.value === formData.relationship)?.label || formData.relationship || 'witness';
    const conditionName = witnessTemplate.conditionName || primaryConditionName || 'service-connected condition';

    const prompt = `Generate a buddy statement outline for a VA disability claim. The buddy is a ${relationshipLabel} of the veteran.

VETERAN: ${witnessTemplate.veteranName || 'the veteran'}
CONDITION: ${conditionName}
WITNESS NAME: ${formData.witnessName || '[Witness]'}
TIME PERIOD KNOWN: ${formData.timePeriod || 'several years'}

Create talking points and an outline that the ${relationshipLabel} can use to write their OWN buddy statement. Include:
1. Suggested opening that establishes the relationship
2. Key observations to describe (symptoms witnessed, behavioral changes)
3. Specific examples they should include (what, when, where)
4. How to describe the impact on the veteran's daily life
5. Reminder to use first-person language ("I saw...", "I witnessed...")

IMPORTANT: This is an OUTLINE ONLY. The buddy must write the final statement in their own words based on their actual observations. Do not fabricate specific incidents.`;

    const result = await aiGenerate(prompt);
    if (result) setAiDraft(result);
  };

  const resetForm = () => {
    setFormData({
      witnessName: '',
      relationship: '',
      timePeriod: '',
      statement: '',
    });
  };

  // Generate shareable witness template (first-person, for the witness to fill out)
  const generateWitnessTemplate = () => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const witnessTypeLabel = witnessTemplate.witnessType === 'service-member' 
      ? 'fellow service member' 
      : witnessTemplate.witnessType === 'family' 
        ? 'family member' 
        : 'friend/acquaintance';
    
    return `📝 BUDDY STATEMENT REQUEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi! ${witnessTemplate.veteranName || '[Veteran Name]'} is filing a VA disability claim for ${witnessTemplate.conditionName || '[Condition]'} and needs your help as a witness.

You can HANDWRITE or TYPE your statement - both are accepted by the VA!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ IMPORTANT INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✍️ Write in FIRST PERSON ("I saw...", "I witnessed...")
📅 Include SPECIFIC DATES when possible (month/year at minimum)
🔍 Be SPECIFIC - describe exactly what you observed
📍 Include LOCATIONS where events occurred

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❓ QUESTIONS TO ANSWER IN YOUR STATEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. What is your relationship to ${witnessTemplate.veteranName || 'the veteran'}?
2. How long have you known them? (Include dates)
3. What symptoms or behaviors have you personally witnessed?
4. WHEN did you observe these? (Be as specific as possible with dates)
5. WHERE did this happen? (Location, setting)
6. How has this affected their daily life, work, or relationships?
7. How have things changed over time?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 STATEMENT TEMPLATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BUDDY/LAY STATEMENT

My name is [YOUR FULL NAME] and I am a ${witnessTypeLabel} of ${witnessTemplate.veteranName || '[Veteran Name]'}.

I have known ${witnessTemplate.veteranName || '[Veteran Name]'} since [MONTH AND YEAR - e.g., "March 2015"].

${witnessTemplate.witnessType === 'service-member' ? `We served together at [UNIT/BASE NAME] from [START MONTH/YEAR] to [END MONTH/YEAR].

During our service together, I personally witnessed the following:
• On [DATE], at [LOCATION], I saw [DESCRIBE SPECIFIC INCIDENT]
• I observed [SPECIFIC SYMPTOMS] occurring [HOW OFTEN]
• [DESCRIBE ANY INJURIES OR EXPOSURES YOU WITNESSED]

` : ''}I have personally observed ${witnessTemplate.veteranName || '[Veteran Name]'}'s ${witnessTemplate.conditionName || '[Condition]'} affect their daily life in the following ways:

WHAT I OBSERVED:
• I have witnessed [DESCRIBE SPECIFIC SYMPTOMS - pain, difficulty walking, mood changes, nightmares, etc.]
• These symptoms occur [HOW OFTEN - daily, weekly, during certain situations]

SPECIFIC EXAMPLES (include dates):
• On [DATE/TIME PERIOD], I observed [WHAT HAPPENED - be specific]
• In [MONTH/YEAR], I noticed [SPECIFIC CHANGE OR INCIDENT]
• During [EVENT/VISIT], they were unable to [SPECIFIC ACTIVITY]

IMPACT ON DAILY LIFE:
• They can no longer [ACTIVITIES THEY USED TO DO]
• I have seen them struggle with [DAILY TASKS]
• Their [WORK/RELATIONSHIPS/SLEEP] has been affected by [HOW]

${witnessTemplate.serviceDates ? `${witnessTemplate.veteranName || 'The veteran'} served in the military from ${witnessTemplate.serviceDates}.` : ''}

I certify that the statements above are true and correct to the best of my knowledge and belief. I understand that making false statements is punishable by law.

Signature: _________________________
Printed Name: _________________________
Date: ${today}
Phone/Email: _________________________
Address: _________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ TIPS FOR A STRONG STATEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✍️ FIRST PERSON: Write "I saw him limping" not "He limps"
📅 DATES MATTER: "In June 2022" is better than "a while ago"  
🔍 BE SPECIFIC: "He couldn't lift his arm above his shoulder" is better than "he had arm problems"
👁️ PERSONAL OBSERVATION: Only describe what YOU witnessed, not what you were told
❌ NO DIAGNOSES: Don't say "He has PTSD" - instead say "I witnessed him having nightmares and panic attacks"
📝 SIGN & DATE: Your signature and the date are required
📞 CONTACT INFO: Include your phone/email so VA can verify if needed

Thank you for taking the time to help! Your statement could make a real difference in ${witnessTemplate.veteranName || 'their'}'s claim.`;
  };

  const copyWitnessTemplate = async () => {
    const text = generateWitnessTemplate();
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied to Clipboard!',
        description: 'Template is ready to paste in a text message or email.',
      });
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      toast({
        title: 'Copied!',
        description: 'Template copied to clipboard.',
      });
    }
  };

  const shareWitnessTemplate = async () => {
    const text = generateWitnessTemplate();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Buddy Statement Request',
          text: text,
        });
      } catch {
        copyWitnessTemplate();
      }
    } else {
      copyWitnessTemplate();
    }
  };

  return (
    <div className="space-y-6">
      {/* CRITICAL: Fraud Warning */}
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">Important: Buddy Statements Must Be Written By OTHERS</p>
              <p className="text-sm text-muted-foreground mt-1">
                Buddy/lay statements must be written by <strong>someone other than the veteran</strong> — such as 
                fellow service members, family, friends, or coworkers who personally witnessed the veteran's 
                condition or its effects. <strong>Writing your own buddy statement is fraudulent</strong> and 
                could result in denial of your claim and legal consequences.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Use this tool to help your witnesses create their statements, or share the template with them.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Smart Assessment Card */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Do You Need Buddy Letters?</CardTitle>
              <CardDescription>Quick assessment to see if buddy statements will help your claim</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Question 1 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Do your medical records document when your condition started?
            </Label>
            <RadioGroup
              value={assessment.hasRecordsDocumented || ''}
              onValueChange={(value) => setAssessment(prev => ({ 
                ...prev, 
                hasRecordsDocumented: value as 'yes' | 'no' | 'unsure' 
              }))}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="records-yes" />
                <Label htmlFor="records-yes" className="text-sm font-normal cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="records-no" />
                <Label htmlFor="records-no" className="text-sm font-normal cursor-pointer">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unsure" id="records-unsure" />
                <Label htmlFor="records-unsure" className="text-sm font-normal cursor-pointer">Not sure</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Question 2 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Do you have a medical nexus letter linking your condition to service?
            </Label>
            <RadioGroup
              value={assessment.hasNexusLetter || ''}
              onValueChange={(value) => setAssessment(prev => ({ 
                ...prev, 
                hasNexusLetter: value as 'yes' | 'no' | 'unsure' 
              }))}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="nexus-yes" />
                <Label htmlFor="nexus-yes" className="text-sm font-normal cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="nexus-no" />
                <Label htmlFor="nexus-no" className="text-sm font-normal cursor-pointer">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unsure" id="nexus-unsure" />
                <Label htmlFor="nexus-unsure" className="text-sm font-normal cursor-pointer">Not sure</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Assessment Result */}
          {assessmentResult !== 'incomplete' && (
            <div className={`p-4 rounded-lg border ${
              assessmentResult === 'optional' 
                ? 'bg-success/5 border-success/30' 
                : 'bg-warning/5 border-warning/30'
            }`}>
              {assessmentResult === 'optional' ? (
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-success">Your documentation appears sufficient</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      With clear medical records and a nexus letter, buddy statements are <strong>optional</strong>. 
                      They can still add value but aren't critical for your claim.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-warning">Buddy letters could strengthen your claim</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Lay statements from people who witnessed your condition or its effects can help 
                      fill gaps in documentation and establish service connection.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* When Buddy Letters Help - Collapsible */}
          <Collapsible open={showGuidance} onOpenChange={setShowGuidance}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
                <span className="text-sm text-primary">When are buddy letters needed?</span>
                <ChevronDown className={`h-4 w-4 text-primary transition-transform ${showGuidance ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
                  <p className="font-medium text-sm text-warning mb-2">✓ Buddy Letters ARE Helpful When:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Records don't show when condition started</li>
                    <li>• No medical treatment during service</li>
                    <li>• Need to prove continuous symptoms</li>
                    <li>• Unclear connection to service</li>
                    <li>• Documenting stressor events (PTSD)</li>
                    <li>• Showing impact on daily life</li>
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                  <p className="font-medium text-sm text-success mb-2">✗ Buddy Letters Less Critical When:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Strong nexus letter from doctor</li>
                    <li>• Clear service treatment records</li>
                    <li>• Presumptive condition (PACT Act)</li>
                    <li>• Condition diagnosed during service</li>
                    <li>• VA already acknowledged connection</li>
                    <li>• Increase claim with recent medical records</li>
                  </ul>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Share Template with Witness Card */}
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Share Template with Witness</CardTitle>
              <CardDescription>Send a first-person template they can handwrite or type</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Fill in your info below, then copy and send the template to your witness via text or email. 
            They can handwrite or type their statement using the template.
          </p>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="veteranName">Your Name (Veteran)</Label>
              <Input
                id="veteranName"
                placeholder="Your full name"
                value={witnessTemplate.veteranName}
                onChange={(e) => setWitnessTemplate(prev => ({ ...prev, veteranName: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="conditionName">Condition Name</Label>
              <Input
                id="conditionName"
                placeholder="e.g., PTSD, Lower Back Pain"
                value={witnessTemplate.conditionName}
                onChange={(e) => setWitnessTemplate(prev => ({ ...prev, conditionName: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="serviceDates">Your Service Dates (Optional)</Label>
              <Input
                id="serviceDates"
                placeholder="e.g., June 2010 - August 2018"
                value={witnessTemplate.serviceDates}
                onChange={(e) => setWitnessTemplate(prev => ({ ...prev, serviceDates: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="witnessType">Witness Type</Label>
              <Select
                value={witnessTemplate.witnessType}
                onValueChange={(value) => setWitnessTemplate(prev => ({ ...prev, witnessType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="service-member">Fellow Service Member</SelectItem>
                  <SelectItem value="family">Family Member</SelectItem>
                  <SelectItem value="friend">Friend/Acquaintance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview Toggle */}
          <Collapsible open={showWitnessTemplate} onOpenChange={setShowWitnessTemplate}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between px-3 py-2 h-auto bg-muted/50 hover:bg-muted">
                <span className="text-sm font-medium">Preview Template</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showWitnessTemplate ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="p-4 bg-background border rounded-lg max-h-64 overflow-y-auto">
                <pre className="text-xs whitespace-pre-wrap font-mono text-muted-foreground">
                  {generateWitnessTemplate()}
                </pre>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={copyWitnessTemplate} className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Copy Template to Send
            </Button>
            <Button onClick={shareWitnessTemplate} variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            📱 Paste into any text message or email app to send to your witness
          </p>
        </CardContent>
      </Card>

      {/* Statement Generator Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Buddy Statement Generator</CardTitle>
              <CardDescription>Create supporting statements from witnesses</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="witnessName">Witness Full Name</Label>
              <Input
                id="witnessName"
                placeholder="John Smith"
                value={formData.witnessName}
                onChange={(e) => setFormData(prev => ({ ...prev, witnessName: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship to Veteran</Label>
              <Select
                value={formData.relationship}
                onValueChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {relationshipOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timePeriod">Time Period Known</Label>
            <Input
              id="timePeriod"
              placeholder="e.g., January 2018 - Present, or 5 years"
              value={formData.timePeriod}
              onChange={(e) => setFormData(prev => ({ ...prev, timePeriod: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="statement">Statement</Label>
            <Textarea
              id="statement"
              placeholder="Describe what you witnessed, specific incidents, symptoms observed, and how the condition affects the veteran's daily life..."
              value={formData.statement}
              onChange={(e) => setFormData(prev => ({ ...prev, statement: e.target.value }))}
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              Include specific examples, dates if possible, and describe the impact on daily activities.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={downloadPDF} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={copyToClipboard} variant="outline" className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Copy Text
            </Button>
            <Button onClick={resetForm} variant="ghost">
              Reset
            </Button>
          </div>

          {/* AI Draft Generation */}
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={handleAIGenerateDraft}
              disabled={aiLoading}
              className="w-full border-primary/30 text-primary hover:bg-primary/5"
            >
              {aiLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {aiLoading ? 'Generating Outline...' : 'Generate AI Draft Outline'}
            </Button>

            {aiError && !aiLoading && (
              <Alert className="border-warning/30 bg-warning/5">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-sm">{aiError}</AlertDescription>
              </Alert>
            )}

            {aiDraft && (
              <div className="space-y-3">
                <AIDisclaimer variant="banner" />
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      <strong>Important:</strong> This outline helps your buddy understand what to include. They must write the final statement themselves in their own words based on what they personally observed.
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-background border text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                  {aiDraft}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(aiDraft);
                    toast({
                      title: 'Copied',
                      description: 'AI outline copied to clipboard.',
                    });
                  }}
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy AI Outline
                </Button>
              </div>
            )}
          </div>

          {/* Tips Card */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Tips for Effective Buddy Statements
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
              <li>Be specific about dates, locations, and incidents</li>
              <li>Describe observable symptoms and behaviors</li>
              <li>Explain how the condition affects daily life</li>
              <li>Avoid medical diagnoses - focus on what you witnessed</li>
              <li>Include your contact information for verification</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
