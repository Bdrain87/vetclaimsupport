import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Clock,
  FileText,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Calendar,
  Shield,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProfileStore } from '@/store/useProfileStore';
import { BDDCountdown } from '@/components/dashboard/BDDCountdown';
import { PageContainer } from '@/components/PageContainer';

const VA_BDD_URL = 'https://www.va.gov/disability/how-to-file-claim/when-to-file/pre-discharge-claim/';

export default function BDDGuide() {
  const navigate = useNavigate();
  const separationDate = useProfileStore((s) => s.separationDate);
  const setSeparationDate = useProfileStore((s) => s.setSeparationDate);

  const parsedDate = (() => {
    if (!separationDate) return null;
    const d = new Date(separationDate + 'T00:00:00');
    return isNaN(d.getTime()) ? null : d;
  })();

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      setSeparationDate(`${y}-${m}-${d}`);
    }
  };

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
            <Clock className="h-5 w-5 text-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">BDD Claim Guide</h1>
            <p className="text-muted-foreground text-sm">
              Benefits Delivery at Discharge
            </p>
          </div>
        </div>
      </motion.div>

      {/* BDD Countdown (interactive) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <BDDCountdown
          separationDate={parsedDate}
          onSeparationDateChange={handleDateChange}
        />
      </motion.div>

      {/* What is BDD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-primary" />
              What Is BDD?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Benefits Delivery at Discharge (BDD)</strong> allows
              active-duty service members to file a VA disability claim{' '}
              <strong className="text-foreground">180 to 90 days</strong> before their separation date.
            </p>

            <div className="p-4 rounded-lg bg-success/5 border border-success/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Why It Matters</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Filing through BDD means you can receive your VA rating decision close to your separation date.
                    This can mean disability compensation starting <strong className="text-foreground">the day after you separate</strong>,
                    instead of waiting months or years.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                The 180-90 Day Filing Window
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <Badge variant="outline" className="mr-2 border-success/50 text-success">180 days</Badge>
                  Window opens — earliest you can file a BDD claim
                </p>
                <p>
                  <Badge variant="outline" className="mr-2 border-gold/50 text-gold">90 days</Badge>
                  Window closes — last day to file through BDD
                </p>
                <p>
                  <Badge variant="outline" className="mr-2 border-destructive/50 text-destructive">&lt; 90 days</Badge>
                  Must file a standard claim (can still file before separation)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Required Documents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              What You Need to File BDD
            </CardTitle>
            <CardDescription>
              Gather these documents before your filing window opens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                {
                  title: 'Service Treatment Records (STRs)',
                  desc: 'Request a complete copy from your military treatment facility (MTF) records office.',
                },
                {
                  title: 'DD-214 or Separation Orders',
                  desc: 'A copy of your anticipated DD-214 or orders showing your separation date.',
                },
                {
                  title: 'VA Form 21-526EZ',
                  desc: 'Application for Disability Compensation. You can start this on VA.gov.',
                },
                {
                  title: 'Personal Statements',
                  desc: 'Written statements describing how your conditions affect your daily life.',
                },
                {
                  title: 'Buddy Statements',
                  desc: 'Statements from fellow service members or family who witnessed your condition(s).',
                },
                {
                  title: 'Medical Evidence',
                  desc: 'Any private medical records, diagnoses, or test results that support your claims.',
                },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-foreground">{item.title}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Step by Step */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-primary" />
              Step-by-Step BDD Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  step: '1',
                  title: 'Know Your Separation Date',
                  desc: 'Confirm your ETS/DOS date. The BDD window is calculated from this date.',
                },
                {
                  step: '2',
                  title: 'Gather Evidence Early',
                  desc: 'Request your STRs, get buddy statements, and document all conditions while still on active duty with access to military healthcare.',
                },
                {
                  step: '3',
                  title: 'File 180-90 Days Before Separation',
                  desc: 'Submit your VA Form 21-526EZ through VA.gov. You must submit all evidence at the time of filing.',
                },
                {
                  step: '4',
                  title: 'Attend Your C&P Exam',
                  desc: 'The VA will schedule a Compensation & Pension exam. This may be at a VA facility or through a contracted examiner. Do NOT miss this appointment.',
                },
                {
                  step: '5',
                  title: 'Receive Your Decision',
                  desc: 'The VA aims to deliver a rating decision close to your separation date. Benefits begin the day after separation if approved.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {item.step}
                    </div>
                    {item.step !== '5' && <div className="w-px h-full bg-border mt-2" />}
                  </div>
                  <div className="pb-4">
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Important Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5 text-gold" />
              Important BDD Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                'You must be available for C&P exams in the US for 45 days after filing.',
                'Submit ALL evidence with your initial claim — you cannot add evidence after filing through BDD.',
                'If you miss the BDD window, you can still file a standard claim before or after separation.',
                'Filing through BDD does NOT guarantee a decision by separation day, but it significantly speeds up the process.',
                'Use the Transition Assistance Program (TAP) benefits counseling for additional help.',
                'Consider filing an Intent to File (ITF) before your BDD window opens to lock in an even earlier effective date.',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0 mt-2" />
                  <span className="text-sm text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* VA.gov Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="border-primary/20">
          <CardContent className="py-5">
            <a
              href={VA_BDD_URL}
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
                    Official VA BDD Info Page
                  </p>
                  <p className="text-xs text-muted-foreground">
                    va.gov - Pre-Discharge Claim Filing
                  </p>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </a>
          </CardContent>
        </Card>
      </motion.div>

      <p className="text-xs text-muted-foreground/70 text-center">
        Based on publicly available VA resources. Consult a VSO for personalized guidance.
      </p>
    </PageContainer>
  );
}
