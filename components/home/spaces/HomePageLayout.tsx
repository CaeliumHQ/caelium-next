import AuthContext from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { FiPlus, FiRefreshCw, FiUsers } from 'react-icons/fi';
import Post from '../Post';

// Sample data for posts (in a real app, this would come from API)
const samplePosts = [
  {
    id: 1,
    user: {
      id: 101,
      name: 'Sarah Johnson',
      username: 'sarahj',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    content: "Just finished working on my new project! Can't wait to share it with everyone.",
    image:
      'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    likes: 24,
    comments: 5,
    time: '37m',
  },
  {
    id: 2,
    user: {
      id: 102,
      name: 'Alex Chen',
      username: 'alexc',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    content: 'Beautiful day for hiking! #nature #outdoors',
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    likes: 56,
    comments: 8,
    time: '2h',
  },
  {
    id: 3,
    user: {
      id: 103,
      name: 'Jamie Rivera',
      username: 'jamier',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    content: 'Working from my favorite cafe today. The coffee is amazing!',
    image:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    likes: 42,
    comments: 13,
    time: '5h',
  },
];

// Sample suggestions for people to follow
const suggestions = [
  {
    id: 201,
    name: 'Priya Patel',
    username: 'priyap',
    avatar: 'https://i.pravatar.cc/150?img=5',
    mutuals: 4,
  },
  {
    id: 202,
    name: 'Daniel Kim',
    username: 'danielk',
    avatar: 'https://i.pravatar.cc/150?img=6',
    mutuals: 2,
  },
  {
    id: 203,
    name: 'Maya Thompson',
    username: 'mayat',
    avatar: 'https://i.pravatar.cc/150?img=7',
    mutuals: 7,
  },
  {
    id: 204,
    name: 'Jordan Davis',
    username: 'jordand',
    avatar: 'https://i.pravatar.cc/150?img=8',
    mutuals: 3,
  },
  {
    id: 205,
    name: 'Taylor Wilson',
    username: 'taylorw',
    avatar: 'https://i.pravatar.cc/150?img=9',
    mutuals: 5,
  },
];

const HomePageLayout = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className='w-full max-w-7xl mx-auto px-4 pb-16'>
      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Main Content - Posts Feed */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className='flex-1'>
          {/* Stories and Create Post (placeholder for now) */}

          {/* Posts Feed - Now with scrolling */}
          <div className='md:h-[calc(100vh-6rem)] rounded-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-600 scrollbar-track-transparent'>
            <div className='mb-6 p-5 rounded-2xl bg-white dark:bg-neutral-800 shadow-xs'>
              <div className='flex items-center gap-4 mb-2'>
                <div className='h-10 w-10 rounded-full bg-linear-to-br from-violet-500 to-purple-500 flex items-center justify-center'>
                  <img className='rounded-full w-full h-full object-cover' src={user?.avatar} alt={user?.name} />
                </div>
                <div className='flex-grow'>
                  <button className='w-full text-left p-2.5 bg-neutral-100 dark:bg-neutral-700 rounded-full text-neutral-500 dark:text-neutral-400'>
                    What's on your mind, {user?.name.split(' ')[0]}?
                  </button>
                </div>
              </div>
            </div>
            <div className='space-y-6'>
              {samplePosts.map((post) => (
                <Post key={post.id} post={post} />
              ))}

              {/* Load More */}
              <div className='flex justify-center pt-4 pb-8'>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className='flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-medium'
                >
                  <FiRefreshCw className='w-4 h-4' />
                  Load More
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Sidebar - Suggestions */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className='w-full lg:w-80 shrink-0 lg:sticky lg:self-start'
        >
          {/* Suggestions */}
          <div className='p-5 rounded-2xl bg-white dark:bg-neutral-800 shadow-xs'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='font-medium text-neutral-700 dark:text-neutral-200'>Suggested for you</h3>
              <a href='#' className='text-sm text-violet-600 dark:text-violet-400 font-medium'>
                See All
              </a>
            </div>

            <div className='space-y-4'>
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='h-10 w-10 rounded-full overflow-hidden'>
                      <img src={suggestion.avatar} alt={suggestion.name} className='h-full w-full object-cover' />
                    </div>
                    <div>
                      <h4 className='text-sm font-medium dark:text-white'>{suggestion.name}</h4>
                      <p className='text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1'>
                        <FiUsers className='w-3 h-3' />
                        <span>{suggestion.mutuals} mutual connections</span>
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='flex items-center justify-center h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-700 text-violet-600 dark:text-violet-400'
                  >
                    <FiPlus className='w-4 h-4' />
                  </motion.button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className='mt-6 px-2 text-xs text-neutral-500 dark:text-neutral-400'>
            <div className='flex flex-wrap gap-x-2 gap-y-1'>
              <a href='#' className='hover:underline'>
                About
              </a>
              <span>•</span>
              <a href='#' className='hover:underline'>
                Help
              </a>
              <span>•</span>
              <a href='#' className='hover:underline'>
                Privacy
              </a>
              <span>•</span>
              <a href='#' className='hover:underline'>
                Terms
              </a>
            </div>
            <p className='mt-2'>© 2025 Caelium</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePageLayout;
