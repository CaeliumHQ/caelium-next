'use client';
import NewChatDialog from '@/components/chats/NewChatDialog';
import Link from 'next/link';

const NewChat = () => {
  return (
    <div className='fixed inset-0 bg-white dark:bg-neutral-900 z-50'>
      <div className='h-full max-w-4xl mx-auto'>
        <div className='h-full'>
          <div className='flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-600'>
            <h3 className='text-xl font-semibold text-neutral-900 dark:text-white'>New Chat</h3>
            <Link
              href={'/chats'}
              className='end-2.5 text-neutral-600 dark:text-neutral-400 bg-transparent hover:bg-neutral-200 hover:text-neutral-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-neutral-600 dark:hover:text-white'
              data-modal-hide='new-chat-modal'
            >
              <i className='fa-solid fa-xmark'></i>
              <span className='sr-only'>Close modal</span>
            </Link>
          </div>
          <NewChatDialog />
        </div>
      </div>
    </div>
  );
};

export default NewChat;
