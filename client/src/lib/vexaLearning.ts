interface LearningData {
  preferredTone: 'neutral' | 'enthusiastic' | 'inquisitive';
  averageMessageLength: number;
  exclamationFrequency: number;
  emojiUsage: number;
  userQuestionsAsked: number;
  interactions: number;
}

const learningData: LearningData = {
  preferredTone: 'neutral',
  averageMessageLength: 0,
  exclamationFrequency: 0,
  emojiUsage: 0,
  userQuestionsAsked: 0,
  interactions: 0,
};

export const learnFromUserMessage = (message: string): void => {
  learningData.interactions++;
  learningData.averageMessageLength =
    ((learningData.averageMessageLength * (learningData.interactions - 1)) + message.length) /
    learningData.interactions;

  // Track exclamation usage
  if (message.includes('!')) {
    learningData.exclamationFrequency++;
  }

  // Track emoji usage using comprehensive emoji detection
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{2700}-\u{27BF}]|[\u{1F680}-\u{1F6FF}]|[\u{24C2}-\u{1F251}]/gu;
  const emojiCount = (message.match(emojiRegex) || []).length;
  if (emojiCount > 0) {
    learningData.emojiUsage += emojiCount;
  }

  // Track question-asking behavior
  if (message.trim().endsWith('?')) {
    learningData.userQuestionsAsked++;
  }

  // Update preferred tone based on message characteristics
  if (message.length > 100 || message.includes('?')) {
    learningData.preferredTone = 'inquisitive';
  } else if (message.includes('!') || emojiCount > 0) {
    learningData.preferredTone = 'enthusiastic';
  }
};

export const adjustResponseTone = (baseResponse: string): string => {
  let response = baseResponse;

  // Add emojis if user frequently uses them
  if (learningData.emojiUsage / learningData.interactions > 0.3) {
    response = response.replace(/\.$/, ' 😊').replace(/\!$/, ' ✨');
  }

  // Mirror enthusiasm level
  if (learningData.exclamationFrequency / learningData.interactions > 0.4) {
    response = response.replace(/\.$/, '!').replace(/\?$/, '!');
  }

  // Add inquisitive elements for users who ask lots of questions
  if (learningData.userQuestionsAsked / learningData.interactions > 0.5) {
    response += ' What do you think about that?';
  }

  // Adjust response length based on user's average message length
  if (learningData.averageMessageLength > 100 && response.length < 50) {
    response += ' Would you like me to elaborate further on any aspect?';
  }

  return response;
};

export const getLearningSummary = (): LearningData => ({ ...learningData });