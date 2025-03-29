import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.VITE_OPENAI_API_KEY });

// Types for WebSocket messages
type WebSocketMessage = {
  type: string;
  content: string;
  role?: 'user' | 'assistant';
};

// Keep track of active connections
const clients = new Set<WebSocket>();

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Create WebSocket server on a distinct path to avoid conflicts with Vite's HMR
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // WebSocket connection handler
  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection established');
    clients.add(ws);
    
    // Send welcome message
    const welcomeMessage: WebSocketMessage = {
      type: 'message',
      role: 'assistant',
      content: 'Connected to Vexa API. How can I help you today?'
    };
    ws.send(JSON.stringify(welcomeMessage));
    
    // Message handler
    ws.on('message', async (data: string) => {
      try {
        const message = JSON.parse(data) as WebSocketMessage;
        
        if (message.type === 'message') {
          console.log('Received message:', message.content);
          
          // Send typing indicator
          if (ws.readyState === WebSocket.OPEN) {
            const typingIndicator: WebSocketMessage = {
              type: 'typing',
              content: 'Vexa is thinking...',
              role: 'assistant'
            };
            ws.send(JSON.stringify(typingIndicator));
          }
          
          // Add a small delay to allow the typing indicator to display
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Process message and generate response
          const response = await processUserMessage(message.content);
          
          // Send response if the connection is still open
          if (ws.readyState === WebSocket.OPEN) {
            // First, send a stop typing indicator
            const stopTypingIndicator: WebSocketMessage = {
              type: 'typing_stop',
              content: '',
              role: 'assistant'
            };
            ws.send(JSON.stringify(stopTypingIndicator));
            
            // Then send the actual response
            const responseMessage: WebSocketMessage = {
              type: 'message',
              role: 'assistant',
              content: response
            };
            ws.send(JSON.stringify(responseMessage));
          }
        }
      } catch (error) {
        console.error('Error processing message:', error);
        
        if (ws.readyState === WebSocket.OPEN) {
          const errorMessage: WebSocketMessage = {
            type: 'error',
            content: 'Error processing your message'
          };
          ws.send(JSON.stringify(errorMessage));
        }
      }
    });
    
    // Connection closed handler
    ws.on('close', () => {
      console.log('WebSocket connection closed');
      clients.delete(ws);
    });
  });
  
  // REST API endpoint for chat
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      const response = await processUserMessage(message);
      res.json({ response });
    } catch (error) {
      console.error('Error in chat endpoint:', error);
      res.status(500).json({ error: 'Failed to process your message' });
    }
  });
  
  return httpServer;
}

// Process user message and generate a response
async function processUserMessage(message: string): Promise<string> {
  try {
    // Check if the creator name is available
    const creatorName = process.env.VITE_CREATOR_NAME || 'the developers';
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are Vexa, an advanced AI assistant built by ${creatorName}. 
          You're helpful, creative, friendly, and you speak conversationally.
          You provide concise, clear answers and can discuss a wide range of topics.
          Always be respectful, kind, and thoughtful in your responses.`
        },
        { role: "user", content: message }
      ],
      max_tokens: 500
    });
    
    return response.choices[0].message.content || "I'm not sure how to respond to that.";
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "I'm sorry, I encountered an error processing your request. Please try again later.";
  }
}
