import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Map, Users, BarChart3, CheckSquare, LogOut, Menu, X } from "lucide-react";

function MotoMeetLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5C35 5 23 17 23 32C23 52 50 80 50 80C50 80 77 52 77 32C77 17 65 5 50 5Z"
        fill="url(#pinGradNav)" opacity="0.9"/>
      <circle cx="34" cy="38" r="9" stroke="#FF5500" strokeWidth="2.5" fill="none"/>
      <circle cx="34" cy="38" r="3" fill="#FF5500"/>
      <circle cx="66" cy="38" r="9" stroke="#FF5500" strokeWidth="2.5" fill="none"/>
      <circle cx="66" cy="38" r="3" fill="#FF5500"/>
      <path d="M34 38 L46 24 L60 24 L66 38" stroke="#FFA500" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M46 38 L46 24" stroke="#FFA500" strokeWidth="2" fill="none"/>
      <path d="M46 38 L34 38" stroke="#FFA500" strokeWidth="2" fill="none"/>
      <path d="M46 38 L66 38" stroke="#FFA500" strokeWidth="2" fill="none"/>
      <path d="M58 24 L63 20 L67 20" stroke="#FFA500" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="52" cy="21" r="4" fill="#FFA500"/>
      <path d="M52 25 L50 32 L56 30 L54 25Z" fill="#FFA500"/>
      <defs>
        <linearGradient id="pinGradNav" x1="23" y1="5" x2="77" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF5500" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#CC4400" stopOpacity="0.15"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/explore",   label: "Explore",   icon: <Map size={15} /> },
    { to: "/tracker",   label: "Tracker",   icon: <CheckSquare size={15} /> },
    { to: "/connect",   label: "Connect",   icon: <Users size={15} /> },
    { to: "/dashboard", label: "Dashboard", icon: <BarChart3 size={15} /> },
  ];

  const isActive = (path) => location.pathname === path;
  if (location.pathname === "/") return null;

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: "rgba(8,8,8,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,85,0,0.15)",
        padding: "0 1.5rem", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <MotoMeetLogo size={38} />
          <div>
            <div style={{ fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: "1.4rem", color: "#F0F0F0", lineHeight: 1 }}>
              Moto<span style={{ color: "#FF5500" }}>Meet</span>
            </div>
            <div style={{ fontSize: "0.5rem", color: "#FFA500", letterSpacing: "0.2em", lineHeight: 1 }}>
              DISCOVER · RIDE · CONNECT
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }} className="desktop-nav">
          {user && links.map(l => (
            <Link key={l.to} to={l.to} style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              padding: "0.4rem 0.85rem", borderRadius: "6px", textDecoration: "none",
              fontSize: "0.875rem", fontWeight: 600, fontFamily: "Barlow Condensed",
              letterSpacing: "0.05em", transition: "all 0.2s",
              color: isActive(l.to) ? "#FF5500" : "#666",
              background: isActive(l.to) ? "rgba(255,85,0,0.1)" : "transparent",
              border: isActive(l.to) ? "1px solid rgba(255,85,0,0.25)" : "1px solid transparent"
            }}>
              {l.icon}{l.label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {user ? (
            <>
              <div style={{
                background: "linear-gradient(135deg,#FF5500,#FFA500)",
                borderRadius: "50%", width: "32px", height: "32px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.85rem", fontWeight: 700, color: "#000",
                fontFamily: "Barlow Condensed"
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: "#666", fontSize: "0.875rem" }} className="hide-mobile">
                {user.name}
              </span>
              <button onClick={() => { logout(); navigate("/"); }} style={{
                background: "transparent", border: "1px solid #1e1e1e",
                color: "#555", padding: "0.35rem 0.75rem", borderRadius: "6px",
                cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem",
                fontSize: "0.8rem", fontFamily: "Barlow Condensed", letterSpacing: "0.05em"
              }}>
                <LogOut size={13} />
                <span className="hide-mobile">LOGOUT</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                color: "#666", textDecoration: "none", fontSize: "0.875rem",
                padding: "0.4rem 0.85rem", borderRadius: "6px",
                border: "1px solid #1e1e1e", fontFamily: "Barlow Condensed",
                fontWeight: 600, letterSpacing: "0.05em"
              }}>LOGIN</Link>
              <Link to="/register" style={{
                background: "linear-gradient(135deg,#FF5500,#CC4400)",
                color: "white", textDecoration: "none", fontSize: "0.875rem",
                padding: "0.4rem 1rem", borderRadius: "6px",
                fontFamily: "Barlow Condensed", fontWeight: 700,
                letterSpacing: "0.08em"
              }}>SIGN UP</Link>
            </>
          )}
          <button onClick={() => setOpen(!open)} className="mobile-menu-btn"
            style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer", display: "none" }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div style={{
          position: "fixed", top: "60px", left: 0, right: 0, zIndex: 999,
          background: "#0f0f0f", borderBottom: "1px solid #1e1e1e", padding: "1rem"
        }}>
          {user && links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.85rem 1rem", color: isActive(l.to) ? "#FF5500" : "#888",
              textDecoration: "none", borderRadius: "8px", marginBottom: "0.25rem",
              background: isActive(l.to) ? "rgba(255,85,0,0.08)" : "transparent",
              fontFamily: "Barlow Condensed", fontWeight: 600, fontSize: "1rem",
              letterSpacing: "0.05em"
            }}>
              {l.icon}{l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media(max-width:768px){
          .desktop-nav{display:none!important;}
          .mobile-menu-btn{display:flex!important;}
          .hide-mobile{display:none!important;}
        }
      `}</style>
    </>
  );
}