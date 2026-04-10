import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
      <p className="text-8xl font-bold text-gray-700 mb-4">404</p>
      <h2 className="text-2xl font-semibold mb-2">Page not found</h2>
      <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
      <button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl transition">
        Go Home
      </button>
    </div>
  );
}
