import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../asset/logo.png";

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .msg-root * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #383e56; border-radius: 10px; }

  .msg-glass-strong { background: rgba(17,24,39,0.8); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.1); }

  .msg-sidebar-item { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
  .msg-sidebar-item:hover { background: rgba(124,58,237,0.15); }
  .msg-sidebar-item.active {
    background: linear-gradient(135deg,rgba(124,58,237,0.3),rgba(37,99,235,0.2));
    box-shadow: 0 0 15px rgba(124,58,237,0.2);
  }

  .chat-item { transition: background 0.2s; border-radius: 12px; cursor: pointer; }
  .chat-item:hover { background: rgba(108,92,231,0.1); }
  .chat-item.active { background: rgba(108,92,231,0.18); border-left: 3px solid #6C5CE7; border-radius: 0 12px 12px 0; }

  .gradient-btn { background: linear-gradient(135deg,#6C5CE7,#8E44AD); }
  .gradient-btn:hover { background: linear-gradient(135deg,#7d6ff0,#9b50b8); }
  .gradient-msg { background: linear-gradient(135deg,#6C5CE7,#8E44AD); }

  @keyframes msg-slideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .msg-in { animation: msg-slideIn 0.3s ease; }

  @keyframes typing { 0%,60%,100%{opacity:.3;transform:translateY(0)} 30%{opacity:1;transform:translateY(-4px)} }
  .dot1{animation:typing 1.2s infinite}
  .dot2{animation:typing 1.2s infinite 0.2s}
  .dot3{animation:typing 1.2s infinite 0.4s}

  @keyframes nav-slideLeft { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
  .nav-slide-1{animation:nav-slideLeft 0.6s 0.1s ease forwards;opacity:0}
  .nav-slide-2{animation:nav-slideLeft 0.6s 0.2s ease forwards;opacity:0}
  .nav-slide-3{animation:nav-slideLeft 0.6s 0.3s ease forwards;opacity:0}
  .nav-slide-4{animation:nav-slideLeft 0.6s 0.4s ease forwards;opacity:0}

  .msg-notif-badge { position:absolute; top:-2px; right:-2px; width:8px; height:8px; background:#ef4444; border-radius:50%; border:2px solid #0b0f2c; }

  .msg-input-dark {
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; padding: 10px 14px; color:#fff; font-size:13px; width:100%;
    transition: all 0.2s; outline:none;
  }
  .msg-input-dark:focus { border-color:rgba(124,58,237,0.5); box-shadow:0 0 0 3px rgba(124,58,237,0.1); }
  .msg-input-dark::placeholder { color:rgba(156,163,175,0.6); }
`;

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id:"dashboard", label:"Dashboard", icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { id:"meetings",  label:"Meetings",  icon:"M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
  { id:"messages",  label:"Messages",  icon:"M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", badge:"3" },
  { id:"settings",  label:"Settings",  icon:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

// ── Mock contacts ─────────────────────────────────────────────────────────────
const INIT_CONTACTS = [
  { id:1, name:"Design Team",  initials:"DT", lastMsg:"Let's finalize the mockups", time:"2m",  unread:3, online:true,  messages:[{from:"other",name:"Alex",  text:"Hey team, how's the progress on the dashboard?", time:"10:30 AM"},{from:"other",name:"Sara",  text:"Almost done with the components!",              time:"10:32 AM"},{from:"me",              text:"Looking great so far. Let's finalize the mockups", time:"10:35 AM"}] },
  { id:2, name:"Sarah Chen",   initials:"SC", lastMsg:"Sounds good, see you then!", time:"15m", unread:0, online:true,  messages:[{from:"me",              text:"Hey Sarah, are you free for coffee at 3?",        time:"9:45 AM"}, {from:"other",name:"Sarah", text:"Sounds good, see you then!",                    time:"9:47 AM"}] },
  { id:3, name:"Mike Ross",    initials:"MR", lastMsg:"The deploy went smooth 🚀",  time:"1h",  unread:1, online:false, messages:[{from:"other",name:"Mike",  text:"Just pushed the latest changes",                 time:"8:15 AM"}, {from:"me",              text:"Nice! Let me review the PR",                      time:"8:20 AM"}, {from:"other",name:"Mike",  text:"The deploy went smooth 🚀",                    time:"8:45 AM"}] },
  { id:4, name:"Emily Park",   initials:"EP", lastMsg:"Thanks for the feedback!",   time:"3h",  unread:0, online:true,  messages:[{from:"me",              text:"Your portfolio looks amazing Emily",              time:"7:00 AM"}, {from:"other",name:"Emily", text:"Thanks for the feedback!",                     time:"7:10 AM"}] },
  { id:5, name:"Dev Guild",    initials:"DG", lastMsg:"Meeting at 4pm today",       time:"5h",  unread:5, online:true,  messages:[{from:"other",name:"Jordan",text:"Meeting at 4pm today",                           time:"6:30 AM"}] },
];

const REPLIES = ["Got it! 👍","Sounds great!","Let me check on that","Sure thing!","Interesting, tell me more","On it! 🚀","Perfect 😊"];

// ── Icon ──────────────────────────────────────────────────────────────────────
function Icon({ d, size = 18, color, className = "" }) {
  return (
    <svg width={size} height={size} fill="none" stroke={color || "currentColor"} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className={className}>
      <path d={d} />
    </svg>
  );
}

// ── App Sidebar (nav) ─────────────────────────────────────────────────────────
function AppSidebar({ collapsed, setCollapsed, activeNav, setActiveNav }) {
  const navigate = useNavigate();
  const handleNav = (id) => {
    setActiveNav(id);
    if (id === "dashboard") navigate("/dashboard");
    if (id === "meetings")  navigate("/meetings");
    if (id === "messages")  navigate("/messages");
    if (id === "settings")  navigate("/settings");
  };
  return (
    <aside className="msg-glass-strong flex flex-col h-full relative z-30 transition-all duration-300"
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
            className={`msg-sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium nav-slide-${i+1} ${activeNav === item.id ? "active text-white" : "text-gray-400"}`}>
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
            placeholder="Search meetings, people..." className="msg-input-dark pl-11 py-2 text-sm"
            style={{ background:"rgba(255,255,255,0.04)" }} />
          {showSearch && (
            <div className="absolute top-full left-0 right-0 mt-1 msg-glass-strong rounded-xl overflow-hidden z-50">
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
        <div className="relative">
          <button onClick={() => { setShowQuick(q => !q); setShowNotif(false); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-all"
            style={{ background:"linear-gradient(135deg,#7c3aed,#2563eb)" }}>
            <Icon d="M13 10V3L4 14h7v7l9-11h-7z" size={15} />
            <span className="hidden sm:inline">Quick Action</span>
            <Icon d="M19 9l-7 7-7-7" size={14} />
          </button>
          {showQuick && (
            <div className="absolute right-0 top-full mt-2 msg-glass-strong rounded-xl w-48 overflow-hidden z-50">
              {QUICK_ACTIONS.map(q => (
                <button key={q.label} onClick={() => { q.action(); setShowQuick(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 flex items-center gap-2 transition">
                  <Icon d={q.icon} size={15} color={q.color} />{q.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <button onClick={() => { setShowNotif(n => !n); setShowQuick(false); }}
            className="relative p-2 rounded-xl hover:bg-white/5 transition">
            <Icon d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" size={18} color="#9ca3af" />
            <span className="msg-notif-badge" />
          </button>
          {showNotif && (
            <div className="absolute right-0 top-full mt-2 msg-glass-strong rounded-xl w-72 overflow-hidden z-50">
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

// ── Chat Sidebar ──────────────────────────────────────────────────────────────
function ChatSidebar({ contacts, activeId, onOpen, onAddContact }) {
  const [search, setSearch]       = useState("");
  const [showAdd, setShowAdd]     = useState(false);
  const [newName, setNewName]     = useState("");

  const filtered = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddContact(newName.trim());
    setNewName("");
    setShowAdd(false);
  };

  return (
    <aside className="flex flex-col h-full border-r border-[#2d3450]" style={{ width:300, minWidth:300, background:"#21273c" }}>
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-[#2d3450]">
        <h2 className="text-lg font-bold tracking-tight">Messages</h2>
        <button onClick={() => { setShowAdd(s => !s); setTimeout(() => document.getElementById("msg-new-name")?.focus(), 50); }}
          className="gradient-btn p-2 rounded-xl transition-all">
          <Icon d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" size={18} color="white" />
        </button>
      </div>

      {/* Add contact */}
      {showAdd && (
        <div className="px-4 py-3 border-b border-[#2d3450]" style={{ background:"#1c2236" }}>
          <p className="text-xs text-[#a0a7c4] mb-2 font-medium">Add a new contact</p>
          <form onSubmit={handleAdd} className="flex gap-2">
            <input id="msg-new-name" value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="Name"
              className="flex-1 rounded-lg px-3 py-2 text-sm outline-none text-white placeholder-[#6b7194]"
              style={{ background:"#2d3450" }} />
            <button type="submit" className="gradient-btn px-3 py-2 rounded-lg text-sm font-medium text-white">Add</button>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="px-4 py-3">
        <div className="flex items-center rounded-xl px-3 py-2.5 gap-2" style={{ background:"#2d3450" }}>
          <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size={16} color="#6b7194" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="bg-transparent outline-none text-sm flex-1 text-white placeholder-[#6b7194]" />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {filtered.map(c => (
          <div key={c.id} onClick={() => onOpen(c.id)}
            className={`chat-item flex items-center gap-3 px-3 py-3 ${activeId === c.id ? "active" : ""}`}>
            <div className="relative flex-shrink-0">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold ${activeId === c.id ? "gradient-btn" : ""}`}
                style={activeId !== c.id ? { background:"#2d3450" } : {}}>
                {c.initials}
              </div>
              {c.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00C853] rounded-full border-2" style={{ borderColor:"#21273c" }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-sm truncate">{c.name}</p>
                <span className="text-[11px] text-[#6b7194] flex-shrink-0">{c.time}</span>
              </div>
              <p className="text-xs text-[#a0a7c4] truncate mt-0.5">{c.lastMsg}</p>
            </div>
            {c.unread > 0 && (
              <span className="gradient-btn text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white">
                {c.unread}
              </span>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

// ── Chat Area ─────────────────────────────────────────────────────────────────
function ChatArea({ contact, onSend, typing }) {
  const bottomRef = useRef(null);
  const [input, setInput] = useState("");

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [contact?.messages?.length, typing]);

  if (!contact) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6" style={{ background:"#191e31" }}>
        <div className="w-20 h-20 rounded-full gradient-btn flex items-center justify-center mb-5 opacity-60">
          <Icon d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" size={36} color="white" />
        </div>
        <p className="text-[#a0a7c4] text-lg font-medium">Select a conversation to start chatting</p>
        <p className="text-[#6b7194] text-sm mt-1">Your messages will appear here</p>
      </div>
    );
  }

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col h-full min-w-0" style={{ background:"#191e31" }}>
      {/* Header */}
      <header className="px-6 py-4 border-b border-[#2d3450] flex items-center justify-between flex-shrink-0" style={{ background:"#1c2236" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-btn flex items-center justify-center text-sm font-bold flex-shrink-0">
            {contact.initials}
          </div>
          <div>
            <p className="font-semibold text-[15px]">{contact.name}</p>
            {contact.online
              ? <p className="text-xs text-[#00C853] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#00C853] inline-block" /> Online</p>
              : <p className="text-xs text-[#6b7194]">Offline</p>
            }
          </div>
        </div>
        <div className="flex gap-1">
          {[
            "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
            "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
            "M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z",
          ].map((d, i) => (
            <button key={i} className="p-2 rounded-lg hover:bg-[#2d3450] transition">
              <Icon d={d} size={18} color="#a0a7c4" />
            </button>
          ))}
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {contact.messages.map((m, i) => (
          m.from === "me" ? (
            <div key={i} className="msg-in flex justify-end">
              <div className="gradient-msg rounded-2xl rounded-br-md px-4 py-2.5 max-w-[70%]">
                <p className="text-sm">{m.text}</p>
                <p className="text-[10px] text-white/60 text-right mt-1">{m.time}</p>
              </div>
            </div>
          ) : (
            <div key={i} className="msg-in flex items-end gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{ background:"#2d3450" }}>
                {(m.name || "").charAt(0)}
              </div>
              <div className="rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[70%]" style={{ background:"#2d3450" }}>
                <p className="text-[11px] font-medium mb-0.5" style={{ color:"#6C5CE7" }}>{m.name}</p>
                <p className="text-sm">{m.text}</p>
                <p className="text-[10px] text-[#6b7194] mt-1">{m.time}</p>
              </div>
            </div>
          )
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex items-center gap-1.5 px-1">
            <span className="dot1 w-1.5 h-1.5 rounded-full bg-[#a0a7c4] inline-block" />
            <span className="dot2 w-1.5 h-1.5 rounded-full bg-[#a0a7c4] inline-block" />
            <span className="dot3 w-1.5 h-1.5 rounded-full bg-[#a0a7c4] inline-block" />
            <span className="text-xs text-[#a0a7c4] ml-1">{contact.name.split(" ")[0]} is typing</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="px-4 py-3 border-t border-[#2d3450] flex items-center gap-3 flex-shrink-0" style={{ background:"#1c2236" }}>
        <button type="button" className="p-2 rounded-lg hover:bg-[#2d3450] transition flex-shrink-0">
          <Icon d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={20} color="#6b7194" />
        </button>
        <button type="button" className="p-2 rounded-lg hover:bg-[#2d3450] transition flex-shrink-0">
          <Icon d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" size={20} color="#6b7194" />
        </button>
        <input value={input} onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-xl px-4 py-3 text-sm outline-none text-white placeholder-[#6b7194]"
          style={{ background:"#2d3450" }}
          autoComplete="off" />
        <button type="submit" className="gradient-btn p-3 rounded-xl transition-all flex-shrink-0">
          <Icon d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" size={18} color="white" />
        </button>
      </form>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MessagesPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed]   = useState(false);
  const [activeNav, setActiveNav]   = useState("messages");
  const [contacts, setContacts]     = useState(INIT_CONTACTS);
  const [activeId, setActiveId]     = useState(null);
  const [typing, setTyping]         = useState(false);

  const activeContact = contacts.find(c => c.id === activeId) || null;

  const openChat = (id) => {
    setActiveId(id);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const addContact = (name) => {
    const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().substring(0, 2);
    setContacts(prev => [{ id: Date.now(), name, initials, lastMsg:"New conversation", time:"now", unread:0, online:true, messages:[] }, ...prev]);
  };

  const sendMessage = (text) => {
    const now = new Date().toLocaleTimeString([], { hour:"numeric", minute:"2-digit" });
    setContacts(prev => prev.map(c => c.id === activeId
      ? { ...c, messages:[...c.messages, { from:"me", text, time:now }], lastMsg:text, time:"now" }
      : c
    ));
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
      const t2 = new Date().toLocaleTimeString([], { hour:"numeric", minute:"2-digit" });
      const name = contacts.find(c => c.id === activeId)?.name.split(" ")[0] || "";
      setContacts(prev => prev.map(c => c.id === activeId
        ? { ...c, messages:[...c.messages, { from:"other", name, text:reply, time:t2 }], lastMsg:reply, time:"now" }
        : c
      ));
    }, 1500 + Math.random() * 1000);
  };

  const handleLogout = async () => { await logout(); navigate("/"); };

  return (
    <>
      <style>{CSS}</style>
      <div className="msg-root flex h-screen w-full overflow-hidden" style={{ background:"#0b0f2c", color:"#fff" }}>
        {/* App nav sidebar */}
        <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} activeNav={activeNav} setActiveNav={setActiveNav} />

        {/* Right: topbar + chat layout */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Topbar user={user} onLogout={handleLogout} />

          {/* Chat layout */}
          <div className="flex flex-1 overflow-hidden">
            <ChatSidebar contacts={contacts} activeId={activeId} onOpen={openChat} onAddContact={addContact} />
            <ChatArea contact={activeContact} onSend={sendMessage} typing={typing} />
          </div>
        </div>
      </div>
    </>
  );
}
