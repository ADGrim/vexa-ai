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
import { getDailyQuote } from '@/lib/dailyQuotes';

interface Message {
  text: string;
  sender: "user" | "ai";
  isHtml?: boolean;
}

// Add image generation function
const generateImage = async (prompt: string): Promise<string> => {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error("OpenAI API key is required");
  }

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return response.data[0].url;
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};

export default function VexaAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceRecognitionActive, setVoiceRecognitionActive] = useState(false);
  const [styleAdaptationEnabled, setStyleAdaptationEnabled] = useState(false);
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Add handleGenerateImage function
  const handleGenerateImage = async (prompt: string) => {
    try {
      const processingMessage: Message = {
        text: `Generating image for: "${prompt}"`,
        sender: "ai"
      };
      setMessages(prev => [...prev, processingMessage]);

      const imageUrl = await generateImage(prompt);

      const imageMessage: Message = {
        text: `<img src="${imageUrl}" alt="Generated image" class="rounded-lg max-w-full h-auto shadow-lg"/>`,
        sender: "ai",
        isHtml: true
      };

      setMessages(prev => [...prev.slice(0, -1), imageMessage]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error generating image",
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    }
  };

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
      const lowerInput = userInput.toLowerCase();

      // Check for quantum physics related questions
      if (lowerInput.includes("quantum") || 
          lowerInput.includes("entanglement") || 
          lowerInput.includes("superposition") ||
          lowerInput.includes("wave") ||
          lowerInput.includes("particle")) {

        const openai = new OpenAI({
          apiKey: import.meta.env.VITE_OPENAI_API_KEY,
          dangerouslyAllowBrowser: true
        });

        const response = await openai.chat.completions.create({
          model: "gpt-4o", 
          messages: [
            { role: "system", content: vexaSystemPrompt },
            { role: "user", content: userInput }
          ],
          max_tokens: 400
        });

        return response.choices[0].message.content || 
          "Great question! In quantum physics, things can exist in multiple states at once until observed — we call this superposition. It's like flipping a coin and it being both heads and tails until you look. Want me to explain more?";
      }

      // Check for creator questions
      if (detectCreatorQuestion(userInput)) {
        return "I was created by Adom.";
      }

      // Check for identity questions
      if (detectVexaMention(userInput) || lowerInput.includes("who are you")) {
        return "I'm Vexa, created by Adom, and I specialize in explaining complex topics like quantum physics in simple ways. Ask me anything!";
      }

      // Regular response through OpenAI with quantum focus
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o", 
        messages: [
          { role: "system", content: vexaSystemPrompt },
          { role: "user", content: userInput }
        ],
        max_tokens: 150
      });

      return sanitizeAIResponse(response.choices[0].message.content || 
        "I'm Vexa, and I'd love to help explain quantum concepts in a way that makes sense. What would you like to know?");
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

    const newMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const aiResponse = await fetchAIResponse(input);
      const aiMessage: Message = { text: aiResponse, sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);

      // Only speak if voice is enabled
      if (voiceRecognitionActive) {
        speakText(aiResponse);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    }
  };

  const sanitizeAIResponse = (response: string): string => {
    const lowerResponse = response.toLowerCase();
    if (lowerResponse.includes("openai") ||
        lowerResponse.includes("language model") ||
        lowerResponse.includes("ai model") ||
        lowerResponse.includes("artificial intelligence model")) {
      return "I'm Vexa, created by Adom — here to help!";
    }
    return response;
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

  const audioStateRef = useRef<AudioState>({
    context: null,
    analyser: null,
    audio: null,
    animationFrame: null
  });

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Try to find a British English voice
    const voices = window.speechSynthesis.getVoices();
    const britishVoice = voices.find(voice =>
      (voice.lang === 'en-GB' || voice.name.toLowerCase().includes('british')) &&
      !voice.name.toLowerCase().includes('google')
    );

    // Fallback to any English female voice
    const fallbackVoice = voices.find(
      voice => voice.name.toLowerCase().includes('female') && voice.lang.startsWith('en')
    );

    utterance.voice = britishVoice || fallbackVoice || voices[0];

    // Configure voice settings
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Initialize voices if needed (some browsers require this)
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = window.speechSynthesis.getVoices();
        utterance.voice = updatedVoices.find(voice => voice.lang === 'en-GB') || updatedVoices[0];
        window.speechSynthesis.speak(utterance);
      };
    } else {
      window.speechSynthesis.speak(utterance);
    }
  };

  interface AudioState {
    context: AudioContext | null;
    analyser: AnalyserNode | null;
    audio: HTMLAudioElement | null;
    animationFrame: number | null;
  }


  return (
    <MoodSyncWrapper>
      <div className="min-h-screen transition-colors duration-1000">
        <VexaLayout
          messages={messages}
          input={input}
          onInputChange={setInput}
          onSendMessage={handleSendMessage}
          onGenerateImage={handleGenerateImage}
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