import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";

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
  onTest: () => void;
}

export function VoiceSelector({
  selectedVoice,
  onVoiceChange,
  rate,
  onRateChange,
  onTest,
}: VoiceSelectorProps) {
  return (
    <Card className="p-4 bg-background/40 backdrop-blur-sm border-primary/20">
      <div className="space-y-4">
        <div className="flex gap-2 items-end">
          <div className="flex-1 space-y-2">
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
          <Button 
            variant="outline"
            size="icon"
            onClick={onTest}
            className="h-10 w-10"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
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