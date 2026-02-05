import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, AlertCircle, ExternalLink } from 'lucide-react';
import { PACT_ACT_CONDITIONS, COVERED_LOCATIONS } from '../data/pactActConditions';
import { DBQ_REFERENCES } from '../data/dbqReferences';
import { RATING_CRITERIA } from '../data/ratingCriteria';

export default function VAResources() {
  const [activeTab, setActiveTab] = useState<'pact' | 'dbq' | 'ratings'>('pact');
  const [expandedCondition, setExpandedCondition] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPactConditions = PACT_ACT_CONDITIONS.filter(c =>
    c.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDBQs = DBQ_REFERENCES.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.conditions.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredRatings = RATING_CRITERIA.filter(r =>
    r.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">VA Resources</h1>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search conditions, DBQs, or rating criteria..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        {[
          { id: 'pact', label: 'PACT Act Conditions' },
          { id: 'dbq', label: 'DBQ References' },
          { id: 'ratings', label: 'Rating Criteria' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'pact' | 'dbq' | 'ratings')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PACT Act Tab */}
      {activeTab === 'pact' && (
        <div className="space-y-4">
          <div className="bg-amber-900/30 border border-amber-600/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-300">PACT Act - Effective August 10, 2022</h3>
                <p className="text-sm text-amber-200/80 mt-1">
                  The PACT Act expands VA benefits for Veterans exposed to burn pits, Agent Orange, and other toxic substances.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {filteredPactConditions.map(condition => (
              <div
                key={condition.id}
                className="bg-card rounded-lg border border-border overflow-hidden"
              >
                <button
                  onClick={() => setExpandedCondition(expandedCondition === condition.id ? null : condition.id)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div>
                    <span className="font-medium text-foreground">{condition.condition}</span>
                    <span className="ml-2 text-xs px-2 py-0.5 bg-primary/30 text-primary rounded">
                      {condition.category}
                    </span>
                  </div>
                  {expandedCondition === condition.id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                {expandedCondition === condition.id && (
                  <div className="px-4 pb-4 text-sm text-muted-foreground border-t border-border pt-3 space-y-2">
                    <p><strong>Presumptive for:</strong> {condition.presumptiveFor.join(', ')}</p>
                    <p><strong>Effective Date:</strong> {condition.effectiveDate}</p>
                    {condition.notes && <p><strong>Notes:</strong> {condition.notes}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Covered Locations */}
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="font-semibold text-foreground mb-3">Covered Locations</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {COVERED_LOCATIONS.map(loc => (
                <div key={loc.region}>
                  <h4 className="text-primary font-medium">{loc.region}</h4>
                  <p className="text-sm text-muted-foreground">{loc.countries.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DBQ Tab */}
      {activeTab === 'dbq' && (
        <div className="grid gap-4">
          {filteredDBQs.map(dbq => (
            <div
              key={dbq.id}
              className="bg-card rounded-lg border border-border p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{dbq.name}</h3>
                  <p className="text-sm text-primary">VA Form {dbq.vaFormNumber}</p>
                </div>
                <a
                  href={`https://www.va.gov/find-forms/?q=${dbq.vaFormNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Key Findings</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {dbq.keyFindings.map((finding, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Tips</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {dbq.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400">★</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rating Criteria Tab */}
      {activeTab === 'ratings' && (
        <div className="space-y-4">
          {filteredRatings.map(criteria => (
            <div
              key={criteria.diagnosticCode}
              className="bg-card rounded-lg border border-border p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">{criteria.condition}</h3>
                <span className="text-sm text-muted-foreground">DC {criteria.diagnosticCode}</span>
              </div>

              <div className="space-y-3">
                {criteria.levels.map(level => (
                  <div
                    key={level.percentage}
                    className="flex items-start gap-4 p-3 bg-muted/30 rounded-lg"
                  >
                    <div className={`w-14 h-14 flex items-center justify-center rounded-lg font-bold text-lg ${
                      level.percentage >= 70 ? 'bg-red-600/30 text-red-400' :
                      level.percentage >= 50 ? 'bg-orange-600/30 text-orange-400' :
                      level.percentage >= 30 ? 'bg-yellow-600/30 text-yellow-400' :
                      'bg-gray-600/30 text-muted-foreground'
                    }`}>
                      {level.percentage}%
                    </div>
                    <div className="flex-1">
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {level.criteria.map((c, i) => (
                          <li key={i}>• {c}</li>
                        ))}
                      </ul>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {level.keywords.slice(0, 4).map((kw, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
