import { DIMENSIONS } from "../lib/config";

function scoreColor(s) {
  if (s == null) return "var(--text3)";
  if (s >= 4) return "var(--green)";
  if (s >= 3) return "var(--yellow)";
  if (s >= 2) return "var(--orange)";
  return "var(--red)";
}

function scoreBg(s) {
  if (s == null) return "transparent";
  if (s >= 4) return "var(--green-dim)";
  if (s >= 3) return "var(--yellow-dim)";
  if (s >= 2) return "var(--orange-dim)";
  return "var(--red-dim)";
}

function scoreLabel(s) {
  if (s == null) return "Unrated";
  if (s >= 4.5) return "Excellent";
  if (s >= 4)   return "Very Good";
  if (s >= 3)   return "Average";
  if (s >= 2)   return "Below Avg";
  return "Poor";
}

function fmt(v) { return v != null ? Number(v).toFixed(1) : "—"; }

const ICONS = {
  safety_security: "🛡️",
  cleanliness_upkeep: "✨",
  newness_modernity: "🏗️",
  utilities_reliability: "⚡",
  body_corporate_financials: "🏢",
  value_for_money: "💰",
};

export default function Drawer({ place, user, onClose, onRate, open }) {
  return (
    <aside
      className="float-panel"
      style={{
        position: "fixed", right: 10, top: 72, bottom: 10, width: 310,
        borderRadius: 16, zIndex: 300, overflowY: "auto", display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(330px)",
        transition: "transform .32s cubic-bezier(.4,0,.2,1)",
      }}
    >
      {!place ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, opacity: .3 }}>
          <div style={{ fontSize: 36 }}>🗺️</div>
          <div style={{ fontSize: 12, color: "var(--text3)", textAlign: "center", maxWidth: 150, lineHeight: 1.6 }}>Click a property on the map to see details</div>
        </div>
      ) : (
        <div style={{ animation: "slideInRight .2s ease" }}>
          {/* Header */}
          <div style={{
            padding: "14px 14px 12px", borderBottom: "1px solid var(--border)",
            position: "sticky", top: 0,
            background: "rgba(10,13,20,0.92)", backdropFilter: "blur(20px)",
            borderRadius: "16px 16px 0 0", zIndex: 2,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {place.name}
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
                  {[place.suburb, place.city].filter(Boolean).join(", ")}
                </div>
              </div>
              <button
                onClick={onClose}
                className="icon-btn"
                style={{ borderRadius: 8, width: 28, height: 28, fontSize: 15, flexShrink: 0, marginLeft: 8 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.35)"; e.currentTarget.style.color = "var(--red)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text2)"; }}
              >
                ×
              </button>
            </div>

            {/* Score summary */}
            <div style={{ marginTop: 12, padding: "11px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 28, fontWeight: 700, color: scoreColor(place.avg_overall), lineHeight: 1 }}>
                  {fmt(place.avg_overall)}
                </div>
                <div style={{ fontSize: 9, color: "var(--text3)", marginTop: 3, textTransform: "uppercase", letterSpacing: ".06em" }}>
                  {scoreLabel(place.avg_overall)}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "inline-flex", gap: 2 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} style={{
                      fontSize: 13, color: place.avg_overall != null && i <= Math.round(Number(place.avg_overall))
                        ? "#f59e0b" : "rgba(255,255,255,0.12)",
                    }}>★</span>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>
                  {place.review_count ?? 0} verified review{place.review_count !== 1 ? "s" : ""}
                </div>
                {place.type && <div style={{ fontSize: 11, color: "var(--text3)" }}>{place.type}</div>}
              </div>
            </div>
          </div>

          {/* Description */}
          {place.description && (
            <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
              <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.65 }}>{place.description}</p>
            </div>
          )}

          {/* Rating breakdown */}
          <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 6 }}>
              Rating Breakdown
            </div>
            {DIMENSIONS.map((d, i) => {
              const val = place[`avg_${d.col}`];
              const s = val != null ? Number(val) : null;
              return (
                <div
                  key={d.col}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "7px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.03)",
                    animation: `slideInRight .2s ease ${i * 0.05}s both`,
                  }}
                >
                  <span style={{ fontSize: 13, flexShrink: 0 }}>{ICONS[d.col] ?? "●"}</span>
                  <span style={{ flex: 1, fontSize: 12, color: "var(--text2)" }}>{d.label}</span>
                  <div style={{ width: 70, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden", flexShrink: 0 }}>
                    <div style={{ width: `${s != null ? (s / 5) * 100 : 0}%`, height: "100%", borderRadius: 2, background: scoreColor(s), boxShadow: s != null ? `0 0 5px ${scoreColor(s)}66` : "none", transition: "width .5s ease" }} />
                  </div>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 600, color: scoreColor(s), minWidth: 26, textAlign: "right" }}>
                    {fmt(val)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Last rated */}
          {place.last_rated_at && (
            <div style={{ padding: "8px 14px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>
                Last rated {new Date(place.last_rated_at).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Actions */}
          <div style={{ padding: "14px" }}>
            {user ? (
              <button
                onClick={onRate}
                className="btn-accent"
                style={{ width: "100%", borderRadius: 10, padding: "12px", fontSize: 14 }}
              >
                ★ Rate this place
              </button>
            ) : (
              <div style={{ textAlign: "center", fontSize: 12, color: "var(--text3)", padding: "8px 0" }}>
                Sign in to leave a rating.
              </div>
            )}
            <button
              style={{
                width: "100%", marginTop: 8, background: "transparent",
                border: "1px solid var(--border)", color: "var(--text2)",
                borderRadius: 10, padding: "10px", fontSize: 12,
                cursor: "pointer", fontFamily: "inherit", transition: "all .2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text2)"; }}
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
              }}
            >
              Share property
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
