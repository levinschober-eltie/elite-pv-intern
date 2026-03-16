import React, { useState, useMemo } from "react";
import { COLORS, styles } from "../../theme";
import { formatEuro, formatZahl } from "../../lib/formatters";
import {
  berechneFreiflaeche,
  berechneFairScore,
  NUTZUNGSARTEN,
  BODENKLASSEN,
  NETZANSCHLUSS_EBENEN,
  PACHTSTATUS_OPTIONEN,
  BEWUCHS_OPTIONEN,
  NEIGUNG_RICHTUNGEN,
  VERMARKTUNGSARTEN,
  AUSGLEICH_TYPEN,
  PRIVILEGIERUNG_OPTIONEN,
} from "./freiflaecheCalc";
import { FREIFLAECHE_KLAUSELN } from "./freiflaecheClauses";
import { getKlauseln } from "../../lib/klauselStore";
import {
  generateFreiflaechePreisblattDocx,
  generateFreiflaecheVertragDocx,
} from "./freiflaecheDocxExport";
import { useToast } from "../../components/Toast";
import { TextInput, SelectInput, NavButtons } from "../../components/FormFields";
import Section from "../../components/Section";
import Steps from "../../components/Steps";
import ResultBox, { ResultGrid, ResultCell } from "../../components/ResultBox";
import DetailRow from "../../components/DetailRow";
import ClauseEditor from "../../components/ClauseEditor";
import OwnerFields, { createDefaultEigentuemer } from "../../components/OwnerFields";
import LandRegisterFields, { createDefaultGrundbuch } from "../../components/LandRegisterFields";
import WarningBanner from "../../components/WarningBanner";

// ============================================================
// MODELL-KARTE (A–D)
// ============================================================
const MODELL_FARBEN = { A: COLORS.yellow, B: COLORS.blue, C: COLORS.green, D: "#9C27B0" };

const ModellKarte = React.memo(function ModellKarte({ modell, aktiv, onClick, modellKey }) {
  const farbe = MODELL_FARBEN[modellKey] || COLORS.yellow;
  const istDunkel = modellKey === "B" || modellKey === "D";
  return (
    <div
      onClick={onClick}
      style={{
        ...styles.card,
        cursor: "pointer",
        borderLeft: `4px solid ${farbe}`,
        background: aktiv ? farbe + "12" : COLORS.white,
        outline: aktiv ? `2px solid ${farbe}` : "none",
        transition: "all 0.15s",
        marginBottom: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: COLORS.dark }}>
          {aktiv ? "✓ " : ""}Modell {modellKey}: {modell.modell}
        </span>
        {aktiv && (
          <span
            style={{
              background: farbe,
              color: istDunkel ? COLORS.white : COLORS.dark,
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 4,
            }}
          >
            GEWÄHLT
          </span>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <div>
          <div style={{ fontSize: 10, color: COLORS.mid, textTransform: "uppercase" }}>Jahr (1. BJ)</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.dark }}>
            {formatEuro(modell.pachtzinsJahr)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: COLORS.mid, textTransform: "uppercase" }}>Monat</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.dark }}>
            {formatEuro(modell.pachtzinsMonat)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: COLORS.mid, textTransform: "uppercase" }}>Gesamt</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.dark }}>
            {formatEuro(modell.pachtGesamt)}
          </div>
        </div>
      </div>
    </div>
  );
});

// ============================================================
// MAIN GENERATOR
// ============================================================
export default function FreiflaecheGenerator() {
  const showToast = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [klauseln, setKlauseln] = useState(
    () => getKlauseln("freiflaeche", FREIFLAECHE_KLAUSELN)
  );

  const [eigentuemer, setEigentuemer] = useState(createDefaultEigentuemer());
  const [grundbuch, setGrundbuch] = useState(createDefaultGrundbuch());

  const [formData, setFormData] = useState({
    // Grundstück
    grundstueckAdresse: "",
    gesamtflaecheHa: "",
    pachtflaecheHa: "",
    nutzungsart: "Acker",
    bodenklasse: "Mittel (30–60 Bodenpunkte)",
    // Technik
    leistungMwp: "",
    netzanschlussEbene: "Mittelspannung",
    agriPv: false,
    // Speicher
    speicherflaecheM2: "",
    speicherSatzM2: 5,
    // Vorhaltevergütung
    vorhalteBetrag: 500,
    // Rückbau
    rueckbauSatzKw: 15,
    // Modell A – Staffel
    staffel1: 3300,
    staffel2: 3400,
    staffel3: 3500,
    // Modell B – MWp
    satzProMwp: 6000,
    // Modell C – Ertrag
    spezifischerErtrag: 1000,
    strompreisCentKwh: 7,
    ertragsProzentsatz: 6,
    // Modell D – Hybrid
    mindestpachtProHa: 2500,
    erloesProzentsatz: 4,
    // Allgemein
    wertsicherungProzent: 10,
    laufzeitJahre: 20,
    gewaehlteModell: "A",
    // Bankdaten
    eigentuemerIban: "",
    eigentuemerBic: "",
    // Zusatz
    zusatzvereinbarungen: "",
  });

  // Bewertung für Fairen Pachtpreis
  const [bewertung, setBewertung] = useState({
    grz: 0.6,
    lagerplatz: false,
    pachtstatus: "Kein Pachtvertrag",
    bewuchs: "Wenig (vereinzelt Büsche)",
    ausgleichsflaecheHa: 0,
    ausgleichstyp: "Keine Ausgleichsflächen",
    zuwegungFeldweg: 0,
    zuwegungFreiflaeche: 0,
    bauleiterScore: 7,
    neigungGrad: 0,
    neigungRichtung: "Flach (< 3°)",
    vermarktungsart: "EEG-Ausschreibung",
    einspeiseverguetung: 5.5,
    nvpEntfernungKm: 2,
    privilegierung: "Nicht privilegiert",
    pachtflaecheHa: 0,
  });

  const updateBewertung = (key) => (value) => {
    setBewertung((prev) => ({ ...prev, [key]: value }));
  };

  const update = (key) => (value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Pachtfläche auch in Bewertung synchronisieren
    if (key === "pachtflaecheHa") {
      setBewertung((prev) => ({ ...prev, pachtflaecheHa: parseFloat(value) || 0 }));
    }
  };

  // Fair-Score (live berechnet)
  const fairScore = useMemo(() => berechneFairScore(bewertung), [bewertung]);

  // Kalkulation
  const kalkulationsDaten = {
    ...formData,
    eigentuemer,
    grundbuch,
    bewertung,
  };
  const ergebnis = useMemo(() => berechneFreiflaeche(kalkulationsDaten), [
    formData.pachtflaecheHa,
    formData.gesamtflaecheHa,
    formData.leistungMwp,
    formData.staffel1,
    formData.staffel2,
    formData.staffel3,
    formData.satzProMwp,
    formData.spezifischerErtrag,
    formData.strompreisCentKwh,
    formData.ertragsProzentsatz,
    formData.mindestpachtProHa,
    formData.erloesProzentsatz,
    formData.wertsicherungProzent,
    formData.laufzeitJahre,
    formData.vorhalteBetrag,
    formData.speicherflaecheM2,
    formData.speicherSatzM2,
    formData.rueckbauSatzKw,
    bewertung,
  ]);

  const gewaehltes = ergebnis[`modell${formData.gewaehlteModell}`];

  // Validierung
  const eigName = (eigentuemer.partner || []).map((p) => p.name).filter(Boolean).join(", ");
  const eigAdresse = (eigentuemer.partner || []).map((p) => p.adresse).filter(Boolean).join(", ")
    || (eigentuemer.eigStrasse && eigentuemer.eigOrt ? `${eigentuemer.eigStrasse}, ${eigentuemer.eigPlz} ${eigentuemer.eigOrt}` : "");
  const hatFlurstück = (grundbuch || []).some((z) => z.flurNr);
  const pachtflaecheHa = parseFloat(formData.pachtflaecheHa) || 0;
  const leistungMwp = parseFloat(formData.leistungMwp) || 0;

  const fehler = [];
  if (!eigName) fehler.push("Eigentümer-Name fehlt");
  if (!eigAdresse) fehler.push("Eigentümer-Adresse fehlt");
  if (pachtflaecheHa === 0) fehler.push("Pachtfläche = 0 ha");
  if (!hatFlurstück) fehler.push("Mind. 1 Flurstück erforderlich");

  const warnungen = [];
  if (pachtflaecheHa > 0 && pachtflaecheHa < 1) warnungen.push("Pachtfläche < 1 ha – für Freifläche ungewöhnlich klein");
  if (pachtflaecheHa > 100) warnungen.push("Pachtfläche > 100 ha – Plausibilität prüfen");
  if (leistungMwp > 0 && leistungMwp < 0.5) warnungen.push("Leistung < 0,5 MWp – wirtschaftlich fragwürdig");
  if (formData.nutzungsart === "Acker" && formData.bodenklasse === "Hoch (>60 Bodenpunkte)")
    warnungen.push("Hochwertiger Ackerboden – mögliche Restriktionen bei EEG-Ausschreibung");
  if (!formData.gewaehlteModell) warnungen.push("Kein Pachtmodell gewählt");

  const alleMeldungen = [...fehler.map((f) => "❌ " + f), ...warnungen];
  const exportGesperrt = fehler.length > 0;

  const tabNamen = ["Eigentümer", "Grundstück", "Fläche & Technik", "Bewertung", "Pachtmodell", "Ergebnis", "Vertrag"];

  // DOCX-Export
  const handleDocxExport = async (typ) => {
    setIsGenerating(true);
    try {
      const exportData = {
        ...formData,
        eigentuemer,
        grundbuch,
      };
      if (typ === "preisblatt") {
        await generateFreiflaechePreisblattDocx(exportData, ergebnis);
      } else {
        await generateFreiflaecheVertragDocx(exportData, ergebnis, klauseln);
      }
    } catch (error) {
      showToast("DOCX-Fehler: " + error.message, "error");
    }
    setIsGenerating(false);
  };

  return (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      <Steps tabs={tabNamen} activeStep={activeTab} onStepClick={setActiveTab} />

      <WarningBanner warnungen={alleMeldungen} />

      {/* ============================================================ */}
      {/* TAB 0: Eigentümer */}
      {/* ============================================================ */}
      {activeTab === 0 && (
        <Section title="Eigentümer / Grundstückseigentümer" icon="👤">
          <OwnerFields eigentuemer={eigentuemer} onChange={setEigentuemer} />
          <NavButtons onNext={() => setActiveTab(1)} />
        </Section>
      )}

      {/* ============================================================ */}
      {/* TAB 1: Grundstück */}
      {/* ============================================================ */}
      {activeTab === 1 && (
        <Section title="Grundstücksdaten" icon="🗺️">
          <TextInput
            label="Grundstücksadresse"
            value={formData.grundstueckAdresse}
            onChange={update("grundstueckAdresse")}
            placeholder="Straße / Flurbezeichnung, PLZ Ort"
          />

          <div style={{ marginTop: 16 }}>
            <LandRegisterFields zeilen={grundbuch} onChange={setGrundbuch} />
          </div>

          <div style={{ ...styles.grid2, marginTop: 12 }}>
            <TextInput
              label="Bankverbindung IBAN (optional)"
              value={formData.eigentuemerIban}
              onChange={update("eigentuemerIban")}
              placeholder="DE..."
            />
            <TextInput
              label="BIC (optional)"
              value={formData.eigentuemerBic}
              onChange={update("eigentuemerBic")}
              placeholder="z.B. GENODEF1..."
            />
          </div>

          <NavButtons onPrev={() => setActiveTab(0)} onNext={() => setActiveTab(2)} />
        </Section>
      )}

      {/* ============================================================ */}
      {/* TAB 2: Fläche & Technik */}
      {/* ============================================================ */}
      {activeTab === 2 && (
        <Section title="Fläche & Technik" icon="📐">
          <div style={styles.grid2}>
            <TextInput
              label="Gesamtfläche Grundstück"
              value={formData.gesamtflaecheHa}
              onChange={update("gesamtflaecheHa")}
              type="number"
              suffix="ha"
              min={0}
            />
            <TextInput
              label="Pachtfläche (PV-Nutzung)"
              value={formData.pachtflaecheHa}
              onChange={update("pachtflaecheHa")}
              type="number"
              suffix="ha"
              min={0}
            />
          </div>

          <div style={{ ...styles.grid2, marginTop: 10 }}>
            <SelectInput
              label="Nutzungsart"
              value={formData.nutzungsart}
              onChange={update("nutzungsart")}
              options={NUTZUNGSARTEN}
            />
            <SelectInput
              label="Bodenklasse"
              value={formData.bodenklasse}
              onChange={update("bodenklasse")}
              options={BODENKLASSEN}
            />
          </div>

          <div style={{ ...styles.grid2, marginTop: 10 }}>
            <TextInput
              label="Geplante Leistung"
              value={formData.leistungMwp}
              onChange={update("leistungMwp")}
              type="number"
              suffix="MWp"
              min={0}
            />
            <SelectInput
              label="Netzanschlussebene"
              value={formData.netzanschlussEbene}
              onChange={update("netzanschlussEbene")}
              options={NETZANSCHLUSS_EBENEN}
            />
          </div>

          {/* Agri-PV Toggle */}
          <div style={{ marginTop: 12 }}>
            <label
              style={{ fontSize: 11, color: COLORS.mid, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              <input
                type="checkbox"
                checked={formData.agriPv}
                onChange={(e) => update("agriPv")(e.target.checked)}
              />
              <span style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>
                Agri-PV (landwirtschaftliche Doppelnutzung)
              </span>
            </label>
          </div>

          {/* Speicher */}
          <div
            style={{
              marginTop: 16,
              padding: "12px 14px",
              background: COLORS.lightBlue,
              borderRadius: 8,
              border: "1px solid #dde8f0",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.dark, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 8 }}>
              Batteriespeicher (optional)
            </div>
            <div style={styles.grid2}>
              <TextInput
                label="Speicher-Grundfläche"
                value={formData.speicherflaecheM2}
                onChange={update("speicherflaecheM2")}
                type="number"
                suffix="m²"
                min={0}
              />
              <TextInput
                label="Vergütungssatz Speicher"
                value={formData.speicherSatzM2}
                onChange={update("speicherSatzM2")}
                type="number"
                suffix="€/m²/J."
                min={0}
              />
            </div>
          </div>

          {/* Quick-Info */}
          {pachtflaecheHa > 0 && leistungMwp > 0 && (
            <div
              style={{
                marginTop: 14,
                background: COLORS.lightBlue,
                borderRadius: 8,
                padding: "10px 14px",
                border: "1px solid #dde8f0",
              }}
            >
              <div style={{ fontSize: 11, color: COLORS.mid, marginBottom: 4 }}>
                Kennzahlen
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.dark }}>
                {(leistungMwp / pachtflaecheHa).toFixed(2)} MWp/ha | {(leistungMwp * 1000).toFixed(0)} kWp gesamt | Rückbau: {formatEuro(leistungMwp * 1000 * (parseFloat(formData.rueckbauSatzKw) || 15))}
              </div>
            </div>
          )}

          <NavButtons onPrev={() => setActiveTab(1)} onNext={() => setActiveTab(3)} />
        </Section>
      )}

      {/* ============================================================ */}
      {/* TAB 3: Bewertung (Fairer Pachtpreis) */}
      {/* ============================================================ */}
      {activeTab === 3 && (
        <>
          <Section title="Standort-Bewertung – Fairer Pachtpreis" icon="⚖️">
            <p style={{ fontSize: 12, color: COLORS.mid, marginBottom: 14, lineHeight: 1.5 }}>
              Alle Parameter fließen in einen Standort-Score ein, der den Basispachtpreis nach oben oder unten anpasst.
              Der Score berücksichtigt Baukosten, Ertragsminderungen und Projektaufwand.
            </p>

            {/* Score-Anzeige */}
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.dark}, ${COLORS.grey})`,
              borderRadius: 11,
              padding: "18px 22px",
              color: COLORS.white,
              marginBottom: 16,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: COLORS.mid, textTransform: "uppercase", letterSpacing: 0.5 }}>Standort-Score</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: fairScore.score >= 60 ? COLORS.green : fairScore.score >= 40 ? COLORS.yellow : COLORS.red }}>
                    {fairScore.score} / 100
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: COLORS.mid, textTransform: "uppercase", letterSpacing: 0.5 }}>Pachtpreis-Anpassung</div>
                  <div style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: fairScore.gesamtAnpassung >= 0 ? COLORS.green : COLORS.red,
                  }}>
                    {fairScore.gesamtAnpassung >= 0 ? "+" : ""}{fairScore.gesamtAnpassung}%
                  </div>
                </div>
              </div>
              {/* Score-Balken */}
              <div style={{ background: "rgba(255,255,255,.15)", borderRadius: 6, height: 10, overflow: "hidden" }}>
                <div style={{
                  width: `${fairScore.score}%`,
                  height: "100%",
                  borderRadius: 6,
                  background: fairScore.score >= 60 ? COLORS.green : fairScore.score >= 40 ? COLORS.yellow : COLORS.red,
                  transition: "width 0.3s",
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: COLORS.mid, marginTop: 3 }}>
                <span>Ungünstig</span>
                <span>Neutral</span>
                <span>Optimal</span>
              </div>
            </div>
          </Section>

          {/* Grundstücks-Parameter */}
          <Section title="Grundstücks-Parameter" icon="📐">
            <div style={styles.grid2}>
              <SelectInput
                label="Privilegierung / Planungsrecht"
                value={bewertung.privilegierung}
                onChange={updateBewertung("privilegierung")}
                options={PRIVILEGIERUNG_OPTIONEN}
              />
              <TextInput
                label="GRZ (Grundflächenzahl)"
                value={bewertung.grz}
                onChange={updateBewertung("grz")}
                type="number"
                min={0}
                max={1}
                placeholder="z.B. 0.6"
              />
            </div>
            <div style={{ ...styles.grid2, marginTop: 10 }}>
              <SelectInput
                label="Pachtstatus"
                value={bewertung.pachtstatus}
                onChange={updateBewertung("pachtstatus")}
                options={PACHTSTATUS_OPTIONEN}
              />
              <SelectInput
                label="Baum-/Buschbesatz"
                value={bewertung.bewuchs}
                onChange={updateBewertung("bewuchs")}
                options={BEWUCHS_OPTIONEN}
              />
            </div>
            <div style={{ ...styles.grid2, marginTop: 10 }}>
              <div>
                <label style={styles.label}>Lagerplatz vorhanden</label>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <button
                    type="button"
                    style={styles.toggle(bewertung.lagerplatz)}
                    onClick={() => updateBewertung("lagerplatz")(true)}
                  >
                    Ja
                  </button>
                  <button
                    type="button"
                    style={styles.toggle(!bewertung.lagerplatz)}
                    onClick={() => updateBewertung("lagerplatz")(false)}
                  >
                    Nein
                  </button>
                </div>
              </div>
              <div>
                <label style={styles.label}>Pachtfläche (aus Tab "Fläche")</label>
                <div style={{
                  padding: "7px 9px",
                  background: COLORS.light,
                  borderRadius: 6,
                  border: "1.5px solid #ddd",
                  fontSize: 13.5,
                  color: bewertung.pachtflaecheHa > 0 ? COLORS.dark : COLORS.mid,
                  fontWeight: 600,
                }}>
                  {bewertung.pachtflaecheHa > 0 ? `${bewertung.pachtflaecheHa} ha` : "Noch nicht eingetragen"}
                </div>
                <div style={{ fontSize: 10, color: COLORS.mid, marginTop: 2 }}>
                  {bewertung.pachtflaecheHa >= 10
                    ? "Große Fläche – Planungskosten verteilen sich gut"
                    : bewertung.pachtflaecheHa >= 3
                    ? "Mittlere Fläche"
                    : bewertung.pachtflaecheHa > 0
                    ? "Kleine Fläche – gleicher Planungsaufwand bei weniger Ertrag"
                    : "Bitte im Tab \"Fläche & Technik\" eintragen"}
                </div>
              </div>
            </div>
            {bewertung.privilegierung === "Nicht privilegiert" && (
              <div style={{ ...styles.warnung, marginTop: 10 }}>
                Ohne Privilegierung oder B-Plan ist die Genehmigung unsicher. Dies senkt den fairen Pachtpreis deutlich (-8%).
              </div>
            )}
          </Section>

          {/* Geländeneigung */}
          <Section title="Geländeneigung" icon="⛰️">
            <div style={styles.grid2}>
              <SelectInput
                label="Ausrichtung Gefälle"
                value={bewertung.neigungRichtung}
                onChange={updateBewertung("neigungRichtung")}
                options={NEIGUNG_RICHTUNGEN}
              />
              <TextInput
                label="Neigungswinkel"
                value={bewertung.neigungGrad}
                onChange={updateBewertung("neigungGrad")}
                type="number"
                suffix="°"
                min={0}
                max={45}
              />
            </div>
            {bewertung.neigungRichtung === "Nord" && bewertung.neigungGrad > 5 && (
              <div style={{ ...styles.warnung, marginTop: 8 }}>
                {"Nordneigung > 5° reduziert den Ertrag erheblich und senkt den fairen Pachtpreis deutlich."}
              </div>
            )}
          </Section>

          {/* Ausgleichsflächen */}
          <Section title="Ausgleichsflächen" icon="🌿">
            <div style={styles.grid2}>
              <SelectInput
                label="Art der Ausgleichsmaßnahme"
                value={bewertung.ausgleichstyp}
                onChange={updateBewertung("ausgleichstyp")}
                options={AUSGLEICH_TYPEN}
              />
              {bewertung.ausgleichstyp !== "Keine Ausgleichsflächen" && (
                <TextInput
                  label="Ausgleichsfläche"
                  value={bewertung.ausgleichsflaecheHa}
                  onChange={updateBewertung("ausgleichsflaecheHa")}
                  type="number"
                  suffix="ha"
                  min={0}
                />
              )}
            </div>
          </Section>

          {/* Zuwegung */}
          <Section title="Zuwegung / Aufschotterung" icon="🛤️">
            <div style={styles.grid2}>
              <TextInput
                label="Aufschotterung Feldweg"
                value={bewertung.zuwegungFeldweg}
                onChange={updateBewertung("zuwegungFeldweg")}
                type="number"
                suffix="Meter"
                min={0}
                placeholder="0"
              />
              <TextInput
                label="Neuer Weg über Freifläche"
                value={bewertung.zuwegungFreiflaeche}
                onChange={updateBewertung("zuwegungFreiflaeche")}
                type="number"
                suffix="Meter"
                min={0}
                placeholder="0"
              />
            </div>
            <div style={{ marginTop: 6, fontSize: 11, color: COLORS.mid }}>
              Freiflächenwege werden 3× stärker gewichtet als Feldwegaufschotterung.
            </div>
          </Section>

          {/* Vermarktung */}
          <Section title="Vermarktung & Netzanschluss" icon="💰">
            <div style={styles.grid2}>
              <SelectInput
                label="Vermarktungsart"
                value={bewertung.vermarktungsart}
                onChange={updateBewertung("vermarktungsart")}
                options={VERMARKTUNGSARTEN}
              />
              <TextInput
                label="Erwartete Einspeisevergütung"
                value={bewertung.einspeiseverguetung}
                onChange={updateBewertung("einspeiseverguetung")}
                type="number"
                suffix="ct/kWh"
                min={3}
                max={15}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <TextInput
                label="Entfernung Netzverknüpfungspunkt"
                value={bewertung.nvpEntfernungKm}
                onChange={updateBewertung("nvpEntfernungKm")}
                type="number"
                suffix="km"
                min={0}
              />
            </div>
          </Section>

          {/* Bauleiter-Score */}
          <Section title="Bauleiter-Gesamtbewertung" icon="👷">
            <div style={{ maxWidth: 400 }}>
              <label style={styles.label}>Gesamtbewertung des Projekts (1 = schwierig, 10 = optimal)</label>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={bewertung.bauleiterScore}
                  onChange={(e) => updateBewertung("bauleiterScore")(parseInt(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{
                  fontWeight: 800,
                  fontSize: 22,
                  color: bewertung.bauleiterScore >= 7 ? COLORS.green : bewertung.bauleiterScore >= 4 ? COLORS.yellow : COLORS.red,
                  minWidth: 40,
                  textAlign: "center",
                }}>
                  {bewertung.bauleiterScore}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: COLORS.mid, marginTop: 2 }}>
                <span>Schwierig</span>
                <span>Optimal</span>
              </div>
            </div>
          </Section>

          {/* Faktor-Übersicht */}
          <Section title="Faktor-Übersicht" icon="📊">
            <div style={{ fontSize: 12 }}>
              {fairScore.faktoren.map((f, i) => (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "7px 0",
                  borderBottom: i < fairScore.faktoren.length - 1 ? "1px solid #f0f0f0" : "none",
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 12.5 }}>{f.name}</div>
                    <div style={{ fontSize: 11, color: COLORS.mid }}>{f.wert} – {f.erklaerung}</div>
                  </div>
                  <div style={{
                    fontWeight: 700,
                    fontSize: 13,
                    minWidth: 50,
                    textAlign: "right",
                    color: f.anpassung > 0 ? COLORS.green : f.anpassung < 0 ? COLORS.red : COLORS.mid,
                  }}>
                    {f.anpassung > 0 ? "+" : ""}{f.anpassung}%
                  </div>
                </div>
              ))}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0 4px",
                borderTop: `2px solid ${COLORS.dark}`,
                marginTop: 4,
              }}>
                <div style={{ fontWeight: 800, fontSize: 13 }}>Gesamt-Anpassung</div>
                <div style={{
                  fontWeight: 800,
                  fontSize: 15,
                  color: fairScore.gesamtAnpassung >= 0 ? COLORS.green : COLORS.red,
                }}>
                  {fairScore.gesamtAnpassung >= 0 ? "+" : ""}{fairScore.gesamtAnpassung}% (Faktor: {fairScore.multiplikator.toFixed(2)}×)
                </div>
              </div>
              {fairScore.gesamtAnpassungUnbegrenzt !== fairScore.gesamtAnpassung && (
                <div style={{ fontSize: 10.5, color: COLORS.mid, marginTop: 4 }}>
                  Unbegrenzte Summe: {fairScore.gesamtAnpassungUnbegrenzt}% – begrenzt auf ±30%
                </div>
              )}
            </div>
          </Section>

          <NavButtons onPrev={() => setActiveTab(2)} onNext={() => setActiveTab(4)} />
        </>
      )}

      {/* ============================================================ */}
      {/* TAB 4: Pachtmodell */}
      {/* ============================================================ */}
      {activeTab === 4 && (
        <>
          {/* Allgemeine Parameter */}
          <Section title="Vertragslaufzeit & Wertsicherung" icon="⚙️">
            <div style={styles.grid2}>
              <TextInput
                label="Vertragslaufzeit"
                value={formData.laufzeitJahre}
                onChange={update("laufzeitJahre")}
                type="number"
                suffix="Jahre"
                min={10}
                max={30}
              />
              <TextInput
                label="Wertsicherung (alle 10 J.)"
                value={formData.wertsicherungProzent}
                onChange={update("wertsicherungProzent")}
                type="number"
                suffix="%"
                min={0}
                max={30}
              />
            </div>
            <div style={{ ...styles.grid2, marginTop: 8 }}>
              <TextInput
                label="Vorhaltevergütung"
                value={formData.vorhalteBetrag}
                onChange={update("vorhalteBetrag")}
                type="number"
                suffix="€/Jahr"
                min={0}
              />
              <TextInput
                label="Rückbausicherheit"
                value={formData.rueckbauSatzKw}
                onChange={update("rueckbauSatzKw")}
                type="number"
                suffix="€/kW"
                min={0}
              />
            </div>
          </Section>

          {/* Modell A – Staffel */}
          <Section title="Modell A – Festpacht pro Hektar (Staffel)" icon="🅰️">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <TextInput
                label="Staffel 1 (BJ 1–10)"
                value={formData.staffel1}
                onChange={update("staffel1")}
                type="number"
                suffix="€/ha"
                min={1000}
              />
              <TextInput
                label="Staffel 2 (BJ 11–20)"
                value={formData.staffel2}
                onChange={update("staffel2")}
                type="number"
                suffix="€/ha"
                min={1000}
              />
              <TextInput
                label="Staffel 3 (BJ 21+)"
                value={formData.staffel3}
                onChange={update("staffel3")}
                type="number"
                suffix="€/ha"
                min={1000}
              />
            </div>
            {pachtflaecheHa > 0 && (
              <div style={{ marginTop: 6, fontSize: 12, color: COLORS.mid }}>
                {pachtflaecheHa} ha × {formData.staffel1} € = <strong>{formatEuro(ergebnis.modellA.pachtzinsJahr)}/Jahr (BJ 1)</strong>
              </div>
            )}
          </Section>

          {/* Modell B – MWp */}
          <Section title="Modell B – Festpacht pro MWp" icon="🅱️">
            <TextInput
              label="Satz pro MWp"
              value={formData.satzProMwp}
              onChange={update("satzProMwp")}
              type="number"
              suffix="€/MWp/J."
              min={3000}
            />
            {leistungMwp > 0 && (
              <div style={{ marginTop: 6, fontSize: 12, color: COLORS.mid }}>
                {leistungMwp} MWp × {formData.satzProMwp} € = <strong>{formatEuro(ergebnis.modellB.pachtzinsJahr)}/Jahr</strong>
              </div>
            )}
          </Section>

          {/* Modell C – Ertragsabhängig */}
          <Section title="Modell C – Ertragsabhängige Pacht" icon="©️">
            <div style={styles.grid2}>
              <TextInput
                label="Spez. Ertrag"
                value={formData.spezifischerErtrag}
                onChange={update("spezifischerErtrag")}
                type="number"
                suffix="kWh/kWp"
                min={700}
                max={1300}
              />
              <TextInput
                label="Strompreis"
                value={formData.strompreisCentKwh}
                onChange={update("strompreisCentKwh")}
                type="number"
                suffix="ct/kWh"
                min={3}
                max={20}
              />
              <TextInput
                label="Beteiligung"
                value={formData.ertragsProzentsatz}
                onChange={update("ertragsProzentsatz")}
                type="number"
                suffix="%"
                min={3}
                max={10}
              />
            </div>
            {leistungMwp > 0 && (
              <div style={{ marginTop: 6, fontSize: 12, color: COLORS.mid }}>
                {formatZahl(ergebnis.modellC.jahresertragKwh, 0)} kWh × {formData.strompreisCentKwh} ct × {formData.ertragsProzentsatz}% = <strong>{formatEuro(ergebnis.modellC.pachtzinsJahr)}/Jahr</strong>
              </div>
            )}
          </Section>

          {/* Modell D – Hybrid */}
          <Section title="Modell D – Hybrid (Mindestpacht + Erlös)" icon="🅳">
            <div style={styles.grid2}>
              <TextInput
                label="Mindestpacht"
                value={formData.mindestpachtProHa}
                onChange={update("mindestpachtProHa")}
                type="number"
                suffix="€/ha"
                min={1000}
              />
              <TextInput
                label="Erlösanteil"
                value={formData.erloesProzentsatz}
                onChange={update("erloesProzentsatz")}
                type="number"
                suffix="%"
                min={1}
                max={10}
              />
            </div>
            {pachtflaecheHa > 0 && leistungMwp > 0 && (
              <div style={{ marginTop: 6, fontSize: 12, color: COLORS.mid }}>
                Mindest: {formatEuro(ergebnis.modellD.mindestpacht)} + Erlös: {formatEuro(ergebnis.modellD.erloesAnteil)} = <strong>{formatEuro(ergebnis.modellD.pachtzinsJahr)}/Jahr</strong>
              </div>
            )}
          </Section>

          {/* Modellauswahl */}
          <Section title="Modellauswahl" icon="✅">
            <p style={{ fontSize: 12, color: COLORS.mid, marginBottom: 10 }}>
              Wähle das Pachtmodell für den Vertrag:
            </p>
            {["A", "B", "C", "D"].map((key) => (
              <ModellKarte
                key={key}
                modell={ergebnis[`modell${key}`]}
                modellKey={key}
                aktiv={formData.gewaehlteModell === key}
                onClick={() => update("gewaehlteModell")(key)}
              />
            ))}
          </Section>

          <NavButtons
            onPrev={() => setActiveTab(3)}
            onNext={() => setActiveTab(5)}
            nextLabel="Ergebnis →"
          />
        </>
      )}

      {/* ============================================================ */}
      {/* TAB 5: Ergebnis */}
      {/* ============================================================ */}
      {activeTab === 5 && (
        <>
          {/* Gewähltes Modell */}
          <ResultBox label={`GEWÄHLTES MODELL: ${gewaehltes.modell.toUpperCase()}`}>
            <ResultGrid>
              <ResultCell
                label="Jährlich (1. BJ)"
                amount={formatEuro(gewaehltes.pachtzinsJahr)}
                sub={`Monatlich: ${formatEuro(gewaehltes.pachtzinsMonat)}`}
              />
              <ResultCell
                label={`Summe ${ergebnis.laufzeitJahre} Jahre`}
                amount={formatEuro(gewaehltes.pachtGesamt)}
                sub={`Wertsicherung: +${formData.wertsicherungProzent}% alle 10 J.`}
              />
            </ResultGrid>
          </ResultBox>

          {/* Fairer Pachtpreis */}
          {gewaehltes.fairPachtzinsJahr && (
            <div style={{
              ...styles.card,
              marginTop: 12,
              borderLeft: `4px solid ${fairScore.gesamtAnpassung >= 0 ? COLORS.green : COLORS.red}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>
                  ⚖️ Fairer Pachtpreis (Score: {fairScore.score}/100)
                </div>
                <div style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: fairScore.gesamtAnpassung >= 0 ? COLORS.green : COLORS.red,
                  background: fairScore.gesamtAnpassung >= 0 ? "#E8F5E9" : "#FFEBEE",
                  padding: "2px 10px",
                  borderRadius: 4,
                }}>
                  {fairScore.gesamtAnpassung >= 0 ? "+" : ""}{fairScore.gesamtAnpassung}%
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 10, color: COLORS.mid, textTransform: "uppercase" }}>Basis/Jahr</div>
                  <div style={{ fontSize: 13, color: COLORS.mid, textDecoration: "line-through" }}>
                    {formatEuro(gewaehltes.pachtzinsJahr)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: COLORS.mid, textTransform: "uppercase" }}>Fair/Jahr</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.dark }}>
                    {formatEuro(gewaehltes.fairPachtzinsJahr)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: COLORS.mid, textTransform: "uppercase" }}>Fair/Monat</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.dark }}>
                    {formatEuro(gewaehltes.fairPachtzinsMonat)}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: COLORS.mid }}>
                Empfohlener Pachtpreis basierend auf {fairScore.faktoren.length} Standortfaktoren.
                Gesamtlaufzeit fair: {formatEuro(gewaehltes.fairPachtGesamt)}
              </div>
            </div>
          )}

          {/* Zusatzvergütungen */}
          <div style={{ ...styles.card, marginTop: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
              Zusätzliche Vergütungen
            </div>
            <DetailRow
              label="Vorhaltevergütung (vor IBN)"
              value={`${formatEuro(ergebnis.vorhalteverguetung.betragJahr)} / Jahr`}
            />
            {ergebnis.speicher.speicherflaecheM2 > 0 && (
              <DetailRow
                label="Speichervergütung (Graustrom)"
                value={`${formatEuro(ergebnis.speicher.verguetungJahr)} / Jahr`}
              />
            )}
            <DetailRow
              label="Rückbaubürgschaft"
              value={formatEuro(ergebnis.rueckbau.buergschaftBetrag)}
            />
          </div>

          {/* Vergleichstabelle */}
          <div style={{ ...styles.card, marginTop: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
              Modellvergleich
            </div>
            {["A", "B", "C", "D"].map((key) => {
              const m = ergebnis[`modell${key}`];
              return (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: formData.gewaehlteModell === key ? "6px 8px" : "6px 0",
                    borderBottom: "1px solid #f0f0f0",
                    fontSize: 12.5,
                    background: formData.gewaehlteModell === key ? COLORS.yellow + "20" : "transparent",
                    borderRadius: 4,
                    marginBottom: 2,
                  }}
                >
                  <span style={{ color: COLORS.mid }}>
                    {formData.gewaehlteModell === key && "▶ "}
                    {key}: {m.modell}
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {m.fairPachtzinsJahr
                      ? <>{formatEuro(m.fairPachtzinsJahr)}/J. <span style={{ color: COLORS.mid, fontWeight: 400, fontSize: 11 }}>(Basis: {formatEuro(m.pachtzinsJahr)})</span></>
                      : <>{formatEuro(m.pachtzinsJahr)}/J. | {formatEuro(m.pachtGesamt)} ({ergebnis.laufzeitJahre}J.)</>
                    }
                  </span>
                </div>
              );
            })}
          </div>

          {/* Kalkulationsdetails */}
          <div style={{ ...styles.card, marginTop: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
              Kalkulationsdetails
            </div>
            <DetailRow label="Pachtfläche" value={`${pachtflaecheHa} ha`} />
            <DetailRow label="Gesamtfläche" value={`${formData.gesamtflaecheHa || 0} ha`} />
            <DetailRow label="PV-Leistung" value={`${leistungMwp} MWp (${leistungMwp * 1000} kWp)`} />
            <DetailRow label="Vertragslaufzeit" value={`${ergebnis.laufzeitJahre} Jahre`} />
            <DetailRow label="Nutzungsart" value={formData.nutzungsart} />
            <DetailRow label="Agri-PV" value={formData.agriPv ? "Ja" : "Nein"} />
            <div style={{ height: 2, background: COLORS.yellow, margin: "5px 0" }} />
            {formData.gewaehlteModell === "A" && (
              <>
                <DetailRow label="Staffel 1 (BJ 1–10)" value={`${formData.staffel1} €/ha/J.`} />
                <DetailRow label="Staffel 2 (BJ 11–20)" value={`${formData.staffel2} €/ha/J.`} />
                <DetailRow label="Staffel 3 (BJ 21+)" value={`${formData.staffel3} €/ha/J.`} />
              </>
            )}
            {formData.gewaehlteModell === "B" && (
              <DetailRow label="Satz pro MWp" value={`${formData.satzProMwp} €/MWp/J.`} />
            )}
            {formData.gewaehlteModell === "C" && (
              <>
                <DetailRow label="Spez. Ertrag" value={`${formData.spezifischerErtrag} kWh/kWp`} />
                <DetailRow label="Strompreis" value={`${formData.strompreisCentKwh} ct/kWh`} />
                <DetailRow label="Beteiligung" value={`${formData.ertragsProzentsatz}%`} />
              </>
            )}
            {formData.gewaehlteModell === "D" && (
              <>
                <DetailRow label="Mindestpacht" value={`${formData.mindestpachtProHa} €/ha`} />
                <DetailRow label="Erlösanteil" value={`${formData.erloesProzentsatz}%`} />
              </>
            )}
            <div style={{ height: 2, background: COLORS.dark, margin: "5px 0" }} />
            <DetailRow label="Pacht/Jahr (1. BJ)" value={formatEuro(gewaehltes.pachtzinsJahr)} highlight />
            <DetailRow label="Pacht/Monat" value={formatEuro(gewaehltes.pachtzinsMonat)} highlight />
          </div>

          {exportGesperrt && (
            <div style={{ textAlign: "center", marginTop: 8, padding: "8px 12px", background: "#FFEBEE", borderRadius: 6, color: "#C62828", fontSize: 12.5 }}>
              Export nicht möglich – Pflichtdaten fehlen
            </div>
          )}

          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
            <button style={styles.btnOutline} onClick={() => setActiveTab(4)}>
              ← Modell ändern
            </button>
            <button
              style={{ ...styles.btnPrimary, opacity: exportGesperrt ? 0.5 : 1 }}
              onClick={() => handleDocxExport("preisblatt")}
              disabled={isGenerating || exportGesperrt}
            >
              Preisblatt DOCX
            </button>
            <button style={styles.btnBlue} onClick={() => setActiveTab(6)}>
              Vertrag →
            </button>
          </div>
        </>
      )}

      {/* ============================================================ */}
      {/* TAB 6: Vertrag */}
      {/* ============================================================ */}
      {activeTab === 6 && (
        <>
          <Section title="Gestattungsvertrag bearbeiten" icon="📝">
            <ClauseEditor
              klauseln={klauseln}
              setKlauseln={setKlauseln}
              defaultKlauseln={FREIFLAECHE_KLAUSELN}
            />
          </Section>

          {exportGesperrt && (
            <div style={{ textAlign: "center", marginTop: 8, padding: "8px 12px", background: "#FFEBEE", borderRadius: 6, color: "#C62828", fontSize: 12.5 }}>
              Export nicht möglich – Pflichtdaten fehlen
            </div>
          )}

          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
            <button style={styles.btnOutline} onClick={() => setActiveTab(5)}>
              ← Ergebnis
            </button>
            <button
              style={{ ...styles.btnPrimary, fontSize: 14.5, padding: "12px 28px", opacity: exportGesperrt ? 0.5 : 1 }}
              onClick={() => handleDocxExport("vertrag")}
              disabled={isGenerating || exportGesperrt}
            >
              {isGenerating ? "Wird erstellt…" : "📄 Vertrag als DOCX"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
