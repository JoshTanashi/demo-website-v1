import { useState } from "react";

const SEED = [
  { id: 1, user: "Thabo M.", av: "T", time: "2m", text: "Has anyone lived in Sandton Heights? Worth the price?" },
  { id: 2, user: "Lerato K.", av: "L", time: "5m", text: "Gorgeous but pricey. Body corporate is very responsive though." },
  { id: 3, user: "Sipho N.", av: "S", time: "8m", text: "Sea Point properties improving a lot lately — check new listings." },
  { id: 4, user: "Anja V.", av: "A", time: "12m", text: "Load shedding in Berea? Worried about the utilities score there." },
  { id: 5, user: "Ravi P.", av: "R", time: "18m", text: "Menlyn Maine is next level — smart home, top security, great value." },
];

function avColor(av) {
  return `hsl(${av.charCodeAt(0) * 37 % 360},35%,28%)`;
}

export default function WorldChat({ open, onClose, isMobile }) {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState(SEED);

  function send() {
    if (!input.trim()) return;
    setMsgs((m) => [{ id: Date.now(), user: "You", av: "Y", time: "now", text: input.trim() }, ...m]);
    setInput("");
  }

  if (!open) return null;

  const style = isMobile
    ? { position: "fixed", bottom: 80, left: 10, right: 10, height: 380, borderRadius: 16, zIndex: 500 }
    : { position: "fixed", top: 72, right: 10, width: 300, height: 420, borderRadius: 16, zIndex: 500 };

  return (
    <div className="float-panel" style={{ ...style, display: "flex", flexDirection: "column", animation: "slideUp .22s ease", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 6px var(--green)", flexShrink: 0 }} />
        <div style={{ fontWeight: 600, fontSize: 13 }}>Community Chat</div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10, color: "var(--text3)" }}>24 online</span>
        <button onClick={onClose} className="icon-btn" style={{ borderRadius: 7, width: 22, height: 22, fontSize: 14, marginLeft: 4, flexShrink: 0 }}>×</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px", display: "flex", flexDirection: "column", gap: 8 }}>
        {msgs.map((m) => (
          <div key={m.id} style={{ display: "flex", gap: 8, animation: "fadeIn .18s ease" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: avColor(m.av), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>{m.av}</div>
            <div>
              <div style={{ display: "flex", gap: 5, alignItems: "baseline", marginBottom: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: m.user === "You" ? "var(--accent)" : "var(--text)" }}>{m.user}</span>
                <span style={{ fontSize: 9, color: "var(--text3)" }}>{m.time} ago</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.55, background: "rgba(255,255,255,0.04)", padding: "6px 9px", borderRadius: "2px 9px 9px 9px", border: "1px solid var(--border)" }}>{m.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: "10px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Join the discussion…"
          style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: 9, padding: "8px 11px", color: "var(--text)", fontSize: 12, fontFamily: "inherit", outline: "none", transition: "border-color .15s" }}
          onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; }}
          onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
        />
        <button onClick={send} className="icon-btn" style={{ borderRadius: 9, width: 36, flexShrink: 0, fontSize: 14 }}>↑</button>
      </div>
    </div>
  );
}
