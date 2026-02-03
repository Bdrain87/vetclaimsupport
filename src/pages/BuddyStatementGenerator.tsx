import { useState } from 'react';
import {
  FileText,
  Copy,
  Download,
  Check,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface StatementData {
  witnessName: string;
  witnessRelationship: string;
  veteranName: string;
  howKnown: string;
  datesKnown: string;
  conditionWitnessed: string;
  specificObservations: string;
  impactOnLife: string;
  frequencyWitnessed: string;
  additionalDetails: string;
  witnessContact: string;
  willingToTestify: string;
}

const initialData: StatementData = {
  witnessName: '',
  witnessRelationship: '',
  veteranName: '',
  howKnown: '',
  datesKnown: '',
  conditionWitnessed: '',
  specificObservations: '',
  impactOnLife: '',
  frequencyWitnessed: '',
  additionalDetails: '',
  witnessContact: '',
  willingToTestify: 'yes',
};

const steps = [
  { id: 1, title: 'Witness Info', description: 'Who is writing this statement?' },
  { id: 2, title: 'Relationship', description: 'How do you know the veteran?' },
  { id: 3, title: 'Observations', description: 'What have you witnessed?' },
  { id: 4, title: 'Impact', description: 'How has this affected the veteran?' },
  { id: 5, title: 'Review', description: 'Review and export' },
];

export default function BuddyStatementGenerator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<StatementData>(initialData);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const updateField = (field: keyof StatementData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const generateStatement = (): string => {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `BUDDY/LAY STATEMENT

Date: ${today}

RE: Statement in Support of Claim for ${data.veteranName}

I, ${data.witnessName}, am providing this statement in support of the VA disability claim for ${data.veteranName}.

RELATIONSHIP TO VETERAN:
I am the veteran's ${data.witnessRelationship}. ${data.howKnown}

I have known ${data.veteranName} ${data.datesKnown}.

OBSERVATIONS:
${data.conditionWitnessed ? `I have personally witnessed ${data.veteranName} experiencing ${data.conditionWitnessed}.` : ''}

${data.specificObservations}

FREQUENCY:
${data.frequencyWitnessed}

IMPACT ON DAILY LIFE:
${data.impactOnLife}

${data.additionalDetails ? `ADDITIONAL INFORMATION:\n${data.additionalDetails}` : ''}

CERTIFICATION:
I certify that the statements made herein are true and correct to the best of my knowledge and belief. I understand that making false statements is punishable by law.

${data.willingToTestify === 'yes' ? 'I am willing to provide additional testimony if needed.\n' : ''}
Contact Information: ${data.witnessContact}

_______________________________
${data.witnessName}
Date: ${today}`;
  };

  const copyToClipboard = async () => {
    const statement = generateStatement();
    await navigator.clipboard.writeText(statement);
    setCopied(true);
    toast({ title: 'Copied to clipboard', description: 'Statement has been copied.' });
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsText = () => {
    const statement = generateStatement();
    const blob = new Blob([statement], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `buddy-statement-${data.witnessName.replace(/\s+/g, '-').toLowerCase() || 'draft'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: 'Downloaded', description: 'Statement saved as text file.' });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="witnessName">Full Legal Name</Label>
              <Input
                id="witnessName"
                placeholder="Enter your full name"
                value={data.witnessName}
                onChange={(e) => updateField('witnessName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="witnessContact">Contact Information</Label>
              <Input
                id="witnessContact"
                placeholder="Phone or email"
                value={data.witnessContact}
                onChange={(e) => updateField('witnessContact', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="veteranName">Veteran's Name</Label>
              <Input
                id="veteranName"
                placeholder="Enter veteran's full name"
                value={data.veteranName}
                onChange={(e) => updateField('veteranName', e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship to Veteran</Label>
              <Select
                value={data.witnessRelationship}
                onValueChange={(value) => updateField('witnessRelationship', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="fellow service member">Fellow Service Member</SelectItem>
                  <SelectItem value="supervisor">Supervisor/Commander</SelectItem>
                  <SelectItem value="coworker">Coworker</SelectItem>
                  <SelectItem value="neighbor">Neighbor</SelectItem>
                  <SelectItem value="caregiver">Caregiver</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="howKnown">How do you know the veteran?</Label>
              <Textarea
                id="howKnown"
                placeholder="e.g., We served together at Fort Bragg from 2010-2012..."
                value={data.howKnown}
                onChange={(e) => updateField('howKnown', e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="datesKnown">How long have you known them?</Label>
              <Input
                id="datesKnown"
                placeholder="e.g., since 2010 (over 13 years)"
                value={data.datesKnown}
                onChange={(e) => updateField('datesKnown', e.target.value)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="conditionWitnessed">What condition or symptoms have you witnessed?</Label>
              <Input
                id="conditionWitnessed"
                placeholder="e.g., back pain, PTSD symptoms, hearing difficulties"
                value={data.conditionWitnessed}
                onChange={(e) => updateField('conditionWitnessed', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specificObservations">Describe specific observations</Label>
              <Textarea
                id="specificObservations"
                placeholder="Be specific: What did you see? When? Where? Include dates if possible..."
                value={data.specificObservations}
                onChange={(e) => updateField('specificObservations', e.target.value)}
                rows={5}
              />
              <p className="text-xs text-muted-foreground">
                Tip: Include specific examples with dates when possible
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequencyWitnessed">How often have you witnessed this?</Label>
              <Textarea
                id="frequencyWitnessed"
                placeholder="e.g., I see the veteran weekly and have observed these symptoms consistently over the past 5 years..."
                value={data.frequencyWitnessed}
                onChange={(e) => updateField('frequencyWitnessed', e.target.value)}
                rows={2}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="impactOnLife">How has this condition impacted the veteran's life?</Label>
              <Textarea
                id="impactOnLife"
                placeholder="Describe how this affects their work, relationships, daily activities..."
                value={data.impactOnLife}
                onChange={(e) => updateField('impactOnLife', e.target.value)}
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalDetails">Additional details (optional)</Label>
              <Textarea
                id="additionalDetails"
                placeholder="Any other relevant information..."
                value={data.additionalDetails}
                onChange={(e) => updateField('additionalDetails', e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Would you be willing to provide additional testimony if needed?</Label>
              <Select
                value={data.willingToTestify}
                onValueChange={(value) => updateField('willingToTestify', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <pre className="whitespace-pre-wrap text-sm font-mono text-foreground overflow-auto max-h-96">
                  {generateStatement()}
                </pre>
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} className="flex-1 gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </Button>
              <Button variant="outline" onClick={downloadAsText} className="flex-1 gap-2">
                <Download className="h-4 w-4" />
                Download as Text
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Buddy Statement Generator</h1>
          <p className="text-muted-foreground">Create a formatted lay statement for your claim</p>
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/30">
        <CardContent className="pt-6 flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">What is a Buddy Statement?</p>
            <p>
              A buddy/lay statement is a written statement from someone who has personally witnessed
              your condition or its effects. These statements can provide crucial evidence for your
              VA disability claim.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Progress Steps */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex flex-col items-center ${
                step.id === currentStep
                  ? 'text-primary'
                  : step.id < currentStep
                  ? 'text-success'
                  : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : step.id < currentStep
                    ? 'bg-success text-success-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.id < currentStep ? '✓' : step.id}
              </div>
              <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-8 sm:w-16 h-0.5 mx-1 ${
                  step.id < currentStep ? 'bg-success' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))}
          disabled={currentStep === steps.length}
          className="gap-2"
        >
          {currentStep === steps.length - 1 ? 'Review' : 'Next'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
