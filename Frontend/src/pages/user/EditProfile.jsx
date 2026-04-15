import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AppLayout from "../../components/common/AppLayout";
import api from "../../services/api";

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name: user?.name || "", status: user?.status || "online" });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || "");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("status", form.status);
      if (avatar) fd.append("avatar", avatar);
      const { data } = await api.put("/users/me", fd, { headers:{ "Content-Type":"multipart/form-data" } });
      setUser(data);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = { background:"rgba(17,24,39,0.65)", border:"1px solid rgba(255,255,255,0.07)" };
  const inputStyle = { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"11px 14px", color:"#fff", fontSize:14, width:"100%", outline:"none" };

  return (
    <AppLayout activeNav="settings">
      <div className="p-6 max-w-lg mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
          <p className="text-sm text-gray-400 mt-1">Update your personal information</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-5" style={cardStyle}>
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            {preview
              ? <img src={preview} alt="avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white/10" />
              : <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white/10"
                  style={{ background:"linear-gradient(135deg,#7c3aed,#2563eb)" }}>
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
            }
            <label className="cursor-pointer text-sm text-purple-400 hover:text-purple-300 transition">
              Change Photo
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-medium">Full Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name:e.target.value })}
              style={inputStyle} required />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-medium">Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status:e.target.value })}
              style={{ ...inputStyle, appearance:"none" }}>
              <option value="online">Online</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => navigate("/profile")}
              className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition"
              style={{ background:"rgba(255,255,255,0.05)" }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background:"linear-gradient(135deg,#7c3aed,#2563eb)", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
