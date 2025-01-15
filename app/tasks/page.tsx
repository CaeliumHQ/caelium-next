'use client';

import { Task } from '@/helpers/props';
import useAxios from '@/hooks/useAxios';
import { motion } from 'framer-motion';
import { FormEvent, useEffect, useState } from 'react';

const Page = () => {
  let [newTask, setNewTask] = useState('');
  let [tasks, setTasks] = useState<Task[]>([]);
  let [filter, setFilter] = useState('all');
  let api = useAxios();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/api/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchTasks();
  }, []);

  const createTask = async (e: FormEvent) => {
    e.preventDefault();
    if (newTask || newTask != '') {
      const response = await api.post('/api/tasks/', { name: newTask });
      setTasks([...tasks, response.data]);
      setNewTask('');
    }
  };

  const completeTask = async (id: number) => {
    try {
      api.patch(`/api/tasks/${id}/`, { completed: true });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const taskStats = {
    all: tasks.length,
    completed: tasks.filter((task) => task.completed).length,
    pending: tasks.filter((task) => !task.completed).length,
  };

  return (
    <div className='max-lg:h-[calc(100dvh-10rem)] p-6'>
      <div className='max-w-5xl mx-auto space-y-6'>
        {/* Header with Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-sm'
          >
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center'>
                <i className='fa-regular fa-clipboard text-blue-500 text-xl'></i>
              </div>
              <div>
                <p className='text-sm text-neutral-500 dark:text-neutral-400'>Total Tasks</p>
                <h3 className='text-2xl font-semibold text-neutral-900 dark:text-white'>{taskStats.all}</h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-sm'
          >
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center'>
                <i className='fa-solid fa-check text-green-500 text-xl'></i>
              </div>
              <div>
                <p className='text-sm text-neutral-500 dark:text-neutral-400'>Completed</p>
                <h3 className='text-2xl font-semibold text-neutral-900 dark:text-white'>{taskStats.completed}</h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-sm'
          >
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center'>
                <i className='fa-regular fa-clock text-yellow-500 text-xl'></i>
              </div>
              <div>
                <p className='text-sm text-neutral-500 dark:text-neutral-400'>Pending</p>
                <h3 className='text-2xl font-semibold text-neutral-900 dark:text-white'>{taskStats.pending}</h3>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Task Area */}
        <div className='bg-white dark:bg-neutral-800 rounded-2xl shadow-sm overflow-hidden'>
          <div className='p-6 border-b border-neutral-200 dark:border-neutral-700'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
              <h2 className='text-xl font-semibold text-neutral-900 dark:text-white'>My Tasks</h2>
              <div className='flex gap-2'>
                {['all', 'pending', 'completed'].map((filterOption) => (
                  <button
                    key={filterOption}
                    onClick={() => setFilter(filterOption)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all
                        ${
                          filter === filterOption
                            ? 'bg-violet-500 text-white'
                            : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                        }`}
                  >
                    {filterOption}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className='max-h-[calc(100vh-26rem)] overflow-y-auto'>
            {tasks.length > 0 ? (
              <div className='p-6 space-y-3'>
                {tasks.map((task: Task, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className='group flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-700/50 
                        rounded-xl transition-all hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  >
                    <button
                      onClick={() => completeTask(task.id)}
                      className='w-6 h-6 rounded-full border-2 border-violet-500 flex items-center justify-center
                          group-hover:bg-violet-500 transition-colors'
                    >
                      <i className='fa-solid fa-check text-xs opacity-0 group-hover:opacity-100 text-white'></i>
                    </button>
                    <span className='text-neutral-700 dark:text-neutral-200 font-medium flex-1'>{task.name}</span>
                    <span className='text-xs px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'>Today</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className='flex flex-col items-center justify-center h-64 p-6'
              >
                <div className='w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center mb-4'>
                  <i className='fa-regular fa-clipboard text-2xl text-neutral-400 dark:text-neutral-500'></i>
                </div>
                <h3 className='text-lg font-medium text-neutral-900 dark:text-white'>No tasks yet</h3>
                <p className='text-sm text-neutral-500 dark:text-neutral-400 text-center mt-2'>
                  Add your first task using the form below
                </p>
              </motion.div>
            )}
          </div>

          <form
            onSubmit={createTask}
            className='p-6 bg-neutral-50 dark:bg-neutral-700/30 border-t border-neutral-200 dark:border-neutral-700'
          >
            <div className='flex gap-3'>
              <input
                type='text'
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder='Add a new task...'
                className='flex-1 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-600
                    bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white
                    placeholder-neutral-400 dark:placeholder-neutral-500
                    focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:focus:ring-violet-500/30
                    transition-all'
                required
              />
              <button
                type='submit'
                className='px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600
                    text-white rounded-xl transition-all flex items-center gap-2 font-medium'
              >
                <i className='fa-solid fa-plus'></i>
                <span className='hidden sm:inline'>Add Task</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
