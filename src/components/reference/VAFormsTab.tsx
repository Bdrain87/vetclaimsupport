import { FileText, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface VAForm {
  number: string;
  name: string;
  description: string;
  url: string;
}

const vaForms: VAForm[] = [
  {
    number: '21-526EZ',
    name: 'Application for Disability Compensation',
    description: 'The main form to apply for VA disability compensation. Can be filed online through VA.gov or with a VSO.',
    url: 'https://www.va.gov/find-forms/about-form-21-526ez/',
  },
  {
    number: '21-0966',
    name: 'Intent to File',
    description: 'Locks in your effective date for up to 1 year while you gather evidence. File this first!',
    url: 'https://www.va.gov/find-forms/about-form-21-0966/',
  },
  {
    number: '21-4138',
    name: 'Statement in Support of Claim',
    description: 'Use this to provide additional details about your claim, explain circumstances, or provide personal statements.',
    url: 'https://www.va.gov/find-forms/about-form-21-4138/',
  },
  {
    number: '21-4142',
    name: 'Authorization to Release Medical Records',
    description: 'Authorizes the VA to obtain your private medical records from non-VA healthcare providers.',
    url: 'https://www.va.gov/find-forms/about-form-21-4142/',
  },
  {
    number: '21-10210',
    name: 'Lay/Witness Statement',
    description: 'For buddy statements - allows family, friends, or fellow service members to provide witness testimony about your conditions.',
    url: 'https://www.va.gov/find-forms/about-form-21-10210/',
  },
  {
    number: '21-8940',
    name: "Veteran's Application for TDIU",
    description: 'Total Disability Individual Unemployability - for veterans whose disabilities prevent them from maintaining substantially gainful employment.',
    url: 'https://www.va.gov/find-forms/about-form-21-8940/',
  },
];

export function VAFormsTab() {
  return (
    <div className="space-y-4">
      <Card className="data-card bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground">Common VA Forms</h3>
              <p className="text-sm text-muted-foreground mt-1">
                These are the most commonly used forms for VA disability claims. All forms can be 
                submitted online through VA.gov or with help from a Veterans Service Organization (VSO).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {vaForms.map((form) => (
          <Card key={form.number} className="data-card hover:border-primary/30 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="text-primary font-mono">VA Form {form.number}</span>
              </CardTitle>
              <p className="font-medium text-foreground text-sm">{form.name}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{form.description}</p>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                asChild
              >
                <a href={form.url} target="_blank" rel="noopener noreferrer">
                  View on VA.gov
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="data-card">
        <CardContent className="pt-6">
          <h4 className="font-medium text-foreground mb-2">Tips for Filing Forms</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong>File online when possible</strong> — it's faster and creates a digital paper trail</li>
            <li>• <strong>Keep copies of everything</strong> — save PDFs of all submitted forms</li>
            <li>• <strong>Work with a VSO</strong> — they can help ensure forms are filled out correctly</li>
            <li>• <strong>Meet all deadlines</strong> — late submissions can delay or harm your claim</li>
            <li>• <strong>Be thorough but accurate</strong> — incomplete or inconsistent information can cause issues</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
