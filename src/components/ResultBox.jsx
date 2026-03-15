import React from "react";
import { styles, COLORS } from "../theme";

export default function ResultBox({ label, children }) {
  return (
    <div style={styles.resultBox}>
      <div
        style={{
          fontSize: 10.5,
          color: COLORS.mid,
          fontWeight: 600,
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

export function ResultGrid({ children }) {
  return <div style={styles.resultGrid}>{children}</div>;
}

export function ResultCell({ label, amount, sub }) {
  return (
    <div style={styles.resultCell}>
      <div style={{ fontSize: 10.5, color: COLORS.mid }}>{label}</div>
      <div style={styles.resultAmount}>{amount}</div>
      {sub && (
        <div style={{ fontSize: 11.5, color: COLORS.mid, marginTop: 2 }}>
          {sub}
        </div>
      )}
    </div>
  );
}
