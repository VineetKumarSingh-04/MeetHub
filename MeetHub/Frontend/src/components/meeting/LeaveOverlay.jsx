export default function LeaveOverlay({ onCancel, onConfirm }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center" style={{ background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)" }}>
      <div className="rounded-2xl p-6 text-center w-80" style={{ background:"rgba(255,255,255,0.08)", backdropFilter:"blur(30px)", border:"1px solid rgba(255,255,255,0.12)", boxShadow:"0 20px 60px rgba(0,0,0,0.5)" }}>
        <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background:"rgba(239,68,68,0.15)" }}>
          <svg width="24" height="24" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7 2 2 0 011.72 2v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.42 19.42 0 013.43 9.37"/>
            <line x1="23" y1="1" x2="1" y2="23"/>
          </svg>
        </div>
        <h3 className="text-white font-semibold text-lg mb-1">Leave Meeting?</h3>
        <p className="text-gray-400 text-sm mb-5">You'll be disconnected from the call.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm text-gray-300 font-medium hover:text-white transition-colors"
            style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm text-white font-medium transition-all hover:opacity-90"
            style={{ background:"#ef4444" }}>
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}
