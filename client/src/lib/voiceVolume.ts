/**
 * This utility helps to measure voice volume from audio input
 * Only works in web environments that support the Web Audio API
 */

export interface VoiceVolumeConfig {
  onVolumeChange?: (volume: number) => void;
  fftSize?: number; // Higher values give more precision but use more CPU, must be power of 2
  smoothingTimeConstant?: number; // Between 0-1, how much to smooth volume changes
  minDecibels?: number;
  maxDecibels?: number;
}

export class VoiceVolumeAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private dataArray: Uint8Array | null = null;
  private requestId: number | null = null;
  private config: Required<VoiceVolumeConfig>;
  
  constructor(config: VoiceVolumeConfig = {}) {
    this.config = {
      onVolumeChange: config.onVolumeChange || (() => {}),
      fftSize: config.fftSize || 1024,
      smoothingTimeConstant: config.smoothingTimeConstant || 0.8,
      minDecibels: config.minDecibels || -90,
      maxDecibels: config.maxDecibels || -10
    };
  }
  
  public async start(): Promise<void> {
    if (!window.AudioContext) {
      console.warn('Web Audio API is not supported in this browser');
      return;
    }
    
    try {
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.config.fftSize;
      this.analyser.smoothingTimeConstant = this.config.smoothingTimeConstant;
      this.analyser.minDecibels = this.config.minDecibels;
      this.analyser.maxDecibels = this.config.maxDecibels;
      
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      
      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.source.connect(this.analyser);
      
      // Start analyzing
      this.analyze();
    } catch (error) {
      console.error('Error starting voice volume analyzer:', error);
    }
  }
  
  public stop(): void {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }
    
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.analyser = null;
    this.dataArray = null;
  }
  
  private analyze = (): void => {
    if (!this.analyser || !this.dataArray) return;
    
    this.analyser.getByteFrequencyData(this.dataArray);
    
    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
    }
    
    const average = sum / this.dataArray.length;
    // Normalize to 0-1 range
    const volume = Math.min(1, Math.max(0, average / 255));
    
    this.config.onVolumeChange(volume);
    
    this.requestId = requestAnimationFrame(this.analyze);
  };
}

// Singleton instance for easy access
let analyzerInstance: VoiceVolumeAnalyzer | null = null;

export const getVoiceVolumeAnalyzer = (config?: VoiceVolumeConfig): VoiceVolumeAnalyzer => {
  if (!analyzerInstance) {
    analyzerInstance = new VoiceVolumeAnalyzer(config);
  }
  return analyzerInstance;
};