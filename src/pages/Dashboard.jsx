import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { MapPin, Users, CheckCircle, Award, TrendingUp, Map } from "lucide-react";

const API = "http://localhost:8000";

const BADGES = [
  { id: "first_ride",     emoji: "🏍️", name: "First Ride",        desc: "Started your first route",     condition: s => s.total_routes_started >= 1 },
  { id: "road_warrior",  emoji: "⚔️", name: "Road Warrior",       desc: "Completed 1 route",             condition: s => s.total_routes_completed >= 1 },
  { id: "pack_rider",    emoji: "👥", name: "Pack Rider",          desc: "Joined your first batch",       condition: s => s.total_batches >= 1 },
  { id: "himalayan",     emoji: "🏔️", name: "Himalayan Conqueror", desc: "Complete an Expert route",      condition: s => s.total_routes_completed >= 1 },
  { id: "explorer",      emoji: "🗺️", name: "Explorer",            desc: "Started 3+ routes",             condition: s => s.total_routes_started >= 3 },
  { id: "iron_rider",    emoji: "🔩", name: "Iron Rider",          desc: "Completed 3+ routes",           condition: s => s.total_routes_completed >= 3 },
  { id: "km_500",        emoji: "📍", name: "500 Club",            desc: "Rode 500+ km total",            condition: s => s.total_km >= 500 },
  { id: "km_2000",       emoji: "🚀", name: "2000 Club",           desc: "Rode 2000+ km total",           condition: s => s.total_km >= 2000 },
  { id: "legend",        emoji: "👑", name: "Legend",              desc: "Completed 5+ routes",           condition: s => s.total_routes_completed >= 5 },
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
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#080808", paddingTop: "60px" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏍️</div>
        <p style={{ color: "#FF5500", fontFamily: "Barlow Condensed", fontSize: "1.2rem" }}>Loading dashboard...</p>
      </div>
    </div>
  );

  const earnedBadges = BADGES.filter(b => stats && b.condition(stats));
  const lockedBadges = BADGES.filter(b => !stats || !b.condition(stats));
  const completedRoutes = routes.filter(r => stats?.completed_routes?.includes(r.id));

  return (
    <div style={{ background: "#080808", minHeight: "100vh", paddingTop: "60px" }}>

      {/* ── Hero ── */}
      <div style={{
        background: "#0d0d0d", borderBottom: "1px solid #1a1a1a",
        padding: "2rem", position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 70% 0%, rgba(255,184,0,0.05) 0%, transparent 60%)"
        }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "linear-gradient(135deg,#FF5500,#FFB800)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Bebas Neue", fontSize: "2rem", color: "#000"
            }}>{user?.name?.charAt(0).toUpperCase()}</div>
            <div>
              <h1 style={{ fontFamily: "Bebas Neue", fontSize: "2rem", color: "#F0F0F0", letterSpacing: "0.05em", lineHeight: 1 }}>
                {user?.name?.toUpperCase()}
              </h1>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.3rem", flexWrap: "wrap" }}>
                {user?.bike_model && (
                  <span style={{ color: "#555", fontSize: "0.8rem" }}>🏍️ {user.bike_model}</span>
                )}
                {user?.city && (
                  <span style={{ color: "#555", fontSize: "0.8rem" }}>📍 {user.city}</span>
                )}
                <span style={{
                  background: "rgba(0,212,255,0.1)", color: "#00D4FF",
                  border: "1px solid rgba(0,212,255,0.2)",
                  padding: "0.1rem 0.6rem", borderRadius: "100px",
                  fontSize: "0.7rem", fontFamily: "Barlow Condensed", fontWeight: 700
                }}>{user?.experience?.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "1rem" }}>
            {[
              { icon: <MapPin size={18} />, value: `${stats?.total_km?.toFixed(0) || 0} km`, label: "Total Distance", color: "#FF5500" },
              { icon: <CheckCircle size={18} />, value: stats?.total_routes_completed || 0, label: "Routes Done", color: "#22C55E" },
              { icon: <TrendingUp size={18} />, value: stats?.total_routes_started || 0, label: "Routes Started", color: "#FFB800" },
              { icon: <Users size={18} />, value: stats?.total_batches || 0, label: "Batches Joined", color: "#00D4FF" },
              { icon: <Award size={18} />, value: earnedBadges.length, label: "Badges Earned", color: "#FFB800" },
            ].map(kpi => (
              <div key={kpi.label} style={{
                background: "#111", border: "1px solid #1a1a1a",
                borderRadius: "12px", padding: "1.25rem",
                display: "flex", flexDirection: "column", gap: "0.5rem"
              }}>
                <div style={{ color: kpi.color }}>{kpi.icon}</div>
                <div style={{ fontFamily: "Bebas Neue", fontSize: "2rem", color: kpi.color, lineHeight: 1 }}>{kpi.value}</div>
                <div style={{ color: "#444", fontSize: "0.68rem", letterSpacing: "0.08em" }}>{kpi.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem", display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem" }} className="dash-grid">

        {/* Left — Badges */}
        <div>
          <h2 style={{ fontFamily: "Bebas Neue", fontSize: "1.5rem", color: "#F0F0F0", letterSpacing: "0.05em", marginBottom: "1.25rem" }}>
            BADGES & ACHIEVEMENTS
          </h2>

          {/* Earned */}
          {earnedBadges.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ color: "#22C55E", fontSize: "0.75rem", fontFamily: "Barlow Condensed", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
                ✓ EARNED ({earnedBadges.length})
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "0.75rem" }}>
                {earnedBadges.map(badge => (
                  <div key={badge.id} style={{
                    background: "linear-gradient(135deg,rgba(255,184,0,0.08),rgba(255,85,0,0.05))",
                    border: "1px solid rgba(255,184,0,0.2)",
                    borderRadius: "12px", padding: "1.25rem", textAlign: "center"
                  }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{badge.emoji}</div>
                    <div style={{ fontFamily: "Barlow Condensed", fontSize: "0.9rem", fontWeight: 700, color: "#FFB800", marginBottom: "0.25rem" }}>
                      {badge.name}
                    </div>
                    <div style={{ color: "#555", fontSize: "0.72rem", lineHeight: 1.4 }}>{badge.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locked */}
          <div>
            <div style={{ color: "#333", fontSize: "0.75rem", fontFamily: "Barlow Condensed", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
              🔒 LOCKED ({lockedBadges.length})
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "0.75rem" }}>
              {lockedBadges.map(badge => (
                <div key={badge.id} style={{
                  background: "#0d0d0d", border: "1px solid #1a1a1a",
                  borderRadius: "12px", padding: "1.25rem", textAlign: "center",
                  opacity: 0.5
                }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem", filter: "grayscale(1)" }}>{badge.emoji}</div>
                  <div style={{ fontFamily: "Barlow Condensed", fontSize: "0.9rem", fontWeight: 700, color: "#444", marginBottom: "0.25rem" }}>
                    {badge.name}
                  </div>
                  <div style={{ color: "#333", fontSize: "0.72rem", lineHeight: 1.4 }}>{badge.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Completed Routes + Quick Actions */}
        <div>
          {/* Quick Actions */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "Bebas Neue", fontSize: "1.5rem", color: "#F0F0F0", letterSpacing: "0.05em", marginBottom: "1rem" }}>
              QUICK ACTIONS
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { label: "Explore Routes", icon: "🗺️", path: "/explore", color: "#00D4FF" },
                { label: "Track Journey", icon: "✅", path: "/tracker", color: "#22C55E" },
                { label: "Find Ride Batches", icon: "👥", path: "/connect", color: "#FF5500" },
              ].map(a => (
                <button key={a.path} onClick={() => navigate(a.path)} style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.875rem 1rem", background: "#0d0d0d",
                  border: "1px solid #1a1a1a", borderRadius: "10px",
                  cursor: "pointer", transition: "all 0.2s", textAlign: "left",
                  width: "100%"
                }}
                  onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${a.color}30`; e.currentTarget.style.background = "#111"; }}
                  onMouseLeave={e => { e.currentTarget.style.border = "1px solid #1a1a1a"; e.currentTarget.style.background = "#0d0d0d"; }}
                >
                  <span style={{ fontSize: "1.25rem" }}>{a.icon}</span>
                  <span style={{ fontFamily: "Barlow Condensed", fontSize: "0.95rem", fontWeight: 700, color: a.color, letterSpacing: "0.04em" }}>
                    {a.label.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Completed Routes */}
          <div>
            <h2 style={{ fontFamily: "Bebas Neue", fontSize: "1.5rem", color: "#F0F0F0", letterSpacing: "0.05em", marginBottom: "1rem" }}>
              COMPLETED ROUTES
            </h2>
            {completedRoutes.length === 0 ? (
              <div style={{
                background: "#0d0d0d", border: "1px solid #1a1a1a",
                borderRadius: "12px", padding: "2rem", textAlign: "center"
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏁</div>
                <p style={{ color: "#333", fontSize: "0.85rem", fontFamily: "Barlow Condensed" }}>
                  NO COMPLETED ROUTES YET
                </p>
                <p style={{ color: "#2a2a2a", fontSize: "0.75rem", marginTop: "0.3rem" }}>
                  Start exploring and mark checkpoints!
                </p>
              </div>
            ) : (
              completedRoutes.map(r => (
                <div key={r.id} onClick={() => navigate(`/route/${r.slug}`)} style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.875rem", background: "#0d0d0d",
                  border: "1px solid rgba(34,197,94,0.15)", borderRadius: "10px",
                  cursor: "pointer", marginBottom: "0.5rem"
                }}>
                  <CheckCircle size={18} color="#22C55E" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Barlow Condensed", fontSize: "0.95rem", fontWeight: 700, color: "#22C55E" }}>{r.name}</div>
                    <div style={{ color: "#444", fontSize: "0.72rem" }}>{r.distance_km} km · {r.duration_days} days</div>
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