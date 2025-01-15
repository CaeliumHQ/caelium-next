'use client';
import { FormEvent, useState } from 'react';

const CreateEvent = () => {
  const [space, setSpace] = useState('personal');
  const privacyOptions = ['personal', 'partner', 'family', 'all'];
  const handleSpaceChange = (selectedPrivacy: string) => {
    setSpace(selectedPrivacy);
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };
  return (
      <div className='flex flex-col flex-grow items-center justify-center md:h-[calc(100dvh-5rem)] h-[calc(100dvh-9rem)]'>
        <div className='w-4/5 bg-neutral-900 p-8 rounded-md shadow-md'>
          <form onSubmit={handleSubmit}>
            <div className='flex justify-between'>
              <input
                type={'text'}
                placeholder='Title'
                className='border-b bg-neutral-900 outline-none text-2xl w-1/2 font-bold mb-4 p-1'
              />
              <button type='submit' className='bg-blue-600 w-20 rounded-lg text-center h-10'>
                Save
              </button>
            </div>
            <div className='flex items-center mb-4'>
              <input
                className='p-2 rounded-md focus:outline-none dark:bg-neutral-800  dark:[color-scheme:dark]'
                type={'datetime-local'}
              />
              <p className='px-2'>to</p>
              <input
                className='p-2 rounded-md focus:outline-none dark:bg-neutral-800  dark:[color-scheme:dark]'
                type={'datetime-local'}
              />
            </div>
            <div className='flex items-center mb-4 gap-2'>
              <input
                id='default-checkbox'
                type='checkbox'
                className='w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600'
              />
              <label htmlFor='default-checkbox' className='ms-2 font-medium text-gray-900 dark:text-gray-300 text-xl'>
                All Day
              </label>
            </div>
            <div>
              <input
                type={'text'}
                placeholder='Add location'
                className='border-b bg-neutral-900 outline-none text-xl w-1/2 font-bold mb-4 p-1'
              />
            </div>
            <div>
              <textarea
                className='bg-neutral-800 focus:outline-none rounded-lg w-1/2 p-4'
                rows={6}
                placeholder='Add description'
                name=''
                id=''
              />
            </div>
            <div>
              <label htmlFor='privacy' className='block text-lg font-medium text-gray-800 dark:text-white'>
                Space
              </label>
              <div className='mt-1 grid grid-cols-4 max-sm:grid-cols-2 gap-4'>
                {privacyOptions.map((option) => (
                  <button
                    key={option}
                    className={`p-2 rounded-md focus:outline-none ${
                      space === option ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-white'
                    }`}
                    onClick={() => handleSpaceChange(option)}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
  );
};

export default CreateEvent;
