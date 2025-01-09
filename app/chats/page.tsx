'use client';

import ChatsPane from '@/components/chats/ChatsPane';
import NewChatDialog from '@/components/chats/NewChatDialog';
import { Comforter } from 'next/font/google';
import Link from 'next/link';
import Wrapper from '../Wrapper';
import { handleeFont } from '../font';
import { RiChatNewLine } from 'react-icons/ri';

const comforter = Comforter({ weight: '400', subsets: ['cyrillic'] });

const Page = () => {
  return (
    <Wrapper>
      <div className='flex flex-grow max-sm:h-min divide-x divide-dashed divide-neutral-500 overflow-y-scroll'>
        <div className='flex flex-grow flex-none lg:w-1/4'>
          <ChatsPane />
        </div>
        <div className='hidden lg:block flex-none flex-grow sm:w-3/4'>
          <div className='flex flex-col min-h-[calc(100dvh-5rem)] flex-grow items-center justify-center'>
            <div
              className={`mb-20 text-center font-bold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400  ${comforter.className}`}
            >
              <p className='text-9xl m-3'>Caelium</p>
              <p className='text-6xl m-3'>Elevating your Chat Experience</p>
            </div>
            <button
              type='button'
              data-modal-target='new-chat-modal'
              data-modal-toggle='new-chat-modal'
              className={`${handleeFont.className} m-0 text-white bg-gradient-to-br from-sky-400 to-emerald-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2`}
            >
              Start New
            </button>
          </div>
        </div>
      </div>
      <div
        id='new-chat-modal'
        tabIndex={-1}
        aria-hidden={true}
        className='hidden fixed inset-0 z-50 bg-black/50 overflow-y-auto p-4'
      >
        <div className='relative min-h-full w-1/3 flex items-center justify-center'>
          <div className='relative bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full max-w-2xl lg:max-w-4xl'>
            <div className='flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-600'>
              <h3 className='text-xl font-semibold text-neutral-900 dark:text-white'>New Chat</h3>
              <button
                type='button'
                className='end-2.5 text-neutral-500 bg-transparent hover:bg-neutral-200 hover:text-neutral-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:text-neutral-400 dark:hover:bg-neutral-600 dark:hover:text-white'
                data-modal-hide='new-chat-modal'
              >
                <i className='fa-solid fa-xmark'></i>
                <span className='sr-only'>Close modal</span>
              </button>
            </div>
            <div>
              <NewChatDialog
                onClose={() => {
                  const modal = document.getElementById('new-chat-modal');
                  modal?.classList.add('hidden');
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='fixed end-6 bottom-20 group lg:hidden'>
        <Link
          href={'/chats/new-chat'}
          className='flex items-center justify-center text-white bg-neutral-500 rounded-lg w-14 h-14 hover:bg-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700 focus:ring-4 focus:ring-neutral-300 focus:outline-none dark:focus:ring-neutral-800'
        >
          <RiChatNewLine className='text-xl' />
        </Link>
      </div>
    </Wrapper>
  );
};

export default Page;
