import { useState } from 'react';
import { FileText, Download, Copy, Users, CheckCircle2, AlertTriangle, HelpCircle, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

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

interface AssessmentState {
  hasRecordsDocumented: 'yes' | 'no' | 'unsure' | null;
  hasNexusLetter: 'yes' | 'no' | 'unsure' | null;
}

export function BuddyStatementGenerator() {
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
  const [showGuidance, setShowGuidance] = useState(false);
  const { toast } = useToast();

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

  const downloadPDF = () => {
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

  const resetForm = () => {
    setFormData({
      witnessName: '',
      relationship: '',
      timePeriod: '',
      statement: '',
    });
  };

  return (
    <div className="space-y-6">
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
