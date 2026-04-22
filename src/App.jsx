import { useState, useCallback, useEffect } from "react";
import MapView from "./components/Map";
import Rail from "./components/Rail";
import Drawer from "./components/Drawer";
import Auth from "./components/Auth";
import RateForm from "./components/RateForm";
import WorldChat from "./components/WorldChat";
import ChatBot from "./components/ChatBot";
import { Toaster, toast } from "./components/Toast";
import { usePlaces } from "./hooks/usePlaces";
import { useAuth } from "./hooks/useAuth";

/* ─── Mobile detection ─── */
function useIsMobile() {
  const [m, setM] = useState(window.innerWidth < 768);
  useEffect(() => {
    const h = () => setM(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return m;
}

/* ─── Score helpers ─── */
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

function ScoreBadge({ score, large }) {
  const s = score != null ? Number(score) : null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: scoreBg(s), color: scoreColor(s), borderRadius: large ? 8 : 5,
      fontSize: large ? 15 : 11, fontWeight: 700, padding: large ? "5px 11px" : "2px 7px",
      fontFamily: "'IBM Plex Mono',monospace", border: `1px solid ${scoreColor(s)}33`,
      minWidth: large ? 50 : 34, letterSpacing: ".02em", flexShrink: 0,
    }}>
      {s != null ? s.toFixed(1) : "—"}
    </span>
  );
}

/* ─── Drawer toggle tab ─── */
function DrawerToggle({ side, open, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed", top: "50%", transform: "translateY(-50%)",
        [side === "left" ? "left" : "right"]: open ? (side === "left" ? 308 : 318) : 10,
        transition: `${side} .32s cubic-bezier(.4,0,.2,1)`,
        zIndex: 350, height: 44, width: 17,
        background: "rgba(10,13,20,0.85)",
        backdropFilter: "blur(14px)",
        border: "1px solid var(--border2)",
        borderRadius: side === "left" ? "0 10px 10px 0" : "10px 0 0 10px",
        fontSize: 10, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: side === "left" ? "4px 0 16px rgba(0,0,0,0.4)" : "-4px 0 16px rgba(0,0,0,0.4)",
        color: "var(--text3)",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(245,158,11,0.18)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(10,13,20,0.85)"; e.currentTarget.style.color = "var(--text3)"; e.currentTarget.style.borderColor = "var(--border2)"; }}
    >
      {side === "left" ? (open ? "‹" : "›") : (open ? "›" : "‹")}
    </button>
  );
}

/* ─── Desktop top bar ─── */
function TopBar({ search, setSearch, user, onSignIn, onSignOut, onWorldChat, worldChatOpen, loading, placesCount }) {
  return (
    <header
      className="float-panel"
      style={{
        position: "fixed", top: 10, left: 10, right: 10, height: 52,
        display: "flex", alignItems: "center", gap: 12, padding: "0 14px",
        zIndex: 400, borderRadius: 16,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#fff", boxShadow: "0 4px 14px rgba(245,158,11,0.4)" }}>P</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em", lineHeight: 1.1 }}>Prince</div>
          <div style={{ fontSize: 9, color: "var(--text3)", letterSpacing: ".06em", textTransform: "uppercase", lineHeight: 1 }}>Platform</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 360, position: "relative" }}>
        <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", fontSize: 15, pointerEvents: "none" }}>⌕</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search complexes, suburbs…"
          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: 10, padding: "7px 12px 7px 28px", color: "var(--text)", fontSize: 12, outline: "none", fontFamily: "inherit", transition: "all .2s" }}
          onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.background = "rgba(245,158,11,0.06)"; }}
          onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
        />
      </div>

      <div style={{ flex: 1 }} />

      {/* Status */}
      {loading && <span style={{ fontSize: 11, color: "var(--text3)" }}>Loading…</span>}
      {!loading && <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "'IBM Plex Mono',monospace" }}>{placesCount} places</span>}

      {/* World chat */}
      <button
        onClick={onWorldChat}
        className="icon-btn"
        style={{
          borderRadius: 10, width: 36, height: 36, fontSize: 16, flexShrink: 0, position: "relative",
          background: worldChatOpen ? "var(--accent-dim)" : "rgba(255,255,255,0.06)",
          border: `1px solid ${worldChatOpen ? "var(--accent)" : "var(--border2)"}`,
          color: worldChatOpen ? "var(--accent)" : "var(--text2)",
        }}
      >
        🌍
        <span style={{ position: "absolute", top: 6, right: 6, width: 6, height: 6, borderRadius: "50%", background: "var(--green)", border: "1.5px solid rgba(10,13,20,0.8)" }} />
      </button>

      {/* User */}
      {user ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", boxShadow: "0 2px 8px var(--accent-glow)" }}>
            {user.email[0].toUpperCase()}
          </div>
          <button onClick={onSignOut} className="icon-btn" style={{ borderRadius: 8, padding: "5px 10px", fontSize: 11, width: "auto", height: "auto" }}>Sign out</button>
        </div>
      ) : (
        <button onClick={onSignIn} className="btn-accent" style={{ borderRadius: 10, padding: "7px 16px", fontSize: 12, flexShrink: 0 }}>Sign in</button>
      )}
    </header>
  );
}

/* ─── Mobile top bar ─── */
function MobileTopBar({ search, setSearch, user, onSignIn, onWorldChat, worldChatOpen }) {
  const [showSearch, setShowSearch] = useState(false);
  return (
    <div className="float-panel" style={{ position: "fixed", top: 10, left: 10, right: 10, zIndex: 400, borderRadius: 14, padding: "0 12px", height: 48, display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#fff", flexShrink: 0 }}>P</div>
      {showSearch ? (
        <input
          value={search} onChange={(e) => setSearch(e.target.value)} autoFocus placeholder="Search…"
          style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid var(--accent)", borderRadius: 8, padding: "6px 10px", color: "var(--text)", fontSize: 13, fontFamily: "inherit", outline: "none" }}
          onBlur={() => { if (!search) setShowSearch(false); }}
        />
      ) : (
        <>
          <div style={{ flex: 1, fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em" }}>Prince <span style={{ color: "var(--text3)", fontWeight: 400, fontSize: 12 }}>Platform</span></div>
          <button onClick={() => setShowSearch(true)} className="icon-btn" style={{ borderRadius: 9, width: 32, height: 32, fontSize: 15 }}>⌕</button>
        </>
      )}
      <button
        onClick={onWorldChat}
        className="icon-btn"
        style={{ borderRadius: 9, width: 32, height: 32, fontSize: 14, flexShrink: 0, position: "relative", background: worldChatOpen ? "var(--accent-dim)" : "rgba(255,255,255,0.06)", border: `1px solid ${worldChatOpen ? "var(--accent)" : "var(--border2)"}`, color: worldChatOpen ? "var(--accent)" : "var(--text2)" }}
      >
        🌍
        <span style={{ position: "absolute", top: 5, right: 5, width: 5, height: 5, borderRadius: "50%", background: "var(--green)", border: "1px solid rgba(10,13,20,0.8)" }} />
      </button>
      {user ? (
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{user.email[0].toUpperCase()}</div>
      ) : (
        <button onClick={onSignIn} className="btn-accent" style={{ borderRadius: 8, padding: "6px 12px", fontSize: 12, flexShrink: 0 }}>Sign in</button>
      )}
    </div>
  );
}

/* ─── Mobile bottom nav ─── */
function MobileBottomNav({ tab, setTab, hasSelected }) {
  const tabs = [
    { id: "map", icon: "🗺️", label: "Map" },
    { id: "places", icon: "🏢", label: "Places" },
    { id: "rate", icon: "⭐", label: "Rate" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];
  return (
    <div className="float-panel" style={{ position: "fixed", bottom: 10, left: 10, right: 10, height: 60, zIndex: 400, borderRadius: 14, display: "flex", overflow: "hidden" }}>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          style={{
            flex: 1, background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
            color: tab === t.id ? "var(--accent)" : "var(--text3)",
            fontFamily: "inherit", transition: "all .18s ease", position: "relative",
          }}
        >
          {t.id === "places" && hasSelected && (
            <span style={{ position: "absolute", top: 10, right: "50%", marginRight: -14, width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", border: "1.5px solid rgba(10,13,20,0.8)" }} />
          )}
          <span style={{ fontSize: 18, filter: tab === t.id ? "drop-shadow(0 0 6px var(--accent))" : "none", transition: "filter .2s" }}>{t.icon}</span>
          <span style={{ fontSize: 9, fontWeight: tab === t.id ? 600 : 400, letterSpacing: ".03em" }}>{t.label}</span>
          {tab === t.id && <div style={{ position: "absolute", bottom: 0, left: "20%", right: "20%", height: 2, background: "var(--accent)", borderRadius: 1 }} />}
        </button>
      ))}
    </div>
  );
}

/* ─── Mobile bottom sheet ─── */
function MobileSheet({ children, show, maxH = "65vh", onDismiss }) {
  if (!show) return null;
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 380, pointerEvents: onDismiss ? "auto" : "none" }}
      onClick={(e) => { if (e.target === e.currentTarget && onDismiss) onDismiss(); }}
    >
      <div
        className="sheet"
        style={{ position: "absolute", bottom: 80, left: 10, right: 10, borderRadius: 16, maxHeight: maxH, overflowY: "auto", animation: "sheetUp .28s cubic-bezier(.4,0,.2,1)" }}
      >
        <div style={{ width: 36, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2, margin: "10px auto 0" }} />
        {children}
      </div>
    </div>
  );
}

/* ─── Mobile places list ─── */
function MobilePlaces({ places, selectedId, onSelect }) {
  return (
    <div>
      <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em" }}>{places.length} Properties</div>
      </div>
      {places.map((p) => (
        <div
          key={p.place_id}
          onClick={() => onSelect(p.place_id)}
          style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
            borderBottom: "1px solid var(--border)", cursor: "pointer",
            background: p.place_id === selectedId ? "rgba(245,158,11,0.07)" : "transparent",
            transition: "background .15s",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: p.place_id === selectedId ? "var(--accent)" : "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 1 }}>{[p.suburb, p.city].filter(Boolean).join(" · ")} · {p.review_count ?? 0} reviews</div>
          </div>
          <ScoreBadge score={p.avg_overall} large />
        </div>
      ))}
    </div>
  );
}

/* ─── Mobile place detail ─── */
function MobileDetail({ place, user, onRate }) {
  if (!place) return null;
  const s = place.avg_overall != null ? Number(place.avg_overall) : null;
  return (
    <div>
      <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{place.name}</div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{[place.suburb, place.city].filter(Boolean).join(", ")}</div>
          </div>
          <ScoreBadge score={s} large />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
          <div style={{ display: "inline-flex", gap: 2 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} style={{ fontSize: 16, color: s != null && i <= Math.round(s) ? "#f59e0b" : "rgba(255,255,255,0.12)" }}>★</span>
            ))}
          </div>
          <span style={{ fontSize: 11, color: "var(--text3)" }}>{place.review_count ?? 0} reviews{place.type ? ` · ${place.type}` : ""}</span>
        </div>
      </div>
      <div style={{ padding: "14px" }}>
        {user ? (
          <button onClick={onRate} className="btn-accent" style={{ width: "100%", borderRadius: 12, padding: "14px", fontSize: 15, boxShadow: "0 4px 20px var(--accent-glow)" }}>⭐ Rate this place</button>
        ) : (
          <div style={{ textAlign: "center", fontSize: 13, color: "var(--text3)" }}>Sign in to rate this property.</div>
        )}
      </div>
    </div>
  );
}

/* ─── Main App ─── */
export default function App() {
  const { places, loading, error, reload } = usePlaces();
  const { user, signInOrUp, signOut }      = useAuth();

  const [selectedId, setSelectedId]     = useState(null);
  const [showAuth, setShowAuth]         = useState(false);
  const [showRate, setShowRate]         = useState(false);
  const [showWorldChat, setShowWorldChat] = useState(false);
  const [showChatBot, setShowChatBot]   = useState(false);
  const [leftOpen, setLeftOpen]         = useState(true);
  const [rightOpen, setRightOpen]       = useState(false);
  const [search, setSearch]             = useState("");
  const [mapBounds, setMapBounds]       = useState(null);
  const [mobileTab, setMobileTab]       = useState("map");

  const isMobile = useIsMobile();

  const selectedPlace = places.find((p) => p.place_id === selectedId) ?? null;

  const handleSelectPlace = useCallback((id) => {
    setSelectedId(id);
    if (id && !isMobile) setRightOpen(true);
    if (id && isMobile) setMobileTab("places");
  }, [isMobile]);

  const handleMapClick = useCallback(() => {
    setSelectedId(null);
    if (!isMobile) setRightOpen(false);
  }, [isMobile]);

  const handleRate = useCallback(() => {
    if (!user) { setShowAuth(true); return; }
    setShowRate(true);
  }, [user]);

  const handleRatingSubmitted = useCallback(async () => {
    setShowRate(false);
    await reload();
    toast("Rating saved!", "success");
  }, [reload]);

  const handleMobileTab = useCallback((t) => {
    if (t === "rate") { handleRate(); return; }
    if (t === "profile") { setShowAuth(true); return; }
    setMobileTab(t);
  }, [handleRate]);

  if (error) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Could not load data</div>
        <div style={{ fontSize: 13, color: "var(--red)", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", maxWidth: 480 }}>{error}</div>
        <button className="btn-accent" style={{ borderRadius: 10, padding: "10px 20px", fontSize: 14 }} onClick={reload}>Retry</button>
      </div>
    );
  }

  /* ── Mobile layout ── */
  if (isMobile) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "var(--bg)" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <MapView places={places} selectedId={selectedId} onSelectPlace={handleSelectPlace} onMapClick={handleMapClick} onBoundsChange={setMapBounds} />
        </div>

        <MobileTopBar search={search} setSearch={setSearch} user={user} onSignIn={() => setShowAuth(true)} onWorldChat={() => { setShowWorldChat((o) => !o); setShowChatBot(false); }} worldChatOpen={showWorldChat} />

        <MobileSheet show={mobileTab === "places" && !selectedId} onDismiss={() => setMobileTab("map")}>
          <MobilePlaces places={places} selectedId={selectedId} onSelect={handleSelectPlace} />
        </MobileSheet>

        <MobileSheet show={!!selectedId && mobileTab === "places"} maxH="72vh" onDismiss={() => { setSelectedId(null); setMobileTab("map"); }}>
          <MobileDetail place={selectedPlace} user={user} onRate={handleRate} />
        </MobileSheet>

        <WorldChat open={showWorldChat} onClose={() => setShowWorldChat(false)} isMobile />
        <ChatBot open={showChatBot} onToggle={() => { setShowChatBot((o) => !o); setShowWorldChat(false); }} isMobile />
        <MobileBottomNav tab={mobileTab} setTab={handleMobileTab} hasSelected={!!selectedId} />

        {showAuth && <Auth user={user} onSignInOrUp={signInOrUp} onSignOut={signOut} onClose={() => setShowAuth(false)} />}
        {showRate && selectedPlace && <RateForm place={selectedPlace} user={user} onClose={() => setShowRate(false)} onSubmitted={handleRatingSubmitted} />}
        <Toaster />
      </div>
    );
  }

  /* ── Desktop layout ── */
  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg)" }}>
      {/* Map background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <MapView places={places} selectedId={selectedId} onSelectPlace={handleSelectPlace} onMapClick={handleMapClick} onBoundsChange={setMapBounds} />

        {/* Score legend */}
        <div style={{
          position: "absolute", bottom: 20,
          left: leftOpen ? 320 : 20,
          transition: "left .32s cubic-bezier(.4,0,.2,1)",
          background: "rgba(10,13,20,0.82)", backdropFilter: "blur(14px)",
          border: "1px solid var(--border2)", borderRadius: 12, padding: "9px 13px", zIndex: 100,
        }}>
          <div style={{ fontSize: 9, color: "var(--text3)", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>Score</div>
          {[["≥4.0", "var(--green)"], ["≥3.0", "var(--yellow)"], ["≥2.0", "var(--orange)"], ["<2.0", "var(--red)"]].map(([l, c]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: c, boxShadow: `0 0 5px ${c}` }} />
              <span style={{ fontSize: 10, color: "var(--text3)", fontFamily: "'IBM Plex Mono',monospace" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating top bar */}
      <TopBar
        search={search} setSearch={setSearch}
        user={user} onSignIn={() => setShowAuth(true)} onSignOut={signOut}
        onWorldChat={() => { setShowWorldChat((o) => !o); setShowChatBot(false); }}
        worldChatOpen={showWorldChat}
        loading={loading} placesCount={places.length}
      />

      {/* Left drawer + toggle */}
      <DrawerToggle side="left" open={leftOpen} onClick={() => setLeftOpen((o) => !o)} />
      <Rail places={places} selectedId={selectedId} onSelectPlace={handleSelectPlace} mapBounds={mapBounds} search={search} open={leftOpen} />

      {/* Right drawer + toggle */}
      <DrawerToggle side="right" open={rightOpen} onClick={() => setRightOpen((o) => !o)} />
      <Drawer place={selectedPlace} user={user} onClose={() => { setSelectedId(null); setRightOpen(false); }} onRate={handleRate} open={rightOpen} />

      {/* World chat */}
      <WorldChat open={showWorldChat} onClose={() => setShowWorldChat(false)} isMobile={false} />

      {/* Chat bot */}
      <ChatBot open={showChatBot} onToggle={() => { setShowChatBot((o) => !o); setShowWorldChat(false); }} isMobile={false} />

      {/* Modals */}
      {showAuth && <Auth user={user} onSignInOrUp={signInOrUp} onSignOut={signOut} onClose={() => setShowAuth(false)} />}
      {showRate && selectedPlace && <RateForm place={selectedPlace} user={user} onClose={() => setShowRate(false)} onSubmitted={handleRatingSubmitted} />}

      <Toaster />
    </div>
  );
}
