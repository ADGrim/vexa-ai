import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface Voice {
  name: string;
  lang: string;
}

interface VoiceSelectorProps {
  voices: Voice[];
  selectedVoice: string | null;
  onVoiceChange: (voice: string) => void;
  pitch: number;
  onPitchChange: (pitch: number) => void;
  rate: number;
  onRateChange: (rate: number) => void;
}

export function VoiceSelector({
  voices,
  selectedVoice,
  onVoiceChange,
  pitch,
  onPitchChange,
  rate,
  onRateChange,
}: VoiceSelectorProps) {
  return (
    <Card className="p-4 bg-background/40 backdrop-blur-sm border-primary/20">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Voice</Label>
          <Select value={selectedVoice || undefined} onValueChange={onVoiceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {voices.map((voice) => (
                <SelectItem key={voice.name} value={voice.name}>
                  {`${voice.name} (${voice.lang})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Pitch</Label>
          <Slider
            min={0.5}
            max={2}
            step={0.1}
            value={[pitch]}
            onValueChange={([value]) => onPitchChange(value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Speed</Label>
          <Slider
            min={0.5}
            max={2}
            step={0.1}
            value={[rate]}
            onValueChange={([value]) => onRateChange(value)}
          />
        </div>
      </div>
    </Card>
  );
}
