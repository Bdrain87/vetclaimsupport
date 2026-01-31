import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Terms() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="section-header">
        <div className="section-icon">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground">Usage terms and conditions</p>
        </div>
      </div>

      <Card className="data-card">
        <CardHeader>
          <CardTitle className="text-lg">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Our terms of service are currently being finalized. Please check back soon for complete 
            details on the terms and conditions of using this application.
          </p>
          <p className="text-muted-foreground mt-4">
            <strong className="text-foreground">Important:</strong> This application is intended solely as an organizational 
            tool to help veterans track their documentation. It does not provide medical diagnosis, 
            legal advice, or official VA claims guidance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
