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
// Vertragsnummer: EPV-FF-YYYY-NNN
// ============================================================
function generiereVertragsnummer() {
  const jetzt = new Date();
  const jahr = jetzt.getFullYear();
  const nr = String(Math.floor(Math.random() * 900) + 100);
  return `EPV-FF-${jahr}-${nr}`;
}

// ============================================================
// Platzhalter ersetzen
// ============================================================
function ersetzePlatzhalter(text, daten) {
  const map = {
    "{EIGENTUEMER_NAME}": daten.eigentuemerName || "_______________",
    "{EIGENTUEMER_ADRESSE}": daten.eigentuemerAdresse || "_______________",
    "{EIGENTUEMER_TYP}": daten.eigentuemerTyp || "Alleineigentümer",
    "{GRUNDSTUECK_ADRESSE}": daten.grundstueckAdresse || "_______________",
    "{GRUNDBUCH_TABELLE}": daten.grundbuchText || "(siehe Anlage)",
    "{LEISTUNG_MWP}": daten.leistungMwp || "___",
    "{LEISTUNG_KWP}": daten.leistungKwp || "___",
    "{PACHTFLAECHE_HA}": daten.pachtflaecheHa || "___",
    "{STAFFEL_1}": daten.staffel1 || "3.300",
    "{STAFFEL_2}": daten.staffel2 || "3.400",
    "{STAFFEL_3}": daten.staffel3 || "3.500",
    "{VORHALTE_BETRAG}": daten.vorhalteBetrag || "500",
    "{SPEICHER_SATZ}": daten.speicherSatz || "5,00",
    "{WERTSICHERUNG}": daten.wertsicherung || "10",
    "{RUECKBAU_SATZ}": daten.rueckbauSatz || "15,00",
    "{LAUFZEIT_JAHRE}": daten.laufzeitJahre || "20",
    "{VERTRAGSNUMMER}": daten.vertragsnummer || "___",
    "{VERTRAGSDATUM}": daten.vertragsdatum || formatDatum(new Date()),
    "{VERTRETEN_DURCH}": daten.vertretenDurch || "vertreten durch den Geschäftsführer Herrn Levin Schober",
    "{GESCHAEFTSFUEHRER}": "Levin Schober",
    "{EIGENTUEMER_IBAN}": daten.eigentuemerIban || "________________________",
    "{EIGENTUEMER_BIC}": daten.eigentuemerBic || "____________",
    "{ZUSATZVEREINBARUNGEN}": daten.zusatzvereinbarungen || "(keine)",
    "{AGRI_PV_KLAUSEL}": daten.agriPvKlausel || "",
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
        `Grundbuchamt: ${z.grundbuchamt || "–"} | Band: ${z.gbBand || "–"} | Blatt: ${z.gbBlatt || "–"} | Gemarkung: ${z.gemarkung || "–"} | Flst.: ${z.flurNr || "–"} | Fläche: ${z.gesamtflaecheHa || "–"} ha`
    )
    .join("\n");

  const gewaehltes = ergebnis[`modell${formData.gewaehlteModell || "A"}`];

  return {
    eigentuemerName: name,
    eigentuemerAdresse: adresse,
    eigentuemerTyp,
    grundstueckAdresse: formData.grundstueckAdresse || adresse,
    grundbuchText,
    leistungMwp: String(ergebnis.leistungMwp || "___"),
    leistungKwp: String((ergebnis.leistungMwp || 0) * 1000),
    pachtflaecheHa: String(ergebnis.pachtflaecheHa || "___"),
    staffel1: formatZahl(parseFloat(formData.staffel1) || 3300, 0),
    staffel2: formatZahl(parseFloat(formData.staffel2) || 3400, 0),
    staffel3: formatZahl(parseFloat(formData.staffel3) || 3500, 0),
    vorhalteBetrag: formatZahl(parseFloat(formData.vorhalteBetrag) || 500, 0),
    speicherSatz: String(formData.speicherSatzM2 || "5,00").replace(".", ","),
    wertsicherung: String(formData.wertsicherungProzent || 10),
    rueckbauSatz: String(formData.rueckbauSatzKw || "15,00").replace(".", ","),
    laufzeitJahre: String(ergebnis.laufzeitJahre || 20),
    vertragsnummer: generiereVertragsnummer(),
    vertragsdatum: formatDatum(new Date()),
    vertretenDurch: eig.vertretenDurch
      ? `vertreten durch ${eig.vertretenDurch}`
      : "vertreten durch den Geschäftsführer Herrn Levin Schober",
    eigentuemerIban: formData.eigentuemerIban || "________________________",
    eigentuemerBic: formData.eigentuemerBic || "____________",
    zusatzvereinbarungen: formData.zusatzvereinbarungen || "(keine)",
  };
}

// ============================================================
// PREISBLATT EXPORT
// ============================================================
export async function generateFreiflaechePreisblattDocx(formData, ergebnis) {
  const { modellA, modellB, modellC, modellD, vorhalteverguetung, speicher, rueckbau } = ergebnis;
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
      ["Eigentümer", name],
      ["Eigentümertyp", eig.typ || "–"],
      ["Eigentumsverhältnis", eig.eigentumsart || "–"],
    ],
  });
  sections.push({ type: "spacing", size: 150 });

  // Grundstücksdaten
  sections.push({ type: "heading", text: "Grundstücksdaten" });
  sections.push({
    type: "keyValue",
    entries: [
      ["Adresse", formData.grundstueckAdresse || "–"],
      ["Gesamtfläche", `${formData.gesamtflaecheHa || 0} ha`],
      ["Pachtfläche", `${formData.pachtflaecheHa || 0} ha`],
      ["Nutzungsart", formData.nutzungsart || "–"],
      ["Bodenklasse", formData.bodenklasse || "–"],
      ["Leistung", `${formData.leistungMwp || 0} MWp`],
      ["Netzanschluss", formData.netzanschlussEbene || "–"],
      ["Agri-PV", formData.agriPv ? "Ja" : "Nein"],
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
        `${formData.gewaehlteModell === "A" ? "▶ " : ""}A: Festpacht/ha (Staffel)`,
        formatEuro(modellA.pachtzinsJahr),
        formatEuro(modellA.pachtGesamt),
      ],
      [
        `${formData.gewaehlteModell === "B" ? "▶ " : ""}B: Festpacht/MWp`,
        formatEuro(modellB.pachtzinsJahr),
        formatEuro(modellB.pachtGesamt),
      ],
      [
        `${formData.gewaehlteModell === "C" ? "▶ " : ""}C: Ertragsabhängig`,
        formatEuro(modellC.pachtzinsJahr),
        formatEuro(modellC.pachtGesamt),
      ],
      [
        `${formData.gewaehlteModell === "D" ? "▶ " : ""}D: Hybrid`,
        formatEuro(modellD.pachtzinsJahr),
        formatEuro(modellD.pachtGesamt),
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
      ["Vorhaltevergütung", `${formatEuro(vorhalteverguetung.betragJahr)} / Jahr (vor Inbetriebnahme)`],
      ["Speichervergütung", speicher.speicherflaecheM2 > 0 ? `${formatEuro(speicher.verguetungJahr)} / Jahr (${speicher.speicherflaecheM2} m² × ${speicher.satzProM2} €)` : "Kein Speicher geplant"],
      ["Rückbaubürgschaft", `${formatEuro(rueckbau.buergschaftBetrag)} (${rueckbau.leistungKw} kW × ${rueckbau.satzProKw} €/kW)`],
    ],
  });

  // Fair-Score Bewertung (wenn vorhanden)
  if (ergebnis.fairScore) {
    const fs = ergebnis.fairScore;
    sections.push({ type: "spacing", size: 150 });
    sections.push({ type: "heading", text: `Standort-Bewertung (Fair-Score: ${fs.score}/100)` });

    // Faktor-Tabelle
    sections.push({
      type: "table",
      headers: ["Faktor", "Wert", "Anpassung"],
      rows: fs.faktoren.map((f) => [
        f.name,
        f.wert,
        `${f.anpassung >= 0 ? "+" : ""}${f.anpassung}%`,
      ]),
    });

    // Fair-Preis Zusammenfassung
    if (gewaehltes.fairPachtzinsJahr) {
      sections.push({ type: "spacing", size: 100 });
      sections.push({
        type: "highlight",
        label: `FAIRER PACHTPREIS (Anpassung: ${fs.gesamtAnpassung >= 0 ? "+" : ""}${fs.gesamtAnpassung}%)`,
        mainText: `${formatEuro(gewaehltes.fairPachtzinsJahr)} / Jahr`,
        subText: `Basis: ${formatEuro(gewaehltes.pachtzinsJahr)} × Faktor ${fs.multiplikator.toFixed(2)} | Gesamtlaufzeit: ${formatEuro(gewaehltes.fairPachtGesamt)}`,
      });
    }
  }

  // Staffeltabelle (nur Modell A)
  if (formData.gewaehlteModell === "A") {
    sections.push({ type: "spacing", size: 150 });
    sections.push({ type: "heading", text: "Staffelvergütung Modell A" });
    sections.push({
      type: "table",
      headers: ["Zeitraum", "Satz €/ha/Jahr", "Pacht/Jahr"],
      rows: [
        ["Betriebsjahr 1–10", formatEuro(parseFloat(formData.staffel1) || 3300), formatEuro((parseFloat(formData.pachtflaecheHa) || 0) * (parseFloat(formData.staffel1) || 3300))],
        ["Betriebsjahr 11–20", formatEuro(parseFloat(formData.staffel2) || 3400), formatEuro((parseFloat(formData.pachtflaecheHa) || 0) * (parseFloat(formData.staffel2) || 3400))],
        ["Betriebsjahr 21+", formatEuro(parseFloat(formData.staffel3) || 3500), formatEuro((parseFloat(formData.pachtflaecheHa) || 0) * (parseFloat(formData.staffel3) || 3500))],
      ],
    });
  }

  await generateDocx({
    title: "PREISBLATT FREIFLÄCHE",
    subtitle: `PV-Freiflächenanlage | ${name} | Elite PV GmbH`,
    sections,
    fileName: `Preisblatt_Freiflaeche_${(name || "Kunde").replace(/[\s,]+/g, "_")}_Elite_PV.docx`,
  });
}

// ============================================================
// VERTRAG EXPORT
// ============================================================
export async function generateFreiflaecheVertragDocx(formData, ergebnis, klauseln) {
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
            text: "GESTATTUNGSVERTRAG",
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
            text: "über Freiflächen zur Errichtung und zum Betrieb",
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
    ["Eigentümer", name],
    ["Adresse", platzhalterDaten.eigentuemerAdresse],
  ];
  if (eig.vertretenDurch) {
    parteiEntries.push(["Vertreten durch", eig.vertretenDurch]);
  }
  const alleineig = eig.eigentumsart === "Alleineigentümer";
  const miteig = eig.eigentumsart === "Miteigentümer";
  const sonstiges = !alleineig && !miteig;
  parteiEntries.push([
    "Eigentumsverhältnis",
    `${alleineig ? "☒" : "☐"} Alleineigentümer   ${miteig ? "☒" : "☐"} Miteigentümer   ${sonstiges ? "☒" : "☐"} Sonstiges (${eig.typ || "–"})`,
  ]);
  parteiEntries.push(["", ""]);
  parteiEntries.push(["Betreiberin", "Elite PV GmbH"]);
  parteiEntries.push(["Adresse", "Lindenhof 4b, 92670 Windischeschenbach"]);
  parteiEntries.push(["Geschäftsführer", "Levin Schober"]);
  sections.push({ type: "keyValue", entries: parteiEntries });
  sections.push({ type: "spacing", size: 200 });

  // Vertragsobjekt
  sections.push({ type: "heading", text: "Vertragsobjekt" });
  sections.push({
    type: "keyValue",
    entries: [
      ["Grundstücksadresse", formData.grundstueckAdresse || "–"],
      ["Gesamtfläche", `${formData.gesamtflaecheHa || 0} ha`],
      ["Pachtfläche", `${formData.pachtflaecheHa || 0} ha`],
      ["PV-Leistung", `ca. ${ergebnis.leistungMwp || 0} MWp (${(ergebnis.leistungMwp || 0) * 1000} kWp)`],
      ["Nutzungsart", formData.nutzungsart || "–"],
      ["Speicher", formData.speicherflaecheM2 > 0 ? `${formData.speicherflaecheM2} m² Grundfläche` : "Nach Detailplanung"],
      ["Agri-PV", formData.agriPv ? "Ja" : "Nein"],
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

  // Vorhaltevergütung + Speicher + Rückbau
  sections.push({
    type: "keyValue",
    entries: [
      ["Vorhaltevergütung", `${formatEuro(ergebnis.vorhalteverguetung.betragJahr)} / Jahr`],
      ["Speichervergütung", ergebnis.speicher.speicherflaecheM2 > 0 ? `${formatEuro(ergebnis.speicher.verguetungJahr)} / Jahr` : "–"],
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
      "Anlage 1 – Lageplan mit Planungsgebiet",
      "Anlage 2 – Einverständniserklärung Pächter",
      "Anlage 3 – Vollmacht Grundbuchauszug",
      "Anlage 4 – Grundbuchauszug",
      "Anlage 5 – Einverständniserklärung Netzanfrage",
      "Anlage 6 – Vollmacht Altlastenkataster",
      "Anlage 7 – Muster Dienstbarkeit",
      "Anlage 8 – Beteiligungsmodell (Erbschaftsteuer)",
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
    title: "GESTATTUNGSVERTRAG FREIFLÄCHE",
    subtitle: `${name} | Elite PV GmbH`,
    sections: [
      ...sections,
      { type: "paragraphs", items: anlagenParagraphs },
      { type: "paragraphs", items: [standParagraph] },
    ],
    klauseln: ersetzte,
    signatureParties: ["Elite PV GmbH (Betreiberin)", `${name} (Eigentümer)`],
    fileName: `Gestattungsvertrag_Freiflaeche_${(name || "Kunde").replace(/[\s,]+/g, "_")}_Elite_PV.docx`,
  });
}
