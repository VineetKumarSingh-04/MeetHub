import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../asset/logo.png";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Poppins:wght@600;700;800&display=swap');
  * { font-family: 'Inter', sans-serif; }
  .font-display { font-family: 'Space Grotesk', sans-serif; }
  .font-poppins  { font-family: 'Poppins', sans-serif; }

  @keyframes fade-in   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slide-in  { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }

  .anim-fade  { animation: fade-in  0.6s ease-out forwards; }
  .anim-slide { animation: slide-in 0.5s ease-out forwards; }

  .mesh-bg {
    background:
      radial-gradient(at 20% 50%, rgba(99,102,241,.3) 0%, transparent 50%),
      radial-gradient(at 80% 80%, rgba(139,92,246,.3) 0%, transparent 50%),
      linear-gradient(135deg,#0f172a 0%,#1e293b 100%);
  }
  .glass-card {
    background: rgba(15,23,42,.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(99,102,241,.2);
  }
  .input-field {
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(99,102,241,.2);
    border-radius: .75rem;
    padding: .875rem 1rem;
    color: white;
    width: 100%;
    transition: all .3s ease;
  }
  .input-field::placeholder { color: rgba(148,163,184,.6); }
  .input-field:focus {
    background: rgba(99,102,241,.1);
    border-color: rgba(99,102,241,.8);
    outline: none;
    box-shadow: 0 0 20px rgba(99,102,241,.4);
  }
  .input-field.error { border-color:#ef4444; background:rgba(239,68,68,.1); }

  .btn-primary {
    background: linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);
    transition: all .3s ease;
  }
  .btn-primary:hover { transform:translateY(-2px); box-shadow:0 10px 30px rgba(99,102,241,.4); }
  .btn-primary:active { transform:translateY(0); }

  .social-btn {
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(99,102,241,.2);
    border-radius: .75rem;
    padding: .75rem 1.5rem;
    transition: all .3s ease;
    cursor: pointer;
    color: white;
    width: 100%;
  }
  .social-btn:hover { background:rgba(99,102,241,.1); border-color:rgba(99,102,241,.6); transform:translateY(-2px); }

  .divider { display:flex; align-items:center; gap:1rem; margin:1.5rem 0; }
  .divider::before,.divider::after { content:''; flex:1; height:1px; background:rgba(99,102,241,.2); }

  .error-text { font-size:.75rem; color:#ef4444; margin-top:.25rem; display:block; }
  .success-msg {
    background:rgba(16,185,129,.1); border:1px solid #10b981;
    border-radius:.75rem; padding:1rem; color:#10b981;
    margin-bottom:1.5rem; animation: fade-in .5s ease-out;
  }
`;

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", terms: false });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email address";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    if (!form.terms) e.terms = "You must accept the terms";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    try {
      await register(form.name, form.email, form.password);
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Registration failed" });
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="min-h-screen mesh-bg text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-8 anim-fade">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img src={logo} alt="MeetHub" className="h-14 w-auto" />
              <span className="font-poppins text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                MeetHub
              </span>
            </div>
            <p className="text-slate-400 text-sm">Connect and collaborate</p>
          </div>

          {/* Card */}
          <div className="glass-card rounded-2xl p-8 shadow-2xl anim-slide">
            <h2 className="font-display text-2xl font-bold mb-6">Create Account</h2>

            {success && <div className="success-msg">{success}</div>}
            {errors.api && <div className="success-msg" style={{background:"rgba(239,68,68,.1)",borderColor:"#ef4444",color:"#ef4444"}}>{errors.api}</div>}

            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Full Name</label>
                <input type="text" placeholder="John Doe" value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className={`input-field ${errors.name ? "error" : ""}`} required />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Email Address</label>
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className={`input-field ${errors.email ? "error" : ""}`} required />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Password</label>
                <input type="password" placeholder="••••••••" value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className={`input-field ${errors.password ? "error" : ""}`} required />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Confirm Password</label>
                <input type="password" placeholder="••••••••" value={form.confirm}
                  onChange={e => setForm({...form, confirm: e.target.value})}
                  className={`input-field ${errors.confirm ? "error" : ""}`} required />
                {errors.confirm && <span className="error-text">{errors.confirm}</span>}
              </div>
              <div>
                <label className="flex items-start gap-2 text-sm text-slate-400 cursor-pointer">
                  <input type="checkbox" checked={form.terms}
                    onChange={e => setForm({...form, terms: e.target.checked})}
                    className="w-4 h-4 rounded mt-0.5" />
                  I agree to the{" "}
                  <span className="text-indigo-400 hover:text-indigo-300">Terms &amp; Conditions</span>
                </label>
                {errors.terms && <span className="error-text">{errors.terms}</span>}
              </div>
              <button type="submit" className="btn-primary w-full py-3 rounded-xl font-semibold text-white mt-2">
                Create Account
              </button>
            </form>

            <div className="divider"><span className="text-sm text-slate-400">Or sign up with</span></div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="social-btn flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="social-btn flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>

            <p className="text-center text-slate-400 text-sm">
              Already have an account?{" "}
              <button onClick={() => navigate("/login")} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Sign in
              </button>
            </p>
          </div>

          <p className="text-center mt-6 text-slate-500 text-xs">© 2024 MeetHub. All rights reserved.</p>
        </div>
      </div>
    </>
  );
}
