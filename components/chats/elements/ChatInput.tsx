import ChatContext from '@/contexts/ChatContext';
import { motion } from 'framer-motion';
import { useContext, useEffect, useRef } from 'react';

const ChatInput = () => {
  let { textInput, setTextInput, handleSubmit, sendFile, handleTyping } = useContext(ChatContext);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    file ? sendFile(file) : null;
  };

  const preventDefault = (e: TouchEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    const formElement = formRef.current;
    if (formElement) {
      formElement.addEventListener('touchmove', preventDefault, { passive: false });
      return () => {
        formElement.removeEventListener('touchmove', preventDefault);
      };
    }
  }, []);

  useEffect(() => {
    handleTyping(textInput);
  }, [textInput]);

  return (
    <motion.form
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      ref={formRef}
      onSubmit={handleSubmit}
    >
      <label htmlFor='chat' className='sr-only'>
        Your message
      </label>
      <div className='flex bottom-0 md:rounded-b-2xl items-center px-3 py-2 border-t border-dashed bg-gradient-to-r from-neutral-200/90 to-neutral-100/90 backdrop-blur-sm border-neutral-500 dark:from-neutral-900/90 dark:to-neutral-800/90'>
        <div>
          <input type='file' ref={fileInputRef} className='hidden' onChange={handleFileChange} />
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          type='button'
          onClick={handleButtonClick}
          className='inline-flex justify-center p-2 text-neutral-600 rounded-lg cursor-pointer hover:text-violet-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-violet-400 dark:hover:bg-neutral-600'
        >
          <i className='fa-solid fa-paperclip text-xl p-1'></i>
          <span className='sr-only'>Upload image</span>
        </motion.button>
        <input
          ref={inputRef}
          type='text'
          id='chat'
          value={textInput}
          onChange={(e) => {
            setTextInput(e.target.value);
          }}
          autoComplete='off'
          autoFocus
          className='block mx-4 p-2.5 w-full text-sm text-neutral-900 bg-white rounded-lg border border-neutral-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-900 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          placeholder='Your message...'
          onKeyDown={handleKeyPress}
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          type='submit'
          className='inline-flex justify-center text-neutral-600 p-2 rounded-lg cursor-pointer hover:text-violet-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-violet-400 dark:hover:bg-neutral-600'
        >
          <i className='fa-solid fa-paper-plane text-xl p-1'></i>
          <span className='sr-only'>Send message</span>
        </motion.button>
      </div>
    </motion.form>
  );
};

export default ChatInput;
