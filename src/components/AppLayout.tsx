import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { MobileHeader } from './MobileHeader';
import { Footer } from './Footer';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-background no-overflow-x">
      {/* Mobile Header - visible only on small screens */}
      <MobileHeader />
      
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 md:ml-64 transition-all duration-300 flex flex-col min-h-screen">
        {/* Add top padding on mobile for fixed header */}
        <main className="flex-1 pt-14 md:pt-0 mobile-scroll">
          <div className="container max-w-7xl mx-auto p-4 md:p-6 lg:p-8 safe-area-x">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
