import { AlertTriangle, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DisclaimerPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-white/50 hover:text-white text-sm transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-blue-500/10 shrink-0">
          <AlertTriangle className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Important Disclaimer</h1>
          <p className="text-white/40 text-sm mt-1">Vet Claim Support</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 text-sm leading-relaxed">
        <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-5 space-y-4">
          <p className="text-white/70">
            <strong className="text-white">Vet Claim Support is not affiliated with or endorsed by the U.S. Department of Veterans Affairs (VA).</strong>
          </p>

          <p className="text-white/70">
            <strong className="text-white">This app is not legal advice, medical advice, or an accredited representative service.</strong>
          </p>

          <p className="text-white/70">
            This app is an organizational tool that helps you prepare and organize information related to VA disability claims.
          </p>

          <p className="text-white/70">
            You are responsible for reviewing all information, ensuring its accuracy, and consulting with an accredited Veterans Service Organization (VSO) or attorney for legal representation and filing decisions.
          </p>

          <p className="text-white/70">
            <strong className="text-white">We do not guarantee any specific outcomes, ratings, or approvals.</strong>
          </p>

          <p className="text-white/70">
            Always verify current VA form versions, requirements, and instructions before submission.
          </p>
        </div>

        <div className="text-center">
          <p className="text-white/30 text-xs">
            By using this app, you acknowledge that you have read and understood this disclaimer.
          </p>
        </div>
      </div>
    </div>
  );
}
