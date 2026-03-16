import {
  generateDocx,
  createDocxTable,
  createSectionHeading,
  createKeyValueTable,
  createHighlightBox,
} from "../../lib/docxExport";
import { formatEuro, formatDatum, formatZahl } from "../../lib/formatters";
import { Paragraph, TextRun, PageBreak } from "docx";

// ============================================================
// Platzhalter ersetzen
// ============================================================
function ersetzePlatzhalter(text, daten) {
  const map = {
    "{GEMEINDE_NAME}": daten.gemeindeName || "_______________",
    "{GEMEINDE_STRASSE}": daten.gemeindeStrasse || "_______________",
    "{GEMEINDE_PLZ}": daten.gemeindePlz || "_____",
    "{GEMEINDE_ORT}": daten.gemeindeOrt || "_______________",
    "{BUERGERMEISTER_NAME}": daten.buergermeisterName || "_______________",
    "{BUERGERMEISTER_TITEL}": daten.buergermeisterTitel || "Erste/r Bürgermeister/in",
    "{LANDKREIS}": daten.landkreis || "_______________",
    "{PROJEKT_NAME}": daten.projektName || "_______________",
    "{GEMARKUNG}": daten.gemarkung || "_______________",
    "{FLURSTUECKE}": daten.flurstuecke || "___",
    "{LEISTUNG_KWP}": daten.leistungKwp || "___",
    "{MODULE_ANZAHL}": daten.moduleAnzahl || "___",
    "{MODULE_TYP}": daten.moduleTyp || "___",
    "{WR_ANZAHL}": daten.wrAnzahl || "___",
    "{TRAFO_ANZAHL}": daten.trafoAnzahl || "___",
    "{BESS_ANZAHL}": daten.bessAnzahl || "0",
    "{NVP_NAME}": daten.nvpName || "___",
    "{GRUNDSTUECKSFLAECHE_HA}": daten.grundstuecksflaecheHa || "___",
    "{WEG_FLURNR}": daten.wegFlurNr || "___",
    "{BUERGSCHAFT_RUECKBAU}": daten.buergschaftRueckbau || "___",
    "{BUERGSCHAFT_PRO_KWP}": daten.buergschaftProKwp || "6,00",
    "{BUERGSCHAFT_STRASSEN}": daten.buergschaftStrassen || "10.000",
    "{VERWALTUNGSKOSTEN}": daten.verwaltungskosten || "___",
    "{FRIST_RECHTSVERBINDLICH}": daten.fristRechtsverbindlich || "31.12.20__",
    "{BESCHLUSS_DATUM}": daten.beschlussDatum || "__.__.20__",
    // Kommunalbeteiligung
    "{CENT_PRO_KWH}": daten.centProKwh || "0,2",
    "{IBN_ZEITRAUM}": daten.ibnZeitraum || "___",
    "{JAHRESSTROMMENGE_KWH}": daten.jahresstrommenge || "___",
    "{LAUFZEIT_JAHRE}": daten.laufzeitJahre || "20",
    "{IBAN}": daten.iban || "_______________",
    "{BIC}": daten.bic || "_______________",
    "{BANK}": daten.bank || "_______________",
    // Ökologischer Ausgleich
    "{AUSGLEICH_FLURSTUECKE}": daten.ausgleichFlurstuecke || "___",
    "{AUSGLEICH_FLAECHE_HA}": daten.ausgleichFlaecheHa || "___",
    "{MASSNAHMEN_TEXT}": daten.massnahmenText || "(Maßnahmen gemäß Grünordnungsplan)",
    "{FRIST_UMSETZUNG}": daten.fristUmsetzung || "___",
    "{PFLEGEDAUER_JAHRE}": daten.pflegedauerJahre || "5",
    "{MONITORING_INTERVALL}": daten.monitoringIntervall || "jährlich",
    "{BUERGSCHAFT_AUSGLEICH}": daten.buergschaftAusgleich || "___",
  };
  let result = text;
  for (const [key, val] of Object.entries(map)) {
    result = result.replaceAll(key, String(val));
  }
  return result;
}

function buildPlatzhalterDaten(formData) {
  const d = formData;
  const leistung = parseFloat(d.leistungKwp) || 0;
  const buergschaftProKwp = parseFloat(d.buergschaftProKwp) || 6;
  const buergschaftRueckbau = leistung > 0
    ? formatZahl(Math.round(leistung * buergschaftProKwp), 0)
    : "___";

  return {
    gemeindeName: d.gemeindeName || "___",
    gemeindeStrasse: d.gemeindeStrasse || "___",
    gemeindePlz: d.gemeindePlz || "___",
    gemeindeOrt: d.gemeindeOrt || "___",
    buergermeisterName: d.buergermeisterName || "___",
    buergermeisterTitel: d.buergermeisterTitel || "Erste/r Bürgermeister/in",
    landkreis: d.landkreis || "___",
    projektName: d.projektName || "___",
    gemarkung: d.gemarkung || "___",
    flurstuecke: d.flurstuecke || "___",
    leistungKwp: d.leistungKwp || "___",
    moduleAnzahl: d.moduleAnzahl || "___",
    moduleTyp: d.moduleTyp || "___",
    wrAnzahl: d.wrAnzahl || "___",
    trafoAnzahl: d.trafoAnzahl || "___",
    bessAnzahl: d.bessAnzahl || "0",
    nvpName: d.nvpName || "___",
    grundstuecksflaecheHa: d.grundstuecksflaecheHa || "___",
    wegFlurNr: d.wegFlurNr || "___",
    buergschaftRueckbau,
    buergschaftProKwp: String(buergschaftProKwp).replace(".", ","),
    buergschaftStrassen: d.buergschaftStrassen || "10.000",
    verwaltungskosten: d.verwaltungskosten || "___",
    fristRechtsverbindlich: d.fristRechtsverbindlich || "31.12.20__",
    beschlussDatum: d.beschlussDatum || "__.__.20__",
    centProKwh: d.centProKwh || "0,2",
    ibnZeitraum: d.ibnZeitraum || "___",
    jahresstrommenge: d.jahresstrommenge || "___",
    laufzeitJahre: d.laufzeitJahre || "20",
    iban: d.iban || "___",
    bic: d.bic || "___",
    bank: d.bank || "___",
    // Ökologischer Ausgleich
    ausgleichFlurstuecke: d.ausgleichFlurstuecke || "___",
    ausgleichFlaecheHa: d.ausgleichFlaecheHa || "___",
    massnahmenText: d.massnahmenText || "(Maßnahmen gemäß Grünordnungsplan)",
    fristUmsetzung: d.fristUmsetzung || "___",
    pflegedauerJahre: d.pflegedauerJahre || "5",
    monitoringIntervall: d.monitoringIntervall || "jährlich",
    buergschaftAusgleich: d.buergschaftAusgleich
      ? formatEuro(parseFloat(d.buergschaftAusgleich) || 0)
      : "___",
  };
}

// ============================================================
// DURCHFÜHRUNGSVERTRAG EXPORT
// ============================================================
export async function generateDurchfuehrungsvertragDocx(formData, klauseln) {
  const ph = buildPlatzhalterDaten(formData);
  const leistung = parseFloat(formData.leistungKwp) || 0;
  const buergschaftProKwp = parseFloat(formData.buergschaftProKwp) || 6;

  const sections = [];

  // Deckblatt
  sections.push({ type: "spacing", size: 300 });
  sections.push({
    type: "paragraphs",
    items: [
      new Paragraph({
        spacing: { after: 150 },
        children: [
          new TextRun({ text: "DURCHFÜHRUNGSVERTRAG", bold: true, size: 40, font: "DM Sans", color: "1C1C1C" }),
        ],
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ text: "nach § 12 BauGB", size: 26, font: "DM Sans", color: "888888" }),
        ],
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ text: `Sondergebiet Freiflächen-PV-Anlage „${formData.projektName || "___"}"`, size: 24, font: "DM Sans", color: "888888" }),
        ],
      }),
      new Paragraph({
        spacing: { after: 300 },
        children: [
          new TextRun({ text: `der ${formData.gemeindeName || "Gemeinde ___"}`, size: 24, font: "DM Sans", color: "888888" }),
        ],
      }),
    ],
  });

  // Vertragsparteien
  sections.push({ type: "heading", text: "Vertragsparteien" });
  sections.push({
    type: "keyValue",
    entries: [
      ["Gemeinde", formData.gemeindeName || "–"],
      ["Adresse", `${formData.gemeindeStrasse || "–"}, ${formData.gemeindePlz || ""} ${formData.gemeindeOrt || ""}`],
      ["Vertreten durch", `${formData.buergermeisterTitel || "Erste/r Bürgermeister/in"}, ${formData.buergermeisterName || "–"}`],
      ["", ""],
      ["Vorhabenträger", "Elite PV GmbH"],
      ["Adresse", "Lindenhof 4b, 92670 Windischeschenbach"],
      ["Vertreten durch", "Levin Schober, Geschäftsführer"],
    ],
  });
  sections.push({ type: "spacing", size: 200 });

  // Projektdaten
  sections.push({ type: "heading", text: "Projektdaten" });
  sections.push({
    type: "keyValue",
    entries: [
      ["Projektname", formData.projektName || "–"],
      ["Gemarkung", formData.gemarkung || "–"],
      ["Flurstücke", formData.flurstuecke || "–"],
      ["Grundstücksfläche", `ca. ${formData.grundstuecksflaecheHa || "–"} ha`],
      ["Leistung (WR)", `ca. ${formData.leistungKwp || "–"} kWp`],
      ["Module", `ca. ${formData.moduleAnzahl || "–"} (${formData.moduleTyp || "–"})`],
      ["Wechselrichter", `ca. ${formData.wrAnzahl || "–"}`],
      ["Trafostationen", `ca. ${formData.trafoAnzahl || "–"}`],
      ["Batteriespeicher", `ca. ${formData.bessAnzahl || "0"}`],
      ["NVP", formData.nvpName || "–"],
    ],
  });
  sections.push({ type: "spacing", size: 150 });

  // Sicherheitsleistungen
  sections.push({ type: "heading", text: "Sicherheitsleistungen" });
  sections.push({
    type: "table",
    headers: ["Bürgschaft", "Betrag", "Grundlage"],
    rows: [
      ["Rückbau", leistung > 0 ? `${formatEuro(Math.round(leistung * buergschaftProKwp))}` : "–", `${buergschaftProKwp} €/kWp`],
      ["Straßen/Wege", formData.buergschaftStrassen ? `${formatEuro(parseFloat(formData.buergschaftStrassen) || 0)}` : "–", "Pauschal"],
    ],
  });
  sections.push({ type: "spacing", size: 150 });

  sections.push({
    type: "highlight",
    label: "Verwaltungskostenpauschale",
    mainText: formData.verwaltungskosten ? formatEuro(parseFloat(formData.verwaltungskosten) || 0) : "– €",
    subText: "Fällig zum Satzungsbeschluss gemäß § 10 BauGB",
  });
  sections.push({ type: "spacing", size: 200 });

  // Seitenumbruch
  sections.push({ type: "pageBreak" });

  // Klauseln
  const ersetzte = klauseln.map((k) => ({
    ...k,
    text: ersetzePlatzhalter(k.text, ph),
  }));

  const standParagraph = new Paragraph({
    spacing: { before: 400 },
    children: [
      new TextRun({ text: `Stand: ${formatDatum(new Date())}`, size: 18, font: "DM Sans", color: "888888", italics: true }),
    ],
  });

  const gemeindeName = formData.gemeindeName || "Gemeinde";

  await generateDocx({
    title: "DURCHFÜHRUNGSVERTRAG § 12 BauGB",
    subtitle: `${formData.projektName || "PV-Anlage"} | ${gemeindeName} | Elite PV GmbH`,
    sections: [...sections, { type: "paragraphs", items: [standParagraph] }],
    klauseln: ersetzte,
    signatureParties: [`${gemeindeName}\n${formData.buergermeisterName || "Bürgermeister/in"}`, "Elite PV GmbH\nLevin Schober"],
    fileName: `Durchfuehrungsvertrag_${(formData.projektName || "PV").replace(/[\s,]+/g, "_")}_${gemeindeName.replace(/[\s,]+/g, "_")}.docx`,
  });
}

// ============================================================
// KOMMUNALBETEILIGUNG EXPORT
// ============================================================
export async function generateKommunalbeteiligungDocx(formData, klauseln) {
  const ph = buildPlatzhalterDaten(formData);
  const leistung = parseFloat(formData.leistungKwp) || 0;
  const jahresstrommenge = parseFloat(formData.jahresstrommenge) || 0;
  const centProKwh = parseFloat(formData.centProKwh) || 0.2;
  const jahreszuwendung = jahresstrommenge * centProKwh / 100;

  const sections = [];

  // Deckblatt
  sections.push({ type: "spacing", size: 300 });
  sections.push({
    type: "paragraphs",
    items: [
      new Paragraph({
        spacing: { after: 150 },
        children: [
          new TextRun({ text: "VERTRAG ZUR FINANZIELLEN", bold: true, size: 40, font: "DM Sans", color: "1C1C1C" }),
        ],
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ text: "BETEILIGUNG VON KOMMUNEN", bold: true, size: 40, font: "DM Sans", color: "1C1C1C" }),
        ],
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ text: "an Freiflächenanlagen gemäß § 6 Abs. 1 Nr. 2 EEG 2021", size: 24, font: "DM Sans", color: "888888" }),
        ],
      }),
    ],
  });
  sections.push({ type: "spacing", size: 200 });

  // Vertragsparteien
  sections.push({ type: "heading", text: "Vertragsparteien" });
  sections.push({
    type: "keyValue",
    entries: [
      ["Betreiber", "Elite PV GmbH"],
      ["Adresse", "Lindenhof 4b, 92670 Windischeschenbach"],
      ["", ""],
      ["Gemeinde", formData.gemeindeName || "–"],
      ["Vertreten durch", `${formData.buergermeisterTitel || "Bürgermeister/in"} ${formData.buergermeisterName || "–"}`],
    ],
  });
  sections.push({ type: "spacing", size: 200 });

  // Anlagenparameter
  sections.push({ type: "heading", text: "Standort und Parameter der FFAen" });
  sections.push({
    type: "keyValue",
    entries: [
      ["Projektname", formData.projektName || "–"],
      ["Bundesland", "Bayern"],
      ["Landkreis", formData.landkreis || "–"],
      ["Gemeinde", formData.gemeindeName || "–"],
      ["Gemarkung", formData.gemarkung || "–"],
      ["Flurstück(e)", formData.flurstuecke || "–"],
      ["Installierte Leistung", `ca. ${formData.leistungKwp || "–"} kWp`],
      ["Geplante Inbetriebnahme", formData.ibnZeitraum || "–"],
      ["Erwartete Jahresstrommenge", jahresstrommenge > 0 ? `ca. ${formatZahl(jahresstrommenge, 0)} kWh` : "–"],
    ],
  });
  sections.push({ type: "spacing", size: 150 });

  // Zuwendungsberechnung
  sections.push({ type: "heading", text: "Zuwendungsberechnung" });
  sections.push({
    type: "highlight",
    label: `Zuwendung: ${centProKwh} ct/kWh`,
    mainText: jahreszuwendung > 0 ? `${formatEuro(jahreszuwendung)} / Jahr (geschätzt)` : "– €/Jahr",
    subText: jahresstrommenge > 0 ? `${formatZahl(jahresstrommenge, 0)} kWh × ${centProKwh} ct/kWh | Laufzeit: ${formData.laufzeitJahre || 20} Jahre` : "Berechnung nach tatsächlich eingespeister Strommenge",
  });
  sections.push({ type: "spacing", size: 150 });

  // Bankverbindung
  if (formData.iban) {
    sections.push({ type: "heading", text: "Bankverbindung Gemeinde" });
    sections.push({
      type: "keyValue",
      entries: [
        ["Bank", formData.bank || "–"],
        ["IBAN", formData.iban || "–"],
        ["BIC", formData.bic || "–"],
      ],
    });
    sections.push({ type: "spacing", size: 200 });
  }

  // Seitenumbruch
  sections.push({ type: "pageBreak" });

  // Klauseln
  const ersetzte = klauseln.map((k) => ({
    ...k,
    text: ersetzePlatzhalter(k.text, ph),
  }));

  const standParagraph = new Paragraph({
    spacing: { before: 400 },
    children: [
      new TextRun({ text: `Stand: ${formatDatum(new Date())}`, size: 18, font: "DM Sans", color: "888888", italics: true }),
    ],
  });

  const gemeindeName = formData.gemeindeName || "Gemeinde";

  await generateDocx({
    title: "KOMMUNALBETEILIGUNG § 6 EEG",
    subtitle: `${formData.projektName || "FFA"} | ${gemeindeName} | Elite PV GmbH`,
    sections: [...sections, { type: "paragraphs", items: [standParagraph] }],
    klauseln: ersetzte,
    signatureParties: ["Elite PV GmbH (Betreiber)", `${gemeindeName}\n${formData.buergermeisterName || "Bürgermeister/in"}`],
    fileName: `Kommunalbeteiligung_${(formData.projektName || "FFA").replace(/[\s,]+/g, "_")}_${gemeindeName.replace(/[\s,]+/g, "_")}.docx`,
  });
}

// ============================================================
// ÖKOLOGISCHER AUSGLEICH EXPORT
// ============================================================
export async function generateAusgleichsvertragDocx(formData, klauseln) {
  const ph = buildPlatzhalterDaten(formData);
  const buergschaftAusgleich = parseFloat(formData.buergschaftAusgleich) || 0;

  const sections = [];

  // Deckblatt
  sections.push({ type: "spacing", size: 300 });
  sections.push({
    type: "paragraphs",
    items: [
      new Paragraph({
        spacing: { after: 150 },
        children: [
          new TextRun({ text: "VERTRAG ÜBER ÖKOLOGISCHE", bold: true, size: 40, font: "DM Sans", color: "1C1C1C" }),
        ],
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ text: "AUSGLEICHS- UND ERSATZMAßNAHMEN", bold: true, size: 40, font: "DM Sans", color: "1C1C1C" }),
        ],
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ text: "gemäß § 1a BauGB i.V.m. § 15 BNatSchG", size: 24, font: "DM Sans", color: "888888" }),
        ],
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ text: `Freiflächen-PV-Anlage „${formData.projektName || "___"}"`, size: 24, font: "DM Sans", color: "888888" }),
        ],
      }),
      new Paragraph({
        spacing: { after: 300 },
        children: [
          new TextRun({ text: `der ${formData.gemeindeName || "Gemeinde ___"}`, size: 24, font: "DM Sans", color: "888888" }),
        ],
      }),
    ],
  });

  // Vertragsparteien
  sections.push({ type: "heading", text: "Vertragsparteien" });
  sections.push({
    type: "keyValue",
    entries: [
      ["Gemeinde", formData.gemeindeName || "–"],
      ["Adresse", `${formData.gemeindeStrasse || "–"}, ${formData.gemeindePlz || ""} ${formData.gemeindeOrt || ""}`],
      ["Vertreten durch", `${formData.buergermeisterTitel || "Erste/r Bürgermeister/in"}, ${formData.buergermeisterName || "–"}`],
      ["", ""],
      ["Vorhabenträger", "Elite PV GmbH"],
      ["Adresse", "Lindenhof 4b, 92670 Windischeschenbach"],
      ["Vertreten durch", "Levin Schober, Geschäftsführer"],
    ],
  });
  sections.push({ type: "spacing", size: 200 });

  // Vorhabendaten
  sections.push({ type: "heading", text: "Vorhaben" });
  sections.push({
    type: "keyValue",
    entries: [
      ["Projekt", formData.projektName || "–"],
      ["Gemarkung", formData.gemarkung || "–"],
      ["Anlagen-Flurstücke", formData.flurstuecke || "–"],
      ["Anlagenfläche", `ca. ${formData.grundstuecksflaecheHa || "–"} ha`],
      ["Leistung", `ca. ${formData.leistungKwp || "–"} kWp`],
    ],
  });
  sections.push({ type: "spacing", size: 150 });

  // Ausgleichsflächen
  sections.push({ type: "heading", text: "Ausgleichsflächen" });
  sections.push({
    type: "keyValue",
    entries: [
      ["Flurstück(e)", formData.ausgleichFlurstuecke || "–"],
      ["Gesamtfläche", `ca. ${formData.ausgleichFlaecheHa || "–"} ha`],
      ["Gemarkung", formData.gemarkung || "–"],
      ["Zuständige UNB", `Landratsamt ${formData.landkreis || "–"}`],
    ],
  });
  sections.push({ type: "spacing", size: 150 });

  // Maßnahmen-Übersicht
  if (formData.massnahmenText) {
    sections.push({ type: "heading", text: "Maßnahmen-Übersicht" });
    sections.push({
      type: "paragraphs",
      items: [
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({ text: formData.massnahmenText, size: 20, font: "DM Sans", color: "444444" }),
          ],
        }),
      ],
    });
    sections.push({ type: "spacing", size: 150 });
  }

  // Sicherheitsleistung & Pflege
  sections.push({ type: "heading", text: "Sicherheitsleistung & Pflege" });
  sections.push({
    type: "table",
    headers: ["Position", "Wert"],
    rows: [
      ["Bürgschaft Ausgleich", buergschaftAusgleich > 0 ? formatEuro(buergschaftAusgleich) : "–"],
      ["Pflegedauer", `${formData.pflegedauerJahre || "5"} Jahre nach Rückbau`],
      ["Monitoring", formData.monitoringIntervall || "jährlich"],
      ["Frist Umsetzung", formData.fristUmsetzung || "–"],
    ],
  });
  sections.push({ type: "spacing", size: 150 });

  sections.push({
    type: "highlight",
    label: "Bürgschaft ökologischer Ausgleich",
    mainText: buergschaftAusgleich > 0 ? formatEuro(buergschaftAusgleich) : "– €",
    subText: `Pflegedauer: ${formData.pflegedauerJahre || "5"} Jahre | Monitoring: ${formData.monitoringIntervall || "jährlich"}`,
  });
  sections.push({ type: "spacing", size: 200 });

  // Seitenumbruch
  sections.push({ type: "pageBreak" });

  // Klauseln
  const ersetzte = klauseln.map((k) => ({
    ...k,
    text: ersetzePlatzhalter(k.text, ph),
  }));

  const standParagraph = new Paragraph({
    spacing: { before: 400 },
    children: [
      new TextRun({ text: `Stand: ${formatDatum(new Date())}`, size: 18, font: "DM Sans", color: "888888", italics: true }),
    ],
  });

  const gemeindeName = formData.gemeindeName || "Gemeinde";

  await generateDocx({
    title: "ÖKOLOGISCHER AUSGLEICHSVERTRAG",
    subtitle: `${formData.projektName || "PV-Anlage"} | ${gemeindeName} | Elite PV GmbH`,
    sections: [...sections, { type: "paragraphs", items: [standParagraph] }],
    klauseln: ersetzte,
    signatureParties: [`${gemeindeName}\n${formData.buergermeisterName || "Bürgermeister/in"}`, "Elite PV GmbH\nLevin Schober"],
    fileName: `Ausgleichsvertrag_${(formData.projektName || "PV").replace(/[\s,]+/g, "_")}_${gemeindeName.replace(/[\s,]+/g, "_")}.docx`,
  });
}
