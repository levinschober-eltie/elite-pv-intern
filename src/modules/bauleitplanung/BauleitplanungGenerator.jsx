import React, { useState } from "react";
import { COLORS, styles } from "../../theme";
import { formatEuro, formatZahl } from "../../lib/formatters";
import { DURCHFUEHRUNG_KLAUSELN, KOMMUNAL_KLAUSELN } from "./bauleitplanungClauses";
import {
  generateDurchfuehrungsvertragDocx,
  generateKommunalbeteiligungDocx,
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

// ============================================================
// MAIN GENERATOR
// ============================================================
export default function BauleitplanungGenerator() {
  const [activeTab, setActiveTab] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Vertragstyp
  const [vertragstyp, setVertragstyp] = useState("durchfuehrung");

  // Klauseln
  const [dfKlauseln, setDfKlauseln] = useState(
    DURCHFUEHRUNG_KLAUSELN.map((k) => ({ ...k }))
  );
  const [kbKlauseln, setKbKlauseln] = useState(
    KOMMUNAL_KLAUSELN.map((k) => ({ ...k }))
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
  });

  const update = (key) => (value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
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

  // Warnungen
  const warnungen = [];
  if (!formData.gemeindeName) warnungen.push("Gemeindename fehlt – Pflichtfeld");
  if (!formData.projektName) warnungen.push("Projektname fehlt – Pflichtfeld");
  if (leistung === 0) warnungen.push("Leistung = 0 kWp – Eingabe erforderlich");
  if (vertragstyp === "kommunal" && jahresstrommenge === 0) {
    warnungen.push("Jahresstrommenge fehlt – für Zuwendungsberechnung nötig");
  }

  const exportGesperrt = !formData.gemeindeName || !formData.projektName || leistung === 0;

  const tabNamen = ["Vertragstyp & Gemeinde", "Projekt & Anlage", "Konditionen", "Ergebnis", "Vertrag"];

  // Aktive Klauseln
  const aktiveKlauseln = vertragstyp === "durchfuehrung" ? dfKlauseln : kbKlauseln;
  const setAktiveKlauseln = vertragstyp === "durchfuehrung" ? setDfKlauseln : setKbKlauseln;
  const defaultKlauseln = vertragstyp === "durchfuehrung" ? DURCHFUEHRUNG_KLAUSELN : KOMMUNAL_KLAUSELN;

  // DOCX
  const handleDocxExport = async () => {
    setIsGenerating(true);
    try {
      if (vertragstyp === "durchfuehrung") {
        await generateDurchfuehrungsvertragDocx(formData, aktiveKlauseln);
      } else {
        await generateKommunalbeteiligungDocx(formData, aktiveKlauseln);
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
      {/* TAB 0: Vertragstyp & Gemeinde */}
      {/* ============================================================ */}
      {activeTab === 0 && (
        <>
          <Section title="Vertragstyp" icon="📑">
            <p style={{ fontSize: 12, color: COLORS.mid, margin: "0 0 10px" }}>
              Wähle den Vertragstyp:
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div
                onClick={() => setVertragstyp("durchfuehrung")}
                style={{
                  ...styles.card,
                  flex: 1,
                  minWidth: 200,
                  cursor: "pointer",
                  borderLeft: `4px solid ${COLORS.yellow}`,
                  background: vertragstyp === "durchfuehrung" ? COLORS.yellow + "12" : COLORS.white,
                  outline: vertragstyp === "durchfuehrung" ? `2px solid ${COLORS.yellow}` : "none",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                  {vertragstyp === "durchfuehrung" ? "✓ " : ""}Durchführungsvertrag
                </div>
                <div style={{ fontSize: 11, color: COLORS.mid }}>
                  § 12 BauGB – Bauleitplanung, Rückbau, Sicherheitsleistungen
                </div>
              </div>
              <div
                onClick={() => setVertragstyp("kommunal")}
                style={{
                  ...styles.card,
                  flex: 1,
                  minWidth: 200,
                  cursor: "pointer",
                  borderLeft: `4px solid ${COLORS.green}`,
                  background: vertragstyp === "kommunal" ? COLORS.green + "12" : COLORS.white,
                  outline: vertragstyp === "kommunal" ? `2px solid ${COLORS.green}` : "none",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                  {vertragstyp === "kommunal" ? "✓ " : ""}Kommunalbeteiligung
                </div>
                <div style={{ fontSize: 11, color: COLORS.mid }}>
                  § 6 EEG – Finanzielle Beteiligung an Freiflächenanlagen (0,2 ct/kWh)
                </div>
              </div>
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
                label="Flurstück-Nr."
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
          ) : (
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
              vertragstyp === "durchfuehrung"
                ? "DURCHFÜHRUNGSVERTRAG § 12 BauGB"
                : "KOMMUNALBETEILIGUNG § 6 EEG"
            }
          >
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
              ) : (
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
              )}
            </ResultGrid>
          </ResultBox>

          {/* Vertragspartner */}
          <div style={{ ...styles.card, marginTop: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Vertragsparteien</div>
            <DetailRow label="Gemeinde" value={formData.gemeindeName || "–"} />
            <DetailRow label="Vertreten durch" value={`${formData.buergermeisterTitel || ""} ${formData.buergermeisterName || "–"}`} />
            <div style={{ height: 2, background: COLORS.yellow, margin: "5px 0" }} />
            <DetailRow label={vertragstyp === "durchfuehrung" ? "Vorhabenträger" : "Betreiber"} value="Elite PV GmbH" />
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
              {vertragstyp === "durchfuehrung" ? "Sicherheitsleistungen" : "Zuwendungen"}
            </div>
            {vertragstyp === "durchfuehrung" ? (
              <>
                <DetailRow label="Rückbau-Bürgschaft" value={formatEuro(buergschaftRueckbau)} highlight />
                <DetailRow label="Straßen-Bürgschaft" value={formatEuro(buergschaftStrassen)} />
                <DetailRow label="Verwaltungskosten" value={formatEuro(verwaltungskosten)} />
                <DetailRow label="Frist B-Plan" value={formData.fristRechtsverbindlich || "–"} />
              </>
            ) : (
              <>
                <DetailRow label="Zuwendungssatz" value={`${centProKwh} ct/kWh`} />
                <DetailRow label="Jahresstrommenge" value={jahresstrommenge > 0 ? `${formatZahl(jahresstrommenge, 0)} kWh` : "–"} />
                <DetailRow label="Zuwendung/Jahr" value={jahreszuwendung > 0 ? formatEuro(jahreszuwendung) : "–"} highlight />
                <DetailRow label={`Summe ${laufzeitJahre} J.`} value={gesamtzuwendung > 0 ? formatEuro(gesamtzuwendung) : "–"} highlight />
                <DetailRow label="Laufzeit" value={`${laufzeitJahre} Jahre`} />
              </>
            )}
          </div>

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
              vertragstyp === "durchfuehrung"
                ? "Durchführungsvertrag bearbeiten"
                : "Kommunalbeteiligung bearbeiten"
            }
            icon="📝"
          >
            <div
              style={{
                marginBottom: 12,
                padding: "8px 12px",
                background: vertragstyp === "durchfuehrung" ? COLORS.yellow + "15" : COLORS.green + "15",
                borderRadius: 6,
                fontSize: 12,
                color: COLORS.dark,
                border: `1px solid ${vertragstyp === "durchfuehrung" ? COLORS.yellow + "40" : COLORS.green + "40"}`,
              }}
            >
              {vertragstyp === "durchfuehrung"
                ? "📋 Durchführungsvertrag nach § 12 BauGB"
                : "📋 Kommunalbeteiligung gemäß § 6 Abs. 1 Nr. 2 EEG"}
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
    </div>
  );
}
