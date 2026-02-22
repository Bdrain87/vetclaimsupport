import { useState } from 'react';
import { FileText, ExternalLink, Search, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VAForm {
  number: string;
  name: string;
  description: string;
  category: 'claims' | 'appeals' | 'evidence' | 'healthcare' | 'other';
  url: string;
  common?: boolean;
}

const vaForms: VAForm[] = [
  // Claims
  {
    number: 'VA Form 21-526EZ',
    name: 'Application for Disability Compensation',
    description: 'The main form for filing a VA disability claim. Used for initial claims, increases, and secondary conditions.',
    category: 'claims',
    url: 'https://www.va.gov/find-forms/about-form-21-526ez/',
    common: true,
  },
  {
    number: 'VA Form 21-0966',
    name: 'Intent to File',
    description: 'Notifies VA you plan to file a claim, preserving your effective date for up to one year.',
    category: 'claims',
    url: 'https://www.va.gov/find-forms/about-form-21-0966/',
    common: true,
  },
  {
    number: 'VA Form 21-8940',
    name: 'TDIU Application',
    description: 'Application for Total Disability Individual Unemployability benefits.',
    category: 'claims',
    url: 'https://www.va.gov/find-forms/about-form-21-8940/',
  },
  {
    number: 'VA Form 21-4192',
    name: 'Request for Employment Information',
    description: 'Used with TDIU claims to document employment history and limitations.',
    category: 'claims',
    url: 'https://www.va.gov/find-forms/about-form-21-4192/',
  },
  {
    number: 'VA Form 21-2680',
    name: 'Aid and Attendance Examination',
    description: 'Request for examination to determine need for aid and attendance or housebound benefits.',
    category: 'claims',
    url: 'https://www.va.gov/find-forms/about-form-21-2680/',
  },

  // Appeals
  {
    number: 'VA Form 20-0995',
    name: 'Supplemental Claim',
    description: 'File a supplemental claim with new and relevant evidence after a denial.',
    category: 'appeals',
    url: 'https://www.va.gov/find-forms/about-form-20-0995/',
    common: true,
  },
  {
    number: 'VA Form 20-0996',
    name: 'Higher-Level Review',
    description: 'Request a senior reviewer examine your claim for errors (no new evidence allowed).',
    category: 'appeals',
    url: 'https://www.va.gov/find-forms/about-form-20-0996/',
    common: true,
  },
  {
    number: 'VA Form 10182',
    name: 'Board Appeal (NOD)',
    description: 'Appeal to the Board of Veterans Appeals. Choose direct review, evidence submission, or hearing.',
    category: 'appeals',
    url: 'https://www.va.gov/find-forms/about-form-10182/',
  },

  // Evidence
  {
    number: 'VA Form 21-4138',
    name: 'Statement in Support of Claim',
    description: 'Submit personal statements, buddy statements, or additional information about your claim.',
    category: 'evidence',
    url: 'https://www.va.gov/find-forms/about-form-21-4138/',
    common: true,
  },
  {
    number: 'VA Form 21-0781',
    name: 'PTSD Stressor Statement',
    description: 'Document specific traumatic events for PTSD claims. Required for PTSD service connection.',
    category: 'evidence',
    url: 'https://www.va.gov/find-forms/about-form-21-0781/',
    common: true,
  },
  {
    number: 'VA Form 21-0781a',
    name: 'MST Stressor Statement',
    description: 'Document Military Sexual Trauma for PTSD claims related to MST.',
    category: 'evidence',
    url: 'https://www.va.gov/find-forms/about-form-21-0781a/',
  },
  {
    number: 'VA Form 21-4142',
    name: 'Authorization for Release of Information',
    description: 'Authorize VA to obtain your private medical records from healthcare providers.',
    category: 'evidence',
    url: 'https://www.va.gov/find-forms/about-form-21-4142/',
    common: true,
  },
  {
    number: 'VA Form 21-4142a',
    name: 'General Release',
    description: 'General authorization for release of information (accompanies 21-4142).',
    category: 'evidence',
    url: 'https://www.va.gov/find-forms/about-form-21-4142a/',
  },
  {
    number: 'VA Form 21-22',
    name: 'Appointment of VSO',
    description: 'Appoint a Veterans Service Organization to represent you in your claim.',
    category: 'evidence',
    url: 'https://www.va.gov/find-forms/about-form-21-22/',
    common: true,
  },
  {
    number: 'VA Form 21-22a',
    name: 'Appointment of Individual',
    description: 'Appoint an individual (claims agent or attorney) to represent you.',
    category: 'evidence',
    url: 'https://www.va.gov/find-forms/about-form-21-22a/',
  },

  // Healthcare
  {
    number: 'VA Form 10-10EZ',
    name: 'Healthcare Enrollment',
    description: 'Apply for VA healthcare benefits and enroll in the VA health system.',
    category: 'healthcare',
    url: 'https://www.va.gov/find-forms/about-form-10-10ez/',
  },
  {
    number: 'VA Form 10-10EZR',
    name: 'Health Benefits Update',
    description: 'Update your health benefits information (income, dependents, insurance).',
    category: 'healthcare',
    url: 'https://www.va.gov/find-forms/about-form-10-10ezr/',
  },

  // Other
  {
    number: 'SF-180',
    name: 'Request Military Records',
    description: 'Request your military service records (DD-214, personnel records, medical records).',
    category: 'other',
    url: 'https://www.archives.gov/veterans/military-service-records/standard-form-180.html',
    common: true,
  },
  {
    number: 'VA Form 21-686c',
    name: 'Declaration of Status of Dependents',
    description: 'Add or remove dependents to increase your monthly compensation.',
    category: 'other',
    url: 'https://www.va.gov/find-forms/about-form-21-686c/',
  },
];

const categoryLabels = {
  claims: 'Disability Claims',
  appeals: 'Appeals',
  evidence: 'Evidence & Authorization',
  healthcare: 'Healthcare',
  other: 'Other',
};

export default function VAForms() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredForms = vaForms.filter((form) => {
    const matchesSearch = !searchTerm.trim() ||
      form.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || form.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const commonForms = filteredForms.filter((f) => f.common);
  const otherForms = filteredForms.filter((f) => !f.common);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="section-header">
        <div className="section-icon">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">VA Forms Library</h1>
          <p className="text-muted-foreground">Quick access to essential VA forms</p>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              All Forms
            </button>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selectedCategory === key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Common Forms */}
      {commonForms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Most Used Forms
            </CardTitle>
            <CardDescription>These are the forms most veterans need</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {commonForms.map((form) => (
              <div
                key={form.number}
                className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-primary font-medium">{form.number}</span>
                      <Badge variant="secondary" className="text-xs">
                        {categoryLabels[form.category]}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-foreground mb-1">{form.name}</h3>
                    <p className="text-sm text-muted-foreground">{form.description}</p>
                  </div>
                  <Button size="sm" variant="outline" asChild className="flex-shrink-0">
                    <a href={form.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Open
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Other Forms */}
      {otherForms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>All Forms</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {otherForms.map((form) => (
              <div
                key={form.number}
                className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-primary font-medium">{form.number}</span>
                      <Badge variant="secondary" className="text-xs">
                        {categoryLabels[form.category]}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-foreground mb-1">{form.name}</h3>
                    <p className="text-sm text-muted-foreground">{form.description}</p>
                  </div>
                  <Button size="sm" variant="outline" asChild className="flex-shrink-0">
                    <a href={form.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Open
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {filteredForms.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">No forms found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> These links direct to official VA.gov pages.
            Always verify you're on an official government website (ending in .gov) before submitting personal information.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
