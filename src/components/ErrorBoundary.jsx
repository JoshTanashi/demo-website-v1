import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          position: "fixed", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "#0a0c10", color: "#e8eaf0", fontFamily: "monospace",
          padding: "32px", gap: "16px"
        }}>
          <div style={{ fontSize: "24px" }}>Something went wrong</div>
          <pre style={{
            background: "#111318", border: "1px solid #1e2128", borderRadius: "8px",
            padding: "16px", maxWidth: "600px", overflow: "auto",
            fontSize: "12px", color: "#ef4444"
          }}>
            {this.state.error.message}
          </pre>
          <button
            style={{ padding: "8px 20px", background: "#6366f1", color: "#fff",
              border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" }}
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
