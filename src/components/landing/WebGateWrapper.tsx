import { ReactNode, useState, useEffect } from 'react';
import { AppStoreLandingPage } from './AppStoreLandingPage';

interface WebGateWrapperProps {
  children: ReactNode;
}

/**
 * WebGateWrapper checks if the app is running:
 * 1. As a PWA (standalone mode)
 * 2. On the production domain (vetclaimsupport.com)
 * 3. On development/preview domains
 * 
 * If on the production domain (not PWA), show the App Store landing page.
 * Otherwise, show the full app.
 */
export function WebGateWrapper({ children }: WebGateWrapperProps) {
  const [shouldShowGate, setShouldShowGate] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if running as PWA (installed app)
    const isPWA = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true;

    // Check the hostname
    const hostname = window.location.hostname.toLowerCase();
    
    // Production domains that should show the gate
    const productionDomains = [
      'vetclaimsupport.com',
      'www.vetclaimsupport.com',
    ];

    // Allowed domains (development, preview, Lovable staging)
    const isAllowedDomain = 
      hostname === 'localhost' ||
      hostname.includes('lovable.app') ||
      hostname.includes('lovable.dev') ||
      hostname.includes('127.0.0.1');

    // Show gate if:
    // - On production domain AND
    // - NOT running as PWA
    // - OR if URL has ?preview-landing query param (for testing)
    const isProductionDomain = productionDomains.some(domain => hostname === domain);
    const hasPreviewParam = new URLSearchParams(window.location.search).has('preview-landing');
    
    if ((isProductionDomain && !isPWA) || hasPreviewParam) {
      setShouldShowGate(true);
    }

    setIsChecking(false);
  }, []);

  // Show nothing while checking (brief flash prevention)
  if (isChecking) {
    return null;
  }

  // Show landing page gate for web visitors on production domain
  if (shouldShowGate) {
    return <AppStoreLandingPage />;
  }

  // Show the full app for PWA users and development
  return <>{children}</>;
}
