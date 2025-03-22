import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: {
    voiceEnabled: boolean;
    styleAdaptation: boolean;
    darkMode: boolean;
  };
  onSettingChange: (setting: string, value: boolean) => void;
}

export function SettingsModal({ 
  open, 
  onOpenChange, 
  settings, 
  onSettingChange 
}: SettingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-b from-purple-900/90 to-black/90 border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            VexaAI Settings ⚙️
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Customize your interaction preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Voice Interaction</Label>
              <p className="text-sm text-white/60">Enable voice commands and responses</p>
            </div>
            <Switch
              checked={settings.voiceEnabled}
              onCheckedChange={(checked) => onSettingChange('voiceEnabled', checked)}
              className="data-[state=checked]:bg-purple-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Style Adaptation</Label>
              <p className="text-sm text-white/60">Learn and match your communication style</p>
            </div>
            <Switch
              checked={settings.styleAdaptation}
              onCheckedChange={(checked) => onSettingChange('styleAdaptation', checked)}
              className="data-[state=checked]:bg-purple-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Dark Mode</Label>
              <p className="text-sm text-white/60">Toggle dark/light theme</p>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(checked) => onSettingChange('darkMode', checked)}
              className="data-[state=checked]:bg-purple-500"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsModal;