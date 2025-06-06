'use client';
import { Button } from '@/components/ui/button';
import { BaseError, Chat, Message, User } from '@/helpers/props';
import { formatTimeSince } from '@/helpers/utils';
import useAxios from '@/hooks/useAxios';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useAppContext } from './AppContext';
import AuthContext from './AuthContext';
import { useChatsPaneContext } from './ChatsPaneContext';
import { useWebSocket } from './SocketContext';

interface childrenProps {
  chatId: number;
  is_anon?: boolean;
  children: ReactNode;
}

interface ChatContextProps {
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>;
  textInput: string;
  setTextInput: (e: string) => void;
  messages: Message[];
  clearChat: () => void;
  sendFile: (file: File) => void;
  typingMessage: { sender: number; typed: string } | null;
  handleTyping: (text: string) => void;
  isLoading: boolean;
  isUploading: boolean;
  isLoadingMore: boolean;
  loadMoreMessages: () => void;
  nextPage: string | null;
  meta: Chat | null;
  getParticipant: (id: number) => User | null;
  getLastSeen: (participantId: number) => ReactNode;
}

const ChatContext = createContext<ChatContextProps>({
  handleSubmit: async () => {},
  textInput: '',
  setTextInput: async () => {},
  messages: [],
  clearChat: async () => {},
  sendFile: async () => {},
  typingMessage: null,
  handleTyping: async () => {},
  isLoading: true,
  isUploading: false,
  isLoadingMore: false,
  loadMoreMessages: async () => {},
  nextPage: null,
  meta: null,
  getParticipant: () => null,
  getLastSeen: () => null,
});
export default ChatContext;

export const ChatProvider = ({ chatId, children }: childrenProps) => {
  const { user } = useContext(AuthContext);
  const {activeUsers, lastSeenUsers} = useAppContext()
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<BaseError | null>(null);
  const [meta, setMeta] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [typingMessage, setTypingMessage] = useState<{ typed: string; sender: number } | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);

  const api = useAxios();
  const router = useRouter();
  const { socket, socketData } = useWebSocket();
  const { updateChatOrder, removeChatFromPane } = useChatsPaneContext();

  useEffect(() => {
    const data = socketData;
    if (!data || !user) return;
    if (data.category === 'new_message' && data.chat == chatId && data.sender != user.id) {
      // Map socketData to Message type
      const newMessage: Message = {
        id: data.id ?? Date.now(),
        content: data.content,
        type: data.type ?? 'txt',
        sender: data.sender,
        file_name: data.file_name ?? '',
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
        file: null,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } else if (data.category === 'typing' && data.chat_id == chatId) {
      setTypingMessage({ sender: data.sender, typed: data.typed });
    }
  }, [socketData, chatId, user]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [messagesResponse, metaResponse] = await Promise.all([
          api.get(`/api/chats/messages/${chatId}/`),
          api.get(`/api/chats/${chatId}/`),
        ]);

        setMeta(metaResponse.data);
        setMessages(messagesResponse.data.results.reverse());
        setNextPage(messagesResponse.data.next);
      } catch (error) {
        if (error instanceof AxiosError) {
          setError({
            text:
              error.response?.status === 404 ? "This chat doesn't exist or you don't have access to it" : 'Failed to fetch messages',
            code: 'FETCH_FAILED',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [chatId, user]);

  const loadMoreMessages = async () => {
    if (!nextPage || isLoadingMore) return; // Prevent fetching if already at the last page or currently loading
    setIsLoadingMore(true);
    try {
      const nextPageUrl = nextPage.includes('caelium.co') ? nextPage.replace('http://', 'https://') : nextPage;
      const response = await api.get(nextPageUrl);
      const olderMessages = response.data.results.reverse();
      setMessages((prevMessages) => [...olderMessages, ...prevMessages]); // Prepend older messages
      setNextPage(response.data.next); // Update next page URL
    } catch (error) {
      console.error('Error fetching older messages:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const sendMessage = async (type: 'txt' | 'attachment', content?: string, file?: File) => {
    if (type === 'txt' && user) {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.warn('Socket not ready, queueing message');
        return;
      }

      try {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(
            JSON.stringify({
              category: 'text_message',
              message: content,
              type,
              chat_id: chatId,
            }),
          );

          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: Date.now(),
              content: content || '',
              type,
              sender: user.id,
              file_name: '',
              timestamp: new Date(),
              file: null, 
            },
          ]);
          updateChatOrder(chatId, content || '');
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    } else {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('type', type);
      formData.append('content', content || '');
      formData.append('file', file || '');
      const response = await api.post(`api/chats/messages/${chatId}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.status == 201) {
        socket?.send(JSON.stringify({ category: 'file_message', chat_id: chatId, message_id: response.data.id }));
        setMessages((prevMessages) => [...prevMessages, { ...response.data, sender: user?.id }]);
        updateChatOrder(chatId, 'Sent an attachment');
      }
      setIsUploading(false);
    }
  };

  const getParticipant = (id: number) => {
    return meta?.participants?.find((participant) => participant.id == id) || null;
  };

  const getLastSeen = (participantId: number) => {
    const lastSeenUser = lastSeenUsers.find((user) => user.userId === participantId);
    if (activeUsers.includes(participantId)) {
      return <span className='text-green-500'>online</span>;
    } else if (lastSeenUser) {
      return <span className='text-gray-500'>last seen {formatTimeSince(lastSeenUser.timestamp)}</span>;
    } else {
      return (
        <span className='text-gray-500'>
          last seen {formatTimeSince(meta?.participants.find((participant) => participant.id === participantId)?.last_seen)}
        </span>
      );
    }
  };

  const handleTyping = async (text: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
      try {
        socket.send(JSON.stringify({ category: 'typing', chat_id: chatId, typed: text }));
      } catch (error) {
        console.error('Failed to send typing status:', error);
      }
    }
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (textInput.trim() !== '') {
      await sendMessage('txt', textInput);
    }
    setTextInput('');
  };

  const sendFile = (file: File) => sendMessage('attachment', '', file);

  const clearChat = async () => {
    try {
      await api.delete(`/api/chats/${chatId}/`);
      removeChatFromPane(chatId);
      router.push('/chats/main');
    } catch (error) {
      if (error instanceof AxiosError) {
        setError({
          text: error.response?.data?.detail || 'Failed to delete chat',
          code: 'DELETE_FAILED',
        });
      } else {
        setError({
          text: 'An unexpected error occurred while deleting the chat',
          code: 'DELETE_FAILED',
        });
      }
    }
  };


  if (error) {
    return (
      <div className='flex flex-col flex-grow max-sm:h-screen sm:w-3/4'>
        <div className='flex flex-col gap-4 flex-grow items-center justify-center'>
          <p className='text-2xl text-balance text-center my-8'>{error.text}</p>
          <Button className='px-6 py-5' variant='outline' onClick={() => router.push('/chats/main')}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ChatContext.Provider
      value={{
        handleSubmit,
        textInput,
        setTextInput,
        messages,
        clearChat,
        sendFile,
        handleTyping,
        isLoading,
        isUploading,
        isLoadingMore,
        typingMessage,
        loadMoreMessages,
        nextPage,
        meta,
        getParticipant,
        getLastSeen,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    console.error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
