import { useState, useEffect, useRef } from 'react';

interface UseVoiceHandlerReturn {
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const useVoiceHandler = (): UseVoiceHandlerReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          setTranscript(lastResult[0].transcript.trim());
          stopListening();
        }
      };

      recognitionRef.current.onerror = (e) => {
        console.error('Speech Recognition Error:', e.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
  };

  return { transcript, isListening, startListening, stopListening };
};

export default useVoiceHandler;