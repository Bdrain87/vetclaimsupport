import { BookOpen, ExternalLink, AlertTriangle, Link, FileText, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const commonDisabilities = [
  { name: 'Tinnitus', description: 'Ringing in the ears, extremely common among veterans' },
  { name: 'Hearing Loss', description: 'Often paired with tinnitus from noise exposure' },
  { name: 'Lower Back Strain', description: 'From heavy lifting, sitting, standing for long periods' },
  { name: 'Knee Conditions', description: 'Running, marching, carrying heavy equipment' },
  { name: 'Shoulder Conditions', description: 'Rotator cuff injuries from physical demands' },
  { name: 'Sleep Apnea', description: 'Often secondary to weight gain, PTSD, or sinusitis' },
  { name: 'PTSD', description: 'Post-Traumatic Stress Disorder from combat or MST' },
  { name: 'Depression/Anxiety', description: 'Often secondary to chronic pain or PTSD' },
  { name: 'Migraines', description: 'Often from TBI, stress, or as secondary condition' },
  { name: 'Plantar Fasciitis', description: 'Foot pain from running, standing, boots' },
  { name: 'Sinusitis/Rhinitis', description: 'From dust, burn pits, environmental exposure' },
  { name: 'GERD', description: 'Often secondary to medications or stress' },
];

const secondaryConditions = [
  { primary: 'PTSD', secondaries: ['Depression', 'Anxiety', 'Sleep Apnea', 'Migraines', 'GERD', 'Erectile Dysfunction', 'Hypertension'] },
  { primary: 'Sleep Apnea', secondaries: ['Hypertension', 'Heart Disease', 'GERD', 'Depression', 'Cognitive Impairment'] },
  { primary: 'Tinnitus', secondaries: ['Anxiety', 'Depression', 'Sleep Disturbance', 'Migraines'] },
  { primary: 'Lower Back Pain', secondaries: ['Radiculopathy (nerve pain)', 'Hip Condition', 'Knee Condition (altered gait)', 'Depression', 'Sleep Disturbance'] },
  { primary: 'Knee Condition', secondaries: ['Hip Condition', 'Lower Back Pain', 'Opposite Knee (compensating)', 'Ankle Condition'] },
  { primary: 'Migraines', secondaries: ['Depression', 'Anxiety', 'GERD (from medications)', 'Insomnia'] },
  { primary: 'Diabetes', secondaries: ['Peripheral Neuropathy', 'Hypertension', 'Heart Disease', 'Kidney Disease', 'Erectile Dysfunction', 'Vision Problems'] },
];

const pactActConditions = [
  'Asthma diagnosed after 9/11',
  'Head cancer (any type)',
  'Neck cancer',
  'Respiratory cancer',
  'Gastrointestinal cancer',
  'Reproductive cancer',
  'Lymphoma (any type)',
  'Lymphomatic cancer (any type)',
  'Kidney cancer',
  'Brain cancer',
  'Melanoma',
  'Pancreatic cancer',
  'Chronic bronchitis',
  'COPD',
  'Constrictive bronchiolitis/obliterative bronchiolitis',
  'Emphysema',
  'Granulomatous disease',
  'Interstitial lung disease (ILD)',
  'Pleuritis',
  'Pulmonary fibrosis',
  'Sarcoidosis',
  'Chronic sinusitis',
  'Chronic rhinitis',
  'Glioblastoma',
  'Squamous cell carcinoma of the larynx',
  'Adenocarcinoma of the trachea',
  'Salivary gland tumors',
];

export default function Reference() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reference Guide</h1>
          <p className="text-muted-foreground">VA disabilities, claims tips, and resources</p>
        </div>
      </div>

      <Tabs defaultValue="disabilities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 bg-transparent p-0">
          <TabsTrigger value="disabilities" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            VA Disabilities
          </TabsTrigger>
          <TabsTrigger value="secondary" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Secondary Conditions
          </TabsTrigger>
          <TabsTrigger value="pact" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            PACT Act
          </TabsTrigger>
          <TabsTrigger value="guide" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Claims Guide
          </TabsTrigger>
        </TabsList>

        {/* VA Disabilities Tab */}
        <TabsContent value="disabilities" className="space-y-4">
          <Card className="data-card">
            <CardHeader>
              <CardTitle className="text-lg">Common VA-Rated Disabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {commonDisabilities.map((condition) => (
                  <div key={condition.name} className="rounded-lg border p-3">
                    <h4 className="font-medium text-foreground">{condition.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{condition.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Secondary Conditions Tab */}
        <TabsContent value="secondary" className="space-y-4">
          <Card className="data-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Link className="h-5 w-5 text-primary" />
                Secondary Service Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Secondary conditions are disabilities caused or aggravated by an already service-connected condition. 
                These can significantly increase your combined rating.
              </p>
              <Accordion type="single" collapsible className="space-y-2">
                {secondaryConditions.map((item) => (
                  <AccordionItem key={item.primary} value={item.primary} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left font-medium">
                      {item.primary}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-2 pb-2">
                        {item.secondaries.map((sec) => (
                          <span key={sec} className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                            {sec}
                          </span>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PACT Act Tab */}
        <TabsContent value="pact" className="space-y-4">
          <Card className="data-card border-exposure/30 bg-exposure/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-exposure" />
                PACT Act Presumptive Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 mb-4">
                The PACT Act (2022) expanded VA benefits for veterans exposed to burn pits, Agent Orange, and other 
                toxic substances. These conditions are now <strong>presumptive</strong> - you don't need to prove 
                the connection to service if you served in qualifying locations.
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {pactActConditions.map((condition) => (
                  <div key={condition} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-exposure" />
                    {condition}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-background rounded-lg border">
                <p className="text-sm">
                  <strong>Qualifying service locations include:</strong> Iraq, Afghanistan, Gulf War theater, 
                  and many other locations. Check va.gov/pact for the full list.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Claims Guide Tab */}
        <TabsContent value="guide" className="space-y-4">
          {/* BDD Timeline */}
          <Card className="data-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                BDD Claim Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      180
                    </div>
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  </div>
                  <div className="pb-8">
                    <h4 className="font-semibold">180 Days Before Separation</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Earliest you can file a BDD claim. Start gathering medical records, buddy statements, 
                      and documenting all conditions.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      90
                    </div>
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  </div>
                  <div className="pb-8">
                    <h4 className="font-semibold">90 Days Before Separation</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Last day to file a BDD claim. After this, you must wait until after separation.
                      Submit your claim and attend C&P exams.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success text-success-foreground font-bold text-sm">
                      0
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">Separation Date</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      If BDD completed properly, you may receive your rating decision shortly after separation, 
                      with benefits starting immediately.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* C&P Exam Tips */}
          <Card className="data-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                C&P Exam Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-success/10 flex items-center justify-center text-xs font-bold text-success">✓</div>
                  <div>
                    <p className="font-medium">Describe Your Worst Days</p>
                    <p className="text-sm text-muted-foreground">Don't minimize symptoms. Explain how conditions affect you at their worst.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-success/10 flex items-center justify-center text-xs font-bold text-success">✓</div>
                  <div>
                    <p className="font-medium">Be Specific About Impact</p>
                    <p className="text-sm text-muted-foreground">Explain exactly how conditions affect work, daily activities, and relationships.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-success/10 flex items-center justify-center text-xs font-bold text-success">✓</div>
                  <div>
                    <p className="font-medium">Bring Documentation</p>
                    <p className="text-sm text-muted-foreground">Bring copies of relevant medical records, buddy statements, and personal notes.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-success/10 flex items-center justify-center text-xs font-bold text-success">✓</div>
                  <div>
                    <p className="font-medium">Don't Tough It Out</p>
                    <p className="text-sm text-muted-foreground">The examiner measures what they see. If something hurts, say so. Show limitations.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                <h4 className="font-medium text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Common Mistakes to Avoid
                </h4>
                <ul className="mt-2 space-y-1 text-sm text-foreground/80">
                  <li>• Saying "I'm fine" or downplaying symptoms</li>
                  <li>• Not mentioning flare-ups or bad days</li>
                  <li>• Forgetting to mention all conditions being claimed</li>
                  <li>• Being late or missing the exam (can result in denial)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card className="data-card">
            <CardHeader>
              <CardTitle className="text-lg">Helpful Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <a 
                  href="https://www.va.gov" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <ExternalLink className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">VA.gov</span>
                </a>
                <a 
                  href="https://www.ebenefits.va.gov" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <ExternalLink className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">eBenefits</span>
                </a>
                <a 
                  href="https://www.va.gov/pact" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <ExternalLink className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">PACT Act Info</span>
                </a>
                <a 
                  href="https://www.reddit.com/r/VeteransBenefits" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <ExternalLink className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">r/VeteransBenefits</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
