import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { Search, Filter, MapPin, Clock, Zap } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const DIFFICULTY_COLORS = {
  Easy:     { line: "#2D6A4F", badge: "rgba(45,106,79,0.12)",   text: "#2D6A4F", border: "rgba(45,106,79,0.25)"   },
  Moderate: { line: "#B45309", badge: "rgba(180,83,9,0.12)",    text: "#B45309", border: "rgba(180,83,9,0.25)"    },
  Hard:     { line: "#DC2626", badge: "rgba(239,68,68,0.12)",   text: "#DC2626", border: "rgba(239,68,68,0.25)"   },
  Expert:   { line: "#E76F51", badge: "rgba(231,111,81,0.12)",  text: "#E76F51", border: "rgba(231,111,81,0.30)"  },
};

const DIFFICULTY_ORDER = { Easy: 1, Moderate: 2, Hard: 3, Expert: 4 };

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function createRouteIcon(color) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:12px;height:12px;border-radius:50%;
      background:${color};border:2px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.25)
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

function FlyToRoute({ route }) {
  const map = useMap();
  useEffect(() => {
    if (route?.waypoints?.length) {
      const coords = route.waypoints.map(w => [w.lat, w.lng]);
      map.flyToBounds(coords, { padding: [60, 60], duration: 1.2 });
    }
  }, [route, map]);
  return null;
}

export default function Explore() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterDiff, setFilterDiff] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showList, setShowList] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/routes`)
      .then(res => { setRoutes(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = routes.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.states.toLowerCase().includes(search.toLowerCase());
    const matchDiff = filterDiff === "All" || r.difficulty === filterDiff;
    return matchSearch && matchDiff;
  });

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)", paddingTop: "60px" }}>

      {/* ── Top Bar ── */}
      <div style={{
        padding: "0.75rem 1.5rem", background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <MapPin size={16} color="var(--accent)" />
          <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", letterSpacing: "0.04em" }}>
            EXPLORE ROUTES
          </span>
          <span style={{
            background: "rgba(45,106,79,0.10)", color: "var(--primary)",
            border: "1px solid rgba(45,106,79,0.25)",
            borderRadius: "100px", padding: "0.1rem 0.6rem",
            fontSize: "0.7rem", fontWeight: 700
          }}>{routes.length} ROUTES</span>
        </div>

        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: "200px", maxWidth: "320px" }}>
          <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search routes or states..."
            style={{
              width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
              borderRadius: "8px", padding: "0.5rem 0.75rem 0.5rem 2rem",
              color: "var(--text)", fontSize: "0.85rem", outline: "none",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Difficulty filter */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {["All", "Easy", "Moderate", "Hard", "Expert"].map(d => {
            const dc = DIFFICULTY_COLORS[d];
            const isActive = filterDiff === d;
            return (
              <button key={d} onClick={() => setFilterDiff(d)} style={{
                padding: "0.35rem 0.75rem", borderRadius: "100px",
                border: isActive
                  ? `1px solid ${d === "All" ? "var(--primary)" : dc.border}`
                  : "1px solid var(--border)",
                background: isActive
                  ? (d === "All" ? "rgba(45,106,79,0.10)" : dc.badge)
                  : "transparent",
                color: isActive
                  ? (d === "All" ? "var(--primary)" : dc.text)
                  : "var(--text-muted)",
                fontSize: "0.75rem", fontWeight: 700,
                letterSpacing: "0.05em", cursor: "pointer",
                transition: "all 0.15s"
              }}>{d.toUpperCase()}</button>
            );
          })}
        </div>

        {/* Toggle list */}
        <button onClick={() => setShowList(!showList)} style={{
          padding: "0.4rem 0.9rem", borderRadius: "8px",
          border: "1px solid var(--border)", background: "transparent",
          color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600,
          cursor: "pointer", marginLeft: "auto", transition: "border-color 0.15s"
        }}>
          {showList ? "HIDE LIST" : "SHOW LIST"}
        </button>
      </div>

      {/* ── Main Layout ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── Route List ── */}
        {showList && (
          <div style={{
            width: "320px", minWidth: "280px", overflowY: "auto",
            background: "var(--surface)", borderRight: "1px solid var(--border)",
          }}>
            {loading ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏍️</div>
                Loading routes...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>No routes found</div>
            ) : (
              filtered.map(route => {
                const dc = DIFFICULTY_COLORS[route.difficulty];
                const isSelected = selected?.id === route.id;
                return (
                  <div key={route.id}
                    onClick={() => setSelected(isSelected ? null : route)}
                    style={{
                      padding: "1rem 1.25rem", cursor: "pointer",
                      borderBottom: "1px solid var(--border)", transition: "all 0.2s",
                      background: isSelected ? "rgba(45,106,79,0.05)" : "transparent",
                      borderLeft: isSelected ? "3px solid var(--primary)" : "3px solid transparent"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                      <h3 style={{
                        fontSize: "1rem", fontWeight: 700,
                        color: isSelected ? "var(--primary)" : "var(--text)",
                        lineHeight: 1.2
                      }}>{route.name}</h3>
                      <span style={{
                        background: dc.badge, color: dc.text,
                        border: `1px solid ${dc.border}`,
                        padding: "0.15rem 0.5rem", borderRadius: "100px",
                        fontSize: "0.65rem", fontWeight: 700,
                        whiteSpace: "nowrap", marginLeft: "0.5rem"
                      }}>{route.difficulty}</span>
                    </div>

                    <p style={{ color: "var(--text-muted)", fontSize: "0.72rem", marginBottom: "0.6rem", letterSpacing: "0.02em" }}>
                      📍 {route.states}
                    </p>

                    <div style={{ display: "flex", gap: "1.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <MapPin size={11} color="var(--accent)" />
                        <span style={{ color: "var(--primary)", fontSize: "0.9rem", fontWeight: 700 }}>
                          {route.distance_km} km
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <Clock size={11} color="#B45309" />
                        <span style={{ color: "#B45309", fontSize: "0.9rem", fontWeight: 700 }}>
                          {route.duration_days}d
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <Zap size={11} color="var(--text-muted)" />
                        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                          {route.elevation_gain}m
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/route/${route.slug}`); }}
                        style={{
                          marginTop: "0.75rem", width: "100%",
                          padding: "0.5rem", borderRadius: "8px",
                          background: "var(--accent)",
                          border: "none", color: "white",
                          fontWeight: 700, fontSize: "0.85rem",
                          letterSpacing: "0.06em", cursor: "pointer",
                          transition: "background 0.2s"
                        }}
                      >VIEW FULL ROUTE →</button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── Map ── */}
        <div style={{ flex: 1, position: "relative" }}>
          <MapContainer
            center={[22.5, 80.0]}
            zoom={5}
            style={{ width: "100%", height: "100%" }}
            zoomControl={false}
          >
            {/* Natural OSM tiles */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {filtered.map(route => {
              const coords = route.waypoints?.map(w => [w.lat, w.lng]) || [];
              const isSelected = selected?.id === route.id;
              const dc = DIFFICULTY_COLORS[route.difficulty];

              return (
                <div key={route.id}>
                  <Polyline
                    positions={coords}
                    pathOptions={{
                      color: dc.line,
                      weight: isSelected ? 4 : 2,
                      opacity: isSelected ? 1 : 0.5,
                    }}
                    eventHandlers={{
                      click: () => setSelected(selected?.id === route.id ? null : route)
                    }}
                  />
                  {coords[0] && (
                    <Marker position={coords[0]} icon={createRouteIcon(dc.line)}>
                      <Popup>
                        <div style={{ fontFamily: "var(--font-sans)", minWidth: "160px" }}>
                          <strong style={{ color: "var(--text)" }}>{route.name}</strong><br />
                          🚩 Start: {route.start_point}<br />
                          🏁 End: {route.end_point}<br />
                          📏 {route.distance_km} km · {route.duration_days} days
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </div>
              );
            })}

            {selected && <FlyToRoute route={selected} />}
          </MapContainer>

          {/* Selected route info overlay */}
          {selected && (
            <div style={{
              position: "absolute", bottom: "1.5rem", left: "50%",
              transform: "translateX(-50%)", zIndex: 1000,
              background: "var(--surface)", backdropFilter: "blur(12px)",
              border: `1px solid ${DIFFICULTY_COLORS[selected.difficulty].border}`,
              borderRadius: "14px", padding: "1.25rem 1.75rem",
              minWidth: "320px", maxWidth: "500px",
              boxShadow: "var(--shadow-lg)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", letterSpacing: "0.02em" }}>
                    {selected.name}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "0.2rem" }}>📍 {selected.states}</p>
                </div>
                <span style={{
                  background: DIFFICULTY_COLORS[selected.difficulty].badge,
                  color: DIFFICULTY_COLORS[selected.difficulty].text,
                  border: `1px solid ${DIFFICULTY_COLORS[selected.difficulty].border}`,
                  padding: "0.25rem 0.75rem", borderRadius: "100px",
                  fontSize: "0.72rem", fontWeight: 700
                }}>{selected.difficulty.toUpperCase()}</span>
              </div>

              <div style={{ display: "flex", gap: "2rem", marginBottom: "1rem" }}>
                {[
                  { label: "DISTANCE",  value: `${selected.distance_km} km`,    color: "var(--primary)" },
                  { label: "DURATION",  value: `${selected.duration_days} Days`, color: "#B45309"        },
                  { label: "ELEVATION", value: `${selected.elevation_gain}m`,    color: "var(--accent)"  },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: s.color }}>{s.value}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.65rem", letterSpacing: "0.08em" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={() => navigate(`/route/${selected.slug}`)}
                  style={{
                    flex: 1, padding: "0.65rem",
                    background: "var(--accent)",
                    border: "none", borderRadius: "8px", color: "white",
                    fontWeight: 700, fontSize: "0.9rem",
                    letterSpacing: "0.06em", cursor: "pointer",
                    transition: "background 0.2s"
                  }}>VIEW ROUTE →</button>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    padding: "0.65rem 1rem", background: "transparent",
                    border: "1px solid var(--border)", borderRadius: "8px",
                    color: "var(--text-muted)", cursor: "pointer", fontSize: "0.85rem"
                  }}>✕</button>
              </div>
            </div>
          )}

          {/* Map legend */}
          <div style={{
            position: "absolute", top: "1rem", right: "1rem", zIndex: 1000,
            background: "var(--surface)", backdropFilter: "blur(8px)",
            border: "1px solid var(--border)", borderRadius: "10px",
            padding: "0.75rem 1rem", boxShadow: "var(--shadow-sm)"
          }}>
            <div style={{ color: "var(--text-muted)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
              DIFFICULTY
            </div>
            {Object.entries(DIFFICULTY_COLORS).map(([d, dc]) => (
              <div key={d} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                <div style={{ width: "24px", height: "3px", background: dc.line, borderRadius: "2px" }} />
                <span style={{ color: dc.text, fontSize: "0.72rem", fontWeight: 700 }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}