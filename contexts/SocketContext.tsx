import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AuthContext from './AuthContext';

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  send: (data: any) => void;
  socketData: any;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setActiveUsers, addActiveUser, removeActiveUser, updateLastSeen } = useContext(AuthContext);
  const socketRef = useRef<WebSocket | null>(null);
  const [socketData, setSocketData] = useState<any>();
  const [isConnected, setIsConnected] = useState(false);
  const retryCountRef = useRef(0);
  const mounted = useRef(false);

  useEffect(() => {
    if (!socketData) return;
    try {
      if (socketData.category === 'online_users') {
        setActiveUsers(socketData.online_users);
      } else if (socketData.category === 'status_update') {
        socketData.is_online ? addActiveUser(socketData.user_id) : removeActiveUser(socketData.user_id);
        updateLastSeen(socketData.user_id);
      }
    } catch (error) {
      console.error('Error processing socket data:', error);
    }
  }, [socketData]);

  useEffect(() => {
    mounted.current = true;
    const token = localStorage.getItem('authTokens');
    if (!token) return;

    let reconnectTimeout: NodeJS.Timeout;
    const reconnectInterval = 500;

    const connectWebSocket = () => {
      console.log('Connecting to WebSocket');

      if (socketRef.current) {
        socketRef.current.onclose = null; // Remove previous onclose to prevent duplicate connections
        socketRef.current.close();
      }

      const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_HOST}/ws/base/${JSON.parse(token).access}/`);

      ws.onopen = () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);
        retryCountRef.current = 0; // Reset retry counter on successful connection
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (mounted.current) {
            setSocketData(data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket closed, attempting to reconnect...');
        setIsConnected(false);

        retryCountRef.current += 1;
        if (retryCountRef.current > 2) {
          console.log('Maximum reconnection attempts reached. Reloading page...');
          window.location.reload();
          return;
        }

        reconnectTimeout = setTimeout(connectWebSocket, reconnectInterval);
      };

      ws.onerror = (err) => {
        console.log('WebSocket encountered error:', err);
      };

      socketRef.current = ws;
    };

    connectWebSocket();

    return () => {
      mounted.current = false;
      if (socketRef.current) {
        socketRef.current.onclose = null; // Prevent reconnect on component unmount
        socketRef.current.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, []);

  const send = (data: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    } else {
      console.log('WebSocket is not open. Ready state is:', socketRef.current?.readyState);
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket: socketRef.current, isConnected, send, socketData }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
