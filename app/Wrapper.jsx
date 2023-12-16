'use client';
import NavBar from '@/components/NavBar';
import SideBar from '@/components/SideBar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Wrapper = ({ children }) => {
  const router = useRouter()
  const checkAuthentication = () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  };

  useEffect(() => {
    const isAuthenticated = checkAuthentication();
    if (!isAuthenticated) {
      router.push('/welcome');
    }
  }, []);

  return (
    <main className='min-h-screen'>
      <NavBar />
      <SideBar />
      <div className='p-4 sm:ml-64 pt-20'>
        <div className='p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700'>{children}</div>
      </div>
    </main>
  );
};

export default Wrapper;
