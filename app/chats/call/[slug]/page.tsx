'use client';
import Base from '@/components/calls/Base';
import { CallProvider } from '@/contexts/CallContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { use } from 'react';

const CallPage = (props: { params: Promise<{ slug: number }> }) => {
  const params = use(props.params);
  return (
    <ChatProvider chatId={params.slug}>
      <CallProvider>
        <Base slug={params.slug} />
      </CallProvider>
    </ChatProvider>
  );
};

export default CallPage;
