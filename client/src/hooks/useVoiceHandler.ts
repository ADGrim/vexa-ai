import { useState, useEffect } from 'react';

interface VoiceHandlerProps {
  onTranscript: (text: string) => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export const useVoiceHandler = ({ onTranscript }: VoiceHandlerProps) => {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Web Speech API not supported in this browser.');
      return;
    }
    const SpeechRecognitionConstructor = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recog = new SpeechRecognitionConstructor();
    recog.lang = 'en-GB'; // British accent recognition
    recog.interimResults = false;
    recog.continuous = false;

    recog.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.trim();
      onTranscript(transcript);
    };

    recog.onerror = (event: any) => {
      console.error('Recognition error:', event.error);
      setListening(false);
    };

    recog.onend = () => setListening(false);

    setRecognition(recog);
  }, [onTranscript]);

  const startListening = () => {
    if (recognition) {
      setListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setListening(false);
    }
  };

  return { startListening, stopListening, listening };
};

export default useVoiceHandler;