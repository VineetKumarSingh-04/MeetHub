export default function MeetingControls({ muted, videoOff, screenOn, showChat, showSidebar, onToggleMute, onToggleVideo, onToggleScreen, onToggleChat, onToggleSidebar, onLeave }) {
  return (
    <div className="relative z-20 flex items-center justify-center gap-3 px-4 py-3" style={{ background:"rgba(255,255,255,0.05)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
      <CtrlBtn onClick={onToggleMute} active={muted} danger={muted} title="Toggle Microphone">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          {muted
            ? <><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6"/><path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>
            : <><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>
          }
        </svg>
      </CtrlBtn>

      <CtrlBtn onClick={onToggleVideo} active={videoOff} danger={videoOff} title="Toggle Camera">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          {videoOff
            ? <><line x1="1" y1="1" x2="23" y2="23"/><path d="M21 21H3a2 2 0 01-2-2V8a2 2 0 012-2h3m3-3h6l2 3h4a2 2 0 012 2v9.34m-7.72-2.06a4 4 0 11-5.56-5.56"/></>
            : <><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></>
          }
        </svg>
      </CtrlBtn>

      <CtrlBtn onClick={onToggleScreen} active={screenOn} accent={screenOn} title="Share Screen">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          {screenOn
            ? <><path d="M13 3H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2v-3"/><path d="M8 21h8"/><path d="M12 17v4"/><polyline points="17 8 22 3"/><polyline points="17 3 22 3 22 8"/></>
            : <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>
          }
        </svg>
      </CtrlBtn>

      <CtrlBtn onClick={onToggleChat} active={showChat} title="Toggle Chat" className="lg:flex hidden">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      </CtrlBtn>

      <CtrlBtn onClick={onToggleSidebar} active={showSidebar} title="Toggle People" className="lg:flex hidden">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
      </CtrlBtn>

      <div className="w-px h-8 mx-1" style={{ background:"rgba(255,255,255,0.1)" }} />

      <button onClick={onLeave} title="Leave Meeting"
        className="flex items-center gap-2 px-5 py-3.5 rounded-2xl text-white font-medium text-sm transition-all hover:opacity-90"
        style={{ background:"#ef4444" }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 25px rgba(239,68,68,0.5)"}
        onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7 2 2 0 011.72 2v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.42 19.42 0 013.43 9.37"/>
          <line x1="23" y1="1" x2="1" y2="23"/>
        </svg>
        <span className="hidden sm:inline">Leave</span>
      </button>
    </div>
  );
}

function CtrlBtn({ onClick, danger, accent, active, title, children, className = "" }) {
  let bg = "rgba(255,255,255,0.05)";
  let border = "rgba(255,255,255,0.08)";
  let color = "#fff";
  if (danger)  { bg = "rgba(239,68,68,0.25)";   border = "rgba(239,68,68,0.4)";   color = "#ef4444"; }
  if (accent)  { bg = "rgba(124,58,237,0.3)";    border = "rgba(124,58,237,0.5)";  color = "#a78bfa"; }
  if (active && !danger && !accent) { bg = "rgba(99,102,241,0.2)"; border = "rgba(99,102,241,0.4)"; }

  return (
    <button onClick={onClick} title={title}
      className={`flex items-center justify-center p-3.5 rounded-2xl transition-all hover:scale-110 active:scale-95 ${className}`}
      style={{ background: bg, border: `1px solid ${border}`, color }}>
      {children}
    </button>
  );
}
