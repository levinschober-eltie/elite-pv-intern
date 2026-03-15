// ============================================================
// VALIDIERUNG – Clamp, Warnungen, Regeln
// ============================================================

export const VALIDIERUNG = {
  leistungKwp:           { min: 0,   max: 99999, label: "kWp" },
  modulAnzahl:           { min: 0,   max: 99999, label: "Module" },
  wechselrichterAnzahl:  { min: 1,   max: 999,   label: "Wechselrichter" },
  flaechenAnzahl:        { min: 1,   max: 99,    label: "Flächen" },
  unterverteilungen:     { min: 1,   max: 99,    label: "Unterverteilungen" },
  anlagenalter:          { min: 0,   max: 99,    label: "Alter" },
  entfernungKm:          { min: 0,   max: 999,   label: "Entfernung" },
  wartungenProJahr:      { min: 1,   max: 12,    label: "Wartungen/Jahr" },
  erstlaufzeitMonate:    { min: 1,   max: 120,   label: "Erstlaufzeit" },
  preisanpassungProzent: { min: 0,   max: 10,    label: "Preisanpassung" },
  rabattProzent:         { min: 0,   max: 50,    label: "Rabatt" },
};

export function clampValue(key, value) {
  const regel = VALIDIERUNG[key];
  if (!regel) return value;
  if (value === "" || value === undefined) return "";
  const num = Number(value);
  if (isNaN(num)) return regel.min;
  return Math.max(regel.min, Math.min(regel.max, num));
}

export function getWarnung(formData) {
  const warnungen = [];
  if (formData.kundentyp === "Privat" && formData.leistungKwp > 100) {
    warnungen.push("kWp > 100 für Privatkunde – Kundentyp prüfen");
  }
  if (formData.kundentyp === "Privat" && formData.leistungKwp > 500) {
    warnungen.push("kWp > 500 für Privatkunde ungewöhnlich");
  }
  if (formData.entfernungKm > 200) {
    warnungen.push("Entfernung > 200 km – Fahrtkosten prüfen");
  }
  if (formData.rabattProzent > 20) {
    warnungen.push("Rabatt > 20% – Freigabe erforderlich?");
  }
  return warnungen;
}
