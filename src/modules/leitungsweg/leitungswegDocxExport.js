import {
  generateDocx,
  createDocxTable,
  createSectionHeading,
  createKeyValueTable,
  createHighlightBox,
} from "../../lib/docxExport";
import { formatEuro, formatDatum } from "../../lib/formatters";
import { Paragraph, TextRun, PageBreak } from "docx";

// ============================================================
// Platzhalter im Klauseltext ersetzen
// ============================================================
function ersetzePlatzhalter(text, daten) {
  const map = {
    // Gemeinde
    "{GEMEINDE_NAME}": daten.gemeindeName || "_______________",
    "{GEMEINDE_ADRESSE}": daten.gemeindeAdresse || "_______________",
    "{LANDKREIS}": daten.landkreis || "_______________",
    "{FLURSTUECKE_GEMEINDE}": daten.flurstueckeGemeinde || "_______________",
    "{GERICHTSSTAND}": daten.gerichtsstand || "_______________",
    "{BUERGSCHAFT_BETRAG}": daten.buergschaftBetrag || "___",
    "{BUERGSCHAFT_PROZENT}": daten.buergschaftProzent || "20",
    // Privat
    "{EIGENTUEMER_NAME}": daten.eigentuemerName || "_______________",
    "{EIGENTUEMER_ADRESSE}": daten.eigentuemerAdresse || "_______________",
    "{GRUNDBUCHAMT}": daten.grundbuchamt || "_______________",
    "{GRUNDBUCH_BLATT}": daten.grundbuchBlatt || "___",
    "{GEMARKUNG}": daten.gemarkung || "_______________",
    "{FLURSTUECK_NR}": daten.flurstueckNr || "_______________",
    // Shared
    "{EE_ANLAGE_NAME}": daten.eeAnlageName || "_______________",
    "{EE_ANLAGE_KOORDINATEN}": daten.eeAnlageKoordinaten || "_______________",
    "{NVP_NAME}": daten.nvpName || "_______________",
    "{NVP_KOORDINATEN}": daten.nvpKoordinaten || "_______________",
    "{SCHUTZZONE_BREITE}": daten.schutzzoneBreite || "1",
    "{TRASSENLAENGE}": daten.trassenlaenge || "___",
    "{ENTSCHAEDIGUNG_PRO_METER}": daten.entschaedigungProMeter || "___",
    "{ENTSCHAEDIGUNG_GESAMT}": daten.entschaedigungGesamt || "___",
    "{BEWIRTSCHAFTUNGSAUSFALL}": daten.bewirtschaftungsausfall || "0",
    "{IBAN}": daten.iban || "_______________",
    "{BIC}": daten.bic || "_______________",
    "{BANK}": daten.bank || "_______________",
    "{ZUSATZVEREINBARUNGEN}": daten.zusatzvereinbarungen || "(keine)",
  };

  let result = text;
  for (const [key, val] of Object.entries(map)) {
    result = result.replaceAll(key, String(val));
  }
  return result;
}

// ============================================================
// Gemeinsame Platzhalter-Daten zusammenbauen
// ============================================================
function buildPlatzhalterDaten(formData) {
  const d = formData;

  // Flurstücke-Text für Gemeinde
  const flurstueckeText = (d.flurstuecke || [])
    .map((f) => `${f.flurNr || "___"} Gmk. ${f.gemarkung || "___"}`)
    .filter((t) => !t.includes("___"))
    .join(" und ") || "_______________";

  // Eigentümer-Daten
  const eig = d.eigentuemer || {};
  const partner = eig.partner || [];
  const eigName = partner.map((p) => p.name).filter(Boolean).join(", ") || "___";
  const eigAdresse =
    eig.eigStrasse && eig.eigOrt
      ? `${eig.eigStrasse}, ${eig.eigPlz} ${eig.eigOrt}`
      : partner.length > 0 && partner[0].adresse
      ? partner[0].adresse
      : "_______________";

  // Grundbuch-Daten (erstes Flurstück)
  const erstesFlurstueck = (d.flurstuecke || [])[0] || {};

  const entschaedigungGesamt =
    (parseFloat(d.trassenlaenge) || 0) * (parseFloat(d.entschaedigungProMeter) || 0);

  return {
    // Gemeinde
    gemeindeName: d.gemeindeName || "___",
    gemeindeAdresse: d.gemeindeStrasse
      ? `${d.gemeindeStrasse}, ${d.gemeindePlz} ${d.gemeindeOrt}`
      : "___",
    landkreis: d.landkreis || "___",
    flurstueckeGemeinde: flurstueckeText,
    gerichtsstand: d.gerichtsstand || d.gemeindeOrt || "___",
    buergschaftBetrag: d.buergschaftBetrag || "___",
    buergschaftProzent: d.buergschaftProzent || "20",
    // Privat
    eigentuemerName: eigName,
    eigentuemerAdresse: eigAdresse,
    grundbuchamt: erstesFlurstueck.grundbuchamt || "___",
    grundbuchBlatt: erstesFlurstueck.blattNr || "___",
    gemarkung: erstesFlurstueck.gemarkung || "___",
    flurstueckNr: (d.flurstuecke || []).map((f) => f.flurNr).filter(Boolean).join(", ") || "___",
    // Shared
    eeAnlageName: d.eeAnlageName || "___",
    eeAnlageKoordinaten: d.eeAnlageKoordinaten || "___",
    nvpName: d.nvpName || "___",
    nvpKoordinaten: d.nvpKoordinaten || "___",
    schutzzoneBreite: d.schutzzoneBreite || "1",
    trassenlaenge: d.trassenlaenge || "___",
    entschaedigungProMeter: d.entschaedigungProMeter || "___",
    entschaedigungGesamt: entschaedigungGesamt > 0 ? formatEuro(entschaedigungGesamt) : "___",
    bewirtschaftungsausfall:
      d.bewirtschaftungsausfall ? formatEuro(parseFloat(d.bewirtschaftungsausfall) || 0) : "0,00 €",
    iban: d.iban || "___",
    bic: d.bic || "",
    bank: d.bank || "___",
    zusatzvereinbarungen: d.zusatzvereinbarungen || "(keine)",
  };
}

// ============================================================
// GEMEINDE-VERTRAG EXPORT
// ============================================================
export async function generateGemeindeVertragDocx(formData, klauseln) {
  const platzhalterDaten = buildPlatzhalterDaten(formData);
  const entschaedigungGesamt =
    (parseFloat(formData.trassenlaenge) || 0) *
    (parseFloat(formData.entschaedigungProMeter) || 0);

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
            text: "VERTRAG ÜBER DIE DULDUNG DER VERLEGUNG",
            bold: true,
            size: 40,
            font: "DM Sans",
            color: "1C1C1C",
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: "von Einspeise-/Direktleitungen in gemeindlichen Straßen",
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
            text: "(§ 11a EEG)",
            size: 26,
            font: "DM Sans",
            color: "888888",
          }),
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
      ["Landkreis", formData.landkreis || "–"],
      ["", ""],
      ["Betreiber", "Elite PV GmbH"],
      ["Adresse", "Lindenhof 4b, 92670 Windischeschenbach"],
    ],
  });
  sections.push({ type: "spacing", size: 200 });

  // Trassendaten
  sections.push({ type: "heading", text: "Trassendaten" });
  const trassenEntries = [
    ["EE-Anlage", formData.eeAnlageName || "–"],
    ["Standort EE-Anlage", formData.eeAnlageKoordinaten || "–"],
    ["Netzverknüpfungspunkt", formData.nvpName || "–"],
    ["Standort NVP", formData.nvpKoordinaten || "–"],
    ["Trassenlänge", `ca. ${formData.trassenlaenge || "–"} m`],
    ["Schutzstreifen", `${formData.schutzzoneBreite || "0,5"} m beidseitig`],
  ];
  sections.push({ type: "keyValue", entries: trassenEntries });
  sections.push({ type: "spacing", size: 150 });

  // Flurstücke
  const flurstuecke = formData.flurstuecke || [];
  if (flurstuecke.length > 0 && flurstuecke[0].flurNr) {
    sections.push({ type: "heading", text: "Betroffene Flurstücke" });
    sections.push({
      type: "table",
      headers: ["Flurstück-Nr.", "Gemarkung", "Grundbuchamt", "Blatt-Nr."],
      rows: flurstuecke.map((f) => [
        f.flurNr || "–",
        f.gemarkung || "–",
        f.grundbuchamt || "–",
        f.blattNr || "–",
      ]),
    });
    sections.push({ type: "spacing", size: 150 });
  }

  // Entschädigung
  sections.push({ type: "heading", text: "Entschädigung" });
  sections.push({
    type: "highlight",
    label: "Entschädigung Gemeinde",
    mainText: entschaedigungGesamt > 0 ? formatEuro(entschaedigungGesamt) : "– €",
    subText: `${formData.entschaedigungProMeter || "–"} €/lfm × ${formData.trassenlaenge || "–"} m`,
  });
  sections.push({ type: "spacing", size: 200 });

  // Seitenumbruch vor Klauseln
  sections.push({ type: "pageBreak" });

  // Klauseln mit ersetzten Platzhaltern
  const ersetzte = klauseln.map((k) => ({
    ...k,
    text: ersetzePlatzhalter(k.text, platzhalterDaten),
  }));

  // Stand-Datum
  const standParagraph = new Paragraph({
    spacing: { before: 400 },
    children: [
      new TextRun({
        text: `Stand: ${formatDatum(new Date())}`,
        size: 18,
        font: "DM Sans",
        color: "888888",
        italics: true,
      }),
    ],
  });

  const gemeindeName = formData.gemeindeName || "Gemeinde";

  await generateDocx({
    title: "DULDUNGSVERTRAG LEITUNGSWEG",
    subtitle: `${gemeindeName} | Elite PV GmbH | § 11a EEG`,
    sections: [
      ...sections,
      { type: "paragraphs", items: [standParagraph] },
    ],
    klauseln: ersetzte,
    signatureParties: [`Gemeinde ${gemeindeName}`, "Elite PV GmbH (Betreiber)"],
    fileName: `Duldungsvertrag_Gemeinde_${gemeindeName.replace(/[\s,]+/g, "_")}_Elite_PV.docx`,
  });
}

// ============================================================
// PRIVAT-VERTRAG EXPORT
// ============================================================
export async function generatePrivatVertragDocx(formData, klauseln) {
  const platzhalterDaten = buildPlatzhalterDaten(formData);
  const entschaedigungGesamt =
    (parseFloat(formData.trassenlaenge) || 0) *
    (parseFloat(formData.entschaedigungProMeter) || 0);
  const bewAusfall = parseFloat(formData.bewirtschaftungsausfall) || 0;

  const eig = formData.eigentuemer || {};
  const partner = eig.partner || [];
  const eigName = partner.map((p) => p.name).filter(Boolean).join(", ") || "–";
  const eigAdresse =
    eig.eigStrasse && eig.eigOrt
      ? `${eig.eigStrasse}, ${eig.eigPlz} ${eig.eigOrt}`
      : partner.length > 0 && partner[0].adresse
      ? partner[0].adresse
      : "–";

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
            text: "VERTRAG ÜBER DIE EINRÄUMUNG",
            bold: true,
            size: 40,
            font: "DM Sans",
            color: "1C1C1C",
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: "eines Leitungsrechts und zur Bestellung einer",
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
            text: "beschränkten persönlichen Dienstbarkeit",
            size: 26,
            font: "DM Sans",
            color: "888888",
          }),
        ],
      }),
    ],
  });

  // Vertragsparteien
  sections.push({ type: "heading", text: "Vertragsparteien" });
  const parteiEntries = [
    ["Eigentümer", eigName],
    ["Adresse", eigAdresse],
  ];
  if (eig.vertretenDurch) {
    parteiEntries.push(["Vertreten durch", eig.vertretenDurch]);
  }
  parteiEntries.push(["", ""]);
  parteiEntries.push(["Berechtigte", "Elite PV GmbH"]);
  parteiEntries.push(["Adresse", "Lindenhof 4b, 92670 Windischeschenbach"]);
  sections.push({ type: "keyValue", entries: parteiEntries });
  sections.push({ type: "spacing", size: 200 });

  // Grundbuch & Flurstücke
  const flurstuecke = formData.flurstuecke || [];
  if (flurstuecke.length > 0 && flurstuecke[0].flurNr) {
    sections.push({ type: "heading", text: "Grundbuch & Flurstücke" });
    sections.push({
      type: "table",
      headers: ["Grundbuchamt", "Blatt-Nr.", "Gemarkung", "Flurstück-Nr."],
      rows: flurstuecke.map((f) => [
        f.grundbuchamt || "–",
        f.blattNr || "–",
        f.gemarkung || "–",
        f.flurNr || "–",
      ]),
    });
    sections.push({ type: "spacing", size: 150 });
  }

  // Trassendaten
  sections.push({ type: "heading", text: "Trassendaten" });
  sections.push({
    type: "keyValue",
    entries: [
      ["Trassenlänge", `ca. ${formData.trassenlaenge || "–"} m`],
      ["Schutzzone", `${formData.schutzzoneBreite || "1"} m beidseitig`],
    ],
  });
  sections.push({ type: "spacing", size: 150 });

  // Entschädigung
  sections.push({ type: "heading", text: "Entschädigung" });
  sections.push({
    type: "highlight",
    label: "Entschädigung Eigentümer",
    mainText: entschaedigungGesamt > 0 ? formatEuro(entschaedigungGesamt) : "– €",
    subText: `${formData.entschaedigungProMeter || "–"} €/lfm × ${formData.trassenlaenge || "–"} m${bewAusfall > 0 ? ` | Bewirtschaftungsausfall: ${formatEuro(bewAusfall)}` : ""}`,
  });
  sections.push({ type: "spacing", size: 200 });

  // Seitenumbruch vor Klauseln
  sections.push({ type: "pageBreak" });

  // Klauseln mit ersetzten Platzhaltern
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
          text: "ANLAGEN",
          bold: true,
          size: 24,
          font: "DM Sans",
          color: "1C1C1C",
        }),
      ],
    }),
    ...["Anlage 1 – Muster der beschränkt persönlichen Dienstbarkeit",
      "Anlage 2 – Vorläufige Trassenplanung",
    ].map(
      (a) =>
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: a, size: 20, font: "DM Sans", color: "444444" }),
          ],
        })
    ),
  ];

  // Stand-Datum
  const standParagraph = new Paragraph({
    spacing: { before: 400 },
    children: [
      new TextRun({
        text: `Stand: ${formatDatum(new Date())}`,
        size: 18,
        font: "DM Sans",
        color: "888888",
        italics: true,
      }),
    ],
  });

  await generateDocx({
    title: "LEITUNGSRECHT & DIENSTBARKEIT",
    subtitle: `${eigName} | Elite PV GmbH`,
    sections: [
      ...sections,
      { type: "paragraphs", items: anlagenParagraphs },
      { type: "paragraphs", items: [standParagraph] },
    ],
    klauseln: ersetzte,
    signatureParties: ["Elite PV GmbH (Berechtigte)", `${eigName} (Eigentümer)`],
    fileName: `Leitungsrecht_${eigName.replace(/[\s,]+/g, "_")}_Elite_PV.docx`,
  });
}
