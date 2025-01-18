'use client';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import AuthContext from '@/contexts/AuthContext';
import { useChatsPaneContext } from '@/contexts/ChatsPaneContext';
import { useWebSocket } from '@/contexts/SocketContext';
import { Chat } from '@/helpers/props';
import { getTime, truncate } from '@/helpers/support';
import { motion } from 'framer-motion';
import { Archive, BellOff, ChevronRight, Download, Info, Mail, Pin, PinOff, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import Loader from '../Loader';
import { Toaster } from '@/components/ui/toaster';

const menuItemVariants = {
  hidden: { opacity: 0, x: -4 },
  visible: { opacity: 1, x: 0 },
  hover: { x: 2 },
};

const ChatsPane = () => {
  const { socketData } = useWebSocket();
  const { user, activeUsers } = useContext(AuthContext);
  const { chats, isLoading, searchQuery, setSearchQuery, searchChats, updateChatOrder, togglePinChat } = useChatsPaneContext();
  const pathname = usePathname();
  const router = useRouter();

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

  const handleArchiveChat = (chatId: number) => {
    // Implement archive chat functionality
    console.log('Archive chat:', chatId);
  };

  const handleMarkAsUnread = (chatId: number) => {
    // Implement mark as unread functionality
    console.log('Mark as unread:', chatId);
  };

  const handleMuteOptions = (chatId: number) => {
    // Implement mute options functionality
    console.log('Mute options:', chatId);
  };

  const handleExportChat = (chatId: number) => {
    // Implement export chat functionality
    console.log('Export chat:', chatId);
  };

  const handleClearChat = (chatId: number) => {
    // Implement clear chat functionality
    console.log('Clear chat:', chatId);
  };

  const handleDeleteChat = (chatId: number) => {
    // Implement delete chat functionality
    console.log('Delete chat:', chatId);
  };

  const handleContactInfo = (chatId: number) => {
    // Implement contact info functionality
    console.log('Contact info:', chatId);
  };

  const filteredChats = chats.filter((chat: Chat) => {
    const chatName = chat.is_group ? chat.name : chat.participants.find((p) => p.id !== user.id)?.name;
    return chatName!.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const MenuGroup = ({ children, label }: { children: React.ReactNode; label: string }) => (
    <div className='px-2 py-1.5'>
      <p className='text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1 px-2'>{label}</p>
      <div className='space-y-0.5'>{children}</div>
    </div>
  );

  const MenuItem = ({
    icon: Icon,
    label,
    onClick,
    variant = 'default',
  }: {
    icon: React.ElementType;
    label: string;
    onClick: () => void;
    variant?: 'default' | 'warning' | 'danger';
  }) => (
    <motion.div variants={menuItemVariants} whileHover='hover' transition={{ duration: 0.2 }}>
      <ContextMenuItem
        onSelect={onClick}
        className={`
          group flex items-center justify-between px-2 py-2 text-sm rounded-lg cursor-pointer
          ${variant === 'default' ? 'hover:bg-violet-50 dark:hover:bg-violet-900/20' : ''}
          ${variant === 'warning' ? 'text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' : ''}
          ${variant === 'danger' ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' : ''}
        `}
      >
        <div className='flex items-center gap-3'>
          <Icon className='w-4 h-4' />
          <span className='font-medium'>{label}</span>
        </div>
        <ChevronRight className='w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity' />
      </ContextMenuItem>
    </motion.div>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='flex flex-col max-md:h-[calc(100dvh-8rem)] h-[calc(100dvh-8rem)] w-full bg-white dark:bg-neutral-900 md:rounded-2xl shadow-sm'
      >
        {/* Search Header */}
        <div className='sticky top-0 z-10 p-4 border-b dark:border-neutral-800'>
          <form onSubmit={(e) => e.preventDefault()} className='relative'>
            <div className='relative'>
              <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5' />
              <input
                type='text'
                className='w-full pl-10 pr-10 py-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-none focus:ring-2 focus:ring-violet-500 dark:text-white'
                placeholder='Search conversations...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete='off'
              />
              {searchQuery && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  type='button'
                  onClick={() => setSearchQuery('')}
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
              {filteredChats.length > 0 ? (
                filteredChats.map((chat: Chat) => {
                  const isActive = pathname?.startsWith(`/chats/${chat.id}`);
                  return (
                    <ContextMenu key={chat.id}>
                      <ContextMenuTrigger>
                        <Link href={`/chats/${chat.id}`}>
                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            className={`px-3 py-2 rounded-xl transition-all ${
                              isActive ? 'bg-neutral-200 dark:bg-neutral-800' : 'hover:bg-neutral-100 my-1 dark:hover:bg-neutral-800'
                            }`}
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
                                  <div className='w-12 h-12 rounded-xl overflow-hidden'>
                                    {chat.group_icon ? (
                                      <img className='w-full h-full object-cover rounded-[10px] src={chat.group_icon}' alt='group' />
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
                                  <div className='flex items-center gap-2'>
                                    <h3 className='font-medium dark:text-white truncate'>
                                      {chat.is_group ? chat.name : chat.participants.find((p) => p.id !== user.id)?.name}
                                    </h3>
                                    {chat.is_pinned && <Pin className='w-3 h-3 text-violet-500' />}
                                  </div>
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
                      </ContextMenuTrigger>
                      <ContextMenuContent className='w-72 p-1.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border dark:border-neutral-800 rounded-xl shadow-lg'>
                        <motion.div
                          initial='hidden'
                          animate='visible'
                          variants={{
                            visible: {
                              transition: {
                                staggerChildren: 0.04,
                              },
                            },
                          }}
                        >
                          <MenuGroup label='Quick Actions'>
                            <MenuItem
                              icon={chat.is_pinned ? PinOff : Pin}
                              label={chat.is_pinned ? 'Unpin Conversation' : 'Pin Conversation'}
                              onClick={() => togglePinChat(chat.id)}
                            />
                            <MenuItem icon={Mail} label='Mark as Unread' onClick={() => handleMarkAsUnread(chat.id)} />
                            <MenuItem icon={Archive} label='Archive Chat' onClick={() => handleArchiveChat(chat.id)} />
                          </MenuGroup>
                          <ContextMenuSeparator className='my-1.5 dark:border-neutral-800' />
                          <MenuGroup label='Settings'>
                            <MenuItem icon={BellOff} label='Mute Notifications' onClick={() => handleMuteOptions(chat.id)} />
                            <MenuItem icon={Info} label='View Contact Info' onClick={() => router.push(`/chats/${chat.id}/info`)} />
                          </MenuGroup>
                          <ContextMenuSeparator className='my-1.5 dark:border-neutral-800' />
                          <MenuGroup label='Management'>
                            <MenuItem icon={Download} label='Export Chat History' onClick={() => handleExportChat(chat.id)} />
                            <MenuItem
                              icon={Trash2}
                              label='Delete Conversation'
                              onClick={() => handleDeleteChat(chat.id)}
                              variant='danger'
                            />
                          </MenuGroup>
                        </motion.div>
                      </ContextMenuContent>
                    </ContextMenu>
                  );
                })
              ) : (
                <div className='flex items-center justify-center h-full'>
                  <p className='text-neutral-500 dark:text-neutral-400 mt-5'>No conversations found</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
      <Toaster />
    </>
  );
};

export default ChatsPane;
