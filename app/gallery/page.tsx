'use client';
import Loader from '@/components/Loader';
import { useNavbar } from '@/contexts/NavContext';
import { Image, NavLink } from '@/helpers/props';
import { getDate } from '@/helpers/support';
import useAxios from '@/hooks/useAxios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Page = () => {
  const api = useAxios();
  const [loading, setLoading] = useState<boolean>(true);
  const { setCtaButton, defaultCtaButton, navLinks, setNavLinks } = useNavbar();
  const [images, setImages] = useState<Image[] | null>(null);
  const [havePermission, setHavePermission] = useState<boolean>(false);
  const [accessURL, setAccessURL] = useState<string>('');

  useEffect(() => {
    setCtaButton({ name: 'Upload', url: 'gallery/upload' });
    const newLinks: NavLink[] = navLinks ? [...navLinks] : [];
    newLinks[0] = { name: 'Albums', url: '/gallery/albums' };
    newLinks[1] = { name: 'Explore', url: '/gallery/explore' };
    setNavLinks(newLinks);

    const fetchImages = async () => {
      const response = await api.get('/api/gallery/');
      if (response.status == 200) {
        setImages(response.data);
        setLoading(false);
        setHavePermission(true);
      } else {
        setAccessURL(response.data.url);
        setLoading(false);
      }
    };

    fetchImages();

    return () => {
      setCtaButton(defaultCtaButton);
    };
  }, []);

  const groupImagesByDate = (images: Image[]) => {
    return images.reduce(
      (acc, image) => {
        const date = new Date(image.timestamp).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(image);
        return acc;
      },
      {} as { [key: string]: Image[] },
    );
  };

  let groupedImages: { [key: string]: Image[] } = {};
  if (images) {
    groupedImages = groupImagesByDate(images);
  }

  return loading ? (
    <div className='flex items-center justify-center h-[calc(100dvh-9rem)]'>
      <Loader />
    </div>
  ) : (
    <div className='p-4'>
      {havePermission ? (
        Object.entries(groupedImages).map(([date, images_of_date]) => (
          <div className='pb-4' key={date}>
            <p className='text-3xl py-2'>{getDate(date)}</p>
            <div className='grid grid-cols-1 max-sm:grid-cols-2 md:grid-cols-7 gap-4'>
              {images_of_date.map((image: Image, i) => (
                <Link key={i} href={`/gallery/image/${image.id}`}>
                  <img className='aspect-square rounded-lg object-cover' src={image.url} />
                </Link>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className='flex flex-col items-center h-[calc(100dvh-9rem)] justify-center'>
          <img className='h-28 mb-6' src={'/google/photos.png'} />
          <p className='mb-4 text-lg text-center text-balance'>Tap the button below to import your photos from Google.</p>
          <Link href={accessURL} className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg'>
            Sync Photos
          </Link>
        </div>
      )}
    </div>
  );
};

export default Page;
