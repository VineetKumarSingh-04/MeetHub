import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/common/AppLayout";
import api from "../../services/api";

export default function MeetingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get(`/meetings/detail/${id}`)
      .then(res => setMeeting(res.data))
      .catch(() => setError("Meeting not found"));
  }, [id]);

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/waiting/${meeting.roomId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusStyle = {
    active:    { color:"#34d399", bg:"rgba(52,211,153,0.1)"  },
    scheduled: { color:"#fbbf24", bg:"rgba(251,191,36,0.1)"  },
    ended:     { color:"#6b7280", bg:"rgba(107,114,128,0.1)" },
  };

  const cardStyle = { background:"rgba(17,24,39,0.65)", border:"1px solid rgba(255,255,255,0.07)" };

  return (
    <AppLayout activeNav="meetings">
      <div className="p-6 max-w-2xl mx-auto">
        <button onClick={() => navigate("/meetings/history")}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition mb-6">
          ← Back to History
        </button>

        {error && (
          <div className="rounded-2xl p-8 text-center text-gray-400" style={cardStyle}>{error}</div>
        )}

        {!meeting && !error && (
          <div className="rounded-2xl p-8 text-center text-gray-400" style={cardStyle}>Loading...</div>
        )}

        {meeting && (
          <div className="rounded-2xl p-6 space-y-5" style={cardStyle}>
            {/* Title + status */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{meeting.title}</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {meeting.scheduledAt ? new Date(meeting.scheduledAt).toLocaleString() : "Instant meeting"}
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full font-medium"
                style={statusStyle[meeting.status] || statusStyle.ended}>
                {meeting.status}
              </span>
            </div>

            {/* Host */}
            <div className="border-t border-white/5 pt-4">
              <p className="text-xs text-gray-400 mb-2 font-medium">Host</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background:"linear-gradient(135deg,#7c3aed,#2563eb)" }}>
                  {meeting.host?.name?.[0]?.toUpperCase() || "H"}
                </div>
                <span className="text-sm text-white">{meeting.host?.name}</span>
              </div>
            </div>

            {/* Room link */}
            <div className="border-t border-white/5 pt-4">
              <p className="text-xs text-gray-400 mb-2 font-medium">Room Link</p>
              <div className="flex gap-2">
                <input readOnly value={`${window.location.origin}/waiting/${meeting.roomId}`}
                  className="flex-1 rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                  style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)" }} />
                <button onClick={copyLink}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                  style={{ background: copied ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.08)", color: copied ? "#34d399" : "#fff" }}>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Join button */}
            {meeting.status !== "ended" && (
              <button onClick={() => navigate(`/waiting/${meeting.roomId}`)}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                style={{ background:"linear-gradient(135deg,#7c3aed,#2563eb)" }}>
                Join Meeting
              </button>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
