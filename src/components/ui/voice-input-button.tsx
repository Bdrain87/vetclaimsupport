import { forwardRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useVoiceInput } from '@/hooks/useVoiceInput';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  onInterim?: (text: string) => void;
  disabled?: boolean;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  append?: boolean; // If true, appends to existing text
  existingText?: string;
}

export const VoiceInputButton = forwardRef<HTMLButtonElement, VoiceInputButtonProps>(
  ({ onTranscript, onInterim, disabled, className, size = 'icon', append = true, existingText = '' }, ref) => {
    const { isListening, isSupported, toggleListening, error, interimTranscript } = useVoiceInput({
      onResult: (transcript) => {
        if (append && existingText) {
          const separator = existingText.endsWith(' ') || existingText === '' ? '' : ' ';
          onTranscript(existingText + separator + transcript);
        } else {
          onTranscript(transcript);
        }
      },
      onInterimResult: onInterim,
    });

    if (!isSupported) {
      return null; // Don't show if browser doesn't support
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant={isListening ? 'default' : 'outline'}
            size={size}
            onClick={toggleListening}
            disabled={disabled}
            className={cn(
              'relative transition-all',
              isListening && 'bg-destructive hover:bg-destructive/90 animate-pulse',
              className
            )}
            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
            {isListening && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive" />
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          {error ? (
            <p className="text-destructive">{error}</p>
          ) : isListening ? (
            <p>Listening... {interimTranscript && <span className="text-muted-foreground">"{interimTranscript}"</span>}</p>
          ) : (
            <p>Tap to speak</p>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }
);

VoiceInputButton.displayName = 'VoiceInputButton';
