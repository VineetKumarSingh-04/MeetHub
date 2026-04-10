import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import api from "../../services/api";

export default function MeetingHistory() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/meetings/history")
      .then((res) => setMeetings(res.data))
      .catch(() => setMeetings([]))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = { scheduled: "text-yellow-400", active: "text-green-400", ended: "text-gray-400" };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-6">Meeting History</h2>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : meetings.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-12 text-center text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p>No meetings yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {meetings.map((m) => (
              <div key={m._id} onClick={() => navigate(`/meetings/${m._id}`)}
                className="bg-gray-800 hover:bg-gray-750 rounded-xl p-4 flex items-center justify-between cursor-pointer transition">
                <div>
                  <p className="font-medium">{m.title}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {m.scheduledAt ? new Date(m.scheduledAt).toLocaleString() : "Instant meeting"} · {m.participants?.length || 0} participants
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium ${statusColor[m.status]}`}>{m.status}</span>
                  <span className="text-gray-500 text-sm">›</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
