import React from "react";
import { COLORS, styles } from "../theme";

export default function PlaceholderPage({ title, icon, description }) {
  return (
    <div style={{ maxWidth: 600, margin: "60px auto", textAlign: "center" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>{icon}</div>
      <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>
        {title}
      </h2>
      <p style={{ fontSize: 14, color: COLORS.mid, marginBottom: 20 }}>
        {description || "Modul kommt in Kürze"}
      </p>
      <div
        style={{
          ...styles.card,
          display: "inline-block",
          padding: "14px 28px",
        }}
      >
        <span style={{ fontSize: 12, color: COLORS.mid }}>
          🚧 In Entwicklung – wird im nächsten Chat implementiert
        </span>
      </div>
    </div>
  );
}
