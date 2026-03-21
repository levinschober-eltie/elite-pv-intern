import React, { useState, useMemo, memo, useRef } from "react";
import { COLORS, styles } from "../../theme";
import { formatEuro, formatZahl } from "../../lib/formatters";
import {
  berechneDachpacht,
  berechneKwpAusFlaeche,
  DACHTYPEN,
  DACH_MATERIALIEN,
  STATIK_OPTIONEN,
  GEBAEUDE_TYPEN,
  AUSRICHTUNGEN,
} from "./dachpachtCalc";
import { DACHPACHT_KLAUSELN } from "./dachpachtClauses";
import { getKlauseln } from "../../lib/klauselStore";
import {
  generateDachpachtPreisblattDocx,
  generateDachpachtVertragDocx,
} from "./dachpachtDocxExport";
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
import LandRegisterFields, { createDefaultGrundbuch } from "../../components/LandRegisterFields";
import WarningBanner from "../../components/WarningBanner";
import { useToast } from "../../components/Toast";
import ProjectSelector from "../../components/ProjectSelector";
import SignaturePad from "../../components/SignaturePad";
import { addVertragToProjekt } from "../../modules/projekte/projektStore";

// ============================================================
// MODELL-KARTE
// ============================================================
const ModellKarte = memo(function ModellKarte({ modell, aktiv, onClick, nr }) {
  const farben = { 1: COLORS.yellow, 2: COLORS.blue, 3: COLORS.green };
  const farbe = farben[nr] || COLORS.yellow;
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
          {aktiv ? "✓ " : ""}Modell {nr}: {modell.modell}
        </span>
        {aktiv && (
          <span
            style={{
              background: farbe,
              color: nr === 1 ? COLORS.dark : COLORS.white,
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
          <div style={{ fontSize: 10, color: COLORS.mid, textTransform: "uppercase" }}>Jahr</div>
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
          <div style={{ fontSize: 10, color: COLORS.mid, textTransform: "uppercase" }}>20 Jahre</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.dark }}>
            {formatEuro(modell.pachtzins20Jahre)}
          </div>
        </div>
      </div>
    </div>
  );
});

// ============================================================
// MAIN GENERATOR
// ============================================================
export default function DachpachtGenerator() {
  const showToast = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const exportingRef = useRef(false);
  const [klauseln, setKlauseln] = useState(
    () => getKlauseln("dachpacht", DACHPACHT_KLAUSELN)
  );

  const [selectedProjekt, setSelectedProjekt] = useState(null);
  const [signaturVerpachter, setSignaturVerpachter] = useState({ name: "", date: "", data: null });
  const [signaturPachter, setSignaturPachter] = useState({ name: "Elite PV GmbH", date: "", data: null });

  const [eigentuemer, setEigentuemer] = useState(createDefaultEigentuemer());
  const [grundbuch, setGrundbuch] = useState(createDefaultGrundbuch());

  const [formData, setFormData] = useState({
    // Gebäude
    gebaeudeAdresse: "",
    gebaeudeTyp: "Gewerbe",
    baujahr: "",
    etagen: "",
    // Dachfläche
    bruttoDachflaeche: "",
    nutzbareDachflaeche: "",
    nutzbarManuell: false,
    dachneigung: 15,
    ausrichtung: "Süd",
    dachtyp: "Satteldach Süd",
    dachMaterial: "Trapezblech",
    statik: "Ausstehend",
    // Pachtmodell-Parameter
    leistungKwp: "",
    leistungManuell: false,
    satzProKwp: 30,
    preisanpassung1: 1.5,
    spezifischerErtrag: 950,
    strompreisCentKwh: 8,
    ertragsProzentsatz: 5,
    preisanpassung2: 1.5,
    satzProM2: 5,
    preisanpassung3: 1.5,
    laufzeitJahre: 20,
    gewaehlteModell: 1,
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
    if (["preisanpassung1", "preisanpassung2", "preisanpassung3"].includes(key)) {
      value = Math.max(0, Math.min(10, Number(value) || 0));
    } else if (key === "laufzeitJahre") {
      value = Math.max(1, Math.min(40, Number(value) || 1));
    } else if (["bruttoDachflaeche", "nutzbareDachflaeche", "leistungKwp"].includes(key)) {
      const num = Number(value);
      if (!isNaN(num) && num < 0) value = 0;
    }
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Nutzbare Fläche auto-berechnen (80% von Brutto)
  const nutzbareFlaeche = formData.nutzbarManuell
    ? parseFloat(formData.nutzbareDachflaeche) || 0
    : Math.round((parseFloat(formData.bruttoDachflaeche) || 0) * 0.8);

  // kWp auto-berechnen
  const autoKwp = berechneKwpAusFlaeche(nutzbareFlaeche, formData.dachtyp);
  const effektivKwp = formData.leistungManuell
    ? parseFloat(formData.leistungKwp) || 0
    : autoKwp;

  // Kalkulation
  const ergebnis = useMemo(() => {
    const kalkulationsDaten = {
      ...formData,
      nutzbareDachflaeche: nutzbareFlaeche,
      leistungKwp: effektivKwp,
      eigentuemer,
      grundbuch,
    };
    return berechneDachpacht(kalkulationsDaten);
  }, [
    nutzbareFlaeche,
    effektivKwp,
    formData.satzProKwp,
    formData.preisanpassung1,
    formData.spezifischerErtrag,
    formData.strompreisCentKwh,
    formData.ertragsProzentsatz,
    formData.preisanpassung2,
    formData.satzProM2,
    formData.preisanpassung3,
    formData.laufzeitJahre,
    formData.dachtyp,
  ]);

  const gewaehltes = ergebnis[`modell${formData.gewaehlteModell}`] || ergebnis.modell1 || {};

  // Validierung
  const eigName = (eigentuemer.partner || []).map(p => p.name).filter(Boolean).join(", ");
  const eigAdresse = (eigentuemer.partner || []).map(p => p.adresse).filter(Boolean).join(", ")
    || (eigentuemer.eigStrasse && eigentuemer.eigOrt ? `${eigentuemer.eigStrasse}, ${eigentuemer.eigPlz} ${eigentuemer.eigOrt}` : "");
  const hatFlurstück = (grundbuch || []).some(z => z.flurNr);

  // Pflichtfeld-Fehler (rot, blockieren Export)
  const fehler = [];
  if (!eigName) fehler.push("Eigentümer-Name fehlt");
  if (!eigAdresse) fehler.push("Eigentümer-Adresse fehlt");
  if (nutzbareFlaeche === 0) fehler.push("Dachfläche = 0 m²");
  if (!hatFlurstück) fehler.push("Mind. 1 Flurstück erforderlich");

  // Warnungen (gelb, blockieren Export nicht)
  const warnungen = [];
  if (nutzbareFlaeche > 0 && nutzbareFlaeche < 100) warnungen.push("Nutzbare Fläche < 100 m² – wirtschaftlich fragwürdig");
  if (nutzbareFlaeche > 3000) warnungen.push("Nutzbare Fläche > 3.000 m² – Plausibilität prüfen");
  if (effektivKwp > 0 && effektivKwp < 30) warnungen.push("Leistung < 30 kWp – Dachpacht ggf. unwirtschaftlich");
  if (formData.ausrichtung === "Nord") warnungen.push("Nord-Ausrichtung – geringe Erträge erwartet");
  if (formData.statik === "Ausstehend") warnungen.push("Statikprüfung steht noch aus – vor Vertragsschluss klären");
  if (!formData.gewaehlteModell) warnungen.push("Kein Pachtmodell gewählt");

  // Alle Meldungen für Banner
  const alleMeldungen = [...fehler.map(f => "❌ " + f), ...warnungen];

  // Export möglich?
  const exportGesperrt = fehler.length > 0;

  const tabNamen = ["Eigentümer", "Gebäude", "Dachfläche", "Pachtmodell", "Ergebnis", "Vertrag", "Unterschriften"];

  // DOCX-Export
  const handleDocxExport = async (typ) => {
    if (exportingRef.current) return;
    exportingRef.current = true;
    setIsGenerating(true);
    try {
      const exportData = {
        ...formData,
        nutzbareDachflaeche: nutzbareFlaeche,
        leistungKwp: effektivKwp,
        eigentuemer,
        grundbuch,
        signatureImages: {
          signatureImageA: signaturVerpachter.data,
          signatureImageB: signaturPachter.data,
        },
      };
      let dateiname;
      if (typ === "preisblatt") {
        await generateDachpachtPreisblattDocx(exportData, ergebnis);
        dateiname = "Preisblatt_Dachpacht";
      } else {
        await generateDachpachtVertragDocx(exportData, ergebnis, klauseln);
        dateiname = "Nutzungsvertrag_Dachpacht";
      }
      if (selectedProjekt?.id) {
        addVertragToProjekt(selectedProjekt.id, {
          typ: "Dachpacht",
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
        <Section title="Eigentümer / Verpächter" icon="👤">
          <ProjectSelector
            onSelect={handleProjektSelect}
            selectedProjektId={selectedProjekt?.id}
          />
          <OwnerFields eigentuemer={eigentuemer} onChange={setEigentuemer} />
          <NavButtons onNext={() => setActiveTab(1)} />
        </Section>
      )}

      {/* ============================================================ */}
      {/* TAB 1: Gebäude */}
      {/* ============================================================ */}
      {activeTab === 1 && (
        <Section title="Gebäudedaten" icon="🏢">
          <TextInput
            label="Gebäudeadresse (ggf. abweichend)"
            value={formData.gebaeudeAdresse}
            onChange={update("gebaeudeAdresse")}
            placeholder="Straße, PLZ Ort"
          />
          <div style={{ ...styles.grid2, marginTop: 8 }}>
            <SelectInput
              label="Gebäudetyp"
              value={formData.gebaeudeTyp}
              onChange={update("gebaeudeTyp")}
              options={GEBAEUDE_TYPEN}
            />
            <TextInput
              label="Baujahr"
              value={formData.baujahr}
              onChange={update("baujahr")}
              placeholder="z.B. 1995"
            />
            <TextInput
              label="Etagen"
              value={formData.etagen}
              onChange={update("etagen")}
              type="number"
              min={1}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <LandRegisterFields zeilen={grundbuch} onChange={setGrundbuch} />
          </div>

          <NavButtons onPrev={() => setActiveTab(0)} onNext={() => setActiveTab(2)} />
        </Section>
      )}

      {/* ============================================================ */}
      {/* TAB 2: Dachfläche */}
      {/* ============================================================ */}
      {activeTab === 2 && (
        <Section title="Dachfläche" icon="📐">
          <div style={styles.grid2}>
            <TextInput
              label="Brutto-Dachfläche"
              value={formData.bruttoDachflaeche}
              onChange={update("bruttoDachflaeche")}
              type="number"
              suffix="m²"
              min={0}
            />
            <div>
              <TextInput
                label={formData.nutzbarManuell ? "Nutzbare Fläche (manuell)" : "Nutzbare Fläche (auto: 80%)"}
                value={formData.nutzbarManuell ? formData.nutzbareDachflaeche : nutzbareFlaeche}
                onChange={update("nutzbareDachflaeche")}
                type="number"
                suffix="m²"
                min={0}
                disabled={!formData.nutzbarManuell}
              />
              <label
                style={{ fontSize: 10.5, color: COLORS.mid, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}
              >
                <input
                  type="checkbox"
                  checked={formData.nutzbarManuell}
                  onChange={(e) => update("nutzbarManuell")(e.target.checked)}
                />
                Manuell eingeben
              </label>
            </div>
          </div>

          <div style={{ ...styles.grid2, marginTop: 10 }}>
            <TextInput
              label="Dachneigung"
              value={formData.dachneigung}
              onChange={update("dachneigung")}
              type="number"
              suffix="°"
              min={0}
              max={60}
            />
            <SelectInput
              label="Ausrichtung"
              value={formData.ausrichtung}
              onChange={update("ausrichtung")}
              options={AUSRICHTUNGEN}
            />
            <SelectInput
              label="Dachtyp"
              value={formData.dachtyp}
              onChange={update("dachtyp")}
              options={DACHTYPEN}
            />
            <SelectInput
              label="Dachmaterial"
              value={formData.dachMaterial}
              onChange={update("dachMaterial")}
              options={DACH_MATERIALIEN}
            />
            <SelectInput
              label="Statik"
              value={formData.statik}
              onChange={update("statik")}
              options={STATIK_OPTIONEN}
            />
          </div>

          {/* Auto-berechnete kWp Anzeige */}
          {nutzbareFlaeche > 0 && (
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
                Auto-Berechnung: {formData.dachtyp} → 1 kWp pro {
                  { Flachdach: 10, "Satteldach Süd": 6, "Satteldach SO/SW": 7, "Satteldach O/W": 8, Pultdach: 7 }[formData.dachtyp] || 8
                } m²
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.dark }}>
                ≈ {autoKwp.toFixed(1)} kWp aus {nutzbareFlaeche} m² nutzbarer Fläche
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
          {/* Leistung & Laufzeit */}
          <Section title="Anlagenparameter" icon="⚡">
            <div style={styles.grid2}>
              <div>
                <TextInput
                  label={formData.leistungManuell ? "Leistung (manuell)" : `Leistung (auto: ${autoKwp.toFixed(1)} kWp)`}
                  value={formData.leistungManuell ? formData.leistungKwp : autoKwp.toFixed(1)}
                  onChange={update("leistungKwp")}
                  type="number"
                  suffix="kWp"
                  min={0}
                  disabled={!formData.leistungManuell}
                />
                <label
                  style={{ fontSize: 10.5, color: COLORS.mid, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}
                >
                  <input
                    type="checkbox"
                    checked={formData.leistungManuell}
                    onChange={(e) => update("leistungManuell")(e.target.checked)}
                  />
                  Manuell eingeben
                </label>
              </div>
              <TextInput
                label="Vertragslaufzeit"
                value={formData.laufzeitJahre}
                onChange={update("laufzeitJahre")}
                type="number"
                suffix="Jahre"
                min={5}
                max={40}
              />
            </div>
          </Section>

          {/* Modell 1 */}
          <Section title="Modell 1 – Festpacht pro kWp" icon="1️⃣">
            <div style={styles.grid2}>
              <TextInput
                label="Satz pro kWp"
                value={formData.satzProKwp}
                onChange={update("satzProKwp")}
                type="number"
                suffix="€/kWp"
                min={15}
                max={60}
              />
              <TextInput
                label="Preisanpassung"
                value={formData.preisanpassung1}
                onChange={update("preisanpassung1")}
                type="number"
                suffix="% p.a."
                min={0}
                max={5}
              />
            </div>
            <div style={{ marginTop: 6, fontSize: 12, color: COLORS.mid }}>
              {effektivKwp.toFixed(1)} kWp × {formData.satzProKwp} € = <strong>{formatEuro(ergebnis.modell1.pachtzinsJahr)}/Jahr</strong>
            </div>
          </Section>

          {/* Modell 2 */}
          <Section title="Modell 2 – Ertragsabhängige Pacht" icon="2️⃣">
            <div style={styles.grid2}>
              <TextInput
                label="Spez. Ertrag"
                value={formData.spezifischerErtrag}
                onChange={update("spezifischerErtrag")}
                type="number"
                suffix="kWh/kWp"
                min={700}
                max={1200}
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
                max={8}
              />
              <TextInput
                label="Preisanpassung"
                value={formData.preisanpassung2}
                onChange={update("preisanpassung2")}
                type="number"
                suffix="% p.a."
                min={0}
                max={5}
              />
            </div>
            <div style={{ marginTop: 6, fontSize: 12, color: COLORS.mid }}>
              {formatZahl(ergebnis.modell2.jahresertragKwh, 0)} kWh × {formData.strompreisCentKwh} ct × {formData.ertragsProzentsatz}% = <strong>{formatEuro(ergebnis.modell2.pachtzinsJahr)}/Jahr</strong>
            </div>
          </Section>

          {/* Modell 3 */}
          <Section title="Modell 3 – Festpacht pro m²" icon="3️⃣">
            <div style={styles.grid2}>
              <TextInput
                label="Satz pro m²"
                value={formData.satzProM2}
                onChange={update("satzProM2")}
                type="number"
                suffix="€/m²/J."
                min={2}
                max={10}
              />
              <TextInput
                label="Preisanpassung"
                value={formData.preisanpassung3}
                onChange={update("preisanpassung3")}
                type="number"
                suffix="% p.a."
                min={0}
                max={5}
              />
            </div>
            <div style={{ marginTop: 6, fontSize: 12, color: COLORS.mid }}>
              {nutzbareFlaeche} m² × {formData.satzProM2} € = <strong>{formatEuro(ergebnis.modell3.pachtzinsJahr)}/Jahr</strong>
            </div>
          </Section>

          {/* Modellauswahl */}
          <Section title="Modellauswahl" icon="✅">
            <p style={{ fontSize: 12, color: COLORS.mid, marginBottom: 10 }}>
              Wähle das Pachtmodell für den Vertrag:
            </p>
            <ModellKarte
              modell={ergebnis.modell1}
              nr={1}
              aktiv={formData.gewaehlteModell === 1}
              onClick={() => update("gewaehlteModell")(1)}
            />
            <ModellKarte
              modell={ergebnis.modell2}
              nr={2}
              aktiv={formData.gewaehlteModell === 2}
              onClick={() => update("gewaehlteModell")(2)}
            />
            <ModellKarte
              modell={ergebnis.modell3}
              nr={3}
              aktiv={formData.gewaehlteModell === 3}
              onClick={() => update("gewaehlteModell")(3)}
            />
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
                label="Jährlich"
                amount={formatEuro(gewaehltes.pachtzinsJahr)}
                sub={`Monatlich: ${formatEuro(gewaehltes.pachtzinsMonat)}`}
              />
              <ResultCell
                label={`Summe ${ergebnis.laufzeitJahre} Jahre`}
                amount={formatEuro(gewaehltes.pachtzins20Jahre)}
                sub={`Preisanpassung: ${gewaehltes.preisanpassungProzent}% p.a.`}
              />
            </ResultGrid>
          </ResultBox>

          {/* Vergleichstabelle */}
          <div style={{ ...styles.card, marginTop: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
              Modellvergleich
            </div>
            {[ergebnis.modell1, ergebnis.modell2, ergebnis.modell3].map((m) => (
              <div
                key={m.modellNr}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: m.modellNr === formData.gewaehlteModell ? "6px 8px" : "6px 0",
                  borderBottom: "1px solid #f0f0f0",
                  fontSize: 12.5,
                  background: m.modellNr === formData.gewaehlteModell ? COLORS.yellow + "20" : "transparent",
                  borderRadius: 4,
                  marginBottom: 2,
                }}
              >
                <span style={{ color: COLORS.mid }}>
                  {m.modellNr === formData.gewaehlteModell && "▶ "}
                  M{m.modellNr}: {m.modell}
                </span>
                <span style={{ fontWeight: 600 }}>
                  {formatEuro(m.pachtzinsJahr)}/J. | {formatEuro(m.pachtzins20Jahre)} ({ergebnis.laufzeitJahre}J.)
                </span>
              </div>
            ))}
          </div>

          {/* Kalkulation Detail */}
          <div style={{ ...styles.card, marginTop: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
              Kalkulationsdetails
            </div>
            <DetailRow label="Nutzbare Dachfläche" value={`${nutzbareFlaeche} m²`} />
            <DetailRow label="Dachtyp" value={formData.dachtyp} />
            <DetailRow label="PV-Leistung" value={`${effektivKwp.toFixed(1)} kWp`} />
            <DetailRow label="Vertragslaufzeit" value={`${ergebnis.laufzeitJahre} Jahre`} />
            <div style={{ height: 2, background: COLORS.yellow, margin: "5px 0" }} />
            {formData.gewaehlteModell === 1 && (
              <>
                <DetailRow label="Satz pro kWp" value={`${formData.satzProKwp} €/kWp`} />
                <DetailRow label="Preisanpassung" value={`${formData.preisanpassung1}% p.a.`} />
              </>
            )}
            {formData.gewaehlteModell === 2 && (
              <>
                <DetailRow label="Spez. Ertrag" value={`${formData.spezifischerErtrag} kWh/kWp`} />
                <DetailRow label="Jahresertrag" value={`${formatZahl(ergebnis.modell2.jahresertragKwh, 0)} kWh`} />
                <DetailRow label="Strompreis" value={`${formData.strompreisCentKwh} ct/kWh`} />
                <DetailRow label="Beteiligung" value={`${formData.ertragsProzentsatz}%`} />
                <DetailRow label="Preisanpassung" value={`${formData.preisanpassung2}% p.a.`} />
              </>
            )}
            {formData.gewaehlteModell === 3 && (
              <>
                <DetailRow label="Satz pro m²" value={`${formData.satzProM2} €/m²/Jahr`} />
                <DetailRow label="Preisanpassung" value={`${formData.preisanpassung3}% p.a.`} />
              </>
            )}
            <div style={{ height: 2, background: COLORS.dark, margin: "5px 0" }} />
            <DetailRow label="Pachtzins/Jahr" value={formatEuro(gewaehltes.pachtzinsJahr)} highlight />
            <DetailRow label="Pachtzins/Monat" value={formatEuro(gewaehltes.pachtzinsMonat)} highlight />
          </div>

          {exportGesperrt && (
            <div style={{ ...styles.warnung, textAlign: "center", marginTop: 8, background: "#FFEBEE", borderColor: "#D32F2F", color: "#C62828" }}>
              ⛔ Export nicht möglich – Pflichtdaten fehlen
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
              ← Modell ändern
            </button>
            <button
              style={{ ...styles.btnPrimary, opacity: exportGesperrt ? 0.5 : 1 }}
              onClick={() => handleDocxExport("preisblatt")}
              disabled={isGenerating || exportGesperrt}
            >
              📄 Preisblatt DOCX
            </button>
            <button style={styles.btnBlue} onClick={() => setActiveTab(5)}>
              📝 Vertrag →
            </button>
          </div>
        </>
      )}

      {/* ============================================================ */}
      {/* TAB 5: Vertrag */}
      {/* ============================================================ */}
      {activeTab === 5 && (
        <>
          <Section title="Nutzungsvertrag bearbeiten" icon="📝">
            <ClauseEditor
              klauseln={klauseln}
              setKlauseln={setKlauseln}
              defaultKlauseln={DACHPACHT_KLAUSELN}
            />
          </Section>

          {exportGesperrt && (
            <div style={{ ...styles.warnung, textAlign: "center", marginTop: 8, background: "#FFEBEE", borderColor: "#D32F2F", color: "#C62828" }}>
              ⛔ Export nicht möglich – Pflichtdaten fehlen
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
            <button style={styles.btnOutline} onClick={() => setActiveTab(4)}>
              ← Ergebnis
            </button>
            <button
              style={{ ...styles.btnPrimary, fontSize: 14.5, padding: "12px 28px", opacity: exportGesperrt ? 0.5 : 1 }}
              onClick={() => handleDocxExport("vertrag")}
              disabled={isGenerating || exportGesperrt}
            >
              {isGenerating ? "Wird erstellt\u2026" : "📄 Vertrag als DOCX"}
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
              label="Unterschrift Verpächter"
              name={signaturVerpachter.name}
              onNameChange={(v) => setSignaturVerpachter(prev => ({ ...prev, name: v }))}
              date={signaturVerpachter.date}
              onDateChange={(v) => setSignaturVerpachter(prev => ({ ...prev, date: v }))}
              signatureData={signaturVerpachter.data}
              onSignatureChange={(v) => setSignaturVerpachter(prev => ({ ...prev, data: v }))}
            />
            <SignaturePad
              label="Unterschrift Pächter"
              name={signaturPachter.name}
              onNameChange={(v) => setSignaturPachter(prev => ({ ...prev, name: v }))}
              date={signaturPachter.date}
              onDateChange={(v) => setSignaturPachter(prev => ({ ...prev, date: v }))}
              signatureData={signaturPachter.data}
              onSignatureChange={(v) => setSignaturPachter(prev => ({ ...prev, data: v }))}
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
