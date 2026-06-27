import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Users, Calendar, MapPin, Send, Crown, Shield } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";


export default function BatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [joining, setJoining] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchBatch = () => {
    axios.get(`${API}/api/batches/${id}`)
      .then(res => { setBatch(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchBatch(); }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [batch?.messages]);

  const isMember = batch?.members?.some(m => m.user_id === user?.id);
  const isLeader = batch?.members?.find(m => m.user_id === user?.id)?.role === "leader";
  const spotsLeft = batch ? batch.max_riders - batch.members?.length : 0;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      await axios.post(`${API}/api/batches/${id}/messages`, { content: message });
      setMessage("");
      fetchBatch();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to send");
    } finally {
      setSending(false);
    }
  };

  const handleJoin = async () => {
    setJoining(true);
    try {
      await axios.post(`${API}/api/batches/${id}/join`);
      fetchBatch();
    } catch (err) {
      alert(err.response?.data?.detail || "Could not join");
    } finally {
      setJoining(false);
    }
  };

  if (loading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#080808", paddingTop: "60px" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👥</div>
        <p style={{ color: "#FF5500", fontFamily: "Barlow Condensed", fontSize: "1.2rem" }}>Loading batch...</p>
      </div>
    </div>
  );

  if (!batch) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#080808", paddingTop: "60px" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#EF4444", fontFamily: "Barlow Condensed", fontSize: "1.2rem" }}>Batch not found</p>
        <button onClick={() => navigate("/connect")} style={{ marginTop: "1rem", padding: "0.5rem 1rem", background: "#FF5500", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" }}>
          Back to Connect
        </button>
      </div>
    </div>
  );

  const ROLE_CONFIG = {
    leader: { icon: <Crown size={12} />, color: "#FFB800", label: "Leader" },
    sweep:  { icon: <Shield size={12} />, color: "#00D4FF", label: "Sweep" },
    rider:  { icon: null, color: "#555", label: "Rider" },
  };

  return (
    <div style={{ background: "#080808", minHeight: "100vh", paddingTop: "60px" }}>

      {/* ── Header ── */}
      <div style={{
        background: "#0d0d0d", borderBottom: "1px solid #1a1a1a", padding: "1.5rem 2rem"
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <button onClick={() => navigate("/connect")} style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            background: "transparent", border: "none", color: "#555",
            cursor: "pointer", fontFamily: "Barlow Condensed", fontSize: "0.85rem",
            marginBottom: "1rem", padding: 0
          }}>
            <ArrowLeft size={14} /> BACK TO CONNECT
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 style={{ fontFamily: "Bebas Neue", fontSize: "2rem", color: "#F0F0F0", letterSpacing: "0.05em", lineHeight: 1, marginBottom: "0.5rem" }}>
                {batch.title}
              </h1>
              {batch.route && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
                  onClick={() => navigate(`/route/${batch.route.slug}`)}>
                  <MapPin size={14} color="#FF5500" />
                  <span style={{ color: "#00D4FF", fontSize: "0.85rem", fontFamily: "Barlow Condensed", fontWeight: 600 }}>
                    {batch.route.name}
                  </span>
                </div>
              )}
            </div>

            {!isMember && spotsLeft > 0 && (
              <button onClick={handleJoin} disabled={joining} style={{
                padding: "0.75rem 2rem",
                background: "linear-gradient(135deg,#FF5500,#CC4400)",
                border: "none", borderRadius: "10px", color: "white",
                fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: "1rem",
                letterSpacing: "0.08em", cursor: "pointer",
                boxShadow: "0 0 25px rgba(255,85,0,0.2)"
              }}>
                {joining ? "JOINING..." : "JOIN THIS BATCH →"}
              </button>
            )}
            {isMember && (
              <span style={{
                background: "rgba(34,197,94,0.1)", color: "#22C55E",
                border: "1px solid rgba(34,197,94,0.2)",
                padding: "0.5rem 1.25rem", borderRadius: "100px",
                fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: "0.85rem"
              }}>✓ YOU'RE IN THIS BATCH</span>
            )}
          </div>

          {/* Meta */}
          <div style={{ display: "flex", gap: "2rem", marginTop: "1rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Calendar size={14} color="#FFB800" />
              <span style={{ color: "#666", fontSize: "0.8rem" }}>{batch.start_date} → {batch.end_date}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Users size={14} color="#00D4FF" />
              <span style={{ color: "#00D4FF", fontSize: "0.8rem", fontWeight: 600 }}>
                {batch.members?.length}/{batch.max_riders} riders
              </span>
              <span style={{ color: "#444", fontSize: "0.75rem" }}>· {spotsLeft} spots left</span>
            </div>
            <span style={{
              background: batch.status === "open" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              color: batch.status === "open" ? "#22C55E" : "#EF4444",
              border: `1px solid ${batch.status === "open" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
              padding: "0.15rem 0.6rem", borderRadius: "100px",
              fontSize: "0.7rem", fontFamily: "Barlow Condensed", fontWeight: 700
            }}>{batch.status.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem", display: "grid", gridTemplateColumns: "1fr 280px", gap: "2rem" }} className="batch-grid">

        {/* Chat */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h2 style={{ fontFamily: "Bebas Neue", fontSize: "1.4rem", color: "#F0F0F0", letterSpacing: "0.05em", marginBottom: "1rem" }}>
            GROUP CHAT
          </h2>

          {/* Messages */}
          <div style={{
            background: "#0d0d0d", border: "1px solid #1a1a1a",
            borderRadius: "14px", padding: "1.25rem",
            height: "420px", overflowY: "auto",
            display: "flex", flexDirection: "column", gap: "0.75rem",
            marginBottom: "1rem"
          }}>
            {batch.messages?.length === 0 ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#2a2a2a" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>💬</div>
                  <p style={{ fontFamily: "Barlow Condensed", fontSize: "0.9rem" }}>No messages yet. Say hello!</p>
                </div>
              </div>
            ) : (
              batch.messages?.map(msg => {
                const isMe = msg.user_id === user?.id;
                return (
                  <div key={msg.id} style={{
                    display: "flex", flexDirection: isMe ? "row-reverse" : "row",
                    gap: "0.6rem", alignItems: "flex-end"
                  }}>
                    {/* Avatar */}
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                      background: isMe ? "linear-gradient(135deg,#FF5500,#FFB800)" : "linear-gradient(135deg,#1a1a1a,#222)",
                      border: isMe ? "none" : "1px solid #2a2a2a",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.7rem", fontWeight: 700, color: isMe ? "#000" : "#555",
                      fontFamily: "Barlow Condensed"
                    }}>{msg.user_name?.charAt(0).toUpperCase()}</div>

                    <div style={{ maxWidth: "70%" }}>
                      {!isMe && (
                        <div style={{ color: "#444", fontSize: "0.68rem", marginBottom: "0.2rem", fontFamily: "Barlow Condensed", fontWeight: 600 }}>
                          {msg.user_name}
                        </div>
                      )}
                      <div style={{
                        background: isMe ? "linear-gradient(135deg,#FF5500,#CC4400)" : "#111",
                        border: isMe ? "none" : "1px solid #1c1c1c",
                        borderRadius: isMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                        padding: "0.6rem 0.875rem"
                      }}>
                        <p style={{ color: isMe ? "white" : "#C0C0C0", fontSize: "0.875rem", lineHeight: 1.5, margin: 0 }}>
                          {msg.content}
                        </p>
                      </div>
                      <div style={{ color: "#2a2a2a", fontSize: "0.62rem", marginTop: "0.2rem", textAlign: isMe ? "right" : "left" }}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          {isMember ? (
            <form onSubmit={handleSend} style={{ display: "flex", gap: "0.75rem" }}>
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1, background: "#0d0d0d", border: "1px solid #1c1c1c",
                  borderRadius: "10px", padding: "0.75rem 1rem", color: "#F0F0F0",
                  fontSize: "0.9rem", outline: "none", fontFamily: "Barlow, sans-serif"
                }}
              />
              <button type="submit" disabled={sending || !message.trim()} style={{
                padding: "0.75rem 1.25rem",
                background: message.trim() ? "linear-gradient(135deg,#FF5500,#CC4400)" : "#111",
                border: "none", borderRadius: "10px", color: "white",
                cursor: message.trim() ? "pointer" : "not-allowed", transition: "all 0.2s"
              }}>
                <Send size={16} />
              </button>
            </form>
          ) : (
            <div style={{
              background: "#0d0d0d", border: "1px solid #1a1a1a",
              borderRadius: "10px", padding: "1rem", textAlign: "center",
              color: "#444", fontSize: "0.85rem"
            }}>
              Join this batch to participate in the group chat
            </div>
          )}
        </div>

        {/* Right — Members + Description */}
        <div>
          {/* Members */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "Bebas Neue", fontSize: "1.4rem", color: "#F0F0F0", letterSpacing: "0.05em", marginBottom: "1rem" }}>
              RIDERS ({batch.members?.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {batch.members?.map(member => {
                const roleConf = ROLE_CONFIG[member.role] || ROLE_CONFIG.rider;
                return (
                  <div key={member.user_id} style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    padding: "0.75rem", background: "#0d0d0d",
                    border: member.user_id === user?.id ? "1px solid rgba(255,85,0,0.2)" : "1px solid #1a1a1a",
                    borderRadius: "10px"
                  }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "50%",
                      background: member.role === "leader"
                        ? "linear-gradient(135deg,#FF5500,#FFB800)"
                        : "linear-gradient(135deg,#1a1a1a,#222)",
                      border: member.role === "leader" ? "none" : "1px solid #2a2a2a",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.85rem", fontWeight: 700,
                      color: member.role === "leader" ? "#000" : "#555",
                      fontFamily: "Barlow Condensed", flexShrink: 0
                    }}>{member.name?.charAt(0).toUpperCase()}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "Barlow Condensed", fontSize: "0.95rem", fontWeight: 700, color: member.user_id === user?.id ? "#FF5500" : "#D0D0D0" }}>
                        {member.name} {member.user_id === user?.id && "(You)"}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: roleConf.color, fontSize: "0.68rem", fontFamily: "Barlow Condensed", fontWeight: 700 }}>
                        {roleConf.icon}{roleConf.label.toUpperCase()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          {batch.description && (
            <div style={{
              background: "#0d0d0d", border: "1px solid #1a1a1a",
              borderRadius: "12px", padding: "1.25rem"
            }}>
              <h3 style={{ fontFamily: "Barlow Condensed", fontSize: "0.85rem", fontWeight: 700, color: "#555", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
                ABOUT THIS BATCH
              </h3>
              <p style={{ color: "#666", fontSize: "0.875rem", lineHeight: 1.7 }}>{batch.description}</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media(max-width:768px) {
          .batch-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}