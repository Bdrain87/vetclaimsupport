import { useState, useCallback, useRef, useEffect } from 'react';

// SpeechRecognition types (not in standard DOM types)
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultItem {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionResultItem;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEventCustom extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface UseVoiceInputOptions {
  onResult?: (transcript: string) => void;
  onInterimResult?: (transcript: string) => void;
  continuous?: boolean;
  language?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEventCustom) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface UseVoiceInputReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  error: string | null;
}

export function useVoiceInput(options: UseVoiceInputOptions = {}): UseVoiceInputReturn {
  const { onResult, onInterimResult, continuous = false, language = 'en-US' } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  // Use refs for callbacks to avoid recreating SpeechRecognition on every render
  const onResultRef = useRef(onResult);
  const onInterimResultRef = useRef(onInterimResult);
  const transcriptRef = useRef('');

  // Keep refs up to date
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);
  useEffect(() => { onInterimResultRef.current = onInterimResult; }, [onInterimResult]);

  // Check browser support
  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      switch (event.error) {
        case 'no-speech':
          setError('No speech detected. Try again.');
          break;
        case 'audio-capture':
          setError('Microphone not found.');
          break;
        case 'not-allowed':
          setError('Microphone access denied.');
          break;
        case 'network':
          setError('Network error. Check your connection and try again.');
          break;
        case 'aborted':
          // User or system cancelled — don't show error
          break;
        default:
          setError('Voice input failed. Please try again.');
      }
    };

    recognition.onresult = (event: SpeechRecognitionEventCustom) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.length === 0) continue;
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (interim) {
        setInterimTranscript(interim);
        onInterimResultRef.current?.(interim);
      }

      if (finalTranscript) {
        // In continuous mode, append to existing transcript
        const accumulated = continuous
          ? transcriptRef.current + (transcriptRef.current ? ' ' : '') + finalTranscript
          : finalTranscript;
        transcriptRef.current = accumulated;
        setTranscript(accumulated);
        setInterimTranscript('');
        onResultRef.current?.(accumulated);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onstart = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.onresult = null;
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [isSupported, continuous, language]);

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      setError('Speech recognition not supported');
      return;
    }

    setTranscript('');
    setInterimTranscript('');
    setError(null);
    transcriptRef.current = '';

    try {
      recognitionRef.current.start();
    } catch {
      // Already started
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    toggleListening,
    error,
  };
}

// Type declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition | undefined;
    webkitSpeechRecognition: typeof SpeechRecognition | undefined;
  }
}
