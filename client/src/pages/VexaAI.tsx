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

export default function VexaAI() {
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "ai" }>>([]);
  const [input, setInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [rate, setRate] = useState(1);
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const speechSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        console.log("Available voices:", availableVoices);
        setVoices(availableVoices);
        // Prefer English voices
        const englishVoice = availableVoices.find(v => v.lang.startsWith('en-'));
        setSelectedVoice(englishVoice?.name || availableVoices[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

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
      if (!isSpeaking) return;
      requestAnimationFrame(draw);

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
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      toast({
        variant: "destructive",
        title: "API Key Missing",
        description: "Please provide your OpenAI API key to continue."
      });
      return null;
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: userInput }],
        max_tokens: 150
      });

      if (!response.choices?.[0]?.message?.content) {
        throw new Error("Invalid response from OpenAI");
      }

      return response.choices[0].message.content;
    } catch (error: any) {
      console.error("API Error:", error);

      if (error.error?.type === "insufficient_quota") {
        toast({
          variant: "destructive",
          title: "API Quota Exceeded",
          description: "Your OpenAI API credits have been depleted. Please add more credits to continue."
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to get AI response. Please try again."
        });
      }
      return null;
    }
  };

  const speakText = (text: string) => {
    if (!window.speechSynthesis) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Your browser doesn't support speech synthesis."
      });
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    if (!setupAudioContext()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initialize audio visualization."
      });
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;

    // Set selected voice
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      console.log("Speech started");
      setIsSpeaking(true);
      visualizeAudio();
    };

    utterance.onend = () => {
      console.log("Speech ended");
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
      toast({
        variant: "destructive",
        title: "Speech Error",
        description: "Failed to speak the response. Please try again."
      });
    };

    window.speechSynthesis.speak(utterance);
  };

  const testVoice = () => {
    const testMessage = `This is a test of the selected voice.`;
    speakText(testMessage);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" as const };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    const aiResponse = await fetchAIResponse(input);
    if (aiResponse) {
      const aiMessage = { text: aiResponse, sender: "ai" as const };
      setMessages((prev) => [...prev, aiMessage]);
      speakText(aiResponse);
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
          voices={voices}
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