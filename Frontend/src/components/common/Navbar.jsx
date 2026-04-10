import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../asset/logo.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="text-white px-6 py-3 flex items-center justify-between"
      style={{ background: "rgba(15,23,42,0.95)", borderBottom: "1px solid rgba(99,102,241,0.15)", backdropFilter: "blur(12px)" }}>

      <Link to="/dashboard" className="flex items-center gap-2">
        <img src={logo} alt="MeetHub" style={{ height: 32 }} />
        <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 18, fontWeight: 700, background: "linear-gradient(135deg,#818cf8,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          MeetHub
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">Dashboard</Link>
        <Link to="/friends"   className="text-sm text-gray-400 hover:text-white transition-colors">Friends</Link>
        <Link to="/scheduler" className="text-sm text-gray-400 hover:text-white transition-colors">Schedule</Link>
        <Link to="/profile">
          <img src={user?.avatar || "/default-avatar.png"} alt="avatar" className="w-8 h-8 rounded-full object-cover" style={{ border: "2px solid rgba(99,102,241,0.4)" }} />
        </Link>
        <button onClick={handleLogout} className="text-sm px-3 py-1.5 rounded-lg text-white transition-all hover:opacity-90"
          style={{ background: "#ef4444" }}>
          Logout
        </button>
      </div>
    </nav>
  );
}
