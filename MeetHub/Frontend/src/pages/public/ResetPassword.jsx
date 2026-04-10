import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../../services/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) return setError("Passwords do not match");
    try {
      await api.post("/auth/reset-password", { token, password: form.password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Link may have expired.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md text-white">
        <h2 className="text-2xl font-bold mb-2 text-center">Reset Password</h2>
        <p className="text-gray-400 text-sm text-center mb-6">Enter your new password below.</p>
        {success && <p className="bg-green-500/20 text-green-400 text-sm p-3 rounded-lg mb-4">Password reset! Redirecting to login...</p>}
        {error && <p className="bg-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4">{error}</p>}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="password" placeholder="New Password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-gray-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" required />
            <input type="password" placeholder="Confirm New Password" value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className="w-full bg-gray-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" required />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition">
              Reset Password
            </button>
          </form>
        )}
        <p className="text-center text-gray-400 text-sm mt-4">
          <Link to="/login" className="text-blue-400 hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
