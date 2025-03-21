export const conversationalAdjustments = (response: string): string => {
  const openers = ["Oh, that's interesting!", "Hmm, okay!", "I get it!", "Ah, let me think!", "Sure!"];
  const closers = ["😊", "Let me know if that makes sense!", "What do you think?", "Want me to explain more?"];

  // Add opener
  if (response.length > 80 && Math.random() > 0.6) {
    response = `${openers[Math.floor(Math.random() * openers.length)]} ${response}`;
  }

  // Add closer
  if (Math.random() > 0.5) {
    response = `${response} ${closers[Math.floor(Math.random() * closers.length)]}`;
  }

  return response;
};
