import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/common/Navbar";

export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const sections = [
    {
      title: "Account",
      items: [
        { label: "Edit Profile", icon: "👤", path: "/profile/edit" },
        { label: "Change Password", icon: "🔒", path: "/profile/password" },
      ],
    },
    {
      title: "Meetings",
      items: [
        { label: "Meeting History", icon: "📋", path: "/meetings/history" },
        { label: "Schedule a Meeting", icon: "📅", path: "/create-meeting" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-lg mx-auto p-8 space-y-6">
        <h2 className="text-2xl font-bold">Settings</h2>
        {sections.map((s) => (
          <div key={s.title} className="bg-gray-800 rounded-xl overflow-hidden">
            <p className="text-xs text-gray-400 uppercase px-4 pt-4 pb-2">{s.title}</p>
            {s.items.map((item) => (
              <button key={item.label} onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition text-left border-t border-gray-700 first:border-0">
                <span>{item.icon}</span>
                <span className="text-sm">{item.label}</span>
                <span className="ml-auto text-gray-500">›</span>
              </button>
            ))}
          </div>
        ))}

        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition text-left text-red-400">
            <span>🚪</span>
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
