'use client';
import { ChatProvider } from '@/contexts/ChatContext';
import { useNavbar } from '@/contexts/NavContext';
import { use, useEffect } from 'react';

const CallPage = (props: { params: Promise<{ slug: number }> }) => {
  const params = use(props.params);
  const { setShowNav } = useNavbar();
  useEffect(() => {
    setShowNav(false);
  }, []);
  return (
    <ChatProvider chatId={params.slug}>
      <div className='flex items-center justify-center h-screen'>
        <p>Call Window</p>
      </div>
    </ChatProvider>
  );
};

export default CallPage;
