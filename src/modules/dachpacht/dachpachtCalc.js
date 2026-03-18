// ============================================================
// DACHPACHT – Kalkulation (3 Modelle)
// ============================================================

import { safeParseFloat, safeParseInt } from "../../lib/formatters";

const rund2 = (v) => Math.round(v * 100) / 100;

// kWp-Faktoren pro m² nach Dachtyp
export const DACHTYP_FAKTOREN = {
  Flachdach:          10,   // 1 kWp pro 10 m²
  "Satteldach Süd":   6,   // 1 kWp pro 6 m²
  "Satteldach SO/SW": 7,   // 1 kWp pro 7 m²
  "Satteldach O/W":   8,   // 1 kWp pro 8 m²
  Pultdach:            7,   // 1 kWp pro 7 m²
};

export const DACHTYPEN = Object.keys(DACHTYP_FAKTOREN);

export const DACH_MATERIALIEN = [
  "Trapezblech",
  "Ziegel",
  "Bitumen",
  "Beton",
  "Sonstige",
];

export const STATIK_OPTIONEN = ["Geprüft", "Ausstehend", "Nicht erforderlich"];

export const GEBAEUDE_TYPEN = ["Wohngebäude", "Gewerbe", "Industrie", "Landwirtschaft"];

export const AUSRICHTUNGEN = ["Süd", "Süd-Ost", "Süd-West", "Ost", "West", "Nord"];

// kWp aus Fläche berechnen
export function berechneKwpAusFlaeche(nutzbarM2, dachtyp) {
  const faktor = DACHTYP_FAKTOREN[dachtyp] || 8;
  return nutzbarM2 / faktor;
}

// ============================================================
// MODELL 1: Festpacht pro kWp
// ============================================================
function berechneModell1(params) {
  const {
    leistungKwp,
    satzProKwp = 30,
    preisanpassungProzent = 1.5,
    laufzeitJahre = 20,
  } = params;

  const pachtzinsJahr = rund2(leistungKwp * satzProKwp);
  const pachtzinsMonat = rund2(pachtzinsJahr / 12);

  // Laufzeit-Summe mit Preisanpassung
  let summe20 = 0;
  const jahresWerte = [];
  for (let j = 0; j < laufzeitJahre; j++) {
    const faktor = Math.pow(1 + preisanpassungProzent / 100, j);
    const jahresPacht = rund2(pachtzinsJahr * faktor);
    summe20 += jahresPacht;
    jahresWerte.push({ jahr: j + 1, betrag: jahresPacht });
  }

  return {
    modell: "Festpacht pro kWp",
    modellNr: 1,
    pachtzinsJahr,
    pachtzinsMonat,
    pachtzins20Jahre: rund2(summe20),
    satzProKwp,
    preisanpassungProzent,
    jahresWerte,
  };
}

// ============================================================
// MODELL 2: Ertragsabhängige Pacht
// ============================================================
function berechneModell2(params) {
  const {
    leistungKwp,
    spezifischerErtrag = 950,
    strompreisCentKwh = 8,
    prozentsatz = 5,
    preisanpassungProzent = 1.5,
    laufzeitJahre = 20,
  } = params;

  const jahresertragKwh = rund2(leistungKwp * spezifischerErtrag);
  const pachtzinsJahr = rund2(jahresertragKwh * (strompreisCentKwh / 100) * (prozentsatz / 100));
  const pachtzinsMonat = rund2(pachtzinsJahr / 12);

  let summe20 = 0;
  const jahresWerte = [];
  for (let j = 0; j < laufzeitJahre; j++) {
    const faktor = Math.pow(1 + preisanpassungProzent / 100, j);
    const jahresPacht = rund2(pachtzinsJahr * faktor);
    summe20 += jahresPacht;
    jahresWerte.push({ jahr: j + 1, betrag: jahresPacht });
  }

  return {
    modell: "Ertragsabhängige Pacht",
    modellNr: 2,
    pachtzinsJahr,
    pachtzinsMonat,
    pachtzins20Jahre: rund2(summe20),
    jahresertragKwh,
    strompreisCentKwh,
    prozentsatz,
    spezifischerErtrag,
    preisanpassungProzent,
    jahresWerte,
  };
}

// ============================================================
// MODELL 3: Festpacht pro m²
// ============================================================
function berechneModell3(params) {
  const {
    nutzbareDachflaeche,
    satzProM2 = 5,
    preisanpassungProzent = 1.5,
    laufzeitJahre = 20,
  } = params;

  const pachtzinsJahr = rund2(nutzbareDachflaeche * satzProM2);
  const pachtzinsMonat = rund2(pachtzinsJahr / 12);

  let summe20 = 0;
  const jahresWerte = [];
  for (let j = 0; j < laufzeitJahre; j++) {
    const faktor = Math.pow(1 + preisanpassungProzent / 100, j);
    const jahresPacht = rund2(pachtzinsJahr * faktor);
    summe20 += jahresPacht;
    jahresWerte.push({ jahr: j + 1, betrag: jahresPacht });
  }

  return {
    modell: "Festpacht pro m²",
    modellNr: 3,
    pachtzinsJahr,
    pachtzinsMonat,
    pachtzins20Jahre: rund2(summe20),
    satzProM2,
    nutzbareDachflaeche,
    preisanpassungProzent,
    jahresWerte,
  };
}

// ============================================================
// MASTER-FUNKTION: Alle 3 Modelle berechnen
// ============================================================
export function berechneDachpacht(formData) {
  const nutzbar = safeParseFloat(formData.nutzbareDachflaeche, 0);
  const dachtyp = formData.dachtyp || "Satteldach Süd";
  const kwpAusFleache = berechneKwpAusFlaeche(nutzbar, dachtyp);
  const leistungKwp = safeParseFloat(formData.leistungKwp, kwpAusFleache);
  const laufzeitJahre = safeParseInt(formData.laufzeitJahre, 20);

  const modell1 = berechneModell1({
    leistungKwp,
    satzProKwp: safeParseFloat(formData.satzProKwp, 30),
    preisanpassungProzent: safeParseFloat(formData.preisanpassung1, 1.5),
    laufzeitJahre,
  });

  const modell2 = berechneModell2({
    leistungKwp,
    spezifischerErtrag: safeParseFloat(formData.spezifischerErtrag, 950),
    strompreisCentKwh: safeParseFloat(formData.strompreisCentKwh, 8),
    prozentsatz: safeParseFloat(formData.ertragsProzentsatz, 5),
    preisanpassungProzent: safeParseFloat(formData.preisanpassung2, 1.5),
    laufzeitJahre,
  });

  const modell3 = berechneModell3({
    nutzbareDachflaeche: nutzbar,
    satzProM2: safeParseFloat(formData.satzProM2, 5),
    preisanpassungProzent: safeParseFloat(formData.preisanpassung3, 1.5),
    laufzeitJahre,
  });

  return {
    modell1,
    modell2,
    modell3,
    leistungKwp,
    kwpAusFleache,
    nutzbareDachflaeche: nutzbar,
    laufzeitJahre,
    dachtyp,
  };
}
