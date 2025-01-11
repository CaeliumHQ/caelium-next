'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { ChatsPaneProvider } from '@/contexts/ChatsPaneContext';
import { NavbarProvider } from '@/contexts/NavContext';
import { ServiceProvider } from '@/contexts/ServiceContext';
import { WebSocketProvider } from '@/contexts/SocketContext';
import { ReactNode } from 'react';

const ProvidersWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <ChatsPaneProvider>
        <WebSocketProvider>
          <ServiceProvider>
            <NavbarProvider>{children}</NavbarProvider>
          </ServiceProvider>
        </WebSocketProvider>
      </ChatsPaneProvider>
    </AuthProvider>
  );
};

export default ProvidersWrapper;
