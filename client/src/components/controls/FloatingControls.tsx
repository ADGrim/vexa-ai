import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, MicOff, Volume2 } from "lucide-react";

interface FloatingControlsProps {
  voices: SpeechSynthesisVoice[];
  selectedVoice: string | null;
  onVoiceChange: (voice: string) => void;
  speechRate: number;
  onSpeechRateChange: (rate: number) => void;
  voiceRecognitionActive: boolean;
  onVoiceRecognitionToggle: () => void;
}

export function FloatingControls({
  voices,
  selectedVoice,
  onVoiceChange,
  speechRate,
  onSpeechRateChange,
  voiceRecognitionActive,
  onVoiceRecognitionToggle
}: FloatingControlsProps) {
  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-lg rounded-full p-4 shadow-xl border border-primary/20 flex items-center gap-4"
    >
      <Select value={selectedVoice || undefined} onValueChange={onVoiceChange}>
        <SelectTrigger className="w-[180px] bg-background/50">
          <SelectValue placeholder="Select voice" />
        </SelectTrigger>
        <SelectContent>
          {voices.map((voice) => (
            <SelectItem key={voice.name} value={voice.name}>
              {voice.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Volume2 className="h-4 w-4" />
        <Slider
          className="w-32"
          min={0.5}
          max={2}
          step={0.1}
          value={[speechRate]}
          onValueChange={([value]) => onSpeechRateChange(value)}
        />
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={onVoiceRecognitionToggle}
        className={voiceRecognitionActive ? "bg-primary text-primary-foreground" : ""}
      >
        {voiceRecognitionActive ? <Mic /> : <MicOff />}
      </Button>
    </motion.div>
  );
}
