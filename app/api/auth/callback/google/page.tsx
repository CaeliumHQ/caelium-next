'use client';
import Loader from '@/components/Loader';
import AuthContext from '@/contexts/AuthContext';
import { useSearchParams } from 'next/navigation';
import { useContext, useEffect } from 'react';

const Page = () => {
  const { loginUser } = useContext(AuthContext);
  const searchParams = useSearchParams();
  useEffect(() => {
    const fetch_tokens = async (auth_code: any) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/google/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: auth_code }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new TypeError('Received non-JSON response');
        }

        const data = await response.json();
        loginUser(data);
      } catch (error) {
        console.log('Error fetching tokens:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };
    const auth_code = searchParams.get('code');
    auth_code && fetch_tokens(auth_code);
  }, [searchParams]);
  return (
    <div className='flex h-dvh items-center justify-center'>
      <Loader />
    </div>
  );
};

export default Page;
