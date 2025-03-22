import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnboardingModal({ open, onOpenChange }: OnboardingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-b from-purple-900/90 to-black/90 border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Welcome to VexaAI! 🌟
          </DialogTitle>
          <DialogDescription className="text-white/80">
            Your intelligent companion for exploring quantum physics and beyond.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-white">🎯 Key Features</h3>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2">
                <span className="text-purple-400">•</span>
                Ask anything about quantum physics and get clear explanations
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">•</span>
                Generate stunning AI images to visualize concepts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">•</span>
                Voice interactions for natural conversations
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">•</span>
                Adaptive responses that match your style
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-white">🚀 Getting Started</h3>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2">
                <span className="text-purple-400">1.</span>
                Type your question or click the wave icon to speak
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">2.</span>
                Try the image generation feature with the image icon
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">3.</span>
                Enable "Speak My Style" for personalized responses
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={() => onOpenChange(false)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            Let's Start!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OnboardingModal;