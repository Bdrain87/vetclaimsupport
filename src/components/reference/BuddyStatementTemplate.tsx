import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Users } from 'lucide-react';

const templateContent = `BUDDY/LAY STATEMENT
In Support of VA Disability Claim

================================================================================
INSTRUCTIONS FOR THE PERSON WRITING THIS STATEMENT
================================================================================

This statement should be written by someone who has personally witnessed the 
veteran's condition(s) and how they affect their daily life. This could be a:
- Fellow service member who served with them
- Spouse, family member, or close friend
- Coworker or supervisor
- Anyone who has observed the veteran's symptoms

Be specific and honest. Describe what YOU personally observed, not what the 
veteran told you. Include dates and specific examples when possible.

================================================================================
STATEMENT INFORMATION
================================================================================

Your Full Name: _______________________________________________________________

Your Relationship to the Veteran: _____________________________________________
(e.g., spouse, fellow service member, coworker, friend)

Your Contact Information:
  Phone: ______________________________________________________________________
  Email: ______________________________________________________________________
  Address: ____________________________________________________________________

How long have you known the veteran? ___________________________________________

================================================================================
WHAT YOU HAVE WITNESSED
================================================================================

Describe the veteran's condition(s) you have personally observed:
(Be specific - include symptoms, frequency, and severity)

_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________

================================================================================
IMPACT ON DAILY LIFE
================================================================================

Describe how these condition(s) affect the veteran's daily life:
(Include effects on work, relationships, hobbies, sleep, mood, etc.)

_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________

================================================================================
SPECIFIC EXAMPLES
================================================================================

Provide specific examples or incidents you witnessed:
(Include approximate dates if possible)

_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________

================================================================================
ADDITIONAL INFORMATION
================================================================================

Any other relevant information:

_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________

================================================================================
CERTIFICATION
================================================================================

I certify that the statements made above are true and correct to the best of 
my knowledge and belief. I understand that making false statements is 
punishable by law.


Signature: ____________________________________________________________________

Printed Name: _________________________________________________________________

Date: _________________________________________________________________________

================================================================================
NOTE: This statement may be submitted with the veteran's VA disability claim.
================================================================================
`;

export function BuddyStatementTemplate() {
  const handleDownloadText = () => {
    const blob = new Blob([templateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Buddy_Statement_Template.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* CRITICAL: Fraud Warning */}
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">Important: Written By OTHERS Only</p>
              <p className="text-sm text-muted-foreground mt-1">
                This template is for witnesses (fellow service members, family, friends) to complete — 
                <strong> not the veteran.</strong> Writing your own buddy statement is fraudulent.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-buddy/10">
              <Users className="h-5 w-5 text-buddy" />
            </div>
            <div>
              <CardTitle className="text-lg">Buddy Statement Template</CardTitle>
              <CardDescription>Share this template with witnesses to support your claim</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <h4 className="font-medium text-foreground mb-2">What's included in this template:</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              Instructions for the person writing the statement
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              Fields for contact information and relationship
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              Sections for witnessed conditions and symptoms
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              Space to describe impact on daily life
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              Area for specific examples with dates
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              Signature and certification section
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleDownloadText} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download Template (.txt)
          </Button>
        </div>

        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
          <p className="text-muted-foreground">
            <strong className="text-foreground">Tip:</strong> Send this template to your buddy and ask them to fill it out. 
            The more specific and detailed their statement, the more valuable it is for your claim.
          </p>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
