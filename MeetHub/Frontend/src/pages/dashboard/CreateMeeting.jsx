import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import api from "../../services/api";

export default function CreateMeeting() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", scheduledAt: "", isInstant: false });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/meetings", form);
      navigate(`/meeting/${data.roomId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create meeting");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-lg mx-auto p-8">
        <h2 className="text-2xl font-bold mb-6">Create a Meeting</h2>
        {error && <p className="bg-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4">{error}</p>}
        <div className="bg-gray-800 rounded-xl p-6 space-y-4">
          <div className="flex gap-3">
            <button onClick={() => setForm({ ...form, isInstant: false })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${!form.isInstant ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}>
              Schedule
            </button>
            <button onClick={() => setForm({ ...form, isInstant: true })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${form.isInstant ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}>
              Start Now
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Meeting title" required
              className="w-full bg-gray-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
            {!form.isInstant && (
              <input type="datetime-local" value={form.scheduledAt}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} required
                className="w-full bg-gray-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
            )}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition">
              {form.isInstant ? "Start Meeting" : "Schedule Meeting"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
