import AuthContext from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { FiBookmark, FiHeart, FiMessageSquare, FiMoreHorizontal, FiSend } from 'react-icons/fi';

interface PostUser {
  id: number;
  name: string;
  username: string;
  avatar: string;
}

interface PostProps {
  post: {
    id: number;
    user: PostUser;
    content: string;
    image?: string;
    likes: number;
    comments: number;
    time: string;
  };
}

const Post = ({ post }: PostProps) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  
  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };
  
  const handleSave = () => {
    setSaved(!saved);
  };

  const {user} = useContext(AuthContext)
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white dark:bg-neutral-800 shadow-xs overflow-hidden"
    >
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <img 
              src={post.user.avatar} 
              alt={post.user.name} 
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-medium text-sm dark:text-white">{post.user.name}</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">@{post.user.username} • {post.time}</p>
          </div>
        </div>
        <button className="h-8 w-8 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center justify-center">
          <FiMoreHorizontal className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
        </button>
      </div>
      
      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-neutral-800 dark:text-neutral-200 text-sm">{post.content}</p>
      </div>
      
      {/* Post Image */}
      {post.image && (
        <div className="w-full">
          <img 
            src={post.image} 
            alt="Post content" 
            className="w-full object-cover"
            style={{ maxHeight: '500px' }}
          />
        </div>
      )}
      
      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 sm:gap-3">
            <motion.button 
              whileTap={{ scale: 1.3 }}
              className={`h-9 w-9 rounded-full flex items-center justify-center ${
                liked ? 'text-red-500' : 'text-neutral-600 dark:text-neutral-400'
              }`}
              onClick={handleLike}
            >
              <FiHeart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="h-9 w-9 rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-400"
            >
              <FiMessageSquare className="w-5 h-5" />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="h-9 w-9 rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-400"
            >
              <FiSend className="w-5 h-5" />
            </motion.button>
          </div>
          
          <motion.button 
            whileTap={{ scale: 1.2 }}
            className={`h-9 w-9 rounded-full flex items-center justify-center ${
              saved ? 'text-yellow-500' : 'text-neutral-600 dark:text-neutral-400'
            }`}
            onClick={handleSave}
          >
            <FiBookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
        
        {/* Likes and Comments */}
        <div>
          <p className="text-sm font-medium dark:text-white">{likeCount.toLocaleString()} likes</p>
          <button className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            View all {post.comments} comments
          </button>
          
          {/* Comment Input */}
          <div className="mt-3 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full overflow-hidden">
              <img 
                src={user.avatar} 
                alt="Your avatar" 
                className="h-full w-full object-cover"
              />
            </div>
            <input 
              type="text" 
              placeholder="Add a comment..." 
              className="flex-grow bg-transparent text-sm border-none focus:outline-none focus:ring-0 text-neutral-800 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-neutral-400"
            />
            <button className="text-violet-600 dark:text-violet-400 text-sm font-medium">Post</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Post;