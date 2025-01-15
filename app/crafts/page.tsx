'use client';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { useNavbar } from '@/contexts/NavContext';
import { BaseError, Craft } from '@/helpers/props';
import { getTime } from '@/helpers/support';
import useAxios from '@/hooks/useAxios';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const CraftsHome = () => {
  let api = useAxios();
  const { setCtaButton, defaultCtaButton } = useNavbar();
  let [crafts, setCrafts] = useState<Craft[]>([]);
  const [error, setError] = useState<BaseError | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchCrafts = async () => {
      try {
        const response = await api.get('/api/crafts/');
        setCrafts(response.data);
      } catch (error) {
        if (error instanceof AxiosError && error.code === 'ERR_BAD_REQUEST')
          setError({ text: 'Failed to fetch messages', code: 'FETCH_FAILED' });
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCrafts();
    setCtaButton({ name: 'Create Craft', url: '/crafts/create' });
    return () => setCtaButton(defaultCtaButton);
  }, []);

  return loading ? (
    <div className='flex items-center justify-center h-[calc(100dvh-9rem)]'>
      <Loader />
    </div>
  ) : (
    <div className='flex-grow'>
      {crafts.length === 0 ? (
        <div className='flex flex-col items-center justify-center h-[calc(100dvh-15rem)]'>
          <h1 className='text-3xl'>It&apos;s quiet here… Why not add your voice?</h1>
          <p className='text-xl'>Start a new blog and inspire others!</p>
          <a href='/crafts/create'>
            <Button className='mt-8'>Create Craft</Button>
          </a>
        </div>
      ) : (
        <>
          <h1 className='text-4xl text-center font-bold m-4'>Crafts</h1>
          <div className='mx-4 md:mb-24 max-sm:m-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
            {crafts?.map((craft: Craft, index) => (
              <Link key={index} href={`/crafts/get/${craft.id}`}>
                <div className='dark:bg-neutral-800 bg-neutral-200 h-min rounded-lg shadow-md overflow-hidden' key={craft.id}>
                  <img src={craft.banner} alt={craft.title} className='w-full h-52 object-cover' />
                  <div className='py-4 px-6 h-min md:h-56 flex flex-col justify-between'>
                    <div className='flex flex-col'>
                      <p className='uppercase text-xs mb-2 rounded-full bg-neutral-400 dark:bg-neutral-500 line-clamp-1 px-2 py-0.5 w-fit'>
                        {craft.tag}
                      </p>
                      <h2 className='text-2xl font-bold mask-half-2 line-clamp-2 mb-1'>{craft.title}</h2>
                      <div className='flex flex-grow h-max'>
                        <p
                          className={`text-neutral-600 dark:text-neutral-300 h-max mb-4 ${craft.title.length > 30 ? 'line-clamp-2' : 'line-clamp-4'}`}
                        >
                          {craft.content}
                        </p>
                      </div>
                    </div>
                    <div className='flex w-full items-center text-neutral-500 dark:text-neutral-400'>
                      <span>{getTime(craft?.created_at)}</span>
                      <span className='mx-2'>•</span>
                      <span>{craft.time}</span>
                      <div className='flex flex-grow justify-end text-end'>Author: {craft.owner.name}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CraftsHome;
