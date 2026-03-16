import React, { createContext, useContext, useState, useCallback } from "react";
import { COLORS } from "../theme";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

const TOAST_STYLES = {
  success: { background: "#2E7D32", icon: "\u2713" },
  error: { background: "#D32F2F", icon: "\u2717" },
  warning: { background: "#E67700", icon: "\u26A0" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toasts.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 99999,
            display: "flex",
            flexDirection: "column-reverse",
            gap: 8,
            pointerEvents: "none",
          }}
        >
          {toasts.map((t) => {
            const s = TOAST_STYLES[t.type] || TOAST_STYLES.success;
            return (
              <div
                key={t.id}
                role="alert"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 18px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  background: s.background,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  pointerEvents: "auto",
                  animation: "toast-in 0.25s ease-out",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <span>{t.message}</span>
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes toast-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </ToastContext.Provider>
  );
}
