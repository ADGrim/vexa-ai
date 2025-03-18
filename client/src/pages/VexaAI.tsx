import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { FloatingControls } from "@/components/controls/FloatingControls";
import { TaskList } from "@/components/tasks/TaskList";
import { motion } from "framer-motion";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";
const SERP_API_KEY = import.meta.env.VITE_SERP_API_KEY || "";

// Add type declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export default function VexaAI() {
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "ai" }>>([]);
  const [input, setInput] = useState("");
  const [memory, setMemory] = useState<Array<{ role: string; content: string }>>([]);
  const [tasks, setTasks] = useState<string[]>([]);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState(1);
  const [voiceRecognitionActive, setVoiceRecognitionActive] = useState(false);
  // Add this to the state declarations
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  useEffect(() => {
    if (voiceRecognitionActive) {
      startVoiceRecognition();
    }
  }, [voiceRecognitionActive]);

  useEffect(() => {
    loadTasks();
  }, []);

  const fetchAIResponse = async (userInput: string) => {
    try {
      const fullContext = [...memory, { role: "user", content: userInput }];
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: fullContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      setMemory([...fullContext, { role: "assistant", content: aiResponse }]);
      startVoiceResponse(aiResponse);
      return aiResponse;
    } catch (error) {
      console.error("Error fetching AI response:", error);
      throw error;
    }
  };

  const performWebSearch = async (query: string) => {
    try {
      const response = await fetch(
        `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${SERP_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Web search failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.organic_results
        ? data.organic_results.slice(0, 3).map((r: any) => r.snippet).join("\n")
        : "No relevant results found.";
    } catch (error) {
      console.error("Error performing web search:", error);
      throw error;
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" as const };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      let aiResponse = "";
      if (input.toLowerCase().includes("search for")) {
        const query = input.replace(/search for/i, "").trim();
        aiResponse = await performWebSearch(query);
      } else {
        aiResponse = await fetchAIResponse(input);
      }

      setMessages((prev) => [...prev, { text: aiResponse, sender: "ai" as const }]);
    } catch (error) {
      console.error("Error processing message:", error);
    }
  };

  // Modify the startVoiceResponse function
  const startVoiceResponse = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;

    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      if (transcript.includes("vexa") || transcript.includes("veksa") || transcript.includes("vexa ai")) {
        try {
          const aiResponse = await fetchAIResponse("Hey Vexa");
          startVoiceResponse(aiResponse);
        } catch (error) {
          console.error("Error processing voice command:", error);
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  const addTask = (task: string) => {
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  const loadTasks = () => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    setTasks(savedTasks);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4"
    >
      <Card className="max-w-4xl mx-auto bg-background/40 backdrop-blur-md border-primary/20">
        <div className="h-[70vh] overflow-y-auto">
          {/* Update the ChatMessage component usage in the return statement */}
          <ChatMessage messages={messages} isSpeaking={isSpeaking} />
        </div>

        <div className="p-4 border-t border-primary/20 bg-background/60 backdrop-blur-sm">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="bg-background/50 border-primary/20"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button onClick={sendMessage} className="bg-primary hover:bg-primary/90">
              Send
            </Button>
          </div>
        </div>

        <TaskList tasks={tasks} onAddTask={addTask} />
      </Card>

      <FloatingControls
        voices={voices}
        selectedVoice={selectedVoice}
        onVoiceChange={setSelectedVoice}
        speechRate={speechRate}
        onSpeechRateChange={setSpeechRate}
        voiceRecognitionActive={voiceRecognitionActive}
        onVoiceRecognitionToggle={() => setVoiceRecognitionActive(!voiceRecognitionActive)}
      />
    </motion.div>
  );
}