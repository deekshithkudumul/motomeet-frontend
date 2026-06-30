import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Users, Plus, MapPin, Calendar, ChevronRight, X } from "lucide-react";

const API = "http://localhost:8000";

const DIFFICULTY_COLORS = {
  Easy:     { bg: "rgba(45,106,79,0.10)",  text: "#2D6A4F", border: "rgba(45,106,79,0.25)"  },
  Moderate: { bg: "rgba(180,83,9,0.10)",   text: "#B45309", border: "rgba(180,83,9,0.25)"   },
  Hard:     { bg: "rgba(239,68,68,0.10)",  text: "#DC2626", border: "rgba(239,68,68,0.25)"  },
  Expert:   { bg: "rgba(231,111,81,0.12)", text: "#E76F51", border: "rgba(231,111,81,0.30)" },
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
    width: "100%", background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: "8px", padding: "0.75rem 1rem", color: "var(--text)",
    fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
    fontFamily: "var(--font-sans)", colorScheme: "light"
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingTop: "60px" }}>

      {/* ── Header ── */}
      <div style={{
        background: "var(--surface)", borderBottom: "1px solid var(--border)",
        padding: "2rem", position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(45,106,79,0.06) 0%, transparent 60%)"
        }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <Users size={20} color="var(--accent)" />
                <h1 style={{ fontSize: "2rem", color: "var(--text)", fontWeight: 700, letterSpacing: "0.02em", lineHeight: 1 }}>
                  RIDE CONNECT
                </h1>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
                Find riders heading the same way. Create a batch or join an existing one.
              </p>
            </div>
            <button onClick={() => setShowCreate(true)} style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              background: "var(--primary)",
              border: "none", borderRadius: "10px", color: "white",
              fontWeight: 700, fontSize: "1rem",
              letterSpacing: "0.05em", cursor: "pointer",
              boxShadow: "0 4px 14px rgba(45,106,79,0.25)",
              transition: "background 0.2s"
            }}>
              <Plus size={16} /> CREATE BATCH
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "2.5rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
            {[
              { value: batches.length, label: "Open Batches", color: "var(--primary)" },
              { value: batches.reduce((a, b) => a + b.current_riders, 0), label: "Riders Connected", color: "#B45309" },
              { value: routes.length, label: "Routes Available", color: "var(--accent)" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: "1.8rem", fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.72rem", letterSpacing: "0.08em", marginTop: 2 }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>

        {/* Filter by route */}
        <div style={{ marginBottom: "1.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.08em" }}>FILTER:</span>
          <button onClick={() => setFilterRoute("all")} style={{
            padding: "0.35rem 0.9rem", borderRadius: "100px", cursor: "pointer",
            border: filterRoute === "all" ? "1px solid var(--primary)" : "1px solid var(--border)",
            background: filterRoute === "all" ? "rgba(45,106,79,0.10)" : "transparent",
            color: filterRoute === "all" ? "var(--primary)" : "var(--text-muted)",
            fontSize: "0.8rem", fontWeight: 700, transition: "all 0.15s"
          }}>ALL ROUTES</button>
          {routes.map(r => (
            <button key={r.id} onClick={() => setFilterRoute(String(r.id))} style={{
              padding: "0.35rem 0.9rem", borderRadius: "100px", cursor: "pointer",
              border: filterRoute === String(r.id) ? "1px solid var(--accent)" : "1px solid var(--border)",
              background: filterRoute === String(r.id) ? "rgba(231,111,81,0.10)" : "transparent",
              color: filterRoute === String(r.id) ? "var(--accent)" : "var(--text-muted)",
              fontSize: "0.8rem", fontWeight: 700, transition: "all 0.15s"
            }}>{r.name.split("—")[0].trim()}</button>
          ))}
        </div>

        {/* Batch Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🏍️</div>
            <p style={{ fontSize: "1.1rem" }}>Loading batches...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "5rem 2rem",
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "16px"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👥</div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              NO OPEN BATCHES YET
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "2rem" }}>
              Be the first to create a batch for this route!
            </p>
            <button onClick={() => setShowCreate(true)} style={{
              padding: "0.75rem 2rem",
              background: "var(--accent)",
              border: "none", borderRadius: "10px", color: "white",
              fontWeight: 700, fontSize: "1rem",
              letterSpacing: "0.05em", cursor: "pointer"
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
              const diff = route ? DIFFICULTY_COLORS[route.difficulty] : null;
              return (
                <div key={batch.id} style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "14px", overflow: "hidden", transition: "all 0.2s",
                  boxShadow: "var(--shadow-sm)"
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Route color bar */}
                  <div style={{
                    height: "3px",
                    background: diff ? `linear-gradient(90deg,${diff.text},transparent)` : "var(--border)"
                  }} />

                  <div style={{ padding: "1.25rem" }}>
                    {/* Batch title */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                      <h3 style={{
                        fontSize: "1.1rem", fontWeight: 700,
                        color: "var(--text)", lineHeight: 1.2, flex: 1
                      }}>{batch.title}</h3>
                      <span style={{
                        background: isFull ? "rgba(239,68,68,0.10)" : "rgba(45,106,79,0.10)",
                        color: isFull ? "#DC2626" : "var(--primary)",
                        border: `1px solid ${isFull ? "rgba(239,68,68,0.25)" : "rgba(45,106,79,0.25)"}`,
                        padding: "0.15rem 0.6rem", borderRadius: "100px",
                        fontSize: "0.65rem", fontWeight: 700,
                        marginLeft: "0.5rem", whiteSpace: "nowrap"
                      }}>{isFull ? "FULL" : "OPEN"}</span>
                    </div>

                    {/* Route info */}
                    {route && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
                        <MapPin size={12} color={diff?.text} />
                        <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{route.name}</span>
                        <span style={{
                          background: diff?.bg, color: diff?.text,
                          border: `1px solid ${diff?.border}`,
                          padding: "0.1rem 0.4rem", borderRadius: "4px",
                          fontSize: "0.62rem", fontWeight: 700
                        }}>{route.difficulty}</span>
                      </div>
                    )}

                    {/* Description */}
                    {batch.description && (
                      <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "1rem", lineHeight: 1.6 }}>
                        {batch.description}
                      </p>
                    )}

                    {/* Meta info */}
                    <div style={{ display: "flex", gap: "1.25rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <Calendar size={12} color="#B45309" />
                        <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{batch.start_date}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <Users size={12} color="var(--primary)" />
                        <span style={{ color: "var(--primary)", fontSize: "0.78rem", fontWeight: 600 }}>
                          {batch.current_riders}/{batch.max_riders} riders
                        </span>
                        {!isFull && (
                          <span style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>· {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left</span>
                        )}
                      </div>
                    </div>

                    {/* Rider fill bar */}
                    <div style={{ marginBottom: "1rem" }}>
                      <div style={{ height: "4px", background: "var(--bg-alt)", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: "2px",
                          width: `${(batch.current_riders / batch.max_riders) * 100}%`,
                          background: isFull ? "#DC2626" : "var(--primary)",
                          transition: "width 0.3s"
                        }} />
                      </div>
                    </div>

                    {/* Creator */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                      <div style={{
                        width: "24px", height: "24px", borderRadius: "50%",
                        background: "var(--accent)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.7rem", fontWeight: 700, color: "#fff"
                      }}>{batch.creator_name?.charAt(0).toUpperCase()}</div>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                        Created by <span style={{ color: "var(--text)", fontWeight: 600 }}>{batch.creator_name}</span>
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <button
                        onClick={() => navigate(`/batch/${batch.id}`)}
                        style={{
                          flex: 1, padding: "0.6rem",
                          background: "var(--bg-alt)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px", color: "var(--primary)",
                          fontWeight: 700, fontSize: "0.85rem",
                          letterSpacing: "0.04em", cursor: "pointer",
                          transition: "background 0.15s"
                        }}>VIEW</button>
                      {!isFull && (
                        <button
                          onClick={() => handleJoin(batch.id)}
                          disabled={joining === batch.id}
                          style={{
                            flex: 2, padding: "0.6rem",
                            background: "var(--accent)",
                            border: "none", borderRadius: "8px", color: "white",
                            fontWeight: 700, fontSize: "0.85rem",
                            letterSpacing: "0.04em", cursor: "pointer",
                            transition: "background 0.15s"
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
          background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
        }}>
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "20px", padding: "2rem", width: "100%", maxWidth: "520px",
            maxHeight: "90vh", overflowY: "auto", boxShadow: "var(--shadow-lg)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text)", letterSpacing: "0.02em" }}>
                Create Batch
              </h2>
              <button onClick={() => setShowCreate(false)} style={{
                background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4
              }}><X size={20} /></button>
            </div>

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: "8px", padding: "0.75rem", marginBottom: "1rem",
                color: "#DC2626", fontSize: "0.85rem"
              }}>{error}</div>
            )}

            <form onSubmit={handleCreate}>
              {/* Route select */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
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
                <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
                  BATCH TITLE *
                </label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Leh-Manali Summer Ride 2025" required style={inputStyle} />
              </div>

              {/* Dates */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
                    START DATE *
                  </label>
                  <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })}
                    required style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
                    END DATE *
                  </label>
                  <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })}
                    required style={inputStyle} />
                </div>
              </div>

              {/* Max riders */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
                  MAX RIDERS: {form.max_riders}
                </label>
                <input type="range" min="2" max="20" value={form.max_riders}
                  onChange={e => setForm({ ...form, max_riders: e.target.value })}
                  style={{ width: "100%", accentColor: "var(--primary)" }} />
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.7rem", marginTop: "0.25rem" }}>
                  <span>2</span><span>20</span>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
                  DESCRIPTION
                </label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Tell riders about your plan, experience level required, what to bring..."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }} />
              </div>

              <button type="submit" disabled={creating} style={{
                width: "100%", padding: "0.9rem",
                background: "var(--primary)",
                border: "none", borderRadius: "10px", color: "white",
                fontWeight: 700, fontSize: "1.1rem",
                letterSpacing: "0.06em", cursor: "pointer",
                boxShadow: "0 4px 14px rgba(45,106,79,0.25)",
                transition: "background 0.2s"
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