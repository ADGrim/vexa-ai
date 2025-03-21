const forbiddenKeywords = [
  'bomb', 'explosive', 'weapon', 'harm', 'destructive', 'attack',
  'kill', 'violence', 'terrorism', 'biohazard', 'dangerous recipe',
  'explosion', 'poison', 'how to make', 'dangerous chemicals'
];

export const isUnsafeRequest = (message: string): boolean => {
  const lowerMsg = message.toLowerCase();
  return forbiddenKeywords.some((word) => lowerMsg.includes(word));
};

export const safeResponse = (): string =>
  "I'm sorry, but I can't assist with that request. Let's focus on positive and helpful topics!";
