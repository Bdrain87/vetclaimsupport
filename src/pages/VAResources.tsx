import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, FileText, Shield, BookOpen } from 'lucide-react';
import PACTActChecker from '@/components/tools/PACTActChecker';
import { PageContainer } from '@/components/PageContainer';

interface VAResource {
  title: string;
  description: string;
  url: string;
  category: string;
}

const vaOfficialResources: VAResource[] = [
  {
    title: 'VASRD - eCFR',
    description: 'Official VA Schedule for Rating Disabilities',
    url: 'https://www.ecfr.gov/current/title-38/chapter-I/part-4',
    category: 'regulations'
  },
  {
    title: 'VASRD - Cornell Law',
    description: 'Alternative VASRD reference',
    url: 'https://www.law.cornell.edu/cfr/text/38/part-4',
    category: 'regulations'
  },
  {
    title: 'BVA Decisions Search',
    description: 'Search Board of Veterans Appeals decisions',
    url: 'https://www.va.gov/decision-reviews/board-appeal/',
    category: 'decisions'
  },
  {
    title: 'Public DBQ Forms',
    description: 'Disability Benefits Questionnaire forms',
    url: 'https://www.va.gov/find-forms/?q=dbq',
    category: 'forms'
  },
  {
    title: '2026 Compensation Rates',
    description: 'Current VA disability compensation rates',
    url: 'https://www.va.gov/disability/compensation-rates/',
    category: 'rates'
  },
  {
    title: 'PACT Act Information',
    description: 'Toxic exposure presumptive conditions',
    url: 'https://www.va.gov/resources/the-pact-act-and-your-va-benefits/',
    category: 'pact'
  },
  {
    title: 'M21-1 Adjudication Manual',
    description: 'VA claims processing procedures',
    url: 'https://www.knowva.ebenefits.va.gov/system/templates/selfservice/va_ssnew/help/customer/locale/en-US/portal/554400000001018',
    category: 'manual'
  },
  {
    title: 'VA Facility Locator',
    description: 'Find VA hospitals and clinics',
    url: 'https://www.va.gov/find-locations/',
    category: 'facilities'
  },
  {
    title: 'Claim Status Checker',
    description: 'Check your VA claim status',
    url: 'https://www.va.gov/claim-or-appeal-status/',
    category: 'status'
  }
];

export default function VAResources() {
  const [activeTab, setActiveTab] = useState('links');

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">VA Resources</h1>
        <p className="text-muted-foreground">
          Official VA resources, DBQ guides, and PACT Act information
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="links" className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Official Links</span>
            <span className="sm:hidden">Links</span>
          </TabsTrigger>
          <TabsTrigger value="dbq" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">DBQ Guide</span>
            <span className="sm:hidden">DBQ</span>
          </TabsTrigger>
          <TabsTrigger value="pact" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">PACT Act</span>
            <span className="sm:hidden">PACT</span>
          </TabsTrigger>
        </TabsList>

        {/* Official Links Tab */}
        <TabsContent value="links">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vaOfficialResources.map((resource, index) => (
              <Card key={index} className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {resource.title}
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3">
                    {resource.description}
                  </CardDescription>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Visit Resource →
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground">
              All resources link to official U.S. government websites.
              Information is public domain and provided for educational purposes.
            </p>
          </div>
        </TabsContent>

        {/* DBQ Guide Tab */}
        <TabsContent value="dbq">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  DBQ Quick Reference
                </CardTitle>
                <CardDescription>
                  Key information for common Disability Benefits Questionnaires
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* PTSD DBQ */}
                  <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <h3 className="font-semibold text-foreground mb-2">PTSD (21-0960P-3)</h3>
                    <p className="text-sm text-muted-foreground mb-2">Mental Health Assessment</p>
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium text-foreground">Key Questions:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Stressor verification</li>
                        <li>Symptom frequency and severity</li>
                        <li>Occupational impairment level</li>
                        <li>Social functioning impact</li>
                      </ul>
                    </div>
                  </div>

                  {/* Back/Spine DBQ */}
                  <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <h3 className="font-semibold text-foreground mb-2">Back/Spine (21-0960M-14)</h3>
                    <p className="text-sm text-muted-foreground mb-2">Thoracolumbar Spine</p>
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium text-foreground">Key Measurements:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Range of motion (flexion, extension)</li>
                        <li>Pain on movement</li>
                        <li>Flare-up frequency</li>
                        <li>Incapacitating episodes</li>
                      </ul>
                    </div>
                  </div>

                  {/* Sleep Apnea DBQ */}
                  <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <h3 className="font-semibold text-foreground mb-2">Sleep Apnea (21-0960C-8)</h3>
                    <p className="text-sm text-muted-foreground mb-2">Sleep Study Required</p>
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium text-foreground">Rating Criteria:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>100%: Chronic respiratory failure</li>
                        <li>50%: Requires CPAP</li>
                        <li>30%: Persistent daytime hypersomnolence</li>
                        <li>0%: Asymptomatic with treatment</li>
                      </ul>
                    </div>
                  </div>

                  {/* Migraines DBQ */}
                  <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <h3 className="font-semibold text-foreground mb-2">Migraines (21-0960I-6)</h3>
                    <p className="text-sm text-muted-foreground mb-2">Headache Assessment</p>
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium text-foreground">Rating Criteria:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>50%: Very frequent, completely prostrating</li>
                        <li>30%: Prostrating attacks monthly</li>
                        <li>10%: Prostrating attacks 1 in 2 months</li>
                        <li>0%: Less frequent attacks</li>
                      </ul>
                    </div>
                  </div>

                  {/* Tinnitus DBQ */}
                  <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <h3 className="font-semibold text-foreground mb-2">Tinnitus (21-0960N-2)</h3>
                    <p className="text-sm text-muted-foreground mb-2">Hearing Assessment</p>
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium text-foreground">Key Points:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Maximum rating: 10%</li>
                        <li>Must be recurrent</li>
                        <li>Document impact on concentration</li>
                        <li>Often secondary to hearing loss</li>
                      </ul>
                    </div>
                  </div>

                  {/* Knee DBQ */}
                  <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <h3 className="font-semibold text-foreground mb-2">Knee (21-0960M-9)</h3>
                    <p className="text-sm text-muted-foreground mb-2">Joint Assessment</p>
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium text-foreground">Key Measurements:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Flexion range of motion</li>
                        <li>Extension limitation</li>
                        <li>Instability testing</li>
                        <li>Meniscal conditions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PACT Act Tab */}
        <TabsContent value="pact">
          <div className="space-y-6">
            {/* PACT Act Checker Component */}
            <PACTActChecker />

            {/* Presumptive Conditions List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-success" />
                  Presumptive Conditions
                </CardTitle>
                <CardDescription>
                  Conditions presumed service-connected under the PACT Act
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Burn Pit Conditions */}
                  <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <h3 className="font-semibold text-gold mb-3">
                      Burn Pit / Toxic Exposure (23+ Conditions)
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Asthma (diagnosed during/after service)</li>
                      <li>Rhinitis</li>
                      <li>Sinusitis (including rhinosinusitis)</li>
                      <li>Pulmonary fibrosis</li>
                      <li>Constrictive bronchiolitis</li>
                      <li>COPD</li>
                      <li>Pleural disease</li>
                      <li>Lung cancer</li>
                      <li>Head/neck cancers</li>
                      <li>Respiratory cancers</li>
                      <li>Gastrointestinal cancers</li>
                      <li>Reproductive cancers</li>
                      <li>Lymphoma</li>
                      <li>Kidney cancer</li>
                      <li>Brain cancer</li>
                      <li>Melanoma</li>
                      <li>Pancreatic cancer</li>
                      <li>And more...</li>
                    </ul>
                  </div>

                  {/* Agent Orange Conditions */}
                  <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <h3 className="font-semibold text-gold mb-3">
                      Agent Orange (Vietnam, Thailand, Korea)
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>AL Amyloidosis</li>
                      <li>Bladder cancer</li>
                      <li>Chronic B-cell leukemias</li>
                      <li>Chloracne</li>
                      <li>Diabetes mellitus type 2</li>
                      <li>Hodgkin's disease</li>
                      <li>Hypothyroidism</li>
                      <li>Ischemic heart disease</li>
                      <li>Multiple myeloma</li>
                      <li>Non-Hodgkin's lymphoma</li>
                      <li>Parkinson's disease</li>
                      <li>Peripheral neuropathy</li>
                      <li>Porphyria cutanea tarda</li>
                      <li>Prostate cancer</li>
                      <li>Respiratory cancers</li>
                      <li>Soft tissue sarcomas</li>
                      <li>And more...</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-success/10 border border-success/30 rounded-lg">
                  <p className="text-sm text-success">
                    <strong>Important:</strong> If you served in a qualifying location during the specified dates
                    and have one of these conditions, you may be eligible for presumptive service connection
                    without needing to prove a direct link to your service.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Eligible Locations */}
            <Card>
              <CardHeader>
                <CardTitle>Eligible Service Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 text-sm">
                  <div className="p-2 bg-muted/30 rounded border border-border">Afghanistan (2001-present)</div>
                  <div className="p-2 bg-muted/30 rounded border border-border">Iraq (2003-present)</div>
                  <div className="p-2 bg-muted/30 rounded border border-border">Kuwait (1990-present)</div>
                  <div className="p-2 bg-muted/30 rounded border border-border">Saudi Arabia (1990-present)</div>
                  <div className="p-2 bg-muted/30 rounded border border-border">Bahrain (1990-present)</div>
                  <div className="p-2 bg-muted/30 rounded border border-border">Qatar (1990-present)</div>
                  <div className="p-2 bg-muted/30 rounded border border-border">UAE (1990-present)</div>
                  <div className="p-2 bg-muted/30 rounded border border-border">Oman (1990-present)</div>
                  <div className="p-2 bg-muted/30 rounded border border-border">Djibouti (2001-present)</div>
                  <div className="p-2 bg-muted/30 rounded border border-border">Egypt (1990-present)</div>
                  <div className="p-2 bg-muted/30 rounded border border-border">Jordan (1990-present)</div>
                  <div className="p-2 bg-muted/30 rounded border border-border">Lebanon (1990-present)</div>
                  <div className="p-2 bg-muted/30 rounded border border-border">Syria (1990-present)</div>
                  <div className="p-2 bg-muted/30 rounded border border-border">Yemen (1990-present)</div>
                  <div className="p-2 bg-muted/30 rounded border border-border">Somalia (1990-present)</div>
                  <div className="p-2 bg-muted/30 rounded border border-border">Uzbekistan (2001-present)</div>
                  <div className="p-2 bg-muted/30 rounded border border-border">Vietnam (1962-1975)</div>
                  <div className="p-2 bg-muted/30 rounded border border-border">Thailand (1962-1976)</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
