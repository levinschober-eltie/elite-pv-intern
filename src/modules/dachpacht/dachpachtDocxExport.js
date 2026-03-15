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
// Vertragsnummer auto-generieren: EPV-DP-YYYY-NNN
// ============================================================
function generiereVertragsnummer() {
  const jetzt = new Date();
  const jahr = jetzt.getFullYear();
  const nr = String(Math.floor(Math.random() * 900) + 100);
  return `EPV-DP-${jahr}-${nr}`;
}

// ============================================================
// Platzhalter im Klauseltext ersetzen
// ============================================================
function ersetzePlatzhalter(text, daten) {
  const map = {
    "{EIGENTUEMER_NAME}": daten.eigentuemerName || "_______________",
    "{EIGENTUEMER_ADRESSE}": daten.eigentuemerAdresse || "_______________",
    "{EIGENTUEMER_TYP}": daten.eigentuemerTyp || "Alleineigentümer",
    "{GRUNDBUCHAMT}": daten.grundbuchamt || "_______________",
    "{GRUNDBUCH_DETAILS}": daten.grundbuchDetails || "Band ___, Blatt ___, Gemarkung ___, Flst. ___",
    "{GRUNDBUCH_TABELLE}": daten.grundbuchText || "(siehe Anlage)",
    "{LEISTUNG_KWP}": daten.leistungKwp || "___",
    "{PACHTZINS_JAHR}": daten.pachtzinsJahr || "___",
    "{PACHTZINS_WORT}": daten.pachtzinsWort || "_______________",
    "{LAUFZEIT_JAHRE}": daten.laufzeitJahre || "20",
    "{PREISANPASSUNG}": daten.preisanpassung || "1,5",
    "{VERTRAGSNUMMER}": daten.vertragsnummer || "___",
    "{STAND_DATUM}": daten.standDatum || formatDatum(new Date()),
    "{VERTRETEN_DURCH}": daten.vertretenDurch || "vertreten durch den Geschäftsführer Herrn Levin Schober",
    "{VERLAENGERUNG_1_BIS}": String((parseInt(daten.laufzeitJahre) || 20) + 5),
    "{VERLAENGERUNG_2_BIS}": String((parseInt(daten.laufzeitJahre) || 20) + 10),
    "{BATTERIESPEICHER_KWH}": daten.batteriespeicherKwh || "(noch nicht bekannt)",
    "{GESCHAEFTSFUEHRER}": "Levin Schober",
  };

  let result = text;
  for (const [key, val] of Object.entries(map)) {
    result = result.replaceAll(key, String(val));
  }
  return result;
}

// Zahl in Wort (vereinfacht – gibt formatierte Zahl zurück)
function zahlInWort(betrag) {
  return Math.floor(betrag).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ============================================================
// Eigentümer-Daten für Platzhalter zusammenbauen
// ============================================================
function buildEigentuemerDaten(formData, ergebnis, gewaehltes) {
  const eig = formData.eigentuemer || {};
  const partner = eig.partner || [];
  const name =
    partner.length > 0
      ? partner.map((p) => p.name).filter(Boolean).join(", ")
      : "___";
  const adresse =
    eig.eigStrasse && eig.eigOrt
      ? `${eig.eigStrasse}, ${eig.eigPlz} ${eig.eigOrt}`
      : partner.length > 0 && partner[0].adresse
      ? partner[0].adresse
      : "_______________";

  // Eigentümertyp-Mapping
  const eigTypMap = {
    Einzelperson: "Alleineigentümer",
    Ehepaar: "Miteigentümer",
    Erbengemeinschaft: "Sonstiges (Erbengemeinschaft)",
    GbR: "Sonstiges (GbR)",
    GmbH: "Sonstiges (GmbH)",
    Sonstige: "Sonstiges",
  };
  const eigentuemerTyp = eigTypMap[eig.typ] || eig.eigentumsart || "Alleineigentümer";

  const gb = formData.grundbuch || [];
  const gbFirst = gb[0] || {};
  const grundbuchamt = gbFirst.grundbuchamt || "___";
  const grundbuchDetails =
    gb.length > 0
      ? gb
          .map(
            (z) =>
              `Band ${z.gbBand || "___"}, Blatt ${z.gbBlatt || "___"}, Gemarkung ${z.gemarkung || "___"}, Flst. ${z.flurNr || "___"}`
          )
          .join("; ")
      : "___";

  const grundbuchText = gb
    .map(
      (z) =>
        `Grundbuchamt: ${z.grundbuchamt || "–"} | Band: ${z.gbBand || "–"} | Blatt: ${z.gbBlatt || "–"} | Gemarkung: ${z.gemarkung || "–"} | Flst.: ${z.flurNr || "–"} | Fläche: ${z.gesamtflaecheHa || "–"} ha`
    )
    .join("\n");

  const pachtzinsJahr = gewaehltes ? formatEuro(gewaehltes.pachtzinsJahr) : "___";
  const pachtzinsWort = gewaehltes ? zahlInWort(gewaehltes.pachtzinsJahr) : "___";
  const preisanpassung = gewaehltes
    ? String(gewaehltes.preisanpassungProzent).replace(".", ",")
    : "1,5";

  const vertretenDurch = eig.vertretenDurch
    ? `vertreten durch ${eig.vertretenDurch}`
    : "vertreten durch den Geschäftsführer Herrn Levin Schober";

  return {
    eigentuemerName: name,
    eigentuemerAdresse: adresse,
    eigentuemerTyp,
    grundbuchamt,
    grundbuchDetails,
    grundbuchText,
    leistungKwp: String(ergebnis.leistungKwp || "___"),
    pachtzinsJahr,
    pachtzinsWort,
    laufzeitJahre: String(ergebnis.laufzeitJahre || 20),
    preisanpassung,
    vertragsnummer: generiereVertragsnummer(),
    standDatum: formatDatum(new Date()),
    vertretenDurch,
    batteriespeicherKwh: "(noch nicht bekannt)",
  };
}

// ============================================================
// PREISBLATT EXPORT
// ============================================================
export async function generateDachpachtPreisblattDocx(formData, ergebnis) {
  const { modell1, modell2, modell3 } = ergebnis;
  const gewaehltes = ergebnis[`modell${formData.gewaehlteModell || 1}`];

  const sections = [];

  // Eigentümerdaten
  const eig = formData.eigentuemer || {};
  const partner = eig.partner || [];
  const name = partner.map((p) => p.name).filter(Boolean).join(", ") || "–";

  sections.push({ type: "heading", text: "Vertragsparteien" });
  sections.push({
    type: "keyValue",
    entries: [
      ["Eigentümer", name],
      ["Eigentümertyp", eig.typ || "–"],
      ["Eigentumsverhältnis", eig.eigentumsart || "–"],
    ],
  });
  sections.push({ type: "spacing", size: 150 });

  // Objektdaten
  sections.push({ type: "heading", text: "Objektdaten" });
  sections.push({
    type: "keyValue",
    entries: [
      ["Gebäudeadresse", formData.gebaeudeAdresse || "–"],
      ["Gebäudetyp", formData.gebaeudeTyp || "–"],
      ["Dachtyp", formData.dachtyp || "–"],
      ["Brutto-Dachfläche", `${formData.bruttoDachflaeche || 0} m²`],
      ["Nutzbare Dachfläche", `${formData.nutzbareDachflaeche || 0} m²`],
      ["Berechnete Leistung", `${(ergebnis.leistungKwp || 0).toFixed(1)} kWp`],
      ["Dachneigung", `${formData.dachneigung || 0}°`],
      ["Ausrichtung", formData.ausrichtung || "–"],
      ["Material", formData.dachMaterial || "–"],
      ["Statik", formData.statik || "–"],
    ],
  });
  sections.push({ type: "spacing", size: 150 });

  // Modell-Vergleich
  sections.push({ type: "heading", text: "Pachtmodell-Vergleich" });
  sections.push({
    type: "table",
    headers: ["Modell", "Pacht/Jahr", "Pacht/Monat", `Summe ${ergebnis.laufzeitJahre} J.`],
    rows: [
      [
        `${formData.gewaehlteModell === 1 ? "▶ " : ""}M1: Festpacht/kWp`,
        formatEuro(modell1.pachtzinsJahr),
        formatEuro(modell1.pachtzinsMonat),
        formatEuro(modell1.pachtzins20Jahre),
      ],
      [
        `${formData.gewaehlteModell === 2 ? "▶ " : ""}M2: Ertragsabhängig`,
        formatEuro(modell2.pachtzinsJahr),
        formatEuro(modell2.pachtzinsMonat),
        formatEuro(modell2.pachtzins20Jahre),
      ],
      [
        `${formData.gewaehlteModell === 3 ? "▶ " : ""}M3: Festpacht/m²`,
        formatEuro(modell3.pachtzinsJahr),
        formatEuro(modell3.pachtzinsMonat),
        formatEuro(modell3.pachtzins20Jahre),
      ],
    ],
  });
  sections.push({ type: "spacing", size: 150 });

  // Gewähltes Modell hervorheben
  sections.push({
    type: "highlight",
    label: `GEWÄHLTES MODELL: ${gewaehltes.modell}`,
    mainText: `${formatEuro(gewaehltes.pachtzinsJahr)} / Jahr  |  ${formatEuro(gewaehltes.pachtzinsMonat)} / Monat`,
    subText: `Summe über ${ergebnis.laufzeitJahre} Jahre: ${formatEuro(gewaehltes.pachtzins20Jahre)}`,
  });

  await generateDocx({
    title: "PREISBLATT DACHPACHT",
    subtitle: `PV-Dachflächennutzung | ${name} | Elite PV GmbH`,
    sections,
    fileName: `Preisblatt_Dachpacht_${(name || "Kunde").replace(/[\s,]+/g, "_")}_Elite_PV.docx`,
  });
}

// ============================================================
// VERTRAG EXPORT
// ============================================================
export async function generateDachpachtVertragDocx(formData, ergebnis, klauseln) {
  const gewaehltes = ergebnis[`modell${formData.gewaehlteModell || 1}`];
  const platzhalterDaten = buildEigentuemerDaten(formData, ergebnis, gewaehltes);

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
            text: "NUTZUNGSVERTRAG",
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
            text: "über Dachflächen zur Errichtung und zum Betrieb",
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
            text: "einer Photovoltaikanlage / Batterie-Speicher",
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
    ["Herr/Frau/Firma", name],
    ["Adresse", platzhalterDaten.eigentuemerAdresse],
  ];
  if (eig.vertretenDurch) {
    parteiEntries.push(["Vertreten durch", eig.vertretenDurch]);
  }
  // Eigentümertyp als Ankreuz-Darstellung
  const alleineig = eig.eigentumsart === "Alleineigentümer";
  const miteig = eig.eigentumsart === "Miteigentümer";
  const sonstiges = !alleineig && !miteig;
  parteiEntries.push([
    "Eigentumsverhältnis",
    `${alleineig ? "☒" : "☐"} Alleineigentümer   ${miteig ? "☒" : "☐"} Miteigentümer   ${sonstiges ? "☒" : "☐"} Sonstiges (${eig.typ || "–"})`,
  ]);
  parteiEntries.push(["", ""]);
  parteiEntries.push(["Nutzer", "Elite PV GmbH"]);
  parteiEntries.push(["Adresse", "Lindenhof 4b, 92670 Windischeschenbach"]);
  parteiEntries.push(["Geschäftsführer", "Levin Schober"]);
  sections.push({ type: "keyValue", entries: parteiEntries });
  sections.push({ type: "spacing", size: 200 });

  // Vertragsobjekt
  sections.push({ type: "heading", text: "Vertragsobjekt" });
  sections.push({
    type: "keyValue",
    entries: [
      ["Gebäudeadresse", formData.gebaeudeAdresse || "–"],
      ["Gebäudetyp", formData.gebaeudeTyp || "–"],
      ["Dachfläche (nutzbar)", `${formData.nutzbareDachflaeche || 0} m²`],
      ["PV-Leistung", `ca. ${(ergebnis.leistungKwp || 0).toFixed(1)} kWp`],
      ["Batteriespeicher", "Leistung nach Detailplanung"],
    ],
  });
  sections.push({ type: "spacing", size: 100 });

  // Grundbuch-Tabelle
  const gb = formData.grundbuch || [];
  if (gb.length > 0 && gb[0].grundbuchamt) {
    sections.push({ type: "heading", text: "Grundbuchdaten" });
    sections.push({
      type: "table",
      headers: [
        "Grundbuchamt",
        "Band",
        "Blatt",
        "Gemarkung",
        "Flst.",
        "Fläche (ha)",
      ],
      rows: gb.map((z) => [
        z.grundbuchamt || "–",
        z.gbBand || "–",
        z.gbBlatt || "–",
        z.gemarkung || "–",
        z.flurNr || "–",
        z.gesamtflaecheHa || "–",
      ]),
    });
    sections.push({ type: "spacing", size: 200 });
  }

  // Inhaltsverzeichnis
  sections.push({ type: "heading", text: "Inhaltsverzeichnis" });
  const inhaltEntries = klauseln.map((k) => [k.titel, ""]);
  sections.push({ type: "keyValue", entries: inhaltEntries });

  // Seitenumbruch vor Klauseln
  sections.push({ type: "pageBreak" });

  // Klauseln mit ersetzten Platzhaltern
  const ersetzte = klauseln.map((k) => ({
    ...k,
    text: ersetzePlatzhalter(k.text, platzhalterDaten),
  }));

  // Vergütungsdaten
  sections.push({ type: "heading", text: "Vergütungsübersicht (Anlage 7)" });
  sections.push({
    type: "highlight",
    label: `Gewähltes Modell: ${gewaehltes.modell}`,
    mainText: `${formatEuro(gewaehltes.pachtzinsJahr)} / Jahr`,
    subText: `${formatEuro(gewaehltes.pachtzinsMonat)} / Monat | Laufzeit ${ergebnis.laufzeitJahre} Jahre: ${formatEuro(gewaehltes.pachtzins20Jahre)}`,
  });
  sections.push({ type: "spacing", size: 200 });

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
      "Anlage 1 – Lageplan Dachflächen",
      "Anlage 2 – Grundbuchauszug",
      "Anlage 3 – Muster / Dienstbarkeit",
      "Anlage 4 – Vollmacht zur Einholung eines Grundbuchauszuges",
      "Anlage 5 – Einverständniserklärung Netzanfrage",
      "Anlage 6 – Protokoll / Bestandsaufnahme und Abnahme",
      "Anlage 7 – Preisblatt / Pachtberechnung",
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

  // Stand-Datum + Vertragsnummer
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
    title: "NUTZUNGSVERTRAG DACHFLÄCHEN",
    subtitle: `${name} | Elite PV GmbH`,
    sections: [
      ...sections,
      { type: "paragraphs", items: anlagenParagraphs },
      { type: "paragraphs", items: [standParagraph] },
    ],
    klauseln: ersetzte,
    signatureParties: ["Elite PV GmbH (Nutzer)", `${name} (Eigentümer)`],
    fileName: `Nutzungsvertrag_Dachpacht_${(name || "Kunde").replace(/[\s,]+/g, "_")}_Elite_PV.docx`,
  });
}
