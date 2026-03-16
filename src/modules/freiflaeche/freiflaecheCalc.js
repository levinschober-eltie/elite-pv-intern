// ============================================================
// FREIFLÄCHE – Kalkulation (4 Modelle A–D)
// Basis: Vorderthürn-Vertrag (Erbengemeinschaft Schuierer)
// ============================================================

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
  "Extensivierung (günstig)",
  "Aufforstung (mittel)",
  "Biotopanlage (teuer)",
  "Artenschutz (sehr teuer)",
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

  // 5. Ausgleichsflächen
  const ausgleichHa = parseFloat(bewertung.ausgleichsflaecheHa) || 0;
  const ausgleichTyp = bewertung.ausgleichstyp || "Keine Ausgleichsflächen";
  let ausgleichKostenFaktor = 0;
  if (ausgleichTyp.startsWith("Extensivierung")) ausgleichKostenFaktor = 1;
  else if (ausgleichTyp.startsWith("Aufforstung")) ausgleichKostenFaktor = 1.5;
  else if (ausgleichTyp.startsWith("Biotopanlage")) ausgleichKostenFaktor = 2;
  else if (ausgleichTyp.startsWith("Artenschutz")) ausgleichKostenFaktor = 3;
  const ausgleichAnpassung = ausgleichTyp === "Keine Ausgleichsflächen" ? 2 : Math.max(-15, Math.round(-ausgleichHa * 2 * ausgleichKostenFaktor));
  faktoren.push({
    name: "Ausgleichsflächen",
    wert: ausgleichTyp === "Keine Ausgleichsflächen" ? "Keine" : `${ausgleichHa} ha (${ausgleichTyp})`,
    anpassung: ausgleichAnpassung,
    erklaerung: ausgleichAnpassung >= 0 ? "Keine ökologischen Ausgleichsmaßnahmen nötig" : `Kosten für ${ausgleichHa} ha Ausgleich (${ausgleichTyp})`,
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

  // 9. Vermarktungsart + Preis
  const vermarktungsart = bewertung.vermarktungsart || "EEG-Ausschreibung";
  const einspeiseverguetung = parseFloat(bewertung.einspeiseverguetung) || 5.5;
  // Referenz: 5.5 ct/kWh als EEG-Mittelwert
  const preisAnpassung = Math.max(-8, Math.min(10, Math.round((einspeiseverguetung - 5.5) * 2.5)));
  faktoren.push({
    name: "Vermarktung / Einspeisevergütung",
    wert: `${vermarktungsart} – ${einspeiseverguetung} ct/kWh`,
    anpassung: preisAnpassung,
    erklaerung: preisAnpassung > 0 ? "Überdurchschnittliche Erlöse" : preisAnpassung < 0 ? "Unterdurchschnittliche Erlöse" : "Durchschnittlicher EEG-Preis",
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

  // Summe berechnen
  const gesamtAnpassung = faktoren.reduce((sum, f) => sum + f.anpassung, 0);
  const gesamtAnpassungBegrenzt = Math.max(-30, Math.min(30, gesamtAnpassung));
  const multiplikator = 1 + gesamtAnpassungBegrenzt / 100;

  // Score von 0-100 (50 = neutral)
  const score = Math.max(0, Math.min(100, 50 + gesamtAnpassungBegrenzt * 1.67));

  return {
    faktoren,
    gesamtAnpassung: gesamtAnpassungBegrenzt,
    gesamtAnpassungUnbegrenzt: gesamtAnpassung,
    multiplikator,
    score: Math.round(score),
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
  const pachtflaecheHa = parseFloat(formData.pachtflaecheHa) || 0;
  const gesamtflaecheHa = parseFloat(formData.gesamtflaecheHa) || 0;
  const leistungMwp = parseFloat(formData.leistungMwp) || 0;
  const laufzeitJahre = parseInt(formData.laufzeitJahre) || 20;

  const modellA = berechneModellA({
    pachtflaecheHa,
    staffel1: parseFloat(formData.staffel1) || 3300,
    staffel2: parseFloat(formData.staffel2) || 3400,
    staffel3: parseFloat(formData.staffel3) || 3500,
    wertsicherungProzent: parseFloat(formData.wertsicherungProzent) || 10,
    laufzeitJahre,
  });

  const modellB = berechneModellB({
    leistungMwp,
    satzProMwp: parseFloat(formData.satzProMwp) || 6000,
    wertsicherungProzent: parseFloat(formData.wertsicherungProzent) || 10,
    laufzeitJahre,
  });

  const modellC = berechneModellC({
    leistungMwp,
    spezifischerErtrag: parseFloat(formData.spezifischerErtrag) || 1000,
    strompreisCentKwh: parseFloat(formData.strompreisCentKwh) || 7,
    prozentsatz: parseFloat(formData.ertragsProzentsatz) || 6,
    wertsicherungProzent: parseFloat(formData.wertsicherungProzent) || 10,
    laufzeitJahre,
  });

  const modellD = berechneModellD({
    pachtflaecheHa,
    leistungMwp,
    mindestpachtProHa: parseFloat(formData.mindestpachtProHa) || 2500,
    spezifischerErtrag: parseFloat(formData.spezifischerErtrag) || 1000,
    strompreisCentKwh: parseFloat(formData.strompreisCentKwh) || 7,
    erloesProzentsatz: parseFloat(formData.erloesProzentsatz) || 4,
    wertsicherungProzent: parseFloat(formData.wertsicherungProzent) || 10,
    laufzeitJahre,
  });

  const vorhalteverguetung = berechneVorhalteverguetung(
    parseFloat(formData.vorhalteBetrag) || 500
  );

  const speicher = berechneSpeicherVerguetung(
    parseFloat(formData.speicherflaecheM2) || 0,
    parseFloat(formData.speicherSatzM2) || 5
  );

  const rueckbau = berechneRueckbaubuergschaft(
    leistungMwp * 1000,
    parseFloat(formData.rueckbauSatzKw) || 15
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
