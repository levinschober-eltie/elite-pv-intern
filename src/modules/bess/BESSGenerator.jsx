import React, { useState, useMemo, memo } from "react";
import { COLORS, styles } from "../../theme";
import { formatEuro, formatZahl } from "../../lib/formatters";
import {
  berechneBESS,
  NETZANSCHLUSS_EBENEN,
  BESS_TECHNOLOGIEN,
  BESS_ANWENDUNGEN,
} from "./bessCalc";
import { BESS_KLAUSELN } from "./bessClauses";
import {
  generateBESSPreisblattDocx,
  generateBESSVertragDocx,
} from "./bessDocxExport";
import { TextInput, SelectInput, NavButtons } from "../../components/FormFields";
import Section from "../../components/Section";
import Steps from "../../components/Steps";
import ResultBox, { ResultGrid, ResultCell } from "../../components/ResultBox";
import DetailRow from "../../components/DetailRow";
import ClauseEditor from "../../components/ClauseEditor";
import OwnerFields, { createDefaultEigentuemer } from "../../components/OwnerFields";
import LandRegisterFields, { createDefaultGrundbuch } from "../../components/LandRegisterFields";
import WarningBanner from "../../components/WarningBanner";
import { useToast } from "../../components/Toast";

// ============================================================
// MODELL-KARTE (A–C)
// ============================================================
const MODELL_FARBEN = { A: COLORS.yellow, B: COLORS.blue, C: COLORS.green };

const ModellKarte = memo(function ModellKarte({ modell, aktiv, onClick, modellKey }) {
  const farbe = MODELL_FARBEN[modellKey] || COLORS.yellow;
  const istDunkel = modellKey === "B";
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
          {aktiv ? "\u2713 " : ""}Modell {modellKey}: {modell.modell}
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
            GEW\u00C4HLT
          </span>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <div>
          <div style={{ fontSize: 10, color: COLORS.mid, textTransform: "uppercase" }}>Pacht/Jahr</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.dark }}>
            {formatEuro(modell.pachtzinsJahr)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: COLORS.mid, textTransform: "uppercase" }}>Pacht/Monat</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.dark }}>
            {formatEuro(modell.pachtzinsMonat)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: COLORS.mid, textTransform: "uppercase" }}>Summe</div>
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
export default function BESSGenerator() {
  const showToast = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [klauseln, setKlauseln] = useState(
    BESS_KLAUSELN.map((k) => ({ ...k }))
  );

  const [eigentuemer, setEigentuemer] = useState(createDefaultEigentuemer());
  const [grundbuch, setGrundbuch] = useState(createDefaultGrundbuch());

  const [formData, setFormData] = useState({
    // Grundst\u00FCck
    grundstueckAdresse: "",
    eigentuemerIban: "",
    eigentuemerBic: "",
    // BESS-Technik
    bessFlaecheM2: "",
    kapazitaetMwh: "",
    leistungMw: "",
    containerAnzahl: "",
    technologie: "Lithium-Ionen (LFP)",
    anwendung: "Arbitrage / Stromhandel",
    netzanschlussEbene: "Mittelspannung",
    // Pachtmodell
    laufzeitJahre: 20,
    steigerungProzent: 10,
    vorhalteProzent: 50,
    rueckbauSatzKwh: 8,
    // Modell A
    satzProM2: 4,
    // Modell B
    satzProMwh: 1500,
    // Modell C
    mindestProM2: 2.5,
    zuschlagProMwh: 800,
    // Allgemein
    gewaehlteModell: "A",
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
  const ergebnis = useMemo(() => berechneBESS(kalkulationsDaten), [
    formData.bessFlaecheM2,
    formData.kapazitaetMwh,
    formData.leistungMw,
    formData.satzProM2,
    formData.satzProMwh,
    formData.mindestProM2,
    formData.zuschlagProMwh,
    formData.steigerungProzent,
    formData.laufzeitJahre,
    formData.vorhalteProzent,
    formData.rueckbauSatzKwh,
    formData.gewaehlteModell,
  ]);

  const gewaehltes = ergebnis[`modell${formData.gewaehlteModell}`];

  // Validierung
  const eigName = (eigentuemer.partner || []).map((p) => p.name).filter(Boolean).join(", ");
  const eigAdresse = (eigentuemer.partner || []).map((p) => p.adresse).filter(Boolean).join(", ")
    || (eigentuemer.eigStrasse && eigentuemer.eigOrt ? `${eigentuemer.eigStrasse}, ${eigentuemer.eigPlz} ${eigentuemer.eigOrt}` : "");
  const hatFlurstueck = (grundbuch || []).some((z) => z.flurNr);
  const bessFlaecheM2 = parseFloat(formData.bessFlaecheM2) || 0;
  const kapazitaetMwh = parseFloat(formData.kapazitaetMwh) || 0;
  const leistungMw = parseFloat(formData.leistungMw) || 0;

  // Pflichtfeld-Fehler (blockieren Export)
  const fehler = [];
  if (!eigName) fehler.push("Eigent\u00FCmer-Name fehlt");
  if (!eigAdresse) fehler.push("Eigent\u00FCmer-Adresse fehlt");
  if (bessFlaecheM2 === 0) fehler.push("BESS-Fl\u00E4che = 0 m\u00B2");
  if (kapazitaetMwh === 0) fehler.push("Kapazit\u00E4t = 0 MWh");
  if (!hatFlurstueck) fehler.push("Mind. 1 Flurst\u00FCck erforderlich");

  // Warnungen (nicht-blockierend)
  const warnungen = [];
  if (bessFlaecheM2 > 0 && bessFlaecheM2 < 500) warnungen.push("BESS-Fl\u00E4che < 500 m\u00B2 \u2013 f\u00FCr BESS ungew\u00F6hnlich klein");
  if (kapazitaetMwh > 500) warnungen.push("Kapazit\u00E4t > 500 MWh \u2013 Plausibilit\u00E4t pr\u00FCfen");
  if (leistungMw === 0) warnungen.push("Leistung = 0 MW \u2013 bitte angeben");

  // Alle Meldungen f\u00FCr Banner
  const alleMeldungen = [...fehler.map((f) => "\u274C " + f), ...warnungen];
  const exportGesperrt = fehler.length > 0;

  const tabNamen = ["Eigent\u00FCmer", "Grundst\u00FCck", "BESS-Technik", "Pachtmodell", "Ergebnis", "Vertrag"];

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
        await generateBESSPreisblattDocx(exportData, ergebnis);
      } else {
        await generateBESSVertragDocx(exportData, ergebnis, klauseln);
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
      {/* TAB 0: Eigent\u00FCmer */}
      {/* ============================================================ */}
      {activeTab === 0 && (
        <Section title="Eigent\u00FCmer / Grundst\u00FCckseigent\u00FCmer" icon="\uD83D\uDC64">
          <OwnerFields eigentuemer={eigentuemer} onChange={setEigentuemer} />
          <NavButtons onNext={() => setActiveTab(1)} />
        </Section>
      )}

      {/* ============================================================ */}
      {/* TAB 1: Grundst\u00FCck */}
      {/* ============================================================ */}
      {activeTab === 1 && (
        <Section title="Grundst\u00FCcksdaten" icon="\uD83D\uDDFA\uFE0F">
          <TextInput
            label="Grundst\u00FCcksadresse"
            value={formData.grundstueckAdresse}
            onChange={update("grundstueckAdresse")}
            placeholder="Stra\u00DFe / Flurbezeichnung, PLZ Ort"
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
      {/* TAB 2: BESS-Technik */}
      {/* ============================================================ */}
      {activeTab === 2 && (
        <Section title="BESS-Technik" icon="\uD83D\uDD0B">
          <div style={styles.grid2}>
            <TextInput
              label="BESS-Fl\u00E4che"
              value={formData.bessFlaecheM2}
              onChange={update("bessFlaecheM2")}
              type="number"
              suffix="m\u00B2"
              min={0}
            />
            <TextInput
              label="Speicherkapazit\u00E4t"
              value={formData.kapazitaetMwh}
              onChange={update("kapazitaetMwh")}
              type="number"
              suffix="MWh"
              min={0}
            />
          </div>

          <div style={{ ...styles.grid2, marginTop: 10 }}>
            <TextInput
              label="Leistung"
              value={formData.leistungMw}
              onChange={update("leistungMw")}
              type="number"
              suffix="MW"
              min={0}
            />
            <TextInput
              label="Container-Anzahl"
              value={formData.containerAnzahl}
              onChange={update("containerAnzahl")}
              type="number"
              suffix="Stk."
              min={0}
            />
          </div>

          <div style={{ ...styles.grid2, marginTop: 10 }}>
            <SelectInput
              label="Technologie"
              value={formData.technologie}
              onChange={update("technologie")}
              options={BESS_TECHNOLOGIEN}
            />
            <SelectInput
              label="Anwendung"
              value={formData.anwendung}
              onChange={update("anwendung")}
              options={BESS_ANWENDUNGEN}
            />
          </div>

          <div style={{ ...styles.grid2, marginTop: 10 }}>
            <SelectInput
              label="Netzanschlussebene"
              value={formData.netzanschlussEbene}
              onChange={update("netzanschlussEbene")}
              options={NETZANSCHLUSS_EBENEN}
            />
          </div>

          {/* Quick-Info */}
          {bessFlaecheM2 > 0 && kapazitaetMwh > 0 && (
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
                {(kapazitaetMwh / bessFlaecheM2 * 1000).toFixed(1)} kWh/m\u00B2 | {kapazitaetMwh} MWh ({(kapazitaetMwh * 1000).toFixed(0)} kWh) | {leistungMw > 0 ? `C-Rate: ${(leistungMw / kapazitaetMwh).toFixed(2)}` : "Leistung fehlt"}
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
          <Section title="Vertragslaufzeit & Steigerung" icon="\u2699\uFE0F">
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
                label="Steigerung ab Betriebsjahr 11"
                value={formData.steigerungProzent}
                onChange={update("steigerungProzent")}
                type="number"
                suffix="% ab BJ 11"
                min={0}
                max={20}
              />
            </div>
            <div style={{ ...styles.grid2, marginTop: 8 }}>
              <TextInput
                label="Vorhalteverg\u00FCtung (vor IBN)"
                value={formData.vorhalteProzent}
                onChange={update("vorhalteProzent")}
                type="number"
                suffix="% vor IBN"
                min={0}
                max={100}
              />
              <TextInput
                label="R\u00FCckbausicherheit"
                value={formData.rueckbauSatzKwh}
                onChange={update("rueckbauSatzKwh")}
                type="number"
                suffix="\u20AC/kWh"
                min={1}
                max={20}
              />
            </div>
          </Section>

          {/* Modell A \u2013 Festpacht pro m\u00B2 */}
          <Section title="Modell A \u2013 Festpacht pro m\u00B2" icon="\uD83C\uDD70\uFE0F">
            <TextInput
              label="Satz pro m\u00B2"
              value={formData.satzProM2}
              onChange={update("satzProM2")}
              type="number"
              suffix="\u20AC/m\u00B2/J."
              min={1}
            />
            {bessFlaecheM2 > 0 && (
              <div style={{ marginTop: 6, fontSize: 12, color: COLORS.mid }}>
                {formatZahl(bessFlaecheM2, 0)} m\u00B2 \u00D7 {formData.satzProM2} \u20AC = <strong>{formatEuro(ergebnis.modellA.pachtzinsJahr)}/Jahr</strong>
              </div>
            )}
          </Section>

          {/* Modell B \u2013 Festpacht pro MWh */}
          <Section title="Modell B \u2013 Festpacht pro MWh Kapazit\u00E4t" icon="\uD83C\uDD71\uFE0F">
            <TextInput
              label="Satz pro MWh"
              value={formData.satzProMwh}
              onChange={update("satzProMwh")}
              type="number"
              suffix="\u20AC/MWh/J."
              min={500}
            />
            {kapazitaetMwh > 0 && (
              <div style={{ marginTop: 6, fontSize: 12, color: COLORS.mid }}>
                {formatZahl(kapazitaetMwh, 1)} MWh \u00D7 {formData.satzProMwh} \u20AC = <strong>{formatEuro(ergebnis.modellB.pachtzinsJahr)}/Jahr</strong>
              </div>
            )}
          </Section>

          {/* Modell C \u2013 Hybrid */}
          <Section title="Modell C \u2013 Hybrid (Fl\u00E4che + Kapazit\u00E4t)" icon="\u00A9\uFE0F">
            <div style={styles.grid2}>
              <TextInput
                label="Mindestpacht pro m\u00B2"
                value={formData.mindestProM2}
                onChange={update("mindestProM2")}
                type="number"
                suffix="\u20AC/m\u00B2/J."
                min={1}
              />
              <TextInput
                label="Kapazit\u00E4tszuschlag pro MWh"
                value={formData.zuschlagProMwh}
                onChange={update("zuschlagProMwh")}
                type="number"
                suffix="\u20AC/MWh/J."
                min={100}
              />
            </div>
            {bessFlaecheM2 > 0 && kapazitaetMwh > 0 && (
              <div style={{ marginTop: 6, fontSize: 12, color: COLORS.mid }}>
                Mindest: {formatEuro(ergebnis.modellC.mindestpacht)} + Zuschlag: {formatEuro(ergebnis.modellC.kapazitaetsZuschlag)} = <strong>{formatEuro(ergebnis.modellC.pachtzinsJahr)}/Jahr</strong>
              </div>
            )}
          </Section>

          {/* Modellauswahl */}
          <Section title="Modellauswahl" icon="\u2705">
            <p style={{ fontSize: 12, color: COLORS.mid, marginBottom: 10 }}>
              W\u00E4hle das Pachtmodell f\u00FCr den Vertrag:
            </p>
            {["A", "B", "C"].map((key) => (
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
            nextLabel="Ergebnis \u2192"
          />
        </>
      )}

      {/* ============================================================ */}
      {/* TAB 4: Ergebnis */}
      {/* ============================================================ */}
      {activeTab === 4 && (
        <>
          {/* Gew\u00E4hltes Modell */}
          <ResultBox label={`GEW\u00C4HLTES MODELL: ${gewaehltes.modell.toUpperCase()}`}>
            <ResultGrid>
              <ResultCell
                label="J\u00E4hrlich (1. BJ)"
                amount={formatEuro(gewaehltes.pachtzinsJahr)}
                sub={`Monatlich: ${formatEuro(gewaehltes.pachtzinsMonat)}`}
              />
              <ResultCell
                label={`Summe ${ergebnis.laufzeitJahre} Jahre`}
                amount={formatEuro(gewaehltes.pachtGesamt)}
                sub={`Steigerung: +${formData.steigerungProzent}% ab BJ 11`}
              />
            </ResultGrid>
          </ResultBox>

          {/* Zusatzverg\u00FCtungen */}
          <div style={{ ...styles.card, marginTop: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
              Zus\u00E4tzliche Verg\u00FCtungen
            </div>
            <DetailRow
              label="Vorhalteverg\u00FCtung (vor IBN)"
              value={`${formatEuro(ergebnis.vorhalteverguetung.betragJahr)} / Jahr (${formData.vorhalteProzent}%)`}
            />
            <DetailRow
              label="R\u00FCckbaub\u00FCrgschaft"
              value={formatEuro(ergebnis.rueckbau.buergschaftBetrag)}
            />
          </div>

          {/* Vergleichstabelle */}
          <div style={{ ...styles.card, marginTop: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
              Modellvergleich
            </div>
            {["A", "B", "C"].map((key) => {
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
                    background: formData.gewaehlteModell === key ? MODELL_FARBEN[key] + "20" : "transparent",
                    borderRadius: 4,
                    marginBottom: 2,
                  }}
                >
                  <span style={{ color: COLORS.mid }}>
                    {formData.gewaehlteModell === key && "\u25B6 "}
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
            <DetailRow label="BESS-Fl\u00E4che" value={`${formatZahl(bessFlaecheM2, 0)} m\u00B2`} />
            <DetailRow label="Speicherkapazit\u00E4t" value={`${formatZahl(kapazitaetMwh, 1)} MWh (${formatZahl(kapazitaetMwh * 1000, 0)} kWh)`} />
            <DetailRow label="Leistung" value={`${formatZahl(leistungMw, 1)} MW`} />
            <DetailRow label="Container" value={`${formData.containerAnzahl || 0} Stk.`} />
            <DetailRow label="Technologie" value={formData.technologie} />
            <DetailRow label="Anwendung" value={formData.anwendung} />
            <DetailRow label="Netzanschlussebene" value={formData.netzanschlussEbene} />
            <DetailRow label="Vertragslaufzeit" value={`${ergebnis.laufzeitJahre} Jahre`} />
            <div style={{ height: 2, background: COLORS.yellow, margin: "5px 0" }} />
            {formData.gewaehlteModell === "A" && (
              <DetailRow label="Satz pro m\u00B2" value={`${formData.satzProM2} \u20AC/m\u00B2/J.`} />
            )}
            {formData.gewaehlteModell === "B" && (
              <DetailRow label="Satz pro MWh" value={`${formData.satzProMwh} \u20AC/MWh/J.`} />
            )}
            {formData.gewaehlteModell === "C" && (
              <>
                <DetailRow label="Mindestpacht pro m\u00B2" value={`${formData.mindestProM2} \u20AC/m\u00B2/J.`} />
                <DetailRow label="Kapazit\u00E4tszuschlag pro MWh" value={`${formData.zuschlagProMwh} \u20AC/MWh/J.`} />
              </>
            )}
            <DetailRow label="Steigerung" value={`+${formData.steigerungProzent}% ab Betriebsjahr 11`} />
            <div style={{ height: 2, background: COLORS.dark, margin: "5px 0" }} />
            <DetailRow label="Pacht/Jahr (1. BJ)" value={formatEuro(gewaehltes.pachtzinsJahr)} highlight />
            <DetailRow label="Pacht/Monat" value={formatEuro(gewaehltes.pachtzinsMonat)} highlight />
          </div>

          {exportGesperrt && (
            <div style={{ textAlign: "center", marginTop: 8, padding: "8px 12px", background: "#FFEBEE", borderRadius: 6, color: "#C62828", fontSize: 12.5 }}>
              Export nicht m\u00F6glich \u2013 Pflichtdaten fehlen
            </div>
          )}

          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
            <button style={styles.btnOutline} onClick={() => setActiveTab(3)}>
              \u2190 Modell \u00E4ndern
            </button>
            <button
              style={{ ...styles.btnPrimary, opacity: exportGesperrt ? 0.5 : 1 }}
              onClick={() => handleDocxExport("preisblatt")}
              disabled={isGenerating || exportGesperrt}
            >
              Preisblatt DOCX
            </button>
            <button style={styles.btnBlue} onClick={() => setActiveTab(5)}>
              Vertrag \u2192
            </button>
          </div>
        </>
      )}

      {/* ============================================================ */}
      {/* TAB 5: Vertrag */}
      {/* ============================================================ */}
      {activeTab === 5 && (
        <>
          <Section title="Gestattungsvertrag bearbeiten" icon="\uD83D\uDCDD">
            <ClauseEditor
              klauseln={klauseln}
              setKlauseln={setKlauseln}
              defaultKlauseln={BESS_KLAUSELN}
            />
          </Section>

          {exportGesperrt && (
            <div style={{ textAlign: "center", marginTop: 8, padding: "8px 12px", background: "#FFEBEE", borderRadius: 6, color: "#C62828", fontSize: 12.5 }}>
              Export nicht m\u00F6glich \u2013 Pflichtdaten fehlen
            </div>
          )}

          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
            <button style={styles.btnOutline} onClick={() => setActiveTab(4)}>
              \u2190 Ergebnis
            </button>
            <button
              style={{ ...styles.btnPrimary, fontSize: 14.5, padding: "12px 28px", opacity: exportGesperrt ? 0.5 : 1 }}
              onClick={() => handleDocxExport("vertrag")}
              disabled={isGenerating || exportGesperrt}
            >
              {isGenerating ? "Wird erstellt\u2026" : "\uD83D\uDCC4 Vertrag als DOCX"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
