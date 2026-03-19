import React, { useState, useMemo, useRef } from "react";
import { COLORS, styles } from "../../theme";
import { formatEuro, formatZahl } from "../../lib/formatters";
import {
  berechneBESS,
  NETZANSCHLUSS_EBENEN,
  BESS_TECHNOLOGIEN,
} from "./bessCalc";
import { BESS_KLAUSELN } from "./bessClauses";
import { getKlauseln } from "../../lib/klauselStore";
import {
  generateBESSPreisblattDocx,
  generateBESSVertragDocx,
} from "./bessDocxExport";
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
import ProjectSelector from "../../components/ProjectSelector";
import SignaturePad from "../../components/SignaturePad";
import { addVertragToProjekt } from "../../modules/projekte/projektStore";

// ============================================================
// MODELL-KARTE (A–C)
// ============================================================
const MODELL_FARBEN = { A: COLORS.yellow, B: COLORS.blue, C: COLORS.green };

function ModellKarte({ modell, aktiv, onClick, modellKey }) {
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
export default function BESSGenerator() {
  const showToast = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const exportingRef = useRef(false);
  const [klauseln, setKlauseln] = useState(
    () => getKlauseln("bess", BESS_KLAUSELN)
  );

  const [selectedProjekt, setSelectedProjekt] = useState(null);
  const [signaturEigentuemer, setSignaturEigentuemer] = useState({ name: "", date: "", data: null });
  const [signaturBetreiber, setSignaturBetreiber] = useState({ name: "Elite PV GmbH", date: "", data: null });

  const [eigentuemer, setEigentuemer] = useState(createDefaultEigentuemer());
  const [grundbuch, setGrundbuch] = useState(createDefaultGrundbuch());

  const [formData, setFormData] = useState({
    // Grundstück
    grundstueckAdresse: "",
    grundstueckGroesse: "",
    // BESS-Technik
    leistungMw: "",
    kapazitaetMwh: "",
    cRate: "",
    technologie: "Lithium-Eisenphosphat (LFP)",
    netzanschlussEbene: "Hochspannung",
    bessFlaecheM2: "",
    // Brandschutz
    brandschutzAbstand: 10,
    laermEmission: "",
    // Modell A – m²
    satzProM2: 8,
    // Modell B – MW
    satzProMw: 15000,
    // Modell C – Revenue
    zyklenProJahr: 300,
    strompreisEurMwh: 80,
    revenueProzent: 5,
    // Allgemein
    wertsicherungProzent: 10,
    laufzeitJahre: 20,
    vorhalteProzent: 50,
    rueckbauSatzM2: 25,
    gewaehlteModell: "A",
    // Bankdaten
    eigentuemerIban: "",
    eigentuemerBic: "",
    // Zusatz
    zusatzvereinbarungen: "",
  });

  const handleProjektSelect = (projekt) => {
    setSelectedProjekt(projekt);
    if (projekt) {
      if (projekt.eigentuemer) setEigentuemer(projekt.eigentuemer);
      if (projekt.grundbuch) setGrundbuch(projekt.grundbuch);
    }
  };

  const update = (key) => (value) => {
    // Clamping für kritische Felder
    if (key === "wertsicherungProzent") {
      value = Math.max(0, Math.min(10, Number(value) || 0));
    } else if (key === "laufzeitJahre") {
      value = Math.max(1, Math.min(40, Number(value) || 1));
    } else if (["bessFlaecheM2", "leistungMw", "kapazitaetMwh"].includes(key)) {
      const num = Number(value);
      if (!isNaN(num) && num < 0) value = 0;
    }
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Auto C-Rate berechnen
  const leistungMw = parseFloat(formData.leistungMw) || 0;
  const kapazitaetMwh = parseFloat(formData.kapazitaetMwh) || 0;
  const cRate = kapazitaetMwh > 0 ? (leistungMw / kapazitaetMwh).toFixed(2) : "–";
  const bessFlaecheM2 = parseFloat(formData.bessFlaecheM2) || 0;

  // Kalkulation
  const ergebnis = useMemo(() => berechneBESS(formData), [
    formData.bessFlaecheM2,
    formData.leistungMw,
    formData.kapazitaetMwh,
    formData.satzProM2,
    formData.satzProMw,
    formData.zyklenProJahr,
    formData.strompreisEurMwh,
    formData.revenueProzent,
    formData.wertsicherungProzent,
    formData.laufzeitJahre,
    formData.vorhalteProzent,
    formData.rueckbauSatzM2,
    formData.gewaehlteModell,
  ]);

  const gewaehltes = ergebnis[`modell${formData.gewaehlteModell}`];

  // Validierung
  const eigName = (eigentuemer.partner || []).map((p) => p.name).filter(Boolean).join(", ");
  const eigAdresse = (eigentuemer.partner || []).map((p) => p.adresse).filter(Boolean).join(", ")
    || (eigentuemer.eigStrasse && eigentuemer.eigOrt ? `${eigentuemer.eigStrasse}, ${eigentuemer.eigPlz} ${eigentuemer.eigOrt}` : "");
  const hatFlurstück = (grundbuch || []).some((z) => z.flurNr);

  const fehler = [];
  if (!eigName) fehler.push("Eigentümer-Name fehlt");
  if (!eigAdresse) fehler.push("Eigentümer-Adresse fehlt");
  if (bessFlaecheM2 === 0) fehler.push("BESS-Fläche = 0 m²");
  if (!hatFlurstück) fehler.push("Mind. 1 Flurstück erforderlich");

  const warnungen = [];
  if (leistungMw > 0 && leistungMw < 1) warnungen.push("BESS-Leistung < 1 MW – wirtschaftlich fragwürdig");
  if (bessFlaecheM2 > 0 && bessFlaecheM2 < 500) warnungen.push("BESS-Fläche < 500 m² – für Großspeicher ungewöhnlich klein");
  if (parseFloat(cRate) > 4) warnungen.push("C-Rate > 4 – technisch unüblich, bitte prüfen");

  const alleMeldungen = [...fehler.map((f) => "❌ " + f), ...warnungen];
  const exportGesperrt = fehler.length > 0;

  const tabNamen = ["Eigentümer", "Grundstück", "BESS-Technik", "Pachtmodell", "Ergebnis", "Vertrag", "Unterschriften"];

  // DOCX-Export
  const handleDocxExport = async (typ) => {
    if (exportingRef.current) return;
    exportingRef.current = true;
    setIsGenerating(true);
    try {
      const exportData = {
        ...formData,
        eigentuemer,
        grundbuch,
        signatureImages: {
          signatureImageA: signaturEigentuemer.data,
          signatureImageB: signaturBetreiber.data,
        },
      };
      let dateiname;
      if (typ === "preisblatt") {
        await generateBESSPreisblattDocx(exportData, ergebnis);
        dateiname = "Preisblatt_BESS";
      } else {
        await generateBESSVertragDocx(exportData, ergebnis, klauseln);
        dateiname = "Flaechennutzungsvertrag_BESS";
      }
      if (selectedProjekt?.id) {
        addVertragToProjekt(selectedProjekt.id, {
          typ: "BESS",
          datum: new Date().toISOString(),
          dateiname: dateiname + ".docx",
        });
      }
      showToast("DOCX erfolgreich erstellt!", "success");
    } catch (error) {
      showToast("DOCX-Fehler: " + error.message, "error");
    } finally {
      setIsGenerating(false);
      exportingRef.current = false;
    }
  };

  return (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      <Steps tabs={tabNamen} activeStep={activeTab} onStepClick={setActiveTab} />

      <WarningBanner warnungen={alleMeldungen} />

      {/* ============================================================ */}
      {/* TAB 0: Eigentümer */}
      {/* ============================================================ */}
      {activeTab === 0 && (
        <Section title="Grundstückseigentümer" icon="👤">
          <ProjectSelector
            onSelect={handleProjektSelect}
            selectedProjektId={selectedProjekt?.id}
          />
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
          <div style={{ marginTop: 8 }}>
            <TextInput
              label="Grundstücksgröße (gesamt)"
              value={formData.grundstueckGroesse}
              onChange={update("grundstueckGroesse")}
              placeholder="z.B. 5,2 ha oder 12.000 m²"
            />
          </div>

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
        <Section title="BESS-Technische Daten" icon="🔋">
          <div style={styles.grid2}>
            <TextInput
              label="BESS-Leistung"
              value={formData.leistungMw}
              onChange={update("leistungMw")}
              type="number"
              suffix="MW"
              min={0}
            />
            <TextInput
              label="BESS-Kapazität"
              value={formData.kapazitaetMwh}
              onChange={update("kapazitaetMwh")}
              type="number"
              suffix="MWh"
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
              label="Netzanschlussebene"
              value={formData.netzanschlussEbene}
              onChange={update("netzanschlussEbene")}
              options={NETZANSCHLUSS_EBENEN}
            />
          </div>

          <div style={{ ...styles.grid2, marginTop: 10 }}>
            <TextInput
              label="BESS-Fläche (Nutzfläche)"
              value={formData.bessFlaecheM2}
              onChange={update("bessFlaecheM2")}
              type="number"
              suffix="m²"
              min={0}
            />
            <TextInput
              label="Brandschutzabstand"
              value={formData.brandschutzAbstand}
              onChange={update("brandschutzAbstand")}
              type="number"
              suffix="m"
              min={0}
            />
          </div>

          {/* Quick-Info */}
          {leistungMw > 0 && kapazitaetMwh > 0 && (
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
                C-Rate: {cRate} | {leistungMw} MW / {kapazitaetMwh} MWh | {formData.technologie}
              </div>
              {bessFlaecheM2 > 0 && (
                <div style={{ fontSize: 12, color: COLORS.mid, marginTop: 4 }}>
                  Leistungsdichte: {(leistungMw * 1000 / bessFlaecheM2).toFixed(1)} kW/m² | Rückbausicherheit: {formatEuro(bessFlaecheM2 * (parseFloat(formData.rueckbauSatzM2) || 25))}
                </div>
              )}
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
                label="Vertragslaufzeit (Festlaufzeit)"
                value={formData.laufzeitJahre}
                onChange={update("laufzeitJahre")}
                type="number"
                suffix="Jahre"
                min={10}
                max={30}
              />
              <TextInput
                label="Wertsicherung (ab 11. BJ)"
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
                label="Vorhaltevergütung (% vor IBN)"
                value={formData.vorhalteProzent}
                onChange={update("vorhalteProzent")}
                type="number"
                suffix="%"
                min={0}
                max={100}
              />
              <TextInput
                label="Rückbausicherheit"
                value={formData.rueckbauSatzM2}
                onChange={update("rueckbauSatzM2")}
                type="number"
                suffix="€/m²"
                min={0}
              />
            </div>
          </Section>

          {/* Modell A – m² */}
          <Section title="Modell A – Festpacht pro m² BESS-Fläche" icon="🅰️">
            <TextInput
              label="Satz pro m²"
              value={formData.satzProM2}
              onChange={update("satzProM2")}
              type="number"
              suffix="€/m²/J."
              min={1}
            />
            {bessFlaecheM2 > 0 && (
              <div style={{ marginTop: 6, fontSize: 12, color: COLORS.mid }}>
                {bessFlaecheM2} m² × {formData.satzProM2} € = <strong>{formatEuro(ergebnis.modellA.pachtzinsJahr)}/Jahr</strong>
              </div>
            )}
          </Section>

          {/* Modell B – MW */}
          <Section title="Modell B – Festpacht pro MW" icon="🅱️">
            <TextInput
              label="Satz pro MW"
              value={formData.satzProMw}
              onChange={update("satzProMw")}
              type="number"
              suffix="€/MW/J."
              min={5000}
            />
            {leistungMw > 0 && (
              <div style={{ marginTop: 6, fontSize: 12, color: COLORS.mid }}>
                {leistungMw} MW × {formatEuro(formData.satzProMw)} = <strong>{formatEuro(ergebnis.modellB.pachtzinsJahr)}/Jahr</strong>
              </div>
            )}
          </Section>

          {/* Modell C – Revenue Share */}
          <Section title="Modell C – Revenue Share" icon="©️">
            <div style={styles.grid2}>
              <TextInput
                label="Zyklen pro Jahr"
                value={formData.zyklenProJahr}
                onChange={update("zyklenProJahr")}
                type="number"
                suffix="Zyklen"
                min={100}
                max={1000}
              />
              <TextInput
                label="Strompreis"
                value={formData.strompreisEurMwh}
                onChange={update("strompreisEurMwh")}
                type="number"
                suffix="€/MWh"
                min={20}
                max={300}
              />
              <TextInput
                label="Revenue-Anteil"
                value={formData.revenueProzent}
                onChange={update("revenueProzent")}
                type="number"
                suffix="%"
                min={1}
                max={15}
              />
            </div>
            {kapazitaetMwh > 0 && (
              <div style={{ marginTop: 6, fontSize: 12, color: COLORS.mid }}>
                {kapazitaetMwh} MWh × {formData.zyklenProJahr} × {formData.strompreisEurMwh} €/MWh × {formData.revenueProzent}% = <strong>{formatEuro(ergebnis.modellC.pachtzinsJahr)}/Jahr</strong>
              </div>
            )}
          </Section>

          {/* Modellauswahl */}
          <Section title="Modellauswahl" icon="✅">
            <p style={{ fontSize: 12, color: COLORS.mid, marginBottom: 10 }}>
              Wähle das Pachtmodell für den Vertrag:
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
            nextLabel="Ergebnis →"
          />
        </>
      )}

      {/* ============================================================ */}
      {/* TAB 4: Ergebnis */}
      {/* ============================================================ */}
      {activeTab === 4 && (
        <>
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
                sub={`Wertsicherung: +${formData.wertsicherungProzent}% ab 11. BJ`}
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
              value={`${formatEuro(ergebnis.vorhalteverguetung.betragJahr)} / Jahr (${formData.vorhalteProzent}%)`}
            />
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
            {["A", "B", "C"].map((key) => {
              const modell = ergebnis[`modell${key}`];
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
                    {key}: {modell.modell}
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {formatEuro(modell.pachtzinsJahr)}/J. | {formatEuro(modell.pachtGesamt)} ({ergebnis.laufzeitJahre}J.)
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
            <DetailRow label="BESS-Fläche" value={`${bessFlaecheM2} m²`} />
            <DetailRow label="BESS-Leistung" value={`${leistungMw} MW`} />
            <DetailRow label="BESS-Kapazität" value={`${kapazitaetMwh} MWh`} />
            <DetailRow label="C-Rate" value={cRate} />
            <DetailRow label="Technologie" value={formData.technologie} />
            <DetailRow label="Netzanschluss" value={formData.netzanschlussEbene} />
            <DetailRow label="Vertragslaufzeit" value={`${ergebnis.laufzeitJahre} Jahre`} />
            <div style={{ height: 2, background: COLORS.yellow, margin: "5px 0" }} />
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
          <Section title="Flächennutzungsvertrag BESS bearbeiten" icon="📝">
            <ClauseEditor
              klauseln={klauseln}
              setKlauseln={setKlauseln}
              defaultKlauseln={BESS_KLAUSELN}
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

      {/* ============================================================ */}
      {/* TAB 6: Unterschriften */}
      {/* ============================================================ */}
      {activeTab === 6 && (
        <Section title="Unterschriften" icon="✍️">
          <p style={{ fontSize: 12, color: COLORS.mid, marginBottom: 14 }}>
            Optional: Digitale Unterschriften für den Vertrag
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <SignaturePad
              label="Unterschrift Grundstückseigentümer"
              name={signaturEigentuemer.name}
              onNameChange={(v) => setSignaturEigentuemer(prev => ({ ...prev, name: v }))}
              date={signaturEigentuemer.date}
              onDateChange={(v) => setSignaturEigentuemer(prev => ({ ...prev, date: v }))}
              signatureData={signaturEigentuemer.data}
              onSignatureChange={(v) => setSignaturEigentuemer(prev => ({ ...prev, data: v }))}
            />
            <SignaturePad
              label="Unterschrift Betreiber"
              name={signaturBetreiber.name}
              onNameChange={(v) => setSignaturBetreiber(prev => ({ ...prev, name: v }))}
              date={signaturBetreiber.date}
              onDateChange={(v) => setSignaturBetreiber(prev => ({ ...prev, date: v }))}
              signatureData={signaturBetreiber.data}
              onSignatureChange={(v) => setSignaturBetreiber(prev => ({ ...prev, data: v }))}
            />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
            <button style={styles.btnOutline} onClick={() => setActiveTab(5)}>
              ← Vertrag
            </button>
            <button
              style={{ ...styles.btnPrimary, fontSize: 14.5, padding: "12px 28px", opacity: exportGesperrt ? 0.5 : 1 }}
              onClick={() => handleDocxExport("vertrag")}
              disabled={isGenerating || exportGesperrt}
            >
              {isGenerating ? "Wird erstellt…" : "📄 Vertrag als DOCX"}
            </button>
          </div>
        </Section>
      )}
    </div>
  );
}
