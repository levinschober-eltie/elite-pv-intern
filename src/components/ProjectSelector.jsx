import React, { useState, useEffect } from "react";
import { styles, COLORS } from "../theme";
import { TextInput, SelectInput } from "./FormFields";
import { loadProjekte, saveProjekte } from "../modules/projekte/projektStore";

// ============================================================
// STATUS BADGE COLORS (matching ProjektVerwaltung)
// ============================================================
const STATUS_COLORS = {
  Planung: { bg: "#E3F2FD", color: "#1565C0" },
  Aktiv: { bg: "#E8F5E9", color: "#2E7D32" },
  Abgeschlossen: { bg: "#EEEEEE", color: "#616161" },
};

const TEAL = "#00897B";

// ============================================================
// STATUS BADGE
// ============================================================
function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.Planung;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 10.5,
        fontWeight: 600,
        background: colors.bg,
        color: colors.color,
        letterSpacing: 0.3,
      }}
    >
      {status}
    </span>
  );
}

// ============================================================
// PROJECT SELECTOR COMPONENT
// ============================================================
export default function ProjectSelector({ onSelect, selectedProjektId }) {
  const [mode, setMode] = useState("default"); // default | search | create | selected
  const [projekte, setProjekte] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [neuProjekt, setNeuProjekt] = useState({
    projektname: "",
    standort: "",
    status: "Planung",
  });

  // Load projects on mount
  useEffect(() => {
    const loaded = loadProjekte() || [];
    setProjekte(loaded);
  }, []);

  // Determine if a project is currently selected
  const selectedProjekt = selectedProjektId
    ? projekte.find((p) => p.id === selectedProjektId)
    : null;

  // If a project is selected externally, show summary mode
  const activeMode = selectedProjekt ? "selected" : mode;

  // Filter projects by search text
  const filteredProjekte = projekte.filter((p) => {
    if (!searchText.trim()) return true;
    const term = searchText.toLowerCase();
    return (
      (p.projektname || "").toLowerCase().includes(term) ||
      (p.standort || "").toLowerCase().includes(term)
    );
  }).slice(0, 5);

  // --------------------------------------------------------
  // HANDLERS
  // --------------------------------------------------------
  function handleSelectProjekt(projekt) {
    setMode("default");
    setSearchText("");
    onSelect(projekt);
  }

  function handleDeselectProjekt() {
    setMode("default");
    onSelect(null);
  }

  function handleCreateProjekt() {
    if (!neuProjekt.projektname.trim()) return;

    const newProjekt = {
      ...neuProjekt,
      id: Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7),
      erstelltAm: new Date().toISOString(),
    };

    const updated = [...projekte, newProjekt];
    saveProjekte(updated);
    setProjekte(updated);
    setNeuProjekt({ projektname: "", standort: "", status: "Planung" });
    setMode("default");
    onSelect(newProjekt);
  }

  function handleCancel() {
    setMode("default");
    setSearchText("");
    setNeuProjekt({ projektname: "", standort: "", status: "Planung" });
  }

  // --------------------------------------------------------
  // CARD WRAPPER STYLE
  // --------------------------------------------------------
  const cardStyle = {
    ...styles.card,
    borderLeft: `4px solid ${TEAL}`,
  };

  // --------------------------------------------------------
  // MODE: SELECTED – Project summary
  // --------------------------------------------------------
  if (activeMode === "selected" && selectedProjekt) {
    return (
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: COLORS.dark }}>
            {selectedProjekt.projektname}
          </span>
          <StatusBadge status={selectedProjekt.status} />
        </div>
        {selectedProjekt.standort && (
          <div style={{ fontSize: 12, color: COLORS.mid, marginBottom: 8 }}>
            {selectedProjekt.standort}
          </div>
        )}
        <div
          style={{
            fontSize: 11,
            color: COLORS.mid,
            fontStyle: "italic",
            marginBottom: 10,
          }}
        >
          Eigentümer- und Grundbuchdaten werden aus dem Projekt übernommen
        </div>
        <button
          type="button"
          style={{ ...styles.btnOutline, fontSize: 11, padding: "5px 12px" }}
          onClick={handleDeselectProjekt}
        >
          Projekt abwählen
        </button>
      </div>
    );
  }

  // --------------------------------------------------------
  // MODE: SEARCH – Find existing project
  // --------------------------------------------------------
  if (activeMode === "search") {
    return (
      <div style={cardStyle}>
        <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.dark, marginBottom: 10 }}>
          Projekt suchen
        </div>
        <TextInput
          label="Suche (Name oder Standort)"
          value={searchText}
          onChange={setSearchText}
          placeholder="z.B. Solarpark Döllnitz..."
        />
        <div style={{ marginTop: 10 }}>
          {filteredProjekte.length === 0 && (
            <div style={{ fontSize: 12, color: COLORS.mid, padding: "8px 0" }}>
              Keine Projekte gefunden.
            </div>
          )}
          {filteredProjekte.map((projekt) => (
            <div
              key={projekt.id}
              onClick={() => handleSelectProjekt(projekt)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 10px",
                borderRadius: 6,
                cursor: "pointer",
                border: "1px solid #e8e8e8",
                marginBottom: 4,
                background: COLORS.white,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.light)}
              onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.white)}
            >
              <span style={{ fontWeight: 600, fontSize: 12.5, color: COLORS.dark }}>
                {projekt.projektname}
              </span>
              <StatusBadge status={projekt.status} />
              {projekt.standort && (
                <span style={{ fontSize: 11, color: COLORS.mid, marginLeft: "auto" }}>
                  {projekt.standort}
                </span>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10 }}>
          <button type="button" style={styles.btnOutline} onClick={handleCancel}>
            Abbrechen
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // MODE: CREATE – Inline mini-form
  // --------------------------------------------------------
  if (activeMode === "create") {
    return (
      <div style={cardStyle}>
        <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.dark, marginBottom: 10 }}>
          Neues Projekt erstellen
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <TextInput
            label="Projektname *"
            value={neuProjekt.projektname}
            onChange={(val) => setNeuProjekt({ ...neuProjekt, projektname: val })}
            placeholder="z.B. Solarpark Döllnitz"
          />
          <TextInput
            label="Standort"
            value={neuProjekt.standort}
            onChange={(val) => setNeuProjekt({ ...neuProjekt, standort: val })}
            placeholder="z.B. 92670 Windischeschenbach"
          />
          <SelectInput
            label="Status"
            value={neuProjekt.status}
            onChange={(val) => setNeuProjekt({ ...neuProjekt, status: val })}
            options={["Planung", "Aktiv", "Abgeschlossen"]}
          />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button
            type="button"
            style={{
              ...styles.btnPrimary,
              opacity: neuProjekt.projektname.trim() ? 1 : 0.5,
            }}
            onClick={handleCreateProjekt}
            disabled={!neuProjekt.projektname.trim()}
          >
            Erstellen & Zuordnen
          </button>
          <button type="button" style={styles.btnOutline} onClick={handleCancel}>
            Abbrechen
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // MODE: DEFAULT – No project selected
  // --------------------------------------------------------
  return (
    <div style={cardStyle}>
      <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.dark, marginBottom: 2 }}>
        Projekt-Zuordnung
      </div>
      <div style={{ fontSize: 11, color: COLORS.mid, marginBottom: 12 }}>
        Optional: Vertrag einem Projekt zuordnen
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" style={styles.btnBlue} onClick={() => setMode("search")}>
          Projekt suchen
        </button>
        <button type="button" style={styles.btnOutline} onClick={() => setMode("create")}>
          Neues Projekt
        </button>
        <button type="button" style={styles.btnOutline} onClick={() => onSelect(null)}>
          Ohne Projekt
        </button>
      </div>
    </div>
  );
}
