// ============================================================
// FORMATIERUNG – EUR, Prozent, Datum, Fläche
// ============================================================

export const formatEuro = (value) => {
  const n = Number(value);
  if (isNaN(n) || !isFinite(n)) return "–";
  return n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
};

export const formatProzent = (value) => {
  const n = Number(value);
  if (isNaN(n) || !isFinite(n)) return "–";
  return (n * 100).toFixed(1) + "%";
};

export const formatDatum = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return "–";
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export const formatFlaeche = (value, einheit = "m²") => {
  const n = Number(value);
  if (isNaN(n) || !isFinite(n)) return "–";
  return n.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + " " + einheit;
};

export const formatZahl = (value, dezimal = 0) => {
  const n = Number(value);
  if (isNaN(n) || !isFinite(n)) return "–";
  return n.toLocaleString("de-DE", { minimumFractionDigits: dezimal, maximumFractionDigits: dezimal });
};

export const zahlInWort = (betrag) => {
  const n = Number(betrag);
  if (isNaN(n) || !isFinite(n)) return "–";
  return n.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
