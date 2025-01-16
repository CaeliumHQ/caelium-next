'use client';
import AuthContext from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { useNavbar } from '@/contexts/NavContext';
import { useWebRTC } from '@/hooks/useWebRTC';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { use, useContext, useEffect, useState } from 'react';
import { BsCameraVideoFill, BsCameraVideoOffFill, BsMicFill, BsMicMuteFill } from 'react-icons/bs';
import { MdCallEnd } from 'react-icons/md';

const CallPage = (props: { params: Promise<{ slug: number }> }) => {
  const params = use(props.params);
  const { setShowNav } = useNavbar();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const { localStream, remoteStream, initializeMedia, toggleAudio, toggleVideo, cleanup } = useWebRTC();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setShowNav(false);
    initializeMedia();
    return () => {
      cleanup();
    };
  }, []);

  // Update the video refs when streams change
  useEffect(() => {
    const localVideo = document.querySelector('.local-video') as HTMLVideoElement;
    const remoteVideo = document.querySelector('.remote-video') as HTMLVideoElement;

    if (localVideo && localStream) {
      localVideo.srcObject = localStream;
    }
    if (remoteVideo && remoteStream) {
      remoteVideo.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  const handleToggleAudio = () => {
    toggleAudio();
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    toggleVideo();
    setIsVideoOff(!isVideoOff);
  };

  return (
    <ChatProvider chatId={params.slug}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='h-screen bg-neutral-900 flex flex-col relative overflow-hidden'
      >
        {/* Main Remote Video */}
        <div className='absolute inset-0'>
          <video className='remote-video w-full h-full object-cover' autoPlay playsInline />
          {/* Participant Info */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className='absolute top-8 left-0 right-0 flex justify-center'
          >
            <div className='bg-black/40 backdrop-blur-sm px-6 py-3 rounded-full text-white'>
              <h3 className='text-lg font-medium'>John Doe</h3>
            </div>
          </motion.div>
        </div>

        {/* Local Video PIP */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='absolute top-4 right-4 w-32 h-44 md:w-48 md:h-64 rounded-2xl overflow-hidden shadow-xl border border-white/20'
        >
          {isVideoOff ? (
            <div className='w-full h-full bg-neutral-800 flex items-center justify-center'>
              <Image
                src={user.avatar} // Replace with your avatar image path
                alt='Your avatar'
                width={120}
                height={120}
                className='rounded-full w-20 h-20 md:w-24 md:h-24 object-cover'
                priority
              />
            </div>
          ) : (
            <video className='local-video w-full h-full object-cover scale-x-[-1]' autoPlay muted playsInline />
          )}
          <div className='absolute bottom-2 left-2 text-white text-xs md:text-sm bg-black/50 px-2 py-1 rounded-full'>You</div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className='absolute bottom-0 left-0 right-0 p-6 flex items-center justify-center gap-4 bg-gradient-to-t from-black/70 to-transparent'
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleAudio}
            className={`p-4 rounded-full ${
              isMuted ? 'bg-neutral-600/80' : 'bg-gradient-to-br from-violet-500 to-purple-500'
            } text-white backdrop-blur-sm shadow-lg`}
          >
            {isMuted ? <BsMicMuteFill size={24} /> : <BsMicFill size={24} />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleVideo}
            className={`p-4 rounded-full ${
              isVideoOff ? 'bg-neutral-600/80' : 'bg-gradient-to-br from-violet-500 to-purple-500'
            } text-white backdrop-blur-sm shadow-lg`}
          >
            {isVideoOff ? <BsCameraVideoOffFill size={24} /> : <BsCameraVideoFill size={24} />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='p-4 rounded-full bg-red-500/80 backdrop-blur-sm text-white shadow-lg'
          >
            <MdCallEnd size={24} />
          </motion.button>
        </motion.div>
      </motion.div>
    </ChatProvider>
  );
};

export default CallPage;
