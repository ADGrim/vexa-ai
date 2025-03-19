import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const OPENAI_VOICES = [
  { id: "nova", name: "Nova", description: "Gentle and natural" },
  { id: "alloy", name: "Alloy", description: "Versatile and balanced" },
  { id: "echo", name: "Echo", description: "Clear and crisp" },
  { id: "fable", name: "Fable", description: "British accent" },
  { id: "onyx", name: "Onyx", description: "Deep and authoritative" },
  { id: "shimmer", name: "Shimmer", description: "Warm and welcoming" }
];

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceChange: (voice: "nova" | "alloy" | "echo" | "fable" | "onyx" | "shimmer") => void;
  rate: number;
  onRateChange: (rate: number) => void;
}

export function VoiceSelector({
  selectedVoice,
  onVoiceChange,
  rate,
  onRateChange,
}: VoiceSelectorProps) {
  return (
    <Card className="p-4 bg-background/40 backdrop-blur-sm border-primary/20">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>AI Voice</Label>
          <Select value={selectedVoice} onValueChange={onVoiceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {OPENAI_VOICES.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{voice.name}</span>
                    <span className="text-xs text-muted-foreground">{voice.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Speed</Label>
          <Slider
            min={0.5}
            max={2.0}
            step={0.1}
            value={[rate]}
            onValueChange={([value]) => onRateChange(value)}
          />
        </div>
      </div>
    </Card>
  );
}