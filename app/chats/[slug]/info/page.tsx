'use client';
import ChatProfile from '@/components/chats/elements/ChatProfile';
import { ChatProvider } from '@/contexts/ChatContext';
import { use } from 'react';

const Page = (props: { params: Promise<{ slug: number }> }) => {
  const params = use(props.params);

  return (
    <ChatProvider chatId={params.slug}>
      <ChatProfile />
    </ChatProvider>
  );
};

export default Page;
