import { useState } from 'react';
import { FileText, Download, Edit3, Users, Heart, Shield, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// Template types
type TemplateType = 'witness' | 'symptoms' | 'character';

interface TemplateField {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea';
}

interface Template {
  id: TemplateType;
  title: string;
  description: string;
  icon: typeof Users;
  fields: TemplateField[];
  generateContent: (values: Record<string, string>) => string;
}

const templates: Template[] = [
  {
    id: 'witness',
    title: 'Witness Statement',
    description: 'For someone who witnessed an injury or incident during service',
    icon: Shield,
    fields: [
      { id: 'witnessName', label: 'Your Full Name', placeholder: 'John Smith', type: 'text' },
      { id: 'witnessRank', label: 'Rank (if applicable)', placeholder: 'SSgt', type: 'text' },
      { id: 'relationship', label: 'Relationship to Veteran', placeholder: 'Fellow airman, same squadron', type: 'text' },
      { id: 'dateRange', label: 'When did you serve together?', placeholder: 'Jan 2018 - Dec 2020', type: 'text' },
      { id: 'incident', label: 'Describe the incident you witnessed', placeholder: 'Describe what happened, where, when...', type: 'textarea' },
      { id: 'details', label: 'Additional details', placeholder: 'Any other relevant information...', type: 'textarea' },
    ],
    generateContent: (values) => `BUDDY/LAY STATEMENT - WITNESS TO INCIDENT
===============================================

Statement Provided By:
Name: ${values.witnessName || '[Your Name]'}
${values.witnessRank ? `Rank: ${values.witnessRank}` : ''}
Relationship to Veteran: ${values.relationship || '[Your relationship]'}
Period of Service Together: ${values.dateRange || '[Date range]'}

INCIDENT WITNESSED
------------------
${values.incident || '[Describe the incident in detail]'}

ADDITIONAL DETAILS
------------------
${values.details || '[Any additional relevant information]'}

CERTIFICATION
-------------
I certify that the above statements are true and correct to the best of my knowledge and belief. I understand that making false statements is punishable by law.

Signature: _________________________
Date: _________________________
Contact: _________________________
`,
  },
  {
    id: 'symptoms',
    title: 'Ongoing Symptoms Statement',
    description: 'For someone who has observed the veteran\'s ongoing symptoms',
    icon: Heart,
    fields: [
      { id: 'witnessName', label: 'Your Full Name', placeholder: 'Jane Doe', type: 'text' },
      { id: 'relationship', label: 'Relationship to Veteran', placeholder: 'Spouse, friend, coworker, etc.', type: 'text' },
      { id: 'knowingSince', label: 'How long have you known the veteran?', placeholder: '5 years', type: 'text' },
      { id: 'symptoms', label: 'What symptoms have you observed?', placeholder: 'Describe the symptoms you\'ve witnessed...', type: 'textarea' },
      { id: 'frequency', label: 'How often do these symptoms occur?', placeholder: 'Daily, weekly, during certain activities...', type: 'text' },
      { id: 'impact', label: 'How do these symptoms affect their daily life?', placeholder: 'Impact on work, relationships, hobbies...', type: 'textarea' },
      { id: 'examples', label: 'Specific examples you\'ve witnessed', placeholder: 'Describe specific incidents or examples...', type: 'textarea' },
    ],
    generateContent: (values) => `BUDDY/LAY STATEMENT - ONGOING SYMPTOMS
==========================================

Statement Provided By:
Name: ${values.witnessName || '[Your Name]'}
Relationship to Veteran: ${values.relationship || '[Your relationship]'}
Known the Veteran Since: ${values.knowingSince || '[Time period]'}

SYMPTOMS OBSERVED
-----------------
${values.symptoms || '[Describe observed symptoms]'}

FREQUENCY
---------
${values.frequency || '[How often symptoms occur]'}

IMPACT ON DAILY LIFE
--------------------
${values.impact || '[Describe the impact on daily activities]'}

SPECIFIC EXAMPLES
-----------------
${values.examples || '[Provide specific examples]'}

CERTIFICATION
-------------
I certify that the above statements are true and correct to the best of my knowledge and belief. I have personally observed the veteran's symptoms described above.

Signature: _________________________
Date: _________________________
Contact: _________________________
`,
  },
  {
    id: 'character',
    title: 'Character Statement',
    description: 'A statement attesting to the veteran\'s character and credibility',
    icon: Users,
    fields: [
      { id: 'witnessName', label: 'Your Full Name', placeholder: 'Robert Johnson', type: 'text' },
      { id: 'relationship', label: 'Relationship to Veteran', placeholder: 'Supervisor, mentor, friend', type: 'text' },
      { id: 'knowingSince', label: 'How long have you known the veteran?', placeholder: '10 years', type: 'text' },
      { id: 'character', label: 'Describe the veteran\'s character', placeholder: 'Their integrity, work ethic, reliability...', type: 'textarea' },
      { id: 'service', label: 'Comments on their military service', placeholder: 'Their dedication, performance, sacrifices...', type: 'textarea' },
      { id: 'additional', label: 'Additional comments', placeholder: 'Any other relevant information...', type: 'textarea' },
    ],
    generateContent: (values) => `BUDDY/LAY STATEMENT - CHARACTER REFERENCE
=============================================

Statement Provided By:
Name: ${values.witnessName || '[Your Name]'}
Relationship to Veteran: ${values.relationship || '[Your relationship]'}
Known the Veteran Since: ${values.knowingSince || '[Time period]'}

CHARACTER ASSESSMENT
--------------------
${values.character || '[Describe the veteran\'s character]'}

MILITARY SERVICE
----------------
${values.service || '[Comments on their military service]'}

ADDITIONAL COMMENTS
-------------------
${values.additional || '[Any additional relevant information]'}

CERTIFICATION
-------------
I certify that the above statements are true and accurate to the best of my knowledge. I am providing this statement voluntarily to support the veteran's VA disability claim.

Signature: _________________________
Date: _________________________
Contact: _________________________
`,
  },
];

export function BuddyStatementTemplates() {
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>('witness');
  const [formValues, setFormValues] = useState<Record<string, Record<string, string>>>({
    witness: {},
    symptoms: {},
    character: {},
  });
  const { toast } = useToast();

  const currentTemplate = templates.find(t => t.id === activeTemplate)!;
  const currentValues = formValues[activeTemplate] || {};

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [activeTemplate]: {
        ...prev[activeTemplate],
        [fieldId]: value,
      },
    }));
  };

  const downloadTemplate = () => {
    const content = currentTemplate.generateContent(currentValues);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Buddy_Statement_${currentTemplate.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Template Downloaded',
      description: 'The statement template has been saved.',
    });
  };

  const copyToClipboard = () => {
    const content = currentTemplate.generateContent(currentValues);
    navigator.clipboard.writeText(content);
    toast({
      title: 'Copied to Clipboard',
      description: 'The statement has been copied.',
    });
  };

  const resetForm = () => {
    setFormValues(prev => ({
      ...prev,
      [activeTemplate]: {},
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Buddy Statement Templates</CardTitle>
            <CardDescription>Customizable templates for supporting statements</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTemplate} onValueChange={(v) => setActiveTemplate(v as TemplateType)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            {templates.map(template => (
              <TabsTrigger key={template.id} value={template.id} className="text-xs sm:text-sm">
                <template.icon className="h-4 w-4 mr-1 hidden sm:inline" />
                {template.title.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {templates.map(template => (
            <TabsContent key={template.id} value={template.id} className="space-y-4">
              <p className="text-sm text-muted-foreground">{template.description}</p>
              
              {template.fields.map(field => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  {field.type === 'textarea' ? (
                    <Textarea
                      id={field.id}
                      placeholder={field.placeholder}
                      value={currentValues[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <Input
                      id={field.id}
                      placeholder={field.placeholder}
                      value={currentValues[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    />
                  )}
                </div>
              ))}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button onClick={downloadTemplate} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button onClick={resetForm} variant="ghost">
                  Reset
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-6 p-3 rounded-lg bg-muted/50 border border-border">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Tip:</strong> Fill in the fields above to customize the template, 
            then download or copy the statement. The person providing the statement should review, sign, 
            and date the final document.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
