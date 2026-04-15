import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/common/AppLayout";

export default function JoinMeeting() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleJoin = (e) => {
    e.preventDefault();
    setError("");
    const trimmed = input.trim();
    if (!trimmed) return setError("Please enter a meeting link or room ID");
    let roomId = trimmed;
    if (trimmed.includes("/meeting/")) roomId = trimmed.split("/meeting/").pop();
    if (!roomId) return setError("Invalid meeting link");
    navigate(`/meeting/${roomId}`);
  };

  return (
    <AppLayout activeNav="meetings">
      <div className="flex items-center justify-center min-h-full p-6">
        <div className="w-full max-w-lg">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Join a Meeting</h1>
            <p className="text-sm text-gray-400 mt-1">Enter a meeting link or room ID to join</p>
          </div>
          <div className="rounded-2xl p-6 space-y-4" style={{ background:"rgba(17,24,39,0.65)", border:"1px solid rgba(255,255,255,0.07)" }}>
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl">
                {error}
              </div>
            )}
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">Meeting Link or Room ID</label>
                <input value={input} onChange={e => setInput(e.target.value)}
                  placeholder="Paste link or enter room ID"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                  style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)" }}
                  onFocus={e => e.target.style.borderColor = "rgba(124,58,237,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
              <button type="submit"
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg"
                style={{ background:"linear-gradient(135deg,#7c3aed,#2563eb)" }}>
                Join Meeting
              </button>
            </form>
            <button onClick={() => navigate(-1)}
              className="w-full py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-all"
              style={{ background:"rgba(255,255,255,0.04)" }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
