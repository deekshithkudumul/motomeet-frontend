import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Users, Plus, MapPin, Calendar, ChevronRight, X } from "lucide-react";

const API = "http://localhost:8000";

const DIFFICULTY_COLORS = {
  Easy: "#22C55E", Moderate: "#FFB800", Hard: "#EF4444", Expert: "#00D4FF"
};

export default function Connect() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [filterRoute, setFilterRoute] = useState("all");
  const [joining, setJoining] = useState(null);
  const [form, setForm] = useState({
    route_id: "", title: "", start_date: "", end_date: "",
    max_riders: 10, description: ""
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/batches`),
      axios.get(`${API}/api/routes`)
    ]).then(([bRes, rRes]) => {
      setBatches(bRes.data);
      setRoutes(rRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filterRoute === "all"
    ? batches
    : batches.filter(b => b.route_id === parseInt(filterRoute));

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      await axios.post(`${API}/api/batches`, {
        ...form,
        route_id: parseInt(form.route_id),
        max_riders: parseInt(form.max_riders)
      });
      const res = await axios.get(`${API}/api/batches`);
      setBatches(res.data);
      setShowCreate(false);
      setForm({ route_id: "", title: "", start_date: "", end_date: "", max_riders: 10, description: "" });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create batch");
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async (batchId) => {
    setJoining(batchId);
    try {
      await axios.post(`${API}/api/batches/${batchId}/join`);
      navigate(`/batch/${batchId}`);
    } catch (err) {
      alert(err.response?.data?.detail || "Could not join batch");
    } finally {
      setJoining(null);
    }
  };

  const inputStyle = {
    width: "100%", background: "#111", border: "1px solid #1c1c1c",
    borderRadius: "8px", padding: "0.75rem 1rem", color: "#F0F0F0",
    fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
    fontFamily: "Barlow, sans-serif"
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
          background: "radial-gradient(ellipse at 50% 0%, rgba(255,85,0,0.06) 0%, transparent 60%)"
        }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <Users size={20} color="#FF5500" />
                <h1 style={{ fontFamily: "Bebas Neue", fontSize: "2.2rem", color: "#F0F0F0", letterSpacing: "0.05em", lineHeight: 1 }}>
                  RIDE CONNECT
                </h1>
              </div>
              <p style={{ color: "#555", fontSize: "0.9rem" }}>
                Find riders heading the same way. Create a batch or join an existing one.
              </p>
            </div>
            <button onClick={() => setShowCreate(true)} style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              background: "linear-gradient(135deg,#FF5500,#CC4400)",
              border: "none", borderRadius: "10px", color: "white",
              fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: "1rem",
              letterSpacing: "0.08em", cursor: "pointer",
              boxShadow: "0 0 30px rgba(255,85,0,0.2)"
            }}>
              <Plus size={16} /> CREATE BATCH
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "2rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
            {[
              { value: batches.length, label: "Open Batches", color: "#00D4FF" },
              { value: batches.reduce((a, b) => a + b.current_riders, 0), label: "Riders Connected", color: "#FFB800" },
              { value: routes.length, label: "Routes Available", color: "#22C55E" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: "Bebas Neue", fontSize: "1.8rem", color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: "#444", fontSize: "0.72rem", letterSpacing: "0.08em" }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>

        {/* Filter by route */}
        <div style={{ marginBottom: "1.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ color: "#444", fontSize: "0.8rem", fontFamily: "Barlow Condensed", letterSpacing: "0.08em" }}>FILTER:</span>
          <button onClick={() => setFilterRoute("all")} style={{
            padding: "0.35rem 0.9rem", borderRadius: "100px", cursor: "pointer",
            border: filterRoute === "all" ? "1px solid #FF5500" : "1px solid #1c1c1c",
            background: filterRoute === "all" ? "rgba(255,85,0,0.1)" : "transparent",
            color: filterRoute === "all" ? "#FF5500" : "#555",
            fontFamily: "Barlow Condensed", fontSize: "0.8rem", fontWeight: 700
          }}>ALL ROUTES</button>
          {routes.map(r => (
            <button key={r.id} onClick={() => setFilterRoute(String(r.id))} style={{
              padding: "0.35rem 0.9rem", borderRadius: "100px", cursor: "pointer",
              border: filterRoute === String(r.id) ? "1px solid #00D4FF" : "1px solid #1c1c1c",
              background: filterRoute === String(r.id) ? "rgba(0,212,255,0.08)" : "transparent",
              color: filterRoute === String(r.id) ? "#00D4FF" : "#555",
              fontFamily: "Barlow Condensed", fontSize: "0.8rem", fontWeight: 700
            }}>{r.name.split("—")[0].trim()}</button>
          ))}
        </div>

        {/* Batch Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#444" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🏍️</div>
            <p style={{ fontFamily: "Barlow Condensed", fontSize: "1.1rem" }}>Loading batches...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "5rem 2rem",
            background: "#0d0d0d", border: "1px solid #1a1a1a",
            borderRadius: "16px"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👥</div>
            <h3 style={{ fontFamily: "Barlow Condensed", fontSize: "1.4rem", color: "#555", marginBottom: "0.5rem" }}>
              NO OPEN BATCHES YET
            </h3>
            <p style={{ color: "#333", fontSize: "0.9rem", marginBottom: "2rem" }}>
              Be the first to create a batch for this route!
            </p>
            <button onClick={() => setShowCreate(true)} style={{
              padding: "0.75rem 2rem",
              background: "linear-gradient(135deg,#FF5500,#CC4400)",
              border: "none", borderRadius: "10px", color: "white",
              fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: "1rem",
              letterSpacing: "0.08em", cursor: "pointer"
            }}>CREATE FIRST BATCH →</button>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "1rem"
          }}>
            {filtered.map(batch => {
              const route = routes.find(r => r.id === batch.route_id);
              const spotsLeft = batch.max_riders - batch.current_riders;
              const isFull = spotsLeft <= 0;
              return (
                <div key={batch.id} style={{
                  background: "#0d0d0d", border: "1px solid #1a1a1a",
                  borderRadius: "14px", overflow: "hidden", transition: "all 0.2s"
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.border = "1px solid rgba(0,212,255,0.2)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.border = "1px solid #1a1a1a";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Route color bar */}
                  <div style={{
                    height: "3px",
                    background: route ? `linear-gradient(90deg,${DIFFICULTY_COLORS[route.difficulty]},transparent)` : "#333"
                  }} />

                  <div style={{ padding: "1.25rem" }}>
                    {/* Batch title */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                      <h3 style={{
                        fontFamily: "Barlow Condensed", fontSize: "1.15rem", fontWeight: 700,
                        color: "#E0E0E0", letterSpacing: "0.02em", lineHeight: 1.2, flex: 1
                      }}>{batch.title}</h3>
                      <span style={{
                        background: isFull ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
                        color: isFull ? "#EF4444" : "#22C55E",
                        border: `1px solid ${isFull ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
                        padding: "0.15rem 0.6rem", borderRadius: "100px",
                        fontSize: "0.65rem", fontFamily: "Barlow Condensed", fontWeight: 700,
                        marginLeft: "0.5rem", whiteSpace: "nowrap"
                      }}>{isFull ? "FULL" : "OPEN"}</span>
                    </div>

                    {/* Route info */}
                    {route && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
                        <MapPin size={12} color={DIFFICULTY_COLORS[route.difficulty]} />
                        <span style={{ color: "#555", fontSize: "0.78rem" }}>{route.name}</span>
                        <span style={{
                          background: DIFFICULTY_COLORS[route.difficulty] + "15",
                          color: DIFFICULTY_COLORS[route.difficulty],
                          border: `1px solid ${DIFFICULTY_COLORS[route.difficulty]}25`,
                          padding: "0.1rem 0.4rem", borderRadius: "4px",
                          fontSize: "0.62rem", fontFamily: "Barlow Condensed", fontWeight: 700
                        }}>{route.difficulty}</span>
                      </div>
                    )}

                    {/* Description */}
                    {batch.description && (
                      <p style={{ color: "#444", fontSize: "0.8rem", marginBottom: "1rem", lineHeight: 1.6 }}>
                        {batch.description}
                      </p>
                    )}

                    {/* Meta info */}
                    <div style={{ display: "flex", gap: "1.25rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <Calendar size={12} color="#FFB800" />
                        <span style={{ color: "#666", fontSize: "0.78rem" }}>{batch.start_date}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <Users size={12} color="#00D4FF" />
                        <span style={{ color: "#00D4FF", fontSize: "0.78rem", fontWeight: 600 }}>
                          {batch.current_riders}/{batch.max_riders} riders
                        </span>
                        {!isFull && (
                          <span style={{ color: "#444", fontSize: "0.72rem" }}>· {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left</span>
                        )}
                      </div>
                    </div>

                    {/* Rider bar */}
                    <div style={{ marginBottom: "1rem" }}>
                      <div style={{ height: "3px", background: "#111", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: "2px",
                          width: `${(batch.current_riders / batch.max_riders) * 100}%`,
                          background: isFull ? "#EF4444" : "linear-gradient(90deg,#00D4FF,#0099CC)",
                          transition: "width 0.3s"
                        }} />
                      </div>
                    </div>

                    {/* Creator */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                      <div style={{
                        width: "24px", height: "24px", borderRadius: "50%",
                        background: "linear-gradient(135deg,#FF5500,#FFB800)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.7rem", fontWeight: 700, color: "#000", fontFamily: "Barlow Condensed"
                      }}>{batch.creator_name?.charAt(0).toUpperCase()}</div>
                      <span style={{ color: "#444", fontSize: "0.75rem" }}>Created by <span style={{ color: "#666" }}>{batch.creator_name}</span></span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <button
                        onClick={() => navigate(`/batch/${batch.id}`)}
                        style={{
                          flex: 1, padding: "0.6rem",
                          background: "rgba(0,212,255,0.06)",
                          border: "1px solid rgba(0,212,255,0.15)",
                          borderRadius: "8px", color: "#00D4FF",
                          fontFamily: "Barlow Condensed", fontWeight: 700,
                          fontSize: "0.85rem", letterSpacing: "0.06em", cursor: "pointer"
                        }}>VIEW</button>
                      {!isFull && (
                        <button
                          onClick={() => handleJoin(batch.id)}
                          disabled={joining === batch.id}
                          style={{
                            flex: 2, padding: "0.6rem",
                            background: "linear-gradient(135deg,#FF5500,#CC4400)",
                            border: "none", borderRadius: "8px", color: "white",
                            fontFamily: "Barlow Condensed", fontWeight: 700,
                            fontSize: "0.85rem", letterSpacing: "0.06em", cursor: "pointer"
                          }}>
                          {joining === batch.id ? "JOINING..." : "JOIN BATCH →"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Create Batch Modal ── */}
      {showCreate && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 2000,
          background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
        }}>
          <div style={{
            background: "#0f0f0f", border: "1px solid #1c1c1c",
            borderRadius: "20px", padding: "2rem", width: "100%", maxWidth: "520px",
            maxHeight: "90vh", overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "Bebas Neue", fontSize: "1.8rem", color: "#F0F0F0", letterSpacing: "0.05em" }}>
                CREATE BATCH
              </h2>
              <button onClick={() => setShowCreate(false)} style={{
                background: "transparent", border: "none", color: "#555", cursor: "pointer"
              }}><X size={20} /></button>
            </div>

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "8px", padding: "0.75rem", marginBottom: "1rem",
                color: "#EF4444", fontSize: "0.85rem"
              }}>{error}</div>
            )}

            <form onSubmit={handleCreate}>
              {/* Route select */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", color: "#888", fontSize: "0.8rem", fontFamily: "Barlow Condensed", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
                  SELECT ROUTE *
                </label>
                <select value={form.route_id} onChange={e => setForm({ ...form, route_id: e.target.value })}
                  required style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="">Choose a route...</option>
                  {routes.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.distance_km}km)</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", color: "#888", fontSize: "0.8rem", fontFamily: "Barlow Condensed", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
                  BATCH TITLE *
                </label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Leh-Manali Summer Ride 2025" required style={inputStyle} />
              </div>

              {/* Dates */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", color: "#888", fontSize: "0.8rem", fontFamily: "Barlow Condensed", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
                    START DATE *
                  </label>
                  <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })}
                    required style={{ ...inputStyle, colorScheme: "dark" }} />
                </div>
                <div>
                  <label style={{ display: "block", color: "#888", fontSize: "0.8rem", fontFamily: "Barlow Condensed", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
                    END DATE *
                  </label>
                  <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })}
                    required style={{ ...inputStyle, colorScheme: "dark" }} />
                </div>
              </div>

              {/* Max riders */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", color: "#888", fontSize: "0.8rem", fontFamily: "Barlow Condensed", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
                  MAX RIDERS: {form.max_riders}
                </label>
                <input type="range" min="2" max="20" value={form.max_riders}
                  onChange={e => setForm({ ...form, max_riders: e.target.value })}
                  style={{ width: "100%", accentColor: "#FF5500" }} />
                <div style={{ display: "flex", justifyContent: "space-between", color: "#333", fontSize: "0.7rem", marginTop: "0.25rem" }}>
                  <span>2</span><span>20</span>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", color: "#888", fontSize: "0.8rem", fontFamily: "Barlow Condensed", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
                  DESCRIPTION
                </label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Tell riders about your plan, experience level required, what to bring..."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }} />
              </div>

              <button type="submit" disabled={creating} style={{
                width: "100%", padding: "0.9rem",
                background: "linear-gradient(135deg,#FF5500,#CC4400)",
                border: "none", borderRadius: "10px", color: "white",
                fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: "1.1rem",
                letterSpacing: "0.1em", cursor: "pointer",
                boxShadow: "0 0 30px rgba(255,85,0,0.2)"
              }}>
                {creating ? "CREATING..." : "CREATE BATCH →"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}