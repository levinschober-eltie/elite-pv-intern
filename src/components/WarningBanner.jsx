import React from "react";
import { styles } from "../theme";

export default function WarningBanner({ warnungen }) {
  if (!warnungen || warnungen.length === 0) return null;

  return (
    <div style={styles.warnung}>
      ⚠️ {warnungen.join(" | ")}
    </div>
  );
}
