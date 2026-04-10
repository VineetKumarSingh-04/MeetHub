import { useRef, useState, useCallback } from "react";

const ICE_SERVERS = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

export const useWebRTC = (socket) => {
  const localStreamRef = useRef(null);
  const peerConnections = useRef({});
  const [remoteStreams, setRemoteStreams] = useState({});

  const getLocalStream = useCallback(async (video = true, audio = true) => {
    const stream = await navigator.mediaDevices.getUserMedia({ video, audio });
    localStreamRef.current = stream;
    return stream;
  }, []);

  const getDisplayStream = useCallback(async () => {
    return await navigator.mediaDevices.getDisplayMedia({ video: true });
  }, []);

  const createPeer = useCallback((targetSocketId, isInitiator) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnections.current[targetSocketId] = pc;

    localStreamRef.current?.getTracks().forEach((track) =>
      pc.addTrack(track, localStreamRef.current)
    );

    pc.ontrack = (e) => {
      setRemoteStreams((prev) => ({ ...prev, [targetSocketId]: e.streams[0] }));
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) socket.emit("webrtc:ice-candidate", { to: targetSocketId, candidate: e.candidate });
    };

    if (isInitiator) {
      pc.createOffer().then((offer) => {
        pc.setLocalDescription(offer);
        socket.emit("webrtc:offer", { to: targetSocketId, offer, from: socket.id });
      });
    }

    return pc;
  }, [socket]);

  const handleOffer = useCallback(async (from, offer) => {
    const pc = createPeer(from, false);
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("webrtc:answer", { to: from, answer, from: socket.id });
  }, [createPeer, socket]);

  const handleAnswer = useCallback(async (from, answer) => {
    await peerConnections.current[from]?.setRemoteDescription(answer);
  }, []);

  const handleIceCandidate = useCallback(async (from, candidate) => {
    await peerConnections.current[from]?.addIceCandidate(candidate);
  }, []);

  const removePeer = useCallback((socketId) => {
    peerConnections.current[socketId]?.close();
    delete peerConnections.current[socketId];
    setRemoteStreams((prev) => { const s = { ...prev }; delete s[socketId]; return s; });
  }, []);

  const stopLocalStream = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
  }, []);

  return {
    localStreamRef,
    remoteStreams,
    getLocalStream,
    getDisplayStream,
    createPeer,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    removePeer,
    stopLocalStream,
  };
};
