import React, { memo } from "react";
import { styles, COLORS } from "../theme";

export default memo(function DetailRow({ label, value, highlight }) {
  return (
    <div style={styles.detailRow}>
      <span style={{ color: COLORS.mid }}>{label}</span>
      <span
        style={{
          fontWeight: 600,
          color: highlight ? COLORS.green : undefined,
        }}
      >
        {value}
      </span>
    </div>
  );
})
