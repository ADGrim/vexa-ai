import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { VoiceSelector } from "@/components/controls/VoiceSelector";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
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

  // Voice control states
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    // Load available voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Clean up
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

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
      throw error;
    }
  };

  const speakText = (text: string) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Apply voice settings
    utterance.pitch = pitch;
    utterance.rate = rate;

    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      console.log("Speech started");
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log("Speech ended");
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" as const };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const aiResponse = await fetchAIResponse(input);
      setMessages((prev) => [...prev, { text: aiResponse, sender: "ai" as const }]);
      speakText(aiResponse);
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
          voices={voices}
          selectedVoice={selectedVoice}
          onVoiceChange={setSelectedVoice}
          pitch={pitch}
          onPitchChange={setPitch}
          rate={rate}
          onRateChange={setRate}
        />
      </div>
    </div>
  );
}