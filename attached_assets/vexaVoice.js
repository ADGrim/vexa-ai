
export const speak = (text) => {
  if ('speechSynthesis' in window) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    const voices = synth.getVoices();
    const britishVoice = voices.find(
      (v) =>
        (v.lang === 'en-GB' || v.name.toLowerCase().includes('british')) &&
        !v.name.toLowerCase().includes('google')
    ) || voices.find((v) => v.lang === 'en-GB');

    const fallbackVoice = voices.find(
      (v) => v.name.toLowerCase().includes('female') && v.lang.startsWith('en')
    );

    utterance.voice = britishVoice || fallbackVoice || voices[0];
    utterance.rate = 1;
    utterance.pitch = 1;
    synth.speak(utterance);
  } else {
    console.warn('Speech synthesis not supported.');
  }
};
