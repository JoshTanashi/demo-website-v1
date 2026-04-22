import { useState } from "react";

export default function Auth({ user, onSignInOrUp, onSignOut, onClose }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [mode, setMode]         = useState("signin");

  async function handleSubmit() {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError(null);
    const res = await onSignInOrUp(email, password);
    if (!res.ok) { setError(res.error); setLoading(false); }
    else onClose();
  }

  return (
    <div className="modal-ovl" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box" style={{ width: "min(380px,calc(100vw - 32px))" }}>

        {user ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 17, color: "#fff", boxShadow: "0 4px 16px rgba(245,158,11,0.4)" }}>
                {user.email[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Prince Platform</div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>{user.email}</div>
              </div>
            </div>
            <button
              className="btn-accent"
              style={{ width: "100%", borderRadius: 10, padding: "13px", fontSize: 14 }}
              onClick={() => { onSignOut(); onClose(); }}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 17, color: "#fff", boxShadow: "0 4px 16px rgba(245,158,11,0.4)", flexShrink: 0 }}>P</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Prince Platform</div>
                <div style={{ fontSize: 10, color: "var(--text3)", letterSpacing: ".06em" }}>Property Rating Network · South Africa</div>
              </div>
            </div>

            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
              {mode === "signin" ? "Welcome back" : "Create account"}
            </div>
            <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 18, lineHeight: 1.5 }}>
              {mode === "signin" ? "Sign in to rate properties and track your reviews." : "Join thousands of South Africans rating complexes."}
            </div>

            {error && (
              <div style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.22)", borderRadius: 9, padding: "10px 13px", fontSize: 13, color: "var(--red)", marginBottom: 14, animation: "fadeIn .2s ease" }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {[["Email address", "email", "you@example.com", email, setEmail], ["Password", "password", "••••••••", password, setPassword]].map(([label, type, ph, val, set]) => (
                <div key={label}>
                  <label style={{ fontSize: 11, color: "var(--text3)", display: "block", marginBottom: 5, fontWeight: 500 }}>{label}</label>
                  <input
                    type={type} value={val}
                    onChange={(e) => set(e.target.value)}
                    placeholder={ph}
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 13px", color: "var(--text)", fontSize: 14, fontFamily: "inherit", outline: "none", transition: "all .2s" }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.background = "rgba(245,158,11,0.06)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className="btn-accent"
              disabled={loading}
              style={{ width: "100%", marginTop: 14, borderRadius: 10, padding: "13px", fontSize: 14 }}
            >
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>

            <div style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "var(--text3)" }}>
              {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
              <span
                onClick={() => { setMode((m) => m === "signin" ? "signup" : "signin"); setError(null); }}
                style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 500 }}
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
