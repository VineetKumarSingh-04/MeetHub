import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../asset/logo.png";

// ── Inline styles / keyframes injected once ──────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Poppins:wght@600;700;800&display=swap');
  * { font-family: 'Inter', sans-serif; }
  .font-display { font-family: 'Space Grotesk', sans-serif; }
  .font-poppins  { font-family: 'Poppins', sans-serif; }

  @keyframes float        { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(2deg)} }
  @keyframes float2       { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(-2deg)} }
  @keyframes pulse-ring   { 0%{transform:scale(.8);opacity:1} 100%{transform:scale(1.4);opacity:0} }
  @keyframes grad-shift   { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes slide-up     { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fade-in      { from{opacity:0} to{opacity:1} }
  @keyframes bounce-in    { 0%{transform:scale(.8);opacity:0} 50%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
  @keyframes glow-pulse   { 0%,100%{box-shadow:0 0 20px rgba(99,102,241,.5),0 0 40px rgba(99,102,241,.2)} 50%{box-shadow:0 0 30px rgba(99,102,241,.8),0 0 60px rgba(99,102,241,.4)} }

  .anim-float          { animation: float  6s ease-in-out infinite; }
  .anim-float2         { animation: float2 6s ease-in-out infinite 2s; }
  .anim-grad           { background-size:200% 200%; animation: grad-shift 8s ease infinite; }
  .anim-slide-up       { animation: slide-up .8s ease-out forwards; }
  .anim-fade-in        { animation: fade-in 1s ease-out forwards; }
  .anim-bounce-in      { animation: bounce-in .6s cubic-bezier(.34,1.56,.64,1) forwards; opacity:0; }
  .anim-glow-pulse     { animation: glow-pulse 3s ease-in-out infinite; }

  .glass {
    background: rgba(255,255,255,.08);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,.1);
    transition: background .3s, border-color .3s;
  }
  .glass:hover { background:rgba(255,255,255,.12); border-color:rgba(255,255,255,.2); }

  .mesh-bg {
    background:
      radial-gradient(at 20% 20%, rgba(99,102,241,.3) 0%, transparent 50%),
      radial-gradient(at 80% 80%, rgba(139,92,246,.3) 0%, transparent 50%),
      radial-gradient(at 40% 60%, rgba(168,85,247,.2) 0%, transparent 50%);
  }

  .video-avatar::before {
    content:''; position:absolute; inset:-4px; border-radius:50%;
    background:linear-gradient(45deg,#6366f1,#8b5cf6,#a855f7);
    animation: pulse-ring 2s ease-out infinite; z-index:-1;
  }

  .feat-icon {
    background:linear-gradient(135deg,rgba(99,102,241,.2),rgba(139,92,246,.2));
    border:1px solid rgba(99,102,241,.3);
  }

  .glow-btn { position:relative; overflow:hidden; }
  .glow-btn::before {
    content:''; position:absolute; inset:-2px;
    background:linear-gradient(45deg,#6366f1,#8b5cf6,#a855f7,#6366f1);
    background-size:400% 400%; animation: grad-shift 3s ease infinite;
    border-radius:inherit; z-index:-1; filter:blur(8px); opacity:.6;
  }

  .scroll-reveal { opacity:0; transform:translateY(30px); transition:opacity .8s ease-out,transform .8s ease-out; }
  .scroll-reveal.visible { opacity:1; transform:translateY(0); }

  .underline-hover span {
    position:absolute; bottom:0; left:0; width:0; height:2px;
    background:linear-gradient(to right,#818cf8,#a78bfa);
    transition:width .3s;
  }
  .underline-hover:hover span { width:100%; }

  .tooltip { position:relative; }
  .tooltip::after {
    content:attr(data-tip); position:absolute; bottom:110%; left:50%;
    transform:translateX(-50%); background:rgba(0,0,0,.9); color:#fff;
    padding:.4rem .7rem; border-radius:.5rem; font-size:.75rem;
    white-space:nowrap; opacity:0; pointer-events:none; transition:opacity .3s; z-index:10;
  }
  .tooltip:hover::after { opacity:1; }
`;

// ── Counter hook ─────────────────────────────────────────────────────────────
function useCounter(ref, target, duration = 2000) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / duration, 1);
        el.textContent = Math.floor(target * p);
        if (p < 1) requestAnimationFrame(tick);
      };
      tick();
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, target, duration]);
}

// ── Scroll-reveal hook ───────────────────────────────────────────────────────
function useScrollReveal(containerRef) {
  useEffect(() => {
    const els = containerRef.current?.querySelectorAll(".scroll-reveal") ?? [];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [containerRef]);
}

// ── Timer component ──────────────────────────────────────────────────────────
function MeetingTimer() {
  const ref = useRef(null);
  useEffect(() => {
    let s = 15 * 60 + 32;
    const id = setInterval(() => {
      s++;
      const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
      if (ref.current) ref.current.textContent =
        `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <span ref={ref}>00:15:32</span>;
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const pageRef  = useRef(null);
  const c1 = useRef(null), c2 = useRef(null), c3 = useRef(null);
  useCounter(c1, 50);
  useCounter(c2, 150);
  useCounter(c3, 99);
  useScrollReveal(pageRef);

  return (
    <>
      {/* inject CSS once */}
      <style>{CSS}</style>

      <div ref={pageRef} className="min-h-screen bg-slate-950 text-white overflow-auto relative">

        {/* ── Background blobs ── */}
        <div className="fixed inset-0 mesh-bg pointer-events-none" />
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl anim-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl anim-float2" />
        </div>

        {/* ── Nav ── */}
        <nav className="relative z-50 px-6 py-4 sticky top-0 backdrop-blur-md bg-slate-950/50 border-b border-slate-800/50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={logo} alt="MeetHub logo" className="h-20 w-auto hover:scale-110 transition-transform duration-300" />
              <span className="font-poppins text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">MeetHub</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {["features","stats","tech"].map(id => (
                <a key={id} href={`#${id}`} className="underline-hover relative text-slate-300 hover:text-white transition-colors capitalize">
                  {id === "tech" ? "Technology" : id.charAt(0).toUpperCase() + id.slice(1)}
                  <span />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-300 hover:text-white transition-colors font-medium">Sign In</Link>
              <Link to="/signup" className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105">
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="relative z-10 px-6 pt-16 pb-24">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div className="anim-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 anim-bounce-in" style={{animationDelay:".1s"}}>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-slate-300">Real-time collaboration platform</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="text-white">Connect.</span><br/>
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent anim-grad">Collaborate.</span><br/>
                <span className="text-white">Communicate.</span>
              </h1>
              <p className="text-xl text-slate-400 mb-8 max-w-lg leading-relaxed">
                Experience crystal-clear video calls, instant messaging, and seamless screen sharing. Built with WebRTC for the fastest, most secure real-time communication.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button onClick={() => navigate("/signup")}
                  className="glow-btn anim-glow-pulse px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full font-semibold text-lg hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2">
                  <span>Start Free Meeting</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </button>
                <button className="px-8 py-4 rounded-full font-semibold text-lg border border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 transition-all duration-300 flex items-center justify-center gap-2 group">
                  <svg className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span>Watch Demo</span>
                </button>
              </div>
              {/* Trust badges */}
              <div className="flex items-center gap-6 anim-fade-in" style={{animationDelay:".3s"}}>
                <div className="flex -space-x-3">
                  {[
                    {init:"JD", bg:"linear-gradient(135deg,#fb7185,#e11d48)", name:"John Doe"},
                    {init:"SK", bg:"linear-gradient(135deg,#34d399,#059669)", name:"Sarah Kim"},
                    {init:"MR", bg:"linear-gradient(135deg,#fbbf24,#d97706)", name:"Mike Ross"},
                    {init:"AL", bg:"linear-gradient(135deg,#22d3ee,#0891b2)", name:"Anna Lee"},
                  ].map(({init,bg,name}) => (
                    <div key={init} className="tooltip w-10 h-10 rounded-full border-2 border-slate-950 flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform"
                      style={{background:bg}} data-tip={name}>
                      {init}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="text-slate-400 text-sm">(4.9)</span>
                  </div>
                  <span className="text-slate-500 text-sm">Trusted by 50K+ users</span>
                </div>
              </div>
            </div>

            {/* Right – video call preview */}
            <div className="relative anim-fade-in" style={{animationDelay:".3s"}}>
              <div className="glass rounded-3xl p-6 shadow-2xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-shadow duration-300">
                {/* window dots + timer */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {["bg-red-500","bg-yellow-500","bg-green-500"].map((c,i) => (
                      <div key={i} className={`w-3 h-3 ${c} rounded-full animate-pulse`} style={{animationDelay:`${i*0.1}s`}} />
                    ))}
                  </div>
                  <span className="text-slate-400 text-sm font-medium">Team Standup • <MeetingTimer /></span>
                </div>

                {/* 2×2 grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    {
                      init:"JD", name:"John Doe", mic:true,
                      tileBg:"linear-gradient(135deg,#312e81 0%,#4c1d95 100%)",
                      avatarBg:"linear-gradient(135deg,#818cf8 0%,#a78bfa 100%)",
                    },
                    {
                      init:"SK", name:"Sarah Kim",
                      tileBg:"linear-gradient(135deg,#064e3b 0%,#065f46 100%)",
                      avatarBg:"linear-gradient(135deg,#34d399 0%,#10b981 100%)",
                    },
                    {
                      init:"MR", name:"Mike Ross", presenting:true,
                      tileBg:"linear-gradient(135deg,#78350f 0%,#92400e 100%)",
                      avatarBg:"linear-gradient(135deg,#fbbf24 0%,#f97316 100%)",
                    },
                    {
                      init:"AL", name:"Anna Lee",
                      tileBg:"linear-gradient(135deg,#881337 0%,#9f1239 100%)",
                      avatarBg:"linear-gradient(135deg,#fb7185 0%,#f43f5e 100%)",
                    },
                  ].map(p => (
                    <div key={p.init} className="relative rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
                      style={{background: p.tileBg, aspectRatio:"16/9"}}>
                      {/* mic active dot for JD */}
                      {p.mic && <div className="absolute top-3 left-3 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="video-avatar relative w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                          style={{background: p.avatarBg}}>
                          {p.init}
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-xs font-medium">{p.name}</span>
                        {p.mic && (
                          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{background:"rgba(16,185,129,0.25)"}}>
                            <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      {p.presenting && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 bg-indigo-500 rounded-lg text-xs font-medium flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <rect x="2" y="3" width="20" height="14" rx="2"/>
                              <line x1="8" y1="21" x2="16" y2="21"/>
                              <line x1="12" y1="17" x2="12" y2="21"/>
                            </svg>
                            Presenting
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  {[
                    {icon:<path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>,fill:true,hover:"group-hover:text-green-400"},
                    {icon:<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>,hover:"group-hover:text-blue-400"},
                    {icon:<><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,hover:"group-hover:text-purple-400"},
                    {icon:<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>,hover:"group-hover:text-yellow-400"},
                  ].map((btn,i) => (
                    <button key={i} className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors hover:scale-110 active:scale-95 group">
                      <svg className={`w-5 h-5 mx-auto transition-colors ${btn.hover}`} fill={btn.fill?"currentColor":"none"} stroke={btn.fill?undefined:"currentColor"} viewBox="0 0 24 24">{btn.icon}</svg>
                    </button>
                  ))}
                  <button className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 transition-colors hover:scale-110 active:scale-95 group">
                    <svg className="w-6 h-6 mx-auto group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 glass px-4 py-3 rounded-xl anim-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <div><p className="text-sm font-medium">HD Quality</p><p className="text-xs text-slate-400">1080p Video</p></div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 glass px-4 py-3 rounded-xl anim-float2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  </div>
                  <div><p className="text-sm font-medium">End-to-End</p><p className="text-xs text-slate-400">Encrypted</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section id="stats" className="relative z-10 px-6 py-24 bg-gradient-to-b from-indigo-500/5 to-transparent">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            {[
              {ref:c1, suffix:"K+", label:"Active Users",      sub:"Growing every day"},
              {ref:c2, suffix:"M",  label:"Minutes Connected", sub:"Total call time"},
              {ref:c3, suffix:".9%",label:"Uptime SLA",        sub:"Enterprise grade"},
            ].map((s,i) => (
              <div key={i} className="text-center glass rounded-2xl p-8 hover:scale-105 transition-transform duration-300 anim-bounce-in scroll-reveal" style={{animationDelay:`${i*0.1}s`}}>
                <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  <span ref={s.ref}>0</span>{s.suffix}
                </div>
                <p className="text-slate-400">{s.label}</p>
                <p className="text-xs text-slate-500 mt-2">{s.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="relative z-10 px-6 py-24 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 scroll-reveal">
              <span className="inline-block px-4 py-2 rounded-full glass text-indigo-400 text-sm font-medium mb-4">Features</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Everything you need to{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">connect</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Powerful features built with modern technology to deliver the best real-time communication experience.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {color:"text-indigo-400", title:"HD Video Calls",       desc:"Crystal-clear video quality with WebRTC for seamless peer-to-peer communication.",
                  icon:<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>},
                {color:"text-purple-400", title:"Screen Sharing",       desc:"Share your screen instantly with participants for presentations and collaborative work.",
                  icon:<><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>},
                {color:"text-pink-400",   title:"Real-time Chat",       desc:"Instant messaging powered by Socket.io for lightning-fast communication.",
                  icon:<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>},
                {color:"text-emerald-400",title:"Secure & Private",     desc:"End-to-end encryption ensures your conversations stay private and secure.",
                  icon:<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>},
                {color:"text-amber-400",  title:"Meeting Scheduler",    desc:"Schedule meetings with automatic reminders and calendar integration.",
                  icon:<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>},
                {color:"text-cyan-400",   title:"Friend Management",    desc:"Build your network with easy friend requests and contact management.",
                  icon:<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>},
              ].map((f,i) => (
                <div key={i} className="glass rounded-2xl p-8 hover:scale-105 transition-transform duration-300 group scroll-reveal" style={{animationDelay:`${i*0.1}s`}}>
                  <div className={`feat-icon w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <svg className={`w-7 h-7 ${f.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">{f.icon}</svg>
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3">{f.title}</h3>
                  <p className="text-slate-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tech Stack ── */}
        <section id="tech" className="relative z-10 px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 scroll-reveal">
              <span className="inline-block px-4 py-2 rounded-full glass text-purple-400 text-sm font-medium mb-4">Technology</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Built with{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Modern Stack</span>
              </h2>
              <p className="text-slate-400 text-lg">Powered by the MERN stack with WebRTC and Socket.io</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {[
                {letter:"M", bg:"rgba(16,185,129,0.15)",  color:"#34d399", label:"MongoDB"},
                {letter:"E", bg:"rgba(148,163,184,0.15)", color:"#94a3b8", label:"Express.js"},
                {letter:"R", bg:"rgba(34,211,238,0.15)",  color:"#22d3ee", label:"React.js"},
                {letter:"N", bg:"rgba(74,222,128,0.15)",  color:"#4ade80", label:"Node.js"},
                {letter:"W", bg:"rgba(251,146,60,0.15)",  color:"#fb923c", label:"WebRTC"},
                {letter:"S", bg:"rgba(129,140,248,0.15)", color:"#818cf8", label:"Socket.io"},
              ].map(t => (
                <div key={t.label} className="glass px-8 py-6 rounded-2xl flex items-center gap-4 hover:scale-105 transition-transform scroll-reveal">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{background:t.bg}}>
                    <span className="font-bold text-lg" style={{color:t.color}}>{t.letter}</span>
                  </div>
                  <span className="font-medium">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative z-10 px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="glass rounded-3xl p-12 text-center relative overflow-hidden scroll-reveal">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
              <div className="relative z-10">
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                  Ready to transform your{" "}
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">communication</span>?
                </h2>
                <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                  Join thousands of teams already using MeetHub for their daily meetings, collaborations, and catch-ups.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => navigate("/signup")}
                    className="glow-btn px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full font-semibold text-lg hover:scale-105 transition-transform duration-300">
                    Start Free Today
                  </button>
                  <button className="px-10 py-4 rounded-full font-semibold text-lg border border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 transition-all duration-300">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="relative z-10 px-6 py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <img src={logo} alt="MeetHub logo" className="h-16 w-auto" />
              <span className="font-poppins text-xl font-bold">MeetHub</span>
            </div>
            <p className="text-slate-500 text-sm">© 2024 MeetHub. All rights reserved. Built with MERN Stack.</p>
            <div className="flex items-center gap-6">
              {/* Twitter */}
              <a href="#" className="text-slate-400 hover:text-white transition-colors hover:scale-110 transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              {/* GitHub */}
              <a href="#" className="text-slate-400 hover:text-white transition-colors hover:scale-110 transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="text-slate-400 hover:text-white transition-colors hover:scale-110 transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
