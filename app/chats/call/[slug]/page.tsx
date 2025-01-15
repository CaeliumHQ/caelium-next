'use client';
import { ChatProvider } from '@/contexts/ChatContext';
import { use } from 'react';

const CallPage = (props: { params: Promise<{ slug: number }> }) => {
  const params = use(props.params);
  return (
    <ChatProvider chatId={params.slug}>
      <div className='flex items-center justify-center h-screen'>
        <p>Call Window</p>
      </div>
    </ChatProvider>
  );
};

export default CallPage;
