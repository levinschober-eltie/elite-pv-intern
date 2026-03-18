import React, { useState, useEffect, useRef, useCallback } from "react";
import { styles, COLORS } from "../../theme";
import { TextInput, SelectInput } from "../../components/FormFields";
import Section from "../../components/Section";
import { useToast } from "../../components/Toast";
import OwnerFields, { createDefaultEigentuemer } from "../../components/OwnerFields";
import LandRegisterFields, { createDefaultGrundbuch } from "../../components/LandRegisterFields";
import { loadProjekte, saveProjekte } from "./projektStore";

// ============================================================
// CONSTANTS
// ============================================================
const STATUS_OPTIONS = ["Planung", "Aktiv", "Abgeschlossen"];
const FILTER_OPTIONS = ["Alle", ...STATUS_OPTIONS];
const ANLAGEN_TYP_OPTIONS = ["Freifläche", "Dach", "BESS", "Hybrid"];
const TAB_LABELS = ["Allgemein", "Eigentümer", "Grundbuch", "Anlagendaten", "Bank", "Verträge", "Notizen"];

const EMPTY_PROJEKT = {
  projektname: "",
  status: "Planung",
  standort: "",
  anlagendaten: { leistungKwp: "", leistungMwp: "", flaeche: "", typ: "Freifläche" },
  bankverbindung: { iban: "", bic: "", kontoinhaber: "" },
  notizen: "",
};

const STATUS_BADGE_COLORS = {
  Planung: { bg: "#E3F2FD", color: "#1565C0" },
  Aktiv: { bg: "#E8F5E9", color: "#2E7D32" },
  Abgeschlossen: { bg: "#EEEEEE", color: "#616161" },
};

// ============================================================
// HELPERS
// ============================================================
function formatDate(isoStr) {
  if (!isoStr) return "–";
  const d = new Date(isoStr);
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ============================================================
// COMPONENT
// ============================================================
export default function ProjektVerwaltung() {
  const showToast = useToast();
  const fileInputRef = useRef(null);

  const [projekte, setProjekte] = useState(() => loadProjekte());
  const [suchbegriff, setSuchbegriff] = useState("");
  const [filterStatus, setFilterStatus] = useState("Alle");
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_PROJEKT });
  const [activeDetailTab, setActiveDetailTab] = useState(0);
  const [selectedProjektId, setSelectedProjektId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Separate state for eigentuemer and grundbuch (like generators)
  const [eigentuemer, setEigentuemer] = useState(createDefaultEigentuemer());
  const [grundbuch, setGrundbuch] = useState(createDefaultGrundbuch());

  // Persist on change
  useEffect(() => {
    try {
      saveProjekte(projekte);
    } catch (e) {
      showToast("Speichern fehlgeschlagen – localStorage voll?", "error");
    }
  }, [projekte]);

  // ---- Form helpers ----
  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setAnlagendatenField = useCallback((key, value) => {
    setForm((prev) => ({
      ...prev,
      anlagendaten: { ...prev.anlagendaten, [key]: value },
    }));
  }, []);

  const setBankField = useCallback((key, value) => {
    setForm((prev) => ({
      ...prev,
      bankverbindung: { ...prev.bankverbindung, [key]: value },
    }));
  }, []);

  const openAdd = () => {
    setEditId(null);
    setForm({ ...EMPTY_PROJEKT, anlagendaten: { ...EMPTY_PROJEKT.anlagendaten }, bankverbindung: { ...EMPTY_PROJEKT.bankverbindung } });
    setEigentuemer(createDefaultEigentuemer());
    setGrundbuch(createDefaultGrundbuch());
    setActiveDetailTab(0);
    setFormOpen(true);
  };

  const openEdit = (projekt) => {
    setEditId(projekt.id);
    setForm({
      projektname: projekt.projektname || "",
      status: projekt.status || "Planung",
      standort: projekt.standort || "",
      anlagendaten: {
        leistungKwp: projekt.anlagendaten?.leistungKwp || "",
        leistungMwp: projekt.anlagendaten?.leistungMwp || "",
        flaeche: projekt.anlagendaten?.flaeche || "",
        typ: projekt.anlagendaten?.typ || "Freifläche",
      },
      bankverbindung: {
        iban: projekt.bankverbindung?.iban || "",
        bic: projekt.bankverbindung?.bic || "",
        kontoinhaber: projekt.bankverbindung?.kontoinhaber || "",
      },
      notizen: projekt.notizen || "",
    });
    // Extract eigentuemer and grundbuch from projekt
    setEigentuemer(projekt.eigentuemer || createDefaultEigentuemer());
    setGrundbuch(
      Array.isArray(projekt.grundbuch) && projekt.grundbuch.length > 0
        ? projekt.grundbuch
        : createDefaultGrundbuch()
    );
    setActiveDetailTab(0);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditId(null);
    setForm({ ...EMPTY_PROJEKT, anlagendaten: { ...EMPTY_PROJEKT.anlagendaten }, bankverbindung: { ...EMPTY_PROJEKT.bankverbindung } });
    setEigentuemer(createDefaultEigentuemer());
    setGrundbuch(createDefaultGrundbuch());
    setActiveDetailTab(0);
  };

  const handleSave = () => {
    if (!form.projektname.trim()) {
      showToast("Bitte Projektname eingeben.", "error");
      return;
    }

    const now = new Date().toISOString();
    // Merge eigentuemer and grundbuch into the saved object
    const projektData = {
      ...form,
      eigentuemer,
      grundbuch,
    };

    if (editId) {
      setProjekte((prev) =>
        prev.map((p) =>
          p.id === editId ? { ...p, ...projektData, geaendertAm: now } : p
        )
      );
      showToast("Projekt aktualisiert.");
    } else {
      const neuesProjekt = {
        ...projektData,
        id: Date.now().toString(),
        vertraege: [],
        erstelltAm: now,
        geaendertAm: now,
      };
      setProjekte((prev) => [neuesProjekt, ...prev]);
      showToast("Projekt hinzugefügt.");
    }
    closeForm();
  };

  // ---- Delete ----
  const handleDelete = (id) => {
    setProjekte((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
    showToast("Projekt gelöscht.");
  };

  // ---- Export ----
  const handleExport = () => {
    if (projekte.length === 0) {
      showToast("Keine Projekte zum Exportieren.", "warning");
      return;
    }
    const blob = new Blob([JSON.stringify(projekte, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `elite-pv-projekte_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`${projekte.length} Projekte exportiert.`);
  };

  // ---- Import ----
  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) {
          showToast("Ungültige Datei: Kein Array.", "error");
          return;
        }
        const valid = imported.filter(
          (item) => item && item.projektname && typeof item.projektname === "string"
        );
        if (valid.length === 0) {
          showToast("Keine gültigen Projekte in der Datei gefunden.", "error");
          return;
        }
        // Merge: skip duplicates by ID
        const existingIds = new Set(projekte.map((p) => p.id));
        let addedCount = 0;
        const merged = [...projekte];
        for (const item of valid) {
          if (item.id && !existingIds.has(item.id)) {
            merged.push(item);
            existingIds.add(item.id);
            addedCount++;
          }
        }
        setProjekte(merged);
        showToast(`${addedCount} neue Projekte importiert.`);
      } catch {
        showToast("Fehler beim Lesen der Datei.", "error");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  // ---- Filtering ----
  const gefilterteProjekte = projekte.filter((p) => {
    const suchMatch =
      !suchbegriff ||
      (p.projektname && p.projektname.toLowerCase().includes(suchbegriff.toLowerCase())) ||
      (p.standort && p.standort.toLowerCase().includes(suchbegriff.toLowerCase()));
    const statusMatch = filterStatus === "Alle" || p.status === filterStatus;
    return suchMatch && statusMatch;
  });

  // ============================================================
  // RENDER: FORM TABS
  // ============================================================
  const renderFormTab = () => {
    switch (activeDetailTab) {
      // ---- Allgemein ----
      case 0:
        return (
          <div style={styles.grid2}>
            <TextInput
              label="Projektname *"
              value={form.projektname}
              onChange={(v) => setField("projektname", v)}
              placeholder="PV-Park Döllnitz"
            />
            <TextInput
              label="Standort"
              value={form.standort}
              onChange={(v) => setField("standort", v)}
              placeholder="92670 Windischeschenbach"
            />
            <SelectInput
              label="Status"
              value={form.status}
              onChange={(v) => setField("status", v)}
              options={STATUS_OPTIONS}
            />
          </div>
        );

      // ---- Eigentümer ----
      case 1:
        return (
          <OwnerFields
            eigentuemer={eigentuemer}
            onChange={setEigentuemer}
          />
        );

      // ---- Grundbuch ----
      case 2:
        return (
          <LandRegisterFields
            zeilen={grundbuch}
            onChange={setGrundbuch}
          />
        );

      // ---- Anlagendaten ----
      case 3:
        return (
          <div style={styles.grid2}>
            <TextInput
              label="Leistung (kWp)"
              value={form.anlagendaten.leistungKwp}
              onChange={(v) => setAnlagendatenField("leistungKwp", v)}
              type="number"
              placeholder="750"
            />
            <TextInput
              label="Leistung (MWp)"
              value={form.anlagendaten.leistungMwp}
              onChange={(v) => setAnlagendatenField("leistungMwp", v)}
              type="number"
              placeholder="0.75"
            />
            <TextInput
              label="Fläche (m²)"
              value={form.anlagendaten.flaeche}
              onChange={(v) => setAnlagendatenField("flaeche", v)}
              type="number"
              placeholder="5000"
              suffix="m²"
            />
            <SelectInput
              label="Anlagentyp"
              value={form.anlagendaten.typ}
              onChange={(v) => setAnlagendatenField("typ", v)}
              options={ANLAGEN_TYP_OPTIONS}
            />
          </div>
        );

      // ---- Bank ----
      case 4:
        return (
          <div style={styles.grid2}>
            <TextInput
              label="IBAN"
              value={form.bankverbindung.iban}
              onChange={(v) => setBankField("iban", v)}
              placeholder="DE89 3704 0044 0532 0130 00"
            />
            <TextInput
              label="BIC"
              value={form.bankverbindung.bic}
              onChange={(v) => setBankField("bic", v)}
              placeholder="COBADEFFXXX"
            />
            <TextInput
              label="Kontoinhaber"
              value={form.bankverbindung.kontoinhaber}
              onChange={(v) => setBankField("kontoinhaber", v)}
              placeholder="Max Mustermann"
            />
          </div>
        );

      // ---- Verträge ----
      case 5: {
        // When editing, get vertraege from the existing projekt
        const existingProjekt = editId
          ? projekte.find((p) => p.id === editId)
          : null;
        const vertraege = existingProjekt?.vertraege || [];

        if (vertraege.length === 0) {
          return (
            <div
              style={{
                textAlign: "center",
                padding: 30,
                color: COLORS.mid,
                fontSize: 13,
              }}
            >
              Noch keine Verträge verknüpft.
            </div>
          );
        }

        return (
          <div>
            {vertraege.map((vertrag, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 12px",
                  background: idx % 2 === 0 ? COLORS.white : COLORS.light,
                  borderRadius: 6,
                  marginBottom: 4,
                  border: "1px solid #e8e8e8",
                  fontSize: 13,
                }}
              >
                <div>
                  <span style={{ fontWeight: 600 }}>{vertrag.typ}</span>
                  {vertrag.dateiname && (
                    <span style={{ color: COLORS.mid, marginLeft: 8, fontSize: 12 }}>
                      {vertrag.dateiname}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 12, color: COLORS.mid }}>
                  {vertrag.datum || "–"}
                </span>
              </div>
            ))}
          </div>
        );
      }

      // ---- Notizen ----
      case 6:
        return (
          <div>
            <label htmlFor="projekt-notizen" style={styles.label}>
              Notizen
            </label>
            <textarea
              id="projekt-notizen"
              value={form.notizen}
              onChange={(e) => setField("notizen", e.target.value)}
              placeholder="Freitext..."
              style={{
                ...styles.input,
                minHeight: 120,
                resize: "vertical",
                lineHeight: 1.45,
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div>
      {/* ---- Header ---- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
            Projektverwaltung
          </h2>
          <span
            style={{
              background: COLORS.dark,
              color: COLORS.yellow,
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 20,
            }}
          >
            {projekte.length}
          </span>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={styles.btnPrimary} onClick={openAdd}>
            + Neues Projekt
          </button>
          <button style={styles.btnOutline} onClick={handleExport}>
            Export JSON
          </button>
          <button
            style={styles.btnOutline}
            onClick={() => fileInputRef.current?.click()}
          >
            Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: "none" }}
            onChange={handleImport}
          />
        </div>
      </div>

      {/* ---- Search + Filter ---- */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 14,
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        <div style={{ flex: 1, minWidth: 200 }}>
          <TextInput
            label="Suche"
            value={suchbegriff}
            onChange={setSuchbegriff}
            placeholder="Name oder Standort..."
          />
        </div>
        <div style={{ minWidth: 160 }}>
          <SelectInput
            label="Status"
            value={filterStatus}
            onChange={setFilterStatus}
            options={FILTER_OPTIONS}
          />
        </div>
      </div>

      {/* ---- Add / Edit Form ---- */}
      {formOpen && (
        <Section
          title={editId ? "Projekt bearbeiten" : "Neues Projekt"}
          icon={editId ? "\u270E" : "\u2795"}
        >
          {/* Tab Bar */}
          <div style={styles.tabBar}>
            {TAB_LABELS.map((label, idx) => (
              <button
                key={label}
                style={styles.tabItem(activeDetailTab === idx)}
                onClick={() => setActiveDetailTab(idx)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ minHeight: 120 }}>{renderFormTab()}</div>

          {/* Form Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 14,
            }}
          >
            <button style={styles.btnOutline} onClick={closeForm}>
              Abbrechen
            </button>
            <button style={styles.btnPrimary} onClick={handleSave}>
              {editId ? "Speichern" : "Hinzufügen"}
            </button>
          </div>
        </Section>
      )}

      {/* ---- Project List ---- */}
      {gefilterteProjekte.length === 0 ? (
        <div
          style={{
            ...styles.card,
            textAlign: "center",
            padding: 40,
            color: COLORS.mid,
          }}
        >
          {projekte.length === 0
            ? "Noch keine Projekte vorhanden. Legen Sie Ihr erstes Projekt an."
            : "Keine Projekte für diesen Filter gefunden."}
        </div>
      ) : (
        gefilterteProjekte.map((projekt, idx) => {
          const badge = STATUS_BADGE_COLORS[projekt.status] || STATUS_BADGE_COLORS.Planung;
          const isDeleting = deleteConfirm === projekt.id;
          const anzahlVertraege = Array.isArray(projekt.vertraege)
            ? projekt.vertraege.length
            : 0;

          return (
            <div
              key={projekt.id}
              style={{
                ...styles.card,
                background: idx % 2 === 0 ? COLORS.white : "#FAFAFA",
              }}
            >
              {/* Card Header Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 15 }}>
                      {projekt.projektname}
                    </span>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 12,
                        background: badge.bg,
                        color: badge.color,
                      }}
                    >
                      {projekt.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    style={{
                      ...styles.btnOutline,
                      padding: "5px 12px",
                      fontSize: 11.5,
                    }}
                    onClick={() => openEdit(projekt)}
                  >
                    Bearbeiten
                  </button>
                  {isDeleting ? (
                    <>
                      <button
                        style={{
                          ...styles.btnOutline,
                          padding: "5px 12px",
                          fontSize: 11.5,
                          borderColor: COLORS.red,
                          color: COLORS.red,
                        }}
                        onClick={() => handleDelete(projekt.id)}
                      >
                        Ja, löschen
                      </button>
                      <button
                        style={{
                          ...styles.btnOutline,
                          padding: "5px 12px",
                          fontSize: 11.5,
                        }}
                        onClick={() => setDeleteConfirm(null)}
                      >
                        Nein
                      </button>
                    </>
                  ) : (
                    <button
                      style={{
                        ...styles.btnOutline,
                        padding: "5px 12px",
                        fontSize: 11.5,
                        borderColor: COLORS.red,
                        color: COLORS.red,
                      }}
                      onClick={() => setDeleteConfirm(projekt.id)}
                    >
                      Löschen
                    </button>
                  )}
                </div>
              </div>

              {/* Detail Rows */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "4px 20px",
                  marginTop: 10,
                  fontSize: 12.5,
                }}
              >
                {projekt.standort && (
                  <div>
                    <span style={{ color: COLORS.mid }}>Standort: </span>
                    {projekt.standort}
                  </div>
                )}
                <div>
                  <span style={{ color: COLORS.mid }}>Verträge: </span>
                  {anzahlVertraege}
                </div>
                {projekt.anlagendaten?.typ && (
                  <div>
                    <span style={{ color: COLORS.mid }}>Typ: </span>
                    {projekt.anlagendaten.typ}
                  </div>
                )}
              </div>

              {projekt.notizen && (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: COLORS.mid,
                    fontStyle: "italic",
                  }}
                >
                  {projekt.notizen}
                </div>
              )}

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 10,
                  paddingTop: 8,
                  borderTop: "1px solid #f0f0f0",
                  flexWrap: "wrap",
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 11, color: COLORS.mid }}>
                  Erstellt: {formatDate(projekt.erstelltAm)}
                  {projekt.geaendertAm !== projekt.erstelltAm &&
                    ` | Geändert: ${formatDate(projekt.geaendertAm)}`}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
