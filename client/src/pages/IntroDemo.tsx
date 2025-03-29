import React, { useState } from 'react';
import VexaIntro from '@/components/VexaIntro';
import { Button } from '@/components/ui/button';

/**
 * Demo page showcasing the VexaIntro component
 */
export default function IntroDemo() {
  const [showIntro, setShowIntro] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-purple-400">
        Vexa Intro Animation Demo
      </h1>
      
      <div className="flex flex-col items-center space-y-6 w-full max-w-xl">
        <p className="text-white/70 text-center">
          This demo showcases the VexaIntro component, which provides a stylish animated
          introduction screen for Vexa applications on both web and React Native platforms.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="bg-black/40 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">Features</h2>
            <ul className="list-disc list-inside space-y-2 text-white/80">
              <li>Customizable text and styling</li>
              <li>Text-to-speech introduction</li>
              <li>Fade-in animation with scale effect</li>
              <li>Integrated VoiceMobius animation</li>
              <li>Completion callback function</li>
              <li>Works on web and React Native</li>
            </ul>
          </div>
          
          <div className="bg-black/40 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">Implementation</h2>
            <div className="text-sm text-white/80 overflow-auto max-h-48 bg-black/50 p-4 rounded-md font-mono">
              {`import { VexaIntro } from 'vexa-voice-chat';

// Basic usage
<VexaIntro 
  onIntroComplete={() => setShowIntro(false)}
/>`}
            </div>
          </div>
        </div>
        
        <Button 
          onClick={() => setShowIntro(true)}
          className="px-8 py-6 text-xl bg-purple-600 hover:bg-purple-700 rounded-full"
        >
          Play Intro Animation
        </Button>
      </div>
      
      {/* Render the intro animation when showIntro is true */}
      {showIntro && (
        <VexaIntro onIntroComplete={() => setShowIntro(false)} />
      )}
    </div>
  );
}