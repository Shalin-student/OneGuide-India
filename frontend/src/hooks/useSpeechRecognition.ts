import { useState, useEffect, useRef } from 'react';

// Type definitions for SpeechRecognition API
interface SpeechRecognitionEvent {
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

export const useSpeechRecognition = (language = 'en-IN') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasSupport, setHasSupport] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setHasSupport(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false; // Stop when the user stops talking
        recognitionRef.current.interimResults = true; // Show results as they are being spoken
        recognitionRef.current.lang = language;

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error", event.error);
          setError(event.error);
          setIsListening(false);
        };
      } else {
        setHasSupport(false);
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language]);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript(''); // Clear previous transcript
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Could not start speech recognition", e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    error,
    hasSupport
  };
};
