'use client';
import { DropDown, NavLink } from '@/helpers/props';
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

interface NavbarContextData {
  ctaButton: NavLink | null;
  setCtaButton: Dispatch<SetStateAction<NavLink | null>>;
  navLinks: NavLink[] | null;
  setNavLinks: Dispatch<SetStateAction<NavLink[] | null>>;
  dropDown: { name: string; options: NavLink[] } | null;
  setDropDown: Dispatch<SetStateAction<{ name: string; options: NavLink[] } | null>>;
  defaultCtaButton: NavLink | null;
}

const NavbarContext = createContext<NavbarContextData | undefined>(undefined);

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
};

let defaultNavLinks: NavLink[] = [
  { name: 'Write', url: '/crafts/create' },
  { name: 'Layout', url: '/layout' },
  { name: 'Settings', url: '/settings' },
];

let createDropdown: DropDown = {
  name: 'Create',
  options: [
    { name: 'New Event', url: '/calendar/create' },
    { name: 'New ToDo', url: '/todo/create' },
  ],
};

let defaultCtaButton: NavLink = { name: 'Get Started', url: '/get-started' };

export const NavbarProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [ctaButton, setCtaButton] = useState<NavLink | null>(defaultCtaButton);
  const [navLinks, setNavLinks] = useState<NavLink[] | null>(defaultNavLinks);
  const [dropDown, setDropDown] = useState<DropDown | null>(createDropdown);
  return (
    <NavbarContext.Provider value={{ ctaButton, setCtaButton, navLinks, setNavLinks, dropDown, setDropDown, defaultCtaButton }}>
      {children}
    </NavbarContext.Provider>
  );
};
