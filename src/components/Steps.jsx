import React from "react";
import { styles, COLORS } from "../theme";

export default function Steps({ tabs, activeStep, onStepClick }) {
  return (
    <>
      {/* Fortschrittsbalken */}
      <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
        {tabs.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background:
                i < activeStep
                  ? COLORS.green
                  : i === activeStep
                  ? COLORS.yellow
                  : "#ddd",
            }}
          />
        ))}
      </div>

      {/* Tab-Navigation – scrollbar auf Mobile */}
      <div
        style={{
          ...styles.tabBar,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          flexWrap: "nowrap",
        }}
      >
        {tabs.map((name, i) => (
          <button
            key={name}
            style={{
              ...styles.tabItem(i === activeStep),
              minWidth: "max-content",
              padding: "9px 10px",
              whiteSpace: "nowrap",
            }}
            onClick={() => onStepClick?.(i)}
          >
            {name}
          </button>
        ))}
      </div>
    </>
  );
}
