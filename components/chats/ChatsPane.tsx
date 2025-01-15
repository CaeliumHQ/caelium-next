'use client';
import AuthContext from '@/contexts/AuthContext';
import { useChatsPaneContext } from '@/contexts/ChatsPaneContext';
import { useWebSocket } from '@/contexts/SocketContext';
import { Chat } from '@/helpers/props';
import { getTime, truncate } from '@/helpers/support';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useContext, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import Loader from '../Loader';

const ChatsPane = () => {
  const { authTokens, user, activeUsers } = useContext(AuthContext);
  const { socketData } = useWebSocket();
  const { chats, isLoading, searchQuery, setSearchQuery, fetchChats, searchChats, updateChatOrder } = useChatsPaneContext();

  useEffect(() => {
    fetchChats();
  }, [authTokens?.access]);

  useEffect(() => {
    const data = socketData;
    if (data && data.category === 'new_message' && data.sender !== user.id) {
      updateChatOrder(data.chat, data.content);
    }
  }, [socketData]);

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && e.target.value !== '') {
      searchChats(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='flex flex-col max-md:h-[calc(100dvh-8rem)] h-[calc(100dvh-8rem)] w-full bg-white dark:bg-neutral-900 md:rounded-2xl shadow-sm'
    >
      {/* Search Header */}
      <div className='sticky top-0 z-10 p-4 border-b dark:border-neutral-800'>
        <form onSubmit={searchChats} className='relative'>
          <div className='relative'>
            <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5' />
            <input
              type='text'
              className='w-full pl-10 pr-10 py-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-none focus:ring-2 focus:ring-violet-500 dark:text-white'
              placeholder='Search conversations...'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value === '') fetchChats();
              }}
              onKeyDown={handleKeyDown}
              autoComplete='off'
            />
            {searchQuery && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                type='button'
                onClick={() => {
                  setSearchQuery('');
                  fetchChats();
                }}
                className='absolute right-3 top-1/2 -translate-y-1/2'
              >
                <FiX className='w-5 h-5 text-neutral-400 hover:text-neutral-600 dark:hover:text-white' />
              </motion.button>
            )}
          </div>
        </form>
      </div>

      {/* Chat List */}
      {isLoading ? (
        <div className='flex flex-grow items-center justify-center'>
          <Loader />
        </div>
      ) : (
        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className='flex-1 overflow-y-auto'>
          <div className='p-2 space-y-1'>
            {chats.map((chat: Chat) => (
              <Link key={chat.id} href={`/chats/${chat.id}`}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className='p-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all'
                >
                  <div className='flex items-center gap-4'>
                    <div className='relative'>
                      {!chat?.is_group ? (
                        <>
                          <div className='w-12 h-12 rounded-xl overflow-hidden'>
                            <img
                              className='w-full h-full object-cover rounded-[10px]'
                              src={chat.participants.find((p) => p.id !== user.id)?.avatar}
                              alt='avatar'
                            />
                          </div>
                          {activeUsers.includes(chat.participants.find((p) => p.id !== user.id)?.id || 0) && (
                            <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-neutral-900'></div>
                          )}
                        </>
                      ) : (
                        // <div className='w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-violet-500 to-purple-500 p-0.5'>
                        <div className='w-12 h-12 rounded-xl overflow-hidden'>
                          {chat.group_icon ? (
                            <img className='w-full h-full object-cover rounded-[10px]' src={chat.group_icon} alt='group' />
                          ) : (
                            <div className='w-full h-full rounded-[10px] bg-white dark:bg-neutral-800 flex items-center justify-center'>
                              <i className='fa-solid fa-people-group text-xl text-violet-500'></i>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between'>
                        <h3 className='font-medium dark:text-white truncate'>
                          {chat.is_group ? chat.name : chat.participants.find((p) => p.id !== user.id)?.name}
                        </h3>
                        {chat.updated_time && (
                          <span className='text-xs text-neutral-500 dark:text-neutral-400'>{getTime(chat.updated_time)}</span>
                        )}
                      </div>
                      <p className='text-sm text-neutral-500 dark:text-neutral-400 truncate'>
                        {chat.last_message?.sender?.id === user.id
                          ? 'You: '
                          : chat.last_message?.sender
                            ? `${chat.last_message.sender.name}: `
                            : ''}
                        {chat.last_message
                          ? chat.last_message.type === 'txt'
                            ? truncate({ chars: chat.last_message.content, length: 45 })
                            : 'sent an attachment'
                          : ''}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatsPane;
