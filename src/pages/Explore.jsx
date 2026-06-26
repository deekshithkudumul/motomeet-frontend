import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { Search, Filter, MapPin, Clock, Zap } from "lucide-react";

const API = "http://localhost:8000";

const DIFFICULTY_COLORS = {
  Easy: "#22C55E", Moderate: "#FFB800", Hard: "#EF4444", Expert: "#00D4FF"
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
      box-shadow:0 0 8px ${color}
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
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#080808", paddingTop: "60px" }}>

      {/* ── Top Bar ── */}
      <div style={{
        padding: "0.75rem 1.5rem", background: "#0d0d0d",
        borderBottom: "1px solid #1c1c1c",
        display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <MapPin size={16} color="#FF5500" />
          <span style={{ fontFamily: "Barlow Condensed", fontSize: "1.1rem", fontWeight: 700, color: "#F0F0F0", letterSpacing: "0.05em" }}>
            EXPLORE ROUTES
          </span>
          <span style={{
            background: "rgba(0,212,255,0.1)", color: "#00D4FF",
            border: "1px solid rgba(0,212,255,0.2)",
            borderRadius: "100px", padding: "0.1rem 0.6rem",
            fontSize: "0.7rem", fontFamily: "Barlow Condensed", fontWeight: 700
          }}>{routes.length} ROUTES</span>
        </div>

        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: "200px", maxWidth: "320px" }}>
          <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#444" }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search routes or states..."
            style={{
              width: "100%", background: "#111", border: "1px solid #1c1c1c",
              borderRadius: "8px", padding: "0.5rem 0.75rem 0.5rem 2rem",
              color: "#F0F0F0", fontSize: "0.85rem", outline: "none",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Difficulty filter */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {["All", "Easy", "Moderate", "Hard", "Expert"].map(d => (
            <button key={d} onClick={() => setFilterDiff(d)} style={{
              padding: "0.35rem 0.75rem", borderRadius: "100px",
              border: filterDiff === d
                ? `1px solid ${d === "All" ? "#FF5500" : DIFFICULTY_COLORS[d]}`
                : "1px solid #1c1c1c",
              background: filterDiff === d
                ? `${d === "All" ? "#FF5500" : DIFFICULTY_COLORS[d]}15`
                : "transparent",
              color: filterDiff === d
                ? (d === "All" ? "#FF5500" : DIFFICULTY_COLORS[d])
                : "#555",
              fontSize: "0.75rem", fontFamily: "Barlow Condensed",
              fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer"
            }}>{d.toUpperCase()}</button>
          ))}
        </div>

        {/* Toggle list on mobile */}
        <button onClick={() => setShowList(!showList)} style={{
          padding: "0.4rem 0.9rem", borderRadius: "8px",
          border: "1px solid #1c1c1c", background: "transparent",
          color: "#666", fontSize: "0.8rem", fontFamily: "Barlow Condensed",
          cursor: "pointer", marginLeft: "auto"
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
            background: "#0a0a0a", borderRight: "1px solid #1a1a1a",
          }}>
            {loading ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#444" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏍️</div>
                Loading routes...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#444" }}>No routes found</div>
            ) : (
              filtered.map(route => (
                <div key={route.id}
                  onClick={() => setSelected(selected?.id === route.id ? null : route)}
                  style={{
                    padding: "1rem 1.25rem", cursor: "pointer",
                    borderBottom: "1px solid #111", transition: "all 0.2s",
                    background: selected?.id === route.id ? "rgba(0,212,255,0.05)" : "transparent",
                    borderLeft: selected?.id === route.id ? "3px solid #00D4FF" : "3px solid transparent"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <h3 style={{
                      fontFamily: "Barlow Condensed", fontSize: "1rem", fontWeight: 700,
                      color: selected?.id === route.id ? "#00D4FF" : "#D0D0D0",
                      letterSpacing: "0.02em", lineHeight: 1.2
                    }}>{route.name}</h3>
                    <span style={{
                      background: DIFFICULTY_COLORS[route.difficulty] + "18",
                      color: DIFFICULTY_COLORS[route.difficulty],
                      border: `1px solid ${DIFFICULTY_COLORS[route.difficulty]}35`,
                      padding: "0.15rem 0.5rem", borderRadius: "100px",
                      fontSize: "0.65rem", fontFamily: "Barlow Condensed",
                      fontWeight: 700, whiteSpace: "nowrap", marginLeft: "0.5rem"
                    }}>{route.difficulty}</span>
                  </div>

                  <p style={{ color: "#444", fontSize: "0.72rem", marginBottom: "0.6rem", letterSpacing: "0.04em" }}>
                    📍 {route.states}
                  </p>

                  <div style={{ display: "flex", gap: "1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <MapPin size={11} color="#FF5500" />
                      <span style={{ color: "#00D4FF", fontFamily: "Barlow Condensed", fontSize: "0.9rem", fontWeight: 700 }}>
                        {route.distance_km} km
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <Clock size={11} color="#FFB800" />
                      <span style={{ color: "#FFB800", fontFamily: "Barlow Condensed", fontSize: "0.9rem", fontWeight: 700 }}>
                        {route.duration_days}d
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <Zap size={11} color="#888" />
                      <span style={{ color: "#555", fontSize: "0.75rem" }}>
                        {route.elevation_gain}m
                      </span>
                    </div>
                  </div>

                  {selected?.id === route.id && (
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/route/${route.slug}`); }}
                      style={{
                        marginTop: "0.75rem", width: "100%",
                        padding: "0.5rem", borderRadius: "8px",
                        background: "linear-gradient(135deg,#FF5500,#CC4400)",
                        border: "none", color: "white",
                        fontFamily: "Barlow Condensed", fontWeight: 700,
                        fontSize: "0.85rem", letterSpacing: "0.08em",
                        cursor: "pointer"
                      }}
                    >VIEW FULL ROUTE →</button>
                  )}
                </div>
              ))
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
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />

            {filtered.map(route => {
              const coords = route.waypoints?.map(w => [w.lat, w.lng]) || [];
              const isSelected = selected?.id === route.id;
              const color = DIFFICULTY_COLORS[route.difficulty];

              return (
                <div key={route.id}>
                  <Polyline
                    positions={coords}
                    pathOptions={{
                      color: isSelected ? color : color + "80",
                      weight: isSelected ? 4 : 2,
                      opacity: isSelected ? 1 : 0.5,
                    }}
                    eventHandlers={{
                      click: () => setSelected(selected?.id === route.id ? null : route)
                    }}
                  />
                  {/* Start marker */}
                  {coords[0] && (
                    <Marker position={coords[0]} icon={createRouteIcon(color)}>
                      <Popup>
                        <div style={{ fontFamily: "Barlow Condensed", minWidth: "160px" }}>
                          <strong>{route.name}</strong><br />
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
              background: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)",
              border: `1px solid ${DIFFICULTY_COLORS[selected.difficulty]}40`,
              borderRadius: "14px", padding: "1.25rem 1.75rem",
              minWidth: "320px", maxWidth: "500px",
              boxShadow: `0 8px 32px ${DIFFICULTY_COLORS[selected.difficulty]}20`
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div>
                  <h3 style={{ fontFamily: "Barlow Condensed", fontSize: "1.3rem", fontWeight: 700, color: "#F0F0F0", letterSpacing: "0.03em" }}>
                    {selected.name}
                  </h3>
                  <p style={{ color: "#444", fontSize: "0.75rem", marginTop: "0.2rem" }}>📍 {selected.states}</p>
                </div>
                <span style={{
                  background: DIFFICULTY_COLORS[selected.difficulty] + "20",
                  color: DIFFICULTY_COLORS[selected.difficulty],
                  border: `1px solid ${DIFFICULTY_COLORS[selected.difficulty]}40`,
                  padding: "0.25rem 0.75rem", borderRadius: "100px",
                  fontSize: "0.72rem", fontFamily: "Barlow Condensed", fontWeight: 700
                }}>{selected.difficulty.toUpperCase()}</span>
              </div>

              <div style={{ display: "flex", gap: "2rem", marginBottom: "1rem" }}>
                {[
                  { label: "DISTANCE", value: `${selected.distance_km} km`, color: "#00D4FF" },
                  { label: "DURATION", value: `${selected.duration_days} Days`, color: "#FFB800" },
                  { label: "ELEVATION", value: `${selected.elevation_gain}m`, color: "#22C55E" },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontFamily: "Barlow Condensed", fontSize: "1.1rem", fontWeight: 700, color: s.color }}>{s.value}</div>
                    <div style={{ color: "#444", fontSize: "0.65rem", letterSpacing: "0.08em" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={() => navigate(`/route/${selected.slug}`)}
                  style={{
                    flex: 1, padding: "0.65rem",
                    background: "linear-gradient(135deg,#FF5500,#CC4400)",
                    border: "none", borderRadius: "8px", color: "white",
                    fontFamily: "Barlow Condensed", fontWeight: 700,
                    fontSize: "0.9rem", letterSpacing: "0.08em", cursor: "pointer"
                  }}>VIEW ROUTE →</button>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    padding: "0.65rem 1rem", background: "transparent",
                    border: "1px solid #1c1c1c", borderRadius: "8px",
                    color: "#555", cursor: "pointer", fontSize: "0.85rem"
                  }}>✕</button>
              </div>
            </div>
          )}

          {/* Map legend */}
          <div style={{
            position: "absolute", top: "1rem", right: "1rem", zIndex: 1000,
            background: "rgba(10,10,10,0.9)", backdropFilter: "blur(8px)",
            border: "1px solid #1c1c1c", borderRadius: "10px", padding: "0.75rem 1rem"
          }}>
            <div style={{ color: "#444", fontSize: "0.65rem", fontFamily: "Barlow Condensed", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
              DIFFICULTY
            </div>
            {Object.entries(DIFFICULTY_COLORS).map(([d, c]) => (
              <div key={d} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                <div style={{ width: "24px", height: "3px", background: c, borderRadius: "2px" }} />
                <span style={{ color: c, fontSize: "0.72rem", fontFamily: "Barlow Condensed", fontWeight: 700 }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}