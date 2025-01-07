import useChatUtils from '@/helpers/chats';
import { User } from '@/helpers/props';
import { useEffect, useState } from 'react';

interface NewChatDialogProps {
  onClose?: () => void;
}

const NewChatDialog = ({ onClose }: NewChatDialogProps) => {
  const { createChat, fetchNewChats, newChats, createGroup } = useChatUtils();
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inputBox, setInputBox] = useState<'search' | 'name'>('search');

  useEffect(() => {
    setIsLoading(true);
    fetchNewChats().finally(() => setIsLoading(false));
  }, []);

  const filteredChats = newChats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || chat.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateChat = (recipientId: number) => {
    if (isGroupMode) {
      const isSelected = selectedUsers.find((user) => user.id === recipientId);
      if (isSelected) {
        setSelectedUsers(selectedUsers.filter((user) => user.id !== recipientId));
      } else {
        const user = newChats.find((chat) => chat.id === recipientId);
        if (user) {
          setSelectedUsers([...selectedUsers, user]);
        }
      }
    } else {
      createChat(recipientId);
      onClose?.();
    }
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;
    const participantIds = selectedUsers.map((user) => user.id);
    createGroup(groupName, participantIds);
    onClose?.();
  };

  return (
    <div className='flex flex-col h-[calc(100vh-6rem)] sm:h-[600px] bg-white dark:bg-neutral-900'>
      <div className='border-b border-neutral-200 dark:border-neutral-700 p-4 flex-shrink-0'>
        <div className='relative'>
          {inputBox == 'search' ? (
            <div className='flex items-center gap-2'>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                placeholder='Search by name or email'
              />
              {isGroupMode && (
                <i className='fa-solid fa-font p-3 bg-neutral-200 dark:bg-neutral-600 rounded-md h-10 w-10 text-neutral-700 dark:text-white'></i>
              )}
            </div>
          ) : (
            <div className='flex items-center gap-2'>
              <input
                type='text'
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className='bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                placeholder='Enter group name'
                maxLength={30}
              />
              <i className='fa-solid fa-search p-3 bg-neutral-200 dark:bg-neutral-600 rounded-md h-10 w-10 text-neutral-700 dark:text-white'></i>
            </div>
          )}
        </div>
      </div>

      <div className='flex-1 overflow-y-auto p-4'>
        {isGroupMode && selectedUsers.length > 0 && (
          <div className='mb-4 flex flex-wrap gap-2'>
            {selectedUsers.map((user) => (
              <div key={`chip-${user.id}`} className='flex items-center gap-2 bg-neutral-200 dark:bg-neutral-600 text-neutral-900 dark:text-white px-2 py-1 rounded-full'>
                <img src={user.avatar} alt={user.name} className='w-6 h-6 rounded-full' />
                <span>{user.name}</span>
                <button onClick={() => handleCreateChat(user.id)}>
                  <i className='fa-solid fa-xmark hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full p-1'></i>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className='overflow-y-auto h-full'>
          {isLoading ? (
            <div className='flex justify-center items-center h-32'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 dark:border-white'></div>
            </div>
          ) : (
            <ul className='space-y-2'>
              {!isGroupMode && (
                <li
                  onClick={() => {
                    setIsGroupMode(true);
                    setInputBox('name');
                  }}
                  className='p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer'
                >
                  <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center'>
                      <span className='material-symbols-outlined text-white'>group_add</span>
                    </div>
                    <div>
                      <p className='font-semibold text-neutral-900 dark:text-white'>Create Group</p>
                      <p className='text-sm text-neutral-600 dark:text-neutral-400'>Start a new group chat</p>
                    </div>
                  </div>
                </li>
              )}

              {filteredChats.map(
                (recipient: User) =>
                  !selectedUsers.find((user) => user.id === recipient.id) && (
                    <li
                      key={recipient.id}
                      onClick={() => handleCreateChat(recipient.id)}
                      className='p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer'
                    >
                      <div className='flex items-center gap-3'>
                        <img className='w-12 h-12 rounded-full object-cover' src={recipient.avatar} alt={recipient.name} />
                        <div>
                          <p className='font-semibold text-neutral-900 dark:text-white'>{recipient.name}</p>
                          <p className='text-sm text-neutral-600 dark:text-neutral-400'>{recipient.email}</p>
                        </div>
                      </div>
                    </li>
                  ),
              )}
            </ul>
          )}
        </div>
      </div>

      {isGroupMode && selectedUsers.length >= 2 && groupName.trim() && (
        <div className='border-t border-neutral-200 dark:border-neutral-700 p-4 flex-shrink-0'>
          <button
            onClick={handleCreateGroup}
            className='w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2'
          >
            <span className='material-symbols-outlined'>group_add</span>
            Create Group ({selectedUsers.length} members)
          </button>
        </div>
      )}
    </div>
  );
};

export default NewChatDialog;
