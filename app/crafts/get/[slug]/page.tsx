'use client';
import Loader from '@/components/Loader';
import { BaseError, Craft } from '@/helpers/props';
import { getTime } from '@/helpers/support';
import useAxios from '@/hooks/useAxios';
import { AxiosError } from 'axios';
import { use, useEffect, useState } from 'react';

const CraftRead = (props: { params: Promise<{ slug: Number }> }) => {
  const params = use(props.params);
  let [error, setError] = useState<BaseError | null>(null);
  let [craft, setCraft] = useState<Craft | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const api = useAxios();

  useEffect(() => {
    const fetchCraft = async () => {
      try {
        const response = await api.get(`/api/crafts/${params.slug}`);
        setCraft(response.data);
      } catch (error) {
        if (error instanceof AxiosError && error.code === 'ERR_BAD_REQUEST')
          setError({ text: 'Failed to fetch messages', code: 'FETCH_FAILED' });
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCraft();
  }, []);
  const paragraphs = craft?.content.split('\n');
  return loading || !craft ? (
    <div className='flex items-center justify-center h-[calc(100dvh-9rem)]'>
      <Loader />
    </div>
  ) : (
    <div className='min-h-screen m-4 md:mx-56 flex flex-grow flex-col'>
      <div className='py-8 text-center'>
        <h1 className='text-4xl font-bold'>{craft?.title}</h1>
        <p className='text-lg'>{craft?.tag}</p>
      </div>
      <div className='container mx-auto flex-1 pb-8'>
        <div className='max-w-3xl mx-auto'>
          <article className='mb-8'>
            <img src={craft?.banner} alt='Banner' className='w-auto mb-4 rounded-lg md:h-96 mx-auto' />
            <h2 className='text-2xl font-bold mb-2'>{craft?.title}</h2>
            <p className='dark:text-neutral-400 text-neutral-500 mb-4'>
              {getTime(craft?.created_at)} • {craft?.time}
            </p>
            {paragraphs?.map((paragraph, index) => (
              <p key={index} className='leading-relaxed my-4 text-lg'>
                {paragraph}
              </p>
            ))}
          </article>
          <div className='flex items-center justify-end pe-6'>
            <img src={craft?.owner.avatar} alt='User Avatar' className='w-12 h-12 rounded-full mr-4 border object-cover' />
            <div>
              <p className='font-bold text-lg'>{craft?.owner.name}</p>
              <p className='text-sm'>{craft?.owner.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CraftRead;
