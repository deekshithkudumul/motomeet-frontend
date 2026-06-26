import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const FEATURED_ROUTES = [
  { name: "Leh-Manali Highway", distance: "479 km", difficulty: "Expert", days: 7, state: "Ladakh", photo: "/images/Leh-manali.jpg" },
  { name: "Spiti Valley Circuit", distance: "650 km", difficulty: "Expert", days: 8, state: "Himachal Pradesh", photo: "/images/Spiti.jpg" },
  { name: "Coastal Karnataka", distance: "320 km", difficulty: "Easy", days: 3, state: "Karnataka", photo: "/images/coastalkarnataka.jpg" },
  { name: "Rajasthan Desert", distance: "890 km", difficulty: "Moderate", days: 7, state: "Rajasthan", photo: "/images/Rajasthandesert.jpg" },
  { name: "Western Ghats", distance: "280 km", difficulty: "Moderate", days: 3, state: "Karnataka-Kerala", photo: "/images/westernghats.jpg" },
  { name: "Northeast Circuit", distance: "750 km", difficulty: "Hard", days: 8, state: "Meghalaya", photo: "/images/NortheastCircuit.jpg" },
];

const DIFFICULTY_COLORS = {
  Easy: "#22C55E", Moderate: "#FFB800", Hard: "#EF4444", Expert: "#00D4FF"
};

const STATS = [
  { value: "20+", label: "Epic Routes", color: "#00D4FF" },
  { value: "500+", label: "Riders", color: "#FFB800" },
  { value: "15+", label: "States", color: "#00D4FF" },
  { value: "50K+", label: "KMs Tracked", color: "#FFB800" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Discover Routes", desc: "Browse 20+ legendary Indian bike routes with detailed maps, elevation profiles, and insider tips.", icon: "🗺️", color: "#00D4FF" },
  { step: "02", title: "Find Your Pack", desc: "Connect with riders planning the same route. Join a batch or create your own group ride.", icon: "👥", color: "#FF5500" },
  { step: "03", title: "Track & Conquer", desc: "Mark checkpoints, track your KMs, earn badges and build your riding legacy.", icon: "🏆", color: "#FFB800" },
];

function MotoMeetLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5C35 5 23 17 23 32C23 52 50 80 50 80C50 80 77 52 77 32C77 17 65 5 50 5Z"
        fill="url(#pinGradL)" opacity="0.9"/>
      <circle cx="34" cy="38" r="9" stroke="#FF5500" strokeWidth="2.5" fill="none"/>
      <circle cx="34" cy="38" r="3" fill="#FF5500"/>
      <circle cx="66" cy="38" r="9" stroke="#FF5500" strokeWidth="2.5" fill="none"/>
      <circle cx="66" cy="38" r="3" fill="#FF5500"/>
      <path d="M34 38 L46 24 L60 24 L66 38" stroke="#00D4FF" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M46 38 L46 24" stroke="#00D4FF" strokeWidth="2" fill="none"/>
      <path d="M46 38 L34 38" stroke="#00D4FF" strokeWidth="2" fill="none"/>
      <path d="M46 38 L66 38" stroke="#00D4FF" strokeWidth="2" fill="none"/>
      <path d="M58 24 L63 20 L67 20" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="52" cy="21" r="4" fill="#FFB800"/>
      <path d="M52 25 L50 32 L56 30 L54 25Z" fill="#FFB800"/>
      <defs>
        <linearGradient id="pinGradL" x1="23" y1="5" x2="77" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF5500" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.1"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Landing() {
  return (
    <div style={{ background: "#080808", minHeight: "100vh", overflow: "hidden" }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: "rgba(8,8,8,0.9)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 2rem", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <MotoMeetLogo size={44} />
          <div>
            <div style={{ fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: "1.6rem", color: "#F0F0F0", lineHeight: 1 }}>
              Moto<span style={{ color: "#FF5500" }}>Meet</span>
            </div>
            <div style={{ fontSize: "0.5rem", color: "#444", letterSpacing: "0.2em", lineHeight: 1 }}>
              DISCOVER · RIDE · CONNECT
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link to="/login" style={{
            color: "#666", textDecoration: "none", fontSize: "0.875rem",
            padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #1c1c1c",
            fontFamily: "Barlow Condensed", fontWeight: 600, letterSpacing: "0.06em"
          }}>LOGIN</Link>
          <Link to="/register" style={{
            background: "linear-gradient(135deg,#FF5500,#CC4400)",
            color: "white", textDecoration: "none", fontSize: "0.875rem",
            padding: "0.5rem 1.2rem", borderRadius: "8px",
            fontFamily: "Barlow Condensed", fontWeight: 700, letterSpacing: "0.08em"
          }}>GET STARTED</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "2rem", paddingTop: "80px", position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')",
          backgroundSize: "cover", backgroundPosition: "center 35%",
          filter: "brightness(0.28) saturate(1.2)"
        }}/>
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(to bottom, rgba(8,8,8,0.5) 0%, rgba(8,8,8,0.1) 30%, rgba(8,8,8,0.65) 75%, #080808 100%)"
        }}/>
        <div style={{
          position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
          width: "700px", height: "400px", zIndex: 1, pointerEvents: "none",
          background: "radial-gradient(ellipse, rgba(0,212,255,0.05) 0%, transparent 65%)"
        }}/>

        <div style={{ position: "relative", zIndex: 2, maxWidth: "900px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)",
            borderRadius: "100px", padding: "0.45rem 1.2rem", marginBottom: "2rem"
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00D4FF", animation: "pulse 2s infinite" }}/>
            <span style={{ color: "#00D4FF", fontSize: "0.78rem", fontWeight: 700, fontFamily: "Barlow Condensed", letterSpacing: "0.15em" }}>
              INDIA'S #1 BIKER COMMUNITY
            </span>
          </div>

          <h1 style={{
            fontFamily: "Bebas Neue", fontWeight: 400,
            fontSize: "clamp(3.5rem, 10vw, 7.5rem)",
            lineHeight: 0.92, letterSpacing: "0.03em", marginBottom: "1.5rem"
          }}>
            <span style={{ color: "#F0F0F0", display: "block" }}>DISCOVER INDIA'S</span>
            <span style={{ color: "#FF5500", display: "block" }}>GREATEST BIKE ROUTES</span>
          </h1>

          <p style={{
            color: "#777", fontSize: "clamp(1rem, 2.2vw, 1.15rem)",
            maxWidth: "560px", lineHeight: 1.8, margin: "0 auto 2.5rem", fontWeight: 300
          }}>
            Plan epic rides across the Himalayas, coastal highways and desert roads.
            Connect with riders who share your passion. Find your pack. Ride together.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "4rem" }}>
            <Link to="/register" style={{
              background: "linear-gradient(135deg,#FF5500,#CC4400)",
              color: "white", textDecoration: "none",
              padding: "1rem 2.8rem", borderRadius: "10px",
              fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: "1.15rem",
              letterSpacing: "0.1em", display: "inline-block",
              boxShadow: "0 0 40px rgba(255,85,0,0.3)"
            }}>START RIDING FREE →</Link>
            <Link to="/login" style={{
              background: "rgba(0,212,255,0.06)", backdropFilter: "blur(8px)",
              color: "#00D4FF", textDecoration: "none",
              padding: "1rem 2.8rem", borderRadius: "10px",
              border: "1px solid rgba(0,212,255,0.2)",
              fontFamily: "Barlow Condensed", fontWeight: 600, fontSize: "1.15rem",
              letterSpacing: "0.08em", display: "inline-block"
            }}>EXPLORE ROUTES</Link>
          </div>

          <div style={{
            display: "flex", flexWrap: "wrap", justifyContent: "center",
            background: "rgba(0,0,0,0.65)", backdropFilter: "blur(16px)",
            borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)",
            maxWidth: "fit-content", margin: "0 auto", overflow: "hidden"
          }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                textAlign: "center", padding: "1.2rem 2.5rem",
                borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none"
              }}>
                <div style={{ fontFamily: "Bebas Neue", fontSize: "2.2rem", color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: "#444", fontSize: "0.7rem", marginTop: "0.3rem", letterSpacing: "0.1em" }}>
                  {s.label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          position: "absolute", bottom: "2rem", left: "50%",
          transform: "translateX(-50%)", color: "#2a2a2a",
          animation: "bounce 2s infinite", zIndex: 2
        }}>
          <ChevronDown size={22} />
        </div>
      </div>

      {/* ── Featured Routes ── */}
      <div style={{ padding: "6rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{
            color: "#00D4FF", fontSize: "0.75rem", fontWeight: 700,
            fontFamily: "Barlow Condensed", letterSpacing: "0.25em", marginBottom: "0.75rem"
          }}>— HAND PICKED FOR YOU —</div>
          <h2 style={{
            fontFamily: "Bebas Neue", fontSize: "clamp(2.5rem, 6vw, 4rem)",
            color: "#F0F0F0", letterSpacing: "0.03em", lineHeight: 1
          }}>FEATURED ROUTES</h2>
          <p style={{ color: "#3a3a3a", fontSize: "0.9rem", marginTop: "0.75rem" }}>
            Legendary rides across the length and breadth of India
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1rem"
        }}>
          {FEATURED_ROUTES.map(route => (
            <div key={route.name} style={{
              background: "#0d0d0d", border: "1px solid #161616",
              borderRadius: "14px", overflow: "hidden",
              cursor: "pointer", transition: "all 0.25s",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.border = "1px solid rgba(0,212,255,0.25)";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,212,255,0.06)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.border = "1px solid #161616";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Photo */}
              <div style={{ height: "160px", overflow: "hidden", position: "relative" }}>
                <img src={route.photo} alt={route.name} style={{
                  width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s"
                }}
                  onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.target.style.transform = "scale(1)"}
                />
                <div style={{
                  position: "absolute", top: "10px", right: "10px",
                  background: DIFFICULTY_COLORS[route.difficulty] + "25",
                  color: DIFFICULTY_COLORS[route.difficulty],
                  border: `1px solid ${DIFFICULTY_COLORS[route.difficulty]}50`,
                  padding: "0.2rem 0.65rem", borderRadius: "100px",
                  fontSize: "0.7rem", fontWeight: 700,
                  fontFamily: "Barlow Condensed", letterSpacing: "0.08em",
                  backdropFilter: "blur(8px)"
                }}>{route.difficulty.toUpperCase()}</div>
              </div>

              {/* Content */}
              <div style={{ padding: "1.25rem" }}>
                <h3 style={{
                  fontFamily: "Barlow Condensed", fontSize: "1.2rem", fontWeight: 700,
                  color: "#E0E0E0", marginBottom: "0.3rem", letterSpacing: "0.02em"
                }}>{route.name}</h3>
                <p style={{ color: "#333", fontSize: "0.72rem", marginBottom: "1rem", letterSpacing: "0.06em" }}>
                  📍 {route.state.toUpperCase()}
                </p>
                <div style={{ display: "flex", gap: "2rem" }}>
                  <div>
                    <div style={{ color: "#00D4FF", fontFamily: "Bebas Neue", fontSize: "1.25rem", lineHeight: 1 }}>
                      {route.distance}
                    </div>
                    <div style={{ color: "#2a2a2a", fontSize: "0.65rem", marginTop: "0.2rem", letterSpacing: "0.06em" }}>DISTANCE</div>
                  </div>
                  <div>
                    <div style={{ color: "#FFB800", fontFamily: "Bebas Neue", fontSize: "1.25rem", lineHeight: 1 }}>
                      {route.days} DAYS
                    </div>
                    <div style={{ color: "#2a2a2a", fontSize: "0.65rem", marginTop: "0.2rem", letterSpacing: "0.06em" }}>DURATION</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link to="/register" style={{
            color: "#00D4FF", textDecoration: "none",
            fontFamily: "Barlow Condensed", fontSize: "1rem", fontWeight: 700,
            letterSpacing: "0.1em", border: "1px solid rgba(0,212,255,0.2)",
            padding: "0.85rem 2.5rem", borderRadius: "8px",
            background: "rgba(0,212,255,0.04)", display: "inline-block"
          }}>VIEW ALL 20+ ROUTES →</Link>
        </div>
      </div>

      {/* ── How It Works ── */}
      <div style={{
        padding: "6rem 2rem",
        background: "linear-gradient(180deg,#080808 0%,#0a0a0d 50%,#080808 100%)"
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{
              color: "#00D4FF", fontSize: "0.75rem", fontWeight: 700,
              fontFamily: "Barlow Condensed", letterSpacing: "0.25em", marginBottom: "0.75rem"
            }}>— THREE SIMPLE STEPS —</div>
            <h2 style={{
              fontFamily: "Bebas Neue", fontSize: "clamp(2.5rem, 6vw, 4rem)",
              color: "#F0F0F0", letterSpacing: "0.03em"
            }}>HOW MOTOMEET WORKS</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.5rem" }}>
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} style={{
                textAlign: "center", padding: "2.5rem 2rem",
                background: "#0d0d0d", border: "1px solid #161616",
                borderRadius: "16px", position: "relative", overflow: "hidden"
              }}>
                <div style={{
                  position: "absolute", top: "-10px", right: "16px",
                  fontFamily: "Bebas Neue", fontSize: "6rem",
                  color: item.color + "0a", lineHeight: 1,
                  pointerEvents: "none", userSelect: "none"
                }}>{item.step}</div>
                <div style={{
                  width: "64px", height: "64px", borderRadius: "50%",
                  background: item.color + "10", border: `1px solid ${item.color}25`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.25rem", fontSize: "1.8rem"
                }}>{item.icon}</div>
                <h3 style={{
                  fontFamily: "Barlow Condensed", fontSize: "1.4rem", fontWeight: 700,
                  color: item.color, marginBottom: "0.75rem", letterSpacing: "0.05em"
                }}>{item.title.toUpperCase()}</h3>
                <p style={{ color: "#4a4a4a", lineHeight: 1.8, fontSize: "0.88rem" }}>{item.desc}</p>
                <div style={{
                  position: "absolute", bottom: 0, left: "25%", right: "25%",
                  height: "2px", background: `linear-gradient(90deg,transparent,${item.color}40,transparent)`
                }}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ padding: "5rem 2rem", textAlign: "center" }}>
        <div style={{
          maxWidth: "800px", margin: "0 auto", position: "relative",
          overflow: "hidden", borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.06)"
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=1400&q=80')",
            backgroundSize: "cover", backgroundPosition: "center 60%",
            filter: "brightness(0.15) saturate(0.8)"
          }}/>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg,rgba(0,212,255,0.05),rgba(255,85,0,0.05))"
          }}/>
          <div style={{ position: "relative", zIndex: 1, padding: "4rem 2rem" }}>
            <MotoMeetLogo size={64} />
            <h2 style={{
              fontFamily: "Bebas Neue", fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#F0F0F0", letterSpacing: "0.05em", margin: "1rem 0 0.75rem"
            }}>READY TO HIT THE ROAD?</h2>
            <p style={{ color: "#555", marginBottom: "2rem", lineHeight: 1.7, fontSize: "0.9rem" }}>
              Join thousands of riders discovering India's greatest routes together.
            </p>
            <Link to="/register" style={{
              background: "linear-gradient(135deg,#FF5500,#CC4400)",
              color: "white", textDecoration: "none",
              padding: "1.1rem 3.5rem", borderRadius: "10px",
              fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: "1.2rem",
              letterSpacing: "0.12em", display: "inline-block",
              boxShadow: "0 0 50px rgba(255,85,0,0.25)"
            }}>JOIN MOTOMEET FREE →</Link>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid #0f0f0f", padding: "2.5rem 2rem", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
          <MotoMeetLogo size={30} />
          <span style={{ fontFamily: "Barlow Condensed", fontSize: "1.4rem", color: "#F0F0F0", fontWeight: 700, letterSpacing: "0.05em" }}>
            Moto<span style={{ color: "#FF5500" }}>Meet</span>
          </span>
        </div>
        <p style={{ color: "#222", fontSize: "0.75rem", letterSpacing: "0.08em" }}>
          DISCOVER · RIDE · CONNECT — MADE WITH ❤️ FOR INDIAN BIKERS
        </p>
      </footer>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media(max-width:768px) {
          nav { padding: 0 1rem !important; }
        }
      `}</style>
    </div>
  );
}