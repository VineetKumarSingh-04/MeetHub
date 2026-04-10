import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
      <p className="text-8xl font-bold text-gray-700 mb-4">401</p>
      <h2 className="text-2xl font-semibold mb-2">Unauthorized</h2>
      <p className="text-gray-400 mb-8">You don't have permission to access this page.</p>
      <div className="flex gap-3">
        <button onClick={() => navigate("/login")} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl transition">
          Login
        </button>
        <button onClick={() => navigate("/")} className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl transition">
          Go Home
        </button>
      </div>
    </div>
  );
}
