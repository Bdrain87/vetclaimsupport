import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, BookOpen, FolderOpen, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/health-log', icon: FileText, label: 'Conditions' },
  { path: '/symptoms', icon: BookOpen, label: 'Journal' },
  { path: '/docs', icon: FolderOpen, label: 'Evidence' },
  { path: '/exam-prep', icon: Calendar, label: 'Exam Day' },
];

export function TabBar() {
  const location = useLocation();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "flex justify-around items-center",
        "bg-background/95 backdrop-blur-lg",
        "border-t border-border",
        "px-2 pt-2",
        "pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname === tab.path ||
          (tab.path !== '/' && location.pathname.startsWith(tab.path));

        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={cn(
              "flex flex-col items-center justify-center gap-1",
              "min-w-[56px] min-h-[44px] px-3 py-1.5",
              "rounded-lg",
              "text-xs font-medium",
              "transition-all duration-200",
              "-webkit-tap-highlight-color-transparent",
              isActive
                ? "text-success-600 dark:text-success-400"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon
              className={cn(
                "w-6 h-6 transition-transform duration-200",
                isActive && "scale-110"
              )}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className={cn(
              "transition-opacity duration-200",
              isActive ? "opacity-100" : "opacity-70"
            )}>
              {tab.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}

// Spacer component to prevent content from being hidden behind TabBar
export function TabBarSpacer() {
  return (
    <div
      className="h-20"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-hidden="true"
    />
  );
}

export default TabBar;
