import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft, MapPin, Clock, Zap, Calendar, AlertTriangle,
  Star, CheckCircle, Circle, Users, ChevronDown, ChevronUp
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";


const DIFFICULTY_COLORS = {
  Easy: "#2D6A4F", Moderate: "#E9C46A", Hard: "#E76F51", Expert: "#A24936"
};

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function createCheckpointIcon(completed, color) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:14px;height:14px;border-radius:50%;
      background:${completed ? color : "#FFFFFF"};
      border:2px solid ${completed ? color : "#B0AFA8"};
      box-shadow:${completed ? `0 0 8px ${color}80` : "0 1px 3px rgba(0,0,0,0.2)"}
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

export default function RouteDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [route, setRoute] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [batches, setBatches] = useState([]);
  const [expandedSection, setExpandedSection] = useState("highlights");
  const [aiGuide, setAiGuide] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/routes/${slug}`)
      .then(res => { setRoute(res.data); setLoading(false); })
      .catch(() => setLoading(false));

    axios.get(`${API}/api/progress`)
      .then(res => setProgress(res.data))
      .catch(() => {});
  }, [slug]);

  useEffect(() => {
    if (route) {
      axios.get(`${API}/api/batches?route_id=${route.id}`)
        .then(res => setBatches(res.data))
        .catch(() => {});
    }
  }, [route]);

  const toggleCheckpoint = async (checkpointId) => {
    const routeProgress = progress.find(p => p.route_id === route.id);
    const completed = routeProgress?.completed_checkpoints || [];
    const isCompleted = completed.includes(checkpointId);

    try {
      const res = await axios.post(`${API}/api/progress/${route.id}/checkpoint`, {
        checkpoint_id: checkpointId,
        completed: !isCompleted
      });
      setProgress(prev => {
        const existing = prev.find(p => p.route_id === route.id);
        if (existing) {
          return prev.map(p => p.route_id === route.id
            ? { ...p, completed_checkpoints: res.data.completed_checkpoints, status: res.data.status }
            : p);
        }
        return [...prev, { route_id: route.id, completed_checkpoints: res.data.completed_checkpoints, status: res.data.status }];
      });
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F4F0", paddingTop: "60px" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏍️</div>
        <p style={{ color: "#E76F51", fontFamily: "Barlow Condensed", fontSize: "1.2rem" }}>Loading route...</p>
      </div>
    </div>
  );

  if (!route) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F4F0", paddingTop: "60px" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#DC2626", fontFamily: "Barlow Condensed", fontSize: "1.2rem" }}>Route not found</p>
        <button onClick={() => navigate("/explore")} style={{ marginTop: "1rem", padding: "0.5rem 1rem", background: "#E76F51", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" }}>Back to Explore</button>
      </div>
    </div>
  );

  const routeProgress = progress.find(p => p.route_id === route.id);
  const completedCheckpoints = routeProgress?.completed_checkpoints || [];
  const totalCheckpoints = route.checkpoints?.length || 0;
  const progressPercent = totalCheckpoints > 0 ? Math.round((completedCheckpoints.length / totalCheckpoints) * 100) : 0;
  const diffColor = DIFFICULTY_COLORS[route.difficulty];
  const coords = route.waypoints?.map(w => [w.lat, w.lng]) || [];
  const center = coords.length > 0 ? coords[Math.floor(coords.length / 2)] : [22.5, 80];

  const TABS = ["overview", "checkpoints", "batches", "ai guide"];
  return (
    <div style={{ background: "#F5F4F0", minHeight: "100vh", paddingTop: "60px" }}>

      {/* ── Hero Banner ── */}
      <div style={{
        position: "relative", height: "320px", overflow: "hidden",
        background: "linear-gradient(135deg,#2D6A4F,#1B4332)"
      }}>
        {route.image_url && (
          <img src={route.image_url} alt={route.name} style={{
            width: "100%", height: "100%", objectFit: "cover",
            filter: "brightness(0.8) saturate(1.1)"
          }} />
        )}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(27,67,50,0.25) 0%, rgba(27,67,50,0.85) 100%)"
        }} />

        {/* Back button */}
        <button onClick={() => navigate("/explore")} style={{
          position: "absolute", top: "1.5rem", left: "1.5rem",
          background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)",
          border: "1px solid #E5E1DB", borderRadius: "8px",
          color: "#1A1A1A", padding: "0.5rem 1rem", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "0.4rem",
          fontFamily: "Barlow Condensed", fontSize: "0.85rem", fontWeight: 600
        }}>
          <ArrowLeft size={14} /> BACK
        </button>

        {/* Hero content */}
        <div style={{ position: "absolute", bottom: "2rem", left: "2rem", right: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
            <span style={{
              background: diffColor + "30", color: "#FFFFFF",
              border: `1px solid ${diffColor}80`,
              padding: "0.3rem 0.9rem", borderRadius: "100px",
              fontSize: "0.75rem", fontFamily: "Barlow Condensed", fontWeight: 700, letterSpacing: "0.08em"
            }}>{route.difficulty.toUpperCase()}</span>
            <span style={{ color: "#E5E1DB", fontSize: "0.8rem" }}>📍 {route.states}</span>
            <span style={{ color: "#E5E1DB", fontSize: "0.8rem" }}>🗓️ Best: {route.best_months}</span>
          </div>
          <h1 style={{
            fontFamily: "Bebas Neue", fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "#FFFFFF", letterSpacing: "0.03em", lineHeight: 1, marginBottom: "1rem"
          }}>{route.name}</h1>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {[
              { icon: <MapPin size={14} />, value: `${route.distance_km} km`, label: "Distance", color: "#7FB89A" },
              { icon: <Clock size={14} />, value: `${route.duration_days} Days`, label: "Duration", color: "#E9C46A" },
              { icon: <Zap size={14} />, value: `${route.elevation_gain}m`, label: "Elevation", color: "#7FB89A" },
              { icon: <MapPin size={14} />, value: route.start_point, label: "Start", color: "#F4A688" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ color: s.color }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily: "Barlow Condensed", fontSize: "1rem", fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ color: "#E5E1DB", fontSize: "0.65rem", letterSpacing: "0.06em" }}>{s.label.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      {progressPercent > 0 && (
        <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E5E1DB", padding: "0.75rem 2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
            <span style={{ color: "#6B6B6B", fontSize: "0.75rem", fontFamily: "Barlow Condensed", letterSpacing: "0.08em" }}>
              YOUR PROGRESS
            </span>
            <span style={{ color: diffColor, fontFamily: "Barlow Condensed", fontSize: "0.9rem", fontWeight: 700 }}>
              {completedCheckpoints.length}/{totalCheckpoints} CHECKPOINTS · {progressPercent}%
            </span>
          </div>
          <div style={{ height: "4px", background: "#E5E1DB", borderRadius: "2px" }}>
            <div style={{
              height: "100%", borderRadius: "2px",
              width: `${progressPercent}%`,
              background: `linear-gradient(90deg,${diffColor},${diffColor}aa)`,
              transition: "width 0.4s ease"
            }} />
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "2rem", display: "grid", gridTemplateColumns: "1fr 420px", gap: "2rem" }} className="route-grid">

        {/* Left column */}
        <div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: "0", borderBottom: "1px solid #E5E1DB", marginBottom: "2rem" }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: "0.75rem 1.5rem", background: "transparent",
                border: "none", borderBottom: activeTab === tab ? `2px solid #E76F51` : "2px solid transparent",
                color: activeTab === tab ? "#E76F51" : "#6B6B6B",
                fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: "0.9rem",
                letterSpacing: "0.08em", cursor: "pointer", textTransform: "uppercase"
              }}>{tab}</button>
            ))}
          </div>

          {/* Tab: Overview */}
          {activeTab === "overview" && (
            <div>
              <p style={{ color: "#555550", lineHeight: 1.8, fontSize: "0.95rem", marginBottom: "2rem" }}>
                {route.description}
              </p>

              {/* Highlights */}
              {[
                { key: "highlights", label: "🌟 Highlights", content: route.highlights, color: "#C58A2E" },
                { key: "warnings", label: "⚠️ Warnings", content: route.warnings, color: "#DC2626" },
              ].map(section => (
                <div key={section.key} style={{
                  background: "#FFFFFF", border: `1px solid ${section.color}30`,
                  borderRadius: "12px", marginBottom: "1rem", overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                }}>
                  <button
                    onClick={() => setExpandedSection(expandedSection === section.key ? null : section.key)}
                    style={{
                      width: "100%", padding: "1rem 1.25rem",
                      background: "transparent", border: "none",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      cursor: "pointer"
                    }}
                  >
                    <span style={{ fontFamily: "Barlow Condensed", fontSize: "1rem", fontWeight: 700, color: section.color, letterSpacing: "0.05em" }}>
                      {section.label.toUpperCase()}
                    </span>
                    {expandedSection === section.key ? <ChevronUp size={16} color="#6B6B6B" /> : <ChevronDown size={16} color="#6B6B6B" />}
                  </button>
                  {expandedSection === section.key && (
                    <div style={{ padding: "0 1.25rem 1.25rem" }}>
                      {section.content?.split(",").map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.5rem" }}>
                          <span style={{ color: section.color, marginTop: "0.1rem", fontSize: "0.8rem" }}>▸</span>
                          <span style={{ color: "#555550", fontSize: "0.875rem", lineHeight: 1.6 }}>{item.trim()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tab: Checkpoints */}
          {activeTab === "checkpoints" && (
            <div>
              <p style={{ color: "#6B6B6B", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                Click checkpoints to mark them as completed. Track your progress across the route.
              </p>
              {route.checkpoints?.map((cp, i) => {
                const isCompleted = completedCheckpoints.includes(cp.id);
                return (
                  <div key={cp.id} onClick={() => toggleCheckpoint(cp.id)} style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    padding: "1rem 1.25rem",
                    border: `1px solid ${isCompleted ? diffColor + "40" : "#E5E1DB"}`,
                    borderRadius: "10px", marginBottom: "0.5rem",
                    cursor: "pointer", transition: "all 0.2s",
                    background: isCompleted ? diffColor + "0d" : "#FFFFFF",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                  }}>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      background: isCompleted ? diffColor + "20" : "#F8F7F4",
                      border: `2px solid ${isCompleted ? diffColor : "#D8D6D0"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0
                    }}>
                      {isCompleted
                        ? <CheckCircle size={14} color={diffColor} />
                        : <span style={{ color: "#9B9B9B", fontSize: "0.7rem", fontFamily: "Barlow Condensed", fontWeight: 700 }}>{i + 1}</span>
                      }
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "Barlow Condensed", fontSize: "1rem", fontWeight: 700, color: isCompleted ? diffColor : "#1A1A1A", letterSpacing: "0.02em" }}>
                        {cp.name}
                      </div>
                      <div style={{ color: "#9B9B9B", fontSize: "0.72rem", marginTop: "0.2rem" }}>
                        {cp.lat.toFixed(4)}°N, {cp.lng.toFixed(4)}°E
                      </div>
                    </div>
                    {isCompleted && (
                      <span style={{ color: diffColor, fontSize: "0.72rem", fontFamily: "Barlow Condensed", fontWeight: 700 }}>✓ DONE</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab: Batches */}
          {activeTab === "batches" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <p style={{ color: "#6B6B6B", fontSize: "0.85rem" }}>
                  {batches.length} open batch{batches.length !== 1 ? "es" : ""} for this route
                </p>
                <button onClick={() => navigate("/connect")} style={{
                  padding: "0.5rem 1.25rem", background: "linear-gradient(135deg,#E76F51,#C85A3F)",
                  border: "none", borderRadius: "8px", color: "white",
                  fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: "0.85rem",
                  letterSpacing: "0.06em", cursor: "pointer"
                }}>+ CREATE BATCH</button>
              </div>

              {batches.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#9B9B9B" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>👥</div>
                  <p style={{ fontFamily: "Barlow Condensed", fontSize: "1rem" }}>No open batches yet</p>
                  <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>Be the first to create one!</p>
                </div>
              ) : (
                batches.map(batch => (
                  <div key={batch.id} style={{
                    background: "#FFFFFF", border: "1px solid #E5E1DB",
                    borderRadius: "12px", padding: "1.25rem", marginBottom: "1rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                      <h3 style={{ fontFamily: "Barlow Condensed", fontSize: "1.1rem", fontWeight: 700, color: "#1A1A1A" }}>{batch.title}</h3>
                      <span style={{
                        background: "rgba(45,106,79,0.1)", color: "#2D6A4F",
                        border: "1px solid rgba(45,106,79,0.25)",
                        padding: "0.2rem 0.6rem", borderRadius: "100px",
                        fontSize: "0.7rem", fontFamily: "Barlow Condensed", fontWeight: 700
                      }}>OPEN</span>
                    </div>
                    <div style={{ display: "flex", gap: "1.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                      <span style={{ color: "#6B6B6B", fontSize: "0.8rem" }}>📅 {batch.start_date}</span>
                      <span style={{ color: "#6B6B6B", fontSize: "0.8rem" }}>
                        <Users size={12} style={{ display: "inline", marginRight: "4px" }} />
                        {batch.current_riders}/{batch.max_riders} Riders
                      </span>
                      <span style={{ color: "#6B6B6B", fontSize: "0.8rem" }}>👤 {batch.creator_name}</span>
                    </div>
                    <button onClick={() => navigate(`/batch/${batch.id}`)} style={{
                      width: "100%", padding: "0.6rem",
                      background: "rgba(45,106,79,0.08)", border: "1px solid rgba(45,106,79,0.25)",
                      borderRadius: "8px", color: "#2D6A4F",
                      fontFamily: "Barlow Condensed", fontWeight: 700,
                      fontSize: "0.85rem", letterSpacing: "0.06em", cursor: "pointer"
                    }}>VIEW BATCH →</button>
                  </div>
                ))
              )}
            </div>
          )}
        {/* Tab: AI Guide */}
        {activeTab === "ai guide" && (
          <div>
            {!aiGuide && !aiLoading && (
              <div style={{
                textAlign: "center", padding: "3rem",
                background: "#FFFFFF", border: "1px solid #E5E1DB",
                borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤖</div>
                <h3 style={{ fontFamily: "Barlow Condensed", fontSize: "1.4rem", color: "#1A1A1A", marginBottom: "0.5rem" }}>
                  AI RIDING GUIDE
                </h3>
                <p style={{ color: "#6B6B6B", fontSize: "0.9rem", marginBottom: "2rem", maxWidth: "400px", margin: "0 auto 2rem" }}>
                  Get a personalized riding guide for this route powered by Groq AI — preparation tips, must stops, safety warnings and more.
                </p>
                <button onClick={async () => {
                  setAiLoading(true);
                  try {
                    const res = await axios.post(`${API}/api/ai/route-guide`, {
                      route_name: route.name,
                      difficulty: route.difficulty,
                      distance_km: route.distance_km,
                      duration_days: route.duration_days,
                      states: route.states,
                      highlights: route.highlights,
                      experience_level: user?.experience || "Beginner"
                    });
                    setAiGuide(res.data.guide);
                  } catch (err) {
                    alert("AI guide unavailable. Check your API key.");
                  } finally {
                    setAiLoading(false);
                  }
                }} style={{
                  padding: "0.9rem 2.5rem",
                  background: "linear-gradient(135deg,#E76F51,#C85A3F)",
                  border: "none", borderRadius: "10px", color: "white",
                  fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: "1.1rem",
                  letterSpacing: "0.1em", cursor: "pointer",
                  boxShadow: "0 8px 30px rgba(231,111,81,0.25)"
                }}>
                  ✨ GENERATE MY RIDING GUIDE
                </button>
              </div>
            )}

            {aiLoading && (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem", animation: "spin 1s linear infinite", display: "inline-block" }}>⚙️</div>
                <p style={{ color: "#E76F51", fontFamily: "Barlow Condensed", fontSize: "1.1rem" }}>
                  Generating your personalized guide...
                </p>
                <p style={{ color: "#9B9B9B", fontSize: "0.85rem", marginTop: "0.5rem" }}>Powered by Groq llama-3.3-70b</p>
              </div>
            )}

            {aiGuide && (
              <div>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: "1.5rem"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1.5rem" }}>🤖</span>
                    <span style={{ fontFamily: "Barlow Condensed", fontSize: "1rem", fontWeight: 700, color: "#E76F51", letterSpacing: "0.05em" }}>
                      AI GENERATED GUIDE
                    </span>
                  </div>
                  <button onClick={() => setAiGuide(null)} style={{
                    background: "transparent", border: "1px solid #E5E1DB",
                    borderRadius: "6px", color: "#6B6B6B", padding: "0.3rem 0.75rem",
                    cursor: "pointer", fontSize: "0.75rem", fontFamily: "Barlow Condensed"
                  }}>REGENERATE</button>
                </div>

                <div style={{
                  background: "#FFFFFF", border: "1px solid rgba(231,111,81,0.2)",
                  borderRadius: "14px", padding: "1.5rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                }}>
                  {aiGuide.split("\n").map((line, i) => {
                    const isHeader = line.match(/^\d+\.|^#{1,3}/);
                    const isBullet = line.startsWith("-") || line.startsWith("•") || line.startsWith("*");
                    if (!line.trim()) return <div key={i} style={{ height: "0.75rem" }} />;
                    return (
                      <p key={i} style={{
                        color: isHeader ? "#E76F51" : isBullet ? "#3A3A3A" : "#555550",
                        fontFamily: isHeader ? "Barlow Condensed" : "Barlow, sans-serif",
                        fontSize: isHeader ? "1rem" : "0.875rem",
                        fontWeight: isHeader ? 700 : 400,
                        letterSpacing: isHeader ? "0.06em" : "normal",
                        lineHeight: 1.7,
                        marginBottom: "0.25rem",
                        paddingLeft: isBullet ? "0.5rem" : "0"
                      }}>{line}</p>
                    );
                  })}
                </div>

                <p style={{ color: "#9B9B9B", fontSize: "0.72rem", marginTop: "1rem", textAlign: "center" }}>
                  Generated by Groq llama-3.3-70b · Personalized for {user?.experience} riders
                </p>
              </div>
            )}
          </div>
        )}
        </div>
        {/* Right column — Map */}
        <div style={{ position: "sticky", top: "80px", height: "calc(100vh - 100px)" }}>
          <div style={{
            background: "#FFFFFF", border: "1px solid #E5E1DB",
            borderRadius: "14px", overflow: "hidden", height: "100%",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
          }}>
            <div style={{
              padding: "0.75rem 1rem", borderBottom: "1px solid #E5E1DB",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <span style={{ fontFamily: "Barlow Condensed", fontSize: "0.9rem", fontWeight: 700, color: "#6B6B6B", letterSpacing: "0.08em" }}>
                ROUTE MAP
              </span>
              <span style={{ color: diffColor, fontSize: "0.8rem", fontFamily: "Barlow Condensed", fontWeight: 700 }}>
                {route.start_point} → {route.end_point}
              </span>
            </div>
            <MapContainer center={center} zoom={7} style={{ height: "calc(100% - 48px)", width: "100%" }} zoomControl={true}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                maxZoom={19}
              />
              <Polyline
                positions={coords}
                pathOptions={{ color: diffColor, weight: 4, opacity: 0.9 }}
              />
              {route.checkpoints?.map((cp, i) => {
                const isCompleted = completedCheckpoints.includes(cp.id);
                return (
                  <Marker key={cp.id} position={[cp.lat, cp.lng]}
                    icon={createCheckpointIcon(isCompleted, diffColor)}>
                    <Popup>
                      <div style={{ fontFamily: "Barlow Condensed", fontSize: "0.9rem" }}>
                        <strong>{i + 1}. {cp.name}</strong>
                        {isCompleted && <span style={{ color: "#2D6A4F" }}> ✓</span>}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width: 900px) {
          .route-grid { grid-template-columns: 1fr !important; }
        }
        .leaflet-popup-content-wrapper {
          background: #FFFFFF;
          color: #1A1A1A;
          border-radius: 8px;
        }
        .leaflet-popup-tip {
          background: #FFFFFF;
        }
      `}</style>
    </div> 
  );
}