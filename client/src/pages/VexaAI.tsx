import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import OpenAI from "openai";
import { useToast } from "@/hooks/use-toast";
import VexaLayout from "@/components/VexaLayout";
import { ListeningCircle } from "@/components/ListeningCircle";
import { MoodSyncWrapper } from "@/components/MoodSyncWrapper";
import { speakMyStyle } from "@/lib/SpeakMyStyle";
import { detectVexaMention, generateVexaResponse } from "@/lib/vexaPatterns";
import { vexaSystemPrompt } from "@/lib/vexaSystemPrompt";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface AudioState {
  context: AudioContext | null;
  analyser: AnalyserNode | null;
  audio: HTMLAudioElement | null;
  animationFrame: number | null;
}

const speakText = (text: string) => {
  if (!('speechSynthesis' in window)) {
    console.error('Speech synthesis not supported');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Configure voice settings
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  // Try to set a female voice if available
  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = voices.find(voice =>
    voice.name.toLowerCase().includes('female') ||
    voice.name.toLowerCase().includes('samantha')
  );
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  // Add event handlers
  utterance.onstart = () => {
    setIsSpeaking(true);
  };

  utterance.onend = () => {
    setIsSpeaking(false);
  };

  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event);
    setIsSpeaking(false);
  };

  window.speechSynthesis.speak(utterance);
};


const sanitizeAIResponse = (response: string): string => {
  const lowerResponse = response.toLowerCase();
  if (lowerResponse.includes("openai") || 
      lowerResponse.includes("language model") ||
      lowerResponse.includes("ai model") ||
      lowerResponse.includes("artificial intelligence model")) {
    return "I'm Vexa, created by Aaron — here to help!";
  }
  return response;
};

export default function VexaAI() {
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "ai" }>>([]);
  const [input, setInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceRecognitionActive, setVoiceRecognitionActive] = useState(false);
  const [styleAdaptationEnabled, setStyleAdaptationEnabled] = useState(false);
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioStateRef = useRef<AudioState>({
    context: null,
    analyser: null,
    audio: null,
    animationFrame: null
  });

  // Toggle style adaptation
  useEffect(() => {
    if (styleAdaptationEnabled) {
      speakMyStyle.enable();
    } else {
      speakMyStyle.disable();
    }
  }, [styleAdaptationEnabled]);

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  const cleanupAudio = () => {
    const { audio, context, animationFrame } = audioStateRef.current;
    if (audio) {
      audio.pause();
      audio.src = "";
    }
    if (context?.state !== 'closed') {
      context?.close();
    }
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    audioStateRef.current = {
      context: null,
      analyser: null,
      audio: null,
      animationFrame: null
    };
    setIsSpeaking(false);
  };

  const setupAudioContext = () => {
    try {
      if (!audioStateRef.current.context) {
        audioStateRef.current.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (!audioStateRef.current.analyser) {
        audioStateRef.current.analyser = audioStateRef.current.context.createAnalyser();
        audioStateRef.current.analyser.fftSize = 256;
      }
      return true;
    } catch (error) {
      console.error("Failed to setup audio context:", error);
      return false;
    }
  };

  const visualizeAudio = () => {
    const { analyser } = audioStateRef.current;
    if (!canvasRef.current || !analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isSpeaking) {
        if (audioStateRef.current.animationFrame) {
          cancelAnimationFrame(audioStateRef.current.animationFrame);
          audioStateRef.current.animationFrame = null;
        }
        return;
      }

      audioStateRef.current.animationFrame = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        gradient.addColorStop(0, 'hsl(var(--primary) / 0.3)');
        gradient.addColorStop(1, 'hsl(var(--primary))');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();
  };

  // Update the fetchAIResponse function to include custom interception
  const fetchAIResponse = async (userInput: string) => {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new Error("OpenAI API key is required");
    }

    try {
      // Check for creator questions first
      if (detectCreatorQuestion(userInput)) {
        return "I was created by Aaron.";
      }

      // Check for direct Vexa questions or identity queries
      if (detectVexaMention(userInput) || userInput.toLowerCase().includes("who are you")) {
        return "I'm Vexa, created by Aaron — your smart AI companion.";
      }

      // If no direct intercept, proceed with OpenAI API call
      console.log("Fetching AI response...");
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: vexaSystemPrompt },
          { role: "user", content: userInput }
        ],
        max_tokens: 150
      });

      if (!response.choices?.[0]?.message?.content) {
        throw new Error("Invalid response from OpenAI");
      }

      // Sanitize and style the response
      let aiResponse = sanitizeAIResponse(response.choices[0].message.content);

      // Apply style adaptation if enabled
      if (styleAdaptationEnabled) {
        aiResponse = speakMyStyle.styleResponse(aiResponse);
      }

      return aiResponse;
    } catch (error: any) {
      console.error("OpenAI API Error:", error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Record user message for style analysis
    if (styleAdaptationEnabled) {
      speakMyStyle.recordMessage(input);
    }

    const newMessage = { text: input, sender: "user" as const };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const aiResponse = await fetchAIResponse(input);
      const aiMessage = { text: aiResponse, sender: "ai" as const };
      setMessages((prev) => [...prev, aiMessage]);

      // Speak the AI response
      speakText(aiResponse);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    }
  };


  const detectVexaMention = (userInput: string): boolean => {
    // Implement your Vexa mention detection logic here
    // This is a placeholder, replace with your actual logic
    return userInput.toLowerCase().includes("vexa");
  };

  const generateVexaResponse = (userInput: string): string => {
    // Implement your Vexa response generation logic here
    // This is a placeholder, replace with your actual logic
    return "This is a Vexa-specific response to: " + userInput;
  };

  const detectCreatorQuestion = (userInput: string): boolean => {
    //Add your logic to detect creator questions here.  This is a placeholder.
    return userInput.toLowerCase().includes("who created you") || userInput.toLowerCase().includes("who made you");
  };

  return (
    <MoodSyncWrapper>
      <div className="min-h-screen transition-colors duration-1000">
        <VexaLayout
          messages={messages}
          input={input}
          onInputChange={setInput}
          onSendMessage={handleSendMessage}
          isSpeaking={isSpeaking}
          voiceRecognitionActive={voiceRecognitionActive}
          setVoiceRecognitionActive={setVoiceRecognitionActive}
          styleAdaptationEnabled={styleAdaptationEnabled}
          setStyleAdaptationEnabled={setStyleAdaptationEnabled}
          canvasRef={canvasRef}
        />
      </div>
    </MoodSyncWrapper>
  );
}