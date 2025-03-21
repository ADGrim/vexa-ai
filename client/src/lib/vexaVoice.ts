import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function speakWithNova(text: string): Promise<Blob> {
  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text
    });

    // Convert the response to a blob
    const audioData = await response.arrayBuffer();
    return new Blob([audioData], { type: 'audio/mpeg' });
  } catch (error) {
    console.error("TTS Error:", error);
    throw error;
  }
}

interface AudioState {
  audio: HTMLAudioElement | null;
  context: AudioContext | null;
  analyser: AnalyserNode | null;
  source: MediaElementAudioSourceNode | null;
}

class VexaVoice {
  private audioState: AudioState = {
    audio: null,
    context: null,
    analyser: null,
    source: null
  };

  async speak(text: string, onVisualizerData?: (data: Uint8Array) => void) {
    try {
      // Clean up previous audio if any
      this.cleanup();

      // Create audio context and analyser
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      // Get the audio blob from OpenAI
      const audioBlob = await speakWithNova(text);
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and set up audio element
      const audio = new Audio(audioUrl);
      const source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      // Store the audio state
      this.audioState = {
        audio,
        context: audioContext,
        analyser,
        source
      };

      // Set up visualizer if callback provided
      if (onVisualizerData) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateVisualizer = () => {
          if (this.audioState.analyser) {
            this.audioState.analyser.getByteFrequencyData(dataArray);
            onVisualizerData(dataArray);
            if (!audio.paused) {
              requestAnimationFrame(updateVisualizer);
            }
          }
        };
        audio.addEventListener('play', updateVisualizer);
      }

      // Play the audio
      await audio.play();
      
      // Clean up when done
      audio.addEventListener('ended', () => {
        this.cleanup();
        URL.revokeObjectURL(audioUrl);
      });

    } catch (error) {
      console.error("Error in VexaVoice.speak:", error);
      this.cleanup();
      throw error;
    }
  }

  cleanup() {
    if (this.audioState.audio) {
      this.audioState.audio.pause();
      this.audioState.audio.src = '';
    }
    if (this.audioState.context?.state !== 'closed') {
      this.audioState.context?.close();
    }
    this.audioState = {
      audio: null,
      context: null,
      analyser: null,
      source: null
    };
  }

  isPlaying(): boolean {
    return !!(this.audioState.audio && !this.audioState.audio.paused);
  }
}

export const vexaVoice = new VexaVoice();
