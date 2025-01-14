import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AuthContext from '@/contexts/AuthContext';
import { useChatContext } from '@/contexts/ChatContext';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { FaPhone, FaVideo } from 'react-icons/fa';
import { FaPeopleGroup } from 'react-icons/fa6';
import { IoArrowBack, IoNotifications, IoPerson, IoPersonRemoveSharp } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import ChatMediaTabs from './ChatMediaTabs';

const ChatProfile = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { meta, getParticipant, getLastSeen } = useChatContext();
  const [showParticipants, setShowParticipants] = useState(false);
  const recipient = getParticipant(meta?.participants.find((p) => p.id !== user.id)?.id ?? 0);
  return (
    <div className='flex flex-col flex-grow sm:w-3/4 bg-white dark:bg-neutral-900'>
      <div className='flex-1 overflow-y-auto'>
        {/* Profile Header */}
        <div className='border-b border-neutral-200 dark:border-neutral-800'>
          <div className='flex flex-col items-center p-8 relative'>
            <button
              onClick={() => router.push(`/chats/${meta?.id}`)}
              className='absolute left-2 top-2 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full'
            >
              <IoArrowBack className='text-2xl text-neutral-800 dark:text-white' />
            </button>
            <div className='relative'>
              {!meta?.is_group ? (
                <img src={recipient?.avatar} alt='Profile' className='w-40 h-40 rounded-full object-cover bg-white' />
              ) : meta?.group_icon ? (
                <img src={meta?.group_icon} alt='Group Icon' className='w-40 h-40 rounded-full object-cover bg-white' />
              ) : (
                <div className='flex items-center justify-center w-40 h-40 dark:text-black rounded-full bg-white border dark:border-neutral-500 border-neutral-200 object-cover'>
                  <i className='fa-solid fa-people-group text-7xl'></i>
                </div>
              )}
            </div>
            <h1 className='text-2xl font-semibold mt-4 text-neutral-900 dark:text-white'>
              {meta?.is_group ? meta.name : recipient?.name}
            </h1>
            <div className='text-neutral-600 dark:text-neutral-400'>
              {!meta?.is_group
                ? getLastSeen(meta?.participants.find((participant) => participant.id !== user.id)?.id ?? 0)
                : `Group • ${meta.participants.length} Participants`}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className='flex justify-around p-4 border-b border-neutral-200 dark:border-neutral-800'>
          <button className='flex flex-col items-center text-neutral-700 dark:text-white'>
            <div className='p-3 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-1'>
              <FaVideo className='text-xl text-blue-500' />
            </div>
            <span className='text-sm'>Video</span>
          </button>
          <button onClick={() => setShowParticipants(true)} className='flex flex-col items-center text-neutral-700 dark:text-white'>
            <div className='p-3 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-1'>
              {meta?.is_group ? <FaPeopleGroup className='text-xl text-blue-500' /> : <IoPerson className='text-xl text-blue-500' />}
            </div>
            <span className='text-sm'>Participants</span>
          </button>
          <button className='flex flex-col items-center text-neutral-700 dark:text-white'>
            <div className='p-3 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-1'>
              <FaPhone className='text-xl text-blue-500' />
            </div>
            <span className='text-sm'>Call</span>
          </button>
        </div>

        {/* Settings */}
        <div className='flex flex-col p-4 space-y-4'>
          <button className='flex items-center p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-700 dark:text-white'>
            <IoNotifications className='text-xl mr-4 text-blue-500' />
            <span>Mute notifications</span>
          </button>
          <button className='flex items-center p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-700 dark:text-white'>
            <IoPersonRemoveSharp className='text-xl mr-4 text-red-500' />
            <span>Block contact</span>
          </button>
          <button className='flex items-center p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-700 dark:text-white'>
            <MdDelete className='text-xl mr-4 text-red-500' />
            <span>Delete chat</span>
          </button>
        </div>

        {/* Participants Dialog */}
        <Dialog open={showParticipants} onOpenChange={setShowParticipants}>
          <DialogContent className='max-w-md bg-neutral-950'>
            <DialogHeader>
              <DialogTitle>Participants ({meta?.participants.length})</DialogTitle>
            </DialogHeader>
            <div className='space-y-4 max-h-[60vh] overflow-y-auto'>
              {meta?.participants.map((participant) => {
                const participantDetails = getParticipant(participant.id);
                return (
                  <div key={participant.id} className='flex items-center space-x-4'>
                    <img
                      src={participantDetails?.avatar}
                      alt={participantDetails?.name}
                      className='w-12 h-12 rounded-full object-cover bg-white'
                    />
                    <div className='flex-1'>
                      <h3 className='text-neutral-900 dark:text-white font-medium'>{participantDetails?.name}</h3>
                      <p className='text-sm text-neutral-600 dark:text-neutral-400'>
                        {participant.id === user.id ? 'You' : getLastSeen(participant.id)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>

        {/* Media Section */}
        <div className='p-4 border-t border-neutral-200 dark:border-neutral-800'>
          <h2 className='text-lg font-semibold mb-4 text-neutral-900 dark:text-white'>Media, links and documents</h2>
          <ChatMediaTabs chatId={meta?.id ?? 0} />
        </div>
      </div>
    </div>
  );
};

export default ChatProfile;
