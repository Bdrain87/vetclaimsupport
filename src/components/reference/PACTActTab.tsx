import { useState, useMemo } from 'react';
import { Search, AlertTriangle, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const pactActConditions = [
  { condition: 'Asthma (diagnosed after 9/11)', category: 'Respiratory' },
  { condition: 'Head Cancer (any type)', category: 'Cancer' },
  { condition: 'Neck Cancer', category: 'Cancer' },
  { condition: 'Respiratory Cancer (lung, bronchus, trachea, pleura)', category: 'Cancer' },
  { condition: 'Gastrointestinal Cancer (esophagus, stomach, small intestine, colon)', category: 'Cancer' },
  { condition: 'Reproductive Cancer (prostate, kidney, bladder, ovarian)', category: 'Cancer' },
  { condition: 'Lymphoma (any type)', category: 'Cancer' },
  { condition: 'Lymphomatic Cancer (any type)', category: 'Cancer' },
  { condition: 'Kidney Cancer', category: 'Cancer' },
  { condition: 'Brain Cancer', category: 'Cancer' },
  { condition: 'Melanoma', category: 'Cancer' },
  { condition: 'Pancreatic Cancer', category: 'Cancer' },
  { condition: 'Chronic Bronchitis', category: 'Respiratory' },
  { condition: 'COPD (Chronic Obstructive Pulmonary Disease)', category: 'Respiratory' },
  { condition: 'Constrictive Bronchiolitis', category: 'Respiratory' },
  { condition: 'Obliterative Bronchiolitis', category: 'Respiratory' },
  { condition: 'Emphysema', category: 'Respiratory' },
  { condition: 'Granulomatous Disease', category: 'Respiratory' },
  { condition: 'Interstitial Lung Disease (ILD)', category: 'Respiratory' },
  { condition: 'Pleuritis', category: 'Respiratory' },
  { condition: 'Pulmonary Fibrosis', category: 'Respiratory' },
  { condition: 'Sarcoidosis', category: 'Respiratory' },
  { condition: 'Chronic Sinusitis', category: 'Respiratory' },
  { condition: 'Chronic Rhinitis', category: 'Respiratory' },
  { condition: 'Glioblastoma', category: 'Cancer' },
  { condition: 'Squamous Cell Carcinoma of the Larynx', category: 'Cancer' },
  { condition: 'Adenocarcinoma of the Trachea', category: 'Cancer' },
  { condition: 'Salivary Gland Tumors', category: 'Cancer' },
];

const qualifyingLocations = [
  { region: 'Southwest Asia', locations: 'Iraq, Kuwait, Saudi Arabia, Bahrain, Qatar, UAE, Oman' },
  { region: 'Afghanistan', locations: 'Afghanistan and airspace above' },
  { region: 'Persian Gulf', locations: 'Gulf of Aden, Gulf of Oman, Persian Gulf, Arabian Sea, Red Sea' },
  { region: 'Horn of Africa', locations: 'Djibouti, Somalia, Yemen' },
  { region: 'Other', locations: 'Syria, Jordan, Egypt, Lebanon, Uzbekistan, and other designated areas' },
];

const timeline = [
  { date: 'August 10, 2022', event: 'PACT Act signed into law' },
  { date: 'January 1, 2023', event: 'Phase 1 presumptives effective for all toxic-exposed veterans' },
  { date: 'August 10, 2024', event: 'All presumptive conditions available with no phase-in period' },
];

export function PACTActTab() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConditions = useMemo(() => {
    if (!searchTerm.trim()) return pactActConditions;
    const lower = searchTerm.toLowerCase();
    return pactActConditions.filter(
      (c) => c.condition.toLowerCase().includes(lower) || c.category.toLowerCase().includes(lower)
    );
  }, [searchTerm]);

  const categories = [...new Set(pactActConditions.map((c) => c.category))];

  return (
    <div className="space-y-4">
      {/* Header Alert */}
      <Card className="data-card border-exposure/30 bg-exposure/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-exposure" />
            PACT Act Presumptive Conditions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-foreground/80">
            The <strong>PACT Act (2022)</strong> is the largest expansion of VA benefits in decades.
            It provides presumptive service connection for veterans exposed to burn pits, Agent Orange,
            and other toxic substances. <strong>Presumptive</strong> means you don't need to prove the
            connection to service - if you served in qualifying locations and have the condition, the
            VA presumes it's service-connected.
          </p>
          <div className="flex items-center gap-2 text-sm text-exposure font-medium">
            <Calendar className="h-4 w-4" />
            All presumptive conditions now available - no waiting periods
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card className="data-card">
        <CardContent className="pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search PACT Act conditions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Showing {filteredConditions.length} of {pactActConditions.length} presumptive conditions
          </p>
        </CardContent>
      </Card>

      {/* Conditions by Category */}
      {categories.map((category) => {
        const categoryConditions = filteredConditions.filter((c) => c.category === category);
        if (categoryConditions.length === 0) return null;
        return (
          <Card key={category} className="data-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {category}
                <Badge variant="secondary">{categoryConditions.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {categoryConditions.map((c) => (
                  <div key={c.condition} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-exposure flex-shrink-0" />
                    {c.condition}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Qualifying Locations */}
      <Card className="data-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Qualifying Service Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {qualifyingLocations.map((loc) => (
              <div key={loc.region} className="border rounded-lg p-3">
                <h4 className="font-medium text-foreground">{loc.region}</h4>
                <p className="text-sm text-muted-foreground mt-1">{loc.locations}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="data-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            PACT Act Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeline.map((item, idx) => (
              <div key={item.date} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {idx + 1}
                  </div>
                  {idx < timeline.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
                </div>
                <div className="pb-4">
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                  <p className="font-medium text-foreground">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
