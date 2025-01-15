import AuthContext from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useContext, useMemo } from 'react';
import { FiBell, FiCalendar, FiCheckCircle, FiClock, FiPieChart, FiPlus, FiTarget, FiTrello } from 'react-icons/fi';
import EventWidget from '../widgets/EventWidget';
import TaskWidget from '../widgets/TaskWidget';

const Personal = () => {
  let { user } = useContext(AuthContext);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const quickActions = [
    { name: 'New Task', icon: FiPlus, color: 'bg-blue-500/10 text-blue-600' },
    { name: 'Schedule', icon: FiCalendar, color: 'bg-purple-500/10 text-purple-600' },
    { name: 'Dashboard', icon: FiPieChart, color: 'bg-green-500/10 text-green-600' },
    { name: 'Timeline', icon: FiClock, color: 'bg-orange-500/10 text-orange-600' },
    { name: 'Goals', icon: FiTarget, color: 'bg-pink-500/10 text-pink-600' },
    { name: 'Board', icon: FiTrello, color: 'bg-indigo-500/10 text-indigo-600' },
  ];

  return (
    user && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className='flex flex-col lg:flex-row gap-6 p-6 lg:p-8'>
          {/* Sidebar */}
          <motion.div initial={{ x: -20 }} animate={{ x: 0 }} className='lg:w-80 space-y-6'>
            <div className='rounded-2xl bg-white dark:bg-neutral-800 p-6 shadow-sm'>
              <div className='space-y-4'>
                <div className='h-20 w-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center'>
                  <img className='rounded-full' src={user.avatar} alt='' />
                </div>
                <div>
                  <h2 className='text-xl font-semibold text-neutral-900 dark:text-white'>
                    {greeting}, {user.name}
                  </h2>
                  <p className='text-sm text-neutral-500 dark:text-neutral-400'>Ready to make today count?</p>
                </div>
              </div>
            </div>

            <div className='rounded-2xl bg-white dark:bg-neutral-800 p-6 shadow-sm'>
              <h3 className='font-medium mb-4 flex items-center gap-2'>
                <FiBell className='w-4 h-4' />
                Quick Actions
              </h3>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                {quickActions.map((action) => (
                  <button
                    key={action.name}
                    className={`p-3 rounded-xl ${action.color} flex flex-col items-center justify-center gap-2 hover:opacity-80 transition-all hover:scale-105`}
                  >
                    <action.icon className='h-5 w-5' />
                    <span className='text-xs font-medium'>{action.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className='flex-1 space-y-6'>
            <div className='grid gap-6 lg:grid-cols-3'>
              <div className='col-span-2 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 p-6 text-white'>
                <h3 className='text-lg font-medium mb-2 flex items-center gap-2'>
                  <FiCheckCircle className='w-5 h-5' />
                  Progress Summary
                </h3>
                <div className='grid grid-cols-3 gap-4'>
                  <div className='rounded-xl bg-white/10 p-4'>
                    <div className='text-2xl font-bold'>12</div>
                    <div className='text-sm opacity-80'>Tasks Done</div>
                  </div>
                  <div className='rounded-xl bg-white/10 p-4'>
                    <div className='text-2xl font-bold'>5</div>
                    <div className='text-sm opacity-80'>In Progress</div>
                  </div>
                  <div className='rounded-xl bg-white/10 p-4'>
                    <div className='text-2xl font-bold'>89%</div>
                    <div className='text-sm opacity-80'>Completion</div>
                  </div>
                </div>
              </div>
              <div className='rounded-2xl bg-white dark:bg-neutral-800 p-6 shadow-sm'>
                <h3 className='font-medium mb-4'>Activity</h3>
                {/* Add activity content here */}
              </div>
            </div>

            <div className='grid gap-6 lg:grid-cols-2'>
              <div className='rounded-2xl bg-white dark:bg-neutral-800 p-6 shadow-sm'>
                <TaskWidget />
              </div>
              <div className='rounded-2xl bg-white dark:bg-neutral-800 p-6 shadow-sm'>
                <EventWidget />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    )
  );
};

export default Personal;
