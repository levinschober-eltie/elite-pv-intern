// ============================================================
// BESS – Kalkulation (3 Modelle)
// Basis: Enerpeak Referenzvertrag (Flächennutzungsvertrag BESS)
// ============================================================

const rund2 = (v) => Math.round(v * 100) / 100;

// ============================================================
// MODELL A: Festpacht pro m² (Enerpeak-Modell)
// Referenz: Enerpeak §5 – €/m², +10% ab BJ 11, 50% Vorhaltung
// ============================================================
function berechneModellA(params) {
  const {
    bessFlaecheM2,
    satzProM2 = 4,
    steigerungProzent = 10,
    laufzeitJahre = 20,
  } = params;

  const pachtzinsJahr = rund2(bessFlaecheM2 * satzProM2);
  const jahresWerte = [];
  let gesamtPacht = 0;

  for (let j = 1; j <= laufzeitJahre; j++) {
    const steigerung = j > 10 ? 1 + steigerungProzent / 100 : 1;
    const jahresPacht = rund2(pachtzinsJahr * steigerung);
    gesamtPacht += jahresPacht;
    jahresWerte.push({ jahr: j, betrag: jahresPacht });
  }

  return {
    modell: "Festpacht pro m\u00B2",
    modellKey: "A",
    pachtzinsJahr,
    pachtzinsMonat: rund2(pachtzinsJahr / 12),
    pachtGesamt: rund2(gesamtPacht),
    satzProM2,
    steigerungProzent,
    jahresWerte,
  };
}

// ============================================================
// MODELL B: Festpacht pro MWh Kapazität
// ============================================================
function berechneModellB(params) {
  const {
    kapazitaetMwh,
    satzProMwh = 1500,
    steigerungProzent = 10,
    laufzeitJahre = 20,
  } = params;

  const pachtzinsJahr = rund2(kapazitaetMwh * satzProMwh);
  const jahresWerte = [];
  let gesamtPacht = 0;

  for (let j = 1; j <= laufzeitJahre; j++) {
    const steigerung = j > 10 ? 1 + steigerungProzent / 100 : 1;
    const jahresPacht = rund2(pachtzinsJahr * steigerung);
    gesamtPacht += jahresPacht;
    jahresWerte.push({ jahr: j, betrag: jahresPacht });
  }

  return {
    modell: "Festpacht pro MWh",
    modellKey: "B",
    pachtzinsJahr,
    pachtzinsMonat: rund2(pachtzinsJahr / 12),
    pachtGesamt: rund2(gesamtPacht),
    satzProMwh,
    kapazitaetMwh,
    steigerungProzent,
    jahresWerte,
  };
}

// ============================================================
// MODELL C: Hybrid (Mindestpacht/m² + Kapazitätszuschlag/MWh)
// ============================================================
function berechneModellC(params) {
  const {
    bessFlaecheM2,
    kapazitaetMwh,
    mindestProM2 = 2.5,
    zuschlagProMwh = 800,
    steigerungProzent = 10,
    laufzeitJahre = 20,
  } = params;

  const mindestpacht = rund2(bessFlaecheM2 * mindestProM2);
  const kapazitaetsZuschlag = rund2(kapazitaetMwh * zuschlagProMwh);
  const pachtzinsJahr = rund2(mindestpacht + kapazitaetsZuschlag);

  const jahresWerte = [];
  let gesamtPacht = 0;

  for (let j = 1; j <= laufzeitJahre; j++) {
    const steigerung = j > 10 ? 1 + steigerungProzent / 100 : 1;
    const jahresPacht = rund2(pachtzinsJahr * steigerung);
    gesamtPacht += jahresPacht;
    jahresWerte.push({ jahr: j, betrag: jahresPacht });
  }

  return {
    modell: "Hybrid (Fl\u00E4che + Kapazit\u00E4t)",
    modellKey: "C",
    pachtzinsJahr,
    pachtzinsMonat: rund2(pachtzinsJahr / 12),
    pachtGesamt: rund2(gesamtPacht),
    mindestpacht,
    mindestProM2,
    kapazitaetsZuschlag,
    zuschlagProMwh,
    steigerungProzent,
    jahresWerte,
  };
}

// ============================================================
// VORHALTEVERGÜTUNG (50% des Nutzungsentgelts vor IBN)
// Referenz: Enerpeak §5 Abs. 3
// ============================================================
export function berechneVorhalteverguetung(pachtzinsJahr, prozent = 50) {
  const betragJahr = rund2(pachtzinsJahr * (prozent / 100));
  return {
    betragJahr,
    betragMonat: rund2(betragJahr / 12),
    prozent,
    hinweis: "F\u00E4llig ab Bereitstellung bis Inbetriebnahme (Enerpeak \u00A75 Abs. 3)",
  };
}

// ============================================================
// RÜCKBAUBÜRGSCHAFT (Enerpeak §9 Abs. 5)
// ============================================================
export function berechneRueckbaubuergschaft(kapazitaetKwh, satzProKwh = 8) {
  return {
    kapazitaetKwh,
    satzProKwh,
    buergschaftBetrag: rund2(kapazitaetKwh * satzProKwh),
  };
}

// ============================================================
// NETZANSCHLUSS-EBENEN
// ============================================================
export const NETZANSCHLUSS_EBENEN = [
  "Mittelspannung",
  "Hochspannung",
  "H\u00F6chstspannung",
];

export const BESS_TECHNOLOGIEN = [
  "Lithium-Ionen (LFP)",
  "Lithium-Ionen (NMC)",
  "Natrium-Ionen",
  "Redox-Flow (Vanadium)",
  "Sonstige",
];

export const BESS_ANWENDUNGEN = [
  "Arbitrage / Stromhandel",
  "Regelenergie (FCR/aFRR)",
  "Peak Shaving",
  "PV-Hybrid (Speicher + Solar)",
  "Netzdienstleistungen",
  "Kombination",
];

// ============================================================
// MASTER-FUNKTION: Alle 3 Modelle berechnen
// ============================================================
export function berechneBESS(formData) {
  const bessFlaecheM2 = parseFloat(formData.bessFlaecheM2) || 0;
  const kapazitaetMwh = parseFloat(formData.kapazitaetMwh) || 0;
  const leistungMw = parseFloat(formData.leistungMw) || 0;
  const laufzeitJahre = parseInt(formData.laufzeitJahre) || 20;
  const steigerungProzent = parseFloat(formData.steigerungProzent) || 10;

  const modellA = berechneModellA({
    bessFlaecheM2,
    satzProM2: parseFloat(formData.satzProM2) || 4,
    steigerungProzent,
    laufzeitJahre,
  });

  const modellB = berechneModellB({
    kapazitaetMwh,
    satzProMwh: parseFloat(formData.satzProMwh) || 1500,
    steigerungProzent,
    laufzeitJahre,
  });

  const modellC = berechneModellC({
    bessFlaecheM2,
    kapazitaetMwh,
    mindestProM2: parseFloat(formData.mindestProM2) || 2.5,
    zuschlagProMwh: parseFloat(formData.zuschlagProMwh) || 800,
    steigerungProzent,
    laufzeitJahre,
  });

  const gewaehltes = { A: modellA, B: modellB, C: modellC }[formData.gewaehlteModell || "A"];
  const vorhalteverguetung = berechneVorhalteverguetung(
    gewaehltes.pachtzinsJahr,
    parseFloat(formData.vorhalteProzent) || 50
  );

  const rueckbau = berechneRueckbaubuergschaft(
    kapazitaetMwh * 1000,
    parseFloat(formData.rueckbauSatzKwh) || 8
  );

  return {
    modellA,
    modellB,
    modellC,
    vorhalteverguetung,
    rueckbau,
    bessFlaecheM2,
    kapazitaetMwh,
    leistungMw,
    laufzeitJahre,
  };
}
