import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../asset/logo.png";

// ── CSS ───────────────────────────────────────────────────────────────────────
export const LAYOUT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .al-root * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.3); border-radius: 4px; }

  .al-glass       { background: rgba(17,24,39,0.65); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.07); }
  .al-glass-strong{ background: rgba(17,24,39,0.8);  backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.1); }

  .al-sidebar-item { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
  .al-sidebar-item:hover { background: rgba(124,58,237,0.15); }
  .al-sidebar-item.active {
    background: linear-gradient(135deg,rgba(124,58,237,0.3),rgba(37,99,235,0.2));
    box-shadow: 0 0 15px rgba(124,58,237,0.2);
  }

  .al-input-search {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; padding: 10px 14px 10px 40px; color:#fff; font-size:13px; width:100%;
    transition: all 0.2s; outline:none; font-family:'Plus Jakarta Sans',sans-serif;
  }
  .al-input-search:focus { border-color:rgba(124,58,237,0.5); box-shadow:0 0 0 3px rgba(124,58,237,0.1); }
  .al-input-search::placeholder { color:rgba(156,163,175,0.6); }

  .al-notif-badge { position:absolute; top:-2px; right:-2px; width:8px; height:8px; background:#ef4444; border-radius:50%; border:2px solid #0b0f2c; }

  @keyframes al-slideLeft { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
  .al-s1{animation:al-slideLeft 0.6s 0.1s ease forwards;opacity:0}
  .al-s2{animation:al-slideLeft 0.6s 0.2s ease forwards;opacity:0}
  .al-s3{animation:al-slideLeft 0.6s 0.3s ease forwards;opacity:0}
  .al-s4{animation:al-slideLeft 0.6s 0.4s ease forwards;opacity:0}
`;

const NAV_ITEMS = [
  { id:"dashboard", label:"Dashboard", icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { id:"meetings",  label:"Meetings",  icon:"M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
  { id:"messages",  label:"Messages",  icon:"M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", badge:"3" },
  { id:"settings",  label:"Settings",  icon:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

function Icon({ d, size = 18, color, className = "" }) {
  return (
    <svg width={size} height={size} fill="none" stroke={color || "currentColor"} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className={className}>
      <path d={d} />
    </svg>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ collapsed, setCollapsed, activeNav }) {
  const navigate = useNavigate();
  const handleNav = (id) => {
    if (id === "dashboard") navigate("/dashboard");
    if (id === "meetings")  navigate("/meetings");
    if (id === "messages")  navigate("/messages");
    if (id === "settings")  navigate("/settings");
  };
  return (
    <aside className="al-glass-strong flex flex-col h-full relative z-30 transition-all duration-300"
      style={{ width: collapsed ? 64 : 220, minWidth: collapsed ? 64 : 220 }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
        <img src={logo} alt="MeetHub" style={{ height:32, flexShrink:0 }} />
        {!collapsed && (
          <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:16, fontWeight:700, background:"linear-gradient(135deg,#818cf8,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", whiteSpace:"nowrap" }}>
            MeetHub
          </span>
        )}
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item, i) => (
          <button key={item.id} onClick={() => handleNav(item.id)}
            className={`al-sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium al-s${i+1} ${activeNav === item.id ? "active text-white" : "text-gray-400"}`}>
            <div className="relative flex-shrink-0">
              <Icon d={item.icon} size={18} />
              {collapsed && item.badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-[9px] flex items-center justify-center text-white">{item.badge}</span>
              )}
            </div>
            {!collapsed && <span>{item.label}</span>}
            {!collapsed && item.badge && (
              <span className="ml-auto bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="px-3 py-3 border-t border-white/5">
        <button onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <Icon d={collapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} size={18} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

// ── Topbar ────────────────────────────────────────────────────────────────────
function Topbar({ user, onLogout }) {
  const navigate = useNavigate();
  const [search, setSearch]         = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showQuick, setShowQuick]   = useState(false);
  const [showNotif, setShowNotif]   = useState(false);

  const QUICK_ACTIONS = [
    { label:"New Meeting",  icon:"M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", color:"#a78bfa", action:() => navigate("/create-meeting") },
    { label:"Join Meeting", icon:"M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1", color:"#60a5fa", action:() => navigate("/join-meeting") },
    { label:"Schedule",     icon:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color:"#34d399", action:() => navigate("/create-meeting") },
    { label:"Share Screen", icon:"M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color:"#fbbf24", action:() => {} },
  ];

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-white/5 flex-shrink-0"
      style={{ background:"rgba(11,15,44,0.8)" }}>
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
            <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size={16} color="#9ca3af" />
          </span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            onFocus={() => setShowSearch(true)} onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            placeholder="Search meetings, people..." className="al-input-search" />
          {showSearch && (
            <div className="absolute top-full left-0 right-0 mt-1 al-glass-strong rounded-xl overflow-hidden z-50">
              <div className="p-3 text-xs text-gray-500 border-b border-white/5">Recent</div>
              {["Design Review","Sprint Planning"].map(r => (
                <button key={r} className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition flex items-center gap-2">
                  <Icon d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size={14} color="#9ca3af" />{r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Actions */}
        <div className="relative">
          <button onClick={() => { setShowQuick(q => !q); setShowNotif(false); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-all"
            style={{ background:"linear-gradient(135deg,#7c3aed,#2563eb)" }}>
            <Icon d="M13 10V3L4 14h7v7l9-11h-7z" size={15} />
            <span className="hidden sm:inline">Quick Action</span>
            <Icon d="M19 9l-7 7-7-7" size={14} />
          </button>
          {showQuick && (
            <div className="absolute right-0 top-full mt-2 al-glass-strong rounded-xl w-48 overflow-hidden z-50">
              {QUICK_ACTIONS.map(q => (
                <button key={q.label} onClick={() => { q.action(); setShowQuick(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 flex items-center gap-2 transition">
                  <Icon d={q.icon} size={15} color={q.color} />{q.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => { setShowNotif(n => !n); setShowQuick(false); }}
            className="relative p-2 rounded-xl hover:bg-white/5 transition">
            <Icon d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" size={18} color="#9ca3af" />
            <span className="al-notif-badge" />
          </button>
          {showNotif && (
            <div className="absolute right-0 top-full mt-2 al-glass-strong rounded-xl w-72 overflow-hidden z-50">
              <div className="p-3 font-semibold text-sm border-b border-white/5">Notifications</div>
              {[
                { icon:"M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", bg:"rgba(124,58,237,0.2)", color:"#a78bfa", text:"Design Review starts in 15 min", time:"2 min ago" },
                { icon:"M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z", bg:"rgba(37,99,235,0.2)", color:"#60a5fa", text:"Sarah joined your team", time:"1 hour ago" },
              ].map((n, i) => (
                <div key={i} className="p-3 flex items-start gap-3 hover:bg-white/5 transition cursor-pointer">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background:n.bg }}>
                    <Icon d={n.icon} size={14} color={n.color} />
                  </div>
                  <div><p className="text-xs">{n.text}</p><p className="text-xs text-gray-500 mt-1">{n.time}</p></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2 pl-3 border-l border-white/10">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background:"linear-gradient(135deg,#7c3aed,#2563eb)" }}>
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium">{user?.name || "User"}</p>
            <p className="text-[10px] text-gray-500">Pro Plan</p>
          </div>
          <button onClick={onLogout} className="ml-2 text-[10px] text-gray-500 hover:text-red-400 transition">Logout</button>
        </div>
      </div>
    </header>
  );
}

// ── AppLayout ─────────────────────────────────────────────────────────────────
export default function AppLayout({ children, activeNav = "" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => { await logout(); navigate("/"); };

  return (
    <>
      <style>{LAYOUT_CSS}</style>
      <div className="al-root flex h-screen w-full overflow-hidden" style={{ background:"#0b0f2c", color:"#fff" }}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} activeNav={activeNav} />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Topbar user={user} onLogout={handleLogout} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
