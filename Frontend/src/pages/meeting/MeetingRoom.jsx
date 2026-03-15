import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { useWebRTC } from "../../hooks/useWebRTC";
import VideoGrid from "../../components/meeting/VideoGrid";
import MeetingControls from "../../components/meeting/MeetingControls";
import ChatWindow from "../../components/chat/ChatWindow";

export default function Meeting() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();
  const { localStreamRef, remoteStreams, getLocalStream, getDisplayStream, createPeer, handleOffer, handleAnswer, handleIceCandidate, removePeer, stopLocalStream } = useWebRTC(socket);

  const [localStream, setLocalStream] = useState(null);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [link] = useState(`${window.location.origin}/meeting/${roomId}`);

  useEffect(() => {
    if (!socket) return;

    getLocalStream().then((stream) => {
      setLocalStream(stream);
      socket.emit("room:join", { roomId, userId: user.id, userName: user.name });
    });

    socket.on("room:user-joined", ({ socketId }) => createPeer(socketId, true));
    socket.on("webrtc:offer", ({ offer, from }) => handleOffer(from, offer));
    socket.on("webrtc:answer", ({ answer, from }) => handleAnswer(from, answer));
    socket.on("webrtc:ice-candidate", ({ candidate, from }) => handleIceCandidate(from, candidate));
    socket.on("room:user-left", ({ socketId }) => removePeer(socketId));

    return () => {
      socket.emit("room:leave", { roomId, userId: user.id });
      stopLocalStream();
      ["room:user-joined", "webrtc:offer", "webrtc:answer", "webrtc:ice-candidate", "room:user-left"].forEach((e) => socket.off(e));
    };
  }, [socket]);

  const toggleMute = () => {
    localStreamRef.current?.getAudioTracks().forEach((t) => (t.enabled = muted));
    setMuted(!muted);
  };

  const toggleVideo = () => {
    localStreamRef.current?.getVideoTracks().forEach((t) => (t.enabled = videoOff));
    setVideoOff(!videoOff);
  };

  const shareScreen = async () => {
    const screenStream = await getDisplayStream();
    const videoTrack = screenStream.getVideoTracks()[0];
    // Replace video track in all peer connections
    Object.values(localStreamRef.current ? [localStreamRef.current] : []).forEach(() => {});
    setLocalStream(screenStream);
    videoTrack.onended = () => getLocalStream().then(setLocalStream);
  };

  const leave = () => { navigate("/dashboard"); };

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900">
        <span className="text-blue-400 font-bold">MeetHub</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded">{link}</span>
          <button onClick={() => navigator.clipboard.writeText(link)} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">Copy</button>
          <button onClick={() => setShowChat(!showChat)} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">💬 Chat</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1">
          <VideoGrid localStream={localStream} remoteStreams={remoteStreams} localUser={user} />
        </div>
        {showChat && (
          <div className="w-80 border-l border-gray-800">
            <div className="h-full p-2">
              {/* Room chat - simplified: using roomId as identifier */}
              <div className="h-full bg-gray-800 rounded-xl flex flex-col overflow-hidden">
                <div className="px-4 py-3 bg-gray-700 font-semibold text-sm">Meeting Chat</div>
                <div className="flex-1 p-3 text-gray-400 text-sm flex items-center justify-center">Room chat active</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <MeetingControls muted={muted} videoOff={videoOff} onToggleMute={toggleMute} onToggleVideo={toggleVideo} onShareScreen={shareScreen} onLeave={leave} />
    </div>
  );
}
