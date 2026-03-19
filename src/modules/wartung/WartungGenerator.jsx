import React, { useState, useMemo } from "react";
import { COLORS, styles } from "../../theme";
import { formatEuro, formatProzent } from "../../lib/formatters";
import { clampValue, getWarnung, VALIDIERUNG } from "../../lib/validators";
import { berechneWartung } from "./wartungCalc";
import { DEFAULT_KLAUSELN } from "./wartungClauses";
import { getKlauseln } from "../../lib/klauselStore";
import { TextInput, SelectInput, ToggleButton, NavButtons } from "../../components/FormFields";
import Section from "../../components/Section";
import Steps from "../../components/Steps";
import ResultBox, { ResultGrid, ResultCell } from "../../components/ResultBox";
import DetailRow from "../../components/DetailRow";
import ClauseEditor from "../../components/ClauseEditor";
import WarningBanner from "../../components/WarningBanner";
import { generateWartungDocx } from "./wartungDocxExport";
import { useToast } from "../../components/Toast";
import ProjectSelector from "../../components/ProjectSelector";
import SignaturePad from "../../components/SignaturePad";
import { addVertragToProjekt } from "../../modules/projekte/projektStore";

export default function WartungGenerator() {
  const showToast = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [klauseln, setKlauseln] = useState(
    () => getKlauseln("wartung", DEFAULT_KLAUSELN)
  );

  const [selectedProjekt, setSelectedProjekt] = useState(null);
  const [signaturAuftraggeber, setSignaturAuftraggeber] = useState({ name: "", date: "", data: null });
  const [signaturElitePV, setSignaturElitePV] = useState({ name: "Elite PV GmbH", date: "", data: null });

  const [formData, setFormData] = useState({
    // Kundendaten
    kundenname: "",
    ansprechpartner: "",
    strasse: "",
    plz: "",
    ort: "",
    kundentyp: "Gewerbe",
    // Anlagendaten
    projektname: "",
    leistungKwp: 0,
    modulAnzahl: 0,
    wechselrichterAnzahl: 1,
    flaechenAnzahl: 1,
    unterverteilungen: 1,
    montageart: "Aufdach / Fassade",
    hatSpeicher: false,
    zugang: "Einfach",
    anlagenalter: 0,
    entfernungKm: 0,
    wartungenProJahr: 1,
    // Optionen & Vertrag
    hatMonitoring: false,
    hatThermografie: false,
    hatSLA: false,
    erstlaufzeitMonate: 60,
    preisanpassungProzent: 2.5,
    rabattProzent: 5,
    zahlungsweise: "monatlich",
  });

  const handleProjektSelect = (projekt) => {
    setSelectedProjekt(projekt);
    if (projekt) {
      if (projekt.projektname) setFormData(prev => ({ ...prev, kundenname: projekt.projektname }));
    }
  };

  // Setter mit Validierung
  const updateField = (key) => (value) => {
    const validierteKeys = Object.keys(VALIDIERUNG);
    if (key === "rabattProzent") {
      const clamped = Math.max(0, Math.min(50, Number(value) || 0));
      setFormData((prev) => ({ ...prev, [key]: clamped }));
    } else if (key === "preisanpassungProzent") {
      const clamped = Math.max(0, Math.min(10, Number(value) || 0));
      setFormData((prev) => ({ ...prev, [key]: clamped }));
    } else if (validierteKeys.includes(key)) {
      setFormData((prev) => ({ ...prev, [key]: clampValue(key, value) }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  // Kalkulation – Prozentwerte konvertieren (UI: 5% → Kalk: 0.05)
  const kalkDaten = {
    ...formData,
    rabattAnteil: Math.max(0, Math.min(1, (formData.rabattProzent || 0) / 100)),
    preisanpassung: Math.max(
      0,
      Math.min(0.1, (formData.preisanpassungProzent || 0) / 100)
    ),
  };
  const ergebnis = useMemo(() => berechneWartung(kalkDaten), [
    formData.leistungKwp,
    formData.modulAnzahl,
    formData.wechselrichterAnzahl,
    formData.flaechenAnzahl,
    formData.unterverteilungen,
    formData.montageart,
    formData.hatSpeicher,
    formData.zugang,
    formData.anlagenalter,
    formData.entfernungKm,
    formData.wartungenProJahr,
    formData.hatMonitoring,
    formData.hatThermografie,
    formData.hatSLA,
    formData.erstlaufzeitMonate,
    formData.rabattProzent,
    formData.preisanpassungProzent,
    formData.zahlungsweise,
  ]);
  const warnungen = useMemo(() => getWarnung(formData), [formData]);

  // Pflichtfeld-Fehler (rot, blockieren Export)
  const fehler = [];
  if (!formData.kundenname.trim()) fehler.push("Kundenname fehlt");
  if (!formData.leistungKwp || parseFloat(formData.leistungKwp) === 0) fehler.push("Leistung kWp = 0");

  // Alle Meldungen für Banner
  const alleMeldungen = [...fehler.map(f => "❌ " + f), ...warnungen];

  // Export möglich?
  const exportGesperrt = fehler.length > 0;

  const tabNamen = ["Kunde", "Anlage", "Optionen", "Ergebnis", "Vertrag", "Unterschriften"];

  // DOCX-Export
  const handleDocxExport = async (mitVertrag) => {
    setIsGenerating(true);
    try {
      const exportFormData = {
        ...formData,
        signatureImages: {
          signatureImageA: signaturAuftraggeber.data,
          signatureImageB: signaturElitePV.data,
        },
      };
      await generateWartungDocx(exportFormData, ergebnis, mitVertrag ? klauseln : null);
      const dateiname = mitVertrag ? "Wartungsvertrag" : "Preisblatt_Wartung";
      if (selectedProjekt?.id) {
        addVertragToProjekt(selectedProjekt.id, {
          typ: "Wartung",
          datum: new Date().toISOString(),
          dateiname: dateiname + ".docx",
        });
      }
      showToast("DOCX erfolgreich erstellt!", "success");
    } catch (error) {
      showToast("DOCX-Fehler: " + error.message, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      <Steps
        tabs={tabNamen}
        activeStep={activeTab}
        onStepClick={setActiveTab}
      />

      {/* Warnungen */}
      <WarningBanner warnungen={alleMeldungen} />

      {/* TAB 0: Kundendaten */}
      {activeTab === 0 && (
        <Section title="Kundendaten">
          <ProjectSelector
            onSelect={handleProjektSelect}
            selectedProjektId={selectedProjekt?.id}
          />
          <div style={styles.grid2}>
            <TextInput
              label="Kundenname *"
              value={formData.kundenname}
              onChange={updateField("kundenname")}
              placeholder="Musterkunde GmbH"
            />
            <TextInput
              label="Ansprechpartner"
              value={formData.ansprechpartner}
              onChange={updateField("ansprechpartner")}
            />
            <TextInput
              label="Straße"
              value={formData.strasse}
              onChange={updateField("strasse")}
              placeholder="Musterstr. 1"
            />
            <div style={styles.grid2}>
              <TextInput
                label="PLZ"
                value={formData.plz}
                onChange={updateField("plz")}
              />
              <TextInput
                label="Ort"
                value={formData.ort}
                onChange={updateField("ort")}
              />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <SelectInput
              label="Kundentyp"
              value={formData.kundentyp}
              onChange={updateField("kundentyp")}
              options={["Privat", "Gewerbe", "Industrie"]}
            />
          </div>
          {formData.strasse && formData.ort && (
            <a
              href={`https://www.google.com/maps/dir/Lindenhof+4b+92670+Windischeschenbach/${encodeURIComponent(
                formData.strasse + " " + formData.plz + " " + formData.ort
              )}`}
              target="_blank"
              rel="noreferrer"
              style={{
                ...styles.btnOutline,
                textDecoration: "none",
                fontSize: 11.5,
                marginTop: 10,
                display: "inline-block",
              }}
            >
              🗺️ Google Maps Route
            </a>
          )}
          <NavButtons onNext={() => setActiveTab(1)} />
        </Section>
      )}

      {/* TAB 1: Anlagendaten */}
      {activeTab === 1 && (
        <Section title="Anlagendaten">
          <TextInput
            label="Projektname"
            value={formData.projektname}
            onChange={updateField("projektname")}
            placeholder="PV-Dachanlage"
          />
          <div style={{ ...styles.grid2, marginTop: 8 }}>
            <TextInput
              label="Leistung"
              value={formData.leistungKwp}
              onChange={updateField("leistungKwp")}
              type="number"
              suffix="kWp"
              min={0}
            />
            <TextInput
              label="Module"
              value={formData.modulAnzahl}
              onChange={updateField("modulAnzahl")}
              type="number"
              min={0}
            />
            <TextInput
              label="Wechselrichter"
              value={formData.wechselrichterAnzahl}
              onChange={updateField("wechselrichterAnzahl")}
              type="number"
              min={1}
            />
            <TextInput
              label="Flächen"
              value={formData.flaechenAnzahl}
              onChange={updateField("flaechenAnzahl")}
              type="number"
              min={1}
            />
            <TextInput
              label="Unterverteilungen"
              value={formData.unterverteilungen}
              onChange={updateField("unterverteilungen")}
              type="number"
              min={1}
            />
            <TextInput
              label="Alter"
              value={formData.anlagenalter}
              onChange={updateField("anlagenalter")}
              type="number"
              suffix="J."
              min={0}
            />
            <SelectInput
              label="Montage"
              value={formData.montageart}
              onChange={updateField("montageart")}
              options={["Aufdach / Fassade", "Freifläche / Carport"]}
            />
            <SelectInput
              label="Zugang"
              value={formData.zugang}
              onChange={updateField("zugang")}
              options={["Einfach", "Mittel", "Schwierig"]}
            />
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <ToggleButton
              label="Speicher"
              value={formData.hatSpeicher}
              onChange={updateField("hatSpeicher")}
            />
          </div>
          <div style={{ ...styles.grid2, marginTop: 12 }}>
            <TextInput
              label="Entfernung"
              value={formData.entfernungKm}
              onChange={updateField("entfernungKm")}
              type="number"
              suffix="km"
              min={0}
            />
            <TextInput
              label="Wartungen/Jahr"
              value={formData.wartungenProJahr}
              onChange={updateField("wartungenProJahr")}
              type="number"
              min={1}
            />
          </div>
          <NavButtons
            onPrev={() => setActiveTab(0)}
            onNext={() => setActiveTab(2)}
          />
        </Section>
      )}

      {/* TAB 2: Optionen & Vertrag */}
      {activeTab === 2 && (
        <Section title="Optionen & Vertrag">
          <div
            style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}
          >
            <ToggleButton
              label="Monitoring +120€"
              value={formData.hatMonitoring}
              onChange={updateField("hatMonitoring")}
            />
            <ToggleButton
              label="Thermografie +180€"
              value={formData.hatThermografie}
              onChange={updateField("hatThermografie")}
            />
            <ToggleButton
              label="SLA +240€"
              value={formData.hatSLA}
              onChange={updateField("hatSLA")}
            />
          </div>
          <div style={styles.grid2}>
            <TextInput
              label="Erstlaufzeit"
              value={formData.erstlaufzeitMonate}
              onChange={updateField("erstlaufzeitMonate")}
              type="number"
              suffix="Mon."
              min={1}
            />
            <TextInput
              label="Preisanpassung"
              value={formData.preisanpassungProzent}
              onChange={updateField("preisanpassungProzent")}
              type="number"
              step={0.5}
              suffix="%"
              min={0}
            />
            <TextInput
              label="Rabatt"
              value={formData.rabattProzent}
              onChange={updateField("rabattProzent")}
              type="number"
              step={1}
              suffix="%"
              min={0}
            />
            <SelectInput
              label="Zahlung"
              value={formData.zahlungsweise}
              onChange={updateField("zahlungsweise")}
              options={["monatlich", "jährlich", "SEPA"]}
            />
          </div>
          <NavButtons
            onPrev={() => setActiveTab(1)}
            onNext={() => setActiveTab(3)}
            nextLabel="Ergebnis →"
          />
        </Section>
      )}

      {/* TAB 3: Ergebnis */}
      {activeTab === 3 && (
        <>
          <ResultBox label="SERVICEENTGELT">
            <ResultGrid>
              <ResultCell
                label="Jährlich netto"
                amount={formatEuro(ergebnis.jahresEntgeltNetto)}
                sub={`Brutto: ${formatEuro(ergebnis.jahresEntgeltBrutto)}`}
              />
              <ResultCell
                label="Monatlich netto"
                amount={formatEuro(ergebnis.monatsEntgeltNetto)}
                sub={`Brutto: ${formatEuro(ergebnis.monatsEntgeltBrutto)}`}
              />
            </ResultGrid>
            {ergebnis.rabatt > 0 && (
              <div style={{ marginTop: 8, fontSize: 12, color: COLORS.blue }}>
                ✓ Rabatt {formatProzent(ergebnis.rabatt)}
              </div>
            )}
          </ResultBox>

          <div style={{ ...styles.card, marginTop: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
              Kalkulation
            </div>
            <DetailRow label="Basis/Termin" value={formatEuro(ergebnis.basispreis)} />
            <DetailRow label="kWp-Zuschlag" value={formatEuro(ergebnis.kwpZuschlag)} />
            {ergebnis.wrZuschlag > 0 && (
              <DetailRow label="WR-Zuschlag" value={formatEuro(ergebnis.wrZuschlag)} />
            )}
            {ergebnis.flaechenZuschlag > 0 && (
              <DetailRow label="Flächen-Zuschlag" value={formatEuro(ergebnis.flaechenZuschlag)} />
            )}
            {ergebnis.uvZuschlag > 0 && (
              <DetailRow label="UV-Zuschlag" value={formatEuro(ergebnis.uvZuschlag)} />
            )}
            {ergebnis.speicherZuschlag > 0 && (
              <DetailRow label="Speicher" value={formatEuro(ergebnis.speicherZuschlag)} />
            )}
            <DetailRow label="Technikpreis" value={formatEuro(ergebnis.technikpreis)} />
            <DetailRow label="Fahrtkosten" value={formatEuro(ergebnis.fahrtkosten)} />
            <div style={{ height: 2, background: COLORS.yellow, margin: "5px 0" }} />
            <DetailRow label="Pro Termin" value={formatEuro(ergebnis.preisProTermin)} highlight />
            {ergebnis.monitoringKosten > 0 && (
              <DetailRow label="Monitoring" value={formatEuro(ergebnis.monitoringKosten)} />
            )}
            {ergebnis.thermografieKosten > 0 && (
              <DetailRow label="Thermografie" value={formatEuro(ergebnis.thermografieKosten)} />
            )}
            {ergebnis.slaKosten > 0 && (
              <DetailRow label="SLA" value={formatEuro(ergebnis.slaKosten)} />
            )}
            {ergebnis.rabatt > 0 && (
              <DetailRow label="Rabatt" value={`–${formatProzent(ergebnis.rabatt)}`} />
            )}
            <div style={{ height: 2, background: COLORS.dark, margin: "5px 0" }} />
            <DetailRow
              label="Jahresentgelt netto"
              value={formatEuro(ergebnis.jahresEntgeltNetto)}
              highlight
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              marginTop: 8,
              flexWrap: "wrap",
            }}
          >
            <button style={styles.btnOutline} onClick={() => setActiveTab(0)}>
              ← Bearbeiten
            </button>
            <button
              style={{ ...styles.btnPrimary, opacity: exportGesperrt ? 0.5 : 1 }}
              onClick={() => handleDocxExport(false)}
              disabled={isGenerating || exportGesperrt}
            >
              📄 Preisblatt DOCX
            </button>
            <button style={styles.btnBlue} onClick={() => setActiveTab(4)}>
              📝 Vertrag →
            </button>
          </div>

          {exportGesperrt && (
            <div style={{ ...styles.warnung, textAlign: "center", marginTop: 8, background: "#FFEBEE", borderColor: "#D32F2F", color: "#C62828" }}>
              ⛔ Export nicht möglich – Pflichtdaten fehlen
            </div>
          )}
        </>
      )}

      {/* TAB 4: Vertrag */}
      {activeTab === 4 && (
        <>
          <Section title="Vertrag bearbeiten">
            <ClauseEditor
              klauseln={klauseln}
              setKlauseln={setKlauseln}
              defaultKlauseln={DEFAULT_KLAUSELN}
              storageKey="wartung"
            />
          </Section>

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
              style={{ ...styles.btnPrimary, fontSize: 14.5, padding: "12px 28px", opacity: exportGesperrt ? 0.5 : 1 }}
              onClick={() => handleDocxExport(true)}
              disabled={isGenerating || exportGesperrt}
            >
              {isGenerating ? "Wird erstellt\u2026" : "📄 Vertrag als DOCX"}
            </button>
          </div>

          {exportGesperrt && (
            <div style={{ ...styles.warnung, textAlign: "center", marginTop: 8, background: "#FFEBEE", borderColor: "#D32F2F", color: "#C62828" }}>
              ⛔ Export nicht möglich – Pflichtdaten fehlen
            </div>
          )}
        </>
      )}

      {/* TAB 5: Unterschriften */}
      {activeTab === 5 && (
        <Section title="Unterschriften" icon="✍️">
          <p style={{ fontSize: 12, color: COLORS.mid, marginBottom: 14 }}>
            Optional: Digitale Unterschriften für den Vertrag
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <SignaturePad
              label="Unterschrift Auftraggeber"
              name={signaturAuftraggeber.name}
              onNameChange={(v) => setSignaturAuftraggeber(prev => ({ ...prev, name: v }))}
              date={signaturAuftraggeber.date}
              onDateChange={(v) => setSignaturAuftraggeber(prev => ({ ...prev, date: v }))}
              signatureData={signaturAuftraggeber.data}
              onSignatureChange={(v) => setSignaturAuftraggeber(prev => ({ ...prev, data: v }))}
            />
            <SignaturePad
              label="Unterschrift Elite PV GmbH"
              name={signaturElitePV.name}
              onNameChange={(v) => setSignaturElitePV(prev => ({ ...prev, name: v }))}
              date={signaturElitePV.date}
              onDateChange={(v) => setSignaturElitePV(prev => ({ ...prev, date: v }))}
              signatureData={signaturElitePV.data}
              onSignatureChange={(v) => setSignaturElitePV(prev => ({ ...prev, data: v }))}
            />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
            <button style={styles.btnOutline} onClick={() => setActiveTab(4)}>
              ← Vertrag
            </button>
            <button
              style={{ ...styles.btnPrimary, fontSize: 14.5, padding: "12px 28px", opacity: exportGesperrt ? 0.5 : 1 }}
              onClick={() => handleDocxExport(true)}
              disabled={isGenerating || exportGesperrt}
            >
              {isGenerating ? "Wird erstellt\u2026" : "📄 Vertrag als DOCX"}
            </button>
          </div>
        </Section>
      )}
    </div>
  );
}
