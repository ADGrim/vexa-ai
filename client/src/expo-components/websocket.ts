/**
 * WebSocket integration for VexaChat
 * Provides simple utilities for real-time communication with AI servers
 */

// Configuration
const DEFAULT_WS_PATH = '/ws';
const DEFAULT_WS_RECONNECT_INTERVAL = 3000;
const DEFAULT_WS_RECONNECT_ATTEMPTS = 5;

// Message types
export interface WebSocketMessage {
  type: string;
  content: string;
  role?: 'user' | 'assistant';
  [key: string]: any;
}

interface WebSocketConfig {
  // Custom WebSocket server URL (optional, defaults to current host)
  serverUrl?: string;
  
  // Handler callbacks
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: any) => void;
  onMessage?: (data: WebSocketMessage) => void;
  
  // Reconnection settings
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  
  // Custom WebSocket path (defaults to '/ws')
  path?: string;
}

// Global WebSocket instance for singleton pattern
let wsInstance: WebSocket | null = null;

/**
 * Connect to the WebSocket server
 * @param config WebSocket configuration options
 * @returns The WebSocket instance or null if connection couldn't be established
 */
export const connectWebSocket = (config: WebSocketConfig = {}): WebSocket | null => {
  if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
    return wsInstance;
  }
  
  // Clean up any existing connection
  if (wsInstance) {
    try {
      wsInstance.close();
    } catch (err) {
      console.error('Error closing existing WebSocket connection:', err);
    }
  }
  
  try {
    const {
      serverUrl,
      onOpen,
      onClose,
      onError,
      onMessage,
      reconnectInterval = DEFAULT_WS_RECONNECT_INTERVAL,
      maxReconnectAttempts = DEFAULT_WS_RECONNECT_ATTEMPTS,
      path = DEFAULT_WS_PATH
    } = config;
    
    // Determine proper WebSocket URL
    let wsUrl: string;
    
    if (serverUrl) {
      // Use provided server URL
      wsUrl = serverUrl;
    } else {
      // Auto-detect protocol and use current host
      const isSecure = 
        typeof window !== 'undefined' && window.location && 
        window.location.protocol === 'https:';
      
      const protocol = isSecure ? 'wss:' : 'ws:';
      const host = typeof window !== 'undefined' && window.location ? 
        window.location.host : 'localhost:3000';
      
      wsUrl = `${protocol}//${host}${path}`;
    }
    
    // Create new WebSocket connection
    const ws = new WebSocket(wsUrl);
    
    // Connection event handlers
    ws.onopen = () => {
      console.log('WebSocket connection established');
      if (onOpen) onOpen();
    };
    
    ws.onclose = (event) => {
      console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
      if (onClose) onClose();
      
      // Auto-reconnect logic (for production use)
      let reconnectAttempts = 0;
      
      const attemptReconnect = () => {
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`);
          
          setTimeout(() => {
            connectWebSocket(config);
          }, reconnectInterval);
        } else {
          console.error('Maximum reconnection attempts reached');
        }
      };
      
      attemptReconnect();
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onMessage) onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    // Store instance for reuse
    wsInstance = ws;
    return ws;
    
  } catch (error) {
    console.error('Failed to create WebSocket connection:', error);
    return null;
  }
};

/**
 * Send a message through the WebSocket connection
 * @param message The message to send
 * @returns True if the message was sent successfully, false otherwise
 */
export const sendMessage = (message: WebSocketMessage): boolean => {
  if (!wsInstance || wsInstance.readyState !== WebSocket.OPEN) {
    console.error('WebSocket is not connected');
    return false;
  }
  
  try {
    wsInstance.send(JSON.stringify(message));
    return true;
  } catch (error) {
    console.error('Error sending WebSocket message:', error);
    return false;
  }
};

/**
 * Close the WebSocket connection
 */
export const closeWebSocket = (): void => {
  if (wsInstance) {
    try {
      wsInstance.close();
      wsInstance = null;
    } catch (error) {
      console.error('Error closing WebSocket connection:', error);
    }
  }
};

/**
 * Check if the WebSocket connection is currently open
 * @returns True if connected, false otherwise
 */
export const isWebSocketConnected = (): boolean => {
  return !!wsInstance && wsInstance.readyState === WebSocket.OPEN;
};

/**
 * Create a simple ping utility to keep the connection alive
 * @param interval Ping interval in milliseconds (default: 30000 - 30 seconds)
 * @returns An object with start and stop methods
 */
export const createPingService = (interval = 30000) => {
  let pingInterval: any = null;
  
  return {
    start: () => {
      if (pingInterval) return;
      
      pingInterval = setInterval(() => {
        if (isWebSocketConnected()) {
          sendMessage({ type: 'ping', content: 'ping' });
        }
      }, interval);
    },
    
    stop: () => {
      if (pingInterval) {
        clearInterval(pingInterval);
        pingInterval = null;
      }
    }
  };
};