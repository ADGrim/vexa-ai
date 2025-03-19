import { useState, useEffect } from "react";
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
  const [selectedVoice, setSelectedVoice] = useState<"nova" | "alloy" | "echo" | "fable" | "onyx" | "shimmer">("nova");
  const [rate, setRate] = useState(1);
  const { toast } = useToast();

  const fetchAIResponse = async (userInput: string) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: userInput }]
      });

      const aiResponse = response.choices[0].message.content;
      if (!aiResponse) throw new Error("Empty response from AI");
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

  const startHumanlikeVoiceResponse = async (text: string) => {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      toast({
        variant: "destructive",
        title: "API Key Missing",
        description: "Please provide your OpenAI API key to enable voice responses."
      });
      return;
    }

    try {
      console.log("Starting voice synthesis...");
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
        const errorText = await response.text();
        throw new Error(`Speech synthesis failed: ${response.status} - ${errorText}`);
      }

      console.log("Received audio response, creating blob...");
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onloadeddata = () => {
        console.log("Audio loaded, starting playback...");
      };

      audio.onplay = () => {
        console.log("Audio playback started");
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
        toast({
          variant: "destructive",
          title: "Playback Error",
          description: "Failed to play audio response. Please try again."
        });
      };

      await audio.play();
    } catch (error) {
      console.error("Error generating speech:", error);
      setIsSpeaking(false);
      toast({
        variant: "destructive",
        title: "Voice Synthesis Error",
        description: "Failed to generate voice response. Please try again."
      });
    }
  };

  const testVoice = async () => {
    const testMessage = "This is a test of the voice synthesis system.";
    await startHumanlikeVoiceResponse(testMessage);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" as const };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const aiResponse = await fetchAIResponse(input);
      setMessages((prev) => [...prev, { text: aiResponse, sender: "ai" as const }]);
      await startHumanlikeVoiceResponse(aiResponse);
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