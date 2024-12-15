'use client';

import ChatsPane from '@/components/chats/ChatsPane';
import useChatUtils from '@/helpers/chats';
import { User } from '@/helpers/props';
import { Comforter } from 'next/font/google';
import Link from 'next/link';
import { useEffect } from 'react';
import Wrapper from '../Wrapper';
import { handleeFont } from '../font';

const comforter = Comforter({ weight: '400', subsets: ['cyrillic'] });

const Page = () => {
  const { createChat, fetchNewChats, newChats } = useChatUtils();
  useEffect(() => {
    fetchNewChats();
  }, []);

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
        className='hidden flex-grow bg-black bg-opacity-50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0'
      >
        <div className='relative sm:p-4 w-full max-w-xl'>
          <div className='relative bg-white rounded-lg shadow dark:bg-neutral-900'>
            <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-neutral-600'>
              <h3 className='text-xl font-semibold text-neutral-900 dark:text-white'>New Chat</h3>
              <button
                type='button'
                className='end-2.5 text-neutral-400 bg-transparent hover:bg-neutral-200 hover:text-neutral-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-neutral-600 dark:hover:text-white'
                data-modal-hide='new-chat-modal'
              >
                <i className='fa-solid fa-xmark'></i>
                <span className='sr-only'>Close modal</span>
              </button>
            </div>
            <div className='p-4 md:p-5'>
              <form className='space-y-4' action='#'>
                <div>
                  <input
                    type='text'
                    name='name'
                    id='name'
                    className='bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-800 dark:border-neutral-500 dark:placeholder-neutral-400 dark:text-white'
                    placeholder='search'
                    required
                  />
                </div>
                <ul className='sm:max-h-[calc(100dvh-25rem)] overflow-y-scroll'>
                  {newChats.map((recipient: User) => (
                    <li
                      onClick={() => createChat(recipient.id)}
                      key={recipient.id}
                      className='px-3 py-3 m-1 rounded-md hover:bg-neutral-800'
                    >
                      <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                        <div className='flex-shrink-0'>
                          <img
                            className='w-12 h-12 rounded-full dark:bg-white object-cover'
                            src={recipient.avatar}
                            alt={recipient.name}
                          />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-semibold text-neutral-900 truncate dark:text-white'>{recipient.name}</p>
                          <p className='text-sm text-neutral-500 truncate dark:text-neutral-400'>{recipient.email}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className='fixed end-6 bottom-20 group lg:hidden'>
        <Link
          href={'/chats/new-chat'}
          className='flex items-center justify-center text-white bg-neutral-500 rounded-lg w-14 h-14 hover:bg-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700 focus:ring-4 focus:ring-neutral-300 focus:outline-none dark:focus:ring-neutral-800'
        >
          <span className='material-symbols-outlined'>add_circle</span>
        </Link>
      </div>
    </Wrapper>
  );
};

export default Page;
