'use client';
import Loader from '@/components/Loader';
import { Vortex } from '@/components/ui/vortex';
import { useNavbar } from '@/contexts/NavContext';

import { useEffect, useState } from 'react';

const Page = () => {
  const [authURL, setAuthURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setShowNav } = useNavbar();
  useEffect(() => {
    setShowNav(false);
    const fetch_auth_url = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/google/auth_url/`);
      const data = await response.json();
      setAuthURL(data.url);
      setIsLoading(false);
    };
    fetch_auth_url();
    return () => {
      setShowNav(true);
    };
  }, []);
  return !isLoading ? (
    <div className='flex flex-col items-center justify-center h-screen text-white'>
      <Vortex
        backgroundColor='black'
        rangeY={800}
        particleCount={100}
        baseHue={120}
        className='flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full'
      >
        <h1 className='text-center text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400'>
          Welcome to Caelium
        </h1>
        <p className='text-xl text-center mb-8'>Unveil Your World, Connect Your Dreams - Where Privacy Meets Possibility.</p>
        {authURL && (
          <button
            className='flex items-center justify-center p-2 gap-1 bg-white rounded-lg text-black'
            onClick={() => {
              window.location.href = authURL as string;
            }}
          >
            <img loading='lazy' height='24' width='24' id='provider-logo' src='https://authjs.dev/img/providers/google.svg'></img>
            <p className='font-sans font-normal'>Continue with Google</p>
          </button>
        )}
        <div className='mt-4'>
          <a href='/privacy-policy' className='text-sm text-gray-400 hover:text-gray-200 mr-4'>
            Privacy Policy
          </a>
          <a href='/terms-and-conditions' className='text-sm text-gray-400 hover:text-gray-200'>
            Terms and Conditions
          </a>
        </div>
      </Vortex>
    </div>
  ) : (
    <Loader fullScreen />
  );
};
export default Page;
