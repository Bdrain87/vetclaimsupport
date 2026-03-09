import { ExternalLink, Users, Shield, HelpCircle } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const VSO_RESOURCES = [
  {
    title: 'Find an Accredited Representative',
    description: 'Search the VA\'s official database of accredited VSOs, attorneys, and claims agents.',
    url: 'https://www.va.gov/get-help-from-accredited-representative/',
    primary: true,
  },
  {
    title: 'DAV (Disabled American Veterans)',
    description: 'Free claims assistance from trained service officers.',
    url: 'https://www.dav.org/veterans/i-need-help/',
  },
  {
    title: 'VFW (Veterans of Foreign Wars)',
    description: 'Claims support and advocacy for veterans.',
    url: 'https://www.vfw.org/assistance/va-claims-702',
  },
  {
    title: 'American Legion',
    description: 'Service officers in every state to help with claims.',
    url: 'https://www.legion.org/veteransbenefits',
  },
  {
    title: 'AMVETS',
    description: 'Free claims assistance and advocacy.',
    url: 'https://amvets.org/veterans-services/',
  },
];

export default function VSOLocator() {
  return (
    <PageContainer className="py-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gold/10 border border-gold/20">
          <Users className="h-6 w-6 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Find a VSO</h1>
          <p className="text-muted-foreground text-sm">Get free help from an accredited representative</p>
        </div>
      </div>

      {/* What is a VSO */}
      <Card className="bg-primary/5 border-primary/30">
        <CardContent className="pt-6 flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">What is a VSO?</p>
            <p>
              A Veterans Service Organization (VSO) is an accredited organization that provides
              <strong> free assistance</strong> with VA disability claims. VSO representatives can:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Help you file initial claims and appeals</li>
              <li>Review your evidence and identify gaps</li>
              <li>Represent you in hearings</li>
              <li>Access your VA records on your behalf</li>
              <li>Explain VA decisions and next steps</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Primary CTA */}
      {VSO_RESOURCES.filter((r) => r.primary).map((resource) => (
        <Card key={resource.url} className="border-gold/30 bg-gold/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-gold" />
              {resource.title}
            </CardTitle>
            <CardDescription>{resource.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-gold hover:bg-gold/80 text-black gap-2" size="lg">
                Search VA.gov
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </CardContent>
        </Card>
      ))}

      {/* Other organizations */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
          Major VSOs
        </h2>
        {VSO_RESOURCES.filter((r) => !r.primary).map((resource) => (
          <a
            key={resource.url}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:bg-accent/50 active:scale-[0.98] transition-all"
          >
            <div className="p-2 rounded-xl bg-gold/10 shrink-0">
              <Users className="h-4 w-4 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground block">{resource.title}</span>
              <span className="text-xs text-muted-foreground block leading-tight">{resource.description}</span>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
          </a>
        ))}
      </div>

      <div className="px-4 py-3 rounded-xl bg-gold/10 border border-gold/20">
        <p className="text-xs text-gold/80">
          VSO services are <strong>always free</strong>. If someone charges you for VA claims assistance,
          verify they are VA-accredited. You can check accreditation at VA.gov.
        </p>
      </div>
    </PageContainer>
  );
}
