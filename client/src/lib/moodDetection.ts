interface MoodStyles {
  excited: string;
  frustrated: string;
  sad: string;
  thoughtful: string;
  neutral: string;
}

export type Mood = keyof MoodStyles;

export const moodStyles: MoodStyles = {
  excited: 'bg-gradient-to-r from-pink-500 via-yellow-400 to-pink-500 text-white shadow-lg',
  frustrated: 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md',
  sad: 'bg-gradient-to-r from-blue-400 to-indigo-600 text-white shadow-sm',
  thoughtful: 'bg-gradient-to-r from-purple-500 to-blue-700 text-white shadow-md',
  neutral: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md',
};

export const detectUserMood = (message: string): Mood => {
  const lower = message.toLowerCase();
  const excitementWords = ['awesome', 'yay', 'excited', "can't wait", "let's go"];
  const frustrationWords = ['ugh', 'annoyed', 'mad', 'why', 'frustrated'];
  const sadnessWords = ['sad', 'down', 'tired', 'lonely'];

  if (excitementWords.some(word => lower.includes(word)) || /!{2,}/.test(message)) {
    return 'excited';
  } else if (frustrationWords.some(word => lower.includes(word))) {
    return 'frustrated';
  } else if (sadnessWords.some(word => lower.includes(word))) {
    return 'sad';
  } else if (message.length > 120 || message.includes('...')) {
    return 'thoughtful';
  }
  return 'neutral';
};
