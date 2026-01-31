import { Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Privacy() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="section-header">
        <div className="section-icon">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground">How we handle your data</p>
        </div>
      </div>

      <Card className="data-card">
        <CardHeader>
          <CardTitle className="text-lg">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Our privacy policy is currently being finalized. Please check back soon for complete details 
            on how we collect, use, and protect your personal information.
          </p>
          <p className="text-muted-foreground mt-4">
            In the meantime, please note that all data you enter into this application is stored locally 
            in your browser and is not transmitted to external servers without your explicit consent.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
