import { useState } from 'react';
import { FileText, Download, Copy, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

export function BuddyStatementGenerator() {
  const [formData, setFormData] = useState<FormData>({
    witnessName: '',
    relationship: '',
    timePeriod: '',
    statement: '',
  });
  const { toast } = useToast();

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
  );
}
