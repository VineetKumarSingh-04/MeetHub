import VideoTile from "./VideoTile";

export default function VideoGrid({ localStream, remoteStreams, localUser, participants, mainSpeaker, onSetMain, muted, videoOff }) {
  const remoteEntries = Object.entries(remoteStreams || {});
  const mainP = mainSpeaker ? participants.find(p => p.id === mainSpeaker) : participants[0];
  const thumbs = participants.filter(p => p.id !== (mainP?.id));

  return (
    <div className="flex flex-col gap-3 flex-1 overflow-hidden" style={{ minHeight: 0 }}>
      {/* Main speaker */}
      <div className="flex-1 relative rounded-2xl overflow-hidden" style={{ minHeight: 0, background:"linear-gradient(135deg,#312e81,#1e1b4b)", boxShadow:"0 0 0 3px rgba(124,58,237,0.8), 0 0 25px rgba(124,58,237,0.4)" }}>
        {localStream && !videoOff
          ? <video autoPlay playsInline muted className="w-full h-full object-cover" ref={el => { if (el && localStream) el.srcObject = localStream; }} />
          : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-3" style={{ background:"linear-gradient(135deg,#7c3aed,#6366f1)" }}>
                {mainP?.initials || "Y"}
              </div>
              <span className="text-white font-medium text-lg">{mainP?.name || localUser?.name || "You"}</span>
              <span className="text-purple-300 text-xs mt-1 px-3 py-1 rounded-full" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>Presenting</span>
            </div>
          )
        }
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-white text-xs font-medium" style={{ background:"rgba(255,255,255,0.05)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.08)" }}>
          <svg width="12" height="12" fill="none" stroke={muted ? "#ef4444" : "#22c55e"} strokeWidth="2" viewBox="0 0 24 24">
            {muted
              ? <><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6"/><path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>
              : <><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>
            }
          </svg>
          {mainP?.name || localUser?.name || "You"}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ minHeight: 110, maxHeight: 130 }}>
        {thumbs.map(p => (
          <div key={p.id} onClick={() => onSetMain(p.id)}
            className="rounded-2xl overflow-hidden relative flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
            style={{ width: 160, height: 110, background:"linear-gradient(135deg,#1e2440,#191e31)", border: p.speaking ? "2px solid rgba(124,58,237,0.8)" : "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white mb-1" style={{ background: p.color }}>{p.initials}</div>
              <span className="text-white text-xs font-medium">{p.name.split(" ")[0]}</span>
            </div>
            <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-md" style={{ background:"rgba(255,255,255,0.05)", backdropFilter:"blur(10px)" }}>
              <svg width="10" height="10" fill="none" stroke={p.mic ? "#22c55e" : "#ef4444"} strokeWidth="2" viewBox="0 0 24 24">
                {p.mic
                  ? <><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></>
                  : <><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6"/></>
                }
              </svg>
              <span className="text-white text-[10px]">{p.name.split(" ")[0]}</span>
            </div>
          </div>
        ))}

        {/* Remote WebRTC streams */}
        {remoteEntries.map(([socketId, stream]) => (
          <div key={socketId} className="rounded-2xl overflow-hidden relative flex-shrink-0" style={{ width: 160, height: 110 }}>
            <video autoPlay playsInline className="w-full h-full object-cover" ref={el => { if (el && stream) el.srcObject = stream; }} />
            <span className="absolute bottom-1.5 left-1.5 text-white text-[10px] px-1.5 py-0.5 rounded-md" style={{ background:"rgba(0,0,0,0.5)" }}>{socketId.slice(0,6)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
