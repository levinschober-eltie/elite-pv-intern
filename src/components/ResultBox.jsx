import React, { memo } from "react";
import { styles, COLORS } from "../theme";

const ResultBox = memo(function ResultBox({ label, children }) {
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
});

export default ResultBox;

export const ResultGrid = memo(function ResultGrid({ children }) {
  return <div style={styles.resultGrid}>{children}</div>;
});

export const ResultCell = memo(function ResultCell({ label, amount, sub }) {
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
});
