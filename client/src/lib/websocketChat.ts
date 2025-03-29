/**
 * WebSocket chat client utility for Vexa AI
 * Can be used in both web and React Native applications
 */

export type MessageType = 'message' | 'error' | 'ping' | 'typing' | 'typing_stop';

export interface WebSocketMessage {
  type: MessageType;
  content: string;
  role?: 'user' | 'assistant';
}

export interface WebSocketEventHandlers {
  onOpen?: () => void;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: any) => void;
  onClose?: () => void;
}

export interface VexaWebSocketClient {
  connect: () => void;
  disconnect: () => void;
  sendMessage: (content: string) => void;
  isConnected: () => boolean;
}

/**
 * Create a WebSocket client for Vexa AI chat
 * @param endpoint WebSocket endpoint URL (optional, defaults to current host)
 * @param handlers Event handlers for WebSocket events
 * @returns WebSocket client functions and state
 */
export function createVexaWebSocketClient(
  endpoint?: string,
  handlers: WebSocketEventHandlers = {}
): VexaWebSocketClient {
  let socket: WebSocket | null = null;

  // Determine the WebSocket URL
  const getWebSocketUrl = (): string => {
    if (endpoint) return endpoint;
    
    // Browser environment
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${window.location.host}/ws`;
    }
    
    // Default for React Native or other environments
    return 'ws://localhost:3000/ws';
  };

  // Initialize the WebSocket connection
  const connect = (): void => {
    if (socket) return;
    
    try {
      socket = new WebSocket(getWebSocketUrl());
      
      // Connection opened handler
      socket.onopen = () => {
        console.log('WebSocket connection established');
        if (handlers.onOpen) handlers.onOpen();
      };
      
      // Message event handler
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage;
          if (handlers.onMessage) handlers.onMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
          if (handlers.onError) handlers.onError(error);
        }
      };
      
      // Connection error handler
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (handlers.onError) handlers.onError(error);
      };
      
      // Connection closed handler
      socket.onclose = () => {
        console.log('WebSocket connection closed');
        socket = null;
        if (handlers.onClose) handlers.onClose();
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      if (handlers.onError) handlers.onError(error);
    }
  };

  // Close the WebSocket connection
  const disconnect = (): void => {
    if (socket) {
      socket.close();
      socket = null;
    }
  };

  // Send a message through the WebSocket
  const sendMessage = (content: string): void => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }
    
    const message: WebSocketMessage = {
      type: 'message',
      content,
      role: 'user'
    };
    
    socket.send(JSON.stringify(message));
  };

  // Check if the WebSocket is connected
  const isConnected = (): boolean => {
    return !!socket && socket.readyState === WebSocket.OPEN;
  };

  return {
    connect,
    disconnect,
    sendMessage,
    isConnected
  };
}