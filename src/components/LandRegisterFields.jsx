import React from "react";
import { styles, COLORS } from "../theme";

const leereZeile = () => ({
  id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
  grundbuchamt: "",
  gbBand: "",
  gbBlatt: "",
  gemarkung: "",
  flurNr: "",
  gesamtflaecheHa: "",
  pachtflaecheHa: "",
});

export default function LandRegisterFields({ zeilen, onChange }) {
  const updateZeile = (index, key, value) => {
    const neueZeilen = [...zeilen];
    neueZeilen[index] = { ...neueZeilen[index], [key]: value };
    onChange(neueZeilen);
  };

  const addZeile = () => {
    onChange([...zeilen, leereZeile()]);
  };

  const removeZeile = (index) => {
    if (zeilen.length <= 1) return;
    onChange(zeilen.filter((_, i) => i !== index));
  };

  // Summen berechnen
  const summeGesamt = zeilen.reduce(
    (sum, z) => sum + (parseFloat(z.gesamtflaecheHa) || 0),
    0
  );
  const summePacht = zeilen.reduce(
    (sum, z) => sum + (parseFloat(z.pachtflaecheHa) || 0),
    0
  );

  const headerStyle = {
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.yellow,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    padding: "6px 4px",
    textAlign: "left",
  };

  const cellInputStyle = {
    ...styles.input,
    fontSize: 12,
    padding: "5px 6px",
    background: COLORS.white,
  };

  const spalten = [
    { key: "grundbuchamt", label: "Grundbuchamt", flex: 2 },
    { key: "gbBand", label: "GB-Band", flex: 1 },
    { key: "gbBlatt", label: "GB-Blatt", flex: 1 },
    { key: "gemarkung", label: "Gemarkung", flex: 2 },
    { key: "flurNr", label: "Flur-Nr.", flex: 1 },
    { key: "gesamtflaecheHa", label: "Gesamt (ha)", flex: 1.2, type: "number" },
    { key: "pachtflaecheHa", label: "Pacht (ha)", flex: 1.2, type: "number" },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: COLORS.dark,
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          Grundbucheinträge
        </span>
        <button
          style={{
            ...styles.btnOutline,
            fontSize: 11,
            padding: "3px 10px",
          }}
          onClick={addZeile}
        >
          + Flurstück
        </button>
      </div>

      {/* Desktop: Tabelle */}
      <div
        style={{
          overflowX: "auto",
          borderRadius: 8,
          border: "1px solid #e4e4e4",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            background: COLORS.dark,
            borderRadius: "8px 8px 0 0",
            minWidth: 700,
          }}
        >
          {spalten.map((s) => (
            <div key={s.key} style={{ ...headerStyle, flex: s.flex }}>
              {s.label}
            </div>
          ))}
          <div style={{ ...headerStyle, width: 32 }} />
        </div>

        {/* Zeilen */}
        {zeilen.map((zeile, index) => (
          <div
            key={zeile.id}
            style={{
              display: "flex",
              alignItems: "center",
              background: index % 2 === 0 ? COLORS.white : COLORS.light,
              borderBottom: "1px solid #f0f0f0",
              minWidth: 700,
              padding: "3px 0",
            }}
          >
            {spalten.map((s) => (
              <div key={s.key} style={{ flex: s.flex, padding: "2px 3px" }}>
                <input
                  type={s.type || "text"}
                  value={zeile[s.key]}
                  onChange={(e) =>
                    updateZeile(
                      index,
                      s.key,
                      s.type === "number"
                        ? e.target.value
                        : e.target.value
                    )
                  }
                  style={cellInputStyle}
                  step={s.type === "number" ? "any" : undefined}
                />
              </div>
            ))}
            <div style={{ width: 32, textAlign: "center" }}>
              {zeilen.length > 1 && (
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: COLORS.red,
                    cursor: "pointer",
                    fontSize: 13,
                    padding: "2px 4px",
                  }}
                  onClick={() => removeZeile(index)}
                  title="Zeile entfernen"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Summenzeile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: COLORS.dark,
            borderRadius: "0 0 8px 8px",
            minWidth: 700,
            padding: "6px 0",
          }}
        >
          {spalten.map((s, idx) => (
            <div
              key={s.key}
              style={{
                flex: s.flex,
                padding: "2px 6px",
                fontSize: 11.5,
                fontWeight: 700,
                color:
                  s.key === "gesamtflaecheHa" || s.key === "pachtflaecheHa"
                    ? COLORS.yellow
                    : "transparent",
              }}
            >
              {s.key === "gesamtflaecheHa"
                ? `Σ ${summeGesamt.toFixed(2)} ha`
                : s.key === "pachtflaecheHa"
                ? `Σ ${summePacht.toFixed(2)} ha`
                : idx === 0
                ? "Summe"
                : ""}
              {idx === 0 && (
                <span style={{ color: COLORS.white, fontSize: 11, fontWeight: 700 }}>
                  Summe
                </span>
              )}
            </div>
          ))}
          <div style={{ width: 32 }} />
        </div>
      </div>
    </div>
  );
}

export function createDefaultGrundbuch() {
  return [leereZeile()];
}
