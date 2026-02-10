import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, Shield, FolderOpen, Route, FileCheck, Clock,
  Settings, HelpCircle, BookOpen, Globe, MessageSquare,
  Info, FileText, Lock, AlertTriangle, Download, Trash2, Pencil,
} from 'lucide-react';
import { useProfileStore, BRANCH_LABELS } from '@/store/useProfileStore';
import { ThemeToggle } from '@/components/ThemeToggle';

interface ProfileRowProps {
  icon: React.ElementType;
  label: string;
  route: string;
  danger?: boolean;
}

function ProfileRow({ icon: Icon, label, route, danger }: ProfileRowProps) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(route)}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors"
    >
      <Icon className={`h-5 w-5 ${danger ? 'text-red-500' : 'text-muted-foreground'}`} />
      <span className={`flex-1 text-sm text-left ${danger ? 'text-red-500 font-medium' : 'text-foreground'}`}>
        {label}
      </span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

export default function ProfileHub() {
  const navigate = useNavigate();
  const { firstName, lastName, branch, mosCode, mosTitle, serviceDates } = useProfileStore();
  const branchLabel = branch ? BRANCH_LABELS[branch] : '';
  const serviceDateStr = serviceDates?.start
    ? `${new Date(serviceDates.start).toLocaleDateString()} – ${serviceDates.end ? new Date(serviceDates.end).toLocaleDateString() : 'Present'}`
    : '';

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Profile</h1>

      {/* Group 1: Profile Card */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 text-xl font-bold">
            {(firstName?.[0] || 'V').toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground font-semibold truncate">
              {firstName || 'Veteran'} {lastName}
            </p>
            {branchLabel && <p className="text-sm text-muted-foreground">{branchLabel}</p>}
            {mosCode && (
              <p className="text-xs text-muted-foreground truncate">{mosCode} — {mosTitle}</p>
            )}
            {serviceDateStr && (
              <p className="text-xs text-muted-foreground/70 truncate">{serviceDateStr}</p>
            )}
          </div>
          <button
            onClick={() => navigate('/profile/edit')}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Group 2: Service & Claims */}
      <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
        <ProfileRow icon={Shield} label="Service History" route="/profile/service-history" />
        <ProfileRow icon={FolderOpen} label="Document Vault" route="/profile/vault" />
        <ProfileRow icon={Route} label="Claim Journey" route="/profile/journey" />
        <ProfileRow icon={FileCheck} label="Intent to File" route="/profile/itf" />
        <ProfileRow icon={Clock} label="Medical Timeline" route="/profile/timeline" />
      </div>

      {/* Group 3: Settings */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-foreground">Theme</span>
          </div>
          <ThemeToggle />
        </div>
        <div className="border-t border-border">
          <ProfileRow icon={Settings} label="All Settings" route="/profile/settings" />
        </div>
      </div>

      {/* Group 4: Resources */}
      <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
        <ProfileRow icon={HelpCircle} label="Help Center" route="/profile/help" />
        <ProfileRow icon={MessageSquare} label="FAQ" route="/profile/faq" />
        <ProfileRow icon={BookOpen} label="Glossary" route="/profile/glossary" />
        <ProfileRow icon={Globe} label="VA Resources" route="/profile/resources" />
      </div>

      {/* Group 5: Legal */}
      <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
        <ProfileRow icon={Info} label="About VCS" route="/profile/about" />
        <ProfileRow icon={FileText} label="Terms of Service" route="/profile/terms" />
        <ProfileRow icon={Lock} label="Privacy Policy" route="/profile/privacy" />
        <ProfileRow icon={AlertTriangle} label="Disclaimer" route="/profile/disclaimer" />
      </div>

      {/* Group 6: Account */}
      <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
        <ProfileRow icon={Download} label="Export Data" route="/profile/export-data" />
        <ProfileRow icon={Trash2} label="Delete Account" route="/profile/delete-account" danger />
      </div>
    </div>
  );
}
