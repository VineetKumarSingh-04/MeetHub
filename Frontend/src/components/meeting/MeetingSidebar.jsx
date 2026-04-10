export default function MeetingSidebar({ participants, tab, onTabChange, displayName }) {
  return (
    <div className="w-80 flex flex-col overflow-hidden hidden lg:flex" style={{ borderLeft:"1px solid rgba(255,255,255,0.06)", background:"rgba(255,255,255,0.08)", backdropFilter:"blur(30px)" }}>
      {/* Tabs */}
      <div className="flex" style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        {["people","settings"].map(t => (
          <button key={t} onClick={() => onTabChange(t)}
            className="flex-1 py-3 text-sm font-medium transition-colors capitalize"
            style={{ color: tab === t ? "#fff" : "#9ca3af", borderBottom: tab === t ? "2px solid #7c3aed" : "2px solid transparent" }}>
            {t === "people"
              ? <><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ display:"inline", verticalAlign:"middle", marginRight:4 }}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>People</>
              : <><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ display:"inline", verticalAlign:"middle", marginRight:4 }}><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>Settings</>
            }
          </button>
        ))}
      </div>

      {/* People */}
      {tab === "people" && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ scrollbarWidth:"thin" }}>
          {participants.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: p.color }}>{p.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{p.name}</div>
                <div className="text-gray-400 text-xs">{p.id === "you" ? "You (Host)" : "Participant"}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" fill="none" stroke={p.mic ? "#22c55e" : "#ef4444"} strokeWidth="2" viewBox="0 0 24 24">
                  {p.mic
                    ? <><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></>
                    : <><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6"/></>
                  }
                </svg>
                <svg width="14" height="14" fill="none" stroke={p.cam ? "#22c55e" : "#ef4444"} strokeWidth="2" viewBox="0 0 24 24">
                  {p.cam
                    ? <><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></>
                    : <><line x1="1" y1="1" x2="23" y2="23"/><path d="M21 21H3a2 2 0 01-2-2V8a2 2 0 012-2h3m3-3h6l2 3h4a2 2 0 012 2v9.34m-7.72-2.06a4 4 0 11-5.56-5.56"/></>
                  }
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings */}
      {tab === "settings" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="text-white text-xs font-semibold uppercase tracking-wider block mb-2">Display Name</label>
            <input type="text" defaultValue={displayName} placeholder="Your name"
              className="w-full rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none"
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)" }} />
          </div>
          <div>
            <label className="text-white text-xs font-semibold uppercase tracking-wider block mb-2">Notifications</label>
            <div className="space-y-2">
              {["New messages","User joined"].map(label => (
                <label key={label} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-purple-500" />
                  <span className="text-gray-300 text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
