// ============================================================
// BESS – Kalkulation (3 Modelle A–C)
// Basis: Enerpeak BESS-Vorlage (Flächennutzungsvertrag)
// ============================================================

// ============================================================
// MODELL A: Festpacht pro m² BESS-Fläche
// Referenz: Enerpeak §5 – [...] €/m²
// ============================================================
function berechneModellA(params) {
  const {
    bessFlaecheM2,
    satzProM2 = 8,
    wertsicherungProzent = 10,
    laufzeitJahre = 20,
  } = params;

  const pachtzinsJahr = bessFlaecheM2 * satzProM2;
  const jahresWerte = [];
  let gesamtPacht = 0;

  for (let j = 1; j <= laufzeitJahre; j++) {
    // Wertsicherung: +10% nach jeweils 10 vollen Jahren (Enerpeak §5.2)
    const wertsicherungsFaktor = Math.floor((j - 1) / 10);
    const faktor = Math.pow(1 + wertsicherungProzent / 100, wertsicherungsFaktor);
    const jahresPacht = pachtzinsJahr * faktor;
    gesamtPacht += jahresPacht;
    jahresWerte.push({ jahr: j, betrag: jahresPacht, faktor });
  }

  return {
    modell: "Festpacht pro m²",
    modellKey: "A",
    pachtzinsJahr,
    pachtzinsMonat: pachtzinsJahr / 12,
    pachtGesamt: gesamtPacht,
    satzProM2,
    bessFlaecheM2,
    wertsicherungProzent,
    jahresWerte,
  };
}

// ============================================================
// MODELL B: Festpacht pro MW Leistung
// ============================================================
function berechneModellB(params) {
  const {
    leistungMw,
    satzProMw = 15000,
    wertsicherungProzent = 10,
    laufzeitJahre = 20,
  } = params;

  const pachtzinsJahr = leistungMw * satzProMw;
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
    modell: "Festpacht pro MW",
    modellKey: "B",
    pachtzinsJahr,
    pachtzinsMonat: pachtzinsJahr / 12,
    pachtGesamt: gesamtPacht,
    satzProMw,
    leistungMw,
    wertsicherungProzent,
    jahresWerte,
  };
}

// ============================================================
// MODELL C: Revenue Share (% vom Umsatz)
// ============================================================
function berechneModellC(params) {
  const {
    leistungMw,
    kapazitaetMwh,
    zyklenProJahr = 300,
    strompreisEurMwh = 80,
    revenueProzent = 5,
    wertsicherungProzent = 10,
    laufzeitJahre = 20,
  } = params;

  const jahresUmsatz = kapazitaetMwh * zyklenProJahr * strompreisEurMwh;
  const pachtzinsJahr = jahresUmsatz * (revenueProzent / 100);

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
    modell: "Revenue Share",
    modellKey: "C",
    pachtzinsJahr,
    pachtzinsMonat: pachtzinsJahr / 12,
    pachtGesamt: gesamtPacht,
    jahresUmsatz,
    revenueProzent,
    zyklenProJahr,
    strompreisEurMwh,
    wertsicherungProzent,
    jahresWerte,
  };
}

// ============================================================
// VORHALTEVERGÜTUNG (vor Inbetriebnahme)
// ============================================================
export function berechneVorhalteverguetung(pachtzinsJahr = 0, prozentVorhalt = 50) {
  // Enerpeak §5.3: 50% des Nutzungsentgelts vor IBN
  const betragJahr = pachtzinsJahr * (prozentVorhalt / 100);
  return {
    betragJahr,
    betragMonat: betragJahr / 12,
    prozentVorhalt,
    hinweis: "Fällig ab Bereitstellung bis Inbetriebnahme (50% des Nutzungsentgelts gem. §5.3)",
  };
}

// ============================================================
// RÜCKBAUBÜRGSCHAFT (§9 Enerpeak)
// ============================================================
export function berechneRueckbaubuergschaft(bessFlaecheM2, satzProM2 = 25) {
  return {
    bessFlaecheM2,
    satzProM2,
    buergschaftBetrag: bessFlaecheM2 * satzProM2,
  };
}

// ============================================================
// NETZANSCHLUSS-EBENEN
// ============================================================
export const NETZANSCHLUSS_EBENEN = [
  "Mittelspannung",
  "Hochspannung",
  "Höchstspannung",
];

// ============================================================
// BESS-TECHNOLOGIE
// ============================================================
export const BESS_TECHNOLOGIEN = [
  "Lithium-Ionen (NMC)",
  "Lithium-Eisenphosphat (LFP)",
  "Natrium-Ionen",
  "Redox-Flow",
  "Sonstige",
];

// ============================================================
// MASTER-FUNKTION: Alle 3 Modelle berechnen
// ============================================================
export function berechneBESS(formData) {
  const bessFlaecheM2 = Math.max(0, parseFloat(formData.bessFlaecheM2) || 0);
  const leistungMw = Math.max(0, parseFloat(formData.leistungMw) || 0);
  const kapazitaetMwh = Math.max(0, parseFloat(formData.kapazitaetMwh) || 0);
  const laufzeitJahre = Math.max(1, parseInt(formData.laufzeitJahre) || 20);

  const modellA = berechneModellA({
    bessFlaecheM2,
    satzProM2: parseFloat(formData.satzProM2) || 8,
    wertsicherungProzent: parseFloat(formData.wertsicherungProzent) || 10,
    laufzeitJahre,
  });

  const modellB = berechneModellB({
    leistungMw,
    satzProMw: parseFloat(formData.satzProMw) || 15000,
    wertsicherungProzent: parseFloat(formData.wertsicherungProzent) || 10,
    laufzeitJahre,
  });

  const modellC = berechneModellC({
    leistungMw,
    kapazitaetMwh,
    zyklenProJahr: parseInt(formData.zyklenProJahr) || 300,
    strompreisEurMwh: parseFloat(formData.strompreisEurMwh) || 80,
    revenueProzent: parseFloat(formData.revenueProzent) || 5,
    wertsicherungProzent: parseFloat(formData.wertsicherungProzent) || 10,
    laufzeitJahre,
  });

  // Vorhaltevergütung basiert auf dem gewählten Modell (50% der Jahrespacht)
  const gewaehlteModellKey = formData.gewaehlteModell || "A";
  const gewaehlteModellErgebnis = { A: modellA, B: modellB, C: modellC }[gewaehlteModellKey] || modellA;
  const vorhalteverguetung = berechneVorhalteverguetung(
    gewaehlteModellErgebnis.pachtzinsJahr,
    parseFloat(formData.vorhalteProzent) || 50
  );

  const rueckbau = berechneRueckbaubuergschaft(
    bessFlaecheM2,
    parseFloat(formData.rueckbauSatzM2) || 25
  );

  return {
    modellA,
    modellB,
    modellC,
    vorhalteverguetung,
    rueckbau,
    bessFlaecheM2,
    leistungMw,
    kapazitaetMwh,
    laufzeitJahre,
  };
}
