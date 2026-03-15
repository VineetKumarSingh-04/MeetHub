import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
      <Link to="/dashboard" className="text-xl font-bold text-blue-400">MeetHub</Link>
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
        <Link to="/friends" className="hover:text-blue-400">Friends</Link>
        <Link to="/scheduler" className="hover:text-blue-400">Schedule</Link>
        <Link to="/profile" className="hover:text-blue-400">
          <img src={user?.avatar || "/default-avatar.png"} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
        </Link>
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">Logout</button>
      </div>
    </nav>
  );
}
