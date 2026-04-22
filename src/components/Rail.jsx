import { useMemo, useState } from "react";
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

function ScoreBadge({ score }) {
  const s = score != null ? Number(score) : null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: scoreBg(s), color: scoreColor(s), borderRadius: 5,
      fontSize: 11, fontWeight: 700, padding: "2px 7px",
      fontFamily: "'IBM Plex Mono',monospace",
      border: `1px solid ${scoreColor(s)}33`,
      minWidth: 34, letterSpacing: ".02em", flexShrink: 0,
    }}>
      {s != null ? s.toFixed(1) : "—"}
    </span>
  );
}

export default function Rail({ places, selectedId, onSelectPlace, mapBounds, search, open }) {
  const [minRating, setMin] = useState(0);
  const [typeFilter, setType] = useState("");
  const [mode, setMode] = useState("inView");

  const types = useMemo(() => [...new Set(places.map((p) => p.type).filter(Boolean))], [places]);

  const filtered = useMemo(() => {
    let list = places;

    if (mode === "inView" && mapBounds) {
      list = list.filter((p) =>
        p.lng >= mapBounds.getWest() && p.lng <= mapBounds.getEast() &&
        p.lat >= mapBounds.getSouth() && p.lat <= mapBounds.getNorth()
      );
    } else if (mode === "topRated") {
      list = [...list].sort((a, b) => (b.avg_overall ?? 0) - (a.avg_overall ?? 0)).slice(0, 20);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        `${p.name} ${p.suburb ?? ""} ${p.city ?? ""}`.toLowerCase().includes(q)
      );
    }

    if (minRating > 0) list = list.filter((p) => (p.avg_overall ?? 0) >= minRating);
    if (typeFilter)    list = list.filter((p) => p.type === typeFilter);

    return list;
  }, [places, mode, mapBounds, search, minRating, typeFilter]);

  return (
    <aside
      className="float-panel"
      style={{
        position: "fixed", left: 10, top: 72, bottom: 10, width: 290,
        borderRadius: 16, zIndex: 300, overflowY: "auto", display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(-310px)",
        transition: "transform .32s cubic-bezier(.4,0,.2,1)",
      }}
    >
      {/* Header */}
      <div style={{
        padding: "10px 12px 8px", borderBottom: "1px solid var(--border)",
        position: "sticky", top: 0,
        background: "rgba(10,13,20,0.92)", backdropFilter: "blur(12px)",
        borderRadius: "16px 16px 0 0", zIndex: 2,
      }}>
        <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8 }}>
          {filtered.length} {filtered.length === 1 ? "property" : "properties"}
        </div>

        {/* Filters row */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["inView", "topRated", "all"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                background: mode === m ? "var(--accent-dim)" : "transparent",
                border: `1px solid ${mode === m ? "var(--accent)" : "var(--border)"}`,
                color: mode === m ? "var(--accent)" : "var(--text3)",
                borderRadius: 8, padding: "4px 9px", fontSize: 10, cursor: "pointer",
                fontFamily: "inherit", transition: "all .15s",
              }}
            >
              {m === "inView" ? "In view" : m === "topRated" ? "Top rated" : "All"}
            </button>
          ))}
        </div>

        {types.length > 0 && (
          <select
            value={typeFilter}
            onChange={(e) => setType(e.target.value)}
            style={{
              marginTop: 6, width: "100%", background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)", borderRadius: 8,
              padding: "5px 8px", color: "var(--text2)", fontSize: 11,
              fontFamily: "inherit", outline: "none", cursor: "pointer",
            }}
          >
            <option value="">All types</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        )}

        {minRating > 0 && (
          <div style={{ marginTop: 6, fontSize: 10, color: "var(--text3)" }}>
            Min rating: ≥{minRating}
          </div>
        )}
        <input
          type="range" min="0" max="5" step="0.5" value={minRating}
          onChange={(e) => setMin(Number(e.target.value))}
          style={{ width: "100%", marginTop: 4, accentColor: "var(--accent)" }}
        />
      </div>

      {/* List */}
      <div style={{ flex: 1, padding: "4px 0" }}>
        {filtered.length === 0 && (
          <div style={{ padding: 24, textAlign: "center", color: "var(--text3)", fontSize: 12 }}>
            No properties match your filters.
          </div>
        )}
        {filtered.map((p, i) => {
          const isSel = p.place_id === selectedId;
          return (
            <div
              key={p.place_id}
              onClick={() => onSelectPlace(p.place_id)}
              style={{
                padding: "10px 12px",
                borderBottom: "1px solid var(--border)",
                cursor: "pointer",
                background: isSel ? "rgba(245,158,11,0.07)" : "transparent",
                borderLeft: `2px solid ${isSel ? "var(--accent)" : "transparent"}`,
                transition: "all .18s ease",
                animation: open ? `slideInLeft .22s ease ${i * 0.03}s both` : undefined,
              }}
              onMouseEnter={(e) => { if (!isSel) { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderLeftColor = "rgba(245,158,11,0.25)"; } }}
              onMouseLeave={(e) => { if (!isSel) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderLeftColor = "transparent"; } }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 600, fontSize: 13,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    color: isSel ? "var(--accent)" : "var(--text)", transition: "color .18s",
                  }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1 }}>
                    {[p.suburb, p.city].filter(Boolean).join(" · ")}
                  </div>
                  {p.type && (
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>{p.type}</div>
                  )}
                </div>
                <ScoreBadge score={p.avg_overall} />
              </div>

              {/* Mini dimension bars */}
              <div style={{ display: "flex", gap: 2, marginTop: 7, alignItems: "flex-end", height: 16 }}>
                {DIMENSIONS.map((d) => {
                  const val = p[`avg_${d.col}`];
                  const pct = val != null ? (Number(val) / 5) * 100 : 10;
                  return (
                    <div key={d.col} style={{ flex: 1 }}>
                      <div style={{
                        height: Math.max(2, (pct / 100) * 14),
                        borderRadius: 2,
                        background: scoreColor(val != null ? Number(val) : null),
                        opacity: .65,
                      }} />
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 10, color: "var(--text3)", fontFamily: "'IBM Plex Mono',monospace" }}>
                  {p.review_count ?? 0} review{p.review_count !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
