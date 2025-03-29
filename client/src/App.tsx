import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import VexaAI from "@/pages/VexaAI";
import VoiceDemo from "@/pages/VoiceDemo";
import WebSocketDemo from "@/pages/WebSocketDemo";
import IntroDemo from "@/pages/IntroDemo";

function Router() {
  return (
    <>
      <nav className="fixed top-0 right-0 m-4 z-50 flex gap-2 flex-wrap justify-end">
        <Link href="/" className="px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/60 transition-all">
          VexaAI
        </Link>
        <Link href="/voice-demo" className="px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/60 transition-all">
          Voice Demo
        </Link>
        <Link href="/websocket-demo" className="px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/60 transition-all flex items-center">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
          WebSocket
        </Link>
        <Link href="/intro-demo" className="px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/60 transition-all flex items-center">
          <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
          Intro Demo
        </Link>
      </nav>
      
      <Switch>
        <Route path="/" component={VexaAI} />
        <Route path="/voice-demo" component={VoiceDemo} />
        <Route path="/websocket-demo" component={WebSocketDemo} />
        <Route path="/intro-demo" component={IntroDemo} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
