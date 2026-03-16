// ============================================================
// FORMATIERUNG – EUR, Prozent, Datum, Fläche
// ============================================================

export const formatEuro = (value) =>
  Number(value).toLocaleString("de-DE", { style: "currency", currency: "EUR" });

export const formatProzent = (value) =>
  (Number(value) * 100).toFixed(1) + "%";

export const formatDatum = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export const formatFlaeche = (value, einheit = "m²") =>
  Number(value).toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + " " + einheit;

export const formatZahl = (value, dezimal = 0) =>
  Number(value).toLocaleString("de-DE", { minimumFractionDigits: dezimal, maximumFractionDigits: dezimal });

export const zahlInWort = (betrag) =>
  Math.floor(betrag).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
