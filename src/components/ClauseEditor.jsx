import React from "react";
import { styles, COLORS } from "../theme";
import { setKlauseln as persistKlauseln } from "../lib/klauselStore";

export default function ClauseEditor({ klauseln, setKlauseln, defaultKlauseln, storageKey }) {
  const updateKlausel = (id, neuerText) => {
    setKlauseln((prev) => {
      const next = prev.map((k) => (k.id === id ? { ...k, text: neuerText } : k));
      if (storageKey) persistKlauseln(storageKey, next);
      return next;
    });
  };

  const resetKlauseln = () => {
    const defaults = defaultKlauseln.map((k) => ({ ...k }));
    setKlauseln(defaults);
    if (storageKey) persistKlauseln(storageKey, defaults);
  };

  return (
    <>
      <p style={{ fontSize: 12, color: COLORS.mid, margin: "0 0 12px" }}>
        Klauseln anpassen – Kundendaten und Preise werden automatisch ins
        Dokument übernommen.
      </p>
      {klauseln.map((klausel) => (
        <div key={klausel.id} style={styles.clauseBox}>
          <label htmlFor={`clause-${klausel.id}`} style={styles.clauseTitle}>{klausel.titel}</label>
          <textarea
            id={`clause-${klausel.id}`}
            style={styles.clauseTextarea}
            value={klausel.text}
            onChange={(e) => updateKlausel(klausel.id, e.target.value)}
          />
        </div>
      ))}
      <div style={{ textAlign: "right", marginTop: 4 }}>
        <button
          type="button"
          style={{ ...styles.btnOutline, fontSize: 11, padding: "5px 12px" }}
          onClick={resetKlauseln}
        >
          ↺ Standard
        </button>
      </div>
    </>
  );
}
