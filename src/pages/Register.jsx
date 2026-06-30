import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name:"", email:"", password:"", bike_model:"", experience:"Beginner", city:""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form);
      navigate("/explore");
    } catch(err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width:"100%",background:"#F8F7F4",border:"1px solid #E5E1DB",
    borderRadius:"8px",padding:"0.75rem 1rem",color:"#1A1A1A",
    fontSize:"0.9rem",outline:"none",boxSizing:"border-box"
  };

  return (
    <div style={{
      minHeight:"100vh",display:"flex",alignItems:"center",
      justifyContent:"center",padding:"1rem",paddingTop:"80px",
      background:"radial-gradient(ellipse at top,#EDECE6 0%,#F5F4F0 60%)"
    }}>
      <div style={{width:"100%",maxWidth:"480px"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:"3rem",marginBottom:"0.5rem"}}>🏍️</div>
          <h1 style={{fontFamily:"Rajdhani",fontSize:"2rem",color:"#E76F51"}}>Join MotoMeet</h1>
          <p style={{color:"#6B6B6B",fontSize:"0.9rem"}}>Start your riding journey</p>
        </div>

        <div style={{background:"#FFFFFF",border:"1px solid #E5E1DB",borderRadius:"16px",padding:"2rem",
          boxShadow:"0 4px 20px rgba(0,0,0,0.06)"}}>
          {error && (
            <div style={{background:"rgba(239,68,68,0.08)",border:"1px solid #EF4444",
              borderRadius:"8px",padding:"0.75rem",marginBottom:"1rem",
              color:"#DC2626",fontSize:"0.875rem"}}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
              {[
                {label:"Full Name",key:"name",type:"text",placeholder:"Your name",span:2},
                {label:"Email",key:"email",type:"email",placeholder:"rider@example.com",span:2},
                {label:"Password",key:"password",type:"password",placeholder:"Min 6 characters",span:2},
                {label:"Bike Model",key:"bike_model",type:"text",placeholder:"e.g. Royal Enfield Himalayan",span:1},
                {label:"City",key:"city",type:"text",placeholder:"Your city",span:1},
              ].map(f => (
                <div key={f.key} style={{gridColumn:`span ${f.span}`,marginBottom:"0.25rem"}}>
                  <label style={{display:"block",color:"#1A1A1A",fontSize:"0.875rem",
                    fontWeight:500,marginBottom:"0.5rem"}}>{f.label}</label>
                  <input
                    type={f.type} placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={e => setForm({...form,[f.key]:e.target.value})}
                    required={["name","email","password"].includes(f.key)}
                    style={inputStyle}
                    onFocus={e => e.target.style.border = "1px solid #2D6A4F"}
                    onBlur={e => e.target.style.border = "1px solid #E5E1DB"}
                  />
                </div>
              ))}

              <div style={{gridColumn:"span 2",marginBottom:"0.25rem"}}>
                <label style={{display:"block",color:"#1A1A1A",fontSize:"0.875rem",
                  fontWeight:500,marginBottom:"0.5rem"}}>Experience Level</label>
                <select value={form.experience}
                  onChange={e => setForm({...form,experience:e.target.value})}
                  style={{...inputStyle,cursor:"pointer"}}>
                  {["Beginner","Intermediate","Expert"].map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width:"100%",padding:"0.875rem",marginTop:"1rem",
              background:"linear-gradient(135deg,#E76F51,#C85A3F)",
              border:"none",borderRadius:"8px",color:"white",
              fontSize:"1rem",fontWeight:700,fontFamily:"Rajdhani",
              cursor:"pointer",letterSpacing:"0.05em"
            }}>
              {loading ? "Creating account..." : "CREATE ACCOUNT"}
            </button>
          </form>

          <p style={{textAlign:"center",marginTop:"1.5rem",color:"#6B6B6B",fontSize:"0.875rem"}}>
            Already a rider?{" "}
            <Link to="/login" style={{color:"#E76F51",textDecoration:"none",fontWeight:600}}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}