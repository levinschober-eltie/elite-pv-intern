import React from "react";
import { styles, COLORS } from "../theme";

export default function ClauseEditor({ klauseln, setKlauseln, defaultKlauseln }) {
  const updateKlausel = (id, neuerText) => {
    setKlauseln((prev) =>
      prev.map((k) => (k.id === id ? { ...k, text: neuerText } : k))
    );
  };

  const resetKlauseln = () => {
    setKlauseln(defaultKlauseln.map((k) => ({ ...k })));
  };

  return (
    <>
      <p style={{ fontSize: 12, color: COLORS.mid, margin: "0 0 12px" }}>
        Klauseln anpassen – Kundendaten und Preise werden automatisch ins
        Dokument übernommen.
      </p>
      {klauseln.map((klausel) => (
        <div key={klausel.id} style={styles.clauseBox}>
          <div style={styles.clauseTitle}>{klausel.titel}</div>
          <textarea
            style={styles.clauseTextarea}
            value={klausel.text}
            onChange={(e) => updateKlausel(klausel.id, e.target.value)}
          />
        </div>
      ))}
      <div style={{ textAlign: "right", marginTop: 4 }}>
        <button
          style={{ ...styles.btnOutline, fontSize: 11, padding: "5px 12px" }}
          onClick={resetKlauseln}
        >
          ↺ Standard
        </button>
      </div>
    </>
  );
}
