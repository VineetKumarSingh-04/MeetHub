import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AppLayout from "../../components/common/AppLayout";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const cardStyle = { background:"rgba(17,24,39,0.65)", border:"1px solid rgba(255,255,255,0.07)" };
  const statusColor = { online:"#34d399", busy:"#fbbf24", offline:"#6b7280" };

  return (
    <AppLayout activeNav="settings">
      <div className="p-6 max-w-lg mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Profile</h1>
        </div>

        <div className="rounded-2xl p-6 flex flex-col items-center gap-4 mb-4" style={cardStyle}>
          <div className="relative">
            {user?.avatar
              ? <img src={user.avatar} alt="avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white/10" />
              : <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white/10"
                  style={{ background:"linear-gradient(135deg,#7c3aed,#2563eb)" }}>
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
            }
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-gray-900"
              style={{ background: statusColor[user?.status] || "#6b7280" }} />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white">{user?.name}</h3>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <p className="text-xs text-gray-500 mt-1 capitalize">{user?.status}</p>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden" style={cardStyle}>
          {[
            { label:"Edit Profile",    icon:"M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", path:"/profile/edit" },
            { label:"Change Password", icon:"M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", path:"/profile/password" },
            { label:"Settings",        icon:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z", path:"/settings" },
          ].map((item, i) => (
            <button key={item.label} onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-white/5 transition text-left border-t border-white/5 first:border-0">
              <svg width={16} height={16} fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d={item.icon} />
              </svg>
              <span className="text-sm text-white">{item.label}</span>
              <span className="ml-auto text-gray-500">›</span>
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
