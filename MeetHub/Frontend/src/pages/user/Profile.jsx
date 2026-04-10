import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/common/Navbar";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const statusColor = { online: "bg-green-400", busy: "bg-yellow-400", offline: "bg-gray-500" };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-lg mx-auto p-8 space-y-6">
        <h2 className="text-2xl font-bold">Profile</h2>
        <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-center gap-4">
          <div className="relative">
            <img src={user?.avatar || "/default-avatar.png"} alt="avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-600" />
            <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${statusColor[user?.status] || "bg-gray-500"}`} />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold">{user?.name}</h3>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <p className="text-xs text-gray-500 mt-1 capitalize">{user?.status}</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden">
          {[
            { label: "Edit Profile", icon: "✏️", path: "/profile/edit" },
            { label: "Change Password", icon: "🔒", path: "/profile/password" },
            { label: "Settings", icon: "⚙️", path: "/settings" },
          ].map((item) => (
            <button key={item.label} onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition text-left border-t border-gray-700 first:border-0">
              <span>{item.icon}</span>
              <span className="text-sm">{item.label}</span>
              <span className="ml-auto text-gray-500">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
