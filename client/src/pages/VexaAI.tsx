import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import VexaLayout from "@/components/VexaLayout";
import { VoiceSelector } from "@/components/controls/VoiceSelector";
import { useToast } from "@/hooks/use-toast";
import OpenAI from "openai";
import { ListeningCircle } from "@/components/ListeningCircle";
import { MoodSyncWrapper } from "@/components/MoodSyncWrapper";
import { speakMyStyle } from "@/lib/SpeakMyStyle";

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

export default function VexaAI() {
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "ai" }>>([]);
  const [input, setInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<"nova" | "alloy" | "echo" | "fable" | "onyx" | "shimmer">("nova");
  const [rate, setRate] = useState(1);
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

  const fetchAIResponse = async (userInput: string) => {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new Error("OpenAI API key is required");
    }

    try {
      console.log("Fetching AI response...");
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: userInput }],
        max_tokens: 150
      });

      if (!response.choices?.[0]?.message?.content) {
        throw new Error("Invalid response from OpenAI");
      }

      // Apply style adaptation if enabled
      let aiResponse = response.choices[0].message.content;
      if (styleAdaptationEnabled) {
        aiResponse = speakMyStyle.styleResponse(aiResponse);
      }

      return aiResponse;
    } catch (error: any) {
      console.error("OpenAI API Error:", error);
      throw error;
    }
  };

  const speakText = async (text: string) => {
    try {
      cleanupAudio();

      if (!setupAudioContext()) {
        throw new Error("Failed to initialize audio context");
      }

      console.log("Starting TTS with:", { text, voice: selectedVoice, rate });
      setIsSpeaking(true);

      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "tts-1-hd",
          input: text,
          voice: selectedVoice,
          speed: rate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to generate speech");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioStateRef.current.audio = audio;

      const source = audioStateRef.current.context!.createMediaElementSource(audio);
      source.connect(audioStateRef.current.analyser!);
      audioStateRef.current.analyser!.connect(audioStateRef.current.context!.destination);

      audio.onplay = () => {
        console.log("Audio playback started");
        visualizeAudio();
      };

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        throw new Error("Audio playback failed");
      };

      await audio.play();
    } catch (error) {
      console.error("Speech synthesis error:", error);
      setIsSpeaking(false);
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Voice Synthesis Error",
          description: error.message
        });
      } else {
        toast({
          variant: "destructive",
          title: "Voice Synthesis Error",
          description: "Failed to generate voice response"
        });
      }
    }
  };

  const testVoice = async () => {
    try {
      const testMessage = `This is a test of the ${selectedVoice} voice.`;
      await speakText(testMessage);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Voice Test Failed",
        description: error instanceof Error ? error.message : "Failed to test voice"
      });
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
      await speakText(aiResponse);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    }
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

        {/* Voice Controls */}
        <div className="fixed bottom-4 right-4">
          <VoiceSelector
            selectedVoice={selectedVoice}
            onVoiceChange={setSelectedVoice}
            rate={rate}
            onRateChange={setRate}
            onTest={testVoice}
          />
        </div>
      </div>
    </MoodSyncWrapper>
  );
}