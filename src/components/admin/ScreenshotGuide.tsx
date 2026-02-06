import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Smartphone,
  Tablet,
  ExternalLink,
  CheckCircle,
  Circle,
  ChevronRight,
  Download,
  Calculator,
  ClipboardCheck,
  Link2,
  BookOpen,
  FolderOpen,
  FileText,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const SCREENSHOTS = [
  {
    id: 1,
    caption: 'Know your combined VA rating instantly',
    description: 'Calculator showing combined rating with monthly compensation',
    page: '/calculator',
    icon: Calculator,
    keyElements: ['Rating percentage display', 'Monthly pay calculation', 'Bilateral factor indicator'],
    tips: 'Show a realistic rating (e.g., 70% or 80%) with multiple conditions listed'
  },
  {
    id: 2,
    caption: 'Track every service-connected condition',
    description: 'Conditions list with ratings and secondary connections',
    page: '/',
    icon: Target,
    keyElements: ['Condition cards with ratings', 'Secondary connection badges', 'Total rating indicator'],
    tips: 'Include mix of mental health, musculoskeletal, and other conditions'
  },
  {
    id: 3,
    caption: 'Dominate your C&P exam',
    description: 'Exam Companion document with condition-specific prep',
    page: '/cp-exam-prep',
    icon: ClipboardCheck,
    keyElements: ['Condition-specific talking points', 'Examiner tips', 'Common mistakes section'],
    tips: 'Show PTSD or back pain as example conditions'
  },
  {
    id: 4,
    caption: 'Discover conditions you didn\'t know about',
    description: 'Secondary condition suggestions',
    page: '/secondary-finder',
    icon: Link2,
    keyElements: ['Primary condition selected', 'Related secondaries list', 'Connection strength indicators'],
    tips: 'Show knee condition with hip, back, and sleep apnea secondaries'
  },
  {
    id: 5,
    caption: 'Document your worst days',
    description: 'Journal entry with symptom tracking',
    page: '/health-log',
    icon: BookOpen,
    keyElements: ['Pain level sliders', 'Sleep quality entry', 'Daily impact notes'],
    tips: 'Show a "bad day" entry with high pain and low sleep quality'
  },
  {
    id: 6,
    caption: 'Organize your evidence package',
    description: 'Evidence checklist with completion status',
    page: '/documents',
    icon: FolderOpen,
    keyElements: ['Document categories', 'Completion indicators', 'Missing items highlighted'],
    tips: 'Show some items complete, some pending, some missing'
  },
  {
    id: 7,
    caption: 'See exactly what examiners look for',
    description: 'DBQ information showing rating criteria',
    page: '/dbq-prep',
    icon: FileText,
    keyElements: ['DBQ form sections', 'Rating breakdowns', 'Required findings'],
    tips: 'Use a common condition like lumbar spine or PTSD'
  },
  {
    id: 8,
    caption: 'Know what each rating requires',
    description: 'PTSD or back condition rating criteria breakdown',
    page: '/condition-guide',
    icon: Target,
    keyElements: ['Rating levels (0%, 10%, 30%, 50%, 70%, 100%)', 'Specific criteria for each level', 'Your current status indicator'],
    tips: 'PTSD rating criteria is most universally understood'
  }
];

const DEVICE_SIZES = [
  { name: 'iPhone 6.7"', resolution: '1290 x 2796', icon: Smartphone },
  { name: 'iPhone 6.5"', resolution: '1242 x 2688', icon: Smartphone },
  { name: 'iPhone 5.5"', resolution: '1242 x 2208', icon: Smartphone },
  { name: 'iPad 12.9"', resolution: '2048 x 2732', icon: Tablet },
  { name: 'iPad 11"', resolution: '1668 x 2388', icon: Tablet },
];

export function ScreenshotGuide() {
  const [completedScreenshots, setCompletedScreenshots] = useState<number[]>([]);

  const toggleComplete = (id: number) => {
    setCompletedScreenshots(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const progress = (completedScreenshots.length / SCREENSHOTS.length) * 100;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <Camera className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Screenshot Guide</h1>
          <p className="text-muted-foreground">Capture App Store screenshots for each device</p>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Screenshots Captured
            </span>
            <span className="text-sm text-muted-foreground">
              {completedScreenshots.length} / {SCREENSHOTS.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Device sizes reference */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Required Device Sizes</CardTitle>
          <CardDescription>Capture all 8 screenshots for each device</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {DEVICE_SIZES.map((device) => (
              <Badge key={device.name} variant="outline" className="flex items-center gap-2 py-1.5">
                <device.icon className="h-3.5 w-3.5" />
                <span>{device.name}</span>
                <span className="text-muted-foreground text-xs">({device.resolution})</span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Screenshot list */}
      <div className="space-y-4">
        {SCREENSHOTS.map((screenshot) => (
          <Card
            key={screenshot.id}
            className={cn(
              "transition-all duration-300",
              completedScreenshots.includes(screenshot.id) && "border-emerald-500/50 bg-emerald-500/5"
            )}
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {/* Completion toggle */}
                <button
                  onClick={() => toggleComplete(screenshot.id)}
                  className="mt-1 shrink-0"
                >
                  {completedScreenshots.includes(screenshot.id) ? (
                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors" />
                  )}
                </button>

                {/* Screenshot number & icon */}
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 shrink-0">
                  <screenshot.icon className="h-6 w-6 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          Screenshot {screenshot.id}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {screenshot.caption.length}/45 chars
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {screenshot.caption}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {screenshot.description}
                      </p>
                    </div>

                    <Link
                      to={screenshot.page}
                      className="shrink-0"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Open Page
                      </Button>
                    </Link>
                  </div>

                  {/* Key elements */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-foreground mb-2">Key Elements to Show:</p>
                    <div className="flex flex-wrap gap-2">
                      {screenshot.keyElements.map((element) => (
                        <Badge key={element} variant="outline" className="text-xs">
                          {element}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      <strong>Tip:</strong> {screenshot.tips}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Export checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            After capturing screenshots, ensure you have:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>8 screenshots x 5 device sizes = 40 total images</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>All screenshots in PNG format</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>No simulator chrome or status bar overlays</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>Consistent time shown (e.g., 9:41 AM)</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>Full battery indicator</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
