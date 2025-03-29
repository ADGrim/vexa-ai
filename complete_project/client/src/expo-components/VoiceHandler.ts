```typescript
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech-recognition';
import { useState, useEffect } from 'react';

export function useVoiceHandler(callback: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Speech.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const startListening = async () => {
    if (!hasPermission) {
      console.error('Voice recognition permission not granted');
      return;
    }

    try {
      setListening(true);
      await Speech.startListeningAsync({
        onResult: (result) => {
          if (result.value) {
            callback(result.value);
            Speech.stopListeningAsync();
            setListening(false);
          }
        },
        continuous: false,
        partialResults: false,
        language: 'en-US'
      });
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setListening(false);
    }
  };

  const stopListening = async () => {
    if (listening) {
      await Speech.stopListeningAsync();
      setListening(false);
    }
  };

  return { startListening, stopListening, listening, hasPermission };
}

export default useVoiceHandler;
```
