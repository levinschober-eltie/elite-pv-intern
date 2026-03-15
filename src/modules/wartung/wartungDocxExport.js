import { generateDocx } from "../../lib/docxExport";
import { formatEuro, formatProzent } from "../../lib/formatters";

export async function generateWartungDocx(formData, ergebnis, klauseln) {
  const mitVertrag = klauseln !== null;
  const title = mitVertrag ? "WARTUNGSVERTRAG" : "PREISBLATT";
  const subtitle = "PV-Wartung | Elite PV GmbH";

  const sections = [];

  // Kundendaten
  sections.push({ type: "heading", text: "Kundendaten" });
  sections.push({
    type: "keyValue",
    entries: [
      ["Kunde", formData.kundenname || "–"],
      ["Ansprechpartner", formData.ansprechpartner || "–"],
      ["Adresse", `${formData.strasse}, ${formData.plz} ${formData.ort}`],
      ["Kundentyp", formData.kundentyp],
    ],
  });
  sections.push({ type: "spacing", size: 150 });

  // Anlagendaten
  sections.push({ type: "heading", text: "Anlagendaten" });
  sections.push({
    type: "keyValue",
    entries: [
      ["Projekt", formData.projektname || "–"],
      ["Leistung", `${formData.leistungKwp} kWp`],
      ["Module / WR", `${formData.modulAnzahl} / ${formData.wechselrichterAnzahl}`],
      ["Flächen / UV", `${formData.flaechenAnzahl} / ${formData.unterverteilungen}`],
      ["Montage", formData.montageart],
      ["Zugang", formData.zugang],
      ["Anlagenalter", `${formData.anlagenalter} Jahre`],
      ["Speicher", formData.hatSpeicher ? "Ja" : "Nein"],
      ["Entfernung", `${formData.entfernungKm} km`],
    ],
  });
  sections.push({ type: "spacing", size: 150 });

  // Kalkulation
  sections.push({ type: "heading", text: "Kalkulation" });

  const kalkRows = [
    ["Basispreis", formatEuro(ergebnis.basispreis)],
    ["kWp-Zuschlag", formatEuro(ergebnis.kwpZuschlag)],
  ];
  if (ergebnis.wrZuschlag > 0) kalkRows.push(["WR-Zuschlag", formatEuro(ergebnis.wrZuschlag)]);
  if (ergebnis.flaechenZuschlag > 0) kalkRows.push(["Flächen-Zuschlag", formatEuro(ergebnis.flaechenZuschlag)]);
  if (ergebnis.uvZuschlag > 0) kalkRows.push(["UV-Zuschlag", formatEuro(ergebnis.uvZuschlag)]);
  if (ergebnis.speicherZuschlag > 0) kalkRows.push(["Speicher", formatEuro(ergebnis.speicherZuschlag)]);
  kalkRows.push(["Technikpreis", formatEuro(ergebnis.technikpreis)]);
  kalkRows.push(["Fahrtkosten", formatEuro(ergebnis.fahrtkosten)]);
  kalkRows.push(["Pro Termin", formatEuro(ergebnis.preisProTermin)]);
  if (ergebnis.monitoringKosten > 0) kalkRows.push(["Monitoring", formatEuro(ergebnis.monitoringKosten)]);
  if (ergebnis.thermografieKosten > 0) kalkRows.push(["Thermografie", formatEuro(ergebnis.thermografieKosten)]);
  if (ergebnis.slaKosten > 0) kalkRows.push(["SLA", formatEuro(ergebnis.slaKosten)]);
  if (ergebnis.rabatt > 0) kalkRows.push(["Rabatt", formatProzent(ergebnis.rabatt)]);

  sections.push({
    type: "keyValue",
    entries: kalkRows,
  });
  sections.push({ type: "spacing", size: 150 });

  // Ergebnis-Highlight
  sections.push({
    type: "highlight",
    label: "SERVICEENTGELT",
    mainText: `${formatEuro(ergebnis.jahresEntgeltNetto)} netto/Jahr  |  ${formatEuro(ergebnis.monatsEntgeltNetto)} netto/Monat`,
    subText: `Brutto: ${formatEuro(ergebnis.jahresEntgeltBrutto)}/Jahr  |  ${formatEuro(ergebnis.monatsEntgeltBrutto)}/Monat`,
  });
  sections.push({ type: "spacing", size: 150 });

  // Vertragsdaten
  sections.push({ type: "heading", text: "Vertragsdaten" });
  sections.push({
    type: "keyValue",
    entries: [
      ["Erstlaufzeit", `${formData.erstlaufzeitMonate} Monate`],
      ["Wartungen/Jahr", `${formData.wartungenProJahr}`],
      ["Preisanpassung", `${formData.preisanpassungProzent}% p.a.`],
      ["Zahlungsweise", formData.zahlungsweise],
    ],
  });

  await generateDocx({
    title,
    subtitle,
    sections,
    klauseln: mitVertrag ? klauseln : null,
    signatureParties: mitVertrag
      ? ["Elite PV GmbH (AN)", "Auftraggeber (AG)"]
      : null,
    fileName: `${mitVertrag ? "Vertrag" : "Preisblatt"}_${
      (formData.kundenname || "Kunde").replace(/\s+/g, "_")
    }_Elite_PV.docx`,
  });
}
