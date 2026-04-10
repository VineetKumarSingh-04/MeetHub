import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      setMsg("If that email exists, a reset link has been sent.");
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md text-white">
        <h2 className="text-2xl font-bold mb-2 text-center">Forgot Password</h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          Enter your email and we'll send you a reset link.
        </p>
        {msg && <p className="bg-green-500/20 text-green-400 text-sm p-3 rounded-lg mb-4">{msg}</p>}
        {error && <p className="bg-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4">{error}</p>}
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" placeholder="Email address" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" required />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition">
              Send Reset Link
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-400 text-sm">Check your inbox for the reset link.</p>
        )}
        <p className="text-center text-gray-400 text-sm mt-4">
          <Link to="/login" className="text-blue-400 hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
