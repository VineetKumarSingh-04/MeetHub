import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { useWebRTC } from "../../hooks/useWebRTC";
import VideoGrid from "../../components/meeting/VideoGrid";
import MeetingControls from "../../components/meeting/MeetingControls";
import MeetingSidebar from "../../components/meeting/MeetingSidebar";
import MeetingChat from "../../components/meeting/MeetingChat";
import LeaveOverlay from "../../components/meeting/LeaveOverlay";
import logo from "../../asset/logo.png";

const MOCK_PARTICIPANTS = [
  { id: "sarah",  name: "Sarah Chen",    initials: "SC", color: "#6366f1", mic: true,  cam: false, speaking: false },
  { id: "marcus", name: "Marcus Webb",   initials: "MW", color: "#8b5cf6", mic: false, cam: false, speaking: false },
  { id: "priya",  name: "Priya Sharma",  initials: "PS", color: "#a78bfa", mic: true,  cam: false, speaking: false },
  { id: "alex",   name: "Alex Kim",      initials: "AK", color: "#818cf8", mic: false, cam: false, speaking: false },
];

const MOCK_MESSAGES = [
  { id: 1, sender: "Sarah Chen",   text: "Hey everyone! Ready for the standup?",       time: "9:01 AM", isSelf: false },
  { id: 2, sender: "You",          text: "Good morning! Let's get started 👋",          time: "9:02 AM", isSelf: true  },
  { id: 3, sender: "Priya Sharma", text: "Can we discuss the new dashboard design?",    time: "9:03 AM", isSelf: false },
];

export default function MeetingRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();
  const { localStreamRef, remoteStreams, getLocalStream, getDisplayStream,
          createPeer, handleOffer, handleAnswer, handleIceCandidate, removePeer, stopLocalStream } = useWebRTC(socket);

  const [localStream, setLocalStream]       = useState(null);
  const [muted, setMuted]                   = useState(false);
  const [videoOff, setVideoOff]             = useState(false);
  const [screenOn, setScreenOn]             = useState(false);
  const [showChat, setShowChat]             = useState(true);
  const [showSidebar, setShowSidebar]       = useState(true);
  const [sidebarTab, setSidebarTab]         = useState("people");
  const [messages, setMessages]             = useState(MOCK_MESSAGES);
  const [participants, setParticipants]     = useState(MOCK_PARTICIPANTS);
  const [joinRequests, setJoinRequests]     = useState([
    { id: "jr1", name: "Jordan Lee",   initials: "JL" },
    { id: "jr2", name: "Emma Wilson",  initials: "EW" },
  ]);
  const [mainSpeaker, setMainSpeaker]       = useState(null);
  const [showLeave, setShowLeave]           = useState(false);
  const [leftMeeting, setLeftMeeting]       = useState(false);
  const [timerSec, setTimerSec]             = useState(0);
  const [showJoinPanel, setShowJoinPanel]   = useState(false);
  const [copied, setCopied]                 = useState(false);
  const link = `${window.location.origin}/meeting/${roomId}`;

  // Timer
  useEffect(() => {
    const t = setInterval(() => setTimerSec(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const timerLabel = `${String(Math.floor(timerSec / 60)).padStart(2,"0")}:${String(timerSec % 60).padStart(2,"0")}`;

  // WebRTC setup
  useEffect(() => {
    if (!socket) return;
    getLocalStream().then(stream => {
      setLocalStream(stream);
      socket.emit("room:join", { roomId, userId: user?.id, userName: user?.name });
    }).catch(() => {});
    socket.on("room:user-joined",      ({ socketId }) => createPeer(socketId, true));
    socket.on("webrtc:offer",          ({ offer, from }) => handleOffer(from, offer));
    socket.on("webrtc:answer",         ({ answer, from }) => handleAnswer(from, answer));
    socket.on("webrtc:ice-candidate",  ({ candidate, from }) => handleIceCandidate(from, candidate));
    socket.on("room:user-left",        ({ socketId }) => removePeer(socketId));
    return () => {
      socket.emit("room:leave", { roomId, userId: user?.id });
      stopLocalStream();
      ["room:user-joined","webrtc:offer","webrtc:answer","webrtc:ice-candidate","room:user-left"].forEach(e => socket.off(e));
    };
  }, [socket]);

  const toggleMute = () => {
    localStreamRef.current?.getAudioTracks().forEach(t => (t.enabled = muted));
    setMuted(m => !m);
  };
  const toggleVideo = () => {
    localStreamRef.current?.getVideoTracks().forEach(t => (t.enabled = videoOff));
    setVideoOff(v => !v);
  };
  const toggleScreen = async () => {
    if (!screenOn) {
      try {
        const s = await getDisplayStream();
        setLocalStream(s);
        setScreenOn(true);
        s.getVideoTracks()[0].onended = () => { getLocalStream().then(setLocalStream); setScreenOn(false); };
      } catch {}
    } else {
      getLocalStream().then(setLocalStream);
      setScreenOn(false);
    }
  };

  const sendMessage = (text) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(m => [...m, { id: Date.now(), sender: "You", text, time, isSelf: true }]);
  };

  const acceptRequest = (id) => {
    const req = joinRequests.find(r => r.id === id);
    if (req) {
      setParticipants(p => [...p, { id: req.id, name: req.name, initials: req.initials, color: "#7c3aed", mic: true, cam: false, speaking: false }]);
      setJoinRequests(r => r.filter(x => x.id !== id));
    }
  };
  const rejectRequest = (id) => setJoinRequests(r => r.filter(x => x.id !== id));

  const copyLink = () => {
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const confirmLeave = () => { stopLocalStream(); setLeftMeeting(true); setShowLeave(false); };
  const rejoin = () => { setLeftMeeting(false); setTimerSec(0); };

  const allParticipants = [
    { id: "you", name: user?.name || "You", initials: (user?.name || "Y").slice(0,2).toUpperCase(), color: "#7c3aed", mic: !muted, cam: !videoOff, speaking: true },
    ...participants,
  ];

  if (leftMeeting) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg,#0f172a,#1e1b4b)" }}>
        <div className="text-center text-white">
          <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)", boxShadow: "0 0 20px rgba(124,58,237,0.3)" }}>
            <PhoneOffIcon size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">You left the meeting</h2>
          <p className="text-gray-400 mb-6">Thanks for joining!</p>
          <button onClick={rejoin} className="px-6 py-3 rounded-2xl text-white font-medium" style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
            Rejoin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden text-white" style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#191e31 100%)", fontFamily: "'Outfit',sans-serif" }}>
      {/* Orbs */}
      <div style={{ position:"fixed", width:400, height:400, borderRadius:"50%", background:"#7c3aed", top:-100, left:-100, filter:"blur(80px)", opacity:.4, pointerEvents:"none" }} />
      <div style={{ position:"fixed", width:300, height:300, borderRadius:"50%", background:"#6366f1", bottom:-50, right:-50, filter:"blur(80px)", opacity:.4, pointerEvents:"none" }} />

      {/* Header */}
      <MeetingHeader
        roomId={roomId} timerLabel={timerLabel} participantCount={allParticipants.length}
        joinRequests={joinRequests} showJoinPanel={showJoinPanel}
        onToggleJoinPanel={() => setShowJoinPanel(p => !p)}
        onAccept={acceptRequest} onReject={rejectRequest}
        copied={copied} onCopyLink={copyLink}
      />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Video area */}
        <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
          <VideoGrid
            localStream={localStream} remoteStreams={remoteStreams}
            localUser={user} participants={allParticipants}
            mainSpeaker={mainSpeaker} onSetMain={setMainSpeaker}
            muted={muted} videoOff={videoOff}
          />
        </div>

        {/* Chat */}
        {showChat && (
          <MeetingChat messages={messages} onSend={sendMessage} />
        )}

        {/* Sidebar */}
        {showSidebar && (
          <MeetingSidebar
            participants={allParticipants} tab={sidebarTab} onTabChange={setSidebarTab}
            displayName={user?.name || "You"}
          />
        )}
      </div>

      {/* Controls */}
      <MeetingControls
        muted={muted} videoOff={videoOff} screenOn={screenOn}
        showChat={showChat} showSidebar={showSidebar}
        onToggleMute={toggleMute} onToggleVideo={toggleVideo}
        onToggleScreen={toggleScreen} onToggleChat={() => setShowChat(c => !c)}
        onToggleSidebar={() => setShowSidebar(s => !s)}
        onLeave={() => setShowLeave(true)}
      />

      {/* Leave overlay */}
      {showLeave && <LeaveOverlay onCancel={() => setShowLeave(false)} onConfirm={confirmLeave} />}
    </div>
  );
}

// ── Inline icon helpers ───────────────────────────────────────────────────────
function PhoneOffIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7 2 2 0 011.72 2v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.42 19.42 0 013.43 9.37 19.79 19.79 0 01.36 .73 2 2 0 012.34-1.18h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.32 8.68"/>
      <line x1="23" y1="1" x2="1" y2="23"/>
    </svg>
  );
}

// ── Meeting Header ────────────────────────────────────────────────────────────
function MeetingHeader({ roomId, timerLabel, participantCount, joinRequests, showJoinPanel, onToggleJoinPanel, onAccept, onReject, copied, onCopyLink }) {
  return (
    <header className="relative z-20 flex items-center justify-between px-4 py-3" style={{ background:"rgba(255,255,255,0.05)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center gap-3">
        <img src={logo} alt="MeetHub" style={{ height: 32 }} />
        <div>
          <h1 className="text-white font-semibold text-sm leading-tight" style={{ fontFamily:"'Poppins',sans-serif", background:"linear-gradient(135deg,#818cf8,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>MeetHub</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" style={{ boxShadow:"0 0 6px #22c55e" }} />
            <span className="text-gray-400 text-xs">{timerLabel}</span>
            <span className="text-gray-500 text-xs">•</span>
            <span className="text-gray-400 text-xs">{participantCount} participants</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 relative">
        <button onClick={onToggleJoinPanel} className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white transition-all" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          <span className="hidden sm:inline">Requests</span>
          {joinRequests.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">{joinRequests.length}</span>}
        </button>

        <button onClick={onCopyLink} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", color: copied ? "#22c55e" : "#d1d5db" }}>
          {copied
            ? <><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg><span className="hidden sm:inline">Copied!</span></>
            : <><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg><span className="hidden sm:inline">Copy link</span></>
          }
        </button>

        {/* Join requests panel */}
        {showJoinPanel && (
          <div className="absolute top-12 right-0 w-72 rounded-2xl p-4 z-30" style={{ background:"rgba(255,255,255,0.08)", backdropFilter:"blur(30px)", border:"1px solid rgba(255,255,255,0.12)", boxShadow:"0 20px 60px rgba(0,0,0,0.5)" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">Join Requests</h3>
              <button onClick={onToggleJoinPanel} className="text-gray-400 hover:text-white">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            {joinRequests.length === 0
              ? <p className="text-gray-400 text-sm text-center py-4">No pending requests</p>
              : joinRequests.map(jr => (
                <div key={jr.id} className="flex items-center gap-3 p-3 rounded-xl mb-2" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background:"#6366f1" }}>{jr.initials}</div>
                  <span className="text-white text-sm flex-1 truncate">{jr.name}</span>
                  <button onClick={() => onAccept(jr.id)} className="p-1.5 rounded-lg text-green-400 hover:bg-green-500/20 transition-colors">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  </button>
                  <button onClick={() => onReject(jr.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </header>
  );
}
