import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Navigation,
  ExternalLink,
  Info,
  DollarSign,
  Car,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { PageContainer } from '@/components/PageContainer';

const RATE_PER_MILE = 0.415;
const DEDUCTIBLE_ONE_WAY = 3.0;
const DEDUCTIBLE_ROUND_TRIP = DEDUCTIBLE_ONE_WAY * 2;
const BTSSS_URL = 'https://dvagov-btsss.dynamics365portals.us/';

export default function TravelPayCalculator() {
  const navigate = useNavigate();

  // Validate numeric input: reject negative values
  const sanitizeNumericInput = (value: string): string => {
    if (value === '' || value === '.') return value;
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return '';
    return value;
  };

  const [oneWayMiles, setOneWayMiles] = useState('');
  const [tolls, setTolls] = useState('');
  const [parking, setParking] = useState('');
  const [deductibleWaived, setDeductibleWaived] = useState(false);
  const [appointmentsPerMonth, setAppointmentsPerMonth] = useState(4);

  const calculations = useMemo(() => {
    const miles = parseFloat(oneWayMiles) || 0;
    const tollsCost = parseFloat(tolls) || 0;
    const parkingCost = parseFloat(parking) || 0;

    const roundTripMiles = miles * 2;
    const mileageReimbursement = roundTripMiles * RATE_PER_MILE;
    const subtotal = mileageReimbursement + tollsCost + parkingCost;
    const deduction = deductibleWaived ? 0 : DEDUCTIBLE_ROUND_TRIP;
    const tripTotal = Math.max(0, subtotal - deduction);
    const monthlyTotal = tripTotal * appointmentsPerMonth;
    const annualTotal = monthlyTotal * 12;

    return {
      roundTripMiles,
      mileageReimbursement,
      subtotal,
      deduction,
      tripTotal,
      monthlyTotal,
      annualTotal,
    };
  }, [oneWayMiles, tolls, parking, deductibleWaived, appointmentsPerMonth]);

  return (
    <PageContainer className="py-6 sm:py-8 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="text-muted-foreground hover:text-foreground -ml-2"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gold/10 border border-gold/20">
            <Navigation className="h-5 w-5 text-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Travel Pay Calculator</h1>
            <p className="text-muted-foreground text-sm">
              Estimate your VA travel reimbursement
            </p>
          </div>
        </div>
      </motion.div>

      {/* Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Car className="h-5 w-5 text-primary" />
              Trip Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* One-way miles */}
            <div className="space-y-2">
              <Label htmlFor="one-way-miles">One-Way Distance (miles)</Label>
              <Input
                id="one-way-miles"
                type="number"
                inputMode="decimal"
                min="0"
                value={oneWayMiles}
                onChange={(e) => setOneWayMiles(sanitizeNumericInput(e.target.value))}
                placeholder="e.g., 25"
                className="bg-muted/50"
              />
              {oneWayMiles && (
                <p className="text-xs text-muted-foreground">
                  Round trip: {calculations.roundTripMiles.toFixed(1)} miles
                </p>
              )}
            </div>

            {/* Tolls */}
            <div className="space-y-2">
              <Label htmlFor="tolls">Tolls (round trip, optional)</Label>
              <Input
                id="tolls"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={tolls}
                onChange={(e) => setTolls(sanitizeNumericInput(e.target.value))}
                placeholder="$0.00"
                className="bg-muted/50"
              />
            </div>

            {/* Parking */}
            <div className="space-y-2">
              <Label htmlFor="parking">Parking (optional)</Label>
              <Input
                id="parking"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={parking}
                onChange={(e) => setParking(sanitizeNumericInput(e.target.value))}
                placeholder="$0.00"
                className="bg-muted/50"
              />
            </div>

            {/* Deductible toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
              <div className="space-y-0.5">
                <Label htmlFor="deductible-waiver" className="text-sm font-medium">
                  Deductible Waived?
                </Label>
                <p className="text-xs text-muted-foreground">
                  VA charges $3.00/one-way ($6.00 round trip). Waived for SC conditions rated 30%+, some other criteria.
                </p>
              </div>
              <Switch
                id="deductible-waiver"
                checked={deductibleWaived}
                onCheckedChange={setDeductibleWaived}
              />
            </div>

            {/* Monthly appointments */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Appointments per Month</Label>
                <span className="text-sm font-bold text-foreground">
                  {appointmentsPerMonth}
                </span>
              </div>
              <Slider
                value={[appointmentsPerMonth]}
                onValueChange={([v]) => setAppointmentsPerMonth(v)}
                min={1}
                max={20}
                step={1}
                className="w-full"
                aria-label={`${appointmentsPerMonth} appointments per month`}
                aria-valuetext={`${appointmentsPerMonth} appointments per month`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>20</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border-gold/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-gold" />
              Estimated Reimbursement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Per-trip breakdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Mileage ({calculations.roundTripMiles.toFixed(1)} mi x ${RATE_PER_MILE})</span>
                <span className="text-foreground font-medium">
                  ${calculations.mileageReimbursement.toFixed(2)}
                </span>
              </div>
              {parseFloat(tolls) > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tolls</span>
                  <span className="text-foreground font-medium">${(parseFloat(tolls) || 0).toFixed(2)}</span>
                </div>
              )}
              {parseFloat(parking) > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Parking</span>
                  <span className="text-foreground font-medium">${(parseFloat(parking) || 0).toFixed(2)}</span>
                </div>
              )}
              {!deductibleWaived && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Deductible (round trip)</span>
                  <span className="text-destructive font-medium" aria-label={`Deductible: minus $${DEDUCTIBLE_ROUND_TRIP.toFixed(2)}`}>
                    -${DEDUCTIBLE_ROUND_TRIP.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="border-t border-border pt-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Per Trip</span>
                <span
                  className="text-xl font-bold text-gold"
                >
                  ${calculations.tripTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Monthly & Annual */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  Monthly ({appointmentsPerMonth} visits)
                </p>
                <p className="text-lg font-bold text-gold">
                  ${calculations.monthlyTotal.toFixed(2)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
                <p className="text-xs text-muted-foreground mb-1">Annual Estimate</p>
                <p className="text-lg font-bold text-gold">
                  ${calculations.annualTotal.toFixed(2)}
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Based on current VA mileage rate of ${RATE_PER_MILE}/mile
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Eligibility Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="h-5 w-5 text-primary" />
              Who Qualifies for Travel Pay?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {[
                'Veterans traveling for VA medical care at a VA facility',
                'Veterans with a service-connected disability rated 30% or higher (deductible waived)',
                'Veterans traveling for a C&P exam (deductible waived)',
                'Veterans receiving VA pension benefits',
                'Veterans whose income does not exceed the maximum VA pension rate',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0 mt-2" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* How to Submit */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Navigation className="h-5 w-5 text-primary" />
              How to Submit a Travel Claim
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                {
                  step: '1',
                  title: 'Submit Online via BTSSS',
                  desc: 'Use the Beneficiary Travel Self-Service System (BTSSS) to file your claim within 30 days of your appointment.',
                },
                {
                  step: '2',
                  title: 'Keep Your Receipts',
                  desc: 'Save receipts for tolls, parking, public transit, or other travel expenses. You may need to upload them.',
                },
                {
                  step: '3',
                  title: 'Check Your Payment',
                  desc: 'Reimbursements are typically paid via direct deposit to the bank account on file with the VA.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {item.step}
                    </div>
                    {item.step !== '3' && <div className="w-px h-full bg-border mt-2" />}
                  </div>
                  <div className="pb-4">
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href={BTSSS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-gold/10 border border-gold/20 group hover:bg-gold/15 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Navigation className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-gold transition-colors">
                    VA BTSSS Portal
                  </p>
                  <p className="text-xs text-muted-foreground">
                    File your travel pay claim online
                  </p>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-gold transition-colors flex-shrink-0" />
            </a>
          </CardContent>
        </Card>
      </motion.div>

      <p className="text-xs text-muted-foreground/70 text-center">
        Estimate only — actual reimbursement may vary. Visit the VA BTSSS portal for official info.
      </p>
    </PageContainer>
  );
}
