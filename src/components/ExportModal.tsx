import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  FileText,
  CheckSquare,
  Heart,
  FileOutput,
  ClipboardList,
  BarChart3,
  Calendar,
  Share2,
  Download,
  Copy,
  Loader2,
  Check,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  generateExport,
  shareExport,
  downloadExport,
  copyExport,
} from '@/services/exportEngine';
import type { ExportSections, ExportFormat } from '@/services/exportEngine';

// ============================================================================
// Types
// ============================================================================

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SectionItem {
  key: keyof ExportSections;
  icon: React.ReactNode;
  label: string;
  description: string;
}

// ============================================================================
// Section config
// ============================================================================

const SECTION_ITEMS: SectionItem[] = [
  {
    key: 'personalInfo',
    icon: <User size={20} />,
    label: 'Personal Information',
    description: 'Name, branch, MOS, service dates',
  },
  {
    key: 'conditions',
    icon: <FileText size={20} />,
    label: 'Conditions & Ratings',
    description: 'All claimed conditions with current/target ratings',
  },
  {
    key: 'evidenceChecklist',
    icon: <CheckSquare size={20} />,
    label: 'Evidence Checklist',
    description: "What evidence you have vs. what's needed per condition",
  },
  {
    key: 'healthLogs',
    icon: <Heart size={20} />,
    label: 'Health Log Summary',
    description: 'Pain levels, flare-ups, symptom frequency, medication records',
  },
  {
    key: 'generatedDocs',
    icon: <FileOutput size={20} />,
    label: 'Generated Documents',
    description: 'Buddy statement drafts, nexus letter outlines, personal statements',
  },
  {
    key: 'formDrafts',
    icon: <ClipboardList size={20} />,
    label: 'Form Drafts',
    description: 'VA Form Guide field entries and draft worksheets',
  },
  {
    key: 'romMeasurements',
    icon: <BarChart3 size={20} />,
    label: 'ROM Measurements',
    description: 'Range of motion data with DeLuca factor notes',
  },
  {
    key: 'timeline',
    icon: <Calendar size={20} />,
    label: 'Timeline Narrative',
    description: 'Chronological service → symptoms → diagnosis timeline',
  },
];

const FORMAT_OPTIONS: {
  value: ExportFormat;
  label: string;
  note: string;
}[] = [
  {
    value: 'pdf',
    label: 'PDF (Recommended)',
    note: 'Professional format, ready for VSO or VA submission',
  },
  {
    value: 'text',
    label: 'Plain Text',
    note: 'Simple text file, good for email or printing',
  },
];

// ============================================================================
// Component
// ============================================================================

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  // --- Section checkboxes state ---
  const [sections, setSections] = useState<ExportSections>({
    personalInfo: true,
    conditions: true,
    evidenceChecklist: true,
    healthLogs: true,
    generatedDocs: true,
    formDrafts: true,
    romMeasurements: true,
    timeline: true,
  });

  // --- Format state ---
  const [format, setFormat] = useState<ExportFormat>('pdf');

  // --- UI states ---
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allChecked = Object.values(sections).every(Boolean);
  const noneChecked = Object.values(sections).every((v) => !v);

  // --- Handlers ---
  const toggleSection = useCallback((key: keyof ExportSections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const toggleAll = useCallback(() => {
    const newVal = !allChecked;
    setSections({
      personalInfo: newVal,
      conditions: newVal,
      evidenceChecklist: newVal,
      healthLogs: newVal,
      generatedDocs: newVal,
      formDrafts: newVal,
      romMeasurements: newVal,
      timeline: newVal,
    });
  }, [allChecked]);

  const handleExportAndShare = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateExport({ sections, format });
      await shareExport(result);
      toast.success('Export shared successfully');
      onClose();
    } catch (err) {
      console.error('Export failed:', err);
      setError('Something went wrong. Please try again or choose a different format.');
    } finally {
      setIsGenerating(false);
    }
  }, [sections, format, onClose]);

  const handleSaveToDevice = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateExport({ sections, format });
      downloadExport(result);
      toast.success('Export saved to device');
      onClose();
    } catch (err) {
      console.error('Export failed:', err);
      setError('Something went wrong. Please try again or choose a different format.');
    } finally {
      setIsGenerating(false);
    }
  }, [sections, format, onClose]);

  const handleCopyToClipboard = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateExport({ sections, format });
      const success = await copyExport(result);
      if (success) {
        toast.success('Copied to clipboard');
        onClose();
      } else {
        setError('Could not copy to clipboard. Try saving to device instead.');
      }
    } catch (err) {
      console.error('Copy failed:', err);
      setError('Something went wrong. Please try again or choose a different format.');
    } finally {
      setIsGenerating(false);
    }
  }, [sections, format, onClose]);

  const canCopy = format !== 'pdf';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[300] flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-lg mx-4 my-8 sm:my-16 bg-[#111111] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-white/[0.10]">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#F8FAFC]">Build Your Packet</h2>
                  <p className="text-sm text-[#94A3B8] mt-1">
                    Select what to include in your export
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white/40 hover:text-white/80 transition-colors rounded-lg hover:bg-white/[0.07]"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
              {/* Select All / Deselect All */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={toggleAll}
                  className="text-sm font-medium text-gold hover:text-gold-hl transition-colors"
                >
                  {allChecked ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-xs text-[#64748B]">
                  {Object.values(sections).filter(Boolean).length} of {SECTION_ITEMS.length} selected
                </span>
              </div>

              {/* Section Checkboxes */}
              <div className="space-y-2">
                {SECTION_ITEMS.map((item) => {
                  const checked = sections[item.key];
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleSection(item.key)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all duration-150 text-left ${
                        checked
                          ? 'border-[rgba(214,178,94,0.3)] bg-[rgba(214,178,94,0.06)]'
                          : 'border-white/[0.10] bg-white/[0.02] hover:bg-white/[0.07]'
                      }`}
                    >
                      {/* Custom checkbox */}
                      <div
                        className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                          checked
                            ? 'bg-gold border-gold'
                            : 'border-2 border-[#475569] bg-transparent'
                        }`}
                      >
                        {checked && <Check size={14} className="text-white" />}
                      </div>

                      {/* Icon */}
                      <div className={`flex-shrink-0 mt-0.5 ${checked ? 'text-gold' : 'text-[#64748B]'}`}>
                        {item.icon}
                      </div>

                      {/* Text */}
                      <div className="min-w-0">
                        <p className={`text-sm font-medium ${checked ? 'text-[#F8FAFC]' : 'text-[#94A3B8]'}`}>
                          {item.label}
                        </p>
                        <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Format Selection */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-[#F8FAFC] mb-3">Format</h3>
                <div className="space-y-2">
                  {FORMAT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormat(option.value)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 text-left ${
                        format === option.value
                          ? 'border-[rgba(214,178,94,0.3)] bg-[rgba(214,178,94,0.06)]'
                          : 'border-white/[0.10] bg-white/[0.02] hover:bg-white/[0.07]'
                      }`}
                    >
                      {/* Radio button */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          format === option.value
                            ? 'border-gold'
                            : 'border-[#475569]'
                        }`}
                      >
                        {format === option.value && (
                          <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className={`text-sm font-medium ${format === option.value ? 'text-[#F8FAFC]' : 'text-[#94A3B8]'}`}>
                          {option.label}
                        </p>
                        <p className="text-xs text-[#64748B] mt-0.5">
                          {option.note}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-6 mb-2 flex items-start gap-2 p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20">
                <AlertCircle size={16} className="text-[#EF4444] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#EF4444]">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="px-6 py-4 border-t border-white/[0.10] space-y-2">
              {isGenerating ? (
                <div className="flex items-center justify-center gap-3 py-4">
                  <Loader2 size={20} className="text-gold animate-spin" />
                  <span className="text-sm text-[#94A3B8]">Generating your packet...</span>
                </div>
              ) : (
                <>
                  {/* Primary: Export & Share */}
                  <button
                    onClick={handleExportAndShare}
                    disabled={noneChecked}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gold hover:bg-gold-dk active:bg-[#B8962E] text-white font-medium text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Share2 size={18} />
                    Export & Share
                  </button>

                  {/* Secondary: Save to Device */}
                  <button
                    onClick={handleSaveToDevice}
                    disabled={noneChecked}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/[0.14] bg-white/[0.07] hover:bg-white/[0.12] text-[#F8FAFC] font-medium text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Download size={18} />
                    Save to Device
                  </button>

                  {/* Tertiary: Copy to Clipboard (text/json only) */}
                  {canCopy && (
                    <button
                      onClick={handleCopyToClipboard}
                      disabled={noneChecked}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Copy size={16} />
                      Copy to Clipboard
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
