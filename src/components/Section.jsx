import React from "react";
import { styles } from "../theme";
import { ICON_B64 } from "../assets/logo";

export default function Section({ title, icon, children }) {
  return (
    <div style={styles.card}>
      <div style={styles.sectionHeader}>
        {icon ? (
          <span style={{ fontSize: 16 }}>{icon}</span>
        ) : (
          <img src={ICON_B64} style={{ height: 18, borderRadius: 2 }} alt="" />
        )}
        {title}
      </div>
      {children}
    </div>
  );
}
