import { useState } from "react";
import { supabase } from "../lib/supabase";
import { DIMENSIONS } from "../lib/config";

const ICONS = {
  safety_security: "🛡️",
  cleanliness_upkeep: "✨",
  newness_modernity: "🏗️",
  utilities_reliability: "⚡",
  body_corporate_financials: "🏢",
  value_for_money: "💰",
};

function Stars({ value, onChange, size = 21 }) {
  const [hov, setHov] = useState(0);
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          onClick={() => onChange && onChange(i === value ? null : i)}
          onMouseEnter={() => onChange && setHov(i)}
          onMouseLeave={() => onChange && setHov(0)}
          style={{
            fontSize: size, cursor: onChange ? "pointer" : "default",
            color: i <= (hov || value || 0) ? "#f59e0b" : "rgba(255,255,255,0.12)",
            transition: "color .1s,transform .12s", lineHeight: 1, userSelect: "none",
            display: "inline-block",
            transform: onChange && i <= (hov || value || 0) ? "scale(1.18)" : "scale(1)",
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function RateForm({ place, user, onClose, onSubmitted }) {
  const [scores, setScores] = useState({});
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const filled = DIMENSIONS.filter((d) => scores[d.col] != null);
  const count  = filled.length;
  const allDone = count === DIMENSIONS.length;

  async function submit() {
    if (count === 0) { setError("Rate at least one dimension."); return; }
    setSubmitting(true); setError(null);

    const payload = {
      place_id: place.place_id,
      user_id:  user.id,
      comment:  comment.trim() || null,
      ...Object.fromEntries(DIMENSIONS.map((d) => [d.col, scores[d.col] ?? null])),
    };

    const { error: err } = await supabase.from("ratings").upsert(payload, { onConflict: "place_id,user_id" });

    if (err) {
      setError(err.message);
      setSubmitting(false);
    } else {
      setDone(true);
      setTimeout(() => { onSubmitted(); onClose(); }, 1700);
    }
  }

  if (done) {
    return (
      <div className="modal-ovl">
        <div className="modal-box" style={{ textAlign: "center", padding: "52px 32px" }}>
          <div style={{ width: 58, height: 58, borderRadius: "50%", background: "rgba(34,197,94,0.14)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 16px" }}>✓</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Review submitted!</div>
          <div style={{ fontSize: 13, color: "var(--text3)" }}>Thank you for helping the community.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-ovl" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box" style={{ width: "min(450px,calc(100vw - 32px))", maxHeight: "90vh", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>Rate this property</div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{place.name}{place.suburb ? ` · ${place.suburb}` : ""}</div>
          </div>
          <button
            onClick={onClose}
            className="icon-btn"
            style={{ borderRadius: 8, width: 30, height: 30, fontSize: 16 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "var(--red)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "var(--text2)"; }}
          >
            ×
          </button>
        </div>

        {/* Info banner */}
        <div style={{ background: "var(--accent-dim)", border: "1px solid rgba(245,158,11,0.22)", borderRadius: 10, padding: "10px 13px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: "var(--accent)", lineHeight: 1.6 }}>Rate each dimension 1–5 stars based on your experience.</div>
        </div>

        {/* Progress bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${(count / DIMENSIONS.length) * 100}%`, height: "100%", background: "var(--accent)", transition: "width .3s ease", borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "'IBM Plex Mono',monospace", flexShrink: 0 }}>{count}/{DIMENSIONS.length}</span>
        </div>

        {/* Dimension rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {DIMENSIONS.map((d) => (
            <div
              key={d.col}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10,
                background: scores[d.col] != null ? "rgba(255,255,255,0.04)" : "transparent",
                border: `1px solid ${scores[d.col] != null ? "var(--border2)" : "transparent"}`,
                transition: "all .18s",
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{ICONS[d.col] ?? "●"}</span>
              <span style={{ flex: 1, fontSize: 13, color: scores[d.col] != null ? "var(--text)" : "var(--text2)", transition: "color .18s" }}>{d.label}</span>
              <Stars
                value={scores[d.col]}
                size={21}
                onChange={(v) => setScores((prev) => ({ ...prev, [d.col]: v }))}
              />
            </div>
          ))}
        </div>

        {/* Comment */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 5 }}>Comments (optional)</div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience…"
            rows={3}
            style={{
              width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
              borderRadius: 10, padding: "10px 12px", color: "var(--text)", fontSize: 12,
              fontFamily: "inherit", resize: "none", outline: "none", lineHeight: 1.6, transition: "border-color .2s",
            }}
            onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
          />
        </div>

        {error && <div style={{ fontSize: 12, color: "var(--red)", marginTop: 8 }}>{error}</div>}

        {/* Submit */}
        <button
          onClick={submit}
          disabled={submitting || count === 0}
          className={count > 0 ? "btn-accent" : ""}
          style={{
            width: "100%", marginTop: 14, borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 600,
            cursor: count > 0 ? "pointer" : "not-allowed", fontFamily: "inherit",
            background: count > 0 ? undefined : "rgba(255,255,255,0.05)",
            border: count > 0 ? "none" : "1px solid var(--border)",
            color: count > 0 ? "#fff" : "var(--text3)", transition: "all .2s",
          }}
        >
          {submitting ? "Submitting…" : count === 0 ? "Rate at least one dimension" : allDone ? "Submit review" : `Submit ${count} rating${count !== 1 ? "s" : ""}`}
        </button>
      </div>
    </div>
  );
}
