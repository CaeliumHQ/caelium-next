'use client';
import BottomNav from '@/components/BottomNav';
import NavBar from '@/components/NavBar';
import SideBar from '@/components/SideBar';
import Signals from '@/components/signals/Signals';
import { initFlowbite } from 'flowbite';
import { ReactNode, useEffect } from 'react';

interface WrapperProps {
  children: ReactNode;
  navSM?: boolean;
}

const Wrapper = ({ children, navSM = true }: WrapperProps) => {
  useEffect(() => {
    initFlowbite();
  }, []);
  return (
    <main>
      <SideBar />
      <div className={navSM ? '' : 'max-lg:hidden'}>
        <NavBar />
      </div>
      <div className={`lg:ml-64 flex flex-col flex-grow ${navSM ? 'mt-20' : 'lg:mt-20 max-lg:h-dvh'}`}>{children}</div>
      <div className={navSM ? 'max-lg:mt-16' : 'max-lg:hidden'}>
        <BottomNav />
      </div>
      <Signals />
    </main>
  );
};

export default Wrapper;
