import React, { useState, useRef } from "react";
import { COLORS, styles } from "../../theme";
import { formatEuro, formatZahl } from "../../lib/formatters";
import { DURCHFUEHRUNG_KLAUSELN, KOMMUNAL_KLAUSELN, AUSGLEICH_KLAUSELN } from "./bauleitplanungClauses";
import { getKlauseln } from "../../lib/klauselStore";
import {
  generateDurchfuehrungsvertragDocx,
  generateKommunalbeteiligungDocx,
  generateAusgleichsvertragDocx,
} from "./bauleitplanungDocxExport";
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
import WarningBanner from "../../components/WarningBanner";
import { useToast } from "../../components/Toast";
import ProjectSelector from "../../components/ProjectSelector";
import SignaturePad from "../../components/SignaturePad";
import { addVertragToProjekt } from "../../modules/projekte/projektStore";

// ============================================================
// MAIN GENERATOR
// ============================================================
export default function BauleitplanungGenerator() {
  const showToast = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const exportingRef = useRef(false);

  const [selectedProjekt, setSelectedProjekt] = useState(null);
  const [signaturGemeinde, setSignaturGemeinde] = useState({ name: "", date: "", data: null });
  const [signaturVorhabentraeger, setSignaturVorhabentraeger] = useState({ name: "Elite PV GmbH", date: "", data: null });

  // Vertragstyp
  const [vertragstyp, setVertragstyp] = useState("durchfuehrung");

  // Klauseln
  const [dfKlauseln, setDfKlauseln] = useState(
    () => getKlauseln("bauleitplanung_df", DURCHFUEHRUNG_KLAUSELN)
  );
  const [kbKlauseln, setKbKlauseln] = useState(
    () => getKlauseln("bauleitplanung_kb", KOMMUNAL_KLAUSELN)
  );
  const [agKlauseln, setAgKlauseln] = useState(
    () => getKlauseln("bauleitplanung_ag", AUSGLEICH_KLAUSELN)
  );

  // Formulardaten
  const [formData, setFormData] = useState({
    // Gemeinde
    gemeindeName: "",
    gemeindeStrasse: "",
    gemeindePlz: "",
    gemeindeOrt: "",
    buergermeisterName: "",
    buergermeisterTitel: "Erste Bürgermeisterin",
    landkreis: "",
    // Projekt
    projektName: "",
    gemarkung: "",
    flurstuecke: "",
    grundstuecksflaecheHa: "",
    // Anlage
    leistungKwp: "",
    moduleAnzahl: "",
    moduleTyp: "",
    wrAnzahl: "",
    trafoAnzahl: "",
    bessAnzahl: "0",
    nvpName: "",
    wegFlurNr: "",
    // Durchführungsvertrag-spezifisch
    buergschaftProKwp: "6",
    buergschaftStrassen: "10000",
    verwaltungskosten: "2000",
    fristRechtsverbindlich: "31.12.2027",
    beschlussDatum: "",
    // Kommunalbeteiligung-spezifisch
    centProKwh: "0.2",
    ibnZeitraum: "",
    jahresstrommenge: "",
    laufzeitJahre: "20",
    // Bank
    iban: "",
    bic: "",
    bank: "",
    // Ökologischer Ausgleich
    ausgleichFlurstuecke: "",
    ausgleichFlaecheHa: "",
    massnahmenText: "a) Extensivgrünland unter und zwischen Modulreihen: Entwicklung artenreicher Magerwiesen durch 1–2× jährliche Mahd (frühestens ab 15. Juni), Abräumen des Mähguts\nb) Hecken- und Gehölzpflanzungen: Eingrünung des Anlagengeländes mit standortgerechten, heimischen Gehölzen (mind. 3-reihig)\nc) Blühstreifen / Brachestreifen: Randstreifen von mind. 3 m Breite mit regionalem Saatgut (Regiosaatgut)\nd) Nisthilfen / Artenschutz: Installation von Nistkästen für Vögel und Fledermäuse an Zaunpfosten und Trafostationen",
    monitoringIntervall: "jährlich",
    buergschaftAusgleich: "",
    fristUmsetzung: "",
    pflegedauerJahre: "5",
  });

  const update = (key) => (value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleProjektSelect = (projekt) => {
    setSelectedProjekt(projekt);
    if (projekt) {
      if (projekt.standort) setFormData(prev => ({ ...prev, gemeindeName: projekt.standort }));
      if (projekt.projektname) setFormData(prev => ({ ...prev, projektName: projekt.projektname }));
    }
  };

  // Berechnungen
  const leistung = parseFloat(formData.leistungKwp) || 0;
  const buergschaftProKwp = parseFloat(formData.buergschaftProKwp) || 6;
  const buergschaftRueckbau = Math.round(leistung * buergschaftProKwp);
  const buergschaftStrassen = parseFloat(formData.buergschaftStrassen) || 0;
  const verwaltungskosten = parseFloat(formData.verwaltungskosten) || 0;

  const jahresstrommenge = parseFloat(formData.jahresstrommenge) || 0;
  const centProKwh = parseFloat(formData.centProKwh) || 0.2;
  const jahreszuwendung = jahresstrommenge * centProKwh / 100;
  const laufzeitJahre = parseInt(formData.laufzeitJahre) || 20;
  const gesamtzuwendung = jahreszuwendung * laufzeitJahre;

  const buergschaftAusgleich = parseFloat(formData.buergschaftAusgleich) || 0;

  // Warnungen
  const warnungen = [];
  if (!formData.gemeindeName) warnungen.push("Gemeindename fehlt – Pflichtfeld");
  if (!formData.projektName) warnungen.push("Projektname fehlt – Pflichtfeld");
  if (leistung === 0) warnungen.push("Leistung = 0 kWp – Eingabe erforderlich");
  if (vertragstyp === "kommunal" && jahresstrommenge === 0) {
    warnungen.push("Jahresstrommenge fehlt – für Zuwendungsberechnung nötig");
  }
  if (vertragstyp === "ausgleich" && !formData.ausgleichFlurstuecke) {
    warnungen.push("Ausgleichsflurstücke fehlen – Pflichtfeld");
  }

  const exportGesperrt = !formData.gemeindeName || !formData.projektName || leistung === 0;

  const tabNamen = ["Vertragstyp & Gemeinde", "Projekt & Anlage", "Konditionen", "Ergebnis", "Vertrag", "Unterschriften"];

  // Aktive Klauseln
  const aktiveKlauseln =
    vertragstyp === "durchfuehrung" ? dfKlauseln :
    vertragstyp === "kommunal" ? kbKlauseln : agKlauseln;
  const setAktiveKlauseln =
    vertragstyp === "durchfuehrung" ? setDfKlauseln :
    vertragstyp === "kommunal" ? setKbKlauseln : setAgKlauseln;
  const defaultKlauseln =
    vertragstyp === "durchfuehrung" ? DURCHFUEHRUNG_KLAUSELN :
    vertragstyp === "kommunal" ? KOMMUNAL_KLAUSELN : AUSGLEICH_KLAUSELN;

  // DOCX
  const handleDocxExport = async () => {
    if (exportingRef.current) return;
    exportingRef.current = true;
    setIsGenerating(true);
    try {
      const exportFormData = {
        ...formData,
        signatureImages: {
          signatureImageA: signaturGemeinde.data,
          signatureImageB: signaturVorhabentraeger.data,
        },
      };
      let dateiname;
      if (vertragstyp === "durchfuehrung") {
        await generateDurchfuehrungsvertragDocx(exportFormData, aktiveKlauseln);
        dateiname = "Durchfuehrungsvertrag";
      } else if (vertragstyp === "kommunal") {
        await generateKommunalbeteiligungDocx(exportFormData, aktiveKlauseln);
        dateiname = "Kommunalbeteiligung";
      } else {
        await generateAusgleichsvertragDocx(exportFormData, aktiveKlauseln);
        dateiname = "Ausgleichsvertrag";
      }
      if (selectedProjekt?.id) {
        addVertragToProjekt(selectedProjekt.id, {
          typ: "Bauleitplanung",
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

  // Vertragstyp-Karte Helper
  const TypKarte = ({ typ, farbe, titel, beschreibung }) => (
    <div
      onClick={() => setVertragstyp(typ)}
      style={{
        ...styles.card,
        flex: 1,
        minWidth: 180,
        cursor: "pointer",
        borderLeft: `4px solid ${farbe}`,
        background: vertragstyp === typ ? farbe + "12" : COLORS.white,
        outline: vertragstyp === typ ? `2px solid ${farbe}` : "none",
        transition: "all 0.15s",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
        {vertragstyp === typ ? "✓ " : ""}{titel}
      </div>
      <div style={{ fontSize: 11, color: COLORS.mid }}>{beschreibung}</div>
    </div>
  );

  // Vertragstyp-Label
  const vertragstypLabel =
    vertragstyp === "durchfuehrung" ? "DURCHFÜHRUNGSVERTRAG § 12 BauGB" :
    vertragstyp === "kommunal" ? "KOMMUNALBETEILIGUNG § 6 EEG" :
    "ÖKOLOGISCHER AUSGLEICH § 1a BauGB";

  const vertragstypFarbe =
    vertragstyp === "durchfuehrung" ? COLORS.yellow :
    vertragstyp === "kommunal" ? COLORS.green : "#2E7D32";

  return (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      <Steps tabs={tabNamen} activeStep={activeTab} onStepClick={setActiveTab} />
      <WarningBanner warnungen={warnungen} />

      {/* ============================================================ */}
      {/* TAB 0: Vertragstyp & Gemeinde */}
      {/* ============================================================ */}
      {activeTab === 0 && (
        <>
          <Section title="Projekt verknüpfen" icon="📂">
            <ProjectSelector
              onSelect={handleProjektSelect}
              selectedProjektId={selectedProjekt?.id}
            />
          </Section>

          <Section title="Vertragstyp" icon="📑">
            <p style={{ fontSize: 12, color: COLORS.mid, margin: "0 0 10px" }}>
              Wähle den Vertragstyp:
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <TypKarte
                typ="durchfuehrung"
                farbe={COLORS.yellow}
                titel="Durchführungsvertrag"
                beschreibung="§ 12 BauGB – Bauleitplanung, Rückbau, Sicherheitsleistungen"
              />
              <TypKarte
                typ="kommunal"
                farbe={COLORS.green}
                titel="Kommunalbeteiligung"
                beschreibung="§ 6 EEG – Finanzielle Beteiligung an Freiflächenanlagen (0,2 ct/kWh)"
              />
              <TypKarte
                typ="ausgleich"
                farbe="#2E7D32"
                titel="Ökologischer Ausgleich"
                beschreibung="§ 1a BauGB / § 15 BNatSchG – Ausgleichs- und Ersatzmaßnahmen"
              />
            </div>
          </Section>

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
                <TextInput label="PLZ" value={formData.gemeindePlz} onChange={update("gemeindePlz")} />
                <TextInput label="Ort" value={formData.gemeindeOrt} onChange={update("gemeindeOrt")} />
              </div>
            </div>
            <div style={{ ...styles.grid2, marginTop: 8 }}>
              <TextInput
                label="Bürgermeister/in Name"
                value={formData.buergermeisterName}
                onChange={update("buergermeisterName")}
                placeholder="z.B. Marion Höcht"
              />
              <SelectInput
                label="Titel"
                value={formData.buergermeisterTitel}
                onChange={update("buergermeisterTitel")}
                options={["Erste Bürgermeisterin", "Erster Bürgermeister", "Bürgermeisterin", "Bürgermeister"]}
              />
            </div>
            <div style={{ marginTop: 8 }}>
              <TextInput
                label="Landkreis"
                value={formData.landkreis}
                onChange={update("landkreis")}
                placeholder="z.B. Tirschenreuth"
              />
            </div>
          </Section>

          <NavButtons onNext={() => setActiveTab(1)} />
        </>
      )}

      {/* ============================================================ */}
      {/* TAB 1: Projekt & Anlage */}
      {/* ============================================================ */}
      {activeTab === 1 && (
        <>
          <Section title="Projektdaten" icon="📍">
            <TextInput
              label="Projektname"
              value={formData.projektName}
              onChange={update("projektName")}
              placeholder='z.B. Sonnenenergie Trautenberg'
            />
            <div style={{ ...styles.grid2, marginTop: 8 }}>
              <TextInput
                label="Gemarkung"
                value={formData.gemarkung}
                onChange={update("gemarkung")}
                placeholder="z.B. Krummennaab"
              />
              <TextInput
                label="Flurstück-Nr. (Anlage)"
                value={formData.flurstuecke}
                onChange={update("flurstuecke")}
                placeholder="z.B. 128, 129"
              />
            </div>
            <div style={{ ...styles.grid2, marginTop: 8 }}>
              <TextInput
                label="Grundstücksfläche"
                value={formData.grundstuecksflaecheHa}
                onChange={update("grundstuecksflaecheHa")}
                type="number"
                suffix="ha"
                min={0}
              />
              {vertragstyp === "durchfuehrung" && (
                <TextInput
                  label="Erschließungsweg Fl.Nr."
                  value={formData.wegFlurNr}
                  onChange={update("wegFlurNr")}
                  placeholder="z.B. 153"
                />
              )}
            </div>
          </Section>

          <Section title="Anlagenplanung" icon="⚡">
            <div style={styles.grid2}>
              <TextInput
                label="Leistung (WR)"
                value={formData.leistungKwp}
                onChange={update("leistungKwp")}
                type="number"
                suffix="kWp"
                min={0}
              />
              <TextInput
                label="Modulanzahl"
                value={formData.moduleAnzahl}
                onChange={update("moduleAnzahl")}
                type="number"
                min={0}
              />
            </div>
            <div style={{ ...styles.grid2, marginTop: 8 }}>
              <TextInput
                label="Modultyp"
                value={formData.moduleTyp}
                onChange={update("moduleTyp")}
                placeholder="z.B. Longi LR7-72HVDF / 640W"
              />
              <TextInput
                label="Wechselrichter Anzahl"
                value={formData.wrAnzahl}
                onChange={update("wrAnzahl")}
                type="number"
                min={0}
              />
            </div>
            <div style={{ ...styles.grid2, marginTop: 8 }}>
              <TextInput
                label="Trafostationen"
                value={formData.trafoAnzahl}
                onChange={update("trafoAnzahl")}
                type="number"
                min={0}
              />
              <TextInput
                label="Batteriespeicher"
                value={formData.bessAnzahl}
                onChange={update("bessAnzahl")}
                type="number"
                min={0}
              />
            </div>
            <div style={{ marginTop: 8 }}>
              <TextInput
                label="Netzverknüpfungspunkt (NVP)"
                value={formData.nvpName}
                onChange={update("nvpName")}
                placeholder="z.B. Trafostation Eiglasdorf"
              />
            </div>

            {vertragstyp === "kommunal" && (
              <div style={{ ...styles.grid2, marginTop: 8 }}>
                <TextInput
                  label="Geplanter Inbetriebnahmezeitraum"
                  value={formData.ibnZeitraum}
                  onChange={update("ibnZeitraum")}
                  placeholder="z.B. 2025/2027"
                />
                <TextInput
                  label="Erwartete Jahresstrommenge"
                  value={formData.jahresstrommenge}
                  onChange={update("jahresstrommenge")}
                  type="number"
                  suffix="kWh"
                  min={0}
                />
              </div>
            )}
          </Section>

          {/* Ausgleichsflächen – nur bei Ausgleichsvertrag */}
          {vertragstyp === "ausgleich" && (
            <Section title="Ausgleichsflächen" icon="🌿">
              <div style={styles.grid2}>
                <TextInput
                  label="Flurstück(e) Ausgleich"
                  value={formData.ausgleichFlurstuecke}
                  onChange={update("ausgleichFlurstuecke")}
                  placeholder="z.B. 130, 131/2"
                />
                <TextInput
                  label="Ausgleichsfläche"
                  value={formData.ausgleichFlaecheHa}
                  onChange={update("ausgleichFlaecheHa")}
                  type="number"
                  suffix="ha"
                  min={0}
                />
              </div>
            </Section>
          )}

          <NavButtons onPrev={() => setActiveTab(0)} onNext={() => setActiveTab(2)} />
        </>
      )}

      {/* ============================================================ */}
      {/* TAB 2: Konditionen */}
      {/* ============================================================ */}
      {activeTab === 2 && (
        <>
          {vertragstyp === "durchfuehrung" ? (
            <>
              <Section title="Rückbau-Bürgschaft" icon="🏗️">
                <div style={styles.grid2}>
                  <TextInput
                    label="Bürgschaft pro kWp"
                    value={formData.buergschaftProKwp}
                    onChange={update("buergschaftProKwp")}
                    type="number"
                    suffix="€/kWp"
                    min={0}
                  />
                  <TextInput
                    label="Leistung"
                    value={formData.leistungKwp}
                    onChange={update("leistungKwp")}
                    suffix="kWp"
                    disabled
                  />
                </div>
                {buergschaftRueckbau > 0 && (
                  <div
                    style={{
                      marginTop: 10,
                      background: COLORS.lightBlue,
                      borderRadius: 8,
                      padding: "10px 14px",
                      border: "1px solid #dde8f0",
                    }}
                  >
                    <div style={{ fontSize: 11, color: COLORS.mid }}>Rückbau-Bürgschaft</div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.dark }}>
                      {formatEuro(buergschaftRueckbau)}
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.mid }}>
                      {formatZahl(leistung, 0)} kWp × {buergschaftProKwp} €/kWp
                    </div>
                  </div>
                )}
              </Section>

              <Section title="Straßen-Bürgschaft & Verwaltungskosten" icon="💰">
                <div style={styles.grid2}>
                  <TextInput
                    label="Bürgschaft Straßen/Wege"
                    value={formData.buergschaftStrassen}
                    onChange={update("buergschaftStrassen")}
                    type="number"
                    suffix="€"
                    min={0}
                  />
                  <TextInput
                    label="Verwaltungskostenpauschale"
                    value={formData.verwaltungskosten}
                    onChange={update("verwaltungskosten")}
                    type="number"
                    suffix="€"
                    min={0}
                  />
                </div>
              </Section>

              <Section title="Fristen" icon="📅">
                <div style={styles.grid2}>
                  <TextInput
                    label="Frist rechtsverbindlicher B-Plan"
                    value={formData.fristRechtsverbindlich}
                    onChange={update("fristRechtsverbindlich")}
                    placeholder="z.B. 31.12.2027"
                  />
                  <TextInput
                    label="Beschlussdatum Gemeinderat"
                    value={formData.beschlussDatum}
                    onChange={update("beschlussDatum")}
                    placeholder="z.B. 15.06.2025"
                  />
                </div>
              </Section>
            </>
          ) : vertragstyp === "kommunal" ? (
            <>
              <Section title="Zuwendung" icon="💰">
                <div style={styles.grid2}>
                  <TextInput
                    label="Zuwendung"
                    value={formData.centProKwh}
                    onChange={update("centProKwh")}
                    type="number"
                    suffix="ct/kWh"
                    min={0}
                    max={1}
                  />
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
                {jahreszuwendung > 0 && (
                  <div
                    style={{
                      marginTop: 10,
                      background: COLORS.lightBlue,
                      borderRadius: 8,
                      padding: "10px 14px",
                      border: "1px solid #dde8f0",
                    }}
                  >
                    <div style={{ fontSize: 11, color: COLORS.mid }}>Geschätzte Jahreszuwendung</div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.dark }}>
                      {formatEuro(jahreszuwendung)} / Jahr
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.mid }}>
                      {formatZahl(jahresstrommenge, 0)} kWh × {centProKwh} ct/kWh
                    </div>
                  </div>
                )}
              </Section>

              <Section title="Bankverbindung Gemeinde" icon="🏧">
                <TextInput
                  label="IBAN"
                  value={formData.iban}
                  onChange={update("iban")}
                  placeholder="DE00 0000 0000 0000 0000 00"
                />
                <div style={{ ...styles.grid2, marginTop: 8 }}>
                  <TextInput label="BIC" value={formData.bic} onChange={update("bic")} />
                  <TextInput label="Bank" value={formData.bank} onChange={update("bank")} />
                </div>
              </Section>
            </>
          ) : (
            /* Ökologischer Ausgleich */
            <>
              <Section title="Maßnahmen" icon="🌱">
                <p style={{ fontSize: 11, color: COLORS.mid, margin: "0 0 8px" }}>
                  Beschreibe die geplanten Ausgleichs- und Ersatzmaßnahmen. Diese werden in § 3 des Vertrags übernommen.
                </p>
                <textarea
                  style={{
                    ...styles.input,
                    minHeight: 140,
                    resize: "vertical",
                    fontSize: 12.5,
                    lineHeight: 1.5,
                  }}
                  value={formData.massnahmenText}
                  onChange={(e) => update("massnahmenText")(e.target.value)}
                  placeholder="z.B. a) Extensivgrünland unter Modulreihen..."
                />
              </Section>

              <Section title="Sicherheitsleistung & Pflege" icon="🏦">
                <div style={styles.grid2}>
                  <TextInput
                    label="Bürgschaft ökologischer Ausgleich"
                    value={formData.buergschaftAusgleich}
                    onChange={update("buergschaftAusgleich")}
                    type="number"
                    suffix="€"
                    min={0}
                  />
                  <TextInput
                    label="Pflegedauer nach Rückbau"
                    value={formData.pflegedauerJahre}
                    onChange={update("pflegedauerJahre")}
                    type="number"
                    suffix="Jahre"
                    min={1}
                    max={30}
                  />
                </div>
                <div style={{ ...styles.grid2, marginTop: 8 }}>
                  <SelectInput
                    label="Monitoring-Intervall"
                    value={formData.monitoringIntervall}
                    onChange={update("monitoringIntervall")}
                    options={["jährlich", "halbjährlich", "alle 2 Jahre", "alle 3 Jahre"]}
                  />
                  <TextInput
                    label="Frist Umsetzung Maßnahmen"
                    value={formData.fristUmsetzung}
                    onChange={update("fristUmsetzung")}
                    placeholder="z.B. spätestens 12 Monate nach IBN"
                  />
                </div>
              </Section>
            </>
          )}

          <NavButtons onPrev={() => setActiveTab(1)} onNext={() => setActiveTab(3)} nextLabel="Ergebnis →" />
        </>
      )}

      {/* ============================================================ */}
      {/* TAB 3: Ergebnis */}
      {/* ============================================================ */}
      {activeTab === 3 && (
        <>
          <ResultBox label={vertragstypLabel}>
            <ResultGrid>
              {vertragstyp === "durchfuehrung" ? (
                <>
                  <ResultCell
                    label="Rückbau-Bürgschaft"
                    amount={formatEuro(buergschaftRueckbau)}
                    sub={`${buergschaftProKwp} €/kWp × ${formatZahl(leistung, 0)} kWp`}
                  />
                  <ResultCell
                    label="Verwaltungskosten"
                    amount={formatEuro(verwaltungskosten)}
                    sub="Pauschale Bauleitplanverfahren"
                  />
                </>
              ) : vertragstyp === "kommunal" ? (
                <>
                  <ResultCell
                    label="Zuwendung / Jahr"
                    amount={jahreszuwendung > 0 ? formatEuro(jahreszuwendung) : "– €"}
                    sub={`${centProKwh} ct/kWh × ${formatZahl(jahresstrommenge, 0)} kWh`}
                  />
                  <ResultCell
                    label={`Summe ${laufzeitJahre} Jahre`}
                    amount={gesamtzuwendung > 0 ? formatEuro(gesamtzuwendung) : "– €"}
                    sub="Geschätzte Gesamtzuwendung"
                  />
                </>
              ) : (
                <>
                  <ResultCell
                    label="Bürgschaft Ausgleich"
                    amount={buergschaftAusgleich > 0 ? formatEuro(buergschaftAusgleich) : "– €"}
                    sub={`Pflegedauer: ${formData.pflegedauerJahre || "5"} Jahre`}
                  />
                  <ResultCell
                    label="Ausgleichsfläche"
                    amount={`${formData.ausgleichFlaecheHa || "–"} ha`}
                    sub={`Fl.Nr. ${formData.ausgleichFlurstuecke || "–"}`}
                  />
                </>
              )}
            </ResultGrid>
          </ResultBox>

          {/* Vertragspartner */}
          <div style={{ ...styles.card, marginTop: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Vertragsparteien</div>
            <DetailRow label="Gemeinde" value={formData.gemeindeName || "–"} />
            <DetailRow label="Vertreten durch" value={`${formData.buergermeisterTitel || ""} ${formData.buergermeisterName || "–"}`} />
            <div style={{ height: 2, background: COLORS.yellow, margin: "5px 0" }} />
            <DetailRow label={vertragstyp === "kommunal" ? "Betreiber" : "Vorhabenträger"} value="Elite PV GmbH" />
          </div>

          {/* Projektdaten */}
          <div style={{ ...styles.card, marginTop: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Projektdaten</div>
            <DetailRow label="Projekt" value={formData.projektName || "–"} />
            <DetailRow label="Gemarkung" value={formData.gemarkung || "–"} />
            <DetailRow label="Flurstücke" value={formData.flurstuecke || "–"} />
            <DetailRow label="Fläche" value={`ca. ${formData.grundstuecksflaecheHa || "–"} ha`} />
            <DetailRow label="Leistung" value={`ca. ${formData.leistungKwp || "–"} kWp`} />
            <DetailRow label="Module" value={`${formData.moduleAnzahl || "–"} × ${formData.moduleTyp || "–"}`} />
          </div>

          {/* Konditionen */}
          <div style={{ ...styles.card, marginTop: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
              {vertragstyp === "durchfuehrung" ? "Sicherheitsleistungen" :
               vertragstyp === "kommunal" ? "Zuwendungen" : "Ausgleich & Pflege"}
            </div>
            {vertragstyp === "durchfuehrung" ? (
              <>
                <DetailRow label="Rückbau-Bürgschaft" value={formatEuro(buergschaftRueckbau)} highlight />
                <DetailRow label="Straßen-Bürgschaft" value={formatEuro(buergschaftStrassen)} />
                <DetailRow label="Verwaltungskosten" value={formatEuro(verwaltungskosten)} />
                <DetailRow label="Frist B-Plan" value={formData.fristRechtsverbindlich || "–"} />
              </>
            ) : vertragstyp === "kommunal" ? (
              <>
                <DetailRow label="Zuwendungssatz" value={`${centProKwh} ct/kWh`} />
                <DetailRow label="Jahresstrommenge" value={jahresstrommenge > 0 ? `${formatZahl(jahresstrommenge, 0)} kWh` : "–"} />
                <DetailRow label="Zuwendung/Jahr" value={jahreszuwendung > 0 ? formatEuro(jahreszuwendung) : "–"} highlight />
                <DetailRow label={`Summe ${laufzeitJahre} J.`} value={gesamtzuwendung > 0 ? formatEuro(gesamtzuwendung) : "–"} highlight />
                <DetailRow label="Laufzeit" value={`${laufzeitJahre} Jahre`} />
              </>
            ) : (
              <>
                <DetailRow label="Ausgleichsflächen" value={`Fl.Nr. ${formData.ausgleichFlurstuecke || "–"}`} />
                <DetailRow label="Ausgleichsfläche" value={`ca. ${formData.ausgleichFlaecheHa || "–"} ha`} />
                <DetailRow label="Bürgschaft Ausgleich" value={buergschaftAusgleich > 0 ? formatEuro(buergschaftAusgleich) : "–"} highlight />
                <DetailRow label="Pflegedauer" value={`${formData.pflegedauerJahre || "5"} Jahre nach Rückbau`} />
                <DetailRow label="Monitoring" value={formData.monitoringIntervall || "jährlich"} />
                <DetailRow label="Frist Umsetzung" value={formData.fristUmsetzung || "–"} />
                <DetailRow label="UNB" value={`Landratsamt ${formData.landkreis || "–"}`} />
              </>
            )}
          </div>

          {/* Maßnahmen-Vorschau bei Ausgleich */}
          {vertragstyp === "ausgleich" && formData.massnahmenText && (
            <div style={{ ...styles.card, marginTop: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Maßnahmen</div>
              <div style={{ fontSize: 12, color: COLORS.dark, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                {formData.massnahmenText}
              </div>
            </div>
          )}

          {exportGesperrt && (
            <div style={{ ...styles.warnung, textAlign: "center", marginTop: 8 }}>
              ⚠️ Export nicht möglich – Pflichtdaten fehlen
            </div>
          )}

          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
            <button style={styles.btnOutline} onClick={() => setActiveTab(2)}>← Konditionen</button>
            <button style={styles.btnBlue} onClick={() => setActiveTab(4)}>📝 Vertrag →</button>
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
              vertragstyp === "durchfuehrung" ? "Durchführungsvertrag bearbeiten" :
              vertragstyp === "kommunal" ? "Kommunalbeteiligung bearbeiten" :
              "Ausgleichsvertrag bearbeiten"
            }
            icon="📝"
          >
            <div
              style={{
                marginBottom: 12,
                padding: "8px 12px",
                background: vertragstypFarbe + "15",
                borderRadius: 6,
                fontSize: 12,
                color: COLORS.dark,
                border: `1px solid ${vertragstypFarbe}40`,
              }}
            >
              {vertragstyp === "durchfuehrung"
                ? "📋 Durchführungsvertrag nach § 12 BauGB"
                : vertragstyp === "kommunal"
                ? "📋 Kommunalbeteiligung gemäß § 6 Abs. 1 Nr. 2 EEG"
                : "📋 Ökologischer Ausgleichsvertrag gemäß § 1a BauGB i.V.m. § 15 BNatSchG"}
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

          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
            <button style={styles.btnOutline} onClick={() => setActiveTab(3)}>← Ergebnis</button>
            <button
              style={{ ...styles.btnPrimary, fontSize: 14.5, padding: "12px 28px", opacity: exportGesperrt ? 0.5 : 1 }}
              onClick={handleDocxExport}
              disabled={isGenerating || exportGesperrt}
            >
              {isGenerating ? "⏳" : "📄"} Vertrag als DOCX
            </button>
          </div>
        </>
      )}

      {/* ============================================================ */}
      {/* TAB 5: Unterschriften */}
      {/* ============================================================ */}
      {activeTab === 5 && (
        <Section title="Unterschriften" icon="✍️">
          <p style={{ fontSize: 12, color: COLORS.mid, marginBottom: 14 }}>
            Optional: Digitale Unterschriften für den Vertrag
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <SignaturePad
              label="Unterschrift Gemeinde"
              name={signaturGemeinde.name}
              onNameChange={(v) => setSignaturGemeinde(prev => ({ ...prev, name: v }))}
              date={signaturGemeinde.date}
              onDateChange={(v) => setSignaturGemeinde(prev => ({ ...prev, date: v }))}
              signatureData={signaturGemeinde.data}
              onSignatureChange={(v) => setSignaturGemeinde(prev => ({ ...prev, data: v }))}
            />
            <SignaturePad
              label="Unterschrift Vorhabenträger"
              name={signaturVorhabentraeger.name}
              onNameChange={(v) => setSignaturVorhabentraeger(prev => ({ ...prev, name: v }))}
              date={signaturVorhabentraeger.date}
              onDateChange={(v) => setSignaturVorhabentraeger(prev => ({ ...prev, date: v }))}
              signatureData={signaturVorhabentraeger.data}
              onSignatureChange={(v) => setSignaturVorhabentraeger(prev => ({ ...prev, data: v }))}
            />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
            <button style={styles.btnOutline} onClick={() => setActiveTab(4)}>
              ← Vertrag
            </button>
            <button
              style={{ ...styles.btnPrimary, fontSize: 14.5, padding: "12px 28px", opacity: exportGesperrt ? 0.5 : 1 }}
              onClick={handleDocxExport}
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
