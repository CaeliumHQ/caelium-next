import { motion } from 'framer-motion';
import React from 'react';

interface ILoaderProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Loader: React.FC<ILoaderProps> = ({ fullScreen, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center justify-center ${fullScreen ? 'w-screen h-screen' : ''}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='relative'
      >
        {/* Background gradient circle */}
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-violet-500 to-purple-500 opacity-20 animate-ping`} />
        
        {/* Spinning loader */}
        <div className='absolute inset-0'>
          <svg
            className={`${sizeClasses[size]} animate-spin`}
            viewBox='0 0 100 100'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <circle 
              cx='50' 
              cy='50' 
              r='45' 
              stroke='url(#gradient)' 
              strokeWidth='8'
              strokeLinecap='round'
              strokeDasharray='280'
              strokeDashoffset='100'
              className='origin-center rotate-0'
            />
            <defs>
              <linearGradient id='gradient' x1='0' y1='0' x2='100' y2='100'>
                <stop offset='0%' stopColor='#8B5CF6' />
                <stop offset='100%' stopColor='#A855F7' />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </motion.div>
    </div>
  );
};

export default Loader;
