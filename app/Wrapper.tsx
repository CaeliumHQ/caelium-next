'use client';
import BottomNav from '@/components/BottomNav';
import NavBar from '@/components/NavBar';
import SideBar from '@/components/SideBar';
import Signals from '@/components/signals/Signals';
import { useNavbar } from '@/contexts/NavContext';
import { initFlowbite } from 'flowbite';
import { ReactNode, useEffect } from 'react';

interface WrapperProps {
  children: ReactNode;
  navSM?: boolean;
}

const Wrapper = ({ children }: WrapperProps) => {
  const { viewSM, showNav } = useNavbar();
  useEffect(() => {
    initFlowbite();
  }, []);
  return showNav ? (
    <main>
      <SideBar />
      <div className={viewSM ? '' : 'max-lg:hidden'}>
        <NavBar />
      </div>
      <div className={`lg:ml-72 flex flex-col flex-grow ${viewSM ? 'mt-20' : 'lg:mt-20 max-lg:h-dvh'}`}>{children}</div>
      <div className={viewSM ? 'max-lg:mt-16' : 'max-lg:hidden'}>
        <BottomNav />
      </div>
      <Signals />
    </main>
  ) : (
    children
  );
};

export default Wrapper;
