'use client';
import NewChatDialog from '@/components/chats/NewChatDialog';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiPlus } from 'react-icons/fi';
import { handleeFont } from '../font';

const Page = () => {
  return (
    <>
      {/* Welcome Screen */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='hidden lg:flex flex-col flex-1 items-center justify-center rounded-2xl bg-white dark:bg-neutral-800 shadow-sm'
      >
        <div className='text-center items-center justify-center flex flex-col space-y-6'>
          <div className='h-24 w-24 rounded-full bg-gradient-to-br from-violet-500/10 to-purple-500/10 flex items-center justify-center mx-auto'>
            <FiMessageSquare className='w-12 h-12 text-violet-500' />
          </div>
          <div>
            <h1 className='text-6xl bg-gradient-to-br from-violet-500 to-purple-500 bg-clip-text text-transparent'>
              Caelium Chat
            </h1>
            <p className='text-3xl text-neutral-500 dark:text-neutral-400 mt-2'>
              Start connecting with others
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            type='button'
            data-modal-target='new-chat-modal'
            data-modal-toggle='new-chat-modal'
            className={`${handleeFont.className} px-6 py-3 bg-gradient-to-br from-violet-500 to-purple-500 text-white rounded-xl flex items-center gap-2`}
          >
            <FiPlus className='w-5 h-5' />
            New Conversation
          </motion.button>
        </div>
      </motion.div>

      {/* New Chat Modal */}
      <div id='new-chat-modal' tabIndex={-1} className='hidden fixed inset-0 z-50 bg-black/50'>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className='relative min-h-full w-full flex items-center justify-center p-4'
        >
          <div className='relative w-3/4 max-w-2xl bg-white dark:bg-neutral-800 rounded-2xl shadow-lg overflow-hidden'>
            <div className='flex items-center justify-between p-6 border-b dark:border-neutral-700'>
              <h3 className='text-xl font-semibold dark:text-white'>New Conversation</h3>
              <button
                type='button'
                className='text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white rounded-lg p-2'
                data-modal-hide='new-chat-modal'
              >
                <FiPlus className='w-6 h-6 rotate-45' />
              </button>
            </div>
            <NewChatDialog
              onClose={() => {
                document.getElementById('new-chat-modal')?.classList.add('hidden');
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Mobile New Chat Button */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className='fixed right-6 bottom-20 lg:hidden'
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          data-modal-target='new-chat-modal'
          data-modal-toggle='new-chat-modal'
          className='w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg'
        >
          <FiPlus className='w-6 h-6' />
        </motion.button>
      </motion.div>
    </>
  );
};

export default Page;
