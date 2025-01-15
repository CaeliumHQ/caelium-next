'use client';

import Loader from '@/components/Loader';
import { useNavbar } from '@/contexts/NavContext';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const { setShowNav } = useNavbar();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    setShowNav(false);
    setLoading(false);
    return () => {
      setShowNav(true);
    };
  }, []);
  return !loading ? (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'>
      <div className='text-center px-4'>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className='text-9xl font-bold text-gray-800 dark:text-gray-100'>
            4
            <motion.span
              animate={{
                rotate: [0, -10, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className='inline-block'
            >
              0
            </motion.span>
            4
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className='text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-300 mt-4'
          >
            Oops! Looks like you&apos;ve ventured into unknown territory
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <div
              onClick={() => {
                router.back();
              }}
              className='inline-block mt-8 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 font-medium'
            >
              Go Back
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  ) : (
    <Loader fullScreen />
  );
}
