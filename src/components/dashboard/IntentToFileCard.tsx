import { useState, useEffect } from 'react';
import { Lightbulb, X, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DISMISSED_KEY = 'intentToFileDismissed';

export function IntentToFileCard() {
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    setIsDismissed(!!dismissed);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <Card className="border-2 border-warning/50 bg-warning/5 relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-warning" />
      
      <CardContent className="pt-5 pb-4 pl-6">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex items-start gap-4 pr-8">
          <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="h-5 w-5 text-warning" />
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground text-lg">
              💡 Pro Tip: File an Intent to File
            </h3>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Filing an <strong className="text-foreground">Intent to File (VA Form 21-0966)</strong> locks 
                in your effective date for up to 1 year while you gather evidence.
              </p>
              <p>
                <span className="text-warning font-medium">This could mean thousands of dollars in back pay</span> if 
                your claim is approved.
              </p>
              <p>
                You can file online at VA.gov or through a VSO — it takes about 5 minutes.
              </p>
            </div>

            <a
              href="https://www.va.gov/resources/your-intent-to-file-a-va-claim/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
            >
              Learn more at VA.gov
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
