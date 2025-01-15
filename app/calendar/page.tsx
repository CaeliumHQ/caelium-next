'use client';
import { useNavbar } from '@/contexts/NavContext';
import { NavLink } from '@/helpers/props';
import { useEffect } from 'react';

const CalendarPage = () => {
  const { navLinks, setNavLinks, setCtaButton, defaultCtaButton } = useNavbar();
  useEffect(() => {
    setCtaButton({ name: 'Create Event', url: 'calendar/create' });
    const newLinks: NavLink[] = navLinks ? [...navLinks] : [];
    newLinks[2] = { name: 'Groups', url: '/calendar/groups' };
    setNavLinks(newLinks);
    return () => {
      setCtaButton(defaultCtaButton);
    };
  }, []);

  return (
    <div className='p-4 grid place-items-center w-full'>
      <div className='w-min'>
        <h1 className='text-5xl'>Calendar</h1>
        <p className='text-center'>Coming soon...</p>
      </div>
    </div>
  );
};

export default CalendarPage;
