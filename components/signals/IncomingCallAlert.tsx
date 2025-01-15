'use client';

import { AlertDialog, AlertDialogContent, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useServices } from '@/contexts/ServiceContext';
import { PhoneIcon, UserCircle, VideoIcon } from 'lucide-react';
import { FaPhoneSlash } from 'react-icons/fa';

interface IncomingCallAlertProps {
  isOpen: boolean;
  caller: {
    name: string;
    image?: string;
    chat_id: string;
    callType: 'video' | 'audio';
  };
}

export function IncomingCallAlert({ isOpen, caller }: IncomingCallAlertProps) {
  const { clearIncomingCall } = useServices();
  const acceptCall = () => {
    window.location.href = `/call/${caller.chat_id}?type=${caller.callType}`;
  };
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent
        className='max-w-[380px] rounded-2xl p-6 
        bg-neutral-50 dark:bg-neutral-900
        shadow-lg shadow-neutral-200/50 dark:shadow-neutral-950/50
        border border-neutral-200 dark:border-neutral-800'
      >
        <AlertDialogTitle hidden asChild>
          <p>
            Incoming {caller.callType} call from {caller.name}
          </p>
        </AlertDialogTitle>
        <div className='flex flex-col items-center space-y-6'>
          {/* Caller Info Section */}
          <div className='relative mt-2'>
            {caller.image ? (
              <img
                src={caller.image}
                alt={caller.name}
                className='w-48 h-48 rounded-full border-4 border-neutral-200 dark:border-neutral-800 
                  shadow-inner ring-2 ring-neutral-100 dark:ring-neutral-700 object-cover'
              />
            ) : (
              <UserCircle className='w-24 h-24 text-neutral-400 dark:text-neutral-600' />
            )}
            <div
              className='absolute -bottom-2 right-0 bg-neutral-900 dark:bg-neutral-100 p-2.5 rounded-full
              shadow-lg shadow-neutral-200/50 dark:shadow-neutral-950/50'
            >
              {caller.callType === 'video' ? (
                <VideoIcon size={22} className='text-neutral-100 dark:text-neutral-900' />
              ) : (
                <PhoneIcon size={22} className='text-neutral-100 dark:text-neutral-900' />
              )}
            </div>
          </div>

          {/* Call Info */}
          <div className='text-center space-y-1.5'>
            <h2 className='text-2xl font-medium text-neutral-900 dark:text-neutral-100'>{caller.name}</h2>
            <p className='text-sm text-neutral-500 dark:text-neutral-400 animate-pulse'>Incoming {caller.callType} call...</p>
          </div>

          {/* Actions */}
          <div className='flex items-center gap-6 pt-2'>
            <Button
              onClick={clearIncomingCall}
              variant='outline'
              className='rounded-full w-14 h-14 border-2 border-red-500/20 bg-red-50 dark:bg-red-950/20
                hover:bg-red-100 dark:hover:bg-red-950/30 hover:scale-105 transition-all duration-200'
            >
              <FaPhoneSlash size={20} className='text-red-600 dark:text-red-500' />
            </Button>
            <Button
              onClick={acceptCall}
              variant='default'
              className='rounded-full w-14 h-14 bg-emerald-600 hover:bg-emerald-700
                dark:bg-emerald-700 dark:hover:bg-emerald-800
                hover:scale-105 transition-all duration-200 shadow-lg shadow-emerald-600/25'
            >
              {caller.callType === 'video' ? <VideoIcon size={20} /> : <PhoneIcon size={20} />}
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
