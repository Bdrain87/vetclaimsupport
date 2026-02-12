import { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export function PersonalStatementTab() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    conditionName: '',
    dateOfOnset: '',
    inServiceEvent: '',
    symptomsProgression: '',
    currentFrequency: '',
    dailyLifeImpact: '',
    workImpact: '',
  });

  const generateStatement = () => {
    const parts = [];
    
    parts.push(`PERSONAL STATEMENT IN SUPPORT OF CLAIM`);
    parts.push(`Condition: ${formData.conditionName || '[Condition Name]'}`);
    parts.push('');
    
    if (formData.dateOfOnset) {
      parts.push(`DATE OF ONSET:`);
      parts.push(`My ${formData.conditionName || 'condition'} began on or around ${formData.dateOfOnset}.`);
      parts.push('');
    }
    
    if (formData.inServiceEvent) {
      parts.push(`IN-SERVICE EVENT/CAUSE:`);
      parts.push(formData.inServiceEvent);
      parts.push('');
    }
    
    if (formData.symptomsProgression) {
      parts.push(`PROGRESSION OF SYMPTOMS:`);
      parts.push(formData.symptomsProgression);
      parts.push('');
    }
    
    if (formData.currentFrequency) {
      parts.push(`CURRENT FREQUENCY AND SEVERITY:`);
      parts.push(formData.currentFrequency);
      parts.push('');
    }
    
    if (formData.dailyLifeImpact) {
      parts.push(`IMPACT ON DAILY LIFE:`);
      parts.push(formData.dailyLifeImpact);
      parts.push('');
    }
    
    if (formData.workImpact) {
      parts.push(`IMPACT ON WORK/EMPLOYMENT:`);
      parts.push(formData.workImpact);
      parts.push('');
    }
    
    parts.push('---');
    parts.push('I certify that the statements made herein are true and correct to the best of my knowledge and belief.');
    parts.push('');
    parts.push('Signature: _________________________');
    parts.push('Date: _________________________');
    parts.push('Printed Name: _________________________');
    
    return parts.join('\n');
  };

  const handleCopy = async () => {
    const statement = generateStatement();
    try {
      await navigator.clipboard.writeText(statement);
      setCopied(true);
      toast({
        title: 'Copied to Clipboard',
        description: 'Your personal statement has been copied.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Copy failed', description: 'Unable to access clipboard.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="data-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            Personal Statement Template
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            A personal statement (also called a "lay statement") describes your condition in your own words. 
            Fill out the sections below, then copy the generated statement to submit with your claim.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="conditionName">Condition Name *</Label>
            <Input
              id="conditionName"
              placeholder="e.g., Tinnitus, Lower Back Pain, PTSD"
              value={formData.conditionName}
              onChange={(e) => setFormData({ ...formData, conditionName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfOnset">Date of Onset</Label>
            <Input
              id="dateOfOnset"
              placeholder="e.g., March 2019, during deployment to Afghanistan"
              value={formData.dateOfOnset}
              onChange={(e) => setFormData({ ...formData, dateOfOnset: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">When did you first notice symptoms?</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inServiceEvent">In-Service Event That Caused It</Label>
            <Textarea
              id="inServiceEvent"
              placeholder="Describe what happened during service that caused or contributed to your condition. Be specific about dates, locations, and circumstances."
              value={formData.inServiceEvent}
              onChange={(e) => setFormData({ ...formData, inServiceEvent: e.target.value })}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Examples: exposure to loud noise, combat trauma, physical injury, toxic exposure
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="symptomsProgression">How Symptoms Have Progressed</Label>
            <Textarea
              id="symptomsProgression"
              placeholder="Describe how your symptoms have changed over time. Have they gotten worse? More frequent? Spread to other areas?"
              value={formData.symptomsProgression}
              onChange={(e) => setFormData({ ...formData, symptomsProgression: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentFrequency">Current Frequency and Severity</Label>
            <Textarea
              id="currentFrequency"
              placeholder="How often do you experience symptoms now? Daily? Weekly? How severe are they on a scale of 1-10? Describe your worst days."
              value={formData.currentFrequency}
              onChange={(e) => setFormData({ ...formData, currentFrequency: e.target.value })}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Be specific: "I experience severe back pain (8/10) daily that prevents me from sitting for more than 30 minutes"
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dailyLifeImpact">Impact on Daily Life</Label>
            <Textarea
              id="dailyLifeImpact"
              placeholder="How does this condition affect your daily activities? Sleep? Relationships? Hobbies? Self-care?"
              value={formData.dailyLifeImpact}
              onChange={(e) => setFormData({ ...formData, dailyLifeImpact: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workImpact">Impact on Work/Employment</Label>
            <Textarea
              id="workImpact"
              placeholder="How does this condition affect your ability to work? Have you missed work? Changed jobs? Unable to perform certain tasks?"
              value={formData.workImpact}
              onChange={(e) => setFormData({ ...formData, workImpact: e.target.value })}
              rows={3}
            />
          </div>

          <div className="pt-4 border-t">
            <Button onClick={handleCopy} className="w-full gap-2" size="lg">
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Statement to Clipboard
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="data-card">
        <CardHeader>
          <CardTitle className="text-base">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm whitespace-pre-wrap bg-muted/50 p-4 rounded-lg border font-mono text-foreground/80">
            {generateStatement()}
          </pre>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="data-card bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-base text-primary">Tips for a Strong Personal Statement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-foreground/80">
          <p>• <strong>Be specific:</strong> Use dates, locations, and measurable details</p>
          <p>• <strong>Describe your worst days:</strong> The VA rates based on your most severe symptoms</p>
          <p>• <strong>Connect to service:</strong> Clearly explain how your condition relates to your military service</p>
          <p>• <strong>Focus on impact:</strong> Explain how the condition affects your daily life and work</p>
          <p>• <strong>Be honest:</strong> Don't exaggerate, but don't minimize either</p>
        </CardContent>
      </Card>
    </div>
  );
}
