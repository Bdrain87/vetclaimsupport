import { useState, useMemo } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface GlossaryTerm {
  term: string;
  definition: string;
  related?: string[];
}

const glossaryData: GlossaryTerm[] = [
  {
    term: '38 CFR Part 4',
    definition: 'The federal regulation containing the VA\'s Schedule for Rating Disabilities, which defines how each disability is evaluated and rated.',
    related: ['Rating Schedule', 'Diagnostic Code'],
  },
  {
    term: 'ARPB',
    definition: 'Annual Retroactive Payment of Benefits. A lump-sum payment covering benefits owed from the effective date of the claim to the present.',
  },
  {
    term: 'BDD',
    definition: 'Benefits Delivery at Discharge. A program allowing service members to file VA disability claims 180-90 days before separation.',
    related: ['Pre-Discharge Claim'],
  },
  {
    term: 'Bilateral Factor',
    definition: 'A 10% increase applied when a veteran has matching disabilities on both sides of the body (e.g., both knees, both hearing loss).',
  },
  {
    term: 'Buddy Statement',
    definition: 'A written statement from someone who witnessed your condition, symptoms, or the event that caused your disability. Can be from fellow service members, family, or friends.',
    related: ['Lay Evidence'],
  },
  {
    term: 'C&P Exam',
    definition: 'Compensation and Pension examination. A medical exam ordered by the VA to evaluate the severity of your claimed conditions and their connection to service.',
    related: ['DBQ', 'Medical Evidence'],
  },
  {
    term: 'Combined Rating',
    definition: 'The overall disability rating calculated using VA math, where each rating is applied to the remaining "whole person" percentage rather than simply added together.',
  },
  {
    term: 'DBQ',
    definition: 'Disability Benefits Questionnaire. A standardized form that doctors use to document the severity of disabilities. Can be completed by private physicians.',
    related: ['C&P Exam', 'Medical Evidence'],
  },
  {
    term: 'Diagnostic Code (DC)',
    definition: 'A number assigned to each disability in 38 CFR Part 4 that identifies the specific condition and its rating criteria.',
    related: ['38 CFR Part 4', 'Rating Schedule'],
  },
  {
    term: 'Direct Service Connection',
    definition: 'A disability that was directly caused by an event, injury, or disease during military service.',
    related: ['Service Connection', 'Secondary Connection'],
  },
  {
    term: 'Effective Date',
    definition: 'The date from which VA benefits begin. Usually the date of claim or the date entitlement arose, whichever is later.',
  },
  {
    term: 'Fully Developed Claim (FDC)',
    definition: 'A claim submitted with all necessary evidence, allowing for faster processing. Veterans certify they have no additional evidence to submit.',
  },
  {
    term: 'GERD',
    definition: 'Gastroesophageal Reflux Disease. A common condition among veterans, often secondary to medications or stress-related conditions.',
  },
  {
    term: 'HLR',
    definition: 'Higher-Level Review. An appeal option where a senior reviewer examines the claim decision for errors without considering new evidence.',
    related: ['Supplemental Claim', 'Appeal'],
  },
  {
    term: 'IBS',
    definition: 'Irritable Bowel Syndrome. A gastrointestinal condition commonly claimed as secondary to PTSD or anxiety.',
  },
  {
    term: 'IMO',
    definition: 'Independent Medical Opinion. A medical opinion from a private doctor that can support service connection or increased rating.',
    related: ['Nexus Letter'],
  },
  {
    term: 'Intent to File',
    definition: 'A notification to VA that you plan to file a claim, preserving your effective date for up to one year while you gather evidence.',
  },
  {
    term: 'Lay Evidence',
    definition: 'Evidence from non-medical sources, such as personal statements, buddy statements, or family observations about symptoms and limitations.',
    related: ['Buddy Statement'],
  },
  {
    term: 'MST',
    definition: 'Military Sexual Trauma. Sexual assault or harassment experienced during military service, which can lead to PTSD and other conditions.',
  },
  {
    term: 'Nexus Letter',
    definition: 'A medical opinion stating that your current disability is "at least as likely as not" connected to your military service. Critical evidence for service connection.',
    related: ['IMO', 'Service Connection'],
  },
  {
    term: 'PACT Act',
    definition: 'The Promise to Address Comprehensive Toxics Act (2022). Expanded VA benefits for veterans exposed to burn pits, Agent Orange, and other toxic substances.',
  },
  {
    term: 'Pyramiding',
    definition: 'The prohibited practice of rating the same symptoms under multiple diagnostic codes. VA rules prevent double-counting symptoms.',
  },
  {
    term: 'Rating Schedule',
    definition: 'The VA\'s system for assigning percentage ratings to disabilities based on their severity and impact on earning capacity.',
    related: ['38 CFR Part 4', 'Diagnostic Code'],
  },
  {
    term: 'Secondary Condition',
    definition: 'A disability caused or aggravated by an already service-connected condition. For example, depression caused by chronic pain.',
    related: ['Direct Service Connection', 'Aggravation'],
  },
  {
    term: 'Service Connection',
    definition: 'VA determination that a disability is related to military service, required for compensation benefits.',
    related: ['Direct Service Connection', 'Secondary Connection'],
  },
  {
    term: 'SMC',
    definition: 'Special Monthly Compensation. Additional compensation for severe disabilities or specific situations like loss of limb or need for aid and attendance.',
  },
  {
    term: 'STRs',
    definition: 'Service Treatment Records. Medical records from your time in military service, essential evidence for many claims.',
  },
  {
    term: 'Supplemental Claim',
    definition: 'A claim filed after a denial that includes new and relevant evidence not previously considered.',
    related: ['HLR', 'Appeal'],
  },
  {
    term: 'TDIU',
    definition: 'Total Disability Individual Unemployability. Allows veterans rated less than 100% to receive 100% compensation if their disabilities prevent substantial gainful employment.',
  },
  {
    term: 'TBI',
    definition: 'Traumatic Brain Injury. Brain injury caused by trauma, commonly from blast exposure, falls, or vehicle accidents during service.',
  },
  {
    term: 'VA Math',
    definition: 'The method VA uses to calculate combined ratings. Each rating is applied to the remaining whole person, not simply added. Example: 50% + 30% = 65%, not 80%.',
    related: ['Combined Rating'],
  },
  {
    term: 'VAMC',
    definition: 'Veterans Affairs Medical Center. VA hospitals that provide healthcare to eligible veterans.',
  },
  {
    term: 'VBMS',
    definition: 'Veterans Benefits Management System. The VA\'s electronic claims processing system.',
  },
  {
    term: 'VSO',
    definition: 'Veterans Service Organization. Organizations like DAV, VFW, and American Legion that provide free claims assistance to veterans.',
  },
];

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = useMemo(() => {
    if (!searchTerm) return glossaryData;
    const lower = searchTerm.toLowerCase();
    return glossaryData.filter(
      (item) =>
        item.term.toLowerCase().includes(lower) ||
        item.definition.toLowerCase().includes(lower)
    );
  }, [searchTerm]);

  // Group by first letter
  const groupedTerms = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};
    filteredTerms.forEach((term) => {
      const firstLetter = term.term[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const letters = Object.keys(groupedTerms).sort();

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="section-header">
        <div className="section-icon">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">VA Claims Glossary</h1>
          <p className="text-muted-foreground">Definitions of common VA claims terms</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Letter Navigation */}
      {!searchTerm && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              {letters.map((letter) => (
                <a
                  key={letter}
                  href={`#glossary-${letter}`}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
                >
                  {letter}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Terms */}
      {letters.map((letter) => (
        <Card key={letter} id={`glossary-${letter}`}>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">{letter}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {groupedTerms[letter].map((item) => (
              <div key={item.term} className="border-b border-border last:border-0 pb-4 last:pb-0">
                <h3 className="font-semibold text-foreground mb-1">{item.term}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.definition}</p>
                {item.related && item.related.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">Related:</span>
                    {item.related.map((related) => (
                      <span
                        key={related}
                        className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                      >
                        {related}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {filteredTerms.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">No terms found</h3>
            <p className="text-sm text-muted-foreground">
              Try a different search term
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
