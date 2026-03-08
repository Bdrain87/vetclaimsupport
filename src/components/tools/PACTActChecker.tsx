import { useState, useMemo } from 'react';
import { CheckCircle, XCircle, AlertCircle, MapPin, Calendar, ExternalLink, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  PACT_ACT_CONDITIONS,
  COVERED_LOCATIONS,
  getAllCoveredCountries,
  PACTCondition
} from '@/data/pactActConditions';

interface EligibilityResult {
  eligible: boolean;
  matchedLocations: string[];
  exposureTypes: string[];
  eligibleConditions: PACTCondition[];
}

export function PACTActChecker() {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [locationSearch, setLocationSearch] = useState('');
  const [serviceStart, setServiceStart] = useState('');
  const [serviceEnd, setServiceEnd] = useState('');
  const [result, setResult] = useState<EligibilityResult | null>(null);

  const allCountries = useMemo(() => getAllCoveredCountries(), []);

  const filteredCountries = useMemo(() => {
    if (!locationSearch) return allCountries.slice(0, 10);
    const search = locationSearch.toLowerCase();
    return allCountries.filter(c =>
      c.toLowerCase().includes(search)
    ).slice(0, 10);
  }, [locationSearch, allCountries]);

  const checkEligibility = () => {
    if (selectedLocations.length === 0) {
      return;
    }

    const exposureTypes: string[] = [];
    const matchedLocations: string[] = [];

    // Check each selected location against covered locations
    selectedLocations.forEach(loc => {
      const lowerLoc = loc.toLowerCase();

      COVERED_LOCATIONS.forEach(covered => {
        const matchesCountry = covered.countries.some(
          c => c.toLowerCase() === lowerLoc || lowerLoc.includes(c.toLowerCase())
        );

        if (matchesCountry) {
          matchedLocations.push(loc);
          if (!exposureTypes.includes(covered.exposureType)) {
            exposureTypes.push(covered.exposureType);
          }

          // Add related exposure types
          if (covered.exposureType === 'Burn Pit Exposure' && !exposureTypes.includes('Post-9/11')) {
            exposureTypes.push('Post-9/11');
          }
        }
      });
    });

    // Find eligible conditions based on exposure types
    const eligibleConditions = PACT_ACT_CONDITIONS.filter(condition =>
      condition.presumptiveFor.some(type => exposureTypes.includes(type))
    );

    setResult({
      eligible: eligibleConditions.length > 0,
      matchedLocations: [...new Set(matchedLocations)],
      exposureTypes: [...new Set(exposureTypes)],
      eligibleConditions
    });
  };

  const handleLocationSelect = (location: string) => {
    if (!selectedLocations.includes(location)) {
      setSelectedLocations([...selectedLocations, location]);
      setLocationSearch('');
    }
  };

  const removeLocation = (location: string) => {
    setSelectedLocations(selectedLocations.filter(l => l !== location));
    setResult(null);
  };

  const resetChecker = () => {
    setSelectedLocations([]);
    setLocationSearch('');
    setServiceStart('');
    setServiceEnd('');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 rounded-xl bg-gold/10 border border-gold/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gold">PACT Act Eligibility Checker</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Check if you may qualify for presumptive benefits under the PACT Act based on your service locations.
              This is for educational purposes only.
            </p>
          </div>
        </div>
      </div>

      {/* Location Input */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-primary" />
            Service Locations
          </CardTitle>
          <CardDescription>
            Enter countries or regions where you served
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              placeholder="Search locations (Iraq, Afghanistan, Vietnam...)"
              className="pl-10"
            />

            {/* Dropdown suggestions */}
            {locationSearch && filteredCountries.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredCountries.map((country) => (
                  <button
                    key={country}
                    onClick={() => handleLocationSelect(country)}
                    className={cn(
                      "w-full px-4 py-2 text-left text-sm hover:bg-muted",
                      "flex items-center gap-2 transition-colors",
                      selectedLocations.includes(country) && "bg-muted"
                    )}
                  >
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    {country}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected locations */}
          {selectedLocations.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedLocations.map(loc => (
                <Badge
                  key={loc}
                  variant="secondary"
                  className="gap-1 py-1.5 pr-1"
                >
                  {loc}
                  <button
                    onClick={() => removeLocation(loc)}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Date Range (Optional) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Service Dates (Optional)
          </CardTitle>
          <CardDescription>
            Helps narrow down applicable time periods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="service-start">Start Date</Label>
              <Input
                id="service-start"
                type="date"
                value={serviceStart}
                onChange={e => setServiceStart(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-end">End Date</Label>
              <Input
                id="service-end"
                type="date"
                value={serviceEnd}
                onChange={e => setServiceEnd(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Check Button */}
      <div className="flex gap-3">
        <Button
          onClick={checkEligibility}
          disabled={selectedLocations.length === 0}
          className="flex-1"
          size="lg"
        >
          Check Eligibility
        </Button>
        {(selectedLocations.length > 0 || result) && (
          <Button
            onClick={resetChecker}
            variant="outline"
            size="lg"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Results */}
      {result && (
        <Card className={cn(
          "border-2",
          result.eligible
            ? "border-success/50 bg-success/5"
            : "border-destructive/50 bg-destructive/5"
        )}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {result.eligible ? (
                <>
                  <CheckCircle className="w-8 h-8 text-success" />
                  <span className="text-success">You May Be Eligible!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-8 h-8 text-destructive" />
                  <span className="text-destructive">No Matches Found</span>
                </>
              )}
            </CardTitle>
            <CardDescription>
              {result.eligible
                ? 'Based on your service locations, you may qualify for presumptive benefits'
                : 'Try different locations or check dates'}
            </CardDescription>
          </CardHeader>

          {result.eligible && (
            <CardContent className="space-y-6">
              {/* Exposure Types */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Exposure Types</h4>
                <div className="flex flex-wrap gap-2">
                  {result.exposureTypes.map(type => (
                    <Badge key={type} variant="outline" className="bg-gold/10 text-gold border-gold/30">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Eligible Conditions */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">
                  Presumptive Conditions ({result.eligibleConditions.length})
                </h4>
                <div className="grid gap-2 max-h-[300px] overflow-y-auto overflow-x-hidden pr-2">
                  {result.eligibleConditions.map(condition => (
                    <div
                      key={condition.id}
                      className="flex items-center justify-between gap-2 p-3 bg-muted/50 rounded-lg border border-border"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-foreground break-words">{condition.condition}</span>
                        {condition.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{condition.description}</p>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {condition.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <a
                href="https://www.va.gov/resources/the-pact-act-and-your-va-benefits/"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg",
                  "bg-success hover:bg-success/90 text-success-foreground font-semibold",
                  "transition-colors"
                )}
              >
                Learn More About Filing
                <ExternalLink className="h-4 w-4" />
              </a>
            </CardContent>
          )}
        </Card>
      )}

      {/* Quick Info */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-foreground mb-3">About the PACT Act</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <span>Signed into law August 10, 2022</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <span>Expanded VA healthcare eligibility for toxic exposure</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <span>Added 23+ conditions to presumptive list</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <span>Covers burn pit exposure, Agent Orange, and Gulf War hazards</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default PACTActChecker;
