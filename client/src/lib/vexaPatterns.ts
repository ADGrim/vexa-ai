import vexaProfile, { getTimeBasedGreeting } from './vexaProfile';

export const detectVexaMention = (message: string): boolean => {
  const lowerMsg = message.toLowerCase();
  const patterns = [
    /what('?s| is) your name\??/i,
    /who are you\??/i,
    /\b(vexa)\b/i,
  ];
  return patterns.some((pattern) => pattern.test(lowerMsg));
};

export const detectCreatorQuestion = (message: string): boolean => {
  const lowerMsg = message.toLowerCase();
  const patterns = [
    /who (created|made|built) (you|vexa)\??/i,
    /who('?s| is) your (creator|maker)\??/i,
    /who developed (you|vexa)\??/i,
    /who programmed (you|vexa)\??/i
  ];
  return patterns.some((pattern) => pattern.test(lowerMsg));
};

export const generateVexaResponse = (userMessage: string): string => {
  const lowerMsg = userMessage.toLowerCase();

  // Check for creator questions first
  if (detectCreatorQuestion(userMessage)) {
    return "I was created by Aaron.";
  }

  // Check for greetings
  const greetPatterns = new RegExp(`\\b(hi|hello|hey)[, ]?(${vexaProfile.name.toLowerCase()})\\b`);
  if (greetPatterns.test(lowerMsg)) {
    return getTimeBasedGreeting();
  }

  // Check for specific questions about Vexa
  if (lowerMsg.includes("name") || lowerMsg.includes("who are you")) {
    return vexaProfile.introResponse;
  }

  // Check for direct mentions of Vexa
  if (detectVexaMention(userMessage)) {
    return vexaProfile.playfulResponse;
  }

  // Check if it's a question
  if (lowerMsg.trim().endsWith("?")) {
    return "That's an interesting question! Let me help you with that.";
  }

  return vexaProfile.fallbackResponse;
};