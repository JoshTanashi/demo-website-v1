import { useState, useCallback, useEffect } from "react";

let _addToast = null;

export function toast(message, type = "info") {
  _addToast?.({ message, type, id: Date.now() });
}

export function Toaster() {
  const [toasts, setToasts] = useState([]);

  _addToast = useCallback((t) => {
    setToasts((prev) => [...prev, t]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 3500);
  }, []);

  return (
    <div className="toaster" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`}>{t.message}</div>
      ))}
    </div>
  );
}
