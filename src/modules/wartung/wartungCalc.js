// ============================================================
// WARTUNG – Preiskonfiguration & Kalkulation
// ============================================================

export const PRICING = {
  Privat:    { basispreis: 189, freiKwp: 15,  kwpFaktor: 2.5 },
  Gewerbe:   { basispreis: 390, freiKwp: 50,  kwpFaktor: 1.8 },
  Industrie: { basispreis: 690, freiKwp: 250, kwpFaktor: 1.2 },
};

export const ZUGANGS_FAKTOREN = {
  Einfach: 1,
  Mittel: 1.15,
  Schwierig: 1.35,
};

export const MONTAGE_FAKTOREN = {
  "Aufdach / Fassade": 1,
  "Freifläche / Carport": 0.95,
};

export function berechneWartung(formData) {
  const preise = PRICING[formData.kundentyp] || PRICING.Gewerbe;

  // Zuschläge
  const kwpZuschlag = Math.max(0, (formData.leistungKwp - preise.freiKwp) * preise.kwpFaktor);
  const wrZuschlag = Math.max(0, (formData.wechselrichterAnzahl - 1) * 45);
  const flaechenZuschlag = Math.max(0, (formData.flaechenAnzahl - 1) * 35);
  const uvZuschlag = Math.max(0, (formData.unterverteilungen - 1) * 25);
  const speicherZuschlag = formData.hatSpeicher ? 55 : 0;

  // Technikpreis (Basis + Zuschläge × Faktoren)
  const zwischensumme =
    preise.basispreis + kwpZuschlag + wrZuschlag + flaechenZuschlag + uvZuschlag + speicherZuschlag;
  const montageFaktor = MONTAGE_FAKTOREN[formData.montageart] || 1;
  const zugangsFaktor = ZUGANGS_FAKTOREN[formData.zugang] || 1;
  const altersFaktor = formData.anlagenalter > 10 ? 1.15 : formData.anlagenalter > 5 ? 1.05 : 1;
  const technikpreis = zwischensumme * montageFaktor * zugangsFaktor * altersFaktor;

  // Fahrtkosten: (km - 35 Frei-km) × 2.40 €/km
  const fahrtkosten = Math.max(0, (formData.entfernungKm - 35)) * 2 * 1.2;

  // Pro Termin
  const preisProTermin = technikpreis + fahrtkosten;

  // Jahresentgelt
  const jahresTerminkosten = preisProTermin * formData.wartungenProJahr;
  const monitoringKosten = formData.hatMonitoring ? 120 : 0;
  const thermografieKosten = formData.hatThermografie ? 180 : 0;
  const slaKosten = formData.hatSLA ? 240 : 0;
  const jahresEntgeltVorRabatt =
    jahresTerminkosten + monitoringKosten + thermografieKosten + slaKosten;

  // Rabatt-Staffelung nach Laufzeit
  const rabatt =
    formData.erstlaufzeitMonate >= 60
      ? formData.rabattAnteil
      : formData.erstlaufzeitMonate >= 36
      ? formData.rabattAnteil / 2
      : 0;

  const jahresEntgeltNetto = jahresEntgeltVorRabatt * (1 - rabatt);

  return {
    jahresEntgeltNetto,
    monatsEntgeltNetto: jahresEntgeltNetto / 12,
    jahresEntgeltBrutto: jahresEntgeltNetto * 1.19,
    monatsEntgeltBrutto: (jahresEntgeltNetto / 12) * 1.19,
    rabatt,
    preisProTermin,
    technikpreis,
    fahrtkosten,
    kwpZuschlag,
    wrZuschlag,
    flaechenZuschlag,
    uvZuschlag,
    speicherZuschlag,
    monitoringKosten,
    thermografieKosten,
    slaKosten,
    jahresEntgeltVorRabatt,
    basispreis: preise.basispreis,
  };
}
