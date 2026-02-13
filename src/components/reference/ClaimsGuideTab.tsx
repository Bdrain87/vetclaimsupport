import { Clock, FileText, AlertTriangle, ExternalLink, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ClaimsGuideTab() {
  return (
    <div className="space-y-4">
      {/* BDD Timeline */}
      <Card className="data-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            BDD Claim Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  180
                </div>
                <div className="w-0.5 flex-1 bg-border mt-2" />
              </div>
              <div className="pb-8">
                <h4 className="font-semibold">180 Days Before Separation</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Earliest you can file a BDD claim. Start gathering medical records, buddy statements,
                  and documenting all conditions.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  90
                </div>
                <div className="w-0.5 flex-1 bg-border mt-2" />
              </div>
              <div className="pb-8">
                <h4 className="font-semibold">90 Days Before Separation</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Last day to file a BDD claim. After this, you must wait until after separation.
                  Submit your claim and attend C&P exams.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success text-success-foreground font-bold text-sm">
                  0
                </div>
              </div>
              <div>
                <h4 className="font-semibold">Separation Date</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  If BDD completed properly, you may receive your rating decision shortly after separation,
                  with benefits starting immediately.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* C&P Exam Tips */}
      <Card className="data-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            C&P Exam Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="font-medium">Describe Your Worst Days</p>
                <p className="text-sm text-muted-foreground">
                  Don't minimize symptoms. Explain how conditions affect you at their worst.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="font-medium">Be Specific About Impact</p>
                <p className="text-sm text-muted-foreground">
                  Explain exactly how conditions affect work, daily activities, and relationships.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="font-medium">Bring Documentation</p>
                <p className="text-sm text-muted-foreground">
                  Bring copies of relevant medical records, buddy statements, and personal notes.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="font-medium">Don't Tough It Out</p>
                <p className="text-sm text-muted-foreground">
                  The examiner measures what they see. If something hurts, say so. Show limitations.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="font-medium">Mention Flare-Ups</p>
                <p className="text-sm text-muted-foreground">
                  Discuss frequency, duration, and severity of flare-ups even if not occurring during exam.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="font-medium">Arrive Early</p>
                <p className="text-sm text-muted-foreground">
                  Being late or missing the exam can result in denial. Arrive 15 minutes early.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
            <h4 className="font-medium text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Common Mistakes to Avoid
            </h4>
            <ul className="mt-2 space-y-1 text-sm text-foreground/80">
              <li>• Saying "I'm fine" or downplaying symptoms</li>
              <li>• Not mentioning flare-ups or bad days</li>
              <li>• Forgetting to mention all conditions being claimed</li>
              <li>• Being late or missing the exam (can result in denial)</li>
              <li>• Not reviewing your medical records before the exam</li>
              <li>• Failing to describe functional limitations</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Tips */}
      <Card className="data-card">
        <CardHeader>
          <CardTitle className="text-lg">Building Strong Evidence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Service Treatment Records</h4>
              <p className="text-sm text-muted-foreground">
                Your in-service medical records showing treatment, complaints, or diagnosis of conditions.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Buddy Statements</h4>
              <p className="text-sm text-muted-foreground">
                Written statements from fellow service members who witnessed your condition or injuries.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Doctor Summaries</h4>
              <p className="text-sm text-muted-foreground">
                Medical opinion linking your current condition to military service.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Personal Statement</h4>
              <p className="text-sm text-muted-foreground">
                Your detailed account of how conditions affect daily life and work.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card className="data-card">
        <CardHeader>
          <CardTitle className="text-lg">Helpful Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href="https://www.va.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">VA.gov</span>
            </a>
            <a
              href="https://www.ebenefits.va.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">eBenefits</span>
            </a>
            <a
              href="https://www.va.gov/pact"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">PACT Act Info</span>
            </a>
            <a
              href="https://www.reddit.com/r/VeteransBenefits"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">r/VeteransBenefits</span>
            </a>
            <a
              href="https://www.va.gov/disability/how-to-file-claim/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">How to File a Claim</span>
            </a>
            <a
              href="https://www.va.gov/disability/eligibility/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Eligibility Requirements</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
