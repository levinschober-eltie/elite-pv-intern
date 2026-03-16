import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { styles, COLORS } from "../../theme";
import { TextInput, SelectInput } from "../../components/FormFields";
import Section from "../../components/Section";
import { useToast } from "../../components/Toast";

// ============================================================
// CONSTANTS
// ============================================================
const STORAGE_KEY = "elite-pv-kunden";
const TYP_OPTIONS = ["Privat", "Gewerbe", "Industrie", "Landwirtschaft"];
const FILTER_OPTIONS = ["Alle", ...TYP_OPTIONS];

const EMPTY_KUNDE = {
  name: "",
  ansprechpartner: "",
  strasse: "",
  plz: "",
  ort: "",
  telefon: "",
  email: "",
  typ: "Gewerbe",
  notizen: "",
};

const TYP_BADGE_COLORS = {
  Privat: { bg: "#E3F2FD", color: "#1565C0" },
  Gewerbe: { bg: "#FFF3E0", color: "#E65100" },
  Industrie: { bg: "#F3E5F5", color: "#7B1FA2" },
  Landwirtschaft: { bg: "#E8F5E9", color: "#2E7D32" },
};

// ============================================================
// HELPERS
// ============================================================
function loadKunden() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveKunden(kunden) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(kunden));
}

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
export default function Kundenverwaltung() {
  const navigate = useNavigate();
  const showToast = useToast();
  const fileInputRef = useRef(null);

  const [kunden, setKunden] = useState(() => loadKunden());
  const [suchbegriff, setSuchbegriff] = useState("");
  const [filterTyp, setFilterTyp] = useState("Alle");
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_KUNDE });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Persist on change
  useEffect(() => {
    saveKunden(kunden);
  }, [kunden]);

  // ---- Form helpers ----
  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const openAdd = () => {
    setEditId(null);
    setForm({ ...EMPTY_KUNDE });
    setFormOpen(true);
  };

  const openEdit = (kunde) => {
    setEditId(kunde.id);
    setForm({
      name: kunde.name,
      ansprechpartner: kunde.ansprechpartner,
      strasse: kunde.strasse,
      plz: kunde.plz,
      ort: kunde.ort,
      telefon: kunde.telefon,
      email: kunde.email,
      typ: kunde.typ,
      notizen: kunde.notizen,
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditId(null);
    setForm({ ...EMPTY_KUNDE });
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      showToast("Bitte Name eingeben.", "error");
      return;
    }

    const now = new Date().toISOString();

    if (editId) {
      setKunden((prev) =>
        prev.map((k) =>
          k.id === editId ? { ...k, ...form, geaendertAm: now } : k
        )
      );
      showToast("Kunde aktualisiert.");
    } else {
      const neuerKunde = {
        ...form,
        id: Date.now().toString(),
        erstelltAm: now,
        geaendertAm: now,
      };
      setKunden((prev) => [neuerKunde, ...prev]);
      showToast("Kunde hinzugefuegt.");
    }
    closeForm();
  };

  // ---- Delete ----
  const handleDelete = (id) => {
    setKunden((prev) => prev.filter((k) => k.id !== id));
    setDeleteConfirm(null);
    showToast("Kunde geloescht.");
  };

  // ---- Export ----
  const handleExport = () => {
    if (kunden.length === 0) {
      showToast("Keine Kunden zum Exportieren.", "warning");
      return;
    }
    const blob = new Blob([JSON.stringify(kunden, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `elite-pv-kunden_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`${kunden.length} Kunden exportiert.`);
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
          showToast("Ungueltige Datei: Kein Array.", "error");
          return;
        }
        // Validate: each item must have a name field
        const valid = imported.filter((item) => item && item.name && typeof item.name === "string");
        if (valid.length === 0) {
          showToast("Keine gültigen Kunden in der Datei gefunden.", "error");
          return;
        }
        // Merge: skip duplicates by ID
        const existingIds = new Set(kunden.map((k) => k.id));
        let addedCount = 0;
        const merged = [...kunden];
        for (const item of valid) {
          if (item.id && !existingIds.has(item.id)) {
            merged.push(item);
            existingIds.add(item.id);
            addedCount++;
          }
        }
        setKunden(merged);
        showToast(`${addedCount} neue Kunden importiert.`);
      } catch {
        showToast("Fehler beim Lesen der Datei.", "error");
      }
    };
    reader.readAsText(file);
    // Reset file input so same file can be re-imported
    event.target.value = "";
  };

  // ---- Filtering ----
  const gefilterteKunden = kunden.filter((k) => {
    const suchMatch =
      !suchbegriff ||
      k.name.toLowerCase().includes(suchbegriff.toLowerCase()) ||
      (k.ort && k.ort.toLowerCase().includes(suchbegriff.toLowerCase()));
    const typMatch = filterTyp === "Alle" || k.typ === filterTyp;
    return suchMatch && typMatch;
  });

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
            Kundenverwaltung
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
            {kunden.length}
          </span>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={styles.btnPrimary} onClick={openAdd}>
            + Neuer Kunde
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
            placeholder="Name oder Ort..."
          />
        </div>
        <div style={{ minWidth: 160 }}>
          <SelectInput
            label="Typ"
            value={filterTyp}
            onChange={setFilterTyp}
            options={FILTER_OPTIONS}
          />
        </div>
      </div>

      {/* ---- Add / Edit Form ---- */}
      {formOpen && (
        <Section title={editId ? "Kunde bearbeiten" : "Neuer Kunde"} icon={editId ? "\u270E" : "\u2795"}>
          <div style={styles.grid2}>
            <TextInput
              label="Firma / Name *"
              value={form.name}
              onChange={(v) => setField("name", v)}
              placeholder="Mustermann GmbH"
            />
            <TextInput
              label="Ansprechpartner"
              value={form.ansprechpartner}
              onChange={(v) => setField("ansprechpartner", v)}
              placeholder="Max Mustermann"
            />
            <TextInput
              label="Strasse"
              value={form.strasse}
              onChange={(v) => setField("strasse", v)}
              placeholder="Musterstr. 1"
            />
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 90 }}>
                <TextInput
                  label="PLZ"
                  value={form.plz}
                  onChange={(v) => setField("plz", v)}
                  placeholder="92670"
                />
              </div>
              <div style={{ flex: 1 }}>
                <TextInput
                  label="Ort"
                  value={form.ort}
                  onChange={(v) => setField("ort", v)}
                  placeholder="Windischeschenbach"
                />
              </div>
            </div>
            <TextInput
              label="Telefon"
              value={form.telefon}
              onChange={(v) => setField("telefon", v)}
              placeholder="+49 ..."
            />
            <TextInput
              label="E-Mail"
              value={form.email}
              onChange={(v) => setField("email", v)}
              placeholder="info@example.de"
              type="email"
            />
            <SelectInput
              label="Kundentyp"
              value={form.typ}
              onChange={(v) => setField("typ", v)}
              options={TYP_OPTIONS}
            />
          </div>

          {/* Notizen */}
          <div style={{ marginTop: 10 }}>
            <label htmlFor="kunden-notizen" style={styles.label}>Notizen</label>
            <textarea
              id="kunden-notizen"
              value={form.notizen}
              onChange={(e) => setField("notizen", e.target.value)}
              placeholder="Freitext..."
              style={{
                ...styles.input,
                minHeight: 60,
                resize: "vertical",
                lineHeight: 1.45,
              }}
            />
          </div>

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
              {editId ? "Speichern" : "Hinzufuegen"}
            </button>
          </div>
        </Section>
      )}

      {/* ---- Customer List ---- */}
      {gefilterteKunden.length === 0 ? (
        <div
          style={{
            ...styles.card,
            textAlign: "center",
            padding: 40,
            color: COLORS.mid,
          }}
        >
          {kunden.length === 0
            ? "Noch keine Kunden vorhanden. Legen Sie Ihren ersten Kunden an."
            : "Keine Kunden fuer diesen Filter gefunden."}
        </div>
      ) : (
        gefilterteKunden.map((kunde, idx) => {
          const badge = TYP_BADGE_COLORS[kunde.typ] || TYP_BADGE_COLORS.Gewerbe;
          const isDeleting = deleteConfirm === kunde.id;

          return (
            <div
              key={kunde.id}
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
                      {kunde.name}
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
                      {kunde.typ}
                    </span>
                  </div>
                  {kunde.ansprechpartner && (
                    <div style={{ fontSize: 12, color: COLORS.mid }}>
                      {kunde.ansprechpartner}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    style={{
                      ...styles.btnOutline,
                      padding: "5px 12px",
                      fontSize: 11.5,
                    }}
                    onClick={() => openEdit(kunde)}
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
                        onClick={() => handleDelete(kunde.id)}
                      >
                        Ja, loeschen
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
                      onClick={() => setDeleteConfirm(kunde.id)}
                    >
                      Loeschen
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
                {kunde.ort && (
                  <div>
                    <span style={{ color: COLORS.mid }}>Ort: </span>
                    {kunde.plz ? `${kunde.plz} ` : ""}
                    {kunde.ort}
                  </div>
                )}
                {kunde.telefon && (
                  <div>
                    <span style={{ color: COLORS.mid }}>Tel: </span>
                    {kunde.telefon}
                  </div>
                )}
                {kunde.email && (
                  <div>
                    <span style={{ color: COLORS.mid }}>Mail: </span>
                    {kunde.email}
                  </div>
                )}
              </div>

              {kunde.notizen && (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: COLORS.mid,
                    fontStyle: "italic",
                  }}
                >
                  {kunde.notizen}
                </div>
              )}

              {/* Footer: date + generator links */}
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
                  Erstellt: {formatDate(kunde.erstelltAm)}
                  {kunde.geaendertAm !== kunde.erstelltAm &&
                    ` | Geaendert: ${formatDate(kunde.geaendertAm)}`}
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    style={{
                      ...styles.btnBlue,
                      padding: "4px 10px",
                      fontSize: 10.5,
                    }}
                    onClick={() => navigate("/wartung")}
                  >
                    Wartungsvertrag
                  </button>
                  <button
                    style={{
                      ...styles.btnBlue,
                      padding: "4px 10px",
                      fontSize: 10.5,
                    }}
                    onClick={() => navigate("/dachpacht")}
                  >
                    Dachpacht
                  </button>
                  <button
                    style={{
                      ...styles.btnBlue,
                      padding: "4px 10px",
                      fontSize: 10.5,
                    }}
                    onClick={() => navigate("/freiflaeche")}
                  >
                    Freiflaeche
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
