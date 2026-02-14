import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { cn } from '@/lib/utils';
import { impactMedium } from '@/lib/haptics';

interface FloatingVoiceButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function FloatingVoiceButton({ onTranscript, className }: FloatingVoiceButtonProps) {
  const [pulse, setPulse] = useState(false);

  const { isListening, isSupported, toggleListening, interimTranscript } = useVoiceInput({
    onResult: (text) => {
      onTranscript(text);
      setPulse(false);
    },
    onInterimResult: () => {
      setPulse(true);
    },
    continuous: true,
  });

  if (!isSupported) return null;

  const handleClick = () => {
    impactMedium();
    toggleListening();
    setPulse(!isListening);
  };

  return (
    <>
      {isListening && interimTranscript && (
        <div className="fixed bottom-24 left-4 right-4 z-40 bg-card/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground italic truncate">
            {interimTranscript}
          </p>
        </div>
      )}
      <button
        onClick={handleClick}
        aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
        className={cn(
          'fixed z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all',
          isListening
            ? 'bg-destructive text-destructive-foreground'
            : 'bg-primary text-primary-foreground hover:bg-primary/90',
          pulse && 'animate-pulse',
          className,
        )}
        style={{ bottom: '5.5rem', right: '1.25rem' }}
      >
        {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </button>
    </>
  );
}
