'use client';
import Loader from '@/components/Loader';
import { Album } from '@/helpers/props';
import useAxios from '@/hooks/useAxios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Albums = () => {
  const api = useAxios();
  const [loading, setLoading] = useState<boolean>(true);
  const [albums, setAlbums] = useState<Album[] | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      const response = await api.get('/api/gallery/albums/');

      setAlbums(response.data);
      setLoading(false);
    };

    fetchImages();
  }, []);

  return loading ? (

      <div className='flex items-center justify-center h-[calc(100dvh-9rem)]'>
        <Loader />
      </div>

  ) : (

      <div className='p-4'>
        <div className='flex justify-between border-b px-10'>
          <p className='text-3xl w-1/2 font-bold p-1'>Albums</p>
          <div className='flex items-center justify-end'>
            <Link href={'/gallery/albums/create'} className='px-2 py-1 hover:bg-neutral-800 mb-3 rounded-lg'>
              <i className='fa-solid fa-square-plus p-2'></i>Create album
            </Link>
          </div>
        </div>
        <div className='my-5'>
          {albums?.map((album, index) => (
            <div key={index} className='p-4 my-4 bg-neutral-900 rounded-3xl'>
              <div key={album.id} className='mb-8'>
                <p className='text-3xl py-2'>{album.title}</p>
                <div className='grid items-center w-full grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4'>
                  {album.images?.map((image, index) => (
                    <Link key={index} href={`/gallery/image/${image.id}`}>
                      <img className='aspect-square rounded-lg object-cover' src={image.url} alt={image.filename} />
                    </Link>
                  ))}
                  <div className='aspect-square bg-neutral-800 rounded-lg flex flex-col items-center justify-center'>
                    <i className='fa-solid fa-arrow-up-right-from-square text-3xl p-4 text-center text-neutral-500' />
                    <p className='text-neutral-400 text-xl'>view more</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

  );
};

export default Albums;
