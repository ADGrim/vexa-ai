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
import { learnFromUserMessage, adjustResponseTone, getLearningSummary } from '@/lib/vexaLearning';
import { isUnsafeRequest, safeResponse } from "@/lib/vexaSafety";
import { vexaVoice } from "@/lib/vexaVoice";

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
      vexaVoice.cleanup();
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

  // Add voice controls
  const handleVoiceTest = async () => {
    try {
      setIsSpeaking(true);
      await vexaVoice.speak("Hello! I'm Vexa, and I'm ready to help you understand quantum physics!", (dataArray) => {
        updateVisualizer(dataArray);
      });
    } catch (error) {
      console.error("Voice test error:", error);
      toast({
        variant: "destructive",
        title: "Voice Test Failed",
        description: "Could not test the voice. Please try again."
      });
    } finally {
      setIsSpeaking(false);
    }
  };

  const updateVisualizer = (dataArray: Uint8Array) => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Clear canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Draw visualizer
        const barWidth = (canvasRef.current.width / dataArray.length) * 2.5;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
          const barHeight = (dataArray[i] / 255) * canvasRef.current.height;
          const gradient = ctx.createLinearGradient(0, canvasRef.current.height, 0, canvasRef.current.height - barHeight);
          gradient.addColorStop(0, 'hsl(var(--primary) / 0.3)');
          gradient.addColorStop(1, 'hsl(var(--primary))');
          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvasRef.current.height - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        }
      }
    }
  };

  // Update the fetchAIResponse function to include custom interception
  const fetchAIResponse = async (userInput: string) => {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new Error("OpenAI API key is required");
    }

    try {
      // Check for unsafe content first
      if (isUnsafeRequest(userInput)) {
        return safeResponse();
      }

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
          model: "gpt-4o",  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
          messages: [
            { role: "system", content: vexaSystemPrompt },
            { role: "user", content: userInput }
          ],
          max_tokens: 400
        });

        let aiResponse = response.choices[0].message.content ||
          "Great question! In quantum physics, things can exist in multiple states at once until observed — we call this superposition. It's like flipping a coin and it being both heads and tails until you look. Want me to explain more?";

        return conversationalAdjustments(aiResponse);
      }

      // Check for creator questions
      if (detectCreatorQuestion(userInput)) {
        return `I was created by ${import.meta.env.VITE_CREATOR_NAME || 'User'}. 😊`;
      }

      // Check for identity questions
      if (detectVexaMention(userInput) || lowerInput.includes("who are you")) {
        return conversationalAdjustments(`I'm Vexa, created by ${import.meta.env.VITE_CREATOR_NAME || 'User'}, and I specialize in explaining complex topics like quantum physics in simple ways. Ask me anything!`);
      }

      // Regular response through OpenAI with quantum focus
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o",  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
        messages: [
          { role: "system", content: vexaSystemPrompt },
          { role: "user", content: userInput }
        ],
        max_tokens: 150
      });

      let aiResponse = sanitizeAIResponse(response.choices[0].message.content ||
        "I'm Vexa, and I'd love to help explain quantum concepts in a way that makes sense. What would you like to know?");

      return conversationalAdjustments(aiResponse);
    } catch (error: any) {
      console.error("OpenAI API Error:", error);
      throw error;
    }
  };

  // Update the handleSendMessage function to include learning and voice
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Learn from user's message
    learnFromUserMessage(input);

    // Special command to get learning summary
    if (input.toLowerCase() === '/vexa-learn-summary') {
      const summary = getLearningSummary();
      const summaryMessage = {
        text: `Here's what I've learned about your communication style:\n${JSON.stringify(summary, null, 2)}`,
        sender: "ai"
      };
      setMessages((prev) => [...prev, { text: input, sender: "user" }, summaryMessage]);
      setInput("");
      return;
    }

    const newMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      let aiResponse = await fetchAIResponse(input);

      // Apply tone adjustment based on learning
      aiResponse = adjustResponseTone(aiResponse);

      const aiMessage: Message = { text: aiResponse, sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);

      // Only speak if voice is enabled
      if (voiceRecognitionActive) {
        setIsSpeaking(true);
        try {
          await vexaVoice.speak(aiResponse, (dataArray) => {
            updateVisualizer(dataArray);
          });
        } catch (error) {
          console.error("Voice error:", error);
        } finally {
          setIsSpeaking(false);
        }
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
      return `I'm Vexa, created by ${import.meta.env.VITE_CREATOR_NAME || 'User'} — here to help!`;
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

  const conversationalAdjustments = (response: string): string => {
    // Add your conversational adjustment logic here.  This is a placeholder.
    return response;
  };


  const audioStateRef = useRef<AudioState>({
    context: null,
    analyser: null,
    audio: null,
    animationFrame: null
  });

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