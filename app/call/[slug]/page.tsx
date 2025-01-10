'use client';
import { useWebSocket } from '@/contexts/SocketContext';
import useAxios from '@/hooks/useAxios';
import { useRouter } from 'next/navigation';
import { use, useEffect, useRef, useState } from 'react';

const CallPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const router = useRouter();
  const api = useAxios();
  const { socket } = useWebSocket();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // Unwrap params using React.use()
  const { slug } = use(params);

  useEffect(() => {
    const initializeCall = async () => {
      try {
        // Join the call - now using unwrapped slug
        await api.post('/api/chats/join_call/', { call_id: slug });
        
        // Initialize WebRTC
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Create RTCPeerConnection
        const configuration = { 
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] 
        };
        peerConnection.current = new RTCPeerConnection(configuration);

        // Add local stream to peer connection
        stream.getTracks().forEach(track => {
          peerConnection.current?.addTrack(track, stream);
        });

        // Handle incoming tracks
        peerConnection.current.ontrack = (event) => {
          setRemoteStream(event.streams[0]);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // Handle ICE candidates - now using unwrapped slug
        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket?.send(JSON.stringify({
              category: 'ice_candidate',
              candidate: event.candidate,
              call_id: slug
            }));
          }
        };

        // Create and send offer - now using unwrapped slug
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        socket?.send(JSON.stringify({
          category: 'offer',
          offer: offer,
          call_id: slug
        }));
      } catch (error) {
        console.error('Error initializing call:', error);
      }
    };

    initializeCall();

    return () => {
      // Cleanup
      localStream?.getTracks().forEach(track => track.stop());
      peerConnection.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      
      if (data.category === 'offer' && peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.send(JSON.stringify({
          category: 'answer',
          answer: answer,
          call_id: slug
        }));
      }
      
      if (data.category === 'answer' && peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
      
      if (data.category === 'ice_candidate' && peerConnection.current) {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    };
  }, [socket]);

  const handleEndCall = () => {
    localStream?.getTracks().forEach(track => track.stop());
    peerConnection.current?.close();
    router.push('/chats');
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="flex-1 flex items-center justify-center relative">
        {/* Remote Video (Large) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Local Video (Small Overlay) */}
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute bottom-4 right-4 w-48 h-32 object-cover rounded-lg border-2 border-white"
        />
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 bg-gray-800/50 p-4 rounded-full">
        <button
          onClick={handleEndCall}
          className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full"
        >
          End Call
        </button>
      </div>
    </div>
  );
};

export default CallPage;
