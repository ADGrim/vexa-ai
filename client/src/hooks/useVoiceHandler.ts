import { useState } from 'react';

export function useVoiceHandler(callback: (text: string) => void) {
  const [listening, setListening] = useState(false);
  let recognition: SpeechRecognition | null = null;

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser.');
      return;
    }
    recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-GB'; // British accent

    recognition.onstart = () => {
      console.log('Voice recognition started');
      setListening(true);
    };

    recognition.onend = () => {
      console.log('Voice recognition ended');
      setListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log('Voice recognition result received');
      const transcript = event.results[0][0].transcript;
      console.log('Transcript:', transcript);
      callback(transcript);
      recognition?.stop();
    };

    recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error);
      setListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  return { startListening, stopListening, listening };
}

export default useVoiceHandler;