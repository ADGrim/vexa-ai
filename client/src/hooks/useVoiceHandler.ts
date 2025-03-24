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
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Web Speech API not supported in this browser.');
      return;
    }

    const SpeechRecognitionConstructor = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recog = new SpeechRecognitionConstructor();
    recog.lang = 'en-US';  // Changed from en-GB to ensure wider compatibility
    recog.interimResults = false;
    recog.continuous = false;

    recog.onstart = () => {
      console.log('Voice recognition started');
      setListening(true);
    };

    recog.onresult = (event: any) => {
      console.log('Voice recognition result received');
      const transcript = event.results[0][0].transcript.trim();
      console.log('Transcript:', transcript);
      onTranscript(transcript);
    };

    recog.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error);
      setListening(false);
    };

    recog.onend = () => {
      console.log('Voice recognition ended');
      setListening(false);
    };

    setRecognition(recog);
  }, [onTranscript]);

  const startListening = () => {
    if (recognition) {
      try {
        console.log('Starting voice recognition...');
        recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        setListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognition) {
      try {
        console.log('Stopping voice recognition...');
        recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
      setListening(false);
    }
  };

  return { startListening, stopListening, listening };
};

export default useVoiceHandler;