import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import api from "../../services/api";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.newPassword !== form.confirm) return setError("New passwords do not match");
    try {
      await api.put("/users/me/password", { currentPassword: form.currentPassword, newPassword: form.newPassword });
      setSuccess("Password changed successfully");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-lg mx-auto p-8">
        <h2 className="text-2xl font-bold mb-6">Change Password</h2>
        <div className="bg-gray-800 rounded-xl p-6 space-y-4">
          {success && <p className="bg-green-500/20 text-green-400 text-sm p-3 rounded-lg">{success}</p>}
          {error && <p className="bg-red-500/20 text-red-400 text-sm p-3 rounded-lg">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Current Password</label>
              <input type="password" value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                className="w-full bg-gray-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">New Password</label>
              <input type="password" value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="w-full bg-gray-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Confirm New Password</label>
              <input type="password" value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="w-full bg-gray-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate("/profile")}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg transition">Cancel</button>
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition">
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
