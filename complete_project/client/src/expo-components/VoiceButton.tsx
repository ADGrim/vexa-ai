```typescript
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useVoiceHandler } from './VoiceHandler';
import { WaveAnimation } from './WaveAnimation';

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ onTranscript }) => {
  const { startListening, stopListening, listening, hasPermission } = useVoiceHandler((text) => {
    console.log('Voice transcript:', text);
    onTranscript(text);
  });

  const handlePress = async () => {
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please grant microphone access to use voice chat.');
      return;
    }

    if (listening) {
      await stopListening();
    } else {
      await startListening();
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <WaveAnimation listening={listening} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VoiceButton;
```
