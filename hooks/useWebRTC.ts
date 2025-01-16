import { useWebSocket } from '@/contexts/SocketContext';
import { useEffect, useRef, useState } from 'react';

export const useWebRTC = () => {
  const { socket, socketData } = useWebSocket();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {

  }, [socketData]);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const createPeerConnection = async () => {
    const configuration = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun1.l.google.com:19302' }],
    };

    const pc = new RTCPeerConnection(configuration);
    peerConnection.current = pc;

    // Handle remote stream
    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    // Add local stream
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    return pc;
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
    }
  };

  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
  };

  return {
    localStream,
    remoteStream,
    initializeMedia,
    createPeerConnection,
    toggleAudio,
    toggleVideo,
    cleanup,
  };
};
