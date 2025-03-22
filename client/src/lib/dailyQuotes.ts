export const dailyQuotes = [
  '✨ "Everything we call real is made of things that cannot be regarded as real." - Niels Bohr',
  '🌌 "Quantum physics tells us reality is far stranger than fiction."',
  '🧭 "Imagination is more important than knowledge." - Albert Einstein',
  '🧘 "At the quantum level, everything is possibility — and possibility is power."',
  '💡 "Your observation creates reality. Make it beautiful." - Vexa',
  '🚀 "Even uncertainty is a form of knowing."',
  '🔭 "Look closely at nature — the quantum world is poetry in disguise."',
  '🫧 "Nothing is truly separate; we are entangled in ways beyond comprehension."',
  '📖 "You are both the observer and the creator of your story."',
  '⚡ "In quantum mechanics, the observer is the key to reality." - Max Planck',
  '🎯 "The more precisely the position is determined, the less precisely the momentum is known." - Heisenberg',
  '🌟 "The universe is not only stranger than we imagine, it\'s stranger than we can imagine." - J.B.S. Haldane'
];

export const getDailyQuote = (): string => {
  const index = new Date().getDate() % dailyQuotes.length;
  return dailyQuotes[index];
};