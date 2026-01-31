import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { Footer } from './Footer';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 ml-16 md:ml-64 transition-all duration-300 flex flex-col min-h-screen">
        <main className="flex-1">
          <div className="container max-w-7xl mx-auto p-6 lg:p-8">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
