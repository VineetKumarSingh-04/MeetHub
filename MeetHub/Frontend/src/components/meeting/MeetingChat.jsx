import { useState, useEffect, useRef } from "react";

export default function MeetingChat({ messages, onSend }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput("");
  };

  return (
    <div className="w-96 flex flex-col overflow-hidden hidden lg:flex" style={{ borderLeft:"1px solid rgba(255,255,255,0.06)", background:"rgba(255,255,255,0.08)", backdropFilter:"blur(30px)" }}>
      <div className="px-4 py-4" style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <h2 className="text-white font-semibold text-base flex items-center gap-2">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          Chat
        </h2>
        <p className="text-gray-400 text-xs mt-1">Live discussion</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth:"thin" }}>
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col ${msg.isSelf ? "items-end" : "items-start"}`}>
            {!msg.isSelf && <span className="text-xs text-gray-400 mb-1">{msg.sender}</span>}
            <div className="rounded-2xl px-3 py-2 max-w-[85%] text-sm text-white"
              style={msg.isSelf ? { background:"linear-gradient(135deg,#7c3aed,#6366f1)" } : { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
              {msg.text}
            </div>
            <span className="text-[10px] text-gray-500 mt-0.5">{msg.time}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4" style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            type="text" placeholder="Type a message..."
            className="flex-1 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 bg-transparent outline-none"
            style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", boxShadow: input ? "0 0 0 2px rgba(124,58,237,0.5)" : "none" }}
            autoComplete="off"
          />
          <button type="submit" className="p-2.5 rounded-xl text-white transition-all hover:opacity-90"
            style={{ background:"linear-gradient(135deg,#7c3aed,#6366f1)" }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
