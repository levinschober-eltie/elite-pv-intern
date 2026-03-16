import React, { useState } from "react";
import { COLORS, styles } from "../../theme";
import { formatEuro } from "../../lib/formatters";
import { GEMEINDE_KLAUSELN, PRIVAT_KLAUSELN } from "./leitungswegClauses";
import {
  generateGemeindeVertragDocx,
  generatePrivatVertragDocx,
} from "./leitungswegDocxExport";
import {
  TextInput,
  SelectInput,
  NavButtons,
} from "../../components/FormFields";
import Section from "../../components/Section";
import Steps from "../../components/Steps";
import ResultBox, { ResultGrid, ResultCell } from "../../components/ResultBox";
import DetailRow from "../../components/DetailRow";
import ClauseEditor from "../../components/ClauseEditor";
import OwnerFields, { createDefaultEigentuemer } from "../../components/OwnerFields";
import WarningBanner from "../../components/WarningBanner";

// ============================================================
// FLURSTÜCK-EDITOR (inline)
// ============================================================
function FlurstueckEditor({ flurstuecke, onChange }) {
  const addFlurstueck = () => {
    onChange([
      ...flurstuecke,
      {
        id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
        grundbuchamt: "",
        blattNr: "",
        gemarkung: "",
        flurNr: "",
      },
    ]);
  };

  const updateFlurstueck = (index, key, value) => {
    const neu = [...flurstuecke];
    neu[index] = { ...neu[index], [key]: value };
    onChange(neu);
  };

  const removeFlurstueck = (index) => {
    if (flurstuecke.length <= 1) return;
    onChange(flurstuecke.filter((_, i) => i !== index));
  };

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
    { key: "blattNr", label: "Blatt-Nr.", flex: 1 },
    { key: "gemarkung", label: "Gemarkung", flex: 2 },
    { key: "flurNr", label: "Flurstück-Nr.", flex: 1.5 },
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
          Flurstücke
        </span>
        <button
          style={{ ...styles.btnOutline, fontSize: 11, padding: "3px 10px" }}
          onClick={addFlurstueck}
        >
          + Flurstück
        </button>
      </div>

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
            minWidth: 500,
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
        {flurstuecke.map((f, index) => (
          <div
            key={f.id}
            style={{
              display: "flex",
              alignItems: "center",
              background: index % 2 === 0 ? COLORS.white : COLORS.light,
              borderBottom: "1px solid #f0f0f0",
              minWidth: 500,
              padding: "3px 0",
            }}
          >
            {spalten.map((s) => (
              <div key={s.key} style={{ flex: s.flex, padding: "2px 3px" }}>
                <input
                  type="text"
                  value={f[s.key]}
                  onChange={(e) => updateFlurstueck(index, s.key, e.target.value)}
                  style={cellInputStyle}
                />
              </div>
            ))}
            <div style={{ width: 32, textAlign: "center" }}>
              {flurstuecke.length > 1 && (
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: COLORS.red,
                    cursor: "pointer",
                    fontSize: 13,
                    padding: "2px 4px",
                  }}
                  onClick={() => removeFlurstueck(index)}
                  title="Entfernen"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// DEFAULT STATE
// ============================================================
const defaultFlurstueck = () => ({
  id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
  grundbuchamt: "",
  blattNr: "",
  gemarkung: "",
  flurNr: "",
});

// ============================================================
// MAIN GENERATOR
// ============================================================
export default function LeitungswegGenerator() {
  const [activeTab, setActiveTab] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Vertragstyp: "gemeinde" oder "privat"
  const [vertragstyp, setVertragstyp] = useState("privat");

  // Klauseln je Typ
  const [gemeindeKlauseln, setGemeindeKlauseln] = useState(
    GEMEINDE_KLAUSELN.map((k) => ({ ...k }))
  );
  const [privatKlauseln, setPrivatKlauseln] = useState(
    PRIVAT_KLAUSELN.map((k) => ({ ...k }))
  );

  // Eigentümer (für Privat)
  const [eigentuemer, setEigentuemer] = useState(createDefaultEigentuemer());

  // Flurstücke
  const [flurstuecke, setFlurstuecke] = useState([defaultFlurstueck()]);

  // Formulardaten
  const [formData, setFormData] = useState({
    // Gemeinde-Felder
    gemeindeName: "",
    gemeindeStrasse: "",
    gemeindePlz: "",
    gemeindeOrt: "",
    landkreis: "",
    gerichtsstand: "",
    // Trassen-Felder
    eeAnlageName: "",
    eeAnlageTyp: "Freiflächen-PV",
    eeAnlageKoordinaten: "",
    nvpName: "",
    nvpKoordinaten: "",
    trassenlaenge: "",
    schutzzoneBreite: "1",
    // Entschädigung
    entschaedigungProMeter: "5",
    bewirtschaftungsausfall: "",
    buergschaftBetrag: "",
    buergschaftProzent: "20",
    // Bankdaten
    iban: "",
    bic: "",
    bank: "",
    // Zusatz
    zusatzvereinbarungen: "",
  });

  const update = (key) => (value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Berechnungen
  const trassenlaenge = parseFloat(formData.trassenlaenge) || 0;
  const entschaedigungProMeter = parseFloat(formData.entschaedigungProMeter) || 0;
  const entschaedigungGesamt = trassenlaenge * entschaedigungProMeter;
  const bewAusfall = parseFloat(formData.bewirtschaftungsausfall) || 0;
  const gesamtEntschaedigung = entschaedigungGesamt + bewAusfall;

  // Warnungen
  const warnungen = [];
  if (vertragstyp === "gemeinde" && !formData.gemeindeName) {
    warnungen.push("Gemeindename fehlt – Pflichtfeld");
  }
  if (vertragstyp === "privat") {
    const eigName = (eigentuemer.partner || []).map((p) => p.name).filter(Boolean).join(", ");
    if (!eigName) warnungen.push("Eigentümer-Name fehlt – Pflichtfeld");
  }
  if (trassenlaenge === 0) warnungen.push("Trassenlänge = 0 m – Eingabe erforderlich");
  if (!flurstuecke[0]?.flurNr) warnungen.push("Mindestens ein Flurstück erforderlich");

  // Export möglich?
  const vertragspartnerOk =
    vertragstyp === "gemeinde"
      ? !!formData.gemeindeName
      : (eigentuemer.partner || []).some((p) => p.name);
  const exportGesperrt = !vertragspartnerOk || trassenlaenge === 0;

  const tabNamen = ["Vertragspartner", "Grundstück & Trasse", "Entschädigung", "Ergebnis", "Vertrag"];

  // Aktive Klauseln
  const aktiveKlauseln = vertragstyp === "gemeinde" ? gemeindeKlauseln : privatKlauseln;
  const setAktiveKlauseln = vertragstyp === "gemeinde" ? setGemeindeKlauseln : setPrivatKlauseln;
  const defaultKlauseln = vertragstyp === "gemeinde" ? GEMEINDE_KLAUSELN : PRIVAT_KLAUSELN;

  // DOCX-Export
  const handleDocxExport = async () => {
    setIsGenerating(true);
    try {
      const exportData = {
        ...formData,
        eigentuemer,
        flurstuecke,
      };
      if (vertragstyp === "gemeinde") {
        await generateGemeindeVertragDocx(exportData, aktiveKlauseln);
      } else {
        await generatePrivatVertragDocx(exportData, aktiveKlauseln);
      }
    } catch (error) {
      alert("DOCX-Fehler: " + error.message);
    }
    setIsGenerating(false);
  };

  return (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      <Steps tabs={tabNamen} activeStep={activeTab} onStepClick={setActiveTab} />

      <WarningBanner warnungen={warnungen} />

      {/* ============================================================ */}
      {/* TAB 0: Vertragspartner */}
      {/* ============================================================ */}
      {activeTab === 0 && (
        <>
          {/* Vertragstyp-Auswahl */}
          <Section title="Vertragstyp" icon="📑">
            <p style={{ fontSize: 12, color: COLORS.mid, margin: "0 0 10px" }}>
              Wähle den Vertragstyp für den Leitungsweg:
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div
                onClick={() => setVertragstyp("privat")}
                style={{
                  ...styles.card,
                  flex: 1,
                  minWidth: 200,
                  cursor: "pointer",
                  borderLeft: `4px solid ${COLORS.blue}`,
                  background: vertragstyp === "privat" ? COLORS.blue + "12" : COLORS.white,
                  outline: vertragstyp === "privat" ? `2px solid ${COLORS.blue}` : "none",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                  {vertragstyp === "privat" ? "✓ " : ""}Privat / Grundeigentümer
                </div>
                <div style={{ fontSize: 11, color: COLORS.mid }}>
                  Leitungsrecht mit Dienstbarkeit – für private Grundstückseigentümer
                </div>
              </div>
              <div
                onClick={() => setVertragstyp("gemeinde")}
                style={{
                  ...styles.card,
                  flex: 1,
                  minWidth: 200,
                  cursor: "pointer",
                  borderLeft: `4px solid ${COLORS.green}`,
                  background: vertragstyp === "gemeinde" ? COLORS.green + "12" : COLORS.white,
                  outline: vertragstyp === "gemeinde" ? `2px solid ${COLORS.green}` : "none",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                  {vertragstyp === "gemeinde" ? "✓ " : ""}Gemeinde
                </div>
                <div style={{ fontSize: 11, color: COLORS.mid }}>
                  Duldungsvertrag § 11a EEG – für Verlegung in gemeindlichen Straßen
                </div>
              </div>
            </div>
          </Section>

          {/* Vertragspartner-Details */}
          {vertragstyp === "gemeinde" ? (
            <Section title="Gemeinde" icon="🏛️">
              <TextInput
                label="Gemeindename"
                value={formData.gemeindeName}
                onChange={update("gemeindeName")}
                placeholder="z.B. Gemeinde Krummennaab"
              />
              <div style={{ ...styles.grid2, marginTop: 8 }}>
                <TextInput
                  label="Straße"
                  value={formData.gemeindeStrasse}
                  onChange={update("gemeindeStrasse")}
                  placeholder="z.B. Hauptstr. 1"
                />
                <div style={styles.grid2}>
                  <TextInput
                    label="PLZ"
                    value={formData.gemeindePlz}
                    onChange={update("gemeindePlz")}
                    placeholder="92703"
                  />
                  <TextInput
                    label="Ort"
                    value={formData.gemeindeOrt}
                    onChange={update("gemeindeOrt")}
                    placeholder="Krummennaab"
                  />
                </div>
              </div>
              <div style={{ ...styles.grid2, marginTop: 8 }}>
                <TextInput
                  label="Landkreis"
                  value={formData.landkreis}
                  onChange={update("landkreis")}
                  placeholder="z.B. Tirschenreuth"
                />
                <TextInput
                  label="Gerichtsstand"
                  value={formData.gerichtsstand}
                  onChange={update("gerichtsstand")}
                  placeholder="z.B. Tirschenreuth"
                />
              </div>
            </Section>
          ) : (
            <Section title="Eigentümer / Grundeigentümer" icon="👤">
              <OwnerFields eigentuemer={eigentuemer} onChange={setEigentuemer} />
            </Section>
          )}

          <NavButtons onNext={() => setActiveTab(1)} />
        </>
      )}

      {/* ============================================================ */}
      {/* TAB 1: Grundstück & Trasse */}
      {/* ============================================================ */}
      {activeTab === 1 && (
        <>
          <Section title="Flurstücke / Grundbuch" icon="📋">
            <FlurstueckEditor
              flurstuecke={flurstuecke}
              onChange={setFlurstuecke}
            />
          </Section>

          <Section title="EE-Anlage & Netzverknüpfungspunkt" icon="⚡">
            <div style={styles.grid2}>
              <TextInput
                label="Name der EE-Anlage"
                value={formData.eeAnlageName}
                onChange={update("eeAnlageName")}
                placeholder='z.B. Freiflächen-PV "Sonnenenergie Trautenberg"'
              />
              <SelectInput
                label="Anlagentyp"
                value={formData.eeAnlageTyp}
                onChange={update("eeAnlageTyp")}
                options={["Freiflächen-PV", "Dach-PV", "BESS", "Windkraft", "Sonstige"]}
              />
            </div>
            <div style={{ marginTop: 8 }}>
              <TextInput
                label="Koordinaten EE-Anlage"
                value={formData.eeAnlageKoordinaten}
                onChange={update("eeAnlageKoordinaten")}
                placeholder="z.B. 49.82747 N, 12.11204 E"
              />
            </div>
            <div style={{ ...styles.grid2, marginTop: 8 }}>
              <TextInput
                label="Name Netzverknüpfungspunkt (NVP)"
                value={formData.nvpName}
                onChange={update("nvpName")}
                placeholder='z.B. Trafostation Eiglasdorf'
              />
              <TextInput
                label="Koordinaten NVP"
                value={formData.nvpKoordinaten}
                onChange={update("nvpKoordinaten")}
                placeholder="z.B. 49.83343 N, 12.13680 E"
              />
            </div>
          </Section>

          <Section title="Trassendetails" icon="📏">
            <div style={styles.grid2}>
              <TextInput
                label="Trassenlänge (vorläufig)"
                value={formData.trassenlaenge}
                onChange={update("trassenlaenge")}
                type="number"
                suffix="m"
                min={0}
              />
              <TextInput
                label="Schutzzonenbreite (beidseitig)"
                value={formData.schutzzoneBreite}
                onChange={update("schutzzoneBreite")}
                type="number"
                suffix="m"
                min={0.5}
                max={5}
              />
            </div>
            {trassenlaenge > 0 && (
              <div
                style={{
                  marginTop: 10,
                  background: COLORS.lightBlue,
                  borderRadius: 8,
                  padding: "10px 14px",
                  border: "1px solid #dde8f0",
                }}
              >
                <div style={{ fontSize: 11, color: COLORS.mid, marginBottom: 4 }}>
                  Schutzstreifenfläche (geschätzt)
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.dark }}>
                  ca. {(trassenlaenge * (parseFloat(formData.schutzzoneBreite) || 1) * 2).toFixed(0)} m²
                  ({trassenlaenge} m × {formData.schutzzoneBreite} m × 2 Seiten)
                </div>
              </div>
            )}
          </Section>

          <NavButtons onPrev={() => setActiveTab(0)} onNext={() => setActiveTab(2)} />
        </>
      )}

      {/* ============================================================ */}
      {/* TAB 2: Entschädigung */}
      {/* ============================================================ */}
      {activeTab === 2 && (
        <>
          <Section title="Entschädigung" icon="💰">
            <div style={styles.grid2}>
              <TextInput
                label="Entschädigung pro laufenden Meter"
                value={formData.entschaedigungProMeter}
                onChange={update("entschaedigungProMeter")}
                type="number"
                suffix="€/lfm"
                min={0}
              />
              <TextInput
                label="Trassenlänge"
                value={formData.trassenlaenge}
                onChange={update("trassenlaenge")}
                type="number"
                suffix="m"
                min={0}
                disabled
              />
            </div>

            {entschaedigungGesamt > 0 && (
              <div
                style={{
                  marginTop: 10,
                  background: COLORS.lightBlue,
                  borderRadius: 8,
                  padding: "10px 14px",
                  border: "1px solid #dde8f0",
                }}
              >
                <div style={{ fontSize: 11, color: COLORS.mid, marginBottom: 4 }}>
                  Berechnete Entschädigung (Leitungsrecht)
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.dark }}>
                  {formatEuro(entschaedigungGesamt)}
                </div>
                <div style={{ fontSize: 11, color: COLORS.mid }}>
                  {formData.entschaedigungProMeter} €/lfm × {formData.trassenlaenge} m
                </div>
              </div>
            )}

            {vertragstyp === "privat" && (
              <div style={{ marginTop: 10 }}>
                <TextInput
                  label="Bewirtschaftungsausfall (pauschal, optional)"
                  value={formData.bewirtschaftungsausfall}
                  onChange={update("bewirtschaftungsausfall")}
                  type="number"
                  suffix="€"
                  min={0}
                />
              </div>
            )}
          </Section>

          {vertragstyp === "gemeinde" && (
            <Section title="Bankbürgschaft" icon="🏦">
              <div style={styles.grid2}>
                <TextInput
                  label="Bürgschaftsbetrag"
                  value={formData.buergschaftBetrag}
                  onChange={update("buergschaftBetrag")}
                  type="number"
                  suffix="€"
                  min={0}
                />
                <TextInput
                  label="Anteil an Wiederherstellungskosten"
                  value={formData.buergschaftProzent}
                  onChange={update("buergschaftProzent")}
                  type="number"
                  suffix="%"
                  min={0}
                  max={100}
                />
              </div>
            </Section>
          )}

          <Section title="Bankverbindung Empfänger" icon="🏧">
            <TextInput
              label="IBAN"
              value={formData.iban}
              onChange={update("iban")}
              placeholder="DE00 0000 0000 0000 0000 00"
            />
            <div style={{ ...styles.grid2, marginTop: 8 }}>
              <TextInput
                label="BIC"
                value={formData.bic}
                onChange={update("bic")}
                placeholder="z.B. GENODEF1WEV"
              />
              <TextInput
                label="Bank / Kreditinstitut"
                value={formData.bank}
                onChange={update("bank")}
                placeholder="z.B. Raiffeisenbank"
              />
            </div>
          </Section>

          {vertragstyp === "privat" && (
            <Section title="Zusatzvereinbarungen (optional)" icon="📝">
              <textarea
                style={{
                  ...styles.input,
                  minHeight: 80,
                  resize: "vertical",
                  fontSize: 12.5,
                }}
                value={formData.zusatzvereinbarungen}
                onChange={(e) => update("zusatzvereinbarungen")(e.target.value)}
                placeholder="z.B. Sonderregelungen wie Drainage, Steinentsorgung etc."
              />
            </Section>
          )}

          <NavButtons onPrev={() => setActiveTab(1)} onNext={() => setActiveTab(3)} nextLabel="Ergebnis →" />
        </>
      )}

      {/* ============================================================ */}
      {/* TAB 3: Ergebnis */}
      {/* ============================================================ */}
      {activeTab === 3 && (
        <>
          <ResultBox
            label={
              vertragstyp === "gemeinde"
                ? "DULDUNGSVERTRAG GEMEINDE (§ 11a EEG)"
                : "LEITUNGSRECHT / DIENSTBARKEIT"
            }
          >
            <ResultGrid>
              <ResultCell
                label="Entschädigung"
                amount={formatEuro(entschaedigungGesamt)}
                sub={`${formData.entschaedigungProMeter || "–"} €/lfm × ${formData.trassenlaenge || "–"} m`}
              />
              {vertragstyp === "privat" && bewAusfall > 0 ? (
                <ResultCell
                  label="Gesamt inkl. Bewirtschaftungsausfall"
                  amount={formatEuro(gesamtEntschaedigung)}
                  sub={`+ ${formatEuro(bewAusfall)} Bewirtschaftungsausfall`}
                />
              ) : vertragstyp === "gemeinde" && formData.buergschaftBetrag ? (
                <ResultCell
                  label="Bankbürgschaft"
                  amount={formatEuro(parseFloat(formData.buergschaftBetrag) || 0)}
                  sub={`${formData.buergschaftProzent}% der Wiederherstellungskosten`}
                />
              ) : (
                <ResultCell
                  label="Trassenlänge"
                  amount={`${formData.trassenlaenge || "–"} m`}
                  sub={`Schutzzone: ${formData.schutzzoneBreite || "–"} m beidseitig`}
                />
              )}
            </ResultGrid>
          </ResultBox>

          {/* Vertragspartner */}
          <div style={{ ...styles.card, marginTop: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
              Vertragspartner
            </div>
            {vertragstyp === "gemeinde" ? (
              <>
                <DetailRow label="Gemeinde" value={formData.gemeindeName || "–"} />
                <DetailRow
                  label="Adresse"
                  value={`${formData.gemeindeStrasse || "–"}, ${formData.gemeindePlz || ""} ${formData.gemeindeOrt || ""}`}
                />
                <DetailRow label="Landkreis" value={formData.landkreis || "–"} />
              </>
            ) : (
              <>
                <DetailRow
                  label="Eigentümer"
                  value={(eigentuemer.partner || []).map((p) => p.name).filter(Boolean).join(", ") || "–"}
                />
                <DetailRow label="Typ" value={eigentuemer.typ || "–"} />
              </>
            )}
            <div style={{ height: 2, background: COLORS.yellow, margin: "5px 0" }} />
            <DetailRow label="Betreiber/Berechtigte" value="Elite PV GmbH" />
          </div>

          {/* Trassendaten */}
          <div style={{ ...styles.card, marginTop: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
              Trassendaten
            </div>
            <DetailRow label="EE-Anlage" value={formData.eeAnlageName || "–"} />
            <DetailRow label="Anlagentyp" value={formData.eeAnlageTyp || "–"} />
            <DetailRow label="Koordinaten EE-Anlage" value={formData.eeAnlageKoordinaten || "–"} />
            <DetailRow label="NVP" value={formData.nvpName || "–"} />
            <DetailRow label="Koordinaten NVP" value={formData.nvpKoordinaten || "–"} />
            <div style={{ height: 2, background: COLORS.yellow, margin: "5px 0" }} />
            <DetailRow label="Trassenlänge" value={`ca. ${formData.trassenlaenge || "–"} m`} />
            <DetailRow label="Schutzzone" value={`${formData.schutzzoneBreite || "–"} m beidseitig`} />
          </div>

          {/* Flurstücke */}
          {flurstuecke.length > 0 && flurstuecke[0].flurNr && (
            <div style={{ ...styles.card, marginTop: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
                Flurstücke
              </div>
              {flurstuecke.map((f, i) => (
                <DetailRow
                  key={f.id}
                  label={`Flurstück ${i + 1}`}
                  value={`${f.flurNr || "–"} | Gmk. ${f.gemarkung || "–"} | ${f.grundbuchamt || "–"} Bl. ${f.blattNr || "–"}`}
                />
              ))}
            </div>
          )}

          {/* Entschädigung */}
          <div style={{ ...styles.card, marginTop: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
              Entschädigung
            </div>
            <DetailRow label="Pro lfd. Meter" value={`${formData.entschaedigungProMeter || "–"} €/lfm`} />
            <DetailRow label="Leitungsrecht" value={formatEuro(entschaedigungGesamt)} highlight />
            {vertragstyp === "privat" && bewAusfall > 0 && (
              <DetailRow label="Bewirtschaftungsausfall" value={formatEuro(bewAusfall)} />
            )}
            {vertragstyp === "privat" && bewAusfall > 0 && (
              <>
                <div style={{ height: 2, background: COLORS.dark, margin: "5px 0" }} />
                <DetailRow label="Gesamtentschädigung" value={formatEuro(gesamtEntschaedigung)} highlight />
              </>
            )}
            {vertragstyp === "gemeinde" && formData.buergschaftBetrag && (
              <DetailRow
                label="Bankbürgschaft"
                value={formatEuro(parseFloat(formData.buergschaftBetrag) || 0)}
              />
            )}
          </div>

          {exportGesperrt && (
            <div style={{ ...styles.warnung, textAlign: "center", marginTop: 8 }}>
              ⚠️ Export nicht möglich – Pflichtdaten fehlen
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              marginTop: 8,
              flexWrap: "wrap",
            }}
          >
            <button style={styles.btnOutline} onClick={() => setActiveTab(2)}>
              ← Entschädigung
            </button>
            <button style={styles.btnBlue} onClick={() => setActiveTab(4)}>
              📝 Vertrag →
            </button>
          </div>
        </>
      )}

      {/* ============================================================ */}
      {/* TAB 4: Vertrag */}
      {/* ============================================================ */}
      {activeTab === 4 && (
        <>
          <Section
            title={
              vertragstyp === "gemeinde"
                ? "Duldungsvertrag Gemeinde bearbeiten"
                : "Leitungsrecht-Vertrag bearbeiten"
            }
            icon="📝"
          >
            <div
              style={{
                marginBottom: 12,
                padding: "8px 12px",
                background: vertragstyp === "gemeinde" ? COLORS.green + "15" : COLORS.blue + "15",
                borderRadius: 6,
                fontSize: 12,
                color: COLORS.dark,
                border: `1px solid ${vertragstyp === "gemeinde" ? COLORS.green + "40" : COLORS.blue + "40"}`,
              }}
            >
              {vertragstyp === "gemeinde"
                ? "📋 Duldungsvertrag gem. § 11a EEG – für gemeindliche Straßen"
                : "📋 Leitungsrecht mit Dienstbarkeit – für private Grundeigentümer"}
            </div>
            <ClauseEditor
              klauseln={aktiveKlauseln}
              setKlauseln={setAktiveKlauseln}
              defaultKlauseln={defaultKlauseln}
            />
          </Section>

          {exportGesperrt && (
            <div style={{ ...styles.warnung, textAlign: "center", marginTop: 8 }}>
              ⚠️ Export nicht möglich – Pflichtdaten fehlen
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              marginTop: 8,
              flexWrap: "wrap",
            }}
          >
            <button style={styles.btnOutline} onClick={() => setActiveTab(3)}>
              ← Ergebnis
            </button>
            <button
              style={{
                ...styles.btnPrimary,
                fontSize: 14.5,
                padding: "12px 28px",
                opacity: exportGesperrt ? 0.5 : 1,
              }}
              onClick={handleDocxExport}
              disabled={isGenerating || exportGesperrt}
            >
              {isGenerating ? "⏳" : "📄"} Vertrag als DOCX
            </button>
          </div>
        </>
      )}
    </div>
  );
}
