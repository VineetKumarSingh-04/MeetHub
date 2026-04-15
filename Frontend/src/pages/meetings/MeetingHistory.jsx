import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/common/AppLayout";
import api from "../../services/api";

export default function MeetingHistory() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/meetings/history")
      .then(res => setMeetings(res.data))
      .catch(() => setMeetings([]))
      .finally(() => setLoading(false));
  }, []);

  const statusStyle = {
    scheduled: { color:"#fbbf24", bg:"rgba(251,191,36,0.1)" },
    active:    { color:"#34d399", bg:"rgba(52,211,153,0.1)" },
    ended:     { color:"#6b7280", bg:"rgba(107,114,128,0.1)" },
  };

  return (
    <AppLayout activeNav="meetings">
      <div className="p-6 max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Meeting History</h1>
          <p className="text-sm text-gray-400 mt-1">All your past and upcoming meetings</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40 text-gray-400">Loading...</div>
        ) : meetings.length === 0 ? (
          <div className="rounded-2xl p-12 text-center text-gray-400"
            style={{ background:"rgba(17,24,39,0.65)", border:"1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-4xl mb-3">📋</p>
            <p>No meetings yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {meetings.map(m => (
              <div key={m._id} onClick={() => navigate(`/meetings/${m._id}`)}
                className="rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01]"
                style={{ background:"rgba(17,24,39,0.65)", border:"1px solid rgba(255,255,255,0.07)" }}>
                <div>
                  <p className="font-medium text-white">{m.title}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {m.scheduledAt ? new Date(m.scheduledAt).toLocaleString() : "Instant meeting"} · {m.participants?.length || 0} participants
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={statusStyle[m.status] || statusStyle.ended}>
                    {m.status}
                  </span>
                  <span className="text-gray-500">›</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
