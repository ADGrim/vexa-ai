import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { VoiceSelector } from "@/components/controls/VoiceSelector";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Cost calculation constants
const TTS_COST_PER_1K_CHARS = 0.015; // $0.015 per 1K characters

export default function VexaAI() {
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "ai" }>>([]);
  const [input, setInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<"nova" | "alloy" | "echo" | "fable" | "onyx" | "shimmer">("nova");
  const [rate, setRate] = useState(1);
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number>();

  // Clean up function for audio resources
  const cleanupAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = "";
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsSpeaking(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  const calculateTTSCost = (text: string): number => {
    const charCount = text.length;
    return (charCount / 1000) * TTS_COST_PER_1K_CHARS;
  };

  const setupAudioContext = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      if (!analyserRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
      }

      return true;
    } catch (error) {
      console.error("Failed to setup audio context:", error);
      return false;
    }
  };

  const visualizeAudio = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isSpeaking) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        return;
      }

      animationFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current!.getByteFrequencyData(dataArray);

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
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: userInput }],
        max_tokens: 150, // Limit response length to control costs
      });

      const aiResponse = response.choices[0].message.content;
      if (!aiResponse) throw new Error("Empty response from AI");

      // Calculate and warn about TTS costs
      const cost = calculateTTSCost(aiResponse);
      if (cost > 1) { // Warn if cost is over $1
        toast({
          title: "High TTS Cost Warning",
          description: `This response will cost approximately $${cost.toFixed(2)} to speak.`,
        });
      }

      return aiResponse;
    } catch (error) {
      console.error("Error fetching AI response:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI response. Please try again."
      });
      throw error;
    }
  };

  const speakText = async (text: string) => {
    try {
      // Clean up any existing audio
      cleanupAudio();

      if (!setupAudioContext()) {
        throw new Error("Failed to initialize audio context");
      }

      // Calculate cost before making the request
      const cost = calculateTTSCost(text);
      console.log("TTS cost estimation:", cost);

      // For very long responses, ask for confirmation
      if (cost > 0.5) {
        const shouldProceed = window.confirm(
          `This voice response will cost approximately $${cost.toFixed(2)}. Would you like to proceed?`
        );
        if (!shouldProceed) {
          return;
        }
      }

      console.log("Starting TTS with voice:", selectedVoice);
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
        if (errorData.error?.code === "insufficient_quota") {
          throw new Error("OpenAI API credit limit reached. Please add more credits to your account.");
        }
        throw new Error(`Speech synthesis failed: ${errorData.error?.message || response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and set up audio element
      const audio = new Audio(audioUrl);
      audioElementRef.current = audio;

      // Connect audio element to analyzer
      const source = audioContextRef.current!.createMediaElementSource(audio);
      source.connect(analyserRef.current!);
      analyserRef.current!.connect(audioContextRef.current!.destination);

      // Set up audio event handlers
      audio.onplay = () => {
        console.log("Audio playback started");
        visualizeAudio();
      };

      audio.onended = () => {
        console.log("Audio playback ended");
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        throw new Error("Audio playback failed");
      };

      await audio.play();
    } catch (error) {
      console.error("Error in speech synthesis:", error);
      setIsSpeaking(false);
      toast({
        variant: "destructive",
        title: "Voice Synthesis Error",
        description: error instanceof Error ? error.message : "Failed to generate voice response"
      });
    }
  };

  const testVoice = async () => {
    const testMessage = `This is a test of the ${selectedVoice} voice.`;
    await speakText(testMessage);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" as const };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const aiResponse = await fetchAIResponse(input);
      setMessages((prev) => [...prev, { text: aiResponse, sender: "ai" as const }]);
      await speakText(aiResponse);
    } catch (error) {
      console.error("Error processing message:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card className="bg-background/40 backdrop-blur-md border-primary/20">
          {/* Chat Messages Area */}
          <div className="h-[60vh] overflow-y-auto p-4">
            <ChatMessage messages={messages} isSpeaking={isSpeaking} />
          </div>

          {/* Audio Visualizer */}
          <div className="px-4 pb-4">
            <canvas
              ref={canvasRef}
              width={600}
              height={100}
              className="w-full h-[100px] rounded-lg bg-background/20 backdrop-blur-sm"
            />
          </div>

          {/* Message Input Area */}
          <div className="p-4 bg-background/60 backdrop-blur-sm border-t border-primary/20">
            <div className="flex gap-2 items-end">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                className="min-h-[60px] text-base bg-background/50 border-primary/20 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button 
                onClick={sendMessage}
                size="icon"
                className="h-[60px] w-[60px] bg-primary hover:bg-primary/90"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Voice Controls */}
        <VoiceSelector
          selectedVoice={selectedVoice}
          onVoiceChange={setSelectedVoice}
          rate={rate}
          onRateChange={setRate}
          onTest={testVoice}
        />
      </div>
    </div>
  );
}