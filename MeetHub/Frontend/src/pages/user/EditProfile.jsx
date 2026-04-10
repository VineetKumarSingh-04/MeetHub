import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/common/Navbar";
import api from "../../services/api";

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || "", status: user?.status || "online" });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || "");
  const [error, setError] = useState("");

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("status", form.status);
      if (avatar) fd.append("avatar", avatar);
      const { data } = await api.put("/users/me", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setUser(data);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-lg mx-auto p-8">
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
        {error && <p className="bg-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 space-y-5">
          <div className="flex flex-col items-center gap-3">
            <img src={preview || "/default-avatar.png"} alt="avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-600" />
            <label className="cursor-pointer text-sm text-blue-400 hover:underline">
              Change Photo
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-gray-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full bg-gray-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500">
              <option value="online">Online</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate("/profile")}
              className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg transition">Cancel</button>
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
