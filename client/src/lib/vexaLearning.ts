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

  if (message.includes('!')) {
    learningData.exclamationFrequency++;
  }

  // Updated emoji detection using Unicode escape sequences
  if (/[\u{1F600}-\u{1F64F}]/u.test(message)) {
    learningData.emojiUsage++;
  }

  if (message.trim().endsWith('?')) {
    learningData.userQuestionsAsked++;
  }
};

export const adjustResponseTone = (baseResponse: string): string => {
  let response = baseResponse;

  // If user uses lots of emojis, add them in responses
  if (learningData.emojiUsage / learningData.interactions > 0.3) {
    response += ' 😊';
  }

  // If user frequently uses exclamation points, mirror energy
  if (learningData.exclamationFrequency / learningData.interactions > 0.4) {
    response = response.replace(/\.$/, '!').replace(/\?$/, '!');
  }

  // If user asks lots of questions, respond with inquisitive tone
  if (learningData.userQuestionsAsked / learningData.interactions > 0.5) {
    response = response.endsWith('.') ? response.slice(0, -1) + '?' : response + '?';
  }

  return response;
};

export const getLearningSummary = (): LearningData => ({ ...learningData });