import {
  generateDocx,
  generiereVertragsnummer,
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
    "{EIGENTUEMER_NAME}": daten.eigentuemerName || "_______________",
    "{EIGENTUEMER_ADRESSE}": daten.eigentuemerAdresse || "_______________",
    "{EIGENTUEMER_TYP}": daten.eigentuemerTyp || "Alleineigentümer",
    "{GRUNDBUCH_TABELLE}": daten.grundbuchText || "(siehe Anlage)",
    "{GRUNDSTUECK_GROESSE}": daten.grundstueckGroesse || "___",
    "{BESS_FLAECHE_M2}": daten.bessFlaecheM2 || "___",
    "{LEISTUNG_MW}": daten.leistungMw || "___",
    "{KAPAZITAET_MWH}": daten.kapazitaetMwh || "___",
    "{SATZ_PRO_M2}": daten.satzProM2 || "___",
    "{WERTSICHERUNG}": daten.wertsicherung || "10",
    "{VORHALTE_PROZENT}": daten.vorhalteProzent || "50",
    "{RUECKBAU_BETRAG}": daten.rueckbauBetrag || "___",
    "{LAUFZEIT_JAHRE}": daten.laufzeitJahre || "20",
    "{VERTRAGSNUMMER}": daten.vertragsnummer || "___",
    "{VERTRAGSDATUM}": daten.vertragsdatum || formatDatum(new Date()),
    "{GESCHAEFTSFUEHRER}": "Levin Schober",
    "{EIGENTUEMER_IBAN}": daten.eigentuemerIban || "________________________",
    "{EIGENTUEMER_BIC}": daten.eigentuemerBic || "____________",
    "{ZUSATZVEREINBARUNGEN}": daten.zusatzvereinbarungen || "(keine)",
  };

  let result = text;
  for (const [key, val] of Object.entries(map)) {
    result = result.replaceAll(key, String(val));
  }
  return result;
}

// ============================================================
// Eigentümer-Daten aufbereiten
// ============================================================
function buildDaten(formData, ergebnis) {
  const eig = formData.eigentuemer || {};
  const partner = eig.partner || [];
  const name = partner.map((p) => p.name).filter(Boolean).join(", ") || "___";
  const adresse =
    eig.eigStrasse && eig.eigOrt
      ? `${eig.eigStrasse}, ${eig.eigPlz} ${eig.eigOrt}`
      : partner.length > 0 && partner[0].adresse
      ? partner[0].adresse
      : "_______________";

  const eigTypMap = {
    Einzelperson: "Alleineigentümer",
    Ehepaar: "Miteigentümer",
    Erbengemeinschaft: "Sonstiges (Erbengemeinschaft)",
    GbR: "Sonstiges (GbR)",
    GmbH: "Sonstiges (GmbH)",
    Sonstige: "Sonstiges",
  };
  const eigentuemerTyp = eigTypMap[eig.typ] || "Alleineigentümer";

  const gb = formData.grundbuch || [];
  const grundbuchText = gb
    .map(
      (z) =>
        `Grundbuchamt: ${z.grundbuchamt || "–"} | Blatt: ${z.gbBlatt || "–"} | Gemarkung: ${z.gemarkung || "–"} | Flst.: ${z.flurNr || "–"}`
    )
    .join("\n");

  return {
    eigentuemerName: name,
    eigentuemerAdresse: adresse,
    eigentuemerTyp,
    grundbuchText,
    grundstueckGroesse: formData.grundstueckGroesse || "___",
    bessFlaecheM2: String(ergebnis.bessFlaecheM2 || "___"),
    leistungMw: String(ergebnis.leistungMw || "___"),
    kapazitaetMwh: String(ergebnis.kapazitaetMwh || "___"),
    satzProM2: String(formData.satzProM2 || "8").replace(".", ","),
    wertsicherung: String(formData.wertsicherungProzent || 10),
    vorhalteProzent: String(formData.vorhalteProzent || 50),
    rueckbauBetrag: ergebnis.rueckbau ? formatEuro(ergebnis.rueckbau.buergschaftBetrag) : "–",
    laufzeitJahre: String(ergebnis.laufzeitJahre || 20),
    vertragsnummer: generiereVertragsnummer("EPV-BESS"),
    vertragsdatum: formatDatum(new Date()),
    eigentuemerIban: formData.eigentuemerIban || "________________________",
    eigentuemerBic: formData.eigentuemerBic || "____________",
    zusatzvereinbarungen: formData.zusatzvereinbarungen || "(keine)",
  };
}

// ============================================================
// PREISBLATT EXPORT
// ============================================================
export async function generateBESSPreisblattDocx(formData, ergebnis) {
  const { modellA, modellB, modellC, vorhalteverguetung, rueckbau } = ergebnis;
  const gewaehltes = ergebnis[`modell${formData.gewaehlteModell || "A"}`];

  const eig = formData.eigentuemer || {};
  const partner = eig.partner || [];
  const name = partner.map((p) => p.name).filter(Boolean).join(", ") || "–";

  const sections = [];

  // Vertragsparteien
  sections.push({ type: "heading", text: "Vertragsparteien" });
  sections.push({
    type: "keyValue",
    entries: [
      ["Grundstückseigentümer", name],
      ["Eigentümertyp", eig.typ || "–"],
      ["Grundstücksnutzer", "Elite PV GmbH"],
    ],
  });
  sections.push({ type: "spacing", size: 150 });

  // BESS-Daten
  sections.push({ type: "heading", text: "BESS-Technische Daten" });
  sections.push({
    type: "keyValue",
    entries: [
      ["BESS-Leistung", `${formData.leistungMw || 0} MW`],
      ["BESS-Kapazität", `${formData.kapazitaetMwh || 0} MWh`],
      ["C-Rate", ergebnis.kapazitaetMwh > 0 ? (ergebnis.leistungMw / ergebnis.kapazitaetMwh).toFixed(2) : "–"],
      ["Technologie", formData.technologie || "–"],
      ["BESS-Fläche", `${formData.bessFlaecheM2 || 0} m²`],
      ["Netzanschluss", formData.netzanschlussEbene || "–"],
    ],
  });
  sections.push({ type: "spacing", size: 150 });

  // Modellvergleich
  sections.push({ type: "heading", text: "Pachtmodell-Vergleich" });
  sections.push({
    type: "table",
    headers: ["Modell", "Pacht/Jahr (1. Jahr)", `Summe ${ergebnis.laufzeitJahre} J.`],
    rows: [
      [
        `${formData.gewaehlteModell === "A" ? "▶ " : ""}A: Festpacht/m²`,
        formatEuro(modellA.pachtzinsJahr),
        formatEuro(modellA.pachtGesamt),
      ],
      [
        `${formData.gewaehlteModell === "B" ? "▶ " : ""}B: Festpacht/MW`,
        formatEuro(modellB.pachtzinsJahr),
        formatEuro(modellB.pachtGesamt),
      ],
      [
        `${formData.gewaehlteModell === "C" ? "▶ " : ""}C: Revenue Share`,
        formatEuro(modellC.pachtzinsJahr),
        formatEuro(modellC.pachtGesamt),
      ],
    ],
  });
  sections.push({ type: "spacing", size: 150 });

  // Gewähltes Modell
  sections.push({
    type: "highlight",
    label: `GEWÄHLTES MODELL: ${gewaehltes.modell}`,
    mainText: `${formatEuro(gewaehltes.pachtzinsJahr)} / Jahr (1. Jahr)`,
    subText: `Summe über ${ergebnis.laufzeitJahre} Jahre: ${formatEuro(gewaehltes.pachtGesamt)}`,
  });
  sections.push({ type: "spacing", size: 150 });

  // Zusätzliche Vergütungen
  sections.push({ type: "heading", text: "Zusätzliche Vergütungen" });
  sections.push({
    type: "keyValue",
    entries: [
      ["Vorhaltevergütung", `${formatEuro(vorhalteverguetung.betragJahr)} / Jahr (${formData.vorhalteProzent || 50}% vor IBN)`],
      ["Rückbaubürgschaft", `${formatEuro(rueckbau.buergschaftBetrag)} (${ergebnis.bessFlaecheM2} m² × ${formData.rueckbauSatzM2 || 25} €/m²)`],
    ],
  });

  await generateDocx({
    title: "PREISBLATT BESS",
    subtitle: `Batteriespeicher | ${name} | Elite PV GmbH`,
    sections,
    fileName: `Preisblatt_BESS_${(name || "Kunde").replace(/[\s,]+/g, "_")}_Elite_PV.docx`,
  });
}

// ============================================================
// VERTRAG EXPORT
// ============================================================
export async function generateBESSVertragDocx(formData, ergebnis, klauseln) {
  const gewaehltes = ergebnis[`modell${formData.gewaehlteModell || "A"}`];
  const platzhalterDaten = buildDaten(formData, ergebnis);

  const eig = formData.eigentuemer || {};
  const partner = eig.partner || [];
  const name = partner.map((p) => p.name).filter(Boolean).join(", ") || "–";

  const sections = [];

  // Deckblatt
  sections.push({ type: "spacing", size: 400 });
  sections.push({
    type: "paragraphs",
    items: [
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "FLÄCHENNUTZUNGSVERTRAG",
            bold: true,
            size: 44,
            font: "DM Sans",
            color: "1C1C1C",
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: "zum Zwecke der Installation und des Betriebes",
            size: 26,
            font: "DM Sans",
            color: "888888",
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 300 },
        children: [
          new TextRun({
            text: "eines Batteriespeichersystems (BESS)",
            size: 26,
            font: "DM Sans",
            color: "888888",
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: `Vertragsnummer: ${platzhalterDaten.vertragsnummer}`,
            size: 20,
            font: "DM Sans",
            color: "4AB4D4",
            bold: true,
          }),
        ],
      }),
    ],
  });

  // Vertragsparteien
  sections.push({ type: "heading", text: "Vertragsparteien" });
  const parteiEntries = [
    ["Grundstückseigentümer", name],
    ["Adresse", platzhalterDaten.eigentuemerAdresse],
  ];
  if (eig.vertretenDurch) {
    parteiEntries.push(["Vertreten durch", eig.vertretenDurch]);
  }
  parteiEntries.push(["", ""]);
  parteiEntries.push(["Grundstücksnutzer", "Elite PV GmbH"]);
  parteiEntries.push(["Adresse", "Lindenhof 4b, 92670 Windischeschenbach"]);
  parteiEntries.push(["Geschäftsführer", "Levin Schober"]);
  sections.push({ type: "keyValue", entries: parteiEntries });
  sections.push({ type: "spacing", size: 200 });

  // BESS-Daten
  sections.push({ type: "heading", text: "BESS-Daten" });
  sections.push({
    type: "keyValue",
    entries: [
      ["BESS-Leistung", `${ergebnis.leistungMw || 0} MW`],
      ["BESS-Kapazität", `${ergebnis.kapazitaetMwh || 0} MWh`],
      ["C-Rate", ergebnis.kapazitaetMwh > 0 ? (ergebnis.leistungMw / ergebnis.kapazitaetMwh).toFixed(2) : "–"],
      ["Technologie", formData.technologie || "–"],
      ["BESS-Fläche", `${ergebnis.bessFlaecheM2 || 0} m²`],
      ["Netzanschluss", formData.netzanschlussEbene || "–"],
    ],
  });
  sections.push({ type: "spacing", size: 100 });

  // Grundbuch-Tabelle
  const gb = formData.grundbuch || [];
  if (gb.length > 0 && gb[0].grundbuchamt) {
    sections.push({ type: "heading", text: "Grundbuchdaten" });
    sections.push({
      type: "table",
      headers: ["Grundbuchamt", "Band", "Blatt", "Gemarkung", "Flst.", "Gesamt (ha)", "Pacht (ha)"],
      rows: gb.map((z) => [
        z.grundbuchamt || "–",
        z.gbBand || "–",
        z.gbBlatt || "–",
        z.gemarkung || "–",
        z.flurNr || "–",
        z.gesamtflaecheHa || "–",
        z.pachtflaecheHa || "–",
      ]),
    });
    sections.push({ type: "spacing", size: 200 });
  }

  // Inhaltsverzeichnis
  sections.push({ type: "heading", text: "Inhaltsverzeichnis" });
  sections.push({ type: "keyValue", entries: klauseln.map((k) => [k.titel, ""]) });
  sections.push({ type: "pageBreak" });

  // Vergütungsübersicht
  sections.push({ type: "heading", text: "Vergütungsübersicht" });
  sections.push({
    type: "highlight",
    label: `Gewähltes Modell: ${gewaehltes.modell}`,
    mainText: `${formatEuro(gewaehltes.pachtzinsJahr)} / Jahr (1. Betriebsjahr)`,
    subText: `Summe über ${ergebnis.laufzeitJahre} Jahre: ${formatEuro(gewaehltes.pachtGesamt)}`,
  });
  sections.push({ type: "spacing", size: 100 });

  sections.push({
    type: "keyValue",
    entries: [
      ["Vorhaltevergütung", `${formatEuro(ergebnis.vorhalteverguetung.betragJahr)} / Jahr`],
      ["Rückbaubürgschaft", `${formatEuro(ergebnis.rueckbau.buergschaftBetrag)}`],
    ],
  });
  sections.push({ type: "spacing", size: 200 });

  // Klauseln mit Platzhaltern
  const ersetzte = klauseln.map((k) => ({
    ...k,
    text: ersetzePlatzhalter(k.text, platzhalterDaten),
  }));

  // Anlagenverzeichnis
  const anlagenParagraphs = [
    new Paragraph({
      spacing: { before: 300, after: 120 },
      children: [
        new TextRun({
          text: "ANLAGENVERZEICHNIS",
          bold: true,
          size: 24,
          font: "DM Sans",
          color: "1C1C1C",
        }),
      ],
    }),
    ...[
      "Anlage 1 – Vorläufiger Lageplan",
      "Anlage 2 – Grundbuchauszug",
      "Anlage 3 – Vollmacht Einholung Grundbuchauszug",
      "Anlage 4 – Muster Bestellungsurkunde Dienstbarkeit",
      "Anlage 5 – Muster Bestellung Vormerkung",
    ].map(
      (a) =>
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: a,
              size: 20,
              font: "DM Sans",
              color: "444444",
            }),
          ],
        })
    ),
  ];

  const standParagraph = new Paragraph({
    spacing: { before: 400 },
    children: [
      new TextRun({
        text: `${platzhalterDaten.vertragsnummer} | Stand: ${formatDatum(new Date())}`,
        size: 18,
        font: "DM Sans",
        color: "888888",
        italics: true,
      }),
    ],
  });

  await generateDocx({
    title: "FLÄCHENNUTZUNGSVERTRAG BESS",
    subtitle: `${name} | Elite PV GmbH`,
    sections: [
      ...sections,
      { type: "paragraphs", items: anlagenParagraphs },
      { type: "paragraphs", items: [standParagraph] },
    ],
    klauseln: ersetzte,
    signatureParties: ["Elite PV GmbH (Grundstücksnutzer)", `${name} (Grundstückseigentümer)`],
    signatureImages: formData.signatureImages,
    fileName: `Flaechennutzungsvertrag_BESS_${(name || "Kunde").replace(/[\s,]+/g, "_")}_Elite_PV.docx`,
  });
}
