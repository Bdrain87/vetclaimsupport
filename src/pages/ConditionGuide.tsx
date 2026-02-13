import { useState, useMemo } from 'react';
import { Search, BookOpen, ChevronRight, CheckCircle2, AlertCircle, FileText, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/PageContainer';

interface ConditionGuide {
  id: string;
  name: string;
  category: string;
  diagnosticCode: string;
  description: string;
  ratingCriteria: {
    percentage: number;
    criteria: string;
  }[];
  requiredEvidence: string[];
  commonSecondaries: string[];
  examTips: string[];
  successTips: string[];
}

const conditionGuides: ConditionGuide[] = [
  {
    id: 'ptsd',
    name: 'PTSD (Post-Traumatic Stress Disorder)',
    category: 'Mental Health',
    diagnosticCode: '9411',
    description: 'Anxiety disorder caused by witnessing or experiencing traumatic events during service.',
    ratingCriteria: [
      { percentage: 0, criteria: 'Formally diagnosed but symptoms controlled by medication' },
      { percentage: 10, criteria: 'Mild symptoms, occupational and social impairment with decreased work efficiency during stress periods' },
      { percentage: 30, criteria: 'Occasional decrease in work efficiency with intermittent inability to perform tasks' },
      { percentage: 50, criteria: 'Reduced reliability and productivity due to symptoms like panic attacks, difficulty understanding commands' },
      { percentage: 70, criteria: 'Deficiencies in most areas: work, family, thinking, mood. Suicidal ideation, obsessional rituals' },
      { percentage: 100, criteria: 'Total occupational and social impairment. Persistent danger to self or others, inability to perform daily activities' },
    ],
    requiredEvidence: [
      'Current diagnosis from a mental health professional',
      'Evidence of in-service stressor (combat, MST, etc.)',
      'Doctor summary connecting diagnosis to service',
      'Buddy statements describing behavioral changes',
      'Treatment records showing ongoing symptoms',
    ],
    commonSecondaries: [
      'Sleep Apnea',
      'Migraines',
      'Hypertension',
      'GERD/IBS',
      'Erectile Dysfunction',
      'Depression',
      'Anxiety Disorder',
    ],
    examTips: [
      'Describe your worst days, not your best',
      'Be specific about how symptoms affect work and relationships',
      'Mention nightmares, flashbacks, and avoidance behaviors',
      'Discuss any suicidal ideation honestly',
      'Bring a list of your symptoms and their frequency',
    ],
    successTips: [
      'Get a current diagnosis before filing',
      'Document your stressor with detail (who, what, when, where)',
      'Combat veterans have relaxed stressor verification requirements',
      'MST claims have special evidence rules - markers in records count',
      'Keep a symptom journal before your C&P exam',
    ],
  },
  {
    id: 'tinnitus',
    name: 'Tinnitus',
    category: 'Auditory',
    diagnosticCode: '6260',
    description: 'Persistent ringing, buzzing, or other sounds in the ears without external source.',
    ratingCriteria: [
      { percentage: 10, criteria: 'Recurrent tinnitus. This is the maximum schedular rating for tinnitus.' },
    ],
    requiredEvidence: [
      'Statement describing the ringing/buzzing',
      'Evidence of noise exposure in service (MOS, weapon qualification, etc.)',
      'Buddy statements if others noticed you mentioning ear issues',
    ],
    commonSecondaries: [
      'Hearing Loss',
      'Migraines',
      'Depression',
      'Anxiety',
      'Sleep Disorders',
    ],
    examTips: [
      'Describe the sound (ringing, buzzing, hissing, etc.)',
      'Explain when it started and any worsening',
      'Discuss impact on concentration and sleep',
    ],
    successTips: [
      'Tinnitus is subjective - your statement is often sufficient',
      'Connect to your noise exposure (weapons, machinery, aircraft)',
      '10% is the maximum rating, so focus on secondary conditions',
      'Often claimed with hearing loss for combined rating benefit',
    ],
  },
  {
    id: 'lumbar-spine',
    name: 'Lumbar Spine Conditions',
    category: 'Musculoskeletal',
    diagnosticCode: '5237',
    description: 'Lower back conditions including strain, DDD, herniated discs, and radiculopathy.',
    ratingCriteria: [
      { percentage: 10, criteria: 'Forward flexion greater than 60° but not greater than 85°, or combined ROM greater than 120° but not greater than 235°' },
      { percentage: 20, criteria: 'Forward flexion greater than 30° but not greater than 60°, or combined ROM not greater than 120°' },
      { percentage: 40, criteria: 'Forward flexion 30° or less, or favorable ankylosis of the entire thoracolumbar spine' },
      { percentage: 50, criteria: 'Unfavorable ankylosis of the entire thoracolumbar spine' },
      { percentage: 100, criteria: 'Unfavorable ankylosis of the entire spine' },
    ],
    requiredEvidence: [
      'MRI or X-ray showing spinal condition',
      'Range of motion measurements',
      'Service treatment records showing injury or complaints',
      'Doctor summary from physician',
      'Buddy statements about carrying heavy gear',
    ],
    commonSecondaries: [
      'Radiculopathy (each extremity rated separately)',
      'Erectile Dysfunction',
      'Bladder/Bowel dysfunction',
      'Depression',
      'Sleep disturbance',
    ],
    examTips: [
      'Attend during a flare-up if possible, or describe your worst days',
      'Let the examiner know about pain during ROM testing',
      'Report any radiating pain down the legs (radiculopathy)',
      'Mention any incapacitating episodes requiring bed rest',
    ],
    successTips: [
      'Separate ratings for radiculopathy can significantly increase combined rating',
      'IVDS (Intervertebral Disc Syndrome) has alternate rating criteria',
      'Document incapacitating episodes (bed rest prescribed by doctor)',
      'Heavy lifting and carrying gear in service supports nexus',
    ],
  },
  {
    id: 'sleep-apnea',
    name: 'Sleep Apnea',
    category: 'Respiratory',
    diagnosticCode: '6847',
    description: 'Breathing repeatedly stops and starts during sleep, often requiring CPAP or other treatment.',
    ratingCriteria: [
      { percentage: 0, criteria: 'Asymptomatic but with documented sleep disorder breathing' },
      { percentage: 30, criteria: 'Persistent day-time hypersomnolence' },
      { percentage: 50, criteria: 'Requires use of breathing assistance device such as CPAP machine' },
      { percentage: 100, criteria: 'Chronic respiratory failure with carbon dioxide retention or cor pulmonale, or requires tracheostomy' },
    ],
    requiredEvidence: [
      'Sleep study (polysomnography) showing diagnosis',
      'CPAP prescription and usage records',
      'Buddy statements about snoring, gasping during sleep',
      'Evidence of in-service symptoms or diagnosis',
    ],
    commonSecondaries: [
      'PTSD (often causes or aggravates sleep apnea)',
      'Hypertension',
      'Heart conditions',
      'Depression',
      'Cognitive impairment',
    ],
    examTips: [
      'Bring CPAP compliance records',
      'Describe daytime sleepiness and fatigue',
      'Mention any accidents or near-accidents from fatigue',
    ],
    successTips: [
      '50% rating is common if you use CPAP',
      'Often claimed as secondary to PTSD, weight gain from other conditions',
      'Get a sleep study if you have symptoms but no diagnosis',
      'Buddy statements about witnessed apneas are valuable',
    ],
  },
  {
    id: 'migraines',
    name: 'Migraine Headaches',
    category: 'Neurological',
    diagnosticCode: '8100',
    description: 'Severe recurring headaches often with nausea, sensitivity to light/sound, and visual disturbances.',
    ratingCriteria: [
      { percentage: 0, criteria: 'Less frequent attacks' },
      { percentage: 10, criteria: 'Characteristic prostrating attacks averaging one in 2 months' },
      { percentage: 30, criteria: 'Characteristic prostrating attacks occurring on average once a month' },
      { percentage: 50, criteria: 'Very frequent, completely prostrating and prolonged attacks productive of severe economic inadaptability' },
    ],
    requiredEvidence: [
      'Migraine diary showing frequency and severity',
      'Medical records documenting treatment',
      'Evidence of prostrating attacks (had to lie down, couldn\'t work)',
      'Buddy statements about witnessed migraine episodes',
    ],
    commonSecondaries: [
      'TBI (often migraines secondary to TBI)',
      'PTSD',
      'Depression',
      'Anxiety',
    ],
    examTips: [
      'Know the difference between prostrating and non-prostrating',
      'Describe attacks that force you to stop activities and lie down',
      'Explain economic impact (missed work, reduced productivity)',
      'Bring your migraine log/diary',
    ],
    successTips: [
      '"Prostrating" means you cannot function - emphasize this',
      'Track frequency meticulously for months before exam',
      '"Severe economic inadaptability" includes reduced work performance',
      'Often secondary to TBI, PTSD, or neck conditions',
    ],
  },
];

export default function ConditionGuide() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<ConditionGuide | null>(null);

  const filteredGuides = useMemo(() => {
    if (!searchQuery.trim()) return conditionGuides;
    const query = searchQuery.toLowerCase();
    return conditionGuides.filter(
      (g) =>
        g.name.toLowerCase().includes(query) ||
        g.category.toLowerCase().includes(query) ||
        g.diagnosticCode.includes(query)
    );
  }, [searchQuery]);

  if (selectedGuide) {
    return (
      <PageContainer className="space-y-6 animate-fade-in">
        <button
          onClick={() => setSelectedGuide(null)}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          ← Back to all conditions
        </button>

        <div className="section-header">
          <div className="section-icon">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{selectedGuide.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{selectedGuide.category}</Badge>
              <Badge variant="outline">DC {selectedGuide.diagnosticCode}</Badge>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground">{selectedGuide.description}</p>

        {/* Rating Criteria */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rating Criteria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedGuide.ratingCriteria.map((rc) => (
              <div
                key={rc.percentage}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {rc.percentage}%
                </div>
                <p className="text-sm text-muted-foreground pt-2">{rc.criteria}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Required Evidence */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Required Evidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {selectedGuide.requiredEvidence.map((evidence, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                  <span>{evidence}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Common Secondaries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Common Secondary Conditions</CardTitle>
            <CardDescription>
              Conditions often rated as secondary to {selectedGuide.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedGuide.commonSecondaries.map((secondary) => (
                <Badge key={secondary} variant="outline" className="px-3 py-1">
                  {secondary}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                C&P Exam Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedGuide.examTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-warning">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-success" />
                Success Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedGuide.successTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-success">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6 animate-fade-in">
      <div className="section-header">
        <div className="section-icon">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Condition Guides</h1>
          <p className="text-muted-foreground">
            Detailed guides for common VA disability claims
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conditions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredGuides.map((guide) => (
          <Card
            key={guide.id}
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => setSelectedGuide(guide)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{guide.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {guide.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      DC {guide.diagnosticCode}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                {guide.description}
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span>{guide.ratingCriteria.length} rating levels</span>
                <span>{guide.commonSecondaries.length} secondaries</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGuides.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No conditions found matching "{searchQuery}"
            </p>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
