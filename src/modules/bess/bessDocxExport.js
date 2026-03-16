import {
  generateDocx,
} from "../../lib/docxExport";
import { formatEuro, formatDatum, formatZahl, zahlInWort } from "../../lib/formatters";
import { Paragraph, TextRun } from "docx";

// ============================================================
// Vertragsnummer: EPV-BESS-YYYY-NNN
// ============================================================
function generiereVertragsnummer() {
  const jahr = new Date().getFullYear();
  const nr = String(Math.floor(Math.random() * 900) + 100);
  return `EPV-BESS-${jahr}-${nr}`;
}

// ============================================================
// Platzhalter ersetzen
// ============================================================
function ersetzePlatzhalter(text, daten) {
  const map = {
    "{EIGENTUEMER_NAME}": daten.eigentuemerName || "_______________",
    "{EIGENTUEMER_ADRESSE}": daten.eigentuemerAdresse || "_______________",
    "{EIGENTUEMER_TYP}": daten.eigentuemerTyp || "Alleineigent\u00FCmer",
    "{GRUNDBUCH_TABELLE}": daten.grundbuchText || "(siehe Anlage)",
    "{BESS_FLAECHE_M2}": daten.bessFlaecheM2 || "___",
    "{KAPAZITAET_MWH}": daten.kapazitaetMwh || "___",
    "{LEISTUNG_MW}": daten.leistungMw || "___",
    "{PACHTZINS_JAHR}": daten.pachtzinsJahr || "___",
    "{PACHTZINS_WORT}": daten.pachtzinsWort || "_______________",
    "{STEIGERUNG}": daten.steigerung || "10",
    "{VORHALTE_PROZENT}": daten.vorhalteProzent || "50",
    "{VORHALTE_BETRAG}": daten.vorhalteBetrag || "___",
    "{LAUFZEIT_JAHRE}": daten.laufzeitJahre || "20",
    "{VERTRAGSNUMMER}": daten.vertragsnummer || "___",
    "{VERTRAGSDATUM}": daten.vertragsdatum || formatDatum(new Date()),
    "{VERTRETEN_DURCH}": daten.vertretenDurch || "vertreten durch den Gesch\u00E4ftsf\u00FChrer Herrn Levin Schober",
    "{GESCHAEFTSFUEHRER}": "Levin Schober",
    "{EIGENTUEMER_IBAN}": daten.eigentuemerIban || "________________________",
    "{EIGENTUEMER_BIC}": daten.eigentuemerBic || "____________",
    "{RUECKBAU_BETRAG}": daten.rueckbauBetrag || "___",
    "{RUECKBAU_SATZ}": daten.rueckbauSatz || "8,00",
    "{ZUSATZVEREINBARUNGEN}": daten.zusatzvereinbarungen || "(keine)",
  };

  let result = text;
  for (const [key, val] of Object.entries(map)) {
    result = result.replaceAll(key, String(val));
  }
  return result;
}

// ============================================================
// Daten aufbereiten
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
    Einzelperson: "Alleineigent\u00FCmer",
    Ehepaar: "Miteigent\u00FCmer",
    Erbengemeinschaft: "Sonstiges (Erbengemeinschaft)",
    GbR: "Sonstiges (GbR)",
    GmbH: "Sonstiges (GmbH)",
    Sonstige: "Sonstiges",
  };
  const eigentuemerTyp = eigTypMap[eig.typ] || "Alleineigent\u00FCmer";

  const gb = formData.grundbuch || [];
  const grundbuchText = gb
    .map(
      (z) =>
        `Grundbuchamt: ${z.grundbuchamt || "\u2013"} | Band: ${z.gbBand || "\u2013"} | Blatt: ${z.gbBlatt || "\u2013"} | Gemarkung: ${z.gemarkung || "\u2013"} | Flst.: ${z.flurNr || "\u2013"} | Fl\u00E4che: ${z.gesamtflaecheHa || "\u2013"} ha`
    )
    .join("\n");

  const gewaehltes = ergebnis[`modell${formData.gewaehlteModell || "A"}`];

  return {
    eigentuemerName: name,
    eigentuemerAdresse: adresse,
    eigentuemerTyp,
    grundbuchText,
    bessFlaecheM2: formatZahl(ergebnis.bessFlaecheM2, 0),
    kapazitaetMwh: formatZahl(ergebnis.kapazitaetMwh, 1),
    leistungMw: formatZahl(ergebnis.leistungMw, 1),
    pachtzinsJahr: formatEuro(gewaehltes.pachtzinsJahr),
    pachtzinsWort: zahlInWort(gewaehltes.pachtzinsJahr),
    steigerung: String(gewaehltes.steigerungProzent || 10),
    vorhalteProzent: String(formData.vorhalteProzent || 50),
    vorhalteBetrag: formatEuro(ergebnis.vorhalteverguetung.betragJahr),
    laufzeitJahre: String(ergebnis.laufzeitJahre || 20),
    vertragsnummer: generiereVertragsnummer(),
    vertragsdatum: formatDatum(new Date()),
    vertretenDurch: eig.vertretenDurch
      ? `vertreten durch ${eig.vertretenDurch}`
      : "vertreten durch den Gesch\u00E4ftsf\u00FChrer Herrn Levin Schober",
    eigentuemerIban: formData.eigentuemerIban || "________________________",
    eigentuemerBic: formData.eigentuemerBic || "____________",
    rueckbauBetrag: formatEuro(ergebnis.rueckbau.buergschaftBetrag),
    rueckbauSatz: String(formData.rueckbauSatzKwh || "8,00").replace(".", ","),
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
  const name = partner.map((p) => p.name).filter(Boolean).join(", ") || "\u2013";

  const sections = [];

  sections.push({ type: "heading", text: "Vertragsparteien" });
  sections.push({
    type: "keyValue",
    entries: [
      ["Grundst\u00FCckseigent\u00FCmer", name],
      ["Eigent\u00FCmertyp", eig.typ || "\u2013"],
      ["Eigentumsverh\u00E4ltnis", eig.eigentumsart || "\u2013"],
    ],
  });
  sections.push({ type: "spacing", size: 150 });

  sections.push({ type: "heading", text: "BESS-Daten" });
  sections.push({
    type: "keyValue",
    entries: [
      ["Grundst\u00FCcksadresse", formData.grundstueckAdresse || "\u2013"],
      ["BESS-Fl\u00E4che", `${formData.bessFlaecheM2 || 0} m\u00B2`],
      ["Kapazit\u00E4t", `${formData.kapazitaetMwh || 0} MWh`],
      ["Leistung", `${formData.leistungMw || 0} MW`],
      ["Technologie", formData.technologie || "\u2013"],
      ["Anwendung", formData.anwendung || "\u2013"],
      ["Netzanschluss", formData.netzanschlussEbene || "\u2013"],
      ["Container", `${formData.containerAnzahl || 0} St\u00FCck`],
    ],
  });
  sections.push({ type: "spacing", size: 150 });

  sections.push({ type: "heading", text: "Pachtmodell-Vergleich" });
  sections.push({
    type: "table",
    headers: ["Modell", "Pacht/Jahr", `Summe ${ergebnis.laufzeitJahre} J.`],
    rows: [
      [
        `${formData.gewaehlteModell === "A" ? "\u25B6 " : ""}A: Festpacht/m\u00B2`,
        formatEuro(modellA.pachtzinsJahr),
        formatEuro(modellA.pachtGesamt),
      ],
      [
        `${formData.gewaehlteModell === "B" ? "\u25B6 " : ""}B: Festpacht/MWh`,
        formatEuro(modellB.pachtzinsJahr),
        formatEuro(modellB.pachtGesamt),
      ],
      [
        `${formData.gewaehlteModell === "C" ? "\u25B6 " : ""}C: Hybrid`,
        formatEuro(modellC.pachtzinsJahr),
        formatEuro(modellC.pachtGesamt),
      ],
    ],
  });
  sections.push({ type: "spacing", size: 150 });

  sections.push({
    type: "highlight",
    label: `GEW\u00C4HLTES MODELL: ${gewaehltes.modell}`,
    mainText: `${formatEuro(gewaehltes.pachtzinsJahr)} / Jahr`,
    subText: `Summe \u00FCber ${ergebnis.laufzeitJahre} Jahre: ${formatEuro(gewaehltes.pachtGesamt)}`,
  });
  sections.push({ type: "spacing", size: 150 });

  sections.push({ type: "heading", text: "Zus\u00E4tzliche Vereinbarungen" });
  sections.push({
    type: "keyValue",
    entries: [
      ["Vorhalteverg\u00FCtung", `${formatEuro(vorhalteverguetung.betragJahr)} / Jahr (${vorhalteverguetung.prozent}% vor IBN)`],
      ["R\u00FCckbaub\u00FCrgschaft", `${formatEuro(rueckbau.buergschaftBetrag)} (${formatZahl(rueckbau.kapazitaetKwh, 0)} kWh \u00D7 ${rueckbau.satzProKwh} \u20AC/kWh)`],
      ["Steigerung ab BJ 11", `+${gewaehltes.steigerungProzent}%`],
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
  const platzhalterDaten = buildDaten(formData, ergebnis);
  const gewaehltes = ergebnis[`modell${formData.gewaehlteModell || "A"}`];

  const eig = formData.eigentuemer || {};
  const partner = eig.partner || [];
  const name = partner.map((p) => p.name).filter(Boolean).join(", ") || "\u2013";

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
            text: "FL\u00C4CHENNUTZUNGSVERTRAG",
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
            text: "\u00FCber ein Grundst\u00FCck zur Installation und zum Betrieb",
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
            text: "eines Batterie-Energiespeichersystems (BESS)",
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
    ["Grundst\u00FCckseigent\u00FCmer", name],
    ["Adresse", platzhalterDaten.eigentuemerAdresse],
  ];
  if (eig.vertretenDurch) {
    parteiEntries.push(["Vertreten durch", eig.vertretenDurch]);
  }
  const alleineig = eig.eigentumsart === "Alleineigent\u00FCmer";
  const miteig = eig.eigentumsart === "Miteigent\u00FCmer";
  const sonstiges = !alleineig && !miteig;
  parteiEntries.push([
    "Eigentumsverh\u00E4ltnis",
    `${alleineig ? "\u2612" : "\u2610"} Alleineigent\u00FCmer   ${miteig ? "\u2612" : "\u2610"} Miteigent\u00FCmer   ${sonstiges ? "\u2612" : "\u2610"} Sonstiges (${eig.typ || "\u2013"})`,
  ]);
  parteiEntries.push(["", ""]);
  parteiEntries.push(["Grundst\u00FCcksnutzer", "Elite PV GmbH"]);
  parteiEntries.push(["Adresse", "Lindenhof 4b, 92670 Windischeschenbach"]);
  parteiEntries.push(["Gesch\u00E4ftsf\u00FChrer", "Levin Schober"]);
  sections.push({ type: "keyValue", entries: parteiEntries });
  sections.push({ type: "spacing", size: 200 });

  // BESS-Objekt
  sections.push({ type: "heading", text: "BESS-Objekt" });
  sections.push({
    type: "keyValue",
    entries: [
      ["Grundst\u00FCcksadresse", formData.grundstueckAdresse || "\u2013"],
      ["BESS-Fl\u00E4che", `ca. ${formatZahl(ergebnis.bessFlaecheM2, 0)} m\u00B2`],
      ["Kapazit\u00E4t", `${formatZahl(ergebnis.kapazitaetMwh, 1)} MWh`],
      ["Leistung", `${formatZahl(ergebnis.leistungMw, 1)} MW`],
      ["Technologie", formData.technologie || "\u2013"],
      ["Container", `${formData.containerAnzahl || 0} St\u00FCck`],
    ],
  });
  sections.push({ type: "spacing", size: 100 });

  // Grundbuch
  const gb = formData.grundbuch || [];
  if (gb.length > 0 && gb[0].grundbuchamt) {
    sections.push({ type: "heading", text: "Grundbuchdaten" });
    sections.push({
      type: "table",
      headers: ["Grundbuchamt", "Band", "Blatt", "Gemarkung", "Flst.", "Fl\u00E4che (ha)"],
      rows: gb.map((z) => [
        z.grundbuchamt || "\u2013",
        z.gbBand || "\u2013",
        z.gbBlatt || "\u2013",
        z.gemarkung || "\u2013",
        z.flurNr || "\u2013",
        z.gesamtflaecheHa || "\u2013",
      ]),
    });
    sections.push({ type: "spacing", size: 200 });
  }

  // Inhaltsverzeichnis
  sections.push({ type: "heading", text: "Inhaltsverzeichnis" });
  sections.push({ type: "keyValue", entries: klauseln.map((k) => [k.titel, ""]) });
  sections.push({ type: "pageBreak" });

  // Verg\u00FCtungs\u00FCbersicht
  sections.push({ type: "heading", text: "Verg\u00FCtungs\u00FCbersicht" });
  sections.push({
    type: "highlight",
    label: `Gew\u00E4hltes Modell: ${gewaehltes.modell}`,
    mainText: `${formatEuro(gewaehltes.pachtzinsJahr)} / Jahr`,
    subText: `${formatEuro(gewaehltes.pachtzinsMonat)} / Monat | Laufzeit ${ergebnis.laufzeitJahre} Jahre: ${formatEuro(gewaehltes.pachtGesamt)}`,
  });
  sections.push({ type: "spacing", size: 100 });
  sections.push({
    type: "keyValue",
    entries: [
      ["Vorhalteverg\u00FCtung", `${formatEuro(ergebnis.vorhalteverguetung.betragJahr)} / Jahr`],
      ["R\u00FCckbaub\u00FCrgschaft", formatEuro(ergebnis.rueckbau.buergschaftBetrag)],
    ],
  });
  sections.push({ type: "spacing", size: 200 });

  // Klauseln
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
      "Anlage 1 \u2013 Vorl\u00E4ufiger Lageplan",
      "Anlage 2 \u2013 Grundbuchauszug",
      "Anlage 3 \u2013 Vollmacht Einholung Grundbuchauszug",
      "Anlage 4 \u2013 Muster Bestellungsurkunde Dienstbarkeit",
      "Anlage 5 \u2013 Muster Bestellung Vormerkung",
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
    title: "FL\u00C4CHENNUTZUNGSVERTRAG BESS",
    subtitle: `${name} | Elite PV GmbH`,
    sections: [
      ...sections,
      { type: "paragraphs", items: anlagenParagraphs },
      { type: "paragraphs", items: [standParagraph] },
    ],
    klauseln: ersetzte,
    signatureParties: ["Elite PV GmbH (Grundst\u00FCcksnutzer)", `${name} (Grundst\u00FCckseigent\u00FCmer)`],
    fileName: `Flaechennutzungsvertrag_BESS_${(name || "Kunde").replace(/[\s,]+/g, "_")}_Elite_PV.docx`,
  });
}
