import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import api from "../../services/api";

export default function MeetingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/meetings/detail/${id}`)
      .then((res) => setMeeting(res.data))
      .catch(() => setError("Meeting not found"));
  }, [id]);

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/waiting/${meeting.roomId}`);
  };

  if (error) return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="flex items-center justify-center h-64 text-gray-400">{error}</div>
    </div>
  );

  if (!meeting) return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-2xl mx-auto p-8 space-y-6">
        <button onClick={() => navigate("/meetings/history")} className="text-gray-400 hover:text-white text-sm">← Back</button>
        <div className="bg-gray-800 rounded-xl p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{meeting.title}</h2>
              <p className="text-gray-400 text-sm mt-1">
                {meeting.scheduledAt ? new Date(meeting.scheduledAt).toLocaleString() : "Instant meeting"}
              </p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${meeting.status === "active" ? "bg-green-500/20 text-green-400" : meeting.status === "scheduled" ? "bg-yellow-500/20 text-yellow-400" : "bg-gray-700 text-gray-400"}`}>
              {meeting.status}
            </span>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <p className="text-sm text-gray-400 mb-1">Host</p>
            <div className="flex items-center gap-2">
              <img src={meeting.host?.avatar || "/default-avatar.png"} alt="" className="w-7 h-7 rounded-full object-cover" />
              <span className="text-sm">{meeting.host?.name}</span>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <p className="text-sm text-gray-400 mb-2">Room Link</p>
            <div className="flex gap-2">
              <input readOnly value={`${window.location.origin}/waiting/${meeting.roomId}`}
                className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-sm outline-none" />
              <button onClick={copyLink} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm">Copy</button>
            </div>
          </div>

          {meeting.status !== "ended" && (
            <button onClick={() => navigate(`/waiting/${meeting.roomId}`)}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition">
              Join Meeting
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
