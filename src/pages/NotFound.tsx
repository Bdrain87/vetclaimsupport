import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Home, ArrowLeft, Search, FileText, Calculator, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/PageContainer';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Track 404 for debugging purposes
  useEffect(() => { /* route not found: location.pathname */ }, [location.pathname]);

  const quickLinks = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/health/summary', label: 'Health Log', icon: FileText },
    { path: '/prep', label: 'Claim Tools', icon: Calculator },
    { path: '/settings/help', label: 'Help Center', icon: HelpCircle },
  ];

  return (
    <PageContainer className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center max-w-md">
        {/* Large 404 */}
        <div className="relative mb-6">
          <span className="text-[120px] font-bold text-primary/10 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 rounded-2xl bg-muted/50 backdrop-blur-xs">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>

        {/* Quick Links */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {quickLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-muted/50 hover:bg-muted text-foreground transition-colors"
              >
                <link.icon className="h-4 w-4 text-muted-foreground" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Attempted URL (for debugging) */}
        <p className="mt-8 text-xs text-muted-foreground/50">
          Attempted URL: <code className="px-1 py-0.5 bg-muted rounded">{location.pathname}</code>
        </p>
      </div>
    </PageContainer>
  );
};

export default NotFound;
