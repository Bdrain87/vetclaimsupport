import { useState, useMemo } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { searchVAForms, vaFormGuide, formCategoryLabels, type VAFormEntry } from '@/data/vaFormGuide';

const categoryFilters: { value: VAFormEntry['category'] | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'filing', label: 'Filing' },
  { value: 'evidence', label: 'Evidence' },
  { value: 'appeal', label: 'Appeal' },
  { value: 'special', label: 'Special' },
  { value: 'employment', label: 'Employment' },
];

const categoryColors: Record<string, string> = {
  filing: 'bg-[#D6B25E]/15 text-[#B8972E] border-[#D6B25E]/30',
  evidence: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
  appeal: 'bg-[#D6B25E]/15 text-[#B8972E] border-[#D6B25E]/30',
  special: 'bg-purple-500/15 text-purple-600 border-purple-500/30',
  medical: 'bg-red-500/15 text-red-600 border-red-500/30',
  employment: 'bg-[#D6B25E]/15 text-[#B8972E] border-[#D6B25E]/30',
};

export function VAFormsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<VAFormEntry['category'] | 'all'>('all');

  const filteredForms = useMemo(() => {
    let results = searchQuery.trim() ? searchVAForms(searchQuery) : vaFormGuide;
    if (activeCategory !== 'all') {
      results = results.filter(f => f.category === activeCategory);
    }
    return results;
  }, [searchQuery, activeCategory]);

  // Group by category when no search query
  const groupedForms = useMemo(() => {
    if (searchQuery.trim()) return null;
    const groups: Record<string, VAFormEntry[]> = {};
    for (const form of filteredForms) {
      if (!groups[form.category]) groups[form.category] = [];
      groups[form.category].push(form);
    }
    return groups;
  }, [filteredForms, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by form number, title, or use case (e.g., 21-526EZ, PTSD, denied, TDIU)"
          className="pl-9"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {categoryFilters.map(cf => (
          <button
            key={cf.value}
            onClick={() => setActiveCategory(cf.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              activeCategory === cf.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
            }`}
          >
            {cf.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {filteredForms.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No forms found matching &ldquo;{searchQuery}&rdquo;</p>
          </CardContent>
        </Card>
      ) : searchQuery.trim() ? (
        // Flat list when searching
        <div className="grid gap-4 md:grid-cols-2">
          {filteredForms.map(form => (
            <FormCard key={form.formNumber} form={form} />
          ))}
        </div>
      ) : groupedForms ? (
        // Grouped by category when no search
        <div className="space-y-6">
          {Object.entries(groupedForms).map(([cat, forms]) => (
            <div key={cat}>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {formCategoryLabels[cat as VAFormEntry['category']] || cat}
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {forms.map(form => (
                  <FormCard key={form.formNumber} form={form} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Tips */}
      <Card className="data-card">
        <CardContent className="pt-6">
          <h4 className="font-medium text-foreground mb-2">Tips for Filing Forms</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>&bull; <strong>File online when possible</strong> — it&apos;s faster and creates a digital paper trail</li>
            <li>&bull; <strong>Keep copies of everything</strong> — save PDFs of all submitted forms</li>
            <li>&bull; <strong>Work with a VSO</strong> — they can help ensure forms are filled out correctly</li>
            <li>&bull; <strong>Meet all deadlines</strong> — late submissions can delay or harm your claim</li>
            <li>&bull; <strong>Be thorough but accurate</strong> — incomplete or inconsistent information can cause issues</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function FormCard({ form }: { form: VAFormEntry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="data-card hover:border-primary/30 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <span className="text-primary font-mono">VA Form {form.formNumber}</span>
          <Badge
            variant="outline"
            className={`text-[10px] ${categoryColors[form.category] || ''}`}
          >
            {formCategoryLabels[form.category]}
          </Badge>
        </CardTitle>
        <p className="font-medium text-foreground text-sm">{form.shortTitle}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className={`text-sm text-muted-foreground ${!expanded ? 'line-clamp-2' : ''}`}>
          {form.purpose}
        </p>
        {form.purpose.length > 120 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-primary hover:underline"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
        {form.vaUrl && (
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a href={form.vaUrl} target="_blank" rel="noopener noreferrer">
              View on VA.gov
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
