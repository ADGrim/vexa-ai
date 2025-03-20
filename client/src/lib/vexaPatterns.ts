```typescript
// Utility functions for detecting Vexa mentions and generating responses

export const detectVexaMention = (message: string): boolean => {
  const lowerMsg = message.toLowerCase();
  const patterns = [
    /what('?s| is) your name\??/i,
    /who are you\??/i,
    /\b(vexa)\b/i,
  ];
  return patterns.some((pattern) => pattern.test(lowerMsg));
};

export const generateVexaResponse = (userMessage: string): string => {
  const lowerMsg = userMessage.toLowerCase();
  
  // Check for greetings first
  const greetPatterns = /\b(hi|hey|hello)[, ]?(vexa)\b/i;
  if (greetPatterns.test(lowerMsg)) {
    return "Hey there! 😊 How can I help?";
  }

  // Check for Vexa mentions
  if (detectVexaMention(userMessage)) {
    return "I'm Vexa — your AI assistant. 😊";
  }

  // Fallback responses based on message type
  if (userMessage.trim().endsWith('?')) {
    return "That's an interesting question!";
  }
  
  return "I see!";
};
```
