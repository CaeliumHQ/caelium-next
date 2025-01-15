'use client';
import ChatContext from '@/contexts/ChatContext';
import { Message } from '@/helpers/props';
import { AnimatePresence, motion } from 'framer-motion';
import { useContext, useEffect, useRef, useState } from 'react';
import DocMessage from './ChatBubbles/DocMessage';
import ImageMessage from './ChatBubbles/ImageMessage';
import { Separator } from './ChatBubbles/Separator';
import TextMessage from './ChatBubbles/TextMessage';
import UploadingMessage from './ChatBubbles/UploadingMessage';
import VideoMessage from './ChatBubbles/VideoMessage';
import VoiceMessage from './ChatBubbles/VoiceMessage';
import Typing from './states/Typing';

const ChatMain = ({ viewportHeight }: { viewportHeight?: number }) => {
  const { messages, isUploading, typingMessage, loadMoreMessages, nextPage } = useContext(ChatContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState<number>(0); // To track the scroll offset
  const [loading, setLoading] = useState<boolean>(false); // Track if older messages are being loaded

  useEffect(() => {
    if (containerRef.current && !loading) {
      // Scroll to the bottom when new messages arrive or viewport height changes
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isUploading, typingMessage, loading, viewportHeight]);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight } = containerRef.current;
      const isAtTop = scrollTop === 0;

      if (isAtTop && !loading) {
        // Save the current scroll position (offset)
        setScrollOffset(scrollHeight);

        // Load older messages when scrolled to the top
        setLoading(true);
        loadMoreMessages();
        setLoading(false);
      }
    }
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
  };

  let prevDate: Date | null = null;

  const renderMessage = (message: Message) => {
    const messageVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, x: -10 }
    };

    const messageComponent = (
      <motion.div
        key={message.id}
        variants={messageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2 }}
      >
        {message.type === 'txt' && <TextMessage message={message} />}
        {message.type === 'img' && <ImageMessage message={message} />}
        {message.type === 'vid' && <VideoMessage message={message} />}
        {message.type === 'aud' && <VoiceMessage message={message} />}
        {message.type === 'doc' && <DocMessage message={message} />}
      </motion.div>
    );

    return messageComponent;
  };

  useEffect(() => {
    if (containerRef.current && scrollOffset && !loading) {
      const newScrollHeight = containerRef.current.scrollHeight;
      containerRef.current.scrollTop = newScrollHeight - scrollOffset;
    }
  }, [messages, scrollOffset, loading]);

  return (
    <div ref={containerRef} onScroll={handleScroll} className='flex flex-col overflow-auto h-full p-2'>
      <div className='flex-grow' />
      {nextPage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='text-center text-neutral-400 my-10'
        >
          Loading older messages...
        </motion.div>
      )}
      <div className='flex flex-col justify-end'>
        <AnimatePresence mode="popLayout">
          {messages.length === 0 && (
            <motion.div
              key="no-messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='text-center text-neutral-400'
            >
              No messages yet
            </motion.div>
          )}
          {messages.map((message, index) => {
            const currentDate = new Date(message.timestamp);
            const isNewDay = !prevDate || !isSameDay(prevDate, currentDate);
            prevDate = currentDate;
            
            if (isNewDay) {
              return (
                <motion.div key={`day-${currentDate.toISOString()}`}>
                  <Separator timestamp={currentDate} />
                  {renderMessage(message)}
                </motion.div>
              );
            }
            return renderMessage(message);
          })}
          {isUploading && <UploadingMessage key="uploading" />}
          {typingMessage && <Typing key="typing" />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatMain;
