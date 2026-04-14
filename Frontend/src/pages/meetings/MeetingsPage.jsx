import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../asset/logo.png";

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .mp-root * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.3); border-radius: 4px; }

  .mp-glass       { background: rgba(17,24,39,0.65); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.07); }
  .mp-glass-strong{ background: rgba(17,24,39,0.8);  backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.1); }

  .mp-sidebar-item { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
  .mp-sidebar-item:hover { background: rgba(124,58,237,0.15); }
  .mp-sidebar-item.active {
    background: linear-gradient(135deg,rgba(124,58,237,0.3),rgba(37,99,235,0.2));
    box-shadow: 0 0 15px rgba(124,58,237,0.2);
  }

  .mp-input-field {
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; padding: 10px 14px; color:#fff; font-size:13px; width:100%;
    transition: all 0.2s; outline:none; font-family:'Plus Jakarta Sans',sans-serif;
  }
  .mp-input-field:focus { border-color:rgba(124,58,237,0.5); box-shadow:0 0 0 3px rgba(124,58,237,0.1); }
  .mp-input-field::placeholder { color:rgba(156,163,175,0.6); }

  .mp-notif-badge { position:absolute; top:-2px; right:-2px; width:8px; height:8px; background:#ef4444; border-radius:50%; border:2px solid #0b0f2c; }

  .mp-card-hover { transition: all 0.3s ease; }
  .mp-card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }

  .mp-btn-primary  { background: linear-gradient(135deg,#6D28D9,#9333EA); transition: all 0.3s; }
  .mp-btn-primary:hover  { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(139,92,246,0.4); }
  .mp-btn-secondary{ background: linear-gradient(135deg,#4F46E5,#7C3AED); transition: all 0.3s; }
  .mp-btn-secondary:hover{ transform: translateY(-2px); box-shadow: 0 6px 20px rgba(79,70,229,0.3); }

  @keyframes mp-fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .mp-fade-1 { animation: mp-fadeUp 0.5s 0.1s ease forwards; opacity:0; }
  .mp-fade-2 { animation: mp-fadeUp 0.5s 0.2s ease forwards; opacity:0; }
  .mp-fade-3 { animation: mp-fadeUp 0.5s 0.3s ease forwards; opacity:0; }

  @keyframes mp-slideLeft { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
  .mp-slide-1 { animation: mp-slideLeft 0.6s 0.1s ease forwards; opacity:0; }
  .mp-slide-2 { animation: mp-slideLeft 0.6s 0.2s ease forwards; opacity:0; }
  .mp-slide-3 { animation: mp-slideLeft 0.6s 0.3s ease forwards; opacity:0; }
  .mp-slide-4 { animation: mp-slideLeft 0.6s 0.4s ease forwards; opacity:0; }
  .mp-slide-5 { animation: mp-slideLeft 0.6s 0.5s ease forwards; opacity:0; }
  .mp-slide-6 { animation: mp-slideLeft 0.6s 0.6s ease forwards; opacity:0; }

  @keyframes mp-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  .mp-pulse { animation: mp-pulse 2s infinite; }

  .mp-scrollbar-hide::-webkit-scrollbar { display:none; }
  .mp-scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }

  .mp-friend-row { transition: background 0.2s; border-radius: 12px; }
  .mp-friend-row:hover { background: rgba(255,255,255,0.05); }
  .mp-friend-row .mp-invite-btn { opacity: 0; transition: opacity 0.2s; }
  .mp-friend-row:hover .mp-invite-btn { opacity: 1; }

  .mp-toast {
    position:fixed; bottom:24px; left:50%; transform:translateX(-50%) translateY(20px);
    opacity:0; transition:all 0.3s; pointer-events:none; z-index:9999;
  }
  .mp-toast.show { opacity:1; transform:translateX(-50%) translateY(0); pointer-events:auto; }
`;

// ── Nav items (same as Dashboard) ─────────────────────────────────────────────
const NAV_ITEMS = [
  { id:"dashboard", label:"Dashboard", icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { id:"meetings",  label:"Meetings",  icon:"M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
  { id:"calendar",  label:"Calendar",  icon:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id:"messages",  label:"Messages",  icon:"M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", badge:"3" },
  { id:"analytics", label:"Analytics", icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { id:"settings",  label:"Settings",  icon:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

const FRIENDS = [
  { name:"Sarah Chen",  initials:"SC", color:"from-rose-500 to-pink-500",     online:true  },
  { name:"Alex Rivera", initials:"AR", color:"from-blue-500 to-cyan-500",     online:true  },
  { name:"Jordan Lee",  initials:"JL", color:"from-emerald-500 to-teal-500",  online:true  },
  { name:"Maya Patel",  initials:"MP", color:"from-amber-500 to-orange-500",  online:false },
  { name:"Chris Wong",  initials:"CW", color:"from-violet-500 to-purple-500", online:true  },
  { name:"Tara Kim",    initials:"TK", color:"from-fuchsia-500 to-pink-400",  online:true  },
];

const MEETINGS = [
  { id:"1", title:"Design Sprint Review", time:"Today, 2:00 PM",     status:"live",  attendees:4 },
  { id:"2", title:"Product Standup",      time:"Today, 10:00 AM",    status:"ended", attendees:6 },
  { id:"3", title:"Client Presentation",  time:"Yesterday, 3:30 PM", status:"ended", attendees:8 },
];

// ── Icon ──────────────────────────────────────────────────────────────────────
function Icon({ d, size = 18, color, className = "" }) {
  return (
    <svg width={size} height={size} fill="none" stroke={color || "currentColor"} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className={className}>
      <path d={d} />
    </svg>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg }) {
  return (
    <div className={`mp-toast mp-glass-strong rounded-xl px-5 py-3 text-sm font-medium ${msg ? "show" : ""}`}>
      {msg}
    </div>
  );
}

// ── Sidebar (identical to Dashboard) ─────────────────────────────────────────
function Sidebar({ collapsed, setCollapsed, activeNav, setActiveNav }) {
  const navigate = useNavigate();
  const handleNav = (id) => {
    setActiveNav(id);
    if (id === "dashboard") navigate("/dashboard");
    if (id === "meetings")  navigate("/meetings");
    if (id === "settings")  navigate("/settings");
    if (id === "messages")  navigate("/dashboard");
  };
  return (
    <aside className="mp-glass-strong flex flex-col h-full relative z-30 transition-all duration-300"
      style={{ width: collapsed ? 64 : 220, minWidth: collapsed ? 64 : 220 }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
        <img src={logo} alt="MeetHub" style={{ height:32, flexShrink:0 }} />
        {!collapsed && (
          <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:16, fontWeight:700, background:"linear-gradient(135deg,#818cf8,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", whiteSpace:"nowrap" }}>
            MeetHub
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item, i) => (
          <button key={item.id} onClick={() => handleNav(item.id)}
            className={`mp-sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mp-slide-${i+1} ${activeNav === item.id ? "active text-white" : "text-gray-400"}`}>
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

      {/* Collapse toggle */}
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
function Topbar({ user, onLogout, showToastMsg }) {
  const navigate = useNavigate();
  const [search, setSearch]       = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showQuick, setShowQuick]   = useState(false);
  const [showNotif, setShowNotif]   = useState(false);

  const QUICK_ACTIONS = [
    { label:"New Meeting",  icon:"M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", color:"#a78bfa", msg:"🎥 Starting new meeting...", action:() => navigate("/create-meeting") },
    { label:"Join Meeting", icon:"M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1", color:"#60a5fa", msg:"🔗 Paste your meeting link", action:() => navigate("/join-meeting") },
    { label:"Schedule",     icon:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color:"#34d399", msg:"📅 Opening scheduler...", action:() => navigate("/create-meeting") },
    { label:"Share Screen", icon:"M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color:"#fbbf24", msg:"🖥 Screen share ready", action:() => showToastMsg("🖥 Screen share ready") },
  ];

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-white/5 flex-shrink-0"
      style={{ background:"rgba(11,15,44,0.8)" }}>
      <div className="flex items-center gap-4 flex-1">
        {/* Search */}
        <div className="relative w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
            <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size={16} color="#9ca3af" />
          </span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            onFocus={() => setShowSearch(true)} onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            placeholder="Search meetings, people..." className="mp-input-field pl-11 py-2 text-sm"
            style={{ background:"rgba(255,255,255,0.04)" }} />
          {showSearch && (
            <div className="absolute top-full left-0 right-0 mt-1 mp-glass-strong rounded-xl overflow-hidden z-50">
              <div className="p-3 text-xs text-gray-500 border-b border-white/5">Recent</div>
              {["Design Review","Sprint Planning"].map(r => (
                <button key={r} className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition flex items-center gap-2">
                  <Icon d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size={14} color="#9ca3af" />
                  {r}
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
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
            style={{ background:"linear-gradient(135deg,#7c3aed,#2563eb)" }}>
            <Icon d="M13 10V3L4 14h7v7l9-11h-7z" size={15} />
            <span className="hidden sm:inline">Quick Action</span>
            <Icon d="M19 9l-7 7-7-7" size={14} />
          </button>
          {showQuick && (
            <div className="absolute right-0 top-full mt-2 mp-glass-strong rounded-xl w-48 overflow-hidden z-50">
              {QUICK_ACTIONS.map(q => (
                <button key={q.label} onClick={() => { q.action(); showToastMsg(q.msg); setShowQuick(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 flex items-center gap-2 transition">
                  <Icon d={q.icon} size={15} color={q.color} />
                  {q.label}
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
            <span className="mp-notif-badge" />
          </button>
          {showNotif && (
            <div className="absolute right-0 top-full mt-2 mp-glass-strong rounded-xl w-72 overflow-hidden z-50">
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

// ── Meeting Link Card ─────────────────────────────────────────────────────────
function MeetingLinkCard({ navigate }) {
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const id = Math.random().toString(36).substring(2, 10);
    setLink(`https://meet.app/room/${id}`);
  };

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  return (
    <section className="mp-glass rounded-2xl p-5 lg:p-6 mp-card-hover mp-fade-1">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background:"rgba(124,58,237,0.2)" }}>
          <Icon d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" color="#a78bfa" size={16} />
        </div>
        <h2 className="text-base font-semibold">Meeting Link</h2>
      </div>
      <div className="space-y-4">
        <input type="text" value={link} onChange={e => setLink(e.target.value)}
          placeholder="Enter or generate meeting link..."
          className="mp-input-field" />
        <div className="flex gap-3">
          <button onClick={generate}
            className="mp-btn-primary text-white text-sm font-medium px-5 py-2.5 rounded-xl flex items-center gap-2">
            <Icon d="M13 10V3L4 14h7v7l9-11h-7z" size={15} color="white" />
            Generate Link
          </button>
          <button onClick={copy}
            className="mp-btn-secondary text-white text-sm font-medium px-5 py-2.5 rounded-xl flex items-center gap-2">
            <Icon d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" size={15} color="white" />
            Copy
          </button>
        </div>
        {copied && (
          <div className="flex items-center gap-1 text-xs text-green-400">
            <Icon d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" size={13} color="#4ade80" />
            Copied to clipboard!
          </div>
        )}
        <div className="flex gap-2 pt-1">
          <button onClick={() => navigate("/create-meeting")}
            className="flex-1 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition"
            style={{ background:"rgba(255,255,255,0.05)" }}>
            + New Meeting
          </button>
          <button onClick={() => navigate("/join-meeting")}
            className="flex-1 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition"
            style={{ background:"rgba(255,255,255,0.05)" }}>
            Join Meeting
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Friends Card ──────────────────────────────────────────────────────────────
function FriendsCard() {
  const onlineCount = FRIENDS.filter(f => f.online).length;
  return (
    <section className="mp-glass rounded-2xl p-5 lg:p-6 mp-card-hover mp-fade-2">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background:"rgba(124,58,237,0.2)" }}>
            <Icon d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" color="#a78bfa" size={16} />
          </div>
          <h2 className="text-base font-semibold">Friends</h2>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full text-gray-500" style={{ background:"rgba(255,255,255,0.05)" }}>
          {onlineCount} online
        </span>
      </div>
      <ul className="space-y-1 max-h-64 overflow-auto mp-scrollbar-hide">
        {FRIENDS.map((f, i) => (
          <li key={i} className="mp-friend-row flex items-center justify-between p-2.5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${f.color} flex items-center justify-center text-white text-xs font-semibold`}>
                  {f.initials}
                </div>
                {f.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2"
                    style={{ borderColor:"#111827" }} />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{f.name}</p>
                <p className="text-xs text-gray-500">{f.online ? "Online" : "Offline"}</p>
              </div>
            </div>
            <button className="mp-invite-btn mp-btn-primary text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1">
              <Icon d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" size={12} color="white" />
              Invite
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── Recent Meetings Card ──────────────────────────────────────────────────────
function RecentMeetingsCard({ navigate }) {
  return (
    <section className="mp-glass rounded-2xl p-5 lg:p-6 mp-card-hover mp-fade-3">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background:"rgba(124,58,237,0.2)" }}>
            <Icon d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" color="#a78bfa" size={16} />
          </div>
          <h2 className="text-base font-semibold">Recent Meetings</h2>
        </div>
        <button className="text-xs text-purple-400 hover:text-purple-300 transition"
          onClick={() => navigate("/meetings/history")}>
          View All
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {MEETINGS.map(m => (
          <div key={m.id} onClick={() => navigate(`/meetings/${m.id}`)}
            className="rounded-xl p-4 cursor-pointer transition-colors"
            style={{ background:"rgba(255,255,255,0.05)" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${m.status === "live" ? "bg-green-400 mp-pulse" : "bg-gray-500"}`} />
              <span className={`text-xs ${m.status === "live" ? "text-green-400" : "text-gray-500"}`}>
                {m.status === "live" ? "Live" : "Ended"}
              </span>
            </div>
            <h3 className="text-sm font-semibold mb-1">{m.title}</h3>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Icon d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size={12} color="#9ca3af" />
              {m.time}
            </p>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Icon d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" size={12} color="#6b7280" />
              {m.attendees} attendees
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MeetingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("meetings");
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  const showToastMsg = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2500);
  };

  const handleLogout = async () => { await logout(); navigate("/"); };

  return (
    <>
      <style>{CSS}</style>
      <div className="mp-root flex h-screen w-full overflow-hidden" style={{ background:"#0b0f2c", color:"#fff" }}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} activeNav={activeNav} setActiveNav={setActiveNav} />

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Topbar user={user} onLogout={handleLogout} showToastMsg={showToastMsg} />

          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Header */}
            <div className="mp-fade-1">
              <h1 className="text-xl font-bold">Meeting Dashboard</h1>
              <p className="text-sm text-gray-400 mt-1">Manage your meetings and connect with friends</p>
            </div>

            {/* Top 2-col grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
              <MeetingLinkCard navigate={navigate} />
              <FriendsCard />
            </div>

            {/* Recent Meetings */}
            <RecentMeetingsCard navigate={navigate} />
          </main>
        </div>

        <Toast msg={toast} />
      </div>
    </>
  );
}
