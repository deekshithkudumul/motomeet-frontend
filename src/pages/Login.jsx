import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/explore");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight:"100vh",display:"flex",alignItems:"center",
      justifyContent:"center",padding:"1rem",paddingTop:"80px",
      background:"radial-gradient(ellipse at top,#1a0a00 0%,#0A0A0A 60%)"
    }}>
      <div style={{width:"100%",maxWidth:"420px"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:"3rem",marginBottom:"0.5rem"}}>🏍️</div>
          <h1 style={{fontFamily:"Rajdhani",fontSize:"2rem",color:"#FF6B00"}}>Welcome Back</h1>
          <p style={{color:"#888",fontSize:"0.9rem"}}>Log in to continue your journey</p>
        </div>

        <div style={{
          background:"#111",border:"1px solid #222",
          borderRadius:"16px",padding:"2rem"
        }}>
          {error && (
            <div style={{background:"rgba(239,68,68,0.1)",border:"1px solid #EF4444",
              borderRadius:"8px",padding:"0.75rem",marginBottom:"1rem",
              color:"#EF4444",fontSize:"0.875rem"}}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              {label:"Email",key:"email",type:"email",placeholder:"rider@example.com"},
              {label:"Password",key:"password",type:"password",placeholder:"••••••••"}
            ].map(f => (
              <div key={f.key} style={{marginBottom:"1.25rem"}}>
                <label style={{display:"block",color:"#ccc",fontSize:"0.875rem",
                  fontWeight:500,marginBottom:"0.5rem"}}>{f.label}</label>
                <input
                  type={f.type} placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={e => setForm({...form,[f.key]:e.target.value})}
                  required
                  style={{
                    width:"100%",background:"#1a1a1a",border:"1px solid #333",
                    borderRadius:"8px",padding:"0.75rem 1rem",color:"#f5f5f5",
                    fontSize:"0.9rem",outline:"none",transition:"border 0.2s",
                    boxSizing:"border-box"
                  }}
                />
              </div>
            ))}

            <button type="submit" disabled={loading} style={{
              width:"100%",padding:"0.875rem",
              background:"linear-gradient(135deg,#FF6B00,#CC5500)",
              border:"none",borderRadius:"8px",color:"white",
              fontSize:"1rem",fontWeight:700,fontFamily:"Rajdhani",
              cursor:"pointer",letterSpacing:"0.05em",marginTop:"0.5rem"
            }}>
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>

          <p style={{textAlign:"center",marginTop:"1.5rem",color:"#888",fontSize:"0.875rem"}}>
            New rider?{" "}
            <Link to="/register" style={{color:"#FF6B00",textDecoration:"none",fontWeight:600}}>
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}