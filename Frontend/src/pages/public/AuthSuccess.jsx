import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      setToken(token); // This will trigger the useEffect in AuthContext to fetch user data
      navigate("/dashboard");
    } else {
      navigate("/login?error=oauth_failed");
    }
  }, [searchParams, navigate, setToken]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0d0f1a', color: '#fff' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Authenticating...</h2>
        <p>Please wait while we log you in.</p>
      </div>
    </div>
  );
}
