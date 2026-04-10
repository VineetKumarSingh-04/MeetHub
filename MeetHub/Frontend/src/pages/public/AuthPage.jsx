import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../asset/logo.png";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .auth-root {
    min-height: 100vh;
    background: #0d0f1a;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    font-family: 'Inter', sans-serif;
  }

  .auth-card {
    width: 100%;
    max-width: 400px;
    background: #13162a;
    border-radius: 1.25rem;
    padding: 2.5rem 2rem;
    box-shadow: 0 24px 64px rgba(0,0,0,.5);
  }

  .auth-logo-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
  }

  .auth-brand {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: .25rem;
  }

  .auth-tagline {
    font-size: .85rem;
    color: #6b7280;
  }

  .auth-heading {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    text-align: center;
    margin-bottom: .4rem;
  }

  .auth-subheading {
    font-size: .875rem;
    color: #6b7280;
    text-align: center;
    margin-bottom: 1.75rem;
  }

  .auth-field {
    position: relative;
    margin-bottom: 1rem;
  }

  .auth-field-icon {
    position: absolute;
    left: .875rem;
    top: 50%;
    transform: translateY(-50%);
    color: #4b5563;
    pointer-events: none;
    display: flex;
  }

  .auth-input {
    width: 100%;
    background: #1c2035;
    border: 1px solid #2a2f4a;
    border-radius: .75rem;
    padding: .875rem 1rem .875rem 2.75rem;
    color: #fff;
    font-size: .9rem;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
    box-sizing: border-box;
  }
  .auth-input::placeholder { color: #4b5563; }
  .auth-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,.15);
  }
  .auth-input.err { border-color: #ef4444; }
  .auth-input-pr { padding-right: 3rem; }

  .auth-eye {
    position: absolute;
    right: .875rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #4b5563;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
  }
  .auth-eye:hover { color: #9ca3af; }

  .auth-err-text {
    font-size: .75rem;
    color: #ef4444;
    margin-top: .3rem;
    display: block;
  }

  .auth-api-err {
    background: rgba(239,68,68,.1);
    border: 1px solid rgba(239,68,68,.4);
    border-radius: .75rem;
    padding: .75rem 1rem;
    color: #ef4444;
    font-size: .85rem;
    margin-bottom: 1rem;
  }

  .auth-forgot {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1.25rem;
  }
  .auth-forgot button {
    background: none;
    border: none;
    color: #6366f1;
    font-size: .85rem;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
  }
  .auth-forgot button:hover { color: #818cf8; }

  .btn-primary {
    width: 100%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border: none;
    border-radius: .75rem;
    padding: .875rem;
    color: #fff;
    font-size: .95rem;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: opacity .2s, transform .2s;
    margin-bottom: 1.25rem;
  }
  .btn-primary:hover { opacity: .9; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: .6; cursor: not-allowed; transform: none; }

  .auth-divider {
    display: flex;
    align-items: center;
    gap: .75rem;
    margin-bottom: 1.25rem;
    color: #374151;
    font-size: .8rem;
  }
  .auth-divider::before, .auth-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #1f2540;
  }

  .btn-google {
    width: 100%;
    background: #1c2035;
    border: 1px solid #2a2f4a;
    border-radius: .75rem;
    padding: .875rem;
    color: #fff;
    font-size: .9rem;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .6rem;
    transition: background .2s, border-color .2s;
    margin-bottom: 1.5rem;
  }
  .btn-google:hover { background: #222640; border-color: #3b4270; }

  .auth-switch {
    text-align: center;
    font-size: .875rem;
    color: #6b7280;
  }
  .auth-switch button {
    background: none;
    border: none;
    color: #6366f1;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: .875rem;
  }
  .auth-switch button:hover { color: #818cf8; }

  .auth-terms {
    display: flex;
    align-items: flex-start;
    gap: .5rem;
    font-size: .82rem;
    color: #6b7280;
    margin-bottom: 1rem;
    cursor: pointer;
  }
  .auth-terms input { margin-top: 2px; accent-color: #6366f1; }
  .auth-terms span { color: #6366f1; }
`;

const EmailIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m2 7 10 7 10-7"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const EyeIcon = ({ off }) => off ? (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const GoogleColorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

function LoginForm({ onSwitch }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const validate = () => {
    const e = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "At least 6 characters";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Invalid credentials" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="auth-heading">Welcome back</h2>
      <p className="auth-subheading">Sign in to continue your meetings</p>

      {errors.api && <div className="auth-api-err">{errors.api}</div>}

      <form onSubmit={handleSubmit}>
        <div className="auth-field">
          <span className="auth-field-icon"><EmailIcon /></span>
          <input
            type="email" placeholder="Email address" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className={`auth-input ${errors.email ? "err" : ""}`}
          />
          {errors.email && <span className="auth-err-text">{errors.email}</span>}
        </div>

        <div className="auth-field">
          <span className="auth-field-icon"><LockIcon /></span>
          <input
            type={showPw ? "text" : "password"} placeholder="Password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className={`auth-input auth-input-pr ${errors.password ? "err" : ""}`}
          />
          <button type="button" className="auth-eye" onClick={() => setShowPw(p => !p)}>
            <EyeIcon off={showPw} />
          </button>
          {errors.password && <span className="auth-err-text">{errors.password}</span>}
        </div>

        <div className="auth-forgot">
          <button type="button" onClick={() => navigate("/forgot-password")}>Forgot password?</button>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="auth-divider">or continue with</div>

      <button className="btn-google">
        <GoogleColorIcon /> Continue with Google
      </button>

      <div className="auth-switch">
        New here?{" "}
        <button onClick={onSwitch}>Create account</button>
      </div>
    </>
  );
}

function SignupForm({ onSwitch }) {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", terms: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "At least 2 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "At least 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    if (!form.terms) e.terms = "You must accept the terms";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="auth-heading">Create account</h2>
      <p className="auth-subheading">Join MeetHub today</p>

      {errors.api && <div className="auth-api-err">{errors.api}</div>}

      <form onSubmit={handleSubmit}>
        <div className="auth-field">
          <span className="auth-field-icon"><UserIcon /></span>
          <input
            type="text" placeholder="Full name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className={`auth-input ${errors.name ? "err" : ""}`}
          />
          {errors.name && <span className="auth-err-text">{errors.name}</span>}
        </div>

        <div className="auth-field">
          <span className="auth-field-icon"><EmailIcon /></span>
          <input
            type="email" placeholder="Email address" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className={`auth-input ${errors.email ? "err" : ""}`}
          />
          {errors.email && <span className="auth-err-text">{errors.email}</span>}
        </div>

        <div className="auth-field">
          <span className="auth-field-icon"><LockIcon /></span>
          <input
            type={showPw ? "text" : "password"} placeholder="Password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className={`auth-input auth-input-pr ${errors.password ? "err" : ""}`}
          />
          <button type="button" className="auth-eye" onClick={() => setShowPw(p => !p)}>
            <EyeIcon off={showPw} />
          </button>
          {errors.password && <span className="auth-err-text">{errors.password}</span>}
        </div>

        <div className="auth-field">
          <span className="auth-field-icon"><LockIcon /></span>
          <input
            type="password" placeholder="Confirm password" value={form.confirm}
            onChange={e => setForm({ ...form, confirm: e.target.value })}
            className={`auth-input ${errors.confirm ? "err" : ""}`}
          />
          {errors.confirm && <span className="auth-err-text">{errors.confirm}</span>}
        </div>

        <label className="auth-terms">
          <input type="checkbox" checked={form.terms} onChange={e => setForm({ ...form, terms: e.target.checked })} />
          I agree to the <span>Terms &amp; Conditions</span>
          {errors.terms && <span className="auth-err-text">{errors.terms}</span>}
        </label>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <div className="auth-divider">or sign up with</div>

      <button className="btn-google">
        <GoogleColorIcon /> Continue with Google
      </button>

      <div className="auth-switch">
        Already have an account?{" "}
        <button onClick={onSwitch}>Sign in</button>
      </div>
    </>
  );
}

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");

  return (
    <div className="auth-root">
      <style>{CSS}</style>
      <div className="auth-card">
        <div className="auth-logo-wrap">
          <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            <span className="text-sm font-medium">Home</span>
          </Link>
          <img src={logo} alt="MeetHub" style={{ height: 64, marginBottom: ".75rem" }} />
          <div className="auth-brand">MeetHub</div>
          <div className="auth-tagline">Connect. Collaborate. Create.</div>
        </div>

        {isSignUp
          ? <SignupForm onSwitch={() => setIsSignUp(false)} />
          : <LoginForm onSwitch={() => setIsSignUp(true)} />
        }
      </div>
    </div>
  );
}
