import { useState, useMemo } from 'react';
import { Search, BookOpen, ChevronRight, CheckCircle2, AlertCircle, FileText, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/PageContainer';
import { getConditionById } from '@/data/vaConditions';
import { conditionRatingCriteria, type ConditionRatingCriteria } from '@/data/ratingCriteria';
import { categoryLabels, type ConditionCategory } from '@/data/conditions/types';

interface ConditionGuideItem {
  id: string;
  name: string;
  category: string;
  diagnosticCode: string;
  description: string;
  ratingCriteria: { percentage: number; criteria: string }[];
  requiredEvidence: string[];
  commonSecondaries: string[];
  examTips: string[];
  successTips: string[];
}

/**
 * Build guide items dynamically from the conditions database and rating criteria.
 * Only includes conditions that have detailed rating criteria available.
 */
function buildConditionGuides(): ConditionGuideItem[] {
  return conditionRatingCriteria.map((rc: ConditionRatingCriteria) => {
    const condition = getConditionById(rc.conditionId);

    const ratingCriteria = rc.ratingLevels.map((level) => ({
      percentage: level.percent,
      criteria: level.criteria,
    }));

    const commonSecondaries = condition?.possibleSecondaries
      ?? condition?.commonSecondaries
        .map((id) => {
          const secondary = getConditionById(id);
          return secondary?.name ?? null;
        })
        .filter((name): name is string => name !== null)
      ?? [];

    const examTips = rc.examTips ?? [
      'Describe your worst days, not your best',
      'Be specific about how symptoms affect work and daily activities',
      'Bring documentation of treatments and medications',
    ];

    const successTips = rc.commonMistakes
      ? rc.commonMistakes.map((m) => `Avoid: ${m}`)
      : [
          'Document all symptoms and their frequency before your exam',
          'Get buddy statements from people who witness your symptoms',
          'Ensure you have a current diagnosis before filing',
        ];

    const requiredEvidence = [
      'Current diagnosis from a qualified provider',
      'Service treatment records or evidence of in-service incurrence',
      'Doctor summary connecting condition to service',
      'Buddy/lay statements supporting your claim',
      'Treatment records showing ongoing symptoms',
    ];

    const categoryLabel = condition
      ? (categoryLabels[condition.category as ConditionCategory] ?? condition.category)
      : 'General';

    return {
      id: rc.conditionId,
      name: rc.conditionName,
      category: categoryLabel,
      diagnosticCode: rc.diagnosticCode,
      description: condition?.description ?? `VA disability condition rated under DC ${rc.diagnosticCode}.`,
      ratingCriteria,
      requiredEvidence,
      commonSecondaries,
      examTips,
      successTips,
    };
  });
}

// Lazy singleton — only built when user actually visits this page
let _cachedGuides: ConditionGuideItem[] | null = null;
function getConditionGuides(): ConditionGuideItem[] {
  if (!_cachedGuides) _cachedGuides = buildConditionGuides();
  return _cachedGuides;
}

export default function ConditionGuide() {
  const conditionGuides = getConditionGuides();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<ConditionGuideItem | null>(null);

  const filteredGuides = useMemo(() => {
    if (!searchQuery.trim()) return conditionGuides;
    const query = searchQuery.toLowerCase();
    return conditionGuides.filter(
      (g) =>
        g.name.toLowerCase().includes(query) ||
        g.category.toLowerCase().includes(query) ||
        g.diagnosticCode.includes(query)
    );
  }, [searchQuery, conditionGuides]);

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
        {selectedGuide.commonSecondaries.length > 0 && (
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
        )}

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
            Detailed guides for {conditionGuides.length} VA disability conditions
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
          aria-label="Search conditions"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredGuides.map((guide) => (
          <Card
            key={guide.id}
            className="cursor-pointer hover:border-primary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => setSelectedGuide(guide)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedGuide(guide); } }}
            tabIndex={0}
            role="button"
            aria-label={`View guide for ${guide.name}`}
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
