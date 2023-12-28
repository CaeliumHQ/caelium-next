'use client';
import AuthContext from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';

interface Option {
  name: string;
  url: string;
  icon: string;
}

const options: Option[] = [
  { name: 'Home', url: '/dashboard', icon: 'dashboard' },
  { name: 'Gallery', url: '/gallery', icon: 'gallery_thumbnail' },
  { name: 'Chats', url: '/chats', icon: 'chat' },
];


const SideBar = () => {
  const route = usePathname();
  let { logoutUser } = useContext(AuthContext);
  if (!['/accounts/login', '/accounts/register'].includes(route)) {
    return (
      <>
        <aside
          id='logo-sidebar'
          className='fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700'
          aria-label='Sidebar'>
          <div className='h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800'>
            <ul className='space-y-2 font-medium pt-3'>
              {options.map((option: Option, id) => (
                <li key={id}>
                  <Link
                    href={option.url}
                    className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 '>
                    <span className='material-symbols-outlined text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'>
                      {option.icon}
                    </span>
                    <span className='flex-1 ms-3 whitespace-nowrap'>{option.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <a
                  data-modal-target='logout-modal'
                  data-modal-toggle='logout-modal'
                  className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                  type='button'>
                  <span className='material-symbols-outlined text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'>
                    logout
                  </span>
                  <span className='flex-1 ms-3 whitespace-nowrap'>Logout</span>
                </a>
              </li>
            </ul>
          </div>
        </aside>
        <div
          id='logout-modal'
          tabIndex={-1}
          className='hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full'>
          <div className='relative p-4 w-full max-w-md max-h-full'>
            <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
              <button
                type='button'
                className='absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
                data-modal-hide='logout-modal'>
                <span className='material-symbols-outlined'>close</span>
                <span className='sr-only'>Close modal</span>
              </button>
              <div className='p-4 md:p-5 text-center'>
                <svg
                  className='mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 20 20'>
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                  />
                </svg>
                <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>Are you sure you want to Logout?</h3>
                <button
                  onClick={logoutUser}
                  data-modal-hide='logout-modal'
                  type='button'
                  className='text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2'>
                  Yes, I&apos;m sure
                </button>
                <button
                  data-modal-hide='logout-modal'
                  type='button'
                  className='text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600'>
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default SideBar;
