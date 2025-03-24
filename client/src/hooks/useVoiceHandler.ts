import { useState, useEffect } from 'react';

interface UseVoiceHandlerReturn {
  transcript: string;
  isListening: boolean;
  startListening: () => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const useVoiceHandler = (): UseVoiceHandlerReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  let recognition: SpeechRecognition | null = null;

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-GB'; // British English
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          setTranscript(lastResult[0].transcript.trim());
        }
      };
      recognition.onerror = (e) => {
        console.error('Speech Recognition Error:', e.error);
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  };

  return { transcript, isListening, startListening };
};

export default useVoiceHandler;
