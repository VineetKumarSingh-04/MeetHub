import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/common/AppLayout";
import api from "../../services/api";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ currentPassword:"", newPassword:"", confirm:"" });
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.newPassword !== form.confirm) return setError("New passwords do not match");
    setLoading(true);
    try {
      await api.put("/users/me/password", { currentPassword: form.currentPassword, newPassword: form.newPassword });
      setSuccess("Password changed successfully!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
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
          <h1 className="text-2xl font-bold text-white">Change Password</h1>
          <p className="text-sm text-gray-400 mt-1">Keep your account secure</p>
        </div>

        <div className="rounded-2xl p-6 space-y-4" style={cardStyle}>
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-3 rounded-xl">{success}</div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label:"Current Password", key:"currentPassword" },
              { label:"New Password",     key:"newPassword" },
              { label:"Confirm New Password", key:"confirm" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">{f.label}</label>
                <input type="password" value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={inputStyle} required />
              </div>
            ))}

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => navigate("/profile")}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition"
                style={{ background:"rgba(255,255,255,0.05)" }}>
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background:"linear-gradient(135deg,#7c3aed,#2563eb)", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
