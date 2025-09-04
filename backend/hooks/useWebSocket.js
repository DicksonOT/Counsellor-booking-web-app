import { useState, useEffect } from 'react';

export const useWebSocket = (userId, backendUrl = 'ws://localhost:4000') => {
  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;

  const connect = () => {
    if (!userId) return;

    try {
      const websocket = new WebSocket(`${backendUrl}/sessions/${userId}`);
      
      websocket.onopen = () => {
        console.log('WebSocket connected');
        setWs(websocket);
        setConnected(true);
        setReconnectAttempts(0);
      };

      websocket.onclose = () => {
        console.log('WebSocket disconnected');
        setWs(null);
        setConnected(false);
        
        // Attempt to reconnect
        if (reconnectAttempts < maxReconnectAttempts) {
          setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, 1000 * Math.pow(2, reconnectAttempts)); // Exponential backoff
        }
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnected(false);
      };

      return websocket;
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnected(false);
    }
  };

  useEffect(() => {
    const websocket = connect();
    
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [userId]);

  const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
      return true;
    }
    return false;
  };

  const disconnect = () => {
    if (ws) {
      ws.close();
    }
  };

  return { 
    ws, 
    connected, 
    sendMessage, 
    disconnect,
    reconnectAttempts,
    isReconnecting: reconnectAttempts > 0 && reconnectAttempts < maxReconnectAttempts
  };
};