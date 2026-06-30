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
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", paddingTop: "60px" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👥</div>
        <p style={{ color: "var(--primary)", fontSize: "1.2rem" }}>Loading batch...</p>
      </div>
    </div>
  );

  if (!batch) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", paddingTop: "60px" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#EF4444", fontSize: "1.2rem" }}>Batch not found</p>
        <button onClick={() => navigate("/connect")} style={{ marginTop: "1rem", padding: "0.5rem 1rem", background: "var(--accent)", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontWeight: 600 }}>
          Back to Connect
        </button>
      </div>
    </div>
  );

  const ROLE_CONFIG = {
    leader: { icon: <Crown size={12} />, color: "#B45309", label: "Leader" },
    sweep:  { icon: <Shield size={12} />, color: "var(--primary)", label: "Sweep" },
    rider:  { icon: null, color: "var(--text-muted)", label: "Rider" },
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingTop: "60px" }}>

      {/* ── Header ── */}
      <div style={{
        background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "1.5rem 2rem"
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <button onClick={() => navigate("/connect")} style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            background: "transparent", border: "none", color: "var(--text-muted)",
            cursor: "pointer", fontSize: "0.85rem", fontWeight: 600,
            marginBottom: "1rem", padding: 0
          }}>
            <ArrowLeft size={14} /> BACK TO CONNECT
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 style={{ fontSize: "2rem", color: "var(--text)", letterSpacing: "0.02em", lineHeight: 1, marginBottom: "0.5rem", fontWeight: 700 }}>
                {batch.title}
              </h1>
              {batch.route && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
                  onClick={() => navigate(`/route/${batch.route.slug}`)}>
                  <MapPin size={14} color="var(--accent)" />
                  <span style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 600 }}>
                    {batch.route.name}
                  </span>
                </div>
              )}
            </div>

            {!isMember && spotsLeft > 0 && (
              <button onClick={handleJoin} disabled={joining} style={{
                padding: "0.75rem 2rem",
                background: "var(--accent)",
                border: "none", borderRadius: "10px", color: "white",
                fontWeight: 700, fontSize: "1rem",
                letterSpacing: "0.05em", cursor: "pointer",
                boxShadow: "0 4px 14px rgba(231,111,81,0.3)",
                transition: "background 0.2s"
              }}>
                {joining ? "JOINING..." : "JOIN THIS BATCH →"}
              </button>
            )}
            {isMember && (
              <span style={{
                background: "rgba(45,106,79,0.10)", color: "var(--primary)",
                border: "1px solid rgba(45,106,79,0.25)",
                padding: "0.5rem 1.25rem", borderRadius: "100px",
                fontWeight: 700, fontSize: "0.85rem"
              }}>✓ YOU'RE IN THIS BATCH</span>
            )}
          </div>

          {/* Meta */}
          <div style={{ display: "flex", gap: "2rem", marginTop: "1rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Calendar size={14} color="#B45309" />
              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{batch.start_date} → {batch.end_date}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Users size={14} color="var(--primary)" />
              <span style={{ color: "var(--primary)", fontSize: "0.8rem", fontWeight: 600 }}>
                {batch.members?.length}/{batch.max_riders} riders
              </span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>· {spotsLeft} spots left</span>
            </div>
            <span style={{
              background: batch.status === "open" ? "rgba(45,106,79,0.10)" : "rgba(239,68,68,0.1)",
              color: batch.status === "open" ? "var(--primary)" : "#EF4444",
              border: `1px solid ${batch.status === "open" ? "rgba(45,106,79,0.25)" : "rgba(239,68,68,0.2)"}`,
              padding: "0.15rem 0.6rem", borderRadius: "100px",
              fontSize: "0.7rem", fontWeight: 700
            }}>{batch.status.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem", display: "grid", gridTemplateColumns: "1fr 280px", gap: "2rem" }} className="batch-grid">

        {/* Chat */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h2 style={{ fontSize: "1.2rem", color: "var(--text)", fontWeight: 700, letterSpacing: "0.03em", marginBottom: "1rem" }}>
            GROUP CHAT
          </h2>

          {/* Messages */}
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "14px", padding: "1.25rem",
            height: "420px", overflowY: "auto",
            display: "flex", flexDirection: "column", gap: "0.75rem",
            marginBottom: "1rem"
          }}>
            {batch.messages?.length === 0 ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>💬</div>
                  <p style={{ fontSize: "0.9rem" }}>No messages yet. Say hello!</p>
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
                      background: isMe ? "var(--accent)" : "var(--bg-alt)",
                      border: isMe ? "none" : "1px solid var(--border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.7rem", fontWeight: 700,
                      color: isMe ? "#fff" : "var(--text-muted)",
                    }}>{msg.user_name?.charAt(0).toUpperCase()}</div>

                    <div style={{ maxWidth: "70%" }}>
                      {!isMe && (
                        <div style={{ color: "var(--text-muted)", fontSize: "0.68rem", marginBottom: "0.2rem", fontWeight: 600 }}>
                          {msg.user_name}
                        </div>
                      )}
                      <div style={{
                        background: isMe ? "var(--accent)" : "var(--bg-alt)",
                        border: isMe ? "none" : "1px solid var(--border)",
                        borderRadius: isMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                        padding: "0.6rem 0.875rem"
                      }}>
                        <p style={{ color: isMe ? "white" : "var(--text)", fontSize: "0.875rem", lineHeight: 1.5, margin: 0 }}>
                          {msg.content}
                        </p>
                      </div>
                      <div style={{ color: "var(--border)", fontSize: "0.62rem", marginTop: "0.2rem", textAlign: isMe ? "right" : "left" }}>
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
                  flex: 1, background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "10px", padding: "0.75rem 1rem", color: "var(--text)",
                  fontSize: "0.9rem", outline: "none"
                }}
              />
              <button type="submit" disabled={sending || !message.trim()} style={{
                padding: "0.75rem 1.25rem",
                background: message.trim() ? "var(--accent)" : "var(--bg-alt)",
                border: "none", borderRadius: "10px", color: message.trim() ? "white" : "var(--text-muted)",
                cursor: message.trim() ? "pointer" : "not-allowed", transition: "all 0.2s"
              }}>
                <Send size={16} />
              </button>
            </form>
          ) : (
            <div style={{
              background: "var(--bg-alt)", border: "1px solid var(--border)",
              borderRadius: "10px", padding: "1rem", textAlign: "center",
              color: "var(--text-muted)", fontSize: "0.85rem"
            }}>
              Join this batch to participate in the group chat
            </div>
          )}
        </div>

        {/* Right — Members + Description */}
        <div>
          {/* Members */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.2rem", color: "var(--text)", fontWeight: 700, letterSpacing: "0.03em", marginBottom: "1rem" }}>
              RIDERS ({batch.members?.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {batch.members?.map(member => {
                const roleConf = ROLE_CONFIG[member.role] || ROLE_CONFIG.rider;
                return (
                  <div key={member.user_id} style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    padding: "0.75rem", background: "var(--surface)",
                    border: member.user_id === user?.id ? "1px solid rgba(231,111,81,0.35)" : "1px solid var(--border)",
                    borderRadius: "10px"
                  }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "50%",
                      background: member.role === "leader" ? "var(--accent)" : "var(--bg-alt)",
                      border: member.role === "leader" ? "none" : "1px solid var(--border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.85rem", fontWeight: 700,
                      color: member.role === "leader" ? "#fff" : "var(--text-muted)",
                      flexShrink: 0
                    }}>{member.name?.charAt(0).toUpperCase()}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: member.user_id === user?.id ? "var(--accent)" : "var(--text)" }}>
                        {member.name} {member.user_id === user?.id && "(You)"}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: roleConf.color, fontSize: "0.68rem", fontWeight: 700 }}>
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
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "12px", padding: "1.25rem"
            }}>
              <h3 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
                ABOUT THIS BATCH
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.7, margin: 0 }}>{batch.description}</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media(max-width:768px) {
          .batch-grid { grid-template-columns: 1fr !important; }
        }
        input:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(45,106,79,0.12); }
      `}</style>
    </div>
  );
}