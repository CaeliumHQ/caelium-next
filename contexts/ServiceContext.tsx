import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useWebSocket } from './SocketContext';

interface ServiceContextType {
  incomingCall: any | null;
  clearIncomingCall: () => void;
}

const ServiceContext = createContext<ServiceContextType>({
  incomingCall: null,
  clearIncomingCall: () => {},
});

export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  const { socketData } = useWebSocket();
  const [incomingCall, setIncomingCall] = useState(null);

  const clearIncomingCall = () => setIncomingCall(null);

  useEffect(() => {
    if (socketData?.category === 'incoming_call') {
      setIncomingCall(socketData);
      const timeoutId = setTimeout(() => {
        clearIncomingCall();
      }, 20000);

      return () => clearTimeout(timeoutId);
    }
  }, [socketData]);

  return <ServiceContext.Provider value={{ incomingCall, clearIncomingCall }}>{children}</ServiceContext.Provider>;
};

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};
