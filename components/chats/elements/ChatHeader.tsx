import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AuthContext from '@/contexts/AuthContext';
import { useChatContext } from '@/contexts/ChatContext';
import { NavLink } from '@/helpers/props';
import Link from 'next/link';
import { useContext, useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaPhone, FaVideo } from 'react-icons/fa';

const ChatHeader = () => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  let { getParticipant, clearChat, meta, getLastSeen, startCall } = useChatContext();
  let { user } = useContext(AuthContext);

  const options: NavLink[] = [
    { name: 'Dashboard', url: '/dashboard' },
    { name: 'Settings', url: '/dash' },
  ];

  const handleClearChat = () => {
    clearChat();
    setIsAlertOpen(false);
  };

  const preventDefault = (e: TouchEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    const headerElement = headerRef.current;
    if (headerElement) {
      headerElement.addEventListener('touchmove', preventDefault, { passive: false });
      return () => {
        headerElement.removeEventListener('touchmove', preventDefault);
      };
    }
  }, []);

  return (
    <>
      <div ref={headerRef} className='flex sticky top-0 z-10 flex-row h-16 bg-neutral-300 dark:bg-neutral-900 dark:text-white'>
        <Link className='flex flex-col my-auto self-start p-3 h-min justify-center rounded-full' href='/chats'>
          <FaArrowLeft />
        </Link>
        <div className='flex items-center'>
          {!meta?.is_group ? (
            <img
              className='h-12 my-2 w-12 max-sm:h-12 max-sm:w-12 rounded-full dark:bg-white object-cover'
              src={getParticipant(meta?.participants.find((participant) => participant.id !== user.id)?.id ?? 0)?.avatar}
              alt='user photo'
              width={100}
              height={100}
            />
          ) : meta.group_icon ? (
            <img
              className='h-12 my-2 w-12 max-sm:h-12 max-sm:w-12 rounded-full dark:bg-white object-cover'
              src={meta.group_icon || ''}
              alt='user photo'
              width={100}
              height={100}
            />
          ) : (
            <div className='flex items-center justify-center h-12 my-2 w-12 max-sm:h-12 max-sm:w-12 rounded-full dark:bg-white object-cover dark:text-black'>
              <i className='fa-solid fa-people-group text-2xl'></i>
            </div>
          )}
          <Link href={'/chats/info/' + meta?.id}>
            <div className='flex flex-col ps-2'>
              <div className='flex items-center gap-2'>
                <p className='text-2xl'>
                  {meta?.is_group
                    ? meta.name
                    : getParticipant(meta?.participants.find((participant) => participant.id !== user.id)?.id ?? 0)?.name}
                </p>
              </div>
              {meta?.is_group ? (
                <p className='text-sm text-neutral-600 dark:text-neutral-400 truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[600px] xl:max-w-[800px]'>
                  {meta.participants
                    .slice(0, window.innerWidth > 1024 ? 6 : 2)
                    .map((p) => getParticipant(p.id)?.name)
                    .filter(Boolean)
                    .join(', ')}
                  {meta.participants.length > (window.innerWidth > 1024 ? 6 : 2) &&
                    ` + ${meta.participants.length - (window.innerWidth > 1024 ? 6 : 2)} others`}
                </p>
              ) : (
                <span className='text-sm'>
                  {getLastSeen(meta?.participants.find((participant) => participant.id !== user.id)?.id ?? 0)}
                </span>
              )}
            </div>
          </Link>
        </div>
        <div className='flex items-center flex-grow justify-end'>
          {!meta?.is_group && (
            <>
              <button className='p-3 me-4'>
                <FaVideo
                  onClick={() => {
                    startCall('video');
                  }}
                  className='text-xl'
                />
              </button>
              <button className='p-3 me-4'>
                <FaPhone
                  onClick={() => {
                    startCall('audio');
                  }}
                  className='text-xl rotate-90'
                />
              </button>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger className='outline-none'>
              <i className='fa-solid text-xl fa-ellipsis-vertical p-3 me-4'></i>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {options.map((option: NavLink, id) => (
                <DropdownMenuItem key={id} asChild>
                  <Link href={option.url}>{option.name}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onSelect={() => setIsAlertOpen(true)}>Clear Chat</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to clear this chat? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearChat} className='bg-red-500 hover:bg-red-600 dark:hover:bg-red-800 text-white'>
              Clear Chat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ChatHeader;
