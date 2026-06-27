import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, Circle, MapPin, Clock, Zap, ChevronRight } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";


const DIFFICULTY_COLORS = {
  Easy: "#22C55E", Moderate: "#FFB800", Hard: "#EF4444", Expert: "#00D4FF"
};

export default function Tracker() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/routes`),
      axios.get(`${API}/api/progress`)
    ]).then(([rRes, pRes]) => {
      setRoutes(rRes.data);
      setProgress(pRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const getRouteProgress = (routeId) => progress.find(p => p.route_id === routeId);

  const routesWithProgress = routes.map(r => {
    const p = getRouteProgress(r.id);
    return {
      ...r,
      status: p?.status || "not_started",
      completed_checkpoints: p?.completed_checkpoints || [],
    };
  });

  const filtered = routesWithProgress.filter(r => {
    if (filter === "all") return true;
    if (filter === "started") return r.status === "in_progress";
    if (filter === "completed") return r.status === "completed";
    if (filter === "not_started") return r.status === "not_started";
    return true;
  });

  const totalKm = routesWithProgress
    .filter(r => r.status === "completed")
    .reduce((sum, r) => sum + r.distance_km, 0);

  const completedCount = routesWithProgress.filter(r => r.status === "completed").length;
  const inProgressCount = routesWithProgress.filter(r => r.status === "in_progress").length;

  const STATUS_CONFIG = {
    completed:   { label: "COMPLETED",   color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
    in_progress: { label: "IN PROGRESS", color: "#FFB800", bg: "rgba(255,184,0,0.1)" },
    not_started: { label: "NOT STARTED", color: "#333",    bg: "rgba(255,255,255,0.03)" },
  };

  return (
    <div style={{ background: "#080808", minHeight: "100vh", paddingTop: "60px" }}>

      {/* ── Header ── */}
      <div style={{
        background: "#0d0d0d", borderBottom: "1px solid #1a1a1a",
        padding: "2rem", position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 30% 0%, rgba(0,212,255,0.05) 0%, transparent 60%)"
        }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h1 style={{
            fontFamily: "Bebas Neue", fontSize: "2.2rem", color: "#F0F0F0",
            letterSpacing: "0.05em", lineHeight: 1, marginBottom: "0.5rem"
          }}>JOURNEY TRACKER</h1>
          <p style={{ color: "#555", fontSize: "0.9rem", marginBottom: "2rem" }}>
            Track your progress across India's greatest bike routes
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {[
              { value: `${totalKm.toFixed(0)} km`, label: "Total KMs Ridden", color: "#FF5500" },
              { value: completedCount, label: "Routes Completed", color: "#22C55E" },
              { value: inProgressCount, label: "In Progress", color: "#FFB800" },
              { value: routes.length - completedCount - inProgressCount, label: "Yet to Explore", color: "#444" },
            ].map(s => (
              <div key={s.label} style={{
                background: "#111", border: "1px solid #1a1a1a",
                borderRadius: "12px", padding: "1rem 1.5rem", flex: "1", minWidth: "120px"
              }}>
                <div style={{ fontFamily: "Bebas Neue", fontSize: "2rem", color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: "#444", fontSize: "0.7rem", marginTop: "0.3rem", letterSpacing: "0.08em" }}>
                  {s.label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem" }}>

        {/* Overall progress bar */}
        <div style={{
          background: "#0d0d0d", border: "1px solid #1a1a1a",
          borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem" }}>
            <span style={{ color: "#555", fontSize: "0.8rem", fontFamily: "Barlow Condensed", letterSpacing: "0.08em" }}>
              OVERALL INDIA PROGRESS
            </span>
            <span style={{ color: "#FF5500", fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: "0.9rem" }}>
              {completedCount}/{routes.length} ROUTES
            </span>
          </div>
          <div style={{ height: "6px", background: "#111", borderRadius: "3px" }}>
            <div style={{
              height: "100%", borderRadius: "3px",
              width: `${routes.length > 0 ? (completedCount / routes.length) * 100 : 0}%`,
              background: "linear-gradient(90deg,#FF5500,#FFB800)",
              transition: "width 0.5s ease"
            }} />
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {[
            { key: "all", label: "ALL ROUTES", count: routes.length },
            { key: "completed", label: "COMPLETED", count: completedCount },
            { key: "started", label: "IN PROGRESS", count: inProgressCount },
            { key: "not_started", label: "NOT STARTED", count: routes.length - completedCount - inProgressCount },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: "0.4rem 1rem", borderRadius: "100px", cursor: "pointer",
              border: filter === f.key ? "1px solid #FF5500" : "1px solid #1c1c1c",
              background: filter === f.key ? "rgba(255,85,0,0.1)" : "transparent",
              color: filter === f.key ? "#FF5500" : "#555",
              fontFamily: "Barlow Condensed", fontSize: "0.78rem", fontWeight: 700,
              letterSpacing: "0.06em"
            }}>
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {/* Route cards */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#444" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🏍️</div>
            <p style={{ fontFamily: "Barlow Condensed" }}>Loading your journey...</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {filtered.map(route => {
              const totalCp = route.checkpoints?.length || 0;
              const completedCp = route.completed_checkpoints.length;
              const percent = totalCp > 0 ? Math.round((completedCp / totalCp) * 100) : 0;
              const status = STATUS_CONFIG[route.status];
              const diffColor = DIFFICULTY_COLORS[route.difficulty];

              return (
                <div key={route.id} style={{
                  background: "#0d0d0d", border: "1px solid #1a1a1a",
                  borderRadius: "12px", overflow: "hidden",
                  cursor: "pointer", transition: "all 0.2s"
                }}
                  onClick={() => navigate(`/route/${route.slug}`)}
                  onMouseEnter={e => {
                    e.currentTarget.style.border = `1px solid ${diffColor}30`;
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.border = "1px solid #1a1a1a";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  {/* Progress bar on top */}
                  {route.status !== "not_started" && (
                    <div style={{ height: "2px", background: "#111" }}>
                      <div style={{
                        height: "100%", width: `${percent}%`,
                        background: route.status === "completed"
                          ? "#22C55E"
                          : `linear-gradient(90deg,${diffColor},${diffColor}80)`,
                        transition: "width 0.4s"
                      }} />
                    </div>
                  )}

                  <div style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
                    {/* Status icon */}
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "50%",
                      background: status.bg, border: `1px solid ${status.color}25`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0
                    }}>
                      {route.status === "completed"
                        ? <CheckCircle size={20} color="#22C55E" />
                        : route.status === "in_progress"
                          ? <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#FFB800", animation: "pulse 2s infinite" }} />
                          : <Circle size={20} color="#333" />
                      }
                    </div>

                    {/* Route info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.3rem", flexWrap: "wrap" }}>
                        <h3 style={{
                          fontFamily: "Barlow Condensed", fontSize: "1.05rem", fontWeight: 700,
                          color: route.status === "completed" ? "#22C55E" : "#D0D0D0",
                          letterSpacing: "0.02em"
                        }}>{route.name}</h3>
                        <span style={{
                          background: status.bg, color: status.color,
                          border: `1px solid ${status.color}25`,
                          padding: "0.1rem 0.5rem", borderRadius: "4px",
                          fontSize: "0.62rem", fontFamily: "Barlow Condensed", fontWeight: 700,
                          letterSpacing: "0.06em"
                        }}>{status.label}</span>
                        <span style={{
                          background: diffColor + "15", color: diffColor,
                          border: `1px solid ${diffColor}25`,
                          padding: "0.1rem 0.5rem", borderRadius: "4px",
                          fontSize: "0.62rem", fontFamily: "Barlow Condensed", fontWeight: 700
                        }}>{route.difficulty}</span>
                      </div>

                      <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#444", fontSize: "0.75rem" }}>
                          <MapPin size={11} color="#FF5500" /> {route.states}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#444", fontSize: "0.75rem" }}>
                          <Clock size={11} color="#FFB800" /> {route.duration_days} days
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#444", fontSize: "0.75rem" }}>
                          <Zap size={11} color="#666" /> {route.distance_km} km
                        </span>
                        {route.status !== "not_started" && (
                          <span style={{ color: diffColor, fontSize: "0.75rem", fontFamily: "Barlow Condensed", fontWeight: 700 }}>
                            {completedCp}/{totalCp} checkpoints · {percent}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight size={18} color="#333" style={{ flexShrink: 0 }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}