import React from "react";
import { styles, COLORS } from "../theme";
import { TextInput, SelectInput, ToggleButton } from "./FormFields";

const EIGENTUEMER_TYPEN = [
  "Einzelperson",
  "Ehepaar",
  "Erbengemeinschaft",
  "GbR",
  "GmbH",
  "Sonstige",
];

const EIGENTUMS_ARTEN = [
  "Alleineigentümer",
  "Miteigentümer",
  "Sonstiges",
];

const leerePartner = () => ({
  id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
  name: "",
  geburtsdatum: "",
  adresse: "",
});

export default function OwnerFields({ eigentuemer, onChange }) {
  const update = (key) => (value) => {
    onChange({ ...eigentuemer, [key]: value });
  };

  const updatePartner = (index, key) => (value) => {
    const neuePartner = [...(eigentuemer.partner || [])];
    neuePartner[index] = { ...neuePartner[index], [key]: value };
    onChange({ ...eigentuemer, partner: neuePartner });
  };

  const addPartner = () => {
    onChange({
      ...eigentuemer,
      partner: [...(eigentuemer.partner || []), leerePartner()],
    });
  };

  const removePartner = (index) => {
    if ((eigentuemer.partner || []).length <= 1) return;
    const neuePartner = (eigentuemer.partner || []).filter((_, i) => i !== index);
    onChange({ ...eigentuemer, partner: neuePartner });
  };

  const zeigeVertretenDurch =
    eigentuemer.typ === "Erbengemeinschaft" ||
    eigentuemer.typ === "GmbH" ||
    eigentuemer.typ === "GbR";

  const zeigeHandelsregister =
    eigentuemer.typ === "GmbH" || eigentuemer.typ === "GbR";

  return (
    <div>
      {/* Eigentümertyp */}
      <SelectInput
        label="Eigentümertyp"
        value={eigentuemer.typ}
        onChange={update("typ")}
        options={EIGENTUEMER_TYPEN}
      />

      {/* Eigentumsverhältnis */}
      <div style={{ marginTop: 10 }}>
        <SelectInput
          label="Eigentumsverhältnis"
          value={eigentuemer.eigentumsart}
          onChange={update("eigentumsart")}
          options={EIGENTUMS_ARTEN}
        />
      </div>

      {/* Vertreten durch (Erbengemeinschaft, GbR, GmbH) */}
      {zeigeVertretenDurch && (
        <div style={{ marginTop: 10 }}>
          <TextInput
            label="Vertreten durch"
            value={eigentuemer.vertretenDurch}
            onChange={update("vertretenDurch")}
            placeholder="Name des Vertretungsberechtigten"
          />
        </div>
      )}

      {/* Handelsregister (GmbH, GbR) */}
      {zeigeHandelsregister && (
        <div style={{ marginTop: 10 }}>
          <TextInput
            label="Handelsregister"
            value={eigentuemer.handelsregister}
            onChange={update("handelsregister")}
            placeholder="HRB 12345, AG Weiden"
          />
        </div>
      )}

      {/* Partner-Liste */}
      <div style={{ marginTop: 14 }}>
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
            {eigentuemer.typ === "Ehepaar"
              ? "Ehepartner"
              : eigentuemer.typ === "Erbengemeinschaft"
              ? "Miterben"
              : "Beteiligte Personen"}
          </span>
          <button
            type="button"
            style={{
              ...styles.btnOutline,
              fontSize: 11,
              padding: "3px 10px",
            }}
            onClick={addPartner}
          >
            + Person
          </button>
        </div>

        {(eigentuemer.partner || []).map((partner, index) => (
          <div
            key={partner.id}
            style={{
              background: COLORS.light,
              borderRadius: 8,
              padding: "10px 12px",
              marginBottom: 8,
              border: "1px solid #e4e4e4",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.mid }}>
                Person {index + 1}
              </span>
              {(eigentuemer.partner || []).length > 1 && (
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    color: COLORS.red,
                    cursor: "pointer",
                    fontSize: 13,
                    padding: "2px 6px",
                  }}
                  onClick={() => removePartner(index)}
                  title="Entfernen"
                >
                  ✕
                </button>
              )}
            </div>
            <div style={styles.grid2}>
              <TextInput
                label="Name"
                value={partner.name}
                onChange={updatePartner(index, "name")}
                placeholder="Vor- und Nachname"
              />
              <TextInput
                label="Geburtsdatum (optional)"
                value={partner.geburtsdatum}
                onChange={updatePartner(index, "geburtsdatum")}
                placeholder="TT.MM.JJJJ"
              />
            </div>
            <div style={{ marginTop: 6 }}>
              <TextInput
                label="Adresse"
                value={partner.adresse}
                onChange={updatePartner(index, "adresse")}
                placeholder="Straße, PLZ Ort"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Eigentümeradresse */}
      <div
        style={{
          marginTop: 12,
          padding: "12px 14px",
          background: COLORS.lightBlue,
          borderRadius: 8,
          border: "1px solid #dde8f0",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: COLORS.dark,
            textTransform: "uppercase",
            letterSpacing: 0.4,
            marginBottom: 8,
          }}
        >
          Eigentümeradresse (falls abweichend)
        </div>
        <div style={styles.grid2}>
          <TextInput
            label="Straße"
            value={eigentuemer.eigStrasse}
            onChange={update("eigStrasse")}
          />
          <div style={styles.grid2}>
            <TextInput
              label="PLZ"
              value={eigentuemer.eigPlz}
              onChange={update("eigPlz")}
            />
            <TextInput
              label="Ort"
              value={eigentuemer.eigOrt}
              onChange={update("eigOrt")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Default-Daten für neue Eigentümer
export function createDefaultEigentuemer() {
  return {
    typ: "Einzelperson",
    eigentumsart: "Alleineigentümer",
    vertretenDurch: "",
    handelsregister: "",
    partner: [leerePartner()],
    eigStrasse: "",
    eigPlz: "",
    eigOrt: "",
  };
}
