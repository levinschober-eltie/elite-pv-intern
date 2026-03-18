// ============================================================
// FREIFLÄCHE – Kalkulation (4 Modelle A–D)
// Basis: Vorderthürn-Vertrag (Erbengemeinschaft Schuierer)
// ============================================================

import { safeParseFloat, safeParseInt } from "../../lib/formatters";

// ============================================================
// MODELL A: Festpacht pro Hektar (mit Staffelung)
// Referenz: Vorderthürn §8 – 3.300/3.400/3.500 €/ha
// ============================================================
function berechneModellA(params) {
  const {
    pachtflaecheHa,
    staffel1 = 3300,   // €/ha Jahr 1–10
    staffel2 = 3400,   // €/ha Jahr 11–20
    staffel3 = 3500,   // €/ha Jahr 21+
    wertsicherungProzent = 10,  // +10% alle 10 Jahre
    laufzeitJahre = 20,
  } = params;

  const jahresWerte = [];
  let gesamtPacht = 0;

  for (let j = 1; j <= laufzeitJahre; j++) {
    let satzProHa;
    if (j <= 10) satzProHa = staffel1;
    else if (j <= 20) satzProHa = staffel2;
    else satzProHa = staffel3;

    // Wertsicherung: +10% nach jeweils 10 vollen Jahren
    const wertsicherungsFaktor = Math.floor((j - 1) / 10);
    const faktor = Math.pow(1 + wertsicherungProzent / 100, wertsicherungsFaktor);
    const jahresPacht = pachtflaecheHa * satzProHa * faktor;

    gesamtPacht += jahresPacht;
    jahresWerte.push({ jahr: j, betrag: jahresPacht, satzProHa, faktor });
  }

  const pachtzinsJahr1 = pachtflaecheHa * staffel1;

  return {
    modell: "Festpacht pro Hektar (Staffel)",
    modellKey: "A",
    pachtzinsJahr: pachtzinsJahr1,
    pachtzinsMonat: pachtzinsJahr1 / 12,
    pachtGesamt: gesamtPacht,
    staffel1,
    staffel2,
    staffel3,
    wertsicherungProzent,
    jahresWerte,
  };
}

// ============================================================
// MODELL B: Festpacht pro MWp
// ============================================================
function berechneModellB(params) {
  const {
    leistungMwp,
    satzProMwp = 6000,
    wertsicherungProzent = 10,
    laufzeitJahre = 20,
  } = params;

  const pachtzinsJahr = leistungMwp * satzProMwp;
  const jahresWerte = [];
  let gesamtPacht = 0;

  for (let j = 1; j <= laufzeitJahre; j++) {
    const wertsicherungsFaktor = Math.floor((j - 1) / 10);
    const faktor = Math.pow(1 + wertsicherungProzent / 100, wertsicherungsFaktor);
    const jahresPacht = pachtzinsJahr * faktor;
    gesamtPacht += jahresPacht;
    jahresWerte.push({ jahr: j, betrag: jahresPacht, faktor });
  }

  return {
    modell: "Festpacht pro MWp",
    modellKey: "B",
    pachtzinsJahr,
    pachtzinsMonat: pachtzinsJahr / 12,
    pachtGesamt: gesamtPacht,
    satzProMwp,
    leistungMwp,
    wertsicherungProzent,
    jahresWerte,
  };
}

// ============================================================
// MODELL C: Ertragsabhängige Pacht (% vom Stromerlös)
// ============================================================
function berechneModellC(params) {
  const {
    leistungMwp,
    spezifischerErtrag = 1000,  // kWh/kWp
    strompreisCentKwh = 7,
    prozentsatz = 6,
    wertsicherungProzent = 10,
    laufzeitJahre = 20,
  } = params;

  const leistungKwp = leistungMwp * 1000;
  const jahresertragKwh = leistungKwp * spezifischerErtrag;
  const stromerloes = jahresertragKwh * (strompreisCentKwh / 100);
  const pachtzinsJahr = stromerloes * (prozentsatz / 100);

  const jahresWerte = [];
  let gesamtPacht = 0;

  for (let j = 1; j <= laufzeitJahre; j++) {
    const wertsicherungsFaktor = Math.floor((j - 1) / 10);
    const faktor = Math.pow(1 + wertsicherungProzent / 100, wertsicherungsFaktor);
    const jahresPacht = pachtzinsJahr * faktor;
    gesamtPacht += jahresPacht;
    jahresWerte.push({ jahr: j, betrag: jahresPacht, faktor });
  }

  return {
    modell: "Ertragsabhängige Pacht",
    modellKey: "C",
    pachtzinsJahr,
    pachtzinsMonat: pachtzinsJahr / 12,
    pachtGesamt: gesamtPacht,
    jahresertragKwh,
    stromerloes,
    strompreisCentKwh,
    prozentsatz,
    spezifischerErtrag,
    wertsicherungProzent,
    jahresWerte,
  };
}

// ============================================================
// MODELL D: Hybrid (Mindestpacht + Erlösanteil)
// ============================================================
function berechneModellD(params) {
  const {
    pachtflaecheHa,
    leistungMwp,
    mindestpachtProHa = 2500,
    spezifischerErtrag = 1000,
    strompreisCentKwh = 7,
    erloesProzentsatz = 4,
    wertsicherungProzent = 10,
    laufzeitJahre = 20,
  } = params;

  const mindestpacht = pachtflaecheHa * mindestpachtProHa;
  const leistungKwp = leistungMwp * 1000;
  const jahresertragKwh = leistungKwp * spezifischerErtrag;
  const stromerloes = jahresertragKwh * (strompreisCentKwh / 100);
  const erloesAnteil = stromerloes * (erloesProzentsatz / 100);
  const pachtzinsJahr = mindestpacht + erloesAnteil;

  const jahresWerte = [];
  let gesamtPacht = 0;

  for (let j = 1; j <= laufzeitJahre; j++) {
    const wertsicherungsFaktor = Math.floor((j - 1) / 10);
    const faktor = Math.pow(1 + wertsicherungProzent / 100, wertsicherungsFaktor);
    const jahresPacht = pachtzinsJahr * faktor;
    gesamtPacht += jahresPacht;
    jahresWerte.push({ jahr: j, betrag: jahresPacht, faktor });
  }

  return {
    modell: "Hybrid (Mindestpacht + Erlös)",
    modellKey: "D",
    pachtzinsJahr,
    pachtzinsMonat: pachtzinsJahr / 12,
    pachtGesamt: gesamtPacht,
    mindestpacht,
    mindestpachtProHa,
    erloesAnteil,
    erloesProzentsatz,
    jahresertragKwh,
    stromerloes,
    wertsicherungProzent,
    jahresWerte,
  };
}

// ============================================================
// VORHALTEVERGÜTUNG (§8.1 Vorderthürn)
// ============================================================
export function berechneVorhalteverguetung(betragJahr = 500) {
  return {
    betragJahr,
    betragMonat: betragJahr / 12,
    hinweis: "Fällig ab Vertragsunterzeichnung bis Inbetriebnahme, jährlich zum 15.01.",
  };
}

// ============================================================
// SPEICHER-VERGÜTUNG (§8.3 Vorderthürn – Graustrom)
// ============================================================
export function berechneSpeicherVerguetung(speicherflaecheM2 = 0, satzProM2 = 5) {
  return {
    speicherflaecheM2,
    satzProM2,
    verguetungJahr: speicherflaecheM2 * satzProM2,
    verguetungMonat: (speicherflaecheM2 * satzProM2) / 12,
  };
}

// ============================================================
// RÜCKBAUBÜRGSCHAFT (§11 Vorderthürn – 15€/kW)
// ============================================================
export function berechneRueckbaubuergschaft(leistungKw, satzProKw = 15) {
  return {
    leistungKw,
    satzProKw,
    buergschaftBetrag: leistungKw * satzProKw,
  };
}

// ============================================================
// NUTZUNGSARTEN
// ============================================================
export const NUTZUNGSARTEN = [
  "Acker",
  "Grünland",
  "Brachfläche",
  "Konversionsfläche",
  "Sonstige landwirtschaftliche Fläche",
];

export const BODENKLASSEN = [
  "Hoch (>60 Bodenpunkte)",
  "Mittel (30–60 Bodenpunkte)",
  "Gering (<30 Bodenpunkte)",
];

export const NETZANSCHLUSS_EBENEN = [
  "Niederspannung",
  "Mittelspannung",
  "Hochspannung",
];

// ============================================================
// FAIRER PACHTPREIS – Standort-Bewertung
// ============================================================

export const PACHTSTATUS_OPTIONEN = [
  "Kein Pachtvertrag",
  "Pachtvertrag ablaufend",
  "Bestehender Pachtvertrag",
];

export const BEWUCHS_OPTIONEN = [
  "Kein Bewuchs",
  "Wenig (vereinzelt Büsche)",
  "Mittel (Hecken/Baumreihen)",
  "Viel (starker Baumbestand)",
];

export const NEIGUNG_RICHTUNGEN = [
  "Flach (< 3°)",
  "Süd",
  "Süd-West / Süd-Ost",
  "Ost / West",
  "Nord-West / Nord-Ost",
  "Nord",
];

export const VERMARKTUNGSARTEN = [
  "EEG-Ausschreibung",
  "PPA-Vertrag",
  "Marktprämie",
  "Sonstige Direktvermarktung",
];

export const AUSGLEICH_TYPEN = [
  "Keine Ausgleichsflächen",
  "Extensivierung",
  "Aufforstung",
  "Biotopanlage",
  "Artenschutz",
  "Sonstige Maßnahme",
];

export const PRIVILEGIERUNG_OPTIONEN = [
  "Privilegiert (§35 BauGB)",
  "B-Plan vorhanden",
  "B-Plan in Aufstellung",
  "Nicht privilegiert",
];

export const FLAECHENZUSCHNITT_OPTIONEN = [
  "Rechteckig / regelmäßig",
  "Leicht unregelmäßig",
  "Stark unregelmäßig (Zwickel/Keil)",
  "Mehrere Teilflächen",
];

export const NETZKAPAZITAET_OPTIONEN = [
  "Freie Kapazität vorhanden",
  "Kapazität wahrscheinlich ausreichend",
  "Netzprüfung ausstehend",
  "Netzausbau erforderlich",
];

export const GEMEINDE_OPTIONEN = [
  "Sehr unterstützend (aktive Förderung)",
  "Unterstützend (positiver Beschluss)",
  "Neutral / noch offen",
  "Eher ablehnend",
  "Stark ablehnend",
];

export const EIGENTUEMER_SITUATION_OPTIONEN = [
  "Einzelperson",
  "Ehepaar",
  "Erbengemeinschaft (2–3 Parteien)",
  "Erbengemeinschaft (4+ Parteien)",
  "Mehrere Flurstücke / versch. Eigentümer",
];

export const SCHUTZGEBIET_OPTIONEN = [
  "Keine Einschränkungen",
  "Landschaftsschutzgebiet",
  "Wasserschutzgebiet Zone III",
  "Wasserschutzgebiet Zone II",
  "Überschwemmungsgebiet",
  "Denkmalschutz / Sichtachsen",
  "Naturschutzgebiet (Randlage)",
  "Altlasten / Kontamination",
];

/**
 * Berechnet den Fair-Score für den Pachtpreis.
 * Jeder Faktor liefert einen Prozent-Aufschlag/-Abschlag.
 * Ergebnis: Multiplikator für den Basispachtpreis.
 */
export function berechneFairScore(bewertung) {
  const faktoren = [];

  // 1. GRZ (Grundflächenzahl)
  const grz = parseFloat(bewertung.grz) || 0;
  let grzAnpassung = 0;
  if (grz < 0.4) grzAnpassung = -5;
  else if (grz <= 0.6) grzAnpassung = 0;
  else if (grz <= 0.8) grzAnpassung = 3;
  else grzAnpassung = 5;
  faktoren.push({
    name: "GRZ (Grundflächenzahl)",
    wert: grz.toFixed(2),
    anpassung: grzAnpassung,
    erklaerung: grz < 0.4 ? "Geringe Ausnutzbarkeit" : grz > 0.8 ? "Sehr hohe Ausnutzbarkeit" : "Normale Ausnutzbarkeit",
  });

  // 2. Lagerplatz
  const lagerplatz = bewertung.lagerplatz === true;
  const lagerAnpassung = lagerplatz ? 2 : -2;
  faktoren.push({
    name: "Lagerplatz vorhanden",
    wert: lagerplatz ? "Ja" : "Nein",
    anpassung: lagerAnpassung,
    erklaerung: lagerplatz ? "Baustellenlogistik vereinfacht" : "Zusätzliche Lagerfläche nötig",
  });

  // 3. Pachtstatus
  const pachtstatus = bewertung.pachtstatus || "Kein Pachtvertrag";
  let pachtAnpassung = 0;
  if (pachtstatus === "Kein Pachtvertrag") pachtAnpassung = 3;
  else if (pachtstatus === "Pachtvertrag ablaufend") pachtAnpassung = 0;
  else pachtAnpassung = -5;
  faktoren.push({
    name: "Pachtstatus",
    wert: pachtstatus,
    anpassung: pachtAnpassung,
    erklaerung: pachtstatus === "Bestehender Pachtvertrag" ? "Kündigungsaufwand/Wartezeit" : pachtstatus === "Kein Pachtvertrag" ? "Sofort verfügbar" : "Übergang möglich",
  });

  // 4. Baum-/Buschbesatz (SAP-Reduktion)
  const bewuchs = bewertung.bewuchs || "Wenig (vereinzelt Büsche)";
  let bewuchsAnpassung = 0;
  if (bewuchs === "Kein Bewuchs") bewuchsAnpassung = 3;
  else if (bewuchs.startsWith("Wenig")) bewuchsAnpassung = 0;
  else if (bewuchs.startsWith("Mittel")) bewuchsAnpassung = -5;
  else bewuchsAnpassung = -10;
  faktoren.push({
    name: "Baum-/Buschbesatz",
    wert: bewuchs,
    anpassung: bewuchsAnpassung,
    erklaerung: bewuchsAnpassung < 0 ? "Rodungskosten + SAP-Reduktion durch Verschattung" : "Kaum Einfluss auf Ertrag",
  });

  // 5. Ausgleichsflächen (ha + Kosten/ha)
  const ausgleichHa = parseFloat(bewertung.ausgleichsflaecheHa) || 0;
  const ausgleichTyp = bewertung.ausgleichstyp || "Keine Ausgleichsflächen";
  const ausgleichKostenProHa = parseFloat(bewertung.ausgleichskostenProHa) || 0;
  const ausgleichGesamtkosten = ausgleichHa * ausgleichKostenProHa;
  let ausgleichAnpassung = 2; // Bonus wenn keine
  if (ausgleichTyp !== "Keine Ausgleichsflächen" && ausgleichHa > 0) {
    // Je höher die Gesamtkosten, desto stärker der Abzug
    // Referenz: 10.000 €/ha × 1 ha = -2%, bis max -15%
    ausgleichAnpassung = Math.max(-15, Math.round(-ausgleichGesamtkosten / 5000));
  }
  const ausgleichWertText = ausgleichTyp === "Keine Ausgleichsflächen"
    ? "Keine"
    : `${ausgleichHa} ha × ${ausgleichKostenProHa.toLocaleString("de-DE")} €/ha = ${ausgleichGesamtkosten.toLocaleString("de-DE")} € (${ausgleichTyp})`;
  faktoren.push({
    name: "Ausgleichsflächen",
    wert: ausgleichWertText,
    anpassung: ausgleichAnpassung,
    erklaerung: ausgleichAnpassung >= 0
      ? "Keine ökologischen Ausgleichsmaßnahmen nötig"
      : `Gesamtkosten ${ausgleichGesamtkosten.toLocaleString("de-DE")} € für ${ausgleichHa} ha ${ausgleichTyp}`,
  });

  // 6. Zuwegung / Aufschotterung
  const zuwegungFeldweg = parseFloat(bewertung.zuwegungFeldweg) || 0;
  const zuwegungFreiflaeche = parseFloat(bewertung.zuwegungFreiflaeche) || 0;
  // Freiflächenwege kosten ~3x so viel wie Feldwegaufschotterung
  const zuwegungGewichtet = zuwegungFeldweg + zuwegungFreiflaeche * 3;
  const zuwegungAnpassung = Math.max(-12, Math.round(-zuwegungGewichtet / 100));
  faktoren.push({
    name: "Zuwegung / Aufschotterung",
    wert: `${zuwegungFeldweg}m Feldweg + ${zuwegungFreiflaeche}m Freifläche`,
    anpassung: zuwegungAnpassung,
    erklaerung: zuwegungAnpassung === 0 ? "Gute Erreichbarkeit" : "Aufschotterungs-/Wegebaukosten",
  });

  // 7. Bauleiter-Score (1-10)
  const bauleiterScore = Math.max(1, Math.min(10, parseFloat(bewertung.bauleiterScore) || 5));
  const bauleiterAnpassung = Math.round((bauleiterScore - 5.5) * 2);
  faktoren.push({
    name: "Bauleiter-Bewertung",
    wert: `${bauleiterScore} / 10`,
    anpassung: bauleiterAnpassung,
    erklaerung: bauleiterScore >= 8 ? "Sehr gutes Gesamtbild" : bauleiterScore >= 6 ? "Ordentliches Projekt" : bauleiterScore >= 4 ? "Durchschnittlich" : "Schwieriges Projekt",
  });

  // 8. Neigung + Ausrichtung
  const neigungGrad = parseFloat(bewertung.neigungGrad) || 0;
  const neigungRichtung = bewertung.neigungRichtung || "Flach (< 3°)";
  let neigungAnpassung = 0;
  if (neigungRichtung === "Flach (< 3°)" || neigungGrad < 3) {
    neigungAnpassung = 0;
  } else if (neigungRichtung === "Süd") {
    neigungAnpassung = neigungGrad <= 15 ? 4 : 2;
  } else if (neigungRichtung === "Süd-West / Süd-Ost") {
    neigungAnpassung = neigungGrad <= 10 ? 2 : -1;
  } else if (neigungRichtung === "Ost / West") {
    neigungAnpassung = neigungGrad <= 8 ? -3 : -6;
  } else if (neigungRichtung === "Nord-West / Nord-Ost") {
    neigungAnpassung = neigungGrad <= 5 ? -6 : -10;
  } else if (neigungRichtung === "Nord") {
    neigungAnpassung = neigungGrad <= 5 ? -8 : -15;
  }
  faktoren.push({
    name: "Geländeneigung",
    wert: neigungRichtung === "Flach (< 3°)" ? "Eben" : `${neigungGrad}° Richtung ${neigungRichtung}`,
    anpassung: neigungAnpassung,
    erklaerung: neigungAnpassung > 0 ? "Südneigung verbessert Ertrag" : neigungAnpassung < -5 ? "Nordneigung reduziert Ertrag erheblich" : neigungAnpassung < 0 ? "Ungünstige Ausrichtung" : "Ebene Fläche – neutral",
  });

  // 9. Vermarktung – mehrere Tranchen möglich
  const tranchen = bewertung.vermarktungsTranchen || [];
  let gewichteterPreis = 5.5; // Fallback
  if (tranchen.length > 0) {
    const gesamtAnteil = tranchen.reduce((s, t) => s + (parseFloat(t.anteilProzent) || 0), 0);
    if (gesamtAnteil > 0) {
      gewichteterPreis = tranchen.reduce((s, t) => {
        const anteil = (parseFloat(t.anteilProzent) || 0) / gesamtAnteil;
        return s + anteil * (parseFloat(t.preisCentKwh) || 0);
      }, 0);
    }
  }
  // Referenz: 5.5 ct/kWh als EEG-Mittelwert
  const preisAnpassung = Math.max(-8, Math.min(10, Math.round((gewichteterPreis - 5.5) * 2.5)));
  const tranchenText = tranchen.length > 0
    ? tranchen.map((t) => `${t.art} ${t.anteilProzent}% @ ${t.preisCentKwh} ct${t.art === "PPA-Vertrag" && t.abnahmeMwh ? ` (${t.abnahmeMwh} MWh)` : ""}`).join(" + ")
    : "Keine Angabe";
  faktoren.push({
    name: "Vermarktungsmix",
    wert: `Ø ${gewichteterPreis.toFixed(1)} ct/kWh – ${tranchenText}`,
    anpassung: preisAnpassung,
    erklaerung: preisAnpassung > 0 ? "Überdurchschnittlicher Erlösmix" : preisAnpassung < 0 ? "Unterdurchschnittliche Erlöse" : "Durchschnittlicher Erlösmix",
  });

  // 10. Entfernung Netzverknüpfungspunkt
  const nvpEntfernung = parseFloat(bewertung.nvpEntfernungKm) || 0;
  let nvpAnpassung = 0;
  if (nvpEntfernung <= 1) nvpAnpassung = 3;
  else if (nvpEntfernung <= 3) nvpAnpassung = 0;
  else if (nvpEntfernung <= 5) nvpAnpassung = -3;
  else nvpAnpassung = Math.max(-8, Math.round(-nvpEntfernung));
  faktoren.push({
    name: "Entfernung Netzverknüpfungspunkt",
    wert: `${nvpEntfernung} km`,
    anpassung: nvpAnpassung,
    erklaerung: nvpEntfernung <= 1 ? "Kurze Kabeltrasse" : nvpEntfernung > 5 ? "Hohe Anschlusskosten" : "Normale Entfernung",
  });

  // 11. Privilegierung (§35 BauGB / B-Plan)
  const privilegierung = bewertung.privilegierung || "Nicht privilegiert";
  let privAnpassung = 0;
  if (privilegierung === "Privilegiert (§35 BauGB)") privAnpassung = 5;
  else if (privilegierung === "B-Plan vorhanden") privAnpassung = 3;
  else if (privilegierung === "B-Plan in Aufstellung") privAnpassung = -2;
  else privAnpassung = -8;
  faktoren.push({
    name: "Privilegierung / Planungsrecht",
    wert: privilegierung,
    anpassung: privAnpassung,
    erklaerung: privAnpassung >= 3 ? "Genehmigung gesichert – geringes Planungsrisiko"
      : privAnpassung >= 0 ? "B-Plan in Aufstellung – Restrisiko"
      : "Kein Baurecht – hohes Planungsrisiko und Zeitaufwand",
  });

  // 12. Flächengröße (große Fläche = Bonus, gleicher Planungsaufwand)
  const flaecheHa = parseFloat(bewertung.pachtflaecheHa) || 0;
  let flaechenAnpassung = 0;
  if (flaecheHa >= 30) flaechenAnpassung = 8;
  else if (flaecheHa >= 20) flaechenAnpassung = 6;
  else if (flaecheHa >= 10) flaechenAnpassung = 4;
  else if (flaecheHa >= 5) flaechenAnpassung = 2;
  else if (flaecheHa >= 3) flaechenAnpassung = 0;
  else if (flaecheHa >= 1) flaechenAnpassung = -4;
  else flaechenAnpassung = -8;
  faktoren.push({
    name: "Flächengröße",
    wert: flaecheHa > 0 ? `${flaecheHa} ha` : "Nicht angegeben",
    anpassung: flaechenAnpassung,
    erklaerung: flaechenAnpassung >= 4 ? "Große Fläche – Planungsaufwand verteilt sich, höhere Pacht/ha gerechtfertigt"
      : flaechenAnpassung >= 0 ? "Mittlere Fläche – normaler Aufwand"
      : "Kleine Fläche – gleicher Planungsaufwand bei weniger Ertrag",
  });

  // 13. Bodenrichtwert (€/m²)
  const bodenrichtwert = parseFloat(bewertung.bodenrichtwert) || 0;
  let bodenAnpassung = 0;
  if (bodenrichtwert > 0) {
    // Referenz: 5 €/m² = normaler Acker. Höherer Wert = Eigentümer erwartet mehr
    if (bodenrichtwert <= 2) bodenAnpassung = -3;
    else if (bodenrichtwert <= 5) bodenAnpassung = 0;
    else if (bodenrichtwert <= 10) bodenAnpassung = 3;
    else if (bodenrichtwert <= 20) bodenAnpassung = 5;
    else bodenAnpassung = 7;
  }
  faktoren.push({
    name: "Bodenrichtwert",
    wert: bodenrichtwert > 0 ? `${bodenrichtwert.toFixed(2)} €/m²` : "Nicht angegeben",
    anpassung: bodenAnpassung,
    erklaerung: bodenrichtwert > 10 ? "Hoher Bodenwert – Eigentümer erwartet hohe Pacht"
      : bodenrichtwert > 5 ? "Durchschnittlicher Bodenwert"
      : bodenrichtwert > 0 ? "Niedriger Bodenwert – moderate Pachterwartung"
      : "Kein Bodenrichtwert angegeben",
  });

  // 14. Flächenzuschnitt
  const zuschnitt = bewertung.flaechenzuschnitt || "Rechteckig / regelmäßig";
  let zuschnittAnpassung = 0;
  if (zuschnitt === "Rechteckig / regelmäßig") zuschnittAnpassung = 3;
  else if (zuschnitt === "Leicht unregelmäßig") zuschnittAnpassung = 0;
  else if (zuschnitt.startsWith("Stark")) zuschnittAnpassung = -5;
  else zuschnittAnpassung = -7; // Mehrere Teilflächen
  faktoren.push({
    name: "Flächenzuschnitt",
    wert: zuschnitt,
    anpassung: zuschnittAnpassung,
    erklaerung: zuschnittAnpassung >= 3 ? "Optimale Modulbelegung, wenig Zaun"
      : zuschnittAnpassung >= 0 ? "Akzeptabler Zuschnitt"
      : "Mehr Zaun, Randverluste, schwierigere Belegung",
  });

  // 15. Netzkapazität / Einspeisezusage
  const netzkapazitaet = bewertung.netzkapazitaet || "Netzprüfung ausstehend";
  let netzAnpassung = 0;
  if (netzkapazitaet === "Freie Kapazität vorhanden") netzAnpassung = 5;
  else if (netzkapazitaet.startsWith("Kapazität wahrscheinlich")) netzAnpassung = 2;
  else if (netzkapazitaet === "Netzprüfung ausstehend") netzAnpassung = -2;
  else netzAnpassung = -8; // Netzausbau
  faktoren.push({
    name: "Netzkapazität",
    wert: netzkapazitaet,
    anpassung: netzAnpassung,
    erklaerung: netzAnpassung >= 5 ? "Einspeisezusage erteilt – kein Netzrisiko"
      : netzAnpassung >= 0 ? "Kapazität voraussichtlich vorhanden"
      : netzAnpassung >= -2 ? "Netzprüfung noch ausstehend – Restrisiko"
      : "Netzausbau nötig – hohe Kosten und Verzögerung",
  });

  // 16. Gemeinde-Einstellung
  const gemeinde = bewertung.gemeindeEinstellung || "Neutral / noch offen";
  let gemeindeAnpassung = 0;
  if (gemeinde.startsWith("Sehr unterstützend")) gemeindeAnpassung = 5;
  else if (gemeinde.startsWith("Unterstützend")) gemeindeAnpassung = 3;
  else if (gemeinde.startsWith("Neutral")) gemeindeAnpassung = 0;
  else if (gemeinde.startsWith("Eher")) gemeindeAnpassung = -6;
  else gemeindeAnpassung = -12; // Stark ablehnend
  faktoren.push({
    name: "Gemeinde-Einstellung",
    wert: gemeinde,
    anpassung: gemeindeAnpassung,
    erklaerung: gemeindeAnpassung >= 3 ? "Gemeinde fördert PV-Projekte aktiv"
      : gemeindeAnpassung >= 0 ? "Gemeinde neutral – B-Plan-Verfahren offen"
      : "Gemeindewiderstand – Projekt gefährdet oder stark verzögert",
  });

  // 17. Eigentümer-Situation
  const eigSituation = bewertung.eigentuemerSituation || "Einzelperson";
  let eigAnpassung = 0;
  if (eigSituation === "Einzelperson") eigAnpassung = 3;
  else if (eigSituation === "Ehepaar") eigAnpassung = 2;
  else if (eigSituation.includes("2–3")) eigAnpassung = -2;
  else if (eigSituation.includes("4+")) eigAnpassung = -6;
  else eigAnpassung = -8; // Mehrere Flurstücke / versch. Eigentümer
  faktoren.push({
    name: "Eigentümer-Situation",
    wert: eigSituation,
    anpassung: eigAnpassung,
    erklaerung: eigAnpassung >= 2 ? "Einfache Verhandlung mit einer Partei"
      : eigAnpassung >= 0 ? "Überschaubare Eigentümerstruktur"
      : "Komplexe Verhandlungen mit mehreren Parteien – Risiko und Aufwand",
  });

  // 18. Schutzgebiete / Altlasten
  const schutzgebiete = bewertung.schutzgebiete || [];
  let schutzAnpassung = 0;
  if (schutzgebiete.length === 0 || (schutzgebiete.length === 1 && schutzgebiete[0] === "Keine Einschränkungen")) {
    schutzAnpassung = 2;
  } else {
    schutzgebiete.forEach((sg) => {
      if (sg === "Landschaftsschutzgebiet") schutzAnpassung -= 3;
      else if (sg === "Wasserschutzgebiet Zone III") schutzAnpassung -= 3;
      else if (sg === "Wasserschutzgebiet Zone II") schutzAnpassung -= 6;
      else if (sg === "Überschwemmungsgebiet") schutzAnpassung -= 5;
      else if (sg.startsWith("Denkmalschutz")) schutzAnpassung -= 4;
      else if (sg.startsWith("Naturschutzgebiet")) schutzAnpassung -= 7;
      else if (sg.startsWith("Altlasten")) schutzAnpassung -= 5;
    });
    schutzAnpassung = Math.max(-15, schutzAnpassung);
  }
  faktoren.push({
    name: "Schutzgebiete / Restriktionen",
    wert: schutzgebiete.length === 0 || (schutzgebiete.length === 1 && schutzgebiete[0] === "Keine Einschränkungen")
      ? "Keine Einschränkungen"
      : schutzgebiete.filter((s) => s !== "Keine Einschränkungen").join(", "),
    anpassung: schutzAnpassung,
    erklaerung: schutzAnpassung >= 0 ? "Keine relevanten Schutzgebiete oder Restriktionen"
      : "Zusätzliche Auflagen, Gutachten oder Einschränkungen zu erwarten",
  });

  // Summe berechnen
  const gesamtAnpassung = faktoren.reduce((sum, f) => sum + f.anpassung, 0);
  const gesamtAnpassungBegrenzt = Math.max(-35, Math.min(35, gesamtAnpassung));
  const multiplikator = 1 + gesamtAnpassungBegrenzt / 100;

  // Score von 0-100 (50 = neutral)
  const score = Math.max(0, Math.min(100, 50 + gesamtAnpassungBegrenzt * 1.43));

  // Sensitivitätsanalyse: sortiert nach absolutem Einfluss
  const sensitivitaet = [...faktoren]
    .sort((a, b) => Math.abs(b.anpassung) - Math.abs(a.anpassung))
    .slice(0, 5);

  // Marktvergleich (typischer Bereich 2.500–4.500 €/ha/Jahr)
  const MARKT_MIN = 2500;
  const MARKT_MAX = 4500;
  const MARKT_MITTE = (MARKT_MIN + MARKT_MAX) / 2;

  return {
    faktoren,
    gesamtAnpassung: gesamtAnpassungBegrenzt,
    gesamtAnpassungUnbegrenzt: gesamtAnpassung,
    multiplikator,
    score: Math.round(score),
    sensitivitaet,
    markt: { min: MARKT_MIN, max: MARKT_MAX, mitte: MARKT_MITTE },
  };
}

/**
 * Wendet den Fair-Score auf ein Pachtmodell-Ergebnis an.
 */
export function wendeFairScoreAn(modellErgebnis, fairScore) {
  if (!modellErgebnis || !fairScore) return modellErgebnis;
  return {
    ...modellErgebnis,
    fairPachtzinsJahr: modellErgebnis.pachtzinsJahr * fairScore.multiplikator,
    fairPachtzinsMonat: modellErgebnis.pachtzinsMonat * fairScore.multiplikator,
    fairPachtGesamt: modellErgebnis.pachtGesamt * fairScore.multiplikator,
    fairMultiplikator: fairScore.multiplikator,
    fairAnpassung: fairScore.gesamtAnpassung,
  };
}

// ============================================================
// MASTER-FUNKTION: Alle 4 Modelle berechnen
// ============================================================
export function berechneFreiflaeche(formData) {
  const pachtflaecheHa = safeParseFloat(formData.pachtflaecheHa, 0);
  const gesamtflaecheHa = safeParseFloat(formData.gesamtflaecheHa, 0);
  const leistungMwp = safeParseFloat(formData.leistungMwp, 0);
  const laufzeitJahre = safeParseInt(formData.laufzeitJahre, 20);

  const modellA = berechneModellA({
    pachtflaecheHa,
    staffel1: safeParseFloat(formData.staffel1, 3300),
    staffel2: safeParseFloat(formData.staffel2, 3400),
    staffel3: safeParseFloat(formData.staffel3, 3500),
    wertsicherungProzent: safeParseFloat(formData.wertsicherungProzent, 10),
    laufzeitJahre,
  });

  const modellB = berechneModellB({
    leistungMwp,
    satzProMwp: safeParseFloat(formData.satzProMwp, 6000),
    wertsicherungProzent: safeParseFloat(formData.wertsicherungProzent, 10),
    laufzeitJahre,
  });

  const modellC = berechneModellC({
    leistungMwp,
    spezifischerErtrag: safeParseFloat(formData.spezifischerErtrag, 1000),
    strompreisCentKwh: safeParseFloat(formData.strompreisCentKwh, 7),
    prozentsatz: safeParseFloat(formData.ertragsProzentsatz, 6),
    wertsicherungProzent: safeParseFloat(formData.wertsicherungProzent, 10),
    laufzeitJahre,
  });

  const modellD = berechneModellD({
    pachtflaecheHa,
    leistungMwp,
    mindestpachtProHa: safeParseFloat(formData.mindestpachtProHa, 2500),
    spezifischerErtrag: safeParseFloat(formData.spezifischerErtrag, 1000),
    strompreisCentKwh: safeParseFloat(formData.strompreisCentKwh, 7),
    erloesProzentsatz: safeParseFloat(formData.erloesProzentsatz, 4),
    wertsicherungProzent: safeParseFloat(formData.wertsicherungProzent, 10),
    laufzeitJahre,
  });

  const vorhalteverguetung = berechneVorhalteverguetung(
    safeParseFloat(formData.vorhalteBetrag, 500)
  );

  const speicher = berechneSpeicherVerguetung(
    safeParseFloat(formData.speicherflaecheM2, 0),
    safeParseFloat(formData.speicherSatzM2, 5)
  );

  const rueckbau = berechneRueckbaubuergschaft(
    leistungMwp * 1000,
    safeParseFloat(formData.rueckbauSatzKw, 15)
  );

  // Fair-Score berechnen wenn Bewertungsdaten vorhanden
  const fairScore = formData.bewertung ? berechneFairScore(formData.bewertung) : null;

  return {
    modellA: fairScore ? wendeFairScoreAn(modellA, fairScore) : modellA,
    modellB: fairScore ? wendeFairScoreAn(modellB, fairScore) : modellB,
    modellC: fairScore ? wendeFairScoreAn(modellC, fairScore) : modellC,
    modellD: fairScore ? wendeFairScoreAn(modellD, fairScore) : modellD,
    vorhalteverguetung,
    speicher,
    rueckbau,
    fairScore,
    pachtflaecheHa,
    gesamtflaecheHa,
    leistungMwp,
    laufzeitJahre,
  };
}
