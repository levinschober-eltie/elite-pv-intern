import React, { useState, useMemo } from "react";
import { COLORS, styles } from "../../theme";
import { formatEuro, formatZahl } from "../../lib/formatters";
import {
  berechneFreiflaeche,
  NUTZUNGSARTEN,
  BODENKLASSEN,
  NETZANSCHLUSS_EBENEN,
} from "./freiflaecheCalc";
import { FREIFLAECHE_KLAUSELN } from "./freiflaecheClauses";
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

function ModellKarte({ modell, aktiv, onClick, modellKey }) {
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
}

// ============================================================
// MAIN GENERATOR
// ============================================================
export default function FreiflaecheGenerator() {
  const showToast = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [klauseln, setKlauseln] = useState(
    FREIFLAECHE_KLAUSELN.map((k) => ({ ...k }))
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

  const update = (key) => (value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Kalkulation
  const kalkulationsDaten = {
    ...formData,
    eigentuemer,
    grundbuch,
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

  const tabNamen = ["Eigentümer", "Grundstück", "Fläche & Technik", "Pachtmodell", "Ergebnis", "Vertrag"];

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
      {/* TAB 3: Pachtmodell */}
      {/* ============================================================ */}
      {activeTab === 3 && (
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
            onPrev={() => setActiveTab(2)}
            onNext={() => setActiveTab(4)}
            nextLabel="Ergebnis →"
          />
        </>
      )}

      {/* ============================================================ */}
      {/* TAB 4: Ergebnis */}
      {/* ============================================================ */}
      {activeTab === 4 && (
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
                    {formatEuro(m.pachtzinsJahr)}/J. | {formatEuro(m.pachtGesamt)} ({ergebnis.laufzeitJahre}J.)
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
            <button style={styles.btnOutline} onClick={() => setActiveTab(3)}>
              ← Modell ändern
            </button>
            <button
              style={{ ...styles.btnPrimary, opacity: exportGesperrt ? 0.5 : 1 }}
              onClick={() => handleDocxExport("preisblatt")}
              disabled={isGenerating || exportGesperrt}
            >
              Preisblatt DOCX
            </button>
            <button style={styles.btnBlue} onClick={() => setActiveTab(5)}>
              Vertrag →
            </button>
          </div>
        </>
      )}

      {/* ============================================================ */}
      {/* TAB 5: Vertrag */}
      {/* ============================================================ */}
      {activeTab === 5 && (
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
            <button style={styles.btnOutline} onClick={() => setActiveTab(4)}>
              ← Ergebnis
            </button>
            <button
              style={{ ...styles.btnPrimary, fontSize: 14.5, padding: "12px 28px", opacity: exportGesperrt ? 0.5 : 1 }}
              onClick={() => handleDocxExport("vertrag")}
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
