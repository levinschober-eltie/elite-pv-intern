// ============================================================
// FORMATIERUNG – EUR, Prozent, Datum, Fläche
// ============================================================

/** Sicheres parseFloat: gibt fallback zurück bei NaN/null/undefined/leer, aber 0 bleibt 0 */
export function safeParseFloat(value, fallback = 0) {
  if (value === null || value === undefined || value === "") return fallback;
  const num = parseFloat(value);
  return Number.isFinite(num) ? num : fallback;
}

/** Sicheres parseInt: gibt fallback zurück bei NaN/null/undefined/leer, aber 0 bleibt 0 */
export function safeParseInt(value, fallback = 0) {
  if (value === null || value === undefined || value === "") return fallback;
  const num = parseInt(value, 10);
  return Number.isFinite(num) ? num : fallback;
}

export const formatEuro = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0,00 €";
  return num.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
};

export const formatProzent = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0,0%";
  return (num * 100).toFixed(1) + "%";
};

export const formatDatum = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export const formatFlaeche = (value, einheit = "m²") => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0 " + einheit;
  return num.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + " " + einheit;
};

export const formatZahl = (value, dezimal = 0) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0";
  return num.toLocaleString("de-DE", { minimumFractionDigits: dezimal, maximumFractionDigits: dezimal });
};

export const zahlInWort = (betrag) => {
  const num = Number(betrag);
  if (!Number.isFinite(num)) return "0,00";
  return num.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
