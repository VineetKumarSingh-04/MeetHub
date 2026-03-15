import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import Navbar from "../../components/common/Navbar";
import ChatWindow from "../../components/chat/ChatWindow";
import CallModal from "../../components/call/CallModal";
import api from "../../services/api";
import { v4 as uuidv4 } from "uuid";

export default function Dashboard() {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);

  useEffect(() => {
    api.get("/friends").then((res) => setFriends(res.data.friends));
    api.get("/meetings").then((res) => setMeetings(res.data));
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("call:incoming", (data) => setIncomingCall(data));
    return () => socket.off("call:incoming");
  }, [socket]);

  const startInstantMeeting = async () => {
    const { data } = await api.post("/meetings", { title: "Instant Meeting", isInstant: true });
    navigate(`/meeting/${data.roomId}`);
  };

  const startCall = (friend, callType) => {
    const roomId = uuidv4();
    socket.emit("call:invite", { to: friend._id, from: user.id, callType, callerName: user.name });
    navigate(`/meeting/${roomId}`);
  };

  const acceptCall = () => {
    navigate(`/meeting/${uuidv4()}`);
    setIncomingCall(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      {incomingCall && <CallModal call={incomingCall} onAccept={acceptCall} onReject={() => { socket.emit("call:rejected", { to: incomingCall.socketId }); setIncomingCall(null); }} />}

      <div className="flex h-[calc(100vh-56px)]">
        {/* Sidebar */}
        <aside className="w-72 bg-gray-900 p-4 flex flex-col gap-4 overflow-y-auto">
          <button onClick={startInstantMeeting} className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold">+ New Meeting</button>

          <div>
            <h3 className="text-gray-400 text-xs uppercase mb-2">Friends</h3>
            {friends.map((f) => (
              <div key={f._id} className="flex items-center justify-between py-2 px-2 hover:bg-gray-800 rounded-lg cursor-pointer" onClick={() => setActiveChat(f)}>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <img src={f.avatar || "/default-avatar.png"} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-gray-900 ${onlineUsers.includes(f._id) ? "bg-green-400" : "bg-gray-500"}`} />
                  </div>
                  <span className="text-sm">{f.name}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={(e) => { e.stopPropagation(); startCall(f, "video"); }} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">📹</button>
                  <button onClick={(e) => { e.stopPropagation(); startCall(f, "voice"); }} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">📞</button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-gray-400 text-xs uppercase mb-2">Upcoming Meetings</h3>
            {meetings.filter((m) => m.scheduledAt).map((m) => (
              <div key={m._id} className="bg-gray-800 rounded-lg p-3 mb-2 cursor-pointer hover:bg-gray-700" onClick={() => navigate(`/meeting/${m.roomId}`)}>
                <p className="text-sm font-medium">{m.title}</p>
                <p className="text-xs text-gray-400">{new Date(m.scheduledAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          {activeChat ? (
            <ChatWindow friend={activeChat} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-4xl mb-4">💬</p>
              <p>Select a friend to start chatting</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
