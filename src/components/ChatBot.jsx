import { useState, useRef, useEffect } from "react";

const CANNED = [
  "Prince Platform covers residential complexes across South Africa — from Johannesburg to Cape Town.",
  "Ratings are community-driven across 6 dimensions: Safety, Cleanliness, Modernity, Utilities, Body Corporate, and Value.",
  "You can sign in to submit your own rating for any complex you've lived in or currently reside in.",
  "The overall score is an average of all 6 dimension scores from verified resident reviews.",
  "Look at the Body Corporate score carefully — it reflects levy health and financial management of the complex.",
  "Safety & Security score covers access control, CCTV, guards, and incident frequency reported by residents.",
];

let cannedIdx = 0;

export default function ChatBot({ open, onToggle, isMobile }) {
  const [msgs, setMsgs] = useState([
    { role: "bot", text: "Hi! I'm Prince AI 👋 Ask me about South African residential properties." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (open && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, open]);

  function send() {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setLoading(true);
    setTimeout(() => {
      const reply = CANNED[cannedIdx % CANNED.length];
      cannedIdx++;
      setMsgs((m) => [...m, { role: "bot", text: reply }]);
      setLoading(false);
    }, 900);
  }

  const panelStyle = isMobile
    ? { position: "fixed", bottom: 80, left: 10, right: 10, height: 380, borderRadius: 16 }
    : { position: "fixed", bottom: 80, right: 20, width: 310, height: 400, borderRadius: 16 };

  return (
    <>
      {open && (
        <div className="float-panel" style={{ ...panelStyle, zIndex: 800, display: "flex", flexDirection: "column", animation: "slideUp .22s ease", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ padding: "11px 13px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, background: "rgba(245,158,11,0.06)" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🤖</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>Prince AI</div>
              <div style={{ fontSize: 10, color: "var(--accent)" }}>● Online</div>
            </div>
            <button onClick={onToggle} style={{ marginLeft: "auto", background: "transparent", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 18, padding: "0 4px" }}>×</button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 7 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%", padding: "8px 11px",
                  borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                  background: m.role === "user" ? "linear-gradient(135deg,#f59e0b,#d97706)" : "rgba(255,255,255,0.06)",
                  fontSize: 12, lineHeight: 1.55,
                  color: m.role === "user" ? "#fff" : "var(--text)",
                  animation: "fadeIn .2s ease",
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 4, padding: "8px 11px", background: "rgba(255,255,255,0.06)", borderRadius: "12px 12px 12px 2px", width: "fit-content" }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--text3)", animation: `dotBounce .8s ease ${i * 0.15}s infinite` }} />
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: "10px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about properties…"
              style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: 9, padding: "8px 11px", color: "var(--text)", fontSize: 12, fontFamily: "inherit", outline: "none", transition: "border-color .15s" }}
              onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
            />
            <button onClick={send} className="btn-accent" style={{ borderRadius: 9, width: 36, flexShrink: 0, fontSize: 14 }}>↑</button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={onToggle}
        className="btn-accent"
        style={{
          position: "fixed",
          bottom: isMobile ? 80 : 20,
          right: isMobile ? 10 : 20,
          width: 48, height: 48,
          borderRadius: "50%",
          fontSize: 20,
          zIndex: 801,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px var(--accent-glow)",
          animation: open ? undefined : "bounce 3s ease 3s 2",
        }}
      >
        🤖
      </button>
    </>
  );
}
