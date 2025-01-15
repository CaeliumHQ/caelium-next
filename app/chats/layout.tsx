'use client';
import ChatsPane from '@/components/chats/ChatsPane';
import { ChatsPaneProvider } from '@/contexts/ChatsPaneContext';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ChatsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showMobilePane = pathname === '/chats';
  useEffect(() => {
    console.log(pathname);
  }, []);
  return (
    <ChatsPaneProvider>
      <main className='flex flex-grow md:p-6 md:gap-6 md:h-[calc(100vh-5rem)]'>
        <div className={`${showMobilePane ? 'block' : 'hidden'} lg:block w-full lg:w-1/4 border-neutral-800`}>
          <ChatsPane />
        </div>
        {children}
      </main>
    </ChatsPaneProvider>
  );
}
