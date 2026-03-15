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
  const pachtzinsJahr = Math.max(mindestpacht, mindestpacht + erloesAnteil);

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

  return {
    modellA,
    modellB,
    modellC,
    modellD,
    vorhalteverguetung,
    speicher,
    rueckbau,
    pachtflaecheHa,
    gesamtflaecheHa,
    leistungMwp,
    laufzeitJahre,
  };
}
