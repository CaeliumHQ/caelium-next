// context/NotificationContext.js
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useWebSocket } from './SocketContext';

interface NotificationContextType {
  incomingCall: any | null;
  clearIncomingCall: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  incomingCall: null,
  clearIncomingCall: () => {},
});

export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  const { socketData } = useWebSocket();
  const [incomingCall, setIncomingCall] = useState(null);

  const clearIncomingCall = () => setIncomingCall(null);

  useEffect(() => {
    if (socketData.type === 'incoming_call') {
      setIncomingCall(socketData.data);

      const timeoutId = setTimeout(() => {
        clearIncomingCall();
      }, 20000);

      return () => clearTimeout(timeoutId);
    }
  }, [socketData]);

  return <NotificationContext.Provider value={{ incomingCall, clearIncomingCall }}>{children}</NotificationContext.Provider>;
};

export const useServices = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};
