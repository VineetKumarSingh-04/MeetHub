import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../asset/logo.png";

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .dash-root * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.3); border-radius: 4px; }

  .glass       { background: rgba(17,24,39,0.65); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.07); }
  .glass-strong{ background: rgba(17,24,39,0.8);  backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.1); }

  .sidebar-item { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
  .sidebar-item:hover { background: rgba(124,58,237,0.15); }
  .sidebar-item.active {
    background: linear-gradient(135deg,rgba(124,58,237,0.3),rgba(37,99,235,0.2));
    box-shadow: 0 0 15px rgba(124,58,237,0.2);
  }
  .action-card { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
  .action-card:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 8px 30px rgba(124,58,237,0.2); }

  .cal-day { transition: all 0.2s ease; cursor: pointer; border-radius: 0.75rem; display:flex; align-items:center; justify-content:center; font-size:12px; aspect-ratio:1; position:relative; }
  .cal-day:hover:not(.empty) { background: rgba(124,58,237,0.2); transform: scale(1.1); }
  .cal-day.today { background: linear-gradient(135deg,#7c3aed,#2563eb); font-weight:700; box-shadow:0 0 12px rgba(124,58,237,0.4); }
  .cal-day.selected { background: rgba(167,139,250,0.3); border: 1px solid rgba(167,139,250,0.5); }
  .cal-day.has-meeting::after { content:''; position:absolute; bottom:3px; left:50%; transform:translateX(-50%); width:4px; height:4px; border-radius:50%; background:#a78bfa; }

  .stat-card { transition: all 0.3s ease; }
  .stat-card:hover { transform: translateY(-2px); }

  .chart-bar { transition: height 0.6s cubic-bezier(0.4,0,0.2,1); border-radius: 4px 4px 0 0; position:relative; }
  .chart-bar:hover .bar-tooltip { opacity:1; }
  .bar-tooltip { position:absolute; top:-24px; left:50%; transform:translateX(-50%); font-size:10px; font-weight:700; opacity:0; transition:opacity 0.2s; white-space:nowrap; }

  .notif-badge { position:absolute; top:-2px; right:-2px; width:8px; height:8px; background:#ef4444; border-radius:50%; border:2px solid #0b0f2c; }

  .input-field {
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; padding: 10px 14px; color:#fff; font-size:13px; width:100%;
    transition: all 0.2s; outline:none; font-family:'Plus Jakarta Sans',sans-serif;
  }
  .input-field:focus { border-color:rgba(124,58,237,0.5); box-shadow:0 0 0 3px rgba(124,58,237,0.1); }
  .input-field::placeholder { color:rgba(156,163,175,0.6); }

  @keyframes fadeInUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideInLeft{ from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes scaleIn    { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
  @keyframes bounceIn   { 0%{opacity:0;transform:scale(0.8) translateY(10px)} 60%{opacity:1;transform:scale(1.05)} 100%{transform:scale(1)} }
  @keyframes float      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes pulseGlow  { 0%,100%{box-shadow:0 0 20px rgba(124,58,237,0.3)} 50%{box-shadow:0 0 30px rgba(124,58,237,0.5)} }
  @keyframes shimmer    { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

  .anim-in    { animation: fadeInUp   0.5s ease forwards; }
  .anim-slide { animation: slideInLeft 0.6s ease forwards; }
  .anim-scale { animation: scaleIn    0.4s ease forwards; }
  .anim-bounce{ animation: bounceIn  0.6s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .anim-float { animation: float 3s ease-in-out infinite; }
  .anim-glow  { animation: pulseGlow 3s ease-in-out infinite; }

  .d1{animation-delay:0.1s} .d2{animation-delay:0.2s} .d3{animation-delay:0.3s}
  .d4{animation-delay:0.4s} .d5{animation-delay:0.5s} .d6{animation-delay:0.6s} .d7{animation-delay:0.7s}

  .toast {
    position:fixed; bottom:24px; left:50%; transform:translateX(-50%) translateY(20px);
    opacity:0; transition:all 0.3s; pointer-events:none; z-index:9999;
  }
  .toast.show { opacity:1; transform:translateX(-50%) translateY(0); pointer-events:auto; }

  .meeting-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
`;

// ── Constants ─────────────────────────────────────────────────────────────────
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MEETING_DAYS = [3,7,12,15,18,22,25,28];
const CHART_DATA = [5,8,6,9,7,3,2];
const CHART_DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const UPCOMING = [
  {title:"Design Review",  time:"10:00 AM", type:"online",  color:"#7c3aed", participants:4},
  {title:"Sprint Planning",time:"11:30 AM", type:"online",  color:"#2563eb", participants:8},
  {title:"Client Call",    time:"2:00 PM",  type:"hybrid",  color:"#059669", participants:3},
  {title:"Team Standup",   time:"4:30 PM",  type:"online",  color:"#d97706", participants:6},
];
const NAV_ITEMS = [
  {id:"dashboard", label:"Dashboard", icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},
  {id:"meetings",  label:"Meetings",  icon:"M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"},
  {id:"calendar",  label:"Calendar",  icon:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"},
  {id:"messages",  label:"Messages",  icon:"M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", badge:"3"},
  {id:"analytics", label:"Analytics", icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"},
  {id:"settings",  label:"Settings",  icon:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"},
];

// ── SVG Icon helper ───────────────────────────────────────────────────────────
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
    <div className={`toast glass-strong rounded-xl px-5 py-3 text-sm font-medium ${msg ? "show" : ""}`}>
      {msg}
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ collapsed, setCollapsed, activeNav, setActiveNav }) {
  const navigate = useNavigate();
  const handleNav = (id) => {
    setActiveNav(id);
    if (id === "settings") navigate("/settings");
    if (id === "messages") navigate("/dashboard");
  };
  return (
    <aside className="glass-strong flex flex-col h-full relative z-30 transition-all duration-300"
      style={{ width: collapsed ? 64 : 220, minWidth: collapsed ? 64 : 220 }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
        <img src={logo} alt="MeetHub" style={{ height: 32, flexShrink: 0 }} />
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
            className={`sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium anim-slide d${i+1} ${activeNav === item.id ? "active text-white" : "text-gray-400"}`}>
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

      {/* Collapse */}
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

// ── Calendar ──────────────────────────────────────────────────────────────────
function Calendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(today.getDate());
  const [viewMode, setViewMode] = useState("month");
  const [dayMeetings, setDayMeetings] = useState(null);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prev = () => {
    if (viewMode === "month") { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); }
    else { const d = new Date(year, month, selected - 7); setYear(d.getFullYear()); setMonth(d.getMonth()); setSelected(d.getDate()); }
  };
  const next = () => {
    if (viewMode === "month") { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); }
    else { const d = new Date(year, month, selected + 7); setYear(d.getFullYear()); setMonth(d.getMonth()); setSelected(d.getDate()); }
  };

  const handleDayClick = (d) => {
    setSelected(d);
    if (MEETING_DAYS.includes(d)) {
      setDayMeetings({ day: d, meetings: [{title:"Team Standup",time:"9:00 AM",color:"#7c3aed"},{title:"Project Review",time:"2:00 PM",color:"#2563eb"}] });
    } else {
      setDayMeetings({ day: d, meetings: [] });
    }
  };

  const renderMonthDays = () => {
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} />);
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const isSel = d === selected && !isToday;
      const hasMtg = MEETING_DAYS.includes(d);
      cells.push(
        <button key={d} onClick={() => handleDayClick(d)}
          className={`cal-day ${isToday?"today":""} ${isSel?"selected":""} ${hasMtg?"has-meeting":""}`}>
          {d}
        </button>
      );
    }
    return cells;
  };

  const renderWeekDays = () => {
    const start = new Date(year, month, selected);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({length:7}, (_,i) => {
      const dt = new Date(start); dt.setDate(dt.getDate() + i);
      const d = dt.getDate();
      const isToday = dt.toDateString() === today.toDateString();
      const isSel = d === selected && dt.getMonth() === month;
      const hasMtg = MEETING_DAYS.includes(d);
      return (
        <button key={i} onClick={() => handleDayClick(d)}
          className={`cal-day flex-col gap-1 py-3 ${isToday?"today":""} ${isSel?"selected":""} ${hasMtg?"has-meeting":""}`}
          style={{aspectRatio:"auto"}}>
          <span className="text-lg font-bold">{d}</span>
          <span className="text-[9px] text-gray-500">{MONTHS[dt.getMonth()].slice(0,3)}</span>
        </button>
      );
    });
  };

  return (
    <div className="lg:col-span-3 glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" size={16} color="#60a5fa" />
          {MONTHS[month]} {year}
        </h2>
        <div className="flex items-center gap-1">
          {["month","week"].map(v => (
            <button key={v} onClick={() => setViewMode(v)}
              className="px-3 py-1 rounded-lg text-xs font-medium transition"
              style={viewMode===v ? {background:"rgba(124,58,237,0.2)",color:"#a78bfa"} : {color:"#6b7280"}}>
              {v.charAt(0).toUpperCase()+v.slice(1)}
            </button>
          ))}
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button onClick={prev} className="p-1 rounded-lg hover:bg-white/5 transition"><Icon d="M15 19l-7-7 7-7" size={16} /></button>
          <button onClick={next} className="p-1 rounded-lg hover:bg-white/5 transition"><Icon d="M9 5l7 7-7 7" size={16} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["SUN","MON","TUE","WED","THU","FRI","SAT"].map(d => (
          <div key={d} className="text-center text-[10px] text-gray-500 font-medium py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {viewMode === "month" ? renderMonthDays() : renderWeekDays()}
      </div>

      {dayMeetings && (
        <div className="mt-4 anim-scale">
          <p className="text-xs text-gray-400 mb-2">
            {dayMeetings.meetings.length ? `Meetings on ${MONTHS[month]} ${dayMeetings.day}` : `No meetings on ${MONTHS[month]} ${dayMeetings.day}`}
          </p>
          {dayMeetings.meetings.length === 0
            ? <p className="text-xs text-gray-600 py-2">Free day! 🎉</p>
            : dayMeetings.meetings.map((m,i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition">
                <div className="meeting-dot" style={{background:m.color}} />
                <div><p className="text-xs font-medium">{m.title}</p><p className="text-[10px] text-gray-500">{m.time}</p></div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

// ── Weekly Chart ──────────────────────────────────────────────────────────────
function WeeklyChart() {
  const max = Math.max(...CHART_DATA);
  return (
    <div className="glass rounded-2xl p-5">
      <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
        <Icon d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" size={16} color="#a78bfa" />
        Weekly Meeting Trend
      </h2>
      <div className="flex items-end justify-between gap-2 h-32">
        {CHART_DATA.map((v, i) => {
          const pct = (v / max) * 100;
          const grad = i % 2 === 0
            ? "linear-gradient(180deg,#7c3aed,#2563eb)"
            : "linear-gradient(180deg,#a78bfa,#7c3aed)";
          return (
            <div key={i} className="flex-1 chart-bar group" style={{ height: `${pct}%`, background: grad, minHeight: 8 }}>
              <div className="bar-tooltip">{v}</div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2">
        {CHART_DAYS.map(d => <span key={d} className="text-[10px] text-gray-500">{d}</span>)}
      </div>
    </div>
  );
}

// ── Upcoming Meetings ─────────────────────────────────────────────────────────
function UpcomingMeetings() {
  const COLORS = ["#7c3aed","#2563eb","#059669","#d97706"];
  return (
    <div className="glass rounded-2xl p-5 anim-in d4">
      <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
        <Icon d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size={16} color="#60a5fa" />
        Upcoming Meetings
      </h2>
      <div className="space-y-3">
        {UPCOMING.map((m, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition cursor-pointer">
            <div className="meeting-dot" style={{ background: m.color, width:8, height:8 }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{m.title}</p>
              <p className="text-[10px] text-gray-500">{m.time} · {m.type}</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex" style={{ marginRight: 2 }}>
                {Array.from({ length: Math.min(m.participants, 3) }, (_, j) => (
                  <div key={j} className="w-5 h-5 rounded-full border border-gray-800 flex items-center justify-center text-[8px] font-bold"
                    style={{ background: COLORS[j % 4], marginLeft: j > 0 ? -6 : 0 }}>
                    {String.fromCharCode(65 + j)}
                  </div>
                ))}
              </div>
              {m.participants > 3 && <span className="text-[9px] text-gray-500">+{m.participants - 3}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Scheduler Form ────────────────────────────────────────────────────────────
function SchedulerForm({ showToast }) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ title:"", date: today, time:"", participants:"", type:"online" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({ title:"", date: today, time:"", participants:"", type:"online" });
      setTimeout(() => setSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="lg:col-span-2 glass rounded-2xl p-5">
      <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
        <Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" size={16} color="#a78bfa" />
        Schedule Meeting
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-[11px] text-gray-400 mb-1 block">Meeting Title</label>
          <input value={form.title} onChange={e => setForm({...form, title:e.target.value})}
            placeholder="e.g. Design Review" className="input-field text-sm" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-gray-400 mb-1 block">Date</label>
            <input type="date" value={form.date} onChange={e => setForm({...form, date:e.target.value})} className="input-field text-sm" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 mb-1 block">Time</label>
            <input type="time" value={form.time} onChange={e => setForm({...form, time:e.target.value})} className="input-field text-sm" />
          </div>
        </div>
        <div>
          <label className="text-[11px] text-gray-400 mb-1 block">Participants</label>
          <input value={form.participants} onChange={e => setForm({...form, participants:e.target.value})}
            placeholder="Add emails, comma-separated" className="input-field text-sm" />
        </div>
        <div>
          <label className="text-[11px] text-gray-400 mb-1 block">Type</label>
          <select value={form.type} onChange={e => setForm({...form, type:e.target.value})} className="input-field text-sm">
            <option value="online">🎥 Online</option>
            <option value="offline">🏢 In Person</option>
            <option value="hybrid">🔄 Hybrid</option>
          </select>
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg text-white"
          style={{ background:"linear-gradient(135deg,#7c3aed,#2563eb)", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Scheduling..." : "Schedule Meeting"}
        </button>
        {success && (
          <div className="text-center py-2 text-xs text-emerald-400 flex items-center justify-center gap-1 anim-in">
            <Icon d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" size={14} color="#34d399" />
            Meeting scheduled successfully!
          </div>
        )}
      </form>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [toast, setToast] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [showQuick, setShowQuick] = useState(false);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const toastTimer = useRef(null);

  const showToastMsg = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2500);
  };

  const handleLogout = async () => { await logout(); navigate("/"); };

  const QUICK_ACTIONS = [
    { label:"New Meeting",  icon:"M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", color:"#a78bfa", msg:"🎥 Starting new meeting...", action:() => navigate("/create-meeting") },
    { label:"Join Meeting", icon:"M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1", color:"#60a5fa", msg:"🔗 Paste your meeting link", action:() => navigate("/join-meeting") },
    { label:"Schedule",     icon:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color:"#34d399", msg:"📅 Opening scheduler...", action:() => navigate("/create-meeting") },
    { label:"Share Screen", icon:"M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color:"#fbbf24", msg:"🖥 Screen share ready", action:() => showToastMsg("🖥 Screen share ready") },
  ];

  const ACTION_CARDS = [
    { label:"New Meeting",  sub:"Start instantly", color:"linear-gradient(135deg,#7c3aed,#6d28d9)", icon:"M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", action:() => navigate("/create-meeting") },
    { label:"Join Meeting", sub:"Enter code",       color:"linear-gradient(135deg,#2563eb,#1d4ed8)", icon:"M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1", action:() => navigate("/join-meeting") },
    { label:"Schedule",     sub:"Plan ahead",       color:"linear-gradient(135deg,#059669,#047857)", icon:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", action:() => navigate("/create-meeting") },
    { label:"Share Screen", sub:"Present now",      color:"linear-gradient(135deg,#d97706,#b45309)", icon:"M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", action:() => showToastMsg("🖥 Screen share ready") },
  ];

  const STATS = [
    { val:"128", label:"Total Meetings", sub:"↑ 12% this week", subColor:"#34d399", icon:"M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", iconColor:"#a78bfa", bg:"rgba(124,58,237,0.15)" },
    { val:"64h",  label:"Total Hours",   sub:"↑ 8% this week",  subColor:"#34d399", icon:"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", iconColor:"#60a5fa", bg:"rgba(37,99,235,0.15)" },
    { val:"7",    label:"Upcoming",      sub:"3 today",          subColor:"#fbbf24", icon:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", iconColor:"#34d399", bg:"rgba(5,150,105,0.15)" },
    { val:"92",   label:"Productivity",  sub:null,               subColor:"",        icon:"M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z", iconColor:"#fbbf24", bg:"rgba(217,119,6,0.15)", progress:92 },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="dash-root flex h-screen w-full overflow-hidden" style={{ background:"#0b0f2c", color:"#fff" }}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} activeNav={activeNav} setActiveNav={setActiveNav} />

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Topbar */}
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
                  placeholder="Search meetings, people..." className="input-field pl-10 py-2 text-sm"
                  style={{ background:"rgba(255,255,255,0.04)" }} />
                {showSearch && (
                  <div className="absolute top-full left-0 right-0 mt-1 glass-strong rounded-xl overflow-hidden z-50">
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
                  <div className="absolute right-0 top-full mt-2 glass-strong rounded-xl w-48 overflow-hidden z-50">
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
                  <span className="notif-badge" />
                </button>
                {showNotif && (
                  <div className="absolute right-0 top-full mt-2 glass-strong rounded-xl w-72 overflow-hidden z-50">
                    <div className="p-3 font-semibold text-sm border-b border-white/5">Notifications</div>
                    {[
                      { icon:"M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", bg:"rgba(124,58,237,0.2)", color:"#a78bfa", text:"Design Review starts in 15 min", time:"2 min ago" },
                      { icon:"M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z", bg:"rgba(37,99,235,0.2)", color:"#60a5fa", text:"Sarah joined your team", time:"1 hour ago" },
                    ].map((n,i) => (
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
                <button onClick={handleLogout} className="ml-2 text-[10px] text-gray-500 hover:text-red-400 transition">Logout</button>
              </div>
            </div>
          </header>

          {/* Main */}
          <main className="flex-1 overflow-y-auto p-6 space-y-6" onClick={() => { setShowQuick(false); setShowNotif(false); }}>
            {/* Welcome */}
            <div className="anim-in">
              <h1 className="text-xl font-bold">Welcome back, {user?.name?.split(" ")[0] || "Alex"} 👋</h1>
              <p className="text-sm text-gray-400 mt-1">Here's your meeting overview for today</p>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 anim-in d1">
              {ACTION_CARDS.map((c, i) => (
                <button key={i} onClick={c.action}
                  className={`action-card glass rounded-2xl p-4 text-left anim-scale d${i+1}`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 anim-float" style={{ background:c.color }}>
                    <Icon d={c.icon} size={18} />
                  </div>
                  <p className="text-sm font-semibold">{c.label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{c.sub}</p>
                </button>
              ))}
            </div>

            {/* Scheduler + Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 anim-in d2">
              <SchedulerForm showToast={showToastMsg} />
              <Calendar />
            </div>

            {/* Stats + Chart + Upcoming */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 anim-in d3">
              <div className="lg:col-span-2 space-y-4">
                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {STATS.map((s, i) => (
                    <div key={i} className={`stat-card glass rounded-2xl p-4 anim-bounce d${i+1}`}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 anim-glow" style={{ background:s.bg }}>
                        <Icon d={s.icon} size={15} color={s.iconColor} />
                      </div>
                      <p className="text-xl font-bold">{s.val}</p>
                      <p className="text-[10px] text-gray-500">{s.label}</p>
                      {s.sub && <p className="text-[10px] mt-1" style={{ color:s.subColor }}>{s.sub}</p>}
                      {s.progress && (
                        <div className="w-full h-1.5 rounded-full mt-2" style={{ background:"rgba(255,255,255,0.05)" }}>
                          <div className="h-full rounded-full" style={{ width:`${s.progress}%`, background:"linear-gradient(90deg,#7c3aed,#fbbf24)" }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <WeeklyChart />
              </div>
              <UpcomingMeetings />
            </div>
          </main>
        </div>

        <Toast msg={toast} />
      </div>
    </>
  );
}
