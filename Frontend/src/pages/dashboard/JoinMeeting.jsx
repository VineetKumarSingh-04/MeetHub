import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";

export default function JoinMeeting() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleJoin = (e) => {
    e.preventDefault();
    setError("");
    const trimmed = input.trim();
    if (!trimmed) return setError("Please enter a meeting link or room ID");

    // Accept full URL or just the room ID
    let roomId = trimmed;
    if (trimmed.includes("/meeting/")) {
      roomId = trimmed.split("/meeting/").pop();
    }
    if (!roomId) return setError("Invalid meeting link");
    navigate(`/meeting/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-lg mx-auto p-8">
        <h2 className="text-2xl font-bold mb-6">Join a Meeting</h2>
        <div className="bg-gray-800 rounded-xl p-6 space-y-4">
          {error && <p className="bg-red-500/20 text-red-400 text-sm p-3 rounded-lg">{error}</p>}
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Meeting Link or Room ID</label>
              <input value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Paste link or enter room ID"
                className="w-full bg-gray-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition">
              Join Meeting
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
