import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Clock,
  Calendar,
  Shield,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  FileText,
  Phone,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useProfileStore } from '@/store/useProfileStore';
import { PageContainer } from '@/components/PageContainer';

const ITF_DURATION_DAYS = 365;
const VA_ITF_URL = 'https://www.va.gov/resources/your-intent-to-file-a-va-claim/';
const VA_PHONE = '1-800-827-1000';

interface TimeRemaining {
  totalDays: number;
  months: number;
  days: number;
  percentElapsed: number;
  percentRemaining: number;
  isExpired: boolean;
  isExpiringSoon: boolean;
  expirationDate: Date;
}

function calculateTimeRemaining(itfDateStr: string): TimeRemaining | null {
  const itfDate = new Date(itfDateStr + 'T00:00:00');
  if (isNaN(itfDate.getTime())) return null;

  const expirationDate = new Date(itfDate);
  expirationDate.setDate(expirationDate.getDate() + ITF_DURATION_DAYS);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const msRemaining = expirationDate.getTime() - now.getTime();
  const totalDays = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
  const clampedDays = Math.max(0, totalDays);

  const months = Math.floor(clampedDays / 30);
  const days = clampedDays % 30;

  const msElapsed = now.getTime() - itfDate.getTime();
  const totalMs = ITF_DURATION_DAYS * 24 * 60 * 60 * 1000;
  const percentElapsed = Math.min(100, Math.max(0, (msElapsed / totalMs) * 100));
  const percentRemaining = 100 - percentElapsed;

  return {
    totalDays: clampedDays,
    months,
    days,
    percentElapsed,
    percentRemaining,
    isExpired: totalDays <= 0,
    isExpiringSoon: totalDays > 0 && totalDays <= 90,
    expirationDate,
  };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function IntentToFile() {
  const navigate = useNavigate();
  const { intentToFileDate, setIntentToFile } =
    useProfileStore();

  const [dateInput, setDateInput] = useState(intentToFileDate ?? '');
  const [hasSubmitted, setHasSubmitted] = useState(!!intentToFileDate);

  const timeRemaining = useMemo(() => {
    if (!dateInput) return null;
    return calculateTimeRemaining(dateInput);
  }, [dateInput]);

  const handleSaveDate = () => {
    if (!dateInput || !timeRemaining) return;
    setIntentToFile(true, dateInput);
    setHasSubmitted(true);
  };

  const handleClearDate = () => {
    setDateInput('');
    setIntentToFile(false, undefined);
    setHasSubmitted(false);
  };

  const getStatusColor = () => {
    if (!timeRemaining) return 'text-muted-foreground';
    if (timeRemaining.isExpired) return 'text-red-400';
    if (timeRemaining.isExpiringSoon) return 'text-gold';
    return 'text-emerald-400';
  };

  const getProgressColor = () => {
    if (!timeRemaining) return '';
    if (timeRemaining.isExpired) return '[&>div]:bg-red-500';
    if (timeRemaining.isExpiringSoon) return '[&>div]:bg-gold';
    return '[&>div]:bg-emerald-500';
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <PageContainer className="py-6 sm:py-8 space-y-6">
        {/* Back Navigation */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground -ml-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Intent to File
              </h1>
              <p className="text-muted-foreground text-sm">
                Protect your effective date while you prepare your claim
              </p>
            </div>
          </div>
        </div>

        {/* Countdown Card - shown when date is saved */}
        {hasSubmitted && timeRemaining && (
          <Card
            className={`overflow-hidden border ${
              timeRemaining.isExpired
                ? 'border-red-500/30'
                : timeRemaining.isExpiringSoon
                ? 'border-[rgba(197,164,66,0.3)]'
                : 'border-emerald-500/30'
            }`}
          >
            <div
              className={`p-6 ${
                timeRemaining.isExpired
                  ? 'bg-red-500/5'
                  : timeRemaining.isExpiringSoon
                  ? 'bg-[rgba(197,164,66,0.05)]'
                  : 'bg-emerald-500/5'
              }`}
            >
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <Badge
                  variant="outline"
                  className={`${
                    timeRemaining.isExpired
                      ? 'border-red-500/50 text-red-400'
                      : timeRemaining.isExpiringSoon
                      ? 'border-[rgba(197,164,66,0.5)] text-gold'
                      : 'border-emerald-500/50 text-emerald-400'
                  }`}
                >
                  {timeRemaining.isExpired ? (
                    <>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Expired
                    </>
                  ) : timeRemaining.isExpiringSoon ? (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      Expiring Soon
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Active
                    </>
                  )}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearDate}
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  Edit Date
                </Button>
              </div>

              {/* Main Countdown */}
              <div className="text-center mb-6">
                {timeRemaining.isExpired ? (
                  <>
                    <p className="text-5xl font-bold text-red-400 mb-1">
                      Expired
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Your Intent to File expired on{' '}
                      {formatDate(timeRemaining.expirationDate)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className={`text-5xl font-bold ${getStatusColor()} mb-1`}>
                      {timeRemaining.totalDays}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {timeRemaining.totalDays === 1 ? 'day' : 'days'} remaining
                      to file your claim
                    </p>
                    {timeRemaining.months > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        ({timeRemaining.months}{' '}
                        {timeRemaining.months === 1 ? 'month' : 'months'} and{' '}
                        {timeRemaining.days}{' '}
                        {timeRemaining.days === 1 ? 'day' : 'days'})
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Filed: {formatDate(new Date(dateInput + 'T00:00:00'))}</span>
                  <span>
                    Expires: {formatDate(timeRemaining.expirationDate)}
                  </span>
                </div>
                <Progress
                  value={timeRemaining.percentRemaining}
                  className={`h-3 ${getProgressColor()}`}
                />
                <p className="text-xs text-center text-muted-foreground">
                  {Math.round(timeRemaining.percentElapsed)}% of time elapsed
                </p>
              </div>

              {/* Urgency Warning */}
              {timeRemaining.isExpiringSoon && !timeRemaining.isExpired && (
                <div className="mt-4 flex items-start gap-3 p-3 rounded-lg bg-[rgba(197,164,66,0.1)] border border-[rgba(197,164,66,0.2)]">
                  <AlertCircle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gold">
                      Your ITF expires in less than 90 days
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Submit your claim before{' '}
                      {formatDate(timeRemaining.expirationDate)} to preserve your
                      effective date. If you need more time, you can file a new
                      Intent to File.
                    </p>
                  </div>
                </div>
              )}

              {timeRemaining.isExpired && (
                <div className="mt-4 flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-400">
                      Your Intent to File has expired
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      You will need to file a new Intent to File to establish a
                      new effective date. Your effective date will be the date of
                      your new ITF, not the original one.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Date Entry Card - shown when no date is saved */}
        {!hasSubmitted && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                Track Your Intent to File
              </CardTitle>
              <CardDescription>
                Enter the date you filed (or plan to file) your Intent to File
                with the VA to start tracking your deadline.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="itf-date" className="text-sm font-medium">
                  ITF Filing Date
                </Label>
                <Input
                  id="itf-date"
                  type="date"
                  value={dateInput}
                  max={todayStr}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">
                  This is the date the VA received your Intent to File.
                </p>
              </div>

              {/* Preview before saving */}
              {dateInput && timeRemaining && (
                <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Days remaining:
                    </span>
                    <span className={`text-sm font-semibold ${getStatusColor()}`}>
                      {timeRemaining.isExpired
                        ? 'Expired'
                        : `${timeRemaining.totalDays} days`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Expiration date:
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {formatDate(timeRemaining.expirationDate)}
                    </span>
                  </div>
                </div>
              )}

              <Button
                onClick={handleSaveDate}
                disabled={!dateInput || !timeRemaining}
                className="w-full"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Save ITF Date
              </Button>
            </CardContent>
          </Card>
        )}

        {/* What Is an Intent to File */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              What Is an Intent to File?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              An Intent to File (ITF) is a formal notice to the VA that you plan
              to file a claim for disability compensation, pension, or survivors
              benefits. It is one of the most important first steps you can take
              in the claims process.
            </p>

            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Preserves Your Effective Date
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    When you file an ITF, the VA locks in your potential
                    effective date for up to <strong>one year (365 days)</strong>.
                    If your claim is approved, your benefits may be backdated to
                    the date of your Intent to File rather than the date you
                    submitted your completed claim. This can mean months of
                    additional back pay.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Key Facts
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    You have <strong>1 year</strong> from the date of your ITF to
                    submit your completed claim
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Filing an ITF is free and carries no obligation to file a
                    claim
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    You can file for disability compensation, pension, or
                    Dependency and Indemnity Compensation (DIC)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    If your ITF expires before you file, you can submit a new one
                    to start a fresh 1-year window
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Starting a claim on VA.gov automatically creates an ITF for
                    you
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How to File */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              How to File an Intent to File
            </CardTitle>
            <CardDescription>
              There are three ways to submit your Intent to File with the VA.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Online */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 flex-shrink-0">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    Online at VA.gov
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sign in to VA.gov and start a disability compensation claim.
                    The system automatically creates an Intent to File when you
                    begin the application. You do not need to complete the full
                    claim right away.
                  </p>
                  <a
                    href="https://www.va.gov/disability/file-disability-claim-form-21-526ez/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium mt-2"
                  >
                    Start on VA.gov
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  Fastest
                </Badge>
              </div>
            </div>

            {/* Phone */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 flex-shrink-0">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    Call the VA
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Call the VA benefits hotline and tell the representative you
                    want to file an Intent to File. They will process it for you
                    over the phone.
                  </p>
                  <a
                    href={`tel:${VA_PHONE.replace(/-/g, '')}`}
                    className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium mt-2"
                  >
                    <Phone className="h-3 w-3" />
                    {VA_PHONE}
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    Monday through Friday, 8:00 a.m. to 9:00 p.m. ET
                  </p>
                </div>
              </div>
            </div>

            {/* In Person */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 flex-shrink-0">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    In Person at a Regional Office
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Visit your nearest VA regional office and request to file an
                    Intent to File. A VA employee will help you complete the
                    process. You can also work with a Veterans Service
                    Organization (VSO) representative.
                  </p>
                  <a
                    href="https://www.va.gov/find-locations/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium mt-2"
                  >
                    Find a VA location
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What Happens After Filing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-primary" />
              What Happens After You File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    1
                  </div>
                  <div className="w-px h-full bg-border mt-2" />
                </div>
                <div className="pb-6">
                  <h3 className="text-sm font-semibold text-foreground">
                    Confirmation
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The VA acknowledges your Intent to File and your 1-year clock
                    begins. If you filed online, you will see a confirmation on
                    VA.gov. Keep a record of the date.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    2
                  </div>
                  <div className="w-px h-full bg-border mt-2" />
                </div>
                <div className="pb-6">
                  <h3 className="text-sm font-semibold text-foreground">
                    Gather Your Evidence
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Use the time to collect medical records, buddy statements,
                    service treatment records, doctor summaries, and other
                    supporting evidence. A thorough claim takes time to prepare
                    properly.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    3
                  </div>
                  <div className="w-px h-full bg-border mt-2" />
                </div>
                <div className="pb-6">
                  <h3 className="text-sm font-semibold text-foreground">
                    Submit Your Claim
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    File your completed claim (VA Form 21-526EZ) before the
                    1-year deadline. Your effective date will be the date of your
                    Intent to File, potentially resulting in additional back pay.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Effective Date Locked In
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    If your claim is approved and you filed within the 1-year
                    window, your benefits effective date will be set to your ITF
                    date. This determines when your compensation payments begin.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deadline Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5 text-gold" />
              Important Deadline Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0 mt-2" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">
                    Set a reminder at 9 months.
                  </strong>{' '}
                  Give yourself at least 3 months to finalize and submit your
                  claim. Rushed claims often miss critical evidence.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0 mt-2" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">
                    You can file a new ITF at any time.
                  </strong>{' '}
                  If your ITF expires, you do not lose your right to file a
                  claim. You just lose the earlier effective date. File a new ITF
                  to start a fresh 1-year window.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0 mt-2" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">
                    Each benefit type needs its own ITF.
                  </strong>{' '}
                  An ITF for disability compensation does not cover a pension
                  claim or DIC. File separate ITFs if you are applying for
                  multiple benefit types.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0 mt-2" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">
                    Partial submissions count.
                  </strong>{' '}
                  Even an incomplete claim submitted before the deadline will
                  preserve your effective date. You can add evidence afterward
                  using the supplemental claim lane.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* VA.gov Link */}
        <Card className="border-primary/20">
          <CardContent className="py-5">
            <a
              href={VA_ITF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    Official VA Intent to File Page
                  </p>
                  <p className="text-xs text-muted-foreground">
                    va.gov - Learn more about the ITF process
                  </p>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </a>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="p-4 bg-muted/30 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            This page is for educational and personal tracking purposes only. It
            does not file an Intent to File with the VA on your behalf. To
            officially file an ITF, use one of the methods described above. All
            information is based on publicly available VA resources and is
            provided for general guidance. For personalized legal or benefits
            advice, consult with an accredited Veterans Service Organization
            (VSO) or VA-accredited attorney.
          </p>
        </div>
    </PageContainer>
  );
}
