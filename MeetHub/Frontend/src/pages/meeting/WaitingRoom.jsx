import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function WaitingRoom() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [meeting, setMeeting] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/meetings/${roomId}`)
      .then((res) => setMeeting(res.data))
      .catch(() => setError("Meeting not found"));

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setError("Could not access camera/microphone"));

    return () => streamRef.current?.getTracks().forEach((t) => t.stop());
  }, [roomId]);

  const toggleMute = () => {
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = muted));
    setMuted(!muted);
  };

  const toggleVideo = () => {
    streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = videoOff));
    setVideoOff(!videoOff);
  };

  const joinMeeting = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    navigate(`/meeting/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-2">Ready to join?</h2>
        {meeting && <p className="text-gray-400 text-center mb-6">{meeting.title}</p>}
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <div className="bg-gray-800 rounded-2xl overflow-hidden mb-4 aspect-video relative">
          {videoOff ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center text-3xl">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            </div>
          ) : (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
            <button onClick={toggleMute}
              className={`p-3 rounded-full text-white ${muted ? "bg-red-600" : "bg-gray-600/80 hover:bg-gray-500"}`}>
              {muted ? "🔇" : "🎤"}
            </button>
            <button onClick={toggleVideo}
              className={`p-3 rounded-full text-white ${videoOff ? "bg-red-600" : "bg-gray-600/80 hover:bg-gray-500"}`}>
              {videoOff ? "📷" : "📹"}
            </button>
          </div>
        </div>

        <button onClick={joinMeeting}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold text-lg transition">
          Join Now
        </button>
      </div>
    </div>
  );
}
