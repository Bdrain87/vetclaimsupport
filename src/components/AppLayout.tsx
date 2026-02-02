import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { MobileHeader } from './MobileHeader';
import { BottomTabBar } from './BottomTabBar';
import { Footer } from './Footer';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-background overflow-x-hidden max-w-[100vw]">
      {/* Mobile Header - visible only on small screens */}
      <MobileHeader />
      
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 md:ml-64 transition-all duration-300 flex flex-col h-screen md:min-h-screen overflow-hidden max-w-[100vw]">
        {/* Add top padding on mobile for fixed header (h-14), bottom for tab bar (h-20 + safe area) */}
        <main className="flex-1 pt-14 pb-36 md:pt-0 md:pb-0 overflow-y-auto overflow-x-hidden -webkit-overflow-scrolling-touch">
          <div className="container max-w-6xl mx-auto px-4 md:px-8 lg:px-10 py-6 pb-10 md:py-8 lg:py-10 safe-area-x">
            {children}
          </div>
        </main>
        <div className="hidden md:block">
          <Footer />
        </div>
      </div>
      
      {/* Bottom Tab Bar - mobile only */}
      <BottomTabBar />
    </div>
  );
}
