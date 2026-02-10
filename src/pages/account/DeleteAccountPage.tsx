import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Trash2, Loader2, CheckCircle, ChevronLeft } from 'lucide-react';
import { deleteAccount } from '@/services/accountManagement';

export default function DeleteAccountPage() {
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfirmed = confirmText === 'DELETE';

  const handleDelete = async () => {
    if (!isConfirmed) return;
    setProcessing(true);
    setError(null);

    try {
      await deleteAccount();
      setCompleted(true);
      setTimeout(() => {
        navigate('/onboarding', { replace: true });
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account. Please try again.');
      setProcessing(false);
    }
  };

  if (completed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Account Deleted</h2>
          <p className="text-white/50 text-sm">
            Your account and all associated data have been deleted. You will be signed out.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-white/50 hover:text-white text-sm transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Delete Your Account</h1>
        <p className="text-white/50 text-sm leading-relaxed">
          This will permanently delete your account and all associated data.
          This action cannot be undone.
        </p>
      </div>

      {/* What will be deleted */}
      <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-4 space-y-2">
        <h3 className="text-sm font-semibold text-red-400 mb-3">The following will be permanently deleted:</h3>
        <ul className="space-y-1.5 text-sm text-white/60">
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#x2022;</span>
            Your profile and account information
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#x2022;</span>
            All tracked conditions and claim data
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#x2022;</span>
            All health logs (symptoms, sleep, migraines, medications, visits)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#x2022;</span>
            All uploaded evidence and documents
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#x2022;</span>
            All VA form drafts and generated documents
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#x2022;</span>
            Your encryption keys and vault passcode
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#x2022;</span>
            All cloud-synced data
          </li>
        </ul>
      </div>

      {/* Warning */}
      <p className="text-red-400 text-sm font-semibold text-center">
        This is permanent. There is no recovery.
      </p>

      {/* Confirmation input */}
      <div className="space-y-2">
        <label className="block text-sm text-white/50">
          Type <span className="font-mono font-bold text-white">DELETE</span> to confirm:
        </label>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="Type DELETE"
          className="w-full h-12 px-4 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400/50 transition-all"
          disabled={processing}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={!isConfirmed || processing}
        className="w-full h-12 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Deleting...
          </>
        ) : (
          <>
            <Trash2 className="h-4 w-4" />
            Delete My Account
          </>
        )}
      </button>
    </div>
  );
}
