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
import ChatContext from '@/contexts/ChatContext';
import { NavLink } from '@/helpers/props';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';

const ChatHeader = () => {
  let { user } = useContext(AuthContext);
  const router = useRouter();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  let { getParticipant, clearChat, meta, getLastSeen, is_anon, anonAvatar, anonName } = useContext(ChatContext);

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
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        ref={headerRef}
        className='flex sticky top-0 z-10 flex-row h-16 bg-linear-to-r md:rounded-t-2xl from-neutral-300/90 to-neutral-200/90 backdrop-blur-xs dark:from-neutral-900/90 dark:to-neutral-800/90 dark:text-white'
      >
        <motion.div className='flex justify-center' whileHover={{ scale: 1.05 }}>
          <div
            onClick={() => {
              router.back();
            }}
            className='flex flex-col my-auto self-start p-3 h-min justify-center rounded-full'
          >
            <i className='fa-solid fa-arrow-left ms-2'></i>
          </div>
        </motion.div>
        <Link href={`/chats/${meta?.id}/info`} className='flex grow items-center cursor-default'>
          {!meta?.is_group ? (
            <img
              className='h-12 my-2 w-12 max-sm:h-12 max-sm:w-12 rounded-full dark:bg-white object-cover'
              src={
                is_anon
                  ? anonAvatar
                  : getParticipant(meta?.participants.find((participant) => participant.id !== user.id)?.id ?? 0)?.avatar
              }
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
          <div className='flex flex-col ps-2'>
            <div className='flex items-center gap-2'>
              <p className='text-xl'>
                {meta?.is_group
                  ? meta.name
                  : is_anon
                    ? anonName
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
                {is_anon ? 'Anonymous' : getLastSeen(meta?.participants.find((participant) => participant.id !== user.id)?.id ?? 0)}
              </span>
            )}
          </div>
        </Link>
        <div className='flex items-center justify-end gap-2'>
          {is_anon ? (
            <>
              <button
                onClick={() => router.push('/chats')}
                className='text-sm px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                title='Skip this chat'
              >
                Skip
              </button>
              <button
                onClick={() => setIsAlertOpen(true)}
                className='text-sm px-3 py-1 rounded-full bg-red-500 hover:bg-red-600 text-white me-2'
                title='Report user'
              >
                Report
              </button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className='outline-hidden'>
                <i className='fa-solid fa-ellipsis-vertical p-3 me-4'></i>
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
          )}
        </div>
      </motion.div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{is_anon ? 'Report User' : 'Are you sure?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {is_anon
                ? 'Are you sure you want to report this user? This action cannot be undone.'
                : 'Are you sure you want to clear this chat? This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={
                is_anon
                  ? () => {
                      /* Handle report action */
                    }
                  : handleClearChat
              }
              className={is_anon ? 'bg-red-500 hover:bg-red-600' : 'bg-destructive hover:bg-destructive/90'}
            >
              {is_anon ? 'Report' : 'Clear Chat'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ChatHeader;
