import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { MapPin, Users, CheckCircle, Award, TrendingUp, Map } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const BADGES = [
  { id: "first_ride",    emoji: "🏍️", name: "First Ride",         desc: "Started your first route",     condition: s => s.total_routes_started >= 1 },
  { id: "road_warrior", emoji: "⚔️", name: "Road Warrior",        desc: "Completed 1 route",             condition: s => s.total_routes_completed >= 1 },
  { id: "pack_rider",   emoji: "👥", name: "Pack Rider",           desc: "Joined your first batch",       condition: s => s.total_batches >= 1 },
  { id: "himalayan",    emoji: "🏔️", name: "Himalayan Conqueror",  desc: "Complete an Expert route",      condition: s => s.total_routes_completed >= 1 },
  { id: "explorer",     emoji: "🗺️", name: "Explorer",             desc: "Started 3+ routes",             condition: s => s.total_routes_started >= 3 },
  { id: "iron_rider",   emoji: "🔩", name: "Iron Rider",           desc: "Completed 3+ routes",           condition: s => s.total_routes_completed >= 3 },
  { id: "km_500",       emoji: "📍", name: "500 Club",             desc: "Rode 500+ km total",            condition: s => s.total_km >= 500 },
  { id: "km_2000",      emoji: "🚀", name: "2000 Club",            desc: "Rode 2000+ km total",           condition: s => s.total_km >= 2000 },
  { id: "legend",       emoji: "👑", name: "Legend",               desc: "Completed 5+ routes",           condition: s => s.total_routes_completed >= 5 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/dashboard`),
      axios.get(`${API}/api/routes`)
    ]).then(([dRes, rRes]) => {
      setStats(dRes.data);
      setRoutes(rRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", paddingTop: "60px" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏍️</div>
        <p style={{ color: "var(--primary)", fontSize: "1.2rem", fontWeight: 600 }}>Loading dashboard...</p>
      </div>
    </div>
  );

  const earnedBadges = BADGES.filter(b => stats && b.condition(stats));
  const lockedBadges = BADGES.filter(b => !stats || !b.condition(stats));
  const completedRoutes = routes.filter(r => stats?.completed_routes?.includes(r.id));

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingTop: "60px" }}>

      {/* ── Hero ── */}
      <div style={{
        background: "var(--surface)", borderBottom: "1px solid var(--border)",
        padding: "2rem", position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 70% 0%, rgba(45,106,79,0.06) 0%, transparent 60%)"
        }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            {/* Avatar */}
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.8rem", fontWeight: 700, color: "#fff",
              boxShadow: "0 4px 14px rgba(45,106,79,0.25)"
            }}>{user?.name?.charAt(0).toUpperCase()}</div>
            <div>
              <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--text)", letterSpacing: "0.02em", lineHeight: 1 }}>
                {user?.name?.toUpperCase()}
              </h1>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
                {user?.bike_model && (
                  <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>🏍️ {user.bike_model}</span>
                )}
                {user?.city && (
                  <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>📍 {user.city}</span>
                )}
                {user?.experience && (
                  <span style={{
                    background: "rgba(45,106,79,0.10)", color: "var(--primary)",
                    border: "1px solid rgba(45,106,79,0.25)",
                    padding: "0.1rem 0.6rem", borderRadius: "100px",
                    fontSize: "0.7rem", fontWeight: 700
                  }}>{user.experience.toUpperCase()}</span>
                )}
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "1rem" }}>
            {[
              { icon: <MapPin size={18} />,      value: `${stats?.total_km?.toFixed(0) || 0} km`, label: "Total Distance",  color: "var(--accent)",   bg: "rgba(231,111,81,0.08)",  border: "rgba(231,111,81,0.20)" },
              { icon: <CheckCircle size={18} />, value: stats?.total_routes_completed || 0,        label: "Routes Done",     color: "var(--primary)",  bg: "rgba(45,106,79,0.08)",   border: "rgba(45,106,79,0.20)"  },
              { icon: <TrendingUp size={18} />,  value: stats?.total_routes_started || 0,          label: "Routes Started",  color: "#B45309",          bg: "rgba(180,83,9,0.08)",    border: "rgba(180,83,9,0.20)"   },
              { icon: <Users size={18} />,       value: stats?.total_batches || 0,                 label: "Batches Joined",  color: "var(--primary)",  bg: "rgba(45,106,79,0.08)",   border: "rgba(45,106,79,0.20)"  },
              { icon: <Award size={18} />,       value: earnedBadges.length,                       label: "Badges Earned",   color: "#B45309",          bg: "rgba(180,83,9,0.08)",    border: "rgba(180,83,9,0.20)"   },
            ].map(kpi => (
              <div key={kpi.label} style={{
                background: kpi.bg, border: `1px solid ${kpi.border}`,
                borderRadius: "12px", padding: "1.25rem",
                display: "flex", flexDirection: "column", gap: "0.5rem"
              }}>
                <div style={{ color: kpi.color }}>{kpi.icon}</div>
                <div style={{ fontSize: "1.8rem", fontWeight: 700, color: kpi.color, lineHeight: 1 }}>{kpi.value}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.68rem", letterSpacing: "0.08em" }}>{kpi.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem", display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem" }} className="dash-grid">

        {/* Left — Badges */}
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text)", letterSpacing: "0.03em", marginBottom: "1.25rem" }}>
            BADGES & ACHIEVEMENTS
          </h2>

          {/* Earned */}
          {earnedBadges.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
                ✓ EARNED ({earnedBadges.length})
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "0.75rem" }}>
                {earnedBadges.map(badge => (
                  <div key={badge.id} style={{
                    background: "linear-gradient(135deg, rgba(45,106,79,0.08), rgba(231,111,81,0.05))",
                    border: "1px solid rgba(45,106,79,0.20)",
                    borderRadius: "12px", padding: "1.25rem", textAlign: "center"
                  }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{badge.emoji}</div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--primary)", marginBottom: "0.25rem" }}>
                      {badge.name}
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.72rem", lineHeight: 1.4 }}>{badge.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locked */}
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
              🔒 LOCKED ({lockedBadges.length})
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "0.75rem" }}>
              {lockedBadges.map(badge => (
                <div key={badge.id} style={{
                  background: "var(--bg-alt)", border: "1px solid var(--border)",
                  borderRadius: "12px", padding: "1.25rem", textAlign: "center",
                  opacity: 0.55
                }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem", filter: "grayscale(1)" }}>{badge.emoji}</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                    {badge.name}
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.72rem", lineHeight: 1.4 }}>{badge.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Quick Actions + Completed Routes */}
        <div>
          {/* Quick Actions */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text)", letterSpacing: "0.03em", marginBottom: "1rem" }}>
              QUICK ACTIONS
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { label: "Explore Routes",    icon: "🗺️", path: "/explore", color: "var(--primary)" },
                { label: "Track Journey",     icon: "✅", path: "/tracker", color: "#2D6A4F"         },
                { label: "Find Ride Batches", icon: "👥", path: "/connect", color: "var(--accent)"  },
              ].map(a => (
                <button key={a.path} onClick={() => navigate(a.path)} style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.875rem 1rem", background: "var(--surface)",
                  border: "1px solid var(--border)", borderRadius: "10px",
                  cursor: "pointer", transition: "all 0.2s", textAlign: "left",
                  width: "100%", boxShadow: "var(--shadow-sm)"
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
                >
                  <span style={{ fontSize: "1.25rem" }}>{a.icon}</span>
                  <span style={{ fontSize: "0.95rem", fontWeight: 700, color: a.color, letterSpacing: "0.03em" }}>
                    {a.label.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Completed Routes */}
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text)", letterSpacing: "0.03em", marginBottom: "1rem" }}>
              COMPLETED ROUTES
            </h2>
            {completedRoutes.length === 0 ? (
              <div style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "12px", padding: "2rem", textAlign: "center"
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏁</div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 600, margin: "0 0 4px" }}>
                  NO COMPLETED ROUTES YET
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", margin: 0, opacity: 0.7 }}>
                  Start exploring and mark checkpoints!
                </p>
              </div>
            ) : (
              completedRoutes.map(r => (
                <div key={r.id} onClick={() => navigate(`/route/${r.slug}`)} style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.875rem", background: "var(--surface)",
                  border: "1px solid rgba(45,106,79,0.20)", borderRadius: "10px",
                  cursor: "pointer", marginBottom: "0.5rem",
                  transition: "box-shadow 0.2s", boxShadow: "var(--shadow-sm)"
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "var(--shadow-sm)"}
                >
                  <CheckCircle size={18} color="var(--primary)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--primary)" }}>{r.name}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>{r.distance_km} km · {r.duration_days} days</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:900px) {
          .dash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}